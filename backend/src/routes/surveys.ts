import { Router } from "express";
import { pool } from "../db/pool";

const router = Router();

// All routes in this file require auth — applied in index.ts

// GET /surveys — all surveys belonging to the authenticated GM
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM surveys WHERE created_by = $1 ORDER BY created_at DESC",
      [req.userId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error("list surveys error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /surveys — create a new survey
router.post("/", async (req, res) => {
  try {
    const { title, description, supported_languages, share_token } = req.body;
    if (!title || !share_token) {
      res.status(400).json({ error: "title and share_token are required" });
      return;
    }

    const result = await pool.query(
      `INSERT INTO surveys (created_by, title, description, supported_languages, share_token, is_active, settings)
       VALUES ($1, $2, $3, $4, $5, true, '{}')
       RETURNING *`,
      [
        req.userId,
        title,
        description ?? null,
        supported_languages ?? ["en"],
        share_token,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("create survey error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /surveys/:id — get a single survey (ownership enforced)
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM surveys WHERE id = $1 AND created_by = $2",
      [req.params.id, req.userId],
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Survey not found" });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("get survey error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /surveys/:id — update a survey (ownership enforced)
router.put("/:id", async (req, res) => {
  try {
    const { title, description, is_active, supported_languages } = req.body;

    const result = await pool.query(
      `UPDATE surveys
       SET title = COALESCE($1, title),
           description = CASE WHEN $2::boolean THEN $3::text ELSE description END,
           is_active = COALESCE($4, is_active),
           supported_languages = COALESCE($5, supported_languages)
       WHERE id = $6 AND created_by = $7
       RETURNING *`,
      [
        title ?? null,
        "description" in req.body,
        description ?? null,
        is_active ?? null,
        supported_languages ?? null,
        req.params.id,
        req.userId,
      ],
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Survey not found" });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("update survey error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /surveys/:id — delete a survey (ownership enforced; cascades to responses)
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM surveys WHERE id = $1 AND created_by = $2 RETURNING id",
      [req.params.id, req.userId],
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Survey not found" });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    console.error("delete survey error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /surveys/:id/responses — full responses with PII (GM view)
router.get("/:id/responses", async (req, res) => {
  try {
    const surveyCheck = await pool.query(
      "SELECT id FROM surveys WHERE id = $1 AND created_by = $2",
      [req.params.id, req.userId],
    );
    if (surveyCheck.rows.length === 0) {
      res.status(404).json({ error: "Survey not found" });
      return;
    }

    const result = await pool.query(
      "SELECT * FROM survey_responses WHERE survey_id = $1 ORDER BY submitted_at DESC",
      [req.params.id],
    );
    res.json(result.rows);
  } catch (err) {
    console.error("list responses error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
