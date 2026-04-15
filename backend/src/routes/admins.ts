import { randomBytes } from "crypto";
import { Router } from "express";
import { pool } from "../db/pool";
import { sendInvitationEmail } from "../email/invite";

const router = Router();

// All routes in this file require auth — applied in index.ts
// Routes are mounted at /surveys so paths here are /:surveyId/admins/...

// GET /surveys/:surveyId/admins — list admins + pending invitations (owner only)
router.get("/:surveyId/admins", async (req, res) => {
  try {
    const { surveyId } = req.params;

    // Ownership check
    const ownerCheck = await pool.query(
      "SELECT id FROM surveys WHERE id = $1 AND created_by = $2",
      [surveyId, req.userId],
    );
    if (ownerCheck.rows.length === 0) {
      res.status(404).json({ error: "Survey not found" });
      return;
    }

    const [adminsResult, invitationsResult] = await Promise.all([
      pool.query(
        `SELECT sa.id, sa.user_id, sa.created_at, gp.email, gp.display_name
         FROM survey_admins sa
         JOIN gm_profiles gp ON gp.id = sa.user_id
         WHERE sa.survey_id = $1
         ORDER BY sa.created_at ASC`,
        [surveyId],
      ),
      pool.query(
        `SELECT id, invited_email, created_at, expires_at
         FROM survey_invitations
         WHERE survey_id = $1
           AND accepted_at IS NULL
           AND expires_at > NOW()
         ORDER BY created_at DESC`,
        [surveyId],
      ),
    ]);

    res.json({
      admins: adminsResult.rows,
      invitations: invitationsResult.rows,
    });
  } catch (err) {
    console.error("list admins error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /surveys/:surveyId/admins/invitations — send invitation (owner only)
router.post("/:surveyId/admins/invitations", async (req, res) => {
  try {
    const { surveyId } = req.params;
    const rawEmail: string = req.body.email ?? "";
    const invitedEmail = rawEmail.trim().toLowerCase();

    if (!invitedEmail) {
      res.status(400).json({ error: "email is required" });
      return;
    }

    // Ownership check — also fetch owner email and survey title
    const surveyResult = await pool.query(
      `SELECT s.id, s.title, gp.email AS owner_email, gp.display_name AS owner_display_name
       FROM surveys s
       JOIN gm_profiles gp ON gp.id = s.created_by
       WHERE s.id = $1 AND s.created_by = $2`,
      [surveyId, req.userId],
    );
    if (surveyResult.rows.length === 0) {
      res.status(404).json({ error: "Survey not found" });
      return;
    }
    const {
      title: surveyTitle,
      owner_email: ownerEmail,
      owner_display_name: ownerDisplayName,
    } = surveyResult.rows[0];

    // Reject self-invite
    if (invitedEmail === ownerEmail.toLowerCase()) {
      res.status(409).json({ error: "You cannot invite yourself" });
      return;
    }

    // Check if already a co-admin (look up by email)
    const alreadyAdminCheck = await pool.query(
      `SELECT sa.id FROM survey_admins sa
       JOIN gm_profiles gp ON gp.id = sa.user_id
       WHERE sa.survey_id = $1 AND LOWER(gp.email) = $2`,
      [surveyId, invitedEmail],
    );
    if (alreadyAdminCheck.rows.length > 0) {
      res
        .status(409)
        .json({ error: "This person is already a co-admin of this survey" });
      return;
    }

    // Check for existing pending invitation
    const pendingCheck = await pool.query(
      `SELECT id FROM survey_invitations
       WHERE survey_id = $1 AND invited_email = $2
         AND accepted_at IS NULL AND expires_at > NOW()`,
      [surveyId, invitedEmail],
    );
    if (pendingCheck.rows.length > 0) {
      res
        .status(409)
        .json({ error: "An invitation is already pending for this address" });
      return;
    }

    // Clean up any stale (expired or accepted) invitations for this pair
    await pool.query(
      `DELETE FROM survey_invitations
       WHERE survey_id = $1 AND invited_email = $2
         AND (accepted_at IS NOT NULL OR expires_at <= NOW())`,
      [surveyId, invitedEmail],
    );

    // Generate token and insert invitation
    const token = randomBytes(32).toString("hex");
    const result = await pool.query(
      `INSERT INTO survey_invitations (survey_id, invited_email, token, invited_by)
       VALUES ($1, $2, $3, $4)
       RETURNING id, invited_email, expires_at`,
      [surveyId, invitedEmail, token, req.userId],
    );

    const invitation = result.rows[0];

    // Fire-and-forget invitation email
    const frontendOrigin =
      process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";
    sendInvitationEmail({
      invitedEmail,
      surveyTitle,
      inviterDisplayName: ownerDisplayName ?? ownerEmail,
      token,
      frontendOrigin,
      expiresAt: new Date(invitation.expires_at),
    }).catch((err) => console.error("sendInvitationEmail failed:", err));

    res.status(201).json(invitation);
  } catch (err) {
    console.error("send invitation error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /surveys/:surveyId/admins/invitations/:invitationId — cancel invitation (owner only)
router.delete(
  "/:surveyId/admins/invitations/:invitationId",
  async (req, res) => {
    try {
      const { surveyId, invitationId } = req.params;

      // Ownership check
      const ownerCheck = await pool.query(
        "SELECT id FROM surveys WHERE id = $1 AND created_by = $2",
        [surveyId, req.userId],
      );
      if (ownerCheck.rows.length === 0) {
        res.status(404).json({ error: "Survey not found" });
        return;
      }

      const result = await pool.query(
        `DELETE FROM survey_invitations
       WHERE id = $1 AND survey_id = $2 AND accepted_at IS NULL
       RETURNING id`,
        [invitationId, surveyId],
      );
      if (result.rows.length === 0) {
        res.status(404).json({ error: "Invitation not found" });
        return;
      }

      res.json({ success: true });
    } catch (err) {
      console.error("cancel invitation error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// POST /surveys/:surveyId/admins/invitations/:token/accept — accept invitation (auth required)
router.post("/:surveyId/admins/invitations/:token/accept", async (req, res) => {
  try {
    const { surveyId, token } = req.params;

    // Look up invitation
    const invResult = await pool.query(
      `SELECT si.id, si.invited_email, si.expires_at, si.accepted_at,
              si.invited_by, s.title AS survey_title
       FROM survey_invitations si
       JOIN surveys s ON s.id = si.survey_id
       WHERE si.token = $1 AND si.survey_id = $2`,
      [token, surveyId],
    );
    if (invResult.rows.length === 0) {
      res.status(404).json({ error: "Invitation not found" });
      return;
    }

    const inv = invResult.rows[0];

    if (new Date(inv.expires_at) <= new Date()) {
      res.status(410).json({ error: "This invitation has expired" });
      return;
    }
    if (inv.accepted_at !== null) {
      res
        .status(409)
        .json({ error: "This invitation has already been accepted" });
      return;
    }

    // Verify the logged-in user's email matches the invited email
    const userResult = await pool.query(
      "SELECT email FROM gm_profiles WHERE id = $1",
      [req.userId],
    );
    if (userResult.rows.length === 0) {
      res.status(401).json({ error: "User not found" });
      return;
    }
    const userEmail: string = userResult.rows[0].email;
    if (userEmail.toLowerCase() !== inv.invited_email.toLowerCase()) {
      res.status(403).json({
        error: `This invitation was sent to ${inv.invited_email}. Please sign in with that account.`,
      });
      return;
    }

    // Accept: insert survey_admins row + mark invitation as accepted
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query(
        `INSERT INTO survey_admins (survey_id, user_id, invited_by)
         VALUES ($1, $2, $3)
         ON CONFLICT (survey_id, user_id) DO NOTHING`,
        [surveyId, req.userId, inv.invited_by],
      );
      await client.query(
        "UPDATE survey_invitations SET accepted_at = NOW() WHERE id = $1",
        [inv.id],
      );
      await client.query("COMMIT");
    } catch (txErr) {
      await client.query("ROLLBACK");
      throw txErr;
    } finally {
      client.release();
    }

    res.json({ survey_id: surveyId, survey_title: inv.survey_title });
  } catch (err) {
    console.error("accept invitation error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /surveys/:surveyId/admins/:adminId — remove co-admin (owner only)
router.delete("/:surveyId/admins/:adminId", async (req, res) => {
  try {
    const { surveyId, adminId } = req.params;

    // Ownership check
    const ownerCheck = await pool.query(
      "SELECT id FROM surveys WHERE id = $1 AND created_by = $2",
      [surveyId, req.userId],
    );
    if (ownerCheck.rows.length === 0) {
      res.status(404).json({ error: "Survey not found" });
      return;
    }

    const result = await pool.query(
      "DELETE FROM survey_admins WHERE id = $1 AND survey_id = $2 RETURNING id",
      [adminId, surveyId],
    );
    if (result.rows.length === 0) {
      res.status(404).json({ error: "Admin not found" });
      return;
    }

    res.json({ success: true });
  } catch (err) {
    console.error("remove admin error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
