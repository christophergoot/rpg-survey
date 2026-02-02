import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguageStore } from '../../stores/languageStore'

interface LanguageSelectorProps {
  variant?: 'full' | 'compact'
}

type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'nl' | 'it' | 'pt'

const LANGUAGES: { code: SupportedLanguage; flag: string; name: string; region: string }[] = [
  { code: 'en', flag: '🇺🇸', name: 'English', region: 'United States' },
  { code: 'es', flag: '🇪🇸', name: 'Espanol', region: 'Espana' },
  { code: 'fr', flag: '🇫🇷', name: 'Francais', region: 'France' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch', region: 'Deutschland' },
  { code: 'nl', flag: '🇳🇱', name: 'Nederlands', region: 'Nederland' },
  { code: 'it', flag: '🇮🇹', name: 'Italiano', region: 'Italia' },
  { code: 'pt', flag: '🇧🇷', name: 'Portugues', region: 'Brasil' }
]

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'compact' }) => {
  const { i18n } = useTranslation()
  const { language, setLanguage } = useLanguageStore()

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang)
    i18n.changeLanguage(newLang)
  }

  if (variant === 'full') {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl mx-auto">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`py-6 px-4 rounded-lg border-2 transition-all ${
              language === lang.code
                ? 'border-cyber-500 bg-cyber-500/10 shadow-lg shadow-cyber-500/20'
                : 'border-dark-elevated hover:border-cyber-400 bg-dark-surface'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl">{lang.flag}</span>
              <span className="text-lg font-medium">{lang.name}</span>
              <span className="text-sm text-gray-400">{lang.region}</span>
            </div>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1 bg-dark-bg rounded-lg p-1 border border-dark-elevated">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          className={`px-2 py-1.5 rounded-md transition-all text-sm font-medium ${
            language === lang.code
              ? 'bg-cyber-500 text-white shadow-sm'
              : 'hover:bg-dark-elevated text-gray-400 hover:text-white'
          }`}
        >
          {lang.flag} {lang.code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
