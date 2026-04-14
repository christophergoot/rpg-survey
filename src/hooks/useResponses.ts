import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { SurveyResponse, SurveyAnswers } from "../lib/types";

/**
 * Fetch responses for a survey (GM only, includes PII)
 */
export const useSurveyResponses = (surveyId: string) => {
  return useQuery({
    queryKey: ["survey-responses", surveyId],
    queryFn: () => api.responses.listForSurvey(surveyId),
    enabled: !!surveyId,
  });
};

/**
 * Fetch responses by share token (public, PII stripped by server)
 */
export const useSurveyResponsesByToken = (shareToken: string) => {
  return useQuery({
    queryKey: ["survey-responses-public", shareToken],
    queryFn: () => api.responses.listPublic(shareToken),
    enabled: !!shareToken,
  });
};

/**
 * Submit a survey response (anonymous)
 * Server handles GM email notification after insert.
 */
export const useSubmitResponse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      surveyId,
      playerName,
      language,
      answers,
    }: {
      surveyId: string;
      playerName: string;
      language: string;
      answers: SurveyAnswers;
    }) => {
      return api.responses.submit(surveyId, {
        player_name: playerName,
        language,
        answers,
        user_agent: navigator.userAgent,
      }) as Promise<SurveyResponse>;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["survey-responses", variables.surveyId],
      });
    },
  });
};

/**
 * Update player name for a response (GM only)
 */
export const useUpdatePlayerName = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      responseId,
      playerName,
    }: {
      responseId: string;
      playerName: string;
      surveyId: string;
    }) => api.responses.updatePlayerName(responseId, playerName),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["survey-responses", variables.surveyId],
      });
    },
  });
};

/**
 * Delete a survey response (GM only)
 */
export const useDeleteResponse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ responseId }: { responseId: string; surveyId: string }) =>
      api.responses.delete(responseId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["survey-responses", variables.surveyId],
      });
    },
  });
};
