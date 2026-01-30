import React from 'react'
import { useTranslation } from 'react-i18next'

interface LanguageProficiencyQuestionProps {
  languages: string[]
  value: Record<string, number> | undefined
  onChange: (value: Record<string, number>) => void
  showValidation: boolean
}

const PROFICIENCY_LEVELS = [
  { value: 0, labelKey: 'survey.languageProficiency.level0' },
  { value: 1, labelKey: 'survey.languageProficiency.level1' },
  { value: 2, labelKey: 'survey.languageProficiency.level2' },
  { value: 3, labelKey: 'survey.languageProficiency.level3' },
  { value: 4, labelKey: 'survey.languageProficiency.level4' },
  { value: 5, labelKey: 'survey.languageProficiency.level5' }
]

const LANGUAGE_NAMES: Record<string, { en: string; es: string }> = {
  en: { en: 'English', es: 'Inglés' },
  es: { en: 'Spanish', es: 'Español' },
  fr: { en: 'French', es: 'Francés' },
  de: { en: 'German', es: 'Alemán' },
  pt: { en: 'Portuguese', es: 'Portugués' }
}

export const LanguageProficiencyQuestion: React.FC<LanguageProficiencyQuestionProps> = ({
  languages,
  value = {},
  onChange,
  showValidation
}) => {
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language as 'en' | 'es'

  const handleChange = (language: string, proficiency: number) => {
    onChange({
      ...value,
      [language]: proficiency
    })
  }

  const getLanguageName = (langCode: string): string => {
    return LANGUAGE_NAMES[langCode]?.[currentLang] || langCode.toUpperCase()
  }

  const allLanguagesAnswered = languages.every((lang) => value[lang] !== undefined)
  const showError = showValidation && !allLanguagesAnswered

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-2">
        {t('survey.languageProficiency.title')}
      </h2>
      <p className="text-gray-400 mb-6">
        {t('survey.languageProficiency.description')}
      </p>

      <div className="space-y-6">
        {languages.map((language) => (
          <div key={language}>
            <h3 className="text-lg font-semibold text-white mb-3">
              {getLanguageName(language)}
            </h3>

            <div className="space-y-2">
              {PROFICIENCY_LEVELS.map((level) => (
                <label
                  key={level.value}
                  className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    value[language] === level.value
                      ? 'border-cyber-500 bg-cyber-500/10'
                      : 'border-dark-elevated hover:border-cyber-500/50 bg-dark-bg'
                  }`}
                >
                  <input
                    type="radio"
                    name={`proficiency-${language}`}
                    value={level.value}
                    checked={value[language] === level.value}
                    onChange={() => handleChange(language, level.value)}
                    className="w-5 h-5 text-cyber-500 focus:ring-cyber-500 focus:ring-offset-0"
                  />
                  <span className="ml-3 text-white font-medium">
                    {t(level.labelKey)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showError && (
        <p className="mt-4 text-red-400 text-sm">
          {t('survey.validation.pleaseAnswerAll')}
        </p>
      )}
    </div>
  )
}
