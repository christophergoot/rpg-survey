import React from 'react'
import type { GroupInsights as GroupInsightsType } from '../../lib/types'

interface GroupInsightsProps {
  insights: GroupInsightsType
  totalResponses: number
}

export const GroupInsights: React.FC<GroupInsightsProps> = ({ insights, totalResponses }) => {
  if (totalResponses < 2) {
    return (
      <div className="p-6 bg-dark-surface rounded-lg border border-dark-elevated text-center">
        <div className="text-4xl mb-3">📊</div>
        <h3 className="text-lg font-semibold text-white mb-2">Group Insights</h3>
        <p className="text-gray-400">
          Need at least 2 responses to generate group insights and recommendations.
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
        <h2 className="text-2xl font-bold text-white">Group Insights</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Consensus Section */}
        <div className="p-6 bg-dark-surface rounded-lg border border-dark-elevated">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-xl">✅</span>
            Strong Consensus
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
                    <div className="text-white font-medium">{item.value}</div>
                    <div className="text-sm text-gray-400">
                      {item.field} ({item.count}/{item.total} players)
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">
              No strong consensus yet. Players have diverse preferences.
            </p>
          )}
        </div>

        {/* Conflicts Section */}
        <div className="p-6 bg-dark-surface rounded-lg border border-dark-elevated">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            Points to Discuss
          </h3>
          {hasConflicts ? (
            <ul className="space-y-4">
              {insights.conflicts.map((conflict, idx) => (
                <li key={idx} className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="font-medium text-yellow-400 mb-1">{conflict.field}</div>
                  <div className="text-sm text-gray-300 mb-2">{conflict.description}</div>
                  {conflict.values.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {conflict.values.map((v, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-dark-bg rounded text-xs text-gray-300"
                        >
                          {v.value}: {v.count}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">
              No major conflicts detected. The group seems well aligned!
            </p>
          )}
        </div>
      </div>

      {/* Correlations Section */}
      {hasCorrelations && (
        <div className="p-6 bg-dark-surface rounded-lg border border-dark-elevated">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="text-xl">📈</span>
            Correlation Insights
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
                      ? 'Strong'
                      : Math.abs(corr.coefficient) > 0.5
                        ? 'Moderate'
                        : 'Weak'}
                  </span>
                </div>
                <div className="text-sm text-gray-300">{corr.description}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {corr.coefficient > 0
                    ? 'Players who rate one higher tend to rate the other higher'
                    : 'Players who rate one higher tend to rate the other lower'}
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
            Recommended Game Systems
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
                      Best Match
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mb-3">{rec.description}</p>
                <div className="space-y-1">
                  {rec.matchReasons.map((reason, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="text-green-400">✓</span>
                      <span className="text-gray-300">{reason}</span>
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
            Session Zero Discussion Topics
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
                  {topic.priority.toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-white">{topic.topic}</div>
                  <div className="text-sm text-gray-400">{topic.reason}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
