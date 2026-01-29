import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Header } from '../components/common/Header'
import { useCreateSurvey } from '../hooks/useSurvey'

export const SurveyCreation: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const createSurvey = useCreateSurvey()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    supportedLanguages: ['en', 'es'] as string[]
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.title.trim()) {
      setError('Survey title is required')
      return
    }

    if (formData.supportedLanguages.length === 0) {
      setError('Select at least one language')
      return
    }

    try {
      const survey = await createSurvey.mutateAsync({
        title: formData.title,
        description: formData.description || undefined,
        supported_languages: formData.supportedLanguages
      })

      // Show success message with share link
      const shareUrl = `${window.location.origin}${window.location.pathname}#/surveys/${survey.share_token}`

      // Copy to clipboard
      navigator.clipboard.writeText(shareUrl)

      // Navigate to results page
      alert(`Survey created! Share link copied to clipboard:\n\n${shareUrl}`)
      navigate(`/results/${survey.id}`)
    } catch (err: any) {
      console.error('Failed to create survey:', err)
      setError(err.message || t('survey.create.error'))
    }
  }

  const handleLanguageToggle = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      supportedLanguages: prev.supportedLanguages.includes(lang)
        ? prev.supportedLanguages.filter((l) => l !== lang)
        : [...prev.supportedLanguages, lang]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-space">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              {t('survey.create.title')}
            </h1>
            <p className="text-gray-400">
              Create a survey to gather player preferences for your RPG campaign
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-dark-surface rounded-lg shadow-xl border border-dark-elevated p-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Survey Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  {t('survey.create.surveyTitle')} *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder={t('survey.create.surveyTitlePlaceholder')}
                  required
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-elevated rounded-lg focus:outline-none focus:border-cyber-500 text-white placeholder-gray-500"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  {t('survey.create.description')}
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder={t('survey.create.descriptionPlaceholder')}
                  rows={4}
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-elevated rounded-lg focus:outline-none focus:border-cyber-500 text-white placeholder-gray-500 resize-none"
                />
              </div>

              {/* Supported Languages */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('survey.create.supportedLanguages')} *
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  {t('survey.create.supportedLanguagesHelp')}
                </p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.supportedLanguages.includes('en')}
                      onChange={() => handleLanguageToggle('en')}
                      className="w-5 h-5 rounded border-gray-600 text-cyber-500 focus:ring-cyber-500 focus:ring-offset-0 bg-dark-bg"
                    />
                    <span className="text-white">🇺🇸 English</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.supportedLanguages.includes('es')}
                      onChange={() => handleLanguageToggle('es')}
                      className="w-5 h-5 rounded border-gray-600 text-cyber-500 focus:ring-cyber-500 focus:ring-offset-0 bg-dark-bg"
                    />
                    <span className="text-white">🇪🇸 Español</span>
                  </label>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-cyber-500/10 border border-cyber-500/30 rounded-lg p-4">
                <p className="text-sm text-gray-300">
                  <strong className="text-cyber-400">Note:</strong> The survey will
                  include 12 predefined questions covering theme, setting, activity
                  preferences, rules complexity, combat style, campaign length, and more.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 px-6 py-3 bg-dark-elevated hover:bg-dark-bg text-white font-semibold rounded-lg transition-colors"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={createSurvey.isPending}
                  className="flex-1 px-6 py-3 bg-cyber-500 hover:bg-cyber-600 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyber-500/30"
                >
                  {createSurvey.isPending
                    ? t('survey.create.creating')
                    : t('common.submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
