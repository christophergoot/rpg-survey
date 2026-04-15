import { Router } from "express";
import { pool } from "../db/pool";

const router = Router();

// All routes in this file require auth — applied in index.ts

// PATCH /responses/:id/player-name — update player name (GM only, ownership via JOIN)
router.patch("/:id/player-name", async (req, res) => {
  try {
    const { player_name } = req.body;
    if (player_name === undefined) {
      res.status(400).json({ error: "player_name is required" });
      return;
    }

    const result = await pool.query(
      `UPDATE survey_responses r
       SET player_name = $1
       FROM surveys s
       WHERE r.id = $2
         AND r.survey_id = s.id
         AND s.created_by = $3
       RETURNING r.*`,
      [player_name, req.params.id, req.userId],
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Response not found" });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("update player name error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /responses/:id — delete a response (GM only, ownership via JOIN)
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM survey_responses r
       USING surveys s
       WHERE r.id = $1
         AND r.survey_id = s.id
         AND s.created_by = $2
       RETURNING r.id`,
      [req.params.id, req.userId],
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Response not found" });
      return;
    }
    res.json({ success: true });
  } catch (err) {
    console.error("delete response error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
