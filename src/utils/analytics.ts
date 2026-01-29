import type { SurveyResponse, SurveySummary, SurveyAnswers } from '../lib/types'

/**
 * Calculate summary statistics from survey responses
 */
export const calculateSummary = (responses: SurveyResponse[]): SurveySummary => {
  if (responses.length === 0) {
    return {
      totalResponses: 0,
      themeCounts: {},
      avgRulesComplexity: 0,
      avgActivityPreferences: {
        combat: 0,
        puzzles: 0,
        diplomacy: 0,
        exploration: 0
      },
      combatStyleCounts: {},
      campaignLengthCounts: {},
      avgExperienceLevel: 0,
      tonePreferencesCounts: {},
      languageDistribution: {}
    }
  }

  const summary: SurveySummary = {
    totalResponses: responses.length,
    themeCounts: {},
    avgRulesComplexity: 0,
    avgActivityPreferences: {
      combat: 0,
      puzzles: 0,
      diplomacy: 0,
      exploration: 0
    },
    combatStyleCounts: {},
    campaignLengthCounts: {},
    avgExperienceLevel: 0,
    tonePreferencesCounts: {},
    languageDistribution: {}
  }

  let rulesComplexitySum = 0
  let experienceLevelSum = 0
  const activitySums = { combat: 0, puzzles: 0, diplomacy: 0, exploration: 0 }

  responses.forEach((response) => {
    const answers = response.answers as SurveyAnswers

    // Count themes
    if (answers.theme) {
      summary.themeCounts[answers.theme] = (summary.themeCounts[answers.theme] || 0) + 1
    }

    // Sum rules complexity
    if (answers.rules_complexity) {
      rulesComplexitySum += answers.rules_complexity
    }

    // Sum activity preferences
    if (answers.activity_preferences) {
      activitySums.combat += answers.activity_preferences.combat || 0
      activitySums.puzzles += answers.activity_preferences.puzzles || 0
      activitySums.diplomacy += answers.activity_preferences.diplomacy || 0
      activitySums.exploration += answers.activity_preferences.exploration || 0
    }

    // Count combat styles
    if (answers.combat_style) {
      summary.combatStyleCounts[answers.combat_style] =
        (summary.combatStyleCounts[answers.combat_style] || 0) + 1
    }

    // Count campaign lengths
    if (answers.campaign_length) {
      summary.campaignLengthCounts[answers.campaign_length] =
        (summary.campaignLengthCounts[answers.campaign_length] || 0) + 1
    }

    // Sum experience level
    if (answers.experience_level) {
      experienceLevelSum += answers.experience_level
    }

    // Count tone preferences (multi-select)
    if (answers.tone_preferences && Array.isArray(answers.tone_preferences)) {
      answers.tone_preferences.forEach((tone) => {
        summary.tonePreferencesCounts[tone] = (summary.tonePreferencesCounts[tone] || 0) + 1
      })
    }

    // Count language distribution
    const lang = response.language
    summary.languageDistribution[lang] = (summary.languageDistribution[lang] || 0) + 1
  })

  // Calculate averages
  summary.avgRulesComplexity = rulesComplexitySum / responses.length
  summary.avgExperienceLevel = experienceLevelSum / responses.length
  summary.avgActivityPreferences = {
    combat: activitySums.combat / responses.length,
    puzzles: activitySums.puzzles / responses.length,
    diplomacy: activitySums.diplomacy / responses.length,
    exploration: activitySums.exploration / responses.length
  }

  return summary
}

/**
 * Export responses to CSV format
 */
export const exportToCSV = (responses: SurveyResponse[]): string => {
  if (responses.length === 0) {
    return ''
  }

  // Get all unique answer keys from all responses
  const answerKeys = new Set<string>()
  responses.forEach((response) => {
    Object.keys(response.answers as SurveyAnswers).forEach((key) => answerKeys.add(key))
  })

  // Create CSV headers
  const headers = [
    'Response ID',
    'Player Name',
    'Submitted At',
    'Language',
    ...Array.from(answerKeys)
  ]

  // Create CSV rows
  const rows = responses.map((response) => {
    const answers = response.answers as Record<string, any>
    const row = [
      response.id,
      response.player_name || 'Anonymous',
      new Date(response.submitted_at).toLocaleString(),
      response.language,
      ...Array.from(answerKeys).map((key) => {
        const value = answers[key]
        if (value === null || value === undefined) return ''
        if (typeof value === 'object') return JSON.stringify(value)
        return String(value)
      })
    ]
    return row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
  })

  // Combine headers and rows
  return [headers.join(','), ...rows].join('\n')
}

/**
 * Download CSV file
 */
export const downloadCSV = (csv: string, filename: string): void => {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}
