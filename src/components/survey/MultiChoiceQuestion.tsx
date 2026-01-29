import React from 'react'

interface MultiChoiceQuestionProps {
  options: Record<string, { label: string; description: string }>
  value: string[] | undefined
  onChange: (value: string[]) => void
  required?: boolean
}

export const MultiChoiceQuestion: React.FC<MultiChoiceQuestionProps> = ({
  options,
  value = [],
  onChange,
  required
}) => {
  const toggleOption = (key: string) => {
    if (value.includes(key)) {
      onChange(value.filter((v) => v !== key))
    } else {
      onChange([...value, key])
    }
  }

  return (
    <div className="space-y-3">
      {Object.entries(options).map(([key, option]) => (
        <button
          key={key}
          type="button"
          onClick={() => toggleOption(key)}
          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
            value.includes(key)
              ? 'border-cyber-500 bg-cyber-500/10 shadow-lg shadow-cyber-500/20'
              : 'border-dark-elevated hover:border-cyber-400 bg-dark-surface'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`flex-shrink-0 w-5 h-5 rounded border-2 mt-0.5 transition-all ${
                value.includes(key)
                  ? 'border-cyber-500 bg-cyber-500'
                  : 'border-gray-500'
              }`}
            >
              {value.includes(key) && (
                <div className="w-full h-full flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
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
      {required && value.length === 0 && (
        <p className="text-sm text-red-400 mt-2">Please select at least one option</p>
      )}
    </div>
  )
}
