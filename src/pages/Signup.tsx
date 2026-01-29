import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../hooks/useAuth'
import { Header } from '../components/common/Header'

export const Signup: React.FC = () => {
  const { t } = useTranslation()
  const { signUp, loading } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: ''
  })
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!formData.email) {
      setError(t('auth.emailRequired'))
      return
    }
    if (!formData.password) {
      setError(t('auth.passwordRequired'))
      return
    }
    if (formData.password.length < 6) {
      setError(t('auth.passwordMinLength'))
      return
    }

    const { error } = await signUp(
      formData.email,
      formData.password,
      formData.displayName
    )

    if (error) {
      setError(error.message || t('auth.signUpError'))
    } else {
      navigate('/dashboard')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-space">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <div className="bg-dark-surface rounded-lg shadow-xl border border-dark-elevated p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                {t('auth.createAccount')}
              </h1>
              <p className="text-gray-400">
                {t('auth.welcome')}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded text-red-400">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('auth.displayName')}
                </label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  placeholder={t('auth.displayNamePlaceholder')}
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-elevated rounded-lg focus:outline-none focus:border-cyber-500 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('auth.email')}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('auth.emailPlaceholder')}
                  required
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-elevated rounded-lg focus:outline-none focus:border-cyber-500 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  {t('auth.password')}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t('auth.passwordPlaceholder')}
                  required
                  className="w-full px-4 py-3 bg-dark-bg border border-dark-elevated rounded-lg focus:outline-none focus:border-cyber-500 text-white placeholder-gray-500"
                />
                <p className="mt-2 text-sm text-gray-500">
                  {t('auth.passwordMinLength')}
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-cyber-500 hover:bg-cyber-600 disabled:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
              >
                {loading ? t('auth.signingUp') : t('auth.signUp')}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center text-gray-400">
              {t('auth.hasAccount')}{' '}
              <Link to="/login" className="text-cyber-400 hover:text-cyber-300 font-medium">
                {t('auth.signIn')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
