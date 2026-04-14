import { Router } from "express";
import { pool } from "../db/pool";

const router = Router();

// GET /questions — all questions ordered by order_index (static seed data, long cache)
router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM survey_questions ORDER BY order_index ASC",
    );
    res.set("Cache-Control", "public, max-age=86400");
    res.json(result.rows);
  } catch (err) {
    console.error("questions error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /questions/translations/:language
router.get("/translations/:language", async (req, res) => {
  try {
    const { language } = req.params;
    const result = await pool.query(
      "SELECT * FROM question_translations WHERE language = $1",
      [language],
    );
    res.set("Cache-Control", "public, max-age=86400");
    res.json(result.rows);
  } catch (err) {
    console.error("translations error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
