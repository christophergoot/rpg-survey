import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useUpdatePlayerName, useDeleteResponse } from '../../hooks/useResponses'
import type { SurveyResponse, SurveyAnswers } from '../../lib/types'

interface ResponseListProps {
  responses: SurveyResponse[]
  surveyId: string
}

export const ResponseList: React.FC<ResponseListProps> = ({ responses, surveyId }) => {
  const { t } = useTranslation()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editedName, setEditedName] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const updatePlayerName = useUpdatePlayerName()
  const deleteResponse = useDeleteResponse()

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

  const LANGUAGE_NAMES: Record<string, string> = {
    en: 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    pt: 'Portuguese'
  }

  const PROFICIENCY_LABELS: Record<number, string> = {
    0: 'None',
    1: 'Beginner',
    2: 'Elementary',
    3: 'Intermediate',
    4: 'Advanced',
    5: 'Native'
  }

  const formatLanguageProficiency = (proficiency: Record<string, number> | undefined): React.ReactNode => {
    if (!proficiency || Object.keys(proficiency).length === 0) return null

    return (
      <div className="flex flex-wrap gap-2">
        {Object.entries(proficiency).map(([lang, level]) => (
          <div
            key={lang}
            className="flex items-center gap-1.5 px-2 py-1 bg-dark-bg rounded-md border border-dark-elevated"
          >
            <span className="text-xs text-gray-400">{LANGUAGE_NAMES[lang] || lang.toUpperCase()}:</span>
            <span className={`text-xs font-medium ${level >= 3 ? 'text-green-400' : level >= 1 ? 'text-yellow-400' : 'text-red-400'}`}>
              {PROFICIENCY_LABELS[level] || level}
            </span>
          </div>
        ))}
      </div>
    )
  }

  const handleStartRename = (response: SurveyResponse, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingId(response.id)
    setEditedName(response.player_name || '')
  }

  const handleSaveRename = async (responseId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (editedName.trim()) {
      await updatePlayerName.mutateAsync({
        responseId,
        playerName: editedName.trim(),
        surveyId
      })
    }
    setEditingId(null)
    setEditedName('')
  }

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingId(null)
    setEditedName('')
  }

  const handleDeleteClick = (responseId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleteConfirmId(responseId)
  }

  const handleConfirmDelete = async (responseId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    await deleteResponse.mutateAsync({ responseId, surveyId })
    setDeleteConfirmId(null)
  }

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDeleteConfirmId(null)
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
        const isEditing = editingId === response.id
        const isDeleting = deleteConfirmId === response.id
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
              <div className="flex items-center gap-4 flex-1">
                <div className="text-2xl">👤</div>
                <div className="text-left flex-1">
                  {isEditing ? (
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="px-3 py-1 bg-dark-bg border border-cyber-500 rounded text-white focus:outline-none focus:border-cyber-400"
                        autoFocus
                      />
                      <button
                        onClick={(e) => handleSaveRename(response.id, e)}
                        className="px-3 py-1 bg-cyber-500 hover:bg-cyber-600 text-white text-sm rounded transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelRename}
                        className="px-3 py-1 bg-dark-elevated hover:bg-dark-bg text-white text-sm rounded transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="font-semibold text-white">
                        {response.player_name || 'Anonymous Player'}
                      </div>
                      <div className="text-sm text-gray-400 mb-1">
                        {new Date(response.submitted_at).toLocaleString()} •{' '}
                        {response.language.toUpperCase()}
                      </div>
                      {answers.language_proficiency && (
                        <div className="mt-1">
                          {formatLanguageProficiency(answers.language_proficiency)}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                {!isEditing && !isDeleting && (
                  <>
                    <button
                      onClick={(e) => handleStartRename(response, e)}
                      className="p-2 hover:bg-dark-bg rounded transition-colors"
                      title="Rename player"
                    >
                      <svg
                        className="w-5 h-5 text-gray-400 hover:text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleDeleteClick(response.id, e)}
                      className="p-2 hover:bg-dark-bg rounded transition-colors"
                      title="Delete response"
                    >
                      <svg
                        className="w-5 h-5 text-gray-400 hover:text-red-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </>
                )}

                {isDeleting && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-red-400 mr-2">Delete?</span>
                    <button
                      onClick={(e) => handleConfirmDelete(response.id, e)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition-colors"
                    >
                      Yes
                    </button>
                    <button
                      onClick={handleCancelDelete}
                      className="px-3 py-1 bg-dark-elevated hover:bg-dark-bg text-white text-sm rounded transition-colors"
                    >
                      No
                    </button>
                  </div>
                )}

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
              </div>
            </button>

            {/* Response Details */}
            {isExpanded && (
              <div className="border-t border-dark-elevated p-4 space-y-3">
                {Object.entries(answers).map(([key, value]) => (
                  <div key={key} className="flex flex-col gap-1">
                    <div className="text-sm font-medium text-gray-400">
                      {formatQuestionKey(key)}
                    </div>
                    {key === 'language_proficiency' ? (
                      formatLanguageProficiency(value as Record<string, number>)
                    ) : (
                      <div className="text-white">{formatAnswer(key, value)}</div>
                    )}
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
