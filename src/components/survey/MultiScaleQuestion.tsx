import React from 'react'

interface MultiScaleQuestionProps {
  scales: string[]
  min: number
  max: number
  value: Record<string, number> | undefined
  onChange: (value: Record<string, number>) => void
  options?: Record<string, { label: string; description: string }>
  required?: boolean
}

export const MultiScaleQuestion: React.FC<MultiScaleQuestionProps> = ({
  scales,
  min,
  max,
  value = {},
  onChange,
  options,
  required
}) => {
  const handleScaleChange = (scale: string, scaleValue: number) => {
    onChange({
      ...value,
      [scale]: scaleValue
    })
  }

  const values = Array.from({ length: max - min + 1 }, (_, i) => i + min)
  const allScalesSet = scales.every((scale) => value[scale] !== undefined)

  return (
    <div className="space-y-6">
      {scales.map((scale) => {
        const option = options?.[scale]
        return (
          <div key={scale} className="space-y-3">
            <div className="mb-3">
              <h4 className="text-lg font-semibold text-white">
                {option?.label || scale}
              </h4>
              {option?.description && (
                <p className="text-sm text-gray-400 mt-1">{option.description}</p>
              )}
            </div>
            <div className="grid grid-cols-5 gap-2">
              {values.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => handleScaleChange(scale, v)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    value[scale] === v
                      ? 'border-cyber-500 bg-cyber-500/10 shadow-lg shadow-cyber-500/20'
                      : 'border-dark-elevated hover:border-cyber-400 bg-dark-surface'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">{v}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )
      })}
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>{min} = Not interested</span>
        <span>{max} = Very interested</span>
      </div>
      {required && !allScalesSet && (
        <p className="text-sm text-red-400">All activities must be rated</p>
      )}
    </div>
  )
}
