// Database Types
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      gm_profiles: {
        Row: {
          id: string
          email: string | null
          display_name: string | null
          created_at: string
        }
        Insert: {
          id: string
          email?: string | null
          display_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          display_name?: string | null
          created_at?: string
        }
      }
      surveys: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          created_by: string
          title: string
          description: string | null
          supported_languages: string[]
          is_active: boolean
          share_token: string
          settings: Json
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          created_by: string
          title: string
          description?: string | null
          supported_languages?: string[]
          is_active?: boolean
          share_token: string
          settings?: Json
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          created_by?: string
          title?: string
          description?: string | null
          supported_languages?: string[]
          is_active?: boolean
          share_token?: string
          settings?: Json
        }
      }
      survey_questions: {
        Row: {
          id: string
          question_key: string
          question_type: string
          order_index: number
          is_required: boolean
          config: Json
          created_at: string
        }
        Insert: {
          id?: string
          question_key: string
          question_type: string
          order_index: number
          is_required?: boolean
          config?: Json
          created_at?: string
        }
        Update: {
          id?: string
          question_key?: string
          question_type?: string
          order_index?: number
          is_required?: boolean
          config?: Json
          created_at?: string
        }
      }
      question_translations: {
        Row: {
          id: string
          question_key: string
          language: string
          question_text: string
          question_description: string | null
          options: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          question_key: string
          language: string
          question_text: string
          question_description?: string | null
          options?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          question_key?: string
          language?: string
          question_text?: string
          question_description?: string | null
          options?: Json | null
          created_at?: string
        }
      }
      survey_responses: {
        Row: {
          id: string
          survey_id: string
          submitted_at: string
          player_name: string | null
          language: string
          answers: Json
          user_agent: string | null
          ip_hash: string | null
        }
        Insert: {
          id?: string
          survey_id: string
          submitted_at?: string
          player_name?: string | null
          language: string
          answers: Json
          user_agent?: string | null
          ip_hash?: string | null
        }
        Update: {
          id?: string
          survey_id?: string
          submitted_at?: string
          player_name?: string | null
          language?: string
          answers?: Json
          user_agent?: string | null
          ip_hash?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Application Types
export interface Survey {
  id: string
  created_at: string
  updated_at: string
  created_by: string
  title: string
  description: string | null
  supported_languages: string[]
  is_active: boolean
  share_token: string
  settings: Record<string, any>
}

export interface SurveyQuestion {
  id: string
  question_key: string
  question_type: 'single_choice' | 'multi_choice' | 'scale' | 'text' | 'multi_scale'
  order_index: number
  is_required: boolean
  config: {
    options?: string[]
    scales?: string[]
    min?: number
    max?: number
    maxLength?: number
  }
  created_at: string
}

export interface QuestionTranslation {
  id: string
  question_key: string
  language: 'en' | 'es'
  question_text: string
  question_description: string | null
  options: Record<string, { label: string; description: string }> | null
  created_at: string
}

export interface SurveyResponse {
  id: string
  survey_id: string
  submitted_at: string
  player_name: string | null
  language: string
  answers: Record<string, any>
  user_agent: string | null
  ip_hash: string | null
}

export interface GMProfile {
  id: string
  email: string | null
  display_name: string | null
  created_at: string
}

// Survey Answer Types
export interface SurveyAnswers {
  theme?: string[]
  setting_details?: string
  activity_preferences?: {
    combat: number
    puzzles: number
    diplomacy: number
    exploration: number
  }
  rules_complexity?: number
  combat_style?: string
  campaign_length?: string
  session_frequency?: string
  experience_level?: number
  character_creation?: string
  tone_preferences?: string[]
  content_boundaries?: string[]
  additional_comments?: string
}

// Summary Statistics Types
export interface SurveySummary {
  totalResponses: number
  themeCounts: Record<string, number>
  avgRulesComplexity: number
  avgActivityPreferences: {
    combat: number
    puzzles: number
    diplomacy: number
    exploration: number
  }
  combatStyleCounts: Record<string, number>
  campaignLengthCounts: Record<string, number>
  avgExperienceLevel: number
  tonePreferencesCounts: Record<string, number>
  languageDistribution: Record<string, number>
}
