import React from 'react'
import { useTranslation } from 'react-i18next'
import type { GroupInsights as GroupInsightsType, MatchReason } from '../../lib/types'

interface GroupInsightsProps {
  insights: GroupInsightsType
  totalResponses: number
}

// Map field keys to translation keys
const FIELD_TRANSLATION_MAP: Record<string, string> = {
  combat_style: 'results.insights.fields.combatStyle',
  campaign_length: 'results.insights.fields.campaignLength',
  session_frequency: 'results.insights.fields.sessionFrequency',
  character_creation: 'results.insights.fields.characterCreation',
  theme: 'results.insights.fields.theme',
  tone_preferences: 'results.insights.fields.tonePreferences',
  rules_complexity: 'results.insights.fields.rulesComplexity',
  experience_level: 'results.insights.fields.experienceLevel',
  content_boundaries: 'results.insights.fields.contentBoundaries'
}

// Map value keys to translation keys for each field type
const VALUE_TRANSLATION_MAP: Record<string, Record<string, string>> = {
  theme: {
    scifi: 'results.values.theme.scifi',
    fantasy: 'results.values.theme.fantasy',
    horror: 'results.values.theme.horror',
    modern: 'results.values.theme.modern',
    historical: 'results.values.theme.historical',
    cyberpunk: 'results.values.theme.cyberpunk',
    postapoc: 'results.values.theme.postapoc'
  },
  campaign_length: {
    oneshot: 'results.values.campaignLength.oneshot',
    short: 'results.values.campaignLength.short',
    medium: 'results.values.campaignLength.medium',
    longterm: 'results.values.campaignLength.longterm'
  },
  combat_style: {
    narrative: 'results.values.combatStyle.narrative',
    tactical: 'results.values.combatStyle.tactical',
    hybrid: 'results.values.combatStyle.hybrid'
  },
  tone_preferences: {
    serious: 'results.values.tone.serious',
    lighthearted: 'results.values.tone.lighthearted',
    heroic: 'results.values.tone.heroic',
    gritty: 'results.values.tone.gritty',
    mysterious: 'results.values.tone.mysterious'
  },
  session_frequency: {
    weekly: 'results.values.sessionFrequency.weekly',
    biweekly: 'results.values.sessionFrequency.biweekly',
    monthly: 'results.values.sessionFrequency.monthly',
    flexible: 'results.values.sessionFrequency.flexible'
  },
  character_creation: {
    pregen: 'results.values.characterCreation.pregen',
    collaborative: 'results.values.characterCreation.collaborative',
    full_control: 'results.values.characterCreation.fullControl'
  },
  content_boundaries: {
    gore: 'results.values.contentBoundaries.gore',
    horror: 'results.values.contentBoundaries.horror',
    romance: 'results.values.contentBoundaries.romance',
    political: 'results.values.contentBoundaries.political',
    none: 'results.values.contentBoundaries.none'
  }
}

export const GroupInsights: React.FC<GroupInsightsProps> = ({ insights, totalResponses }) => {
  const { t } = useTranslation()

  // Helper function to translate field keys
  const translateField = (fieldKey: string): string => {
    const translationKey = FIELD_TRANSLATION_MAP[fieldKey]
    return translationKey ? t(translationKey) : fieldKey
  }

  // Helper function to translate value keys based on field
  const translateValue = (fieldKey: string, valueKey: string): string => {
    const fieldMap = VALUE_TRANSLATION_MAP[fieldKey]
    if (fieldMap && fieldMap[valueKey]) {
      return t(fieldMap[valueKey])
    }
    // For theme values, also check under 'theme' map as they might come from multi-select
    if (VALUE_TRANSLATION_MAP.theme[valueKey]) {
      return t(VALUE_TRANSLATION_MAP.theme[valueKey])
    }
    return valueKey
  }

  // Helper function to translate match reasons
  const translateMatchReason = (reason: MatchReason): string => {
    if (reason.params) {
      // Translate theme/activity params if needed
      const params: Record<string, string> = {}
      for (const [key, value] of Object.entries(reason.params)) {
        if (key === 'theme' && VALUE_TRANSLATION_MAP.theme[value]) {
          params[key] = t(VALUE_TRANSLATION_MAP.theme[value])
        } else if (key === 'style' && VALUE_TRANSLATION_MAP.combat_style[value]) {
          params[key] = t(VALUE_TRANSLATION_MAP.combat_style[value])
        } else if (key === 'activity') {
          // Translate activity names
          const activityKey = `results.values.activity.${value}`
          params[key] = t(activityKey)
        } else {
          params[key] = value
        }
      }
      return t(reason.key, params)
    }
    return t(reason.key)
  }

  if (totalResponses < 2) {
    return (
      <div className="p-6 bg-dark-surface rounded-lg border border-dark-elevated text-center">
        <div className="text-4xl mb-3">📊</div>
        <h3 className="text-lg font-semibold text-white mb-2">{t('results.insights.title')}</h3>
        <p className="text-gray-400">
          {t('results.insights.needMoreResponses')}
        </p>
      </div>
    )
  }

  const hasConsensus = insights.consensus.length > 0
  const hasConflicts = insights.conflicts.length > 0
  const hasCorrelations = insights.correlations.length > 0
  const hasRecommendations = insights.recommendations.length > 0
  const hasTopics = insights.sessionZeroTopics.length > 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">🎯</span>
        <h2 className="text-2xl font-bold text-white">{t('results.insights.title')}</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Consensus Section */}
        <div className="p-6 bg-dark-surface rounded-lg border border-dark-elevated">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-xl">✅</span>
            {t('results.insights.strongConsensus')}
          </h3>
          {hasConsensus ? (
            <ul className="space-y-3">
              {insights.consensus.slice(0, 5).map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-400 font-bold">
                      {Math.round(item.percentage * 100)}%
                    </span>
                  </div>
                  <div>
                    <div className="text-white font-medium">{translateValue(item.fieldKey, item.valueKey)}</div>
                    <div className="text-sm text-gray-400">
                      {translateField(item.fieldKey)} ({t('results.insights.playersCount', { count: item.count, total: item.total })})
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">
              {t('results.insights.noConsensus')}
            </p>
          )}
        </div>

        {/* Conflicts Section */}
        <div className="p-6 bg-dark-surface rounded-lg border border-dark-elevated">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            {t('results.insights.pointsToDiscuss')}
          </h3>
          {hasConflicts ? (
            <ul className="space-y-4">
              {insights.conflicts.map((conflict, idx) => (
                <li key={idx} className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="font-medium text-yellow-400 mb-1">{translateField(conflict.fieldKey)}</div>
                  <div className="text-sm text-gray-300 mb-2">
                    {t(conflict.descriptionKey, conflict.descriptionParams || {})}
                  </div>
                  {conflict.values.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {conflict.values.map((v, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-dark-bg rounded text-xs text-gray-300"
                        >
                          {translateValue(conflict.fieldKey, v.valueKey)}: {v.count}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">
              {t('results.insights.noConflicts')}
            </p>
          )}
        </div>
      </div>

      {/* Correlations Section */}
      {hasCorrelations && (
        <div className="p-6 bg-dark-surface rounded-lg border border-dark-elevated">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-xl">📈</span>
            {t('results.insights.correlations')}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.correlations.map((corr, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${
                  corr.coefficient > 0
                    ? 'bg-cyan-500/10 border-cyan-500/30'
                    : 'bg-purple-500/10 border-purple-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-2xl font-bold ${
                      corr.coefficient > 0 ? 'text-cyan-400' : 'text-purple-400'
                    }`}
                  >
                    {corr.coefficient > 0 ? '+' : ''}
                    {corr.coefficient.toFixed(2)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {Math.abs(corr.coefficient) > 0.7
                      ? t('results.insights.correlationStrong')
                      : Math.abs(corr.coefficient) > 0.5
                        ? t('results.insights.correlationModerate')
                        : t('results.insights.correlationWeak')}
                  </span>
                </div>
                <div className="text-sm text-gray-300">{t(corr.descriptionKey)}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {corr.coefficient > 0
                    ? t('results.insights.correlationPositive')
                    : t('results.insights.correlationNegative')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Game System Recommendations */}
      {hasRecommendations && (
        <div className="p-6 bg-dark-surface rounded-lg border border-dark-elevated">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-xl">🎮</span>
            {t('results.insights.recommendations')}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.recommendations.map((rec, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${
                  idx === 0
                    ? 'bg-cyber-500/10 border-cyber-500/50'
                    : 'bg-dark-bg border-dark-elevated'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-white">{rec.name}</h4>
                  {idx === 0 && (
                    <span className="px-2 py-0.5 bg-cyber-500 text-white text-xs rounded-full">
                      {t('results.insights.bestMatch')}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mb-3">{t(rec.descriptionKey)}</p>
                <div className="space-y-1">
                  {rec.matchReasons.map((reason, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-300">{translateMatchReason(reason)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-dark-elevated">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-dark-elevated rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cyber-500 rounded-full"
                        style={{ width: `${rec.matchScore}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">{rec.matchScore}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Session Zero Topics */}
      {hasTopics && (
        <div className="p-6 bg-dark-surface rounded-lg border border-dark-elevated">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-xl">📋</span>
            {t('results.insights.sessionZeroTopics')}
          </h3>
          <div className="space-y-3">
            {insights.sessionZeroTopics.map((topic, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border flex items-start gap-4 ${
                  topic.priority === 'high'
                    ? 'bg-red-500/10 border-red-500/30'
                    : topic.priority === 'medium'
                      ? 'bg-yellow-500/10 border-yellow-500/30'
                      : 'bg-dark-bg border-dark-elevated'
                }`}
              >
                <div
                  className={`flex-shrink-0 px-2 py-1 rounded text-xs font-medium ${
                    topic.priority === 'high'
                      ? 'bg-red-500/20 text-red-400'
                      : topic.priority === 'medium'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-gray-500/20 text-gray-400'
                  }`}
                >
                  {t(`results.insights.priority.${topic.priority}`)}
                </div>
                <div>
                  <div className="font-medium text-white">{translateField(topic.topicKey)}</div>
                  <div className="text-sm text-gray-400">
                    {t(topic.reasonKey, topic.reasonParams || {})}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
