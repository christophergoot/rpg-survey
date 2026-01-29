import React from 'react'

interface SingleChoiceQuestionProps {
  options: Record<string, { label: string; description: string }>
  value: string | undefined
  onChange: (value: string) => void
  required?: boolean
}

export const SingleChoiceQuestion: React.FC<SingleChoiceQuestionProps> = ({
  options,
  value,
  onChange,
  required
}) => {
  return (
    <div className="space-y-3">
      {Object.entries(options).map(([key, option]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
            value === key
              ? 'border-cyber-500 bg-cyber-500/10 shadow-lg shadow-cyber-500/20'
              : 'border-dark-elevated hover:border-cyber-400 bg-dark-surface'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`flex-shrink-0 w-5 h-5 rounded-full border-2 mt-0.5 transition-all ${
                value === key
                  ? 'border-cyber-500 bg-cyber-500'
                  : 'border-gray-500'
              }`}
            >
              {value === key && (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="font-semibold text-white mb-1">{option.label}</div>
              <div className="text-sm text-gray-400">{option.description}</div>
            </div>
          </div>
        </button>
      ))}
      {required && !value && (
        <p className="text-sm text-red-400 mt-2">This question is required</p>
      )}
    </div>
  )
}
