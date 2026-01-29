import React from 'react'

interface TextQuestionProps {
  value: string | undefined
  onChange: (value: string) => void
  maxLength?: number
  multiline?: boolean
  required?: boolean
  placeholder?: string
}

export const TextQuestion: React.FC<TextQuestionProps> = ({
  value = '',
  onChange,
  maxLength = 500,
  multiline = false,
  required,
  placeholder = ''
}) => {
  if (multiline) {
    return (
      <div className="space-y-2">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          rows={4}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-dark-surface border-2 border-dark-elevated rounded-lg focus:outline-none focus:border-cyber-500 text-white placeholder-gray-500 resize-none"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>
            {required && !value && <span className="text-red-400">Required</span>}
          </span>
          <span>
            {value.length} / {maxLength}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-dark-surface border-2 border-dark-elevated rounded-lg focus:outline-none focus:border-cyber-500 text-white placeholder-gray-500"
      />
      {required && !value && (
        <p className="text-sm text-red-400">This question is required</p>
      )}
    </div>
  )
}
