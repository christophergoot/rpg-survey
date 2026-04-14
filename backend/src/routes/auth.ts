import { Router } from "express";
import { randomUUID } from "crypto";
import { pool } from "../db/pool";
import { hashPassword, comparePassword } from "../utils/hash";
import { signToken } from "../utils/jwt";
import { requireAuth } from "../middleware/auth";

const router = Router();

// POST /auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password, display_name } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const existing = await pool.query(
      "SELECT id FROM gm_profiles WHERE email = $1",
      [email],
    );
    if (existing.rows.length > 0) {
      res.status(409).json({ error: "Email already in use" });
      return;
    }

    const id = randomUUID();
    const passwordHash = await hashPassword(password);
    const displayName =
      (display_name as string | undefined) || (email as string).split("@")[0];

    await pool.query(
      "INSERT INTO gm_profiles (id, email, display_name, password_hash) VALUES ($1, $2, $3, $4)",
      [id, email, displayName, passwordHash],
    );

    const user = { id, email: email as string, display_name: displayName };
    const token = signToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    console.error("signup error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /auth/signin
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const result = await pool.query(
      "SELECT id, email, display_name, password_hash FROM gm_profiles WHERE email = $1",
      [email],
    );
    if (result.rows.length === 0) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const gm = result.rows[0];
    const valid = await comparePassword(password as string, gm.password_hash);
    if (!valid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const user = { id: gm.id, email: gm.email, display_name: gm.display_name };
    const token = signToken(user);
    res.json({ token, user });
  } catch (err) {
    console.error("signin error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /auth/signout — client drops token; server is stateless
router.post("/signout", (_req, res) => {
  res.json({ success: true });
});

// GET /auth/me
router.get("/me", requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, display_name FROM gm_profiles WHERE id = $1",
      [req.userId],
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("me error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
