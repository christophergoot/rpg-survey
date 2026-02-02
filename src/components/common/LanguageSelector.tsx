import React, { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLanguageStore } from '../../stores/languageStore'

interface LanguageSelectorProps {
  variant?: 'full' | 'compact'
}

type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'nl' | 'it' | 'pt'

const LANGUAGES: { code: SupportedLanguage; flag: string; name: string; region: string }[] = [
  { code: 'en', flag: '🇺🇸', name: 'English', region: 'United States' },
  { code: 'es', flag: '🇪🇸', name: 'Español', region: 'España' },
  { code: 'fr', flag: '🇫🇷', name: 'Français', region: 'France' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch', region: 'Deutschland' },
  { code: 'nl', flag: '🇳🇱', name: 'Nederlands', region: 'Nederland' },
  { code: 'it', flag: '🇮🇹', name: 'Italiano', region: 'Italia' },
  { code: 'pt', flag: '🇧🇷', name: 'Português', region: 'Brasil' }
]

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'compact' }) => {
  const { i18n } = useTranslation()
  const { language, setLanguage } = useLanguageStore()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang)
    i18n.changeLanguage(newLang)
    setIsOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0]

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

  // Compact dropdown version
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-dark-bg rounded-lg border border-dark-elevated hover:border-cyber-500/50 transition-colors"
      >
        <span className="text-lg">{currentLang.flag}</span>
        <span className="text-sm font-medium text-white">{currentLang.code.toUpperCase()}</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-dark-surface rounded-lg border border-dark-elevated shadow-xl z-50">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors first:rounded-t-lg last:rounded-b-lg ${
                language === lang.code
                  ? 'bg-cyber-500/20 text-cyber-400'
                  : 'hover:bg-dark-elevated text-white'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span className="font-medium">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
