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
 * Fetch responses for a survey by share token (public, for player results)
 * Returns responses without player names for privacy
 */
export const useSurveyResponsesByToken = (shareToken: string) => {
  return useQuery({
    queryKey: ['survey-responses-public', shareToken],
    queryFn: async () => {
      // First get the survey ID from the share token
      const { data: survey, error: surveyError } = await supabase
        .from('surveys')
        .select('id')
        .eq('share_token', shareToken)
        .single()

      if (surveyError) throw surveyError

      // Then get responses (without player names for privacy)
      const { data, error } = await supabase
        .from('survey_responses')
        .select('id, survey_id, submitted_at, language, answers')
        .eq('survey_id', survey.id)
        .order('submitted_at', { ascending: false })

      if (error) throw error

      // Return responses without player_name for privacy
      return data.map(r => ({
        ...r,
        player_name: null,
        user_agent: null,
        ip_hash: null
      })) as SurveyResponse[]
    },
    enabled: !!shareToken
  })
}

/**
 * Notify GM via Edge Function (fire-and-forget)
 */
const notifyGM = async (surveyId: string, playerName: string, responseId: string) => {
  try {
    await supabase.functions.invoke('notify-gm', {
      body: { surveyId, playerName, responseId }
    })
  } catch (error) {
    // Silently fail - don't block user experience if email fails
    console.error('Failed to notify GM:', error)
  }
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
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['survey-responses', variables.surveyId]
      })

      // Send email notification to GM (fire-and-forget)
      notifyGM(variables.surveyId, variables.playerName, response.id)
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
      playerName
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
      responseId
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
