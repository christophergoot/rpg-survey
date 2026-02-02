import React from 'react'
import { useTranslation } from 'react-i18next'
import type { SurveySummary } from '../../lib/types'

interface SummaryStatsProps {
  summary: SurveySummary
}

export const SummaryStats: React.FC<SummaryStatsProps> = ({ summary }) => {
  const { t } = useTranslation()

  const topTheme =
    Object.entries(summary.themeCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A'
  const topCampaignLength =
    Object.entries(summary.campaignLengthCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ||
    'N/A'

  const formatCampaignLength = (key: string) => {
    if (key === 'N/A') return t('common.na')
    return t(`results.values.campaignLength.${key}`)
  }

  const formatTheme = (key: string) => {
    if (key === 'N/A') return t('common.na')
    return t(`results.values.theme.${key}`)
  }

  const stats = [
    {
      label: t('results.stats.totalResponses'),
      value: summary.totalResponses,
      icon: '👥'
    },
    {
      label: t('results.stats.mostPopularTheme'),
      value: formatTheme(topTheme),
      icon: '🎭'
    },
    {
      label: t('results.stats.avgRulesComplexity'),
      value: summary.avgRulesComplexity.toFixed(1) + ' / 5',
      icon: '📚'
    },
    {
      label: t('results.stats.avgExperienceLevel'),
      value: summary.avgExperienceLevel.toFixed(1) + ' / 5',
      icon: '⭐'
    },
    {
      label: t('results.stats.preferredLength'),
      value: formatCampaignLength(topCampaignLength),
      icon: '📅'
    },
    {
      label: t('results.stats.combatInterest'),
      value: summary.avgActivityPreferences.combat.toFixed(1) + ' / 5',
      icon: '⚔️'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="p-4 bg-dark-surface rounded-lg border border-dark-elevated hover:border-cyber-500/50 transition-all"
        >
          <div className="text-3xl mb-2">{stat.icon}</div>
          <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
          <div className="text-sm text-gray-400">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
