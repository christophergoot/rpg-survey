import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export const useAdmins = (surveyId: string) =>
  useQuery({
    queryKey: ["survey-admins", surveyId],
    queryFn: () => api.admins.list(surveyId),
    enabled: !!surveyId,
  });

export const useSendInvitation = (surveyId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (email: string) => api.admins.sendInvitation(surveyId, email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["survey-admins", surveyId] });
    },
  });
};

export const useCancelInvitation = (surveyId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (invitationId: string) =>
      api.admins.cancelInvitation(surveyId, invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["survey-admins", surveyId] });
    },
  });
};

export const useRemoveAdmin = (surveyId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (adminId: string) => api.admins.removeAdmin(surveyId, adminId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["survey-admins", surveyId] });
    },
  });
};
