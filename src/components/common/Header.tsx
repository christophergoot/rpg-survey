import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../hooks/useAuth'
import { LanguageSelector } from './LanguageSelector'
import { D20Icon } from './D20Icon'

export const Header: React.FC = () => {
  const { t } = useTranslation()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="bg-dark-surface border-b border-dark-elevated">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white hover:text-cyber-400 transition-colors group">
            <D20Icon size={32} className="group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">{t('common.appName')}</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('navigation.dashboard')}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-dark-elevated hover:bg-red-600 text-white rounded transition-colors"
                >
                  {t('auth.signOut')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('auth.signIn')}
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-cyber-500 hover:bg-cyber-600 text-white rounded transition-colors"
                >
                  {t('auth.signUp')}
                </Link>
              </>
            )}
            <LanguageSelector />
          </nav>
        </div>
      </div>
    </header>
  )
}
