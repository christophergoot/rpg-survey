import React from 'react'
import { useTranslation } from 'react-i18next'
import type { SurveyResponse } from '../../lib/types'
import { exportToCSV, downloadCSV } from '../../utils/analytics'

interface ExportButtonProps {
  responses: SurveyResponse[]
  surveyTitle: string
}

export const ExportButton: React.FC<ExportButtonProps> = ({ responses, surveyTitle }) => {
  const { t } = useTranslation()

  const handleExport = () => {
    if (responses.length === 0) {
      alert(t('results.noResponses'))
      return
    }

    const csv = exportToCSV(responses)
    const filename = `${surveyTitle.replace(/\s+/g, '_')}_responses_${
      new Date().toISOString().split('T')[0]
    }.csv`

    downloadCSV(csv, filename)
  }

  return (
    <button
      onClick={handleExport}
      disabled={responses.length === 0}
      className="px-4 py-2 bg-cyber-500 hover:bg-cyber-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      {t('results.export')}
    </button>
  )
}
