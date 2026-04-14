import { getToken, clearToken, dispatchAuthChange } from "./auth-events";
import type {
  Survey,
  SurveyQuestion,
  QuestionTranslation,
  SurveyResponse,
  User,
  SurveyAnswers,
} from "./types";

const API_BASE = import.meta.env.VITE_API_URL as string;

if (!API_BASE) {
  throw new Error("Missing VITE_API_URL environment variable");
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    clearToken();
    dispatchAuthChange();
    window.location.hash = "#/login";
    throw new Error("Session expired. Please sign in again.");
  }

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }

  return res.json() as Promise<T>;
}

export const api = {
  auth: {
    signUp: (email: string, password: string, display_name?: string) =>
      apiFetch<{ token: string; user: User }>("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password, display_name }),
      }),

    signIn: (email: string, password: string) =>
      apiFetch<{ token: string; user: User }>("/auth/signin", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),

    signOut: () =>
      apiFetch<{ success: boolean }>("/auth/signout", { method: "POST" }),

    me: () => apiFetch<User>("/auth/me"),
  },

  surveys: {
    list: () => apiFetch<Survey[]>("/surveys"),

    getById: (id: string) => apiFetch<Survey>(`/surveys/${id}`),

    getByToken: (shareToken: string) =>
      apiFetch<Survey>(`/public/surveys/${shareToken}`),

    create: (data: {
      title: string;
      description?: string;
      supported_languages?: string[];
      share_token: string;
    }) =>
      apiFetch<Survey>("/surveys", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (
      id: string,
      updates: {
        title?: string;
        description?: string | null;
        is_active?: boolean;
        supported_languages?: string[];
      },
    ) =>
      apiFetch<Survey>(`/surveys/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      }),

    delete: (id: string) =>
      apiFetch<{ success: boolean }>(`/surveys/${id}`, { method: "DELETE" }),
  },

  questions: {
    list: () => apiFetch<SurveyQuestion[]>("/questions"),

    translations: (language: string) =>
      apiFetch<QuestionTranslation[]>(`/questions/translations/${language}`),
  },

  responses: {
    listForSurvey: (surveyId: string) =>
      apiFetch<SurveyResponse[]>(`/surveys/${surveyId}/responses`),

    listPublic: (shareToken: string) =>
      apiFetch<SurveyResponse[]>(`/public/surveys/${shareToken}/responses`),

    submit: (
      surveyId: string,
      data: {
        player_name: string;
        language: string;
        answers: SurveyAnswers;
        user_agent?: string;
      },
    ) =>
      apiFetch<Pick<SurveyResponse, "id" | "submitted_at">>(
        `/public/surveys/${surveyId}/responses`,
        {
          method: "POST",
          body: JSON.stringify(data),
        },
      ),

    updatePlayerName: (responseId: string, player_name: string) =>
      apiFetch<SurveyResponse>(`/responses/${responseId}/player-name`, {
        method: "PATCH",
        body: JSON.stringify({ player_name }),
      }),

    delete: (responseId: string) =>
      apiFetch<{ success: boolean }>(`/responses/${responseId}`, {
        method: "DELETE",
      }),
  },
};
