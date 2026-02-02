import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import i18n from '../i18n/config'

type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'nl' | 'it' | 'pt'

interface LanguageState {
  language: SupportedLanguage
  setLanguage: (language: SupportedLanguage) => void
}

// Get the initially detected language from i18n
// This will be either from localStorage, browser/OS language, or fallback to 'en'
const getInitialLanguage = (): SupportedLanguage => {
  const detected = i18n.language
  if (detected === 'es' || detected.startsWith('es')) return 'es'
  if (detected === 'fr' || detected.startsWith('fr')) return 'fr'
  if (detected === 'de' || detected.startsWith('de')) return 'de'
  if (detected === 'nl' || detected.startsWith('nl')) return 'nl'
  if (detected === 'it' || detected.startsWith('it')) return 'it'
  if (detected === 'pt' || detected.startsWith('pt')) return 'pt'
  return 'en'
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: getInitialLanguage(),
      setLanguage: (language) => {
        set({ language })
        // Keep i18n in sync when language changes
        i18n.changeLanguage(language)
      }
    }),
    {
      name: 'rpg-survey-language'
    }
  )
)
