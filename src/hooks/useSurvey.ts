import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Survey } from "../lib/types";
import { generateShareToken } from "../utils/shareTokenGenerator";

/**
 * Fetch all surveys for the current GM
 */
export const useGMSurveys = () => {
  return useQuery({
    queryKey: ["gm-surveys"],
    queryFn: () => api.surveys.list(),
  });
};

/**
 * Fetch a single survey by share token (public, no auth)
 */
export const useSurveyByToken = (shareToken: string) => {
  return useQuery({
    queryKey: ["survey", shareToken],
    queryFn: () => api.surveys.getByToken(shareToken),
    enabled: !!shareToken,
  });
};

/**
 * Fetch a single survey by ID (for GMs)
 */
export const useSurveyById = (surveyId: string) => {
  return useQuery({
    queryKey: ["survey", surveyId],
    queryFn: () => api.surveys.getById(surveyId),
    enabled: !!surveyId,
  });
};

/**
 * Create a new survey
 */
export const useCreateSurvey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (surveyData: {
      title: string;
      description?: string;
      supported_languages?: string[];
    }) => {
      const share_token = generateShareToken();
      return api.surveys.create({
        title: surveyData.title,
        description: surveyData.description,
        supported_languages: surveyData.supported_languages ?? ["en"],
        share_token,
      }) as Promise<Survey>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gm-surveys"] });
    },
  });
};

/**
 * Update a survey
 */
export const useUpdateSurvey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      surveyId,
      updates,
    }: {
      surveyId: string;
      updates: {
        title?: string;
        description?: string | null;
        is_active?: boolean;
        supported_languages?: string[];
      };
    }) => api.surveys.update(surveyId, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["gm-surveys"] });
      queryClient.invalidateQueries({
        queryKey: ["survey", variables.surveyId],
      });
    },
  });
};

/**
 * Delete a survey
 */
export const useDeleteSurvey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (surveyId: string) => api.surveys.delete(surveyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gm-surveys"] });
    },
  });
};
