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
      playerName: string  // Now required
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
            player_name: playerName,
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

/**
 * Update player name for a response (GM only)
 */
export const useUpdatePlayerName = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      responseId,
      playerName,
      surveyId
    }: {
      responseId: string
      playerName: string
      surveyId: string
    }) => {
      const { data, error } = await supabase
        .from('survey_responses')
        .update({ player_name: playerName })
        .eq('id', responseId)
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

/**
 * Delete a survey response (GM only)
 */
export const useDeleteResponse = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      responseId,
      surveyId
    }: {
      responseId: string
      surveyId: string
    }) => {
      const { error } = await supabase
        .from('survey_responses')
        .delete()
        .eq('id', responseId)

      if (error) throw error
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['survey-responses', variables.surveyId]
      })
    }
  })
}
