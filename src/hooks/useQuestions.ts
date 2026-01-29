import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { SurveyQuestion, QuestionTranslation } from '../lib/types'

/**
 * Fetch all survey questions
 */
export const useSurveyQuestions = () => {
  return useQuery({
    queryKey: ['survey-questions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('survey_questions')
        .select('*')
        .order('order_index', { ascending: true })

      if (error) throw error
      return data as SurveyQuestion[]
    }
  })
}

/**
 * Fetch question translations for a specific language
 */
export const useQuestionTranslations = (language: 'en' | 'es') => {
  return useQuery({
    queryKey: ['question-translations', language],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('question_translations')
        .select('*')
        .eq('language', language)

      if (error) throw error
      return data as QuestionTranslation[]
    },
    enabled: !!language
  })
}

/**
 * Fetch questions with translations combined
 */
export const useQuestionsWithTranslations = (language: 'en' | 'es') => {
  const { data: questions, isLoading: questionsLoading } = useSurveyQuestions()
  const { data: translations, isLoading: translationsLoading } =
    useQuestionTranslations(language)

  const isLoading = questionsLoading || translationsLoading

  const questionsWithTranslations = questions?.map((question) => {
    const translation = translations?.find((t) => t.question_key === question.question_key)
    return {
      ...question,
      translation
    }
  })

  return {
    questions: questionsWithTranslations || [],
    isLoading
  }
}
