import { Router } from "express";
import { pool } from "../db/pool";
import { notifyGM } from "../email/notify";

const router = Router();

// GET /public/invitations/:token — fetch invitation details (no auth)
router.get("/invitations/:token", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT si.id, si.survey_id, si.invited_email, si.expires_at, si.accepted_at,
              s.title AS survey_title,
              gp.display_name AS inviter_display_name
       FROM survey_invitations si
       JOIN surveys s ON s.id = si.survey_id
       JOIN gm_profiles gp ON gp.id = si.invited_by
       WHERE si.token = $1`,
      [req.params.token],
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Invitation not found" });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("public invitation error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /public/surveys/:shareToken — fetch an active survey by share token (no auth)
router.get("/surveys/:shareToken", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM surveys WHERE share_token = $1 AND is_active = true",
      [req.params.shareToken],
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Survey not found" });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("public survey error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /public/surveys/:shareToken/responses — PII-stripped responses (no auth)
router.get("/surveys/:shareToken/responses", async (req, res) => {
  try {
    const surveyResult = await pool.query(
      "SELECT id FROM surveys WHERE share_token = $1",
      [req.params.shareToken],
    );
    if (surveyResult.rows.length === 0) {
      res.status(404).json({ error: "Survey not found" });
      return;
    }

    const surveyId: string = surveyResult.rows[0].id;
    const result = await pool.query(
      `SELECT id, survey_id, submitted_at, language, answers,
              NULL::text AS player_name, NULL::text AS user_agent, NULL::text AS ip_hash
       FROM survey_responses
       WHERE survey_id = $1
       ORDER BY submitted_at DESC`,
      [surveyId],
    );
    res.json(result.rows);
  } catch (err) {
    console.error("public responses error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /public/surveys/:surveyId/responses — anonymous player submission
router.post("/surveys/:surveyId/responses", async (req, res) => {
  try {
    const { player_name, language, answers, user_agent } = req.body;
    if (!language || !answers) {
      res.status(400).json({ error: "language and answers are required" });
      return;
    }

    // Verify survey exists and is active
    const surveyCheck = await pool.query(
      "SELECT id FROM surveys WHERE id = $1 AND is_active = true",
      [req.params.surveyId],
    );
    if (surveyCheck.rows.length === 0) {
      res.status(404).json({ error: "Survey not found" });
      return;
    }

    const result = await pool.query(
      `INSERT INTO survey_responses (survey_id, player_name, language, answers, user_agent)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, submitted_at`,
      [
        req.params.surveyId,
        player_name ?? null,
        language,
        answers,
        user_agent ?? null,
      ],
    );

    const response = result.rows[0];

    // Fire-and-forget email notification
    notifyGM(req.params.surveyId, player_name ?? "Anonymous").catch((err) =>
      console.error("notifyGM failed:", err),
    );

    res.status(201).json(response);
  } catch (err) {
    console.error("submit response error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
