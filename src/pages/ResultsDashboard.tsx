import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Header } from '../components/common/Header'
import { ShareButton, getSurveyShareUrl, getResultsShareUrl } from '../components/common/ShareButton'
import { useSurveyById } from '../hooks/useSurvey'
import { useSurveyResponses } from '../hooks/useResponses'
import { calculateSummary, generateGroupInsights } from '../utils/analytics'
import { SummaryStats } from '../components/results/SummaryStats'
import { ThemeChart } from '../components/results/ThemeChart'
import { ActivityPreferencesChart } from '../components/results/ActivityPreferencesChart'
import { LanguageProficiencyStats } from '../components/results/LanguageProficiencyStats'
import { GroupInsights } from '../components/results/GroupInsights'
import { ResponseList } from '../components/results/ResponseList'
import { ExportButton } from '../components/results/ExportButton'
import '../lib/chartConfig' // Import to register Chart.js components

export const ResultsDashboard: React.FC = () => {
  const { surveyId } = useParams<{ surveyId: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const { data: survey, isLoading: surveyLoading } = useSurveyById(surveyId!)
  const { data: responses = [], isLoading: responsesLoading } = useSurveyResponses(surveyId!)

  const [activeTab, setActiveTab] = useState<'summary' | 'individual'>('summary')

  const summary = calculateSummary(responses)
  const insights = generateGroupInsights(responses, summary)

  // Loading state
  if (surveyLoading || responsesLoading) {
    return (
      <div className="min-h-screen bg-gradient-space">
        <Header />
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
      <div className="min-h-screen bg-gradient-space">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-white mb-2">Survey not found</h1>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-6 py-3 bg-cyber-500 hover:bg-cyber-600 text-white font-semibold rounded-lg transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-space">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Survey Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-gray-400 hover:text-white mb-2 flex items-center gap-2"
              >
                ← {t('common.back')}
              </button>
              <h1 className="text-4xl font-bold text-white">{survey.title}</h1>
              {survey.description && (
                <p className="text-gray-400 mt-2">{survey.description}</p>
              )}
            </div>
            <div className="flex gap-3">
              <ShareButton
                url={getSurveyShareUrl(survey.share_token)}
                label={t('results.shareSurvey')}
                variant="secondary"
              />
              <ShareButton
                url={getResultsShareUrl(survey.share_token)}
                label={t('results.shareResults')}
                variant="secondary"
                icon="chart"
              />
              <ExportButton responses={responses} surveyTitle={survey.title} />
            </div>
          </div>

          {/* Total Responses Counter */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyber-500/10 border border-cyber-500/30 rounded-lg">
            <span className="text-2xl">📊</span>
            <span className="text-lg font-semibold text-white">
              {t('results.totalResponses', { count: responses.length })}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-dark-elevated">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'summary'
                ? 'text-cyber-400 border-b-2 border-cyber-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t('results.summary')}
          </button>
          <button
            onClick={() => setActiveTab('individual')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'individual'
                ? 'text-cyber-400 border-b-2 border-cyber-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t('results.individual')}
          </button>
        </div>

        {/* Content */}
        {activeTab === 'summary' ? (
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
                <ShareButton
                  url={getSurveyShareUrl(survey.share_token)}
                  label={t('results.shareSurvey')}
                />
              </div>
            )}
          </div>
        ) : (
          <ResponseList responses={responses} surveyId={surveyId!} />
        )}
      </div>
    </div>
  )
}
