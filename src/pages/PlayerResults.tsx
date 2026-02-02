import React, { useState } from 'react'
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
  const [copied, setCopied] = useState(false)

  const surveyUrl = `${window.location.origin}${window.location.pathname.replace(/\/results\/.*/, '')}/surveys/${shareToken}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(surveyUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

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
            <div className="flex items-center gap-4">
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-cyber-500 hover:bg-cyber-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('survey.share.copied')}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    {t('results.shareSurvey')}
                  </>
                )}
              </button>
              <LanguageSelector />
            </div>
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
              <button
                onClick={copyToClipboard}
                className="px-6 py-3 bg-cyber-500 hover:bg-cyber-600 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t('survey.share.copied')}
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    {t('results.shareSurvey')}
                  </>
                )}
              </button>
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
