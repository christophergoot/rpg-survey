import React from 'react'

interface LanguageProficiencyStatsProps {
  avgLanguageProficiency: Record<string, number>
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

const getProficiencyLabel = (level: number): string => {
  const rounded = Math.round(level)
  return PROFICIENCY_LABELS[rounded] || `Level ${level.toFixed(1)}`
}

const getProficiencyColor = (level: number): string => {
  if (level >= 4) return 'text-green-400'
  if (level >= 3) return 'text-cyan-400'
  if (level >= 2) return 'text-yellow-400'
  if (level >= 1) return 'text-orange-400'
  return 'text-red-400'
}

export const LanguageProficiencyStats: React.FC<LanguageProficiencyStatsProps> = ({
  avgLanguageProficiency
}) => {
  const hasLanguageProficiency = Object.keys(avgLanguageProficiency).length > 0

  if (!hasLanguageProficiency) {
    return null
  }

  return (
    <div className="p-6 bg-dark-surface rounded-lg border border-dark-elevated">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="text-2xl">🗣️</span>
        Average Language Proficiency
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Object.entries(avgLanguageProficiency)
          .sort(([, a], [, b]) => b - a)
          .map(([lang, level]) => (
            <div
              key={lang}
              className="p-4 bg-dark-bg rounded-lg border border-dark-elevated"
            >
              <div className="text-sm text-gray-400 mb-1">
                {LANGUAGE_NAMES[lang] || lang.toUpperCase()}
              </div>
              <div className={`text-2xl font-bold ${getProficiencyColor(level)}`}>
                {level.toFixed(1)}
              </div>
              <div className={`text-sm ${getProficiencyColor(level)}`}>
                {getProficiencyLabel(level)}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
