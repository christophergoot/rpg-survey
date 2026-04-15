// Application Types

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface User {
  id: string;
  email: string;
  display_name: string;
}

export interface Survey {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  title: string;
  description: string | null;
  supported_languages: string[];
  is_active: boolean;
  share_token: string;
  settings: Record<string, unknown>;
  role?: "owner" | "co_admin";
}

export interface SurveyAdmin {
  id: string;
  user_id: string;
  email: string;
  display_name: string | null;
  created_at: string;
}

export interface SurveyInvitation {
  id: string;
  invited_email: string;
  created_at: string;
  expires_at: string;
}

export interface AdminsData {
  admins: SurveyAdmin[];
  invitations: SurveyInvitation[];
}

export interface InvitationDetail {
  id: string;
  survey_id: string;
  invited_email: string;
  expires_at: string;
  accepted_at: string | null;
  survey_title: string;
  inviter_display_name: string;
}

export interface SurveyQuestion {
  id: string;
  question_key: string;
  question_type:
    | "single_choice"
    | "multi_choice"
    | "scale"
    | "text"
    | "multi_scale";
  order_index: number;
  is_required: boolean;
  config: {
    options?: string[];
    scales?: string[];
    min?: number;
    max?: number;
    maxLength?: number;
  };
  created_at: string;
}

export interface QuestionTranslation {
  id: string;
  question_key: string;
  language: string;
  question_text: string;
  question_description: string | null;
  options: Record<string, { label: string; description: string }> | null;
  created_at: string;
}

export interface SurveyResponse {
  id: string;
  survey_id: string;
  submitted_at: string;
  player_name: string | null;
  language: string;
  answers: Record<string, unknown>;
  user_agent: string | null;
  ip_hash: string | null;
}

export interface GMProfile {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
}

// Survey Answer Types
export interface SurveyAnswers {
  language_proficiency?: Record<string, number>;
  theme?: string[];
  setting_details?: string;
  activity_preferences?: {
    combat: number;
    puzzles: number;
    diplomacy: number;
    exploration: number;
  };
  rules_complexity?: number;
  combat_style?: string;
  campaign_length?: string;
  session_frequency?: string;
  experience_level?: number;
  character_creation?: string;
  tone_preferences?: string[];
  content_boundaries?: string[];
  additional_comments?: string;
}

// Summary Statistics Types
export interface SurveySummary {
  totalResponses: number;
  themeCounts: Record<string, number>;
  avgRulesComplexity: number;
  avgActivityPreferences: {
    combat: number;
    puzzles: number;
    diplomacy: number;
    exploration: number;
  };
  combatStyleCounts: Record<string, number>;
  campaignLengthCounts: Record<string, number>;
  avgExperienceLevel: number;
  tonePreferencesCounts: Record<string, number>;
  languageDistribution: Record<string, number>;
  avgLanguageProficiency: Record<string, number>;
}

// Advanced Analytics Types
export interface Correlation {
  field1: string;
  field2: string;
  coefficient: number;
  descriptionKey: string;
}

export interface ConsensusItem {
  fieldKey: string;
  valueKey: string;
  percentage: number;
  count: number;
  total: number;
}

export interface ConflictItem {
  fieldKey: string;
  descriptionKey: string;
  descriptionParams?: Record<string, string | number>;
  values: { valueKey: string; count: number }[];
  variance?: number;
}

export interface MatchReason {
  key: string;
  params?: Record<string, string>;
}

export interface GameSystemRecommendation {
  name: string;
  descriptionKey: string;
  matchScore: number;
  matchReasons: MatchReason[];
}

export interface SessionZeroTopic {
  topicKey: string;
  reasonKey: string;
  reasonParams?: Record<string, string | number>;
  priority: "high" | "medium" | "low";
}

export interface GroupInsights {
  consensus: ConsensusItem[];
  conflicts: ConflictItem[];
  correlations: Correlation[];
  recommendations: GameSystemRecommendation[];
  sessionZeroTopics: SessionZeroTopic[];
}
