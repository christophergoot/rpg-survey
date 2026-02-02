import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSurveyByToken } from '../hooks/useSurvey'
import { useSurveyResponsesByToken } from '../hooks/useResponses'
import { calculateSummary, generateGroupInsights } from '../utils/analytics'
import { SummaryStats } from '../components/results/SummaryStats'
import { ThemeChart } from '../components/results/ThemeChart'
import { ActivityPreferencesChart } from '../components/results/ActivityPreferencesChart'
import { LanguageProficiencyStats } from '../components/results/LanguageProficiencyStats'
import { GroupInsights } from '../components/results/GroupInsights'
import { LanguageSelector } from '../components/common/LanguageSelector'
import '../lib/chartConfig'

export const PlayerResults: React.FC = () => {
  const { shareToken } = useParams<{ shareToken: string }>()
  const { t } = useTranslation()

  const { data: survey, isLoading: surveyLoading } = useSurveyByToken(shareToken!)
  const { data: responses = [], isLoading: responsesLoading } = useSurveyResponsesByToken(shareToken!)

  const summary = calculateSummary(responses)
  const insights = generateGroupInsights(responses, summary)

  // Loading state
  if (surveyLoading || responsesLoading) {
    return (
      <div className="min-h-screen bg-gradient-space">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyber-500"></div>
          <p className="mt-4 text-gray-400">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  // Error state
  if (!survey) {
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

  return (
    <div className="min-h-screen bg-gradient-space">
      {/* Header */}
      <div className="bg-dark-surface border-b border-dark-elevated">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link
                to={`/surveys/${shareToken}`}
                className="text-gray-400 hover:text-white mb-2 flex items-center gap-2 text-sm"
              >
                ← {t('common.back')}
              </Link>
              <h1 className="text-2xl font-bold text-white">{survey.title}</h1>
              {survey.description && (
                <p className="text-gray-400 mt-1">{survey.description}</p>
              )}
            </div>
            <LanguageSelector />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📊</span>
            <h2 className="text-3xl font-bold text-white">{t('results.groupSummary')}</h2>
          </div>

          {/* Total Responses Counter */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyber-500/10 border border-cyber-500/30 rounded-lg">
            <span className="text-2xl">👥</span>
            <span className="text-lg font-semibold text-white">
              {t('results.totalResponses', { count: responses.length })}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Summary Stats */}
          <SummaryStats summary={summary} />

          {/* Charts */}
          {responses.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-dark-surface rounded-lg border border-dark-elevated p-6">
                  <ThemeChart themeCounts={summary.themeCounts} />
                </div>
                <div className="bg-dark-surface rounded-lg border border-dark-elevated p-6">
                  <ActivityPreferencesChart
                    avgActivityPreferences={summary.avgActivityPreferences}
                  />
                </div>
              </div>

              {/* Language Proficiency */}
              <LanguageProficiencyStats
                avgLanguageProficiency={summary.avgLanguageProficiency}
              />

              {/* Group Insights */}
              <GroupInsights insights={insights} totalResponses={responses.length} />
            </>
          ) : (
            <div className="text-center py-12 bg-dark-surface rounded-lg border border-dark-elevated">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {t('results.noResponses')}
              </h3>
              <p className="text-gray-400 mb-6">{t('results.noResponsesMessage')}</p>
            </div>
          )}
        </div>

        {/* Footer note */}
        <div className="mt-12 p-4 bg-dark-surface rounded-lg border border-dark-elevated text-center">
          <p className="text-gray-400 text-sm">
            {t('results.playerNote')}
          </p>
        </div>
      </div>
    </div>
  )
}
