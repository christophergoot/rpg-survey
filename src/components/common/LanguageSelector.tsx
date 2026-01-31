import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguageStore } from '../../stores/languageStore'

interface LanguageSelectorProps {
  variant?: 'full' | 'compact'
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'compact' }) => {
  const { i18n } = useTranslation()
  const { language, setLanguage } = useLanguageStore()

  const handleLanguageChange = (newLang: 'en' | 'es') => {
    setLanguage(newLang)
    i18n.changeLanguage(newLang)
  }

  if (variant === 'full') {
    return (
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
        <button
          onClick={() => handleLanguageChange('en')}
          className={`flex-1 py-6 px-8 rounded-lg border-2 transition-all ${
            language === 'en'
              ? 'border-cyber-500 bg-cyber-500/10 shadow-lg shadow-cyber-500/20'
              : 'border-dark-elevated hover:border-cyber-400 bg-dark-surface'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl">🇺🇸</span>
            <span className="text-lg font-medium">English</span>
            <span className="text-sm text-gray-400">United States</span>
          </div>
        </button>

        <button
          onClick={() => handleLanguageChange('es')}
          className={`flex-1 py-6 px-8 rounded-lg border-2 transition-all ${
            language === 'es'
              ? 'border-cyber-500 bg-cyber-500/10 shadow-lg shadow-cyber-500/20'
              : 'border-dark-elevated hover:border-cyber-400 bg-dark-surface'
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl">🇪🇸</span>
            <span className="text-lg font-medium">Español</span>
            <span className="text-sm text-gray-400">España</span>
          </div>
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1 bg-dark-bg rounded-lg p-1 border border-dark-elevated">
      <button
        onClick={() => handleLanguageChange('en')}
        className={`px-3 py-1.5 rounded-md transition-all text-sm font-medium ${
          language === 'en'
            ? 'bg-cyber-500 text-white shadow-sm'
            : 'hover:bg-dark-elevated text-gray-400 hover:text-white'
        }`}
      >
        🇺🇸 EN
      </button>
      <button
        onClick={() => handleLanguageChange('es')}
        className={`px-3 py-1.5 rounded-md transition-all text-sm font-medium ${
          language === 'es'
            ? 'bg-cyber-500 text-white shadow-sm'
            : 'hover:bg-dark-elevated text-gray-400 hover:text-white'
        }`}
      >
        🇪🇸 ES
      </button>
    </div>
  )
}
