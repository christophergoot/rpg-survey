import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export const useInvitationByToken = (token: string) =>
  useQuery({
    queryKey: ["invitation", token],
    queryFn: () => api.invitations.getByToken(token),
    enabled: !!token,
    retry: false,
  });

export const useAcceptInvitation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ surveyId, token }: { surveyId: string; token: string }) =>
      api.admins.acceptInvitation(surveyId, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gm-surveys"] });
    },
  });
};
