import React from 'react'

interface SurveyProgressProps {
  current: number
  total: number
}

export const SurveyProgress: React.FC<SurveyProgressProps> = ({ current, total }) => {
  const percentage = (current / total) * 100

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-400">
          Question {current} of {total}
        </span>
        <span className="text-sm font-medium text-cyber-400">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full h-2 bg-dark-elevated rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyber-500 to-neon-cyan transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}
