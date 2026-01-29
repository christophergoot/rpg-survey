import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Survey } from '../lib/types'
import { generateShareToken } from '../utils/shareTokenGenerator'

/**
 * Fetch all surveys for the current GM
 */
export const useGMSurveys = () => {
  return useQuery({
    queryKey: ['gm-surveys'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Survey[]
    }
  })
}

/**
 * Fetch a single survey by share token
 */
export const useSurveyByToken = (shareToken: string) => {
  return useQuery({
    queryKey: ['survey', shareToken],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('share_token', shareToken)
        .eq('is_active', true)
        .single()

      if (error) throw error
      return data as Survey
    },
    enabled: !!shareToken
  })
}

/**
 * Fetch a single survey by ID (for GMs)
 */
export const useSurveyById = (surveyId: string) => {
  return useQuery({
    queryKey: ['survey', surveyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('surveys')
        .select('*')
        .eq('id', surveyId)
        .single()

      if (error) throw error
      return data as Survey
    },
    enabled: !!surveyId
  })
}

/**
 * Create a new survey
 */
export const useCreateSurvey = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (surveyData: {
      title: string
      description?: string
      supported_languages?: string[]
    }) => {
      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      const shareToken = generateShareToken()

      const { data, error } = await supabase
        .from('surveys')
        .insert({
          created_by: user.id,
          title: surveyData.title,
          description: surveyData.description || null,
          supported_languages: surveyData.supported_languages || ['en', 'es'],
          share_token: shareToken,
          is_active: true,
          settings: {}
        })
        .select()
        .single()

      if (error) throw error
      return data as Survey
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gm-surveys'] })
    }
  })
}

/**
 * Update a survey
 */
export const useUpdateSurvey = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      surveyId,
      updates
    }: {
      surveyId: string
      updates: Partial<Survey>
    }) => {
      const { data, error } = await supabase
        .from('surveys')
        .update(updates)
        .eq('id', surveyId)
        .select()
        .single()

      if (error) throw error
      return data as Survey
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['gm-surveys'] })
      queryClient.invalidateQueries({ queryKey: ['survey', variables.surveyId] })
    }
  })
}

/**
 * Delete a survey
 */
export const useDeleteSurvey = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (surveyId: string) => {
      const { error } = await supabase.from('surveys').delete().eq('id', surveyId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gm-surveys'] })
    }
  })
}
