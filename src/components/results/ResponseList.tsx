import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { SurveyResponse, SurveyAnswers } from '../../lib/types'

interface ResponseListProps {
  responses: SurveyResponse[]
}

export const ResponseList: React.FC<ResponseListProps> = ({ responses }) => {
  const { t } = useTranslation()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const formatAnswer = (_key: string, value: any): string => {
    if (value === null || value === undefined) return 'Not answered'

    if (Array.isArray(value)) {
      return value.join(', ')
    }

    if (typeof value === 'object') {
      return Object.entries(value)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ')
    }

    return String(value)
  }

  const formatQuestionKey = (key: string): string => {
    return key
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  if (responses.length === 0) {
    return (
      <div className="text-center py-12 bg-dark-surface rounded-lg border border-dark-elevated">
        <div className="text-6xl mb-4">📭</div>
        <h3 className="text-xl font-semibold text-white mb-2">
          {t('results.noResponses')}
        </h3>
        <p className="text-gray-400">{t('results.noResponsesMessage')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {responses.map((response) => {
        const isExpanded = expandedId === response.id
        const answers = response.answers as SurveyAnswers

        return (
          <div
            key={response.id}
            className="bg-dark-surface rounded-lg border border-dark-elevated overflow-hidden"
          >
            {/* Response Header */}
            <button
              onClick={() => setExpandedId(isExpanded ? null : response.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-dark-elevated transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="text-2xl">👤</div>
                <div className="text-left">
                  <div className="font-semibold text-white">
                    {response.player_name || 'Anonymous Player'}
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(response.submitted_at).toLocaleString()} •{' '}
                    {response.language.toUpperCase()}
                  </div>
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* Response Details */}
            {isExpanded && (
              <div className="border-t border-dark-elevated p-4 space-y-3">
                {Object.entries(answers).map(([key, value]) => (
                  <div key={key} className="flex flex-col gap-1">
                    <div className="text-sm font-medium text-gray-400">
                      {formatQuestionKey(key)}
                    </div>
                    <div className="text-white">{formatAnswer(key, value)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
