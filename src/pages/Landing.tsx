import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LanguageSelector } from '../components/common/LanguageSelector'

export const Landing: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen bg-gradient-space">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Icon */}
          <div className="mb-8">
            <span className="text-8xl">🎲</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            {t('landing.title')}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            {t('landing.subtitle')}
          </p>

          {/* Description */}
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
            {t('landing.description')}
          </p>

          {/* Language Selection */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {t('landing.selectLanguage')}
            </h2>
            <LanguageSelector variant="full" />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-16">
            <Link
              to="/signup"
              className="px-8 py-4 bg-cyber-500 hover:bg-cyber-600 text-white text-lg font-semibold rounded-lg transition-all shadow-lg shadow-cyber-500/30 hover:shadow-cyber-500/50"
            >
              {t('landing.forGMs')}
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-dark-surface hover:bg-dark-elevated text-white text-lg font-semibold rounded-lg transition-all border-2 border-cyber-500/30 hover:border-cyber-500"
            >
              {t('landing.forPlayers')}
            </Link>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-2 gap-8 mt-20">
            <div className="bg-dark-surface/50 backdrop-blur p-8 rounded-lg border border-dark-elevated">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {t('landing.forGMs')}
              </h3>
              <p className="text-gray-400">
                {t('landing.gmDescription')}
              </p>
            </div>

            <div className="bg-dark-surface/50 backdrop-blur p-8 rounded-lg border border-dark-elevated">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {t('landing.forPlayers')}
              </h3>
              <p className="text-gray-400">
                {t('landing.playerDescription')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-dark-elevated py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>RPG Survey Creator - Helping GMs create better campaigns</p>
        </div>
      </footer>
    </div>
  )
}
