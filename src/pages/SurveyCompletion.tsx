import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSurveyByToken } from '../hooks/useSurvey'
import { useQuestionsWithTranslations } from '../hooks/useQuestions'
import { useSubmitResponse } from '../hooks/useResponses'
import { LanguageSelector } from '../components/common/LanguageSelector'
import { SurveyProgress } from '../components/survey/SurveyProgress'
import { QuestionRenderer } from '../components/survey/QuestionRenderer'
import { useLanguageStore } from '../stores/languageStore'
import type { SurveyAnswers } from '../lib/types'

export const SurveyCompletion: React.FC = () => {
  const { shareToken } = useParams<{ shareToken: string }>()
  const { t, i18n } = useTranslation()
  const { language } = useLanguageStore()

  const { data: survey, isLoading: surveyLoading, error: surveyError } = useSurveyByToken(shareToken!)
  const { questions, isLoading: questionsLoading } = useQuestionsWithTranslations(language)
  const submitResponse = useSubmitResponse()

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<SurveyAnswers>({})
  const [playerName, setPlayerName] = useState('')
  const [showValidation, setShowValidation] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length

  // Sync language with i18n
  useEffect(() => {
    i18n.changeLanguage(language)
  }, [language, i18n])

  // Check if current question is answered
  const isCurrentQuestionAnswered = () => {
    if (!currentQuestion) return false

    const answer = answers[currentQuestion.question_key as keyof SurveyAnswers]

    if (!currentQuestion.is_required) return true

    if (answer === undefined || answer === null) return false

    if (currentQuestion.question_type === 'multi_choice') {
      return Array.isArray(answer) && answer.length > 0
    }

    if (currentQuestion.question_type === 'multi_scale') {
      const scales = currentQuestion.config.scales as string[] || []
      return scales.every((scale) => (answer as any)?.[scale] !== undefined)
    }

    if (typeof answer === 'string') {
      return answer.trim().length > 0
    }

    return true
  }

  const handleNext = () => {
    if (!isCurrentQuestionAnswered()) {
      setShowValidation(true)
      return
    }

    setShowValidation(false)

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setShowValidation(false)
    }
  }

  const handleAnswerChange = (value: any) => {
    setAnswers({
      ...answers,
      [currentQuestion.question_key]: value
    })
    setShowValidation(false)
  }

  const handleSubmit = async () => {
    if (!isCurrentQuestionAnswered()) {
      setShowValidation(true)
      return
    }

    if (!survey) return

    try {
      await submitResponse.mutateAsync({
        surveyId: survey.id,
        playerName: playerName.trim() || undefined,
        language,
        answers
      })
      setSubmitted(true)
    } catch (error) {
      console.error('Failed to submit response:', error)
      alert(t('survey.complete.error'))
    }
  }

  // Loading state
  if (surveyLoading || questionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-space flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyber-500"></div>
          <p className="mt-4 text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  // Error state
  if (surveyError || !survey) {
    return (
      <div className="min-h-screen bg-gradient-space flex items-center justify-center">
        <div className="max-w-md p-8 bg-dark-surface rounded-lg border border-dark-elevated text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {t('survey.complete.surveyNotFound')}
          </h1>
          <p className="text-gray-400">{t('errors.surveyNotFound')}</p>
        </div>
      </div>
    )
  }

  // Check if survey is inactive
  if (!survey.is_active) {
    return (
      <div className="min-h-screen bg-gradient-space flex items-center justify-center">
        <div className="max-w-md p-8 bg-dark-surface rounded-lg border border-dark-elevated text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {t('survey.complete.surveyInactive')}
          </h1>
          <p className="text-gray-400">This survey is no longer accepting responses.</p>
        </div>
      </div>
    )
  }

  // Submitted state
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-space flex items-center justify-center p-4">
        <div className="max-w-2xl w-full p-8 bg-dark-surface rounded-lg border border-dark-elevated text-center">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-3xl font-bold text-white mb-4">
            {t('survey.complete.submitted')}
          </h1>
          <p className="text-lg text-gray-300 mb-6">
            {t('survey.complete.submittedMessage')}
          </p>
          <div className="p-4 bg-cyber-500/10 border border-cyber-500/30 rounded-lg">
            <p className="text-gray-400">
              Your responses will help the Game Master create an amazing campaign tailored
              to your group's preferences.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-space">
      {/* Header */}
      <div className="bg-dark-surface border-b border-dark-elevated">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{survey.title}</h1>
              {survey.description && (
                <p className="text-gray-400 mt-1">{survey.description}</p>
              )}
            </div>
            <LanguageSelector />
          </div>
        </div>
      </div>

      {/* Survey Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Player Name (First Screen) */}
          {currentQuestionIndex === 0 && (
            <div className="mb-8 p-6 bg-dark-surface rounded-lg border border-dark-elevated">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('survey.complete.playerName')}
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder={t('survey.complete.playerNamePlaceholder')}
                className="w-full px-4 py-3 bg-dark-bg border-2 border-dark-elevated rounded-lg focus:outline-none focus:border-cyber-500 text-white placeholder-gray-500"
              />
              <p className="mt-2 text-sm text-gray-500">
                Optional - helps the GM identify your response
              </p>
            </div>
          )}

          {/* Progress */}
          <SurveyProgress current={currentQuestionIndex + 1} total={totalQuestions} />

          {/* Question */}
          <div className="p-8 bg-dark-surface rounded-lg border border-dark-elevated mb-6">
            {currentQuestion && (
              <QuestionRenderer
                question={currentQuestion}
                translation={currentQuestion.translation}
                value={answers[currentQuestion.question_key as keyof SurveyAnswers]}
                onChange={handleAnswerChange}
                showValidation={showValidation}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 bg-dark-elevated hover:bg-dark-bg disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              ← {t('common.previous')}
            </button>

            {currentQuestionIndex < totalQuestions - 1 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-cyber-500 hover:bg-cyber-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyber-500/30"
              >
                {t('common.next')} →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitResponse.isPending}
                className="px-6 py-3 bg-neon-green hover:bg-green-600 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-neon-green/30"
              >
                {submitResponse.isPending ? t('survey.complete.submitting') : t('common.submit')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
