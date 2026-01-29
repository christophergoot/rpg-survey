import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Header } from '../components/common/Header'
import { useGMSurveys, useDeleteSurvey } from '../hooks/useSurvey'

export const GMDashboard: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: surveys, isLoading, error } = useGMSurveys()
  const deleteSurvey = useDeleteSurvey()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (surveyId: string, surveyTitle: string) => {
    if (!window.confirm(t('dashboard.confirmDelete'))) {
      return
    }

    setDeletingId(surveyId)
    try {
      await deleteSurvey.mutateAsync(surveyId)
    } catch (err) {
      console.error('Failed to delete survey:', err)
      alert('Failed to delete survey. Please try again.')
    } finally {
      setDeletingId(null)
    }
  }

  const copyShareLink = (shareToken: string) => {
    const url = `${window.location.origin}${window.location.pathname}#/surveys/${shareToken}`
    navigator.clipboard.writeText(url)
    alert(t('survey.share.copied'))
  }

  return (
    <div className="min-h-screen bg-gradient-space">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-4xl font-bold text-white">{t('dashboard.title')}</h1>
          <Link
            to="/create"
            className="px-6 py-3 bg-cyber-500 hover:bg-cyber-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyber-500/30"
          >
            + {t('dashboard.createNew')}
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyber-500"></div>
            <p className="mt-4 text-gray-400">{t('common.loading')}</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-6 text-red-400">
            {t('errors.generic')}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && (!surveys || surveys.length === 0) && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              {t('dashboard.noSurveys')}
            </h2>
            <p className="text-gray-400 mb-8">{t('dashboard.getStartedMessage')}</p>
            <Link
              to="/create"
              className="inline-block px-6 py-3 bg-cyber-500 hover:bg-cyber-600 text-white font-semibold rounded-lg transition-colors"
            >
              {t('dashboard.createNew')}
            </Link>
          </div>
        )}

        {/* Surveys Grid */}
        {!isLoading && !error && surveys && surveys.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {surveys.map((survey) => (
              <div
                key={survey.id}
                className="bg-dark-surface rounded-lg border border-dark-elevated p-6 hover:border-cyber-500/50 transition-all"
              >
                {/* Survey Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {survey.title}
                    </h3>
                    {survey.description && (
                      <p className="text-gray-400 text-sm line-clamp-2">
                        {survey.description}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      survey.is_active
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {survey.is_active ? t('dashboard.active') : t('dashboard.inactive')}
                  </span>
                </div>

                {/* Survey Info */}
                <div className="mb-4 text-sm text-gray-400">
                  <p>
                    {t('dashboard.created', {
                      date: new Date(survey.created_at).toLocaleDateString()
                    })}
                  </p>
                  <p className="mt-1">
                    Languages: {survey.supported_languages.join(', ').toUpperCase()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => navigate(`/results/${survey.id}`)}
                    className="w-full px-4 py-2 bg-cyber-500/20 hover:bg-cyber-500/30 text-cyber-400 rounded transition-colors"
                  >
                    {t('dashboard.viewResults')}
                  </button>
                  <button
                    onClick={() => copyShareLink(survey.share_token)}
                    className="w-full px-4 py-2 bg-dark-elevated hover:bg-dark-bg text-gray-300 rounded transition-colors"
                  >
                    📋 {t('dashboard.shareSurvey')}
                  </button>
                  <button
                    onClick={() => handleDelete(survey.id, survey.title)}
                    disabled={deletingId === survey.id}
                    className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-colors disabled:opacity-50"
                  >
                    {deletingId === survey.id ? '...' : t('dashboard.deleteSurvey')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
