-- RPG Survey — Neon/PostgreSQL schema
-- Adapted from supabase/migrations/001_initial_schema.sql
-- Changes: removed auth.users FKs, added password_hash, removed Supabase-specific grants/RLS/triggers

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================
-- TABLES
-- ==============================================

CREATE TABLE gm_profiles (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email        TEXT UNIQUE NOT NULL,
  display_name TEXT,
  password_hash TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE surveys (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  created_by          UUID NOT NULL REFERENCES gm_profiles(id) ON DELETE CASCADE,
  title               TEXT NOT NULL,
  description         TEXT,
  supported_languages TEXT[] DEFAULT ARRAY['en', 'es'],
  is_active           BOOLEAN DEFAULT TRUE,
  share_token         TEXT UNIQUE NOT NULL,
  settings            JSONB DEFAULT '{}'::jsonb
);

-- Static question structure (seeded once, never changes at runtime)
CREATE TABLE survey_questions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_key  TEXT UNIQUE NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('single_choice', 'multi_choice', 'scale', 'text', 'multi_scale')),
  order_index   INTEGER NOT NULL,
  is_required   BOOLEAN DEFAULT TRUE,
  config        JSONB DEFAULT '{}'::jsonb,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Translations (language column unconstrained to allow future languages beyond en/es)
CREATE TABLE question_translations (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_key         TEXT NOT NULL REFERENCES survey_questions(question_key) ON DELETE CASCADE,
  language             TEXT NOT NULL,
  question_text        TEXT NOT NULL,
  question_description TEXT,
  options              JSONB,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (question_key, language)
);

CREATE TABLE survey_responses (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  survey_id    UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  player_name  TEXT,
  language     TEXT NOT NULL,
  answers      JSONB NOT NULL,
  user_agent   TEXT,
  ip_hash      TEXT
);

-- ==============================================
-- INDEXES
-- ==============================================

CREATE INDEX idx_surveys_created_by    ON surveys(created_by);
CREATE INDEX idx_surveys_share_token   ON surveys(share_token);
CREATE INDEX idx_surveys_is_active     ON surveys(is_active);
CREATE INDEX idx_questions_key         ON survey_questions(question_key);
CREATE INDEX idx_questions_order       ON survey_questions(order_index);
CREATE INDEX idx_translations_key_lang ON question_translations(question_key, language);
CREATE INDEX idx_responses_survey_id   ON survey_responses(survey_id);
CREATE INDEX idx_responses_submitted   ON survey_responses(submitted_at);

-- ==============================================
-- TRIGGER: keep surveys.updated_at current
-- ==============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_surveys_updated_at
  BEFORE UPDATE ON surveys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
