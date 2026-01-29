import React from 'react'
import type { SurveySummary } from '../../lib/types'

interface SummaryStatsProps {
  summary: SurveySummary
}

export const SummaryStats: React.FC<SummaryStatsProps> = ({ summary }) => {
  const topTheme =
    Object.entries(summary.themeCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A'
  const topCampaignLength =
    Object.entries(summary.campaignLengthCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ||
    'N/A'

  const formatCampaignLength = (key: string) => {
    const labels: Record<string, string> = {
      oneshot: 'One-Shot',
      short: 'Short Arc',
      medium: 'Medium Campaign',
      longterm: 'Long-Term'
    }
    return labels[key] || key
  }

  const formatTheme = (key: string) => {
    const labels: Record<string, string> = {
      scifi: 'Sci-Fi',
      fantasy: 'Fantasy',
      horror: 'Horror',
      modern: 'Modern',
      historical: 'Historical',
      cyberpunk: 'Cyberpunk',
      postapoc: 'Post-Apocalyptic'
    }
    return labels[key] || key
  }

  const stats = [
    {
      label: 'Total Responses',
      value: summary.totalResponses,
      icon: '👥'
    },
    {
      label: 'Most Popular Theme',
      value: formatTheme(topTheme),
      icon: '🎭'
    },
    {
      label: 'Avg Rules Complexity',
      value: summary.avgRulesComplexity.toFixed(1) + ' / 5',
      icon: '📚'
    },
    {
      label: 'Avg Experience Level',
      value: summary.avgExperienceLevel.toFixed(1) + ' / 5',
      icon: '⭐'
    },
    {
      label: 'Preferred Length',
      value: formatCampaignLength(topCampaignLength),
      icon: '📅'
    },
    {
      label: 'Combat Interest',
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
