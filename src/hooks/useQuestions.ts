import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { SurveyQuestion, QuestionTranslation } from "../lib/types";

/**
 * Fetch all survey questions
 */
export const useSurveyQuestions = () => {
  return useQuery({
    queryKey: ["survey-questions"],
    queryFn: () => api.questions.list(),
    staleTime: 24 * 60 * 60 * 1000, // 24h — questions are static seed data
  });
};

/**
 * Fetch question translations for a specific language
 */
export const useQuestionTranslations = (language: string) => {
  return useQuery({
    queryKey: ["question-translations", language],
    queryFn: () => api.questions.translations(language),
    enabled: !!language,
    staleTime: 24 * 60 * 60 * 1000,
  });
};

/**
 * Fetch questions with translations combined
 */
export const useQuestionsWithTranslations = (language: string) => {
  const { data: questions, isLoading: questionsLoading } = useSurveyQuestions();
  const { data: translations, isLoading: translationsLoading } =
    useQuestionTranslations(language);

  const isLoading = questionsLoading || translationsLoading;

  const questionsWithTranslations = questions?.map(
    (question: SurveyQuestion) => {
      const translation = translations?.find(
        (t: QuestionTranslation) => t.question_key === question.question_key,
      );
      return { ...question, translation };
    },
  );

  return {
    questions: questionsWithTranslations ?? [],
    isLoading,
  };
};
