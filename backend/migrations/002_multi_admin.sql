-- Migration 002: Multi-Admin Survey Management
-- Adds survey_admins and survey_invitations tables for co-admin feature

CREATE TABLE survey_admins (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  survey_id   UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES gm_profiles(id) ON DELETE CASCADE,
  invited_by  UUID NOT NULL REFERENCES gm_profiles(id),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (survey_id, user_id)
);

CREATE TABLE survey_invitations (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  survey_id     UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  invited_email TEXT NOT NULL,
  token         TEXT NOT NULL UNIQUE,
  invited_by    UUID NOT NULL REFERENCES gm_profiles(id),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  expires_at    TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at   TIMESTAMPTZ
);

CREATE INDEX idx_survey_admins_survey      ON survey_admins(survey_id);
CREATE INDEX idx_survey_admins_user        ON survey_admins(user_id);
CREATE INDEX idx_survey_invitations_token  ON survey_invitations(token);
CREATE INDEX idx_survey_invitations_survey ON survey_invitations(survey_id);
CREATE INDEX idx_survey_invitations_email  ON survey_invitations(survey_id, invited_email);
