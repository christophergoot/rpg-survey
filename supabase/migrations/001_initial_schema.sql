-- RPG Survey Application Database Schema
-- Migration 001: Initial Schema Setup (CORRECTED)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================
-- TABLES
-- ==============================================

-- GM Profiles Table (extends auth.users)
CREATE TABLE gm_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Surveys Table (GM-created surveys)
CREATE TABLE surveys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  supported_languages TEXT[] DEFAULT ARRAY['en', 'es'],
  is_active BOOLEAN DEFAULT TRUE,
  share_token TEXT UNIQUE NOT NULL,
  settings JSONB DEFAULT '{}'::jsonb
);

-- Survey Questions Table (predefined question structure)
CREATE TABLE survey_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_key TEXT UNIQUE NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('single_choice', 'multi_choice', 'scale', 'text', 'multi_scale')),
  order_index INTEGER NOT NULL,
  is_required BOOLEAN DEFAULT TRUE,
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Question Translations Table
CREATE TABLE question_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_key TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('en', 'es')),
  question_text TEXT NOT NULL,
  question_description TEXT,
  options JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(question_key, language),
  FOREIGN KEY (question_key) REFERENCES survey_questions(question_key) ON DELETE CASCADE
);

-- Survey Responses Table (player submissions)
CREATE TABLE survey_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  survey_id UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  player_name TEXT,
  language TEXT NOT NULL,
  answers JSONB NOT NULL,
  user_agent TEXT,
  ip_hash TEXT
);

-- ==============================================
-- INDEXES
-- ==============================================

CREATE INDEX idx_surveys_created_by ON surveys(created_by);
CREATE INDEX idx_surveys_share_token ON surveys(share_token);
CREATE INDEX idx_surveys_is_active ON surveys(is_active);
CREATE INDEX idx_survey_questions_key ON survey_questions(question_key);
CREATE INDEX idx_survey_questions_order ON survey_questions(order_index);
CREATE INDEX idx_question_translations_key_lang ON question_translations(question_key, language);
CREATE INDEX idx_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX idx_responses_submitted_at ON survey_responses(submitted_at);

-- ==============================================
-- ROW LEVEL SECURITY (RLS)
-- ==============================================
-- Note: RLS is disabled on surveys and survey_responses for simplicity
-- Application-level security is used instead

ALTER TABLE gm_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_translations ENABLE ROW LEVEL SECURITY;

-- Disable RLS on surveys and survey_responses
ALTER TABLE surveys DISABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses DISABLE ROW LEVEL SECURITY;

-- GM Profiles Policies
CREATE POLICY "Users can read their own profile"
  ON gm_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON gm_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON gm_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Survey Questions Policies (read-only for everyone)
CREATE POLICY "Anyone can read survey questions"
  ON survey_questions FOR SELECT
  USING (TRUE);

-- Question Translations Policies (read-only for everyone)
CREATE POLICY "Anyone can read question translations"
  ON question_translations FOR SELECT
  USING (TRUE);

-- ==============================================
-- GRANTS FOR SURVEYS AND RESPONSES (No RLS)
-- ==============================================

-- Surveys: authenticated users can do everything, anon can read
GRANT SELECT ON surveys TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON surveys TO authenticated;

-- Survey Responses: anon can insert, authenticated can do everything
GRANT INSERT ON survey_responses TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON survey_responses TO authenticated;

-- ==============================================
-- FUNCTIONS & TRIGGERS
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
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.gm_profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ==============================================
-- COMMENTS
-- ==============================================

COMMENT ON TABLE gm_profiles IS 'Extended profile information for Game Masters';
COMMENT ON TABLE surveys IS 'GM-created surveys with shareable tokens';
COMMENT ON TABLE survey_questions IS 'Predefined question structure and configuration';
COMMENT ON TABLE question_translations IS 'Bilingual translations for all survey questions';
COMMENT ON TABLE survey_responses IS 'Anonymous player responses to surveys';
