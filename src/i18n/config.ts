import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import enTranslation from './locales/en/translation.json'
import esTranslation from './locales/es/translation.json'
import frTranslation from './locales/fr/translation.json'
import deTranslation from './locales/de/translation.json'
import nlTranslation from './locales/nl/translation.json'
import itTranslation from './locales/it/translation.json'
import ptTranslation from './locales/pt/translation.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      es: { translation: esTranslation },
      fr: { translation: frTranslation },
      de: { translation: deTranslation },
      nl: { translation: nlTranslation },
      it: { translation: itTranslation },
      pt: { translation: ptTranslation }
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'es', 'fr', 'de', 'nl', 'it', 'pt'],
    interpolation: {
      escapeValue: false // React already escapes values
    },
    detection: {
      // Detection order:
      // 1. querystring (?lng=es) - useful for sharing surveys in specific language
      // 2. localStorage - returning users' preference
      // 3. navigator - browser/OS language setting
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lng',
      caches: ['localStorage']
    }
  })

export default i18n
