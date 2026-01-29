import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { SurveyResponse, SurveyAnswers } from '../lib/types'

/**
 * Fetch responses for a survey (GM only)
 */
export const useSurveyResponses = (surveyId: string) => {
  return useQuery({
    queryKey: ['survey-responses', surveyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('survey_responses')
        .select('*')
        .eq('survey_id', surveyId)
        .order('submitted_at', { ascending: false })

      if (error) throw error
      return data as SurveyResponse[]
    },
    enabled: !!surveyId
  })
}

/**
 * Submit a survey response (anonymous)
 */
export const useSubmitResponse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      surveyId,
      playerName,
      language,
      answers
    }: {
      surveyId: string
      playerName?: string
      language: string
      answers: SurveyAnswers
    }) => {
      // Hash IP for basic duplicate prevention (optional)
      const userAgent = navigator.userAgent

      const { data, error } = await supabase
        .from('survey_responses')
        .insert([
          {
            survey_id: surveyId,
            player_name: playerName || null,
            language,
            answers,
            user_agent: userAgent,
            ip_hash: null // Could implement IP hashing if needed
          }
        ])
        .select()
        .single()

      if (error) throw error
      return data as SurveyResponse
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['survey-responses', variables.surveyId]
      })
    }
  })
}
