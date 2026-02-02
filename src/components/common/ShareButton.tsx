import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ShareButtonProps {
  url: string
  label: string
  copiedLabel?: string
  variant?: 'primary' | 'secondary'
  icon?: 'share' | 'chart'
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  url,
  label,
  copiedLabel,
  variant = 'primary',
  icon = 'share'
}) => {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const baseClasses = 'px-4 py-2 font-semibold rounded-lg transition-colors flex items-center gap-2'
  const variantClasses =
    variant === 'primary'
      ? 'bg-cyber-500 hover:bg-cyber-600 text-white'
      : 'bg-dark-elevated hover:bg-dark-bg text-white'

  const ShareIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
      />
    </svg>
  )

  const ChartIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  )

  const CheckIcon = () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )

  const IconComponent = icon === 'chart' ? ChartIcon : ShareIcon

  return (
    <button onClick={copyToClipboard} className={`${baseClasses} ${variantClasses}`}>
      {copied ? (
        <>
          <CheckIcon />
          {copiedLabel || t('survey.share.copied')}
        </>
      ) : (
        <>
          <IconComponent />
          {label}
        </>
      )}
    </button>
  )
}

/**
 * Helper to generate a survey share URL with correct hash routing
 */
export const getSurveyShareUrl = (shareToken: string): string => {
  return `${window.location.origin}${window.location.pathname}#/surveys/${shareToken}`
}

/**
 * Helper to generate a results share URL with correct hash routing
 */
export const getResultsShareUrl = (shareToken: string): string => {
  return `${window.location.origin}${window.location.pathname}#/surveys/${shareToken}/results`
}
