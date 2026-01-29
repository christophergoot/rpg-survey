import React from 'react'

interface ScaleQuestionProps {
  min: number
  max: number
  value: number | undefined
  onChange: (value: number) => void
  options?: Record<string, { label: string; description: string }>
  required?: boolean
}

export const ScaleQuestion: React.FC<ScaleQuestionProps> = ({
  min,
  max,
  value,
  onChange,
  options,
  required
}) => {
  const values = Array.from({ length: max - min + 1 }, (_, i) => i + min)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 gap-3">
        {values.map((v) => {
          const option = options?.[String(v)]
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              className={`p-4 rounded-lg border-2 transition-all ${
                value === v
                  ? 'border-cyber-500 bg-cyber-500/10 shadow-lg shadow-cyber-500/20'
                  : 'border-dark-elevated hover:border-cyber-400 bg-dark-surface'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">{v}</div>
                {option && (
                  <>
                    <div className="text-xs font-semibold text-gray-300 mb-1">
                      {option.label}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-2">
                      {option.description}
                    </div>
                  </>
                )}
              </div>
            </button>
          )
        })}
      </div>
      {required && value === undefined && (
        <p className="text-sm text-red-400">This question is required</p>
      )}
    </div>
  )
}
