import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import i18n from '../i18n/config'

interface LanguageState {
  language: 'en' | 'es'
  setLanguage: (language: 'en' | 'es') => void
}

// Get the initially detected language from i18n
// This will be either from localStorage, browser/OS language, or fallback to 'en'
const getInitialLanguage = (): 'en' | 'es' => {
  const detected = i18n.language
  return (detected === 'es' || detected.startsWith('es')) ? 'es' : 'en'
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
