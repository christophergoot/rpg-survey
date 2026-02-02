import type {
  SurveyResponse,
  SurveySummary,
  SurveyAnswers,
  GroupInsights,
  ConsensusItem,
  ConflictItem,
  Correlation,
  GameSystemRecommendation,
  SessionZeroTopic,
  MatchReason
} from '../lib/types'

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
      languageDistribution: {},
      avgLanguageProficiency: {}
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
    languageDistribution: {},
    avgLanguageProficiency: {}
  }

  let rulesComplexitySum = 0
  let experienceLevelSum = 0
  const activitySums = { combat: 0, puzzles: 0, diplomacy: 0, exploration: 0 }
  const languageProficiencySums: Record<string, number> = {}
  const languageProficiencyCounts: Record<string, number> = {}

  responses.forEach((response) => {
    const answers = response.answers as SurveyAnswers

    // Count themes (multi-select)
    if (answers.theme && Array.isArray(answers.theme)) {
      answers.theme.forEach((theme) => {
        summary.themeCounts[theme] = (summary.themeCounts[theme] || 0) + 1
      })
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

    // Sum language proficiency
    if (answers.language_proficiency) {
      Object.entries(answers.language_proficiency).forEach(([language, level]) => {
        languageProficiencySums[language] = (languageProficiencySums[language] || 0) + level
        languageProficiencyCounts[language] = (languageProficiencyCounts[language] || 0) + 1
      })
    }
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

  // Calculate average language proficiency
  Object.keys(languageProficiencySums).forEach((language) => {
    summary.avgLanguageProficiency[language] =
      languageProficiencySums[language] / languageProficiencyCounts[language]
  })

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

// ============================================
// Advanced Analytics - Group Insights
// ============================================

/**
 * Calculate Pearson correlation coefficient between two numeric arrays
 */
const calculateCorrelation = (x: number[], y: number[]): number => {
  if (x.length !== y.length || x.length < 2) return 0

  const n = x.length
  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = y.reduce((a, b) => a + b, 0)
  const sumXY = x.reduce((total, xi, i) => total + xi * y[i], 0)
  const sumX2 = x.reduce((total, xi) => total + xi * xi, 0)
  const sumY2 = y.reduce((total, yi) => total + yi * yi, 0)

  const numerator = n * sumXY - sumX * sumY
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))

  if (denominator === 0) return 0
  return numerator / denominator
}

/**
 * Calculate variance of an array
 */
const calculateVariance = (values: number[]): number => {
  if (values.length === 0) return 0
  const avg = values.reduce((a, b) => a + b, 0) / values.length
  return values.reduce((sum, v) => sum + (v - avg) ** 2, 0) / values.length
}

/**
 * Detect consensus items (>60% agreement)
 */
const detectConsensus = (responses: SurveyResponse[]): ConsensusItem[] => {
  const consensus: ConsensusItem[] = []
  const total = responses.length
  if (total < 2) return consensus

  const CONSENSUS_THRESHOLD = 0.6

  // Check single-choice fields
  const singleChoiceFields = ['combat_style', 'campaign_length', 'session_frequency', 'character_creation']

  singleChoiceFields.forEach((field) => {
    const counts: Record<string, number> = {}
    responses.forEach((r) => {
      const value = (r.answers as SurveyAnswers)[field as keyof SurveyAnswers] as string
      if (value) {
        counts[value] = (counts[value] || 0) + 1
      }
    })

    Object.entries(counts).forEach(([value, count]) => {
      const percentage = count / total
      if (percentage >= CONSENSUS_THRESHOLD) {
        consensus.push({
          fieldKey: field,
          valueKey: value,
          percentage,
          count,
          total
        })
      }
    })
  })

  // Check multi-select fields for strong preferences
  const multiSelectFields = ['theme', 'tone_preferences']

  multiSelectFields.forEach((field) => {
    const counts: Record<string, number> = {}
    responses.forEach((r) => {
      const values = (r.answers as SurveyAnswers)[field as keyof SurveyAnswers] as string[]
      if (values && Array.isArray(values)) {
        values.forEach((v) => {
          counts[v] = (counts[v] || 0) + 1
        })
      }
    })

    Object.entries(counts).forEach(([value, count]) => {
      const percentage = count / total
      if (percentage >= CONSENSUS_THRESHOLD) {
        consensus.push({
          fieldKey: field,
          valueKey: value,
          percentage,
          count,
          total
        })
      }
    })
  })

  // Sort by percentage descending
  return consensus.sort((a, b) => b.percentage - a.percentage)
}

/**
 * Detect conflicts (high variance or split preferences)
 */
const detectConflicts = (responses: SurveyResponse[]): ConflictItem[] => {
  const conflicts: ConflictItem[] = []
  const total = responses.length
  if (total < 2) return conflicts

  // Check numeric fields for high variance
  const numericFields = ['rules_complexity', 'experience_level']

  numericFields.forEach((key) => {
    const values: number[] = []
    responses.forEach((r) => {
      const value = (r.answers as SurveyAnswers)[key as keyof SurveyAnswers] as number
      if (value !== undefined && value !== null) {
        values.push(value)
      }
    })

    if (values.length >= 2) {
      const variance = calculateVariance(values)
      const min = Math.min(...values)
      const max = Math.max(...values)

      // High variance threshold (>1.5 on a 1-5 scale means significant spread)
      if (variance > 1.5 || (max - min >= 3)) {
        conflicts.push({
          fieldKey: key,
          descriptionKey: 'results.insights.conflicts.varyWidely',
          descriptionParams: { min, max },
          values: [],
          variance
        })
      }
    }
  })

  // Check single-choice fields for splits
  const singleChoiceFields = ['combat_style', 'campaign_length', 'character_creation']

  singleChoiceFields.forEach((field) => {
    const counts: Record<string, number> = {}
    responses.forEach((r) => {
      const value = (r.answers as SurveyAnswers)[field as keyof SurveyAnswers] as string
      if (value) {
        counts[value] = (counts[value] || 0) + 1
      }
    })

    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1])

    // Check if top two options are close (within 1 vote or both > 30%)
    if (entries.length >= 2) {
      const [first, second] = entries
      const firstPct = first[1] / total
      const secondPct = second[1] / total

      if (secondPct >= 0.3 && firstPct < 0.6) {
        conflicts.push({
          fieldKey: field,
          descriptionKey: 'results.insights.conflicts.splitBetweenOptions',
          values: entries.map(([value, count]) => ({
            valueKey: value,
            count
          }))
        })
      }
    }
  })

  // Check content boundaries for differing comfort levels
  const boundaryDifferences: Record<string, number> = {}
  responses.forEach((r) => {
    const boundaries = (r.answers as SurveyAnswers).content_boundaries as string[]
    if (boundaries && Array.isArray(boundaries)) {
      boundaries.forEach((b) => {
        boundaryDifferences[b] = (boundaryDifferences[b] || 0) + 1
      })
    }
  })

  // If some players have boundaries others don't, flag it
  Object.entries(boundaryDifferences).forEach(([_boundary, count]) => {
    if (count > 0 && count < total) {
      const existing = conflicts.find((c) => c.fieldKey === 'content_boundaries')
      if (!existing) {
        conflicts.push({
          fieldKey: 'content_boundaries',
          descriptionKey: 'results.insights.conflicts.differentComfortLevels',
          values: Object.entries(boundaryDifferences).map(([value, cnt]) => ({
            valueKey: value,
            count: cnt
          }))
        })
      }
    }
  })

  return conflicts
}

/**
 * Calculate correlations between numeric fields
 */
const calculateCorrelations = (responses: SurveyResponse[]): Correlation[] => {
  const correlations: Correlation[] = []
  if (responses.length < 3) return correlations

  // Extract numeric values
  const data: Record<string, number[]> = {
    experience: [],
    rules_complexity: [],
    combat: [],
    puzzles: [],
    diplomacy: [],
    exploration: []
  }

  responses.forEach((r) => {
    const answers = r.answers as SurveyAnswers
    if (answers.experience_level) data.experience.push(answers.experience_level)
    if (answers.rules_complexity) data.rules_complexity.push(answers.rules_complexity)
    if (answers.activity_preferences) {
      data.combat.push(answers.activity_preferences.combat || 0)
      data.puzzles.push(answers.activity_preferences.puzzles || 0)
      data.diplomacy.push(answers.activity_preferences.diplomacy || 0)
      data.exploration.push(answers.activity_preferences.exploration || 0)
    }
  })

  // Calculate interesting correlations
  const pairs = [
    {
      f1: 'experience',
      f2: 'rules_complexity',
      descKey: 'results.insights.correlationDescriptions.experienceVsComplexity'
    },
    {
      f1: 'experience',
      f2: 'combat',
      descKey: 'results.insights.correlationDescriptions.experienceVsCombat'
    },
    {
      f1: 'rules_complexity',
      f2: 'combat',
      descKey: 'results.insights.correlationDescriptions.complexityVsCombat'
    },
    {
      f1: 'combat',
      f2: 'exploration',
      descKey: 'results.insights.correlationDescriptions.combatVsExploration'
    },
    {
      f1: 'puzzles',
      f2: 'diplomacy',
      descKey: 'results.insights.correlationDescriptions.puzzlesVsDiplomacy'
    }
  ]

  pairs.forEach(({ f1, f2, descKey }) => {
    if (data[f1].length >= 3 && data[f2].length >= 3) {
      const coef = calculateCorrelation(data[f1], data[f2])
      // Only report meaningful correlations (|r| > 0.4)
      if (Math.abs(coef) > 0.4) {
        correlations.push({
          field1: f1,
          field2: f2,
          coefficient: coef,
          descriptionKey: descKey
        })
      }
    }
  })

  return correlations.sort((a, b) => Math.abs(b.coefficient) - Math.abs(a.coefficient))
}

/**
 * Convert game name to translation key
 */
const gameNameToKey = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
}

/**
 * Game system recommendation database
 */
interface GameSystem {
  name: string
  description: string // English description (used as fallback)
  themes: string[]
  complexity: [number, number] // min-max range
  combatStyle: string[]
  strengths: string[]
}

const GAME_SYSTEMS: GameSystem[] = [
  {
    name: 'Starfinder',
    description: 'Sci-fi adventure with tactical combat and deep character options',
    themes: ['scifi'],
    complexity: [3, 4],
    combatStyle: ['tactical', 'hybrid'],
    strengths: ['combat', 'exploration']
  },
  {
    name: 'Stars Without Number',
    description: 'Old-school sci-fi with sandbox gameplay and faction rules',
    themes: ['scifi'],
    complexity: [2, 3],
    combatStyle: ['hybrid', 'narrative'],
    strengths: ['exploration', 'diplomacy']
  },
  {
    name: 'Worlds Without Number',
    description: 'Old-school fantasy with sandbox tools and faction rules',
    themes: ['fantasy'],
    complexity: [2, 3],
    combatStyle: ['hybrid', 'tactical'],
    strengths: ['exploration', 'combat']
  },
  {
    name: 'Cities Without Number',
    description: 'Cyberpunk sandbox with Crawford\'s faction and world-building tools',
    themes: ['cyberpunk'],
    complexity: [2, 3],
    combatStyle: ['hybrid', 'tactical'],
    strengths: ['exploration', 'diplomacy']
  },
  {
    name: 'Ashes Without Number',
    description: 'Post-apocalyptic survival with zombies and faction play',
    themes: ['postapoc', 'horror'],
    complexity: [2, 3],
    combatStyle: ['hybrid', 'tactical'],
    strengths: ['exploration', 'combat']
  },
  {
    name: 'Mothership',
    description: 'Sci-fi horror with simple rules and high tension',
    themes: ['scifi', 'horror'],
    complexity: [1, 2],
    combatStyle: ['narrative'],
    strengths: ['exploration']
  },
  {
    name: 'Traveller',
    description: 'Classic hard sci-fi with detailed world generation',
    themes: ['scifi'],
    complexity: [3, 4],
    combatStyle: ['tactical', 'hybrid'],
    strengths: ['exploration', 'diplomacy']
  },
  {
    name: 'D&D 5th Edition',
    description: 'Popular fantasy with balanced rules and extensive support',
    themes: ['fantasy'],
    complexity: [2, 3],
    combatStyle: ['tactical', 'hybrid'],
    strengths: ['combat', 'exploration']
  },
  {
    name: 'Pathfinder 2e',
    description: 'Tactical fantasy with deep character customization',
    themes: ['fantasy'],
    complexity: [4, 5],
    combatStyle: ['tactical'],
    strengths: ['combat', 'puzzles']
  },
  {
    name: 'Dungeon World',
    description: 'Narrative fantasy with fiction-first gameplay',
    themes: ['fantasy'],
    complexity: [1, 2],
    combatStyle: ['narrative'],
    strengths: ['exploration', 'diplomacy']
  },
  {
    name: 'Call of Cthulhu',
    description: 'Investigative horror with sanity mechanics',
    themes: ['horror', 'historical', 'modern'],
    complexity: [2, 3],
    combatStyle: ['narrative'],
    strengths: ['puzzles', 'exploration']
  },
  {
    name: 'Dread',
    description: 'Horror using Jenga for tension and stakes',
    themes: ['horror'],
    complexity: [1, 1],
    combatStyle: ['narrative'],
    strengths: ['diplomacy']
  },
  {
    name: 'Cyberpunk RED',
    description: 'Gritty cyberpunk with style over substance',
    themes: ['cyberpunk'],
    complexity: [3, 4],
    combatStyle: ['tactical', 'hybrid'],
    strengths: ['combat', 'diplomacy']
  },
  {
    name: 'Blades in the Dark',
    description: 'Heist-focused with innovative flashback mechanics',
    themes: ['fantasy', 'modern'],
    complexity: [2, 3],
    combatStyle: ['narrative'],
    strengths: ['diplomacy', 'puzzles']
  },
  {
    name: 'Apocalypse World',
    description: 'Post-apocalyptic with player-driven narratives',
    themes: ['postapoc'],
    complexity: [2, 2],
    combatStyle: ['narrative'],
    strengths: ['diplomacy', 'exploration']
  },
  {
    name: 'GURPS',
    description: 'Universal system for any setting with detailed simulation',
    themes: ['scifi', 'fantasy', 'modern', 'historical'],
    complexity: [4, 5],
    combatStyle: ['tactical'],
    strengths: ['combat', 'puzzles']
  },
  {
    name: 'Savage Worlds',
    description: 'Fast, furious, fun - pulpy action in any genre',
    themes: ['scifi', 'fantasy', 'modern', 'historical', 'postapoc'],
    complexity: [2, 3],
    combatStyle: ['tactical', 'hybrid'],
    strengths: ['combat', 'exploration']
  },
  {
    name: 'Fate Core',
    description: 'Narrative-focused with aspects and fate points',
    themes: ['scifi', 'fantasy', 'modern'],
    complexity: [2, 2],
    combatStyle: ['narrative'],
    strengths: ['diplomacy', 'puzzles']
  },
  {
    name: 'Mörk Borg',
    description: 'Doom metal fantasy with brutal rules and striking art',
    themes: ['fantasy', 'horror'],
    complexity: [1, 2],
    combatStyle: ['narrative'],
    strengths: ['combat', 'exploration']
  },
  {
    name: 'CY_BORG',
    description: 'Cyberpunk chaos with the Mörk Borg engine',
    themes: ['cyberpunk'],
    complexity: [1, 2],
    combatStyle: ['narrative', 'hybrid'],
    strengths: ['combat', 'exploration']
  },
  {
    name: 'Death in Space',
    description: 'Industrial sci-fi horror with cosmic dread',
    themes: ['scifi', 'horror'],
    complexity: [1, 2],
    combatStyle: ['narrative'],
    strengths: ['exploration', 'puzzles']
  },
  {
    name: 'Alien RPG',
    description: 'Cinematic sci-fi horror in the Alien universe',
    themes: ['scifi', 'horror'],
    complexity: [2, 3],
    combatStyle: ['hybrid'],
    strengths: ['exploration', 'combat']
  },
  {
    name: 'Coriolis',
    description: 'Arabian Nights in space with mystical sci-fi',
    themes: ['scifi'],
    complexity: [2, 3],
    combatStyle: ['hybrid'],
    strengths: ['exploration', 'diplomacy']
  },
  {
    name: 'Old School Essentials',
    description: 'Classic B/X D&D rules, streamlined and clarified',
    themes: ['fantasy'],
    complexity: [2, 2],
    combatStyle: ['tactical', 'hybrid'],
    strengths: ['combat', 'exploration']
  },
  // === Added from RPGGeek Top 100 ===
  {
    name: 'Fiasco',
    description: 'GM-less game of powerful ambition and poor impulse control',
    themes: ['modern', 'historical'],
    complexity: [1, 1],
    combatStyle: ['narrative'],
    strengths: ['diplomacy']
  },
  {
    name: 'Pendragon',
    description: 'Arthurian romance with generational play and passions',
    themes: ['fantasy', 'historical'],
    complexity: [3, 4],
    combatStyle: ['tactical'],
    strengths: ['combat', 'diplomacy']
  },
  {
    name: 'Delta Green',
    description: 'Modern Lovecraftian horror with conspiracy and investigation',
    themes: ['horror', 'modern'],
    complexity: [2, 3],
    combatStyle: ['narrative', 'hybrid'],
    strengths: ['puzzles', 'exploration']
  },
  {
    name: 'Legend of the Five Rings',
    description: 'Samurai drama in a fantastical Asia-inspired setting',
    themes: ['fantasy', 'historical'],
    complexity: [3, 4],
    combatStyle: ['tactical', 'hybrid'],
    strengths: ['combat', 'diplomacy']
  },
  {
    name: 'The One Ring',
    description: 'Middle-earth adventures faithful to Tolkien\'s vision',
    themes: ['fantasy'],
    complexity: [2, 3],
    combatStyle: ['hybrid'],
    strengths: ['exploration', 'diplomacy']
  },
  {
    name: 'Trail of Cthulhu',
    description: 'Investigative horror using the GUMSHOE system',
    themes: ['horror', 'historical'],
    complexity: [2, 3],
    combatStyle: ['narrative'],
    strengths: ['puzzles', 'exploration']
  },
  {
    name: 'RuneQuest',
    description: 'Bronze age fantasy with detailed mythology and cults',
    themes: ['fantasy'],
    complexity: [3, 4],
    combatStyle: ['tactical'],
    strengths: ['combat', 'exploration']
  },
  {
    name: 'Forbidden Lands',
    description: 'Survival hex-crawl fantasy in a dark, cursed world',
    themes: ['fantasy'],
    complexity: [2, 3],
    combatStyle: ['hybrid'],
    strengths: ['exploration', 'combat']
  },
  {
    name: 'Warhammer Fantasy Roleplay',
    description: 'Grim and perilous adventures in the Old World',
    themes: ['fantasy', 'horror'],
    complexity: [3, 4],
    combatStyle: ['tactical'],
    strengths: ['combat', 'exploration']
  },
  {
    name: 'Star Wars FFG',
    description: 'Narrative dice system in the Star Wars galaxy',
    themes: ['scifi'],
    complexity: [2, 3],
    combatStyle: ['hybrid'],
    strengths: ['combat', 'exploration']
  },
  {
    name: 'Dungeon Crawl Classics',
    description: 'Gonzo old-school fantasy with wild magic',
    themes: ['fantasy'],
    complexity: [2, 3],
    combatStyle: ['tactical'],
    strengths: ['combat', 'exploration']
  },
  {
    name: 'Night\'s Black Agents',
    description: 'Spy thriller meets vampire conspiracy',
    themes: ['horror', 'modern'],
    complexity: [2, 3],
    combatStyle: ['hybrid'],
    strengths: ['puzzles', 'combat']
  },
  {
    name: 'Mutant: Year Zero',
    description: 'Post-apocalyptic survival with zone exploration',
    themes: ['postapoc'],
    complexity: [2, 3],
    combatStyle: ['hybrid'],
    strengths: ['exploration', 'combat']
  },
  {
    name: 'Mouse Guard',
    description: 'Heroic mice defending their territories',
    themes: ['fantasy'],
    complexity: [2, 2],
    combatStyle: ['narrative'],
    strengths: ['exploration', 'diplomacy']
  },
  {
    name: 'Paranoia',
    description: 'Darkly comedic dystopia run by an insane computer',
    themes: ['scifi'],
    complexity: [1, 2],
    combatStyle: ['narrative'],
    strengths: ['diplomacy', 'puzzles']
  },
  {
    name: 'Masks: A New Generation',
    description: 'Teen superhero drama using Powered by the Apocalypse',
    themes: ['modern'],
    complexity: [1, 2],
    combatStyle: ['narrative'],
    strengths: ['combat', 'diplomacy']
  },
  {
    name: 'Vaesen',
    description: 'Nordic horror investigating mythological creatures',
    themes: ['horror', 'historical'],
    complexity: [2, 3],
    combatStyle: ['narrative', 'hybrid'],
    strengths: ['puzzles', 'exploration']
  },
  {
    name: 'Monsterhearts',
    description: 'Messy lives of teenage monsters',
    themes: ['horror', 'modern'],
    complexity: [1, 2],
    combatStyle: ['narrative'],
    strengths: ['diplomacy']
  },
  {
    name: 'Monster of the Week',
    description: 'Hunt monsters like Buffy or Supernatural',
    themes: ['horror', 'modern'],
    complexity: [1, 2],
    combatStyle: ['narrative'],
    strengths: ['combat', 'puzzles']
  },
  {
    name: 'Eclipse Phase',
    description: 'Transhuman conspiracy and horror in the far future',
    themes: ['scifi', 'horror'],
    complexity: [4, 5],
    combatStyle: ['tactical'],
    strengths: ['puzzles', 'exploration']
  },
  {
    name: 'Star Trek Adventures',
    description: 'Boldly go with the official Star Trek RPG',
    themes: ['scifi'],
    complexity: [2, 3],
    combatStyle: ['narrative', 'hybrid'],
    strengths: ['exploration', 'diplomacy']
  },
  {
    name: 'Burning Wheel',
    description: 'Character-driven fantasy with deep belief mechanics',
    themes: ['fantasy'],
    complexity: [4, 5],
    combatStyle: ['narrative'],
    strengths: ['diplomacy', 'puzzles']
  },
  {
    name: 'Tales from the Loop',
    description: '80s kids investigating sci-fi mysteries',
    themes: ['scifi', 'modern'],
    complexity: [1, 2],
    combatStyle: ['narrative'],
    strengths: ['puzzles', 'exploration']
  },
  {
    name: 'Ironsworn',
    description: 'Solo/co-op viking fantasy with oracle tables',
    themes: ['fantasy'],
    complexity: [2, 2],
    combatStyle: ['narrative'],
    strengths: ['exploration', 'combat']
  },
  {
    name: '7th Sea',
    description: 'Swashbuckling adventure in a fantasy Europe',
    themes: ['fantasy', 'historical'],
    complexity: [2, 3],
    combatStyle: ['narrative', 'hybrid'],
    strengths: ['combat', 'diplomacy']
  },
  {
    name: 'Vampire: The Masquerade',
    description: 'Personal and political horror as modern vampires',
    themes: ['horror', 'modern'],
    complexity: [2, 3],
    combatStyle: ['narrative'],
    strengths: ['diplomacy', 'puzzles']
  },
  {
    name: 'Shadowrun',
    description: 'Cyberpunk meets fantasy with magic and megacorps',
    themes: ['cyberpunk', 'fantasy'],
    complexity: [4, 5],
    combatStyle: ['tactical'],
    strengths: ['combat', 'puzzles']
  },
  {
    name: 'Symbaroum',
    description: 'Dark fantasy exploring a corrupted forest',
    themes: ['fantasy', 'horror'],
    complexity: [2, 3],
    combatStyle: ['hybrid'],
    strengths: ['exploration', 'combat']
  },
  {
    name: 'Urban Shadows',
    description: 'Political urban fantasy with supernatural factions',
    themes: ['fantasy', 'modern', 'horror'],
    complexity: [1, 2],
    combatStyle: ['narrative'],
    strengths: ['diplomacy', 'puzzles']
  },
  {
    name: 'Thousand Year Old Vampire',
    description: 'Solo journaling as an immortal monster',
    themes: ['horror', 'historical'],
    complexity: [1, 1],
    combatStyle: ['narrative'],
    strengths: ['exploration']
  },
  {
    name: 'Microscope',
    description: 'Collaborative worldbuilding across eons',
    themes: ['scifi', 'fantasy', 'historical'],
    complexity: [1, 1],
    combatStyle: ['narrative'],
    strengths: ['diplomacy']
  },
  {
    name: 'The Quiet Year',
    description: 'Map-drawing game about community survival',
    themes: ['postapoc'],
    complexity: [1, 1],
    combatStyle: ['narrative'],
    strengths: ['diplomacy', 'exploration']
  },
  {
    name: 'Lady Blackbird',
    description: 'Free steampunk adventure ready to play',
    themes: ['scifi', 'fantasy'],
    complexity: [1, 1],
    combatStyle: ['narrative'],
    strengths: ['exploration', 'diplomacy']
  },
  {
    name: 'Dogs in the Vineyard',
    description: 'Frontier religious enforcers facing moral dilemmas',
    themes: ['historical'],
    complexity: [2, 2],
    combatStyle: ['narrative'],
    strengths: ['diplomacy', 'puzzles']
  },
  {
    name: 'Ars Magica',
    description: 'Medieval wizards in detailed covenant play',
    themes: ['fantasy', 'historical'],
    complexity: [4, 5],
    combatStyle: ['tactical'],
    strengths: ['puzzles', 'diplomacy']
  },
  {
    name: 'Unknown Armies',
    description: 'Postmodern horror with obsession-fueled magic',
    themes: ['horror', 'modern'],
    complexity: [2, 3],
    combatStyle: ['narrative'],
    strengths: ['puzzles', 'diplomacy']
  },
  {
    name: 'The Dresden Files RPG',
    description: 'Urban fantasy based on Jim Butcher\'s novels',
    themes: ['fantasy', 'modern'],
    complexity: [2, 3],
    combatStyle: ['narrative', 'hybrid'],
    strengths: ['combat', 'puzzles']
  },
  {
    name: 'Deadlands',
    description: 'Weird West with horror and steampunk elements',
    themes: ['horror', 'historical'],
    complexity: [2, 3],
    combatStyle: ['tactical', 'hybrid'],
    strengths: ['combat', 'exploration']
  },
  {
    name: 'Dark Heresy',
    description: 'Warhammer 40K investigation and heresy hunting',
    themes: ['scifi', 'horror'],
    complexity: [3, 4],
    combatStyle: ['tactical'],
    strengths: ['combat', 'puzzles']
  },
  {
    name: 'Rogue Trader',
    description: 'Warhammer 40K exploration and trade',
    themes: ['scifi'],
    complexity: [3, 4],
    combatStyle: ['tactical'],
    strengths: ['exploration', 'combat']
  },
  {
    name: 'Basic Fantasy RPG',
    description: 'Free old-school fantasy with modern sensibilities',
    themes: ['fantasy'],
    complexity: [1, 2],
    combatStyle: ['tactical'],
    strengths: ['combat', 'exploration']
  },
  {
    name: 'Swords & Wizardry',
    description: 'OD&D retroclone for classic dungeon crawling',
    themes: ['fantasy'],
    complexity: [1, 2],
    combatStyle: ['tactical'],
    strengths: ['combat', 'exploration']
  },
  {
    name: 'Mage: The Ascension',
    description: 'Reality-bending magic in the World of Darkness',
    themes: ['modern', 'fantasy'],
    complexity: [3, 4],
    combatStyle: ['narrative'],
    strengths: ['puzzles', 'diplomacy']
  },
  {
    name: 'Kult',
    description: 'Extreme horror exploring hidden reality',
    themes: ['horror', 'modern'],
    complexity: [2, 3],
    combatStyle: ['narrative'],
    strengths: ['puzzles', 'exploration']
  },
  {
    name: 'Brindlewood Bay',
    description: 'Cozy mystery with elderly sleuths and dark secrets',
    themes: ['modern', 'horror'],
    complexity: [1, 2],
    combatStyle: ['narrative'],
    strengths: ['puzzles', 'diplomacy']
  },
  {
    name: 'Blade Runner RPG',
    description: 'Noir investigation in the Blade Runner universe',
    themes: ['scifi', 'cyberpunk'],
    complexity: [2, 3],
    combatStyle: ['narrative', 'hybrid'],
    strengths: ['puzzles', 'exploration']
  },
  {
    name: 'Cairn',
    description: 'Rules-light fantasy adventure inspired by Into the Odd',
    themes: ['fantasy'],
    complexity: [1, 1],
    combatStyle: ['narrative'],
    strengths: ['exploration', 'combat']
  },
  {
    name: 'Wasteland Degenerates',
    description: 'Gonzo post-apocalyptic survival and scavenging',
    themes: ['postapoc'],
    complexity: [1, 2],
    combatStyle: ['narrative', 'hybrid'],
    strengths: ['exploration', 'combat']
  }
]

/**
 * Generate game system recommendations based on group preferences
 */
const generateRecommendations = (
  responses: SurveyResponse[],
  summary: SurveySummary
): GameSystemRecommendation[] => {
  if (responses.length === 0) return []

  const recommendations: GameSystemRecommendation[] = []

  // Get top themes
  const topThemes = Object.entries(summary.themeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([theme]) => theme)

  // Get average rules complexity
  const avgComplexity = summary.avgRulesComplexity

  // Get combat style preference
  const topCombatStyle = Object.entries(summary.combatStyleCounts).sort((a, b) => b[1] - a[1])[0]?.[0]

  // Get top activity
  const activities = summary.avgActivityPreferences
  const topActivity = Object.entries(activities).sort((a, b) => b[1] - a[1])[0]?.[0]

  GAME_SYSTEMS.forEach((system) => {
    let score = 0
    const reasons: MatchReason[] = []

    // Theme match (most important)
    const themeMatch = topThemes.some((t) => system.themes.includes(t))
    if (themeMatch) {
      score += 40
      const matchedTheme = topThemes.find((t) => system.themes.includes(t))
      reasons.push({
        key: 'results.insights.matchReasons.matchesTheme',
        params: { theme: matchedTheme || '' }
      })
    }

    // Complexity match
    const [minC, maxC] = system.complexity
    if (avgComplexity >= minC && avgComplexity <= maxC) {
      score += 25
      reasons.push({
        key: 'results.insights.matchReasons.fitsComplexity'
      })
    } else if (Math.abs(avgComplexity - (minC + maxC) / 2) <= 1) {
      score += 10
      reasons.push({
        key: 'results.insights.matchReasons.closeToComplexity'
      })
    }

    // Combat style match
    if (topCombatStyle && system.combatStyle.includes(topCombatStyle)) {
      score += 20
      reasons.push({
        key: 'results.insights.matchReasons.supportsCombatStyle',
        params: { style: topCombatStyle }
      })
    }

    // Activity strength match
    if (topActivity && system.strengths.includes(topActivity)) {
      score += 15
      reasons.push({
        key: 'results.insights.matchReasons.strongActivitySupport',
        params: { activity: topActivity }
      })
    }

    if (score >= 40 && reasons.length >= 2) {
      recommendations.push({
        name: system.name,
        descriptionKey: `results.insights.games.${gameNameToKey(system.name)}`,
        matchScore: score,
        matchReasons: reasons
      })
    }
  })

  return recommendations.sort((a, b) => b.matchScore - a.matchScore).slice(0, 5)
}

/**
 * Generate Session Zero discussion topics
 */
const generateSessionZeroTopics = (
  conflicts: ConflictItem[],
  responses: SurveyResponse[]
): SessionZeroTopic[] => {
  const topics: SessionZeroTopic[] = []

  // Add topics from detected conflicts
  conflicts.forEach((conflict) => {
    let priority: 'high' | 'medium' | 'low' = 'medium'

    if (conflict.fieldKey === 'content_boundaries') {
      priority = 'high'
    } else if (conflict.fieldKey === 'rules_complexity' || conflict.fieldKey === 'combat_style') {
      priority = 'high'
    }

    topics.push({
      topicKey: conflict.fieldKey,
      reasonKey: conflict.descriptionKey,
      reasonParams: conflict.descriptionParams,
      priority
    })
  })

  // Check for any content boundary concerns
  const allBoundaries = new Set<string>()
  responses.forEach((r) => {
    const boundaries = (r.answers as SurveyAnswers).content_boundaries as string[]
    if (boundaries && Array.isArray(boundaries)) {
      boundaries.forEach((b) => allBoundaries.add(b))
    }
  })

  if (allBoundaries.size > 0 && !topics.find((t) => t.topicKey === 'content_boundaries')) {
    topics.push({
      topicKey: 'content_boundaries',
      reasonKey: 'results.insights.sessionZero.contentTypesFlagged',
      reasonParams: { count: allBoundaries.size },
      priority: 'high'
    })
  }

  // Check experience level spread
  const expLevels: number[] = []
  responses.forEach((r) => {
    const exp = (r.answers as SurveyAnswers).experience_level
    if (exp) expLevels.push(exp)
  })

  if (expLevels.length > 0) {
    const minExp = Math.min(...expLevels)
    const maxExp = Math.max(...expLevels)
    if (maxExp - minExp >= 2 && !topics.find((t) => t.topicKey === 'experience_level')) {
      topics.push({
        topicKey: 'experience_level',
        reasonKey: 'results.insights.sessionZero.mixedExperience',
        reasonParams: { min: minExp, max: maxExp },
        priority: 'medium'
      })
    }
  }

  // Always suggest discussing tone if there are multiple preferences
  const toneSet = new Set<string>()
  responses.forEach((r) => {
    const tones = (r.answers as SurveyAnswers).tone_preferences as string[]
    if (tones && Array.isArray(tones)) {
      tones.forEach((t) => toneSet.add(t))
    }
  })

  if (toneSet.size >= 3 && !topics.find((t) => t.topicKey === 'tone_preferences')) {
    topics.push({
      topicKey: 'tone_preferences',
      reasonKey: 'results.insights.sessionZero.multipleTonePreferences',
      priority: 'low'
    })
  }

  return topics.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

/**
 * Generate complete group insights
 */
export const generateGroupInsights = (
  responses: SurveyResponse[],
  summary: SurveySummary
): GroupInsights => {
  const consensus = detectConsensus(responses)
  const conflicts = detectConflicts(responses)
  const correlations = calculateCorrelations(responses)
  const recommendations = generateRecommendations(responses, summary)
  const sessionZeroTopics = generateSessionZeroTopics(conflicts, responses)

  return {
    consensus,
    conflicts,
    correlations,
    recommendations,
    sessionZeroTopics
  }
}
