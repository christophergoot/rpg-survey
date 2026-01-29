import React from 'react'
import { SingleChoiceQuestion } from './SingleChoiceQuestion'
import { MultiChoiceQuestion } from './MultiChoiceQuestion'
import { ScaleQuestion } from './ScaleQuestion'
import { MultiScaleQuestion } from './MultiScaleQuestion'
import { TextQuestion } from './TextQuestion'
import type { SurveyQuestion, QuestionTranslation } from '../../lib/types'

interface QuestionRendererProps {
  question: SurveyQuestion
  translation: QuestionTranslation | undefined
  value: any
  onChange: (value: any) => void
  showValidation?: boolean
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  translation,
  value,
  onChange,
  showValidation = false
}) => {
  if (!translation) {
    return (
      <div className="text-gray-400">
        Translation not available for this question
      </div>
    )
  }

  const renderQuestion = () => {
    switch (question.question_type) {
      case 'single_choice':
        return (
          <SingleChoiceQuestion
            options={translation.options as Record<string, { label: string; description: string }>}
            value={value}
            onChange={onChange}
            required={question.is_required && showValidation}
          />
        )

      case 'multi_choice':
        return (
          <MultiChoiceQuestion
            options={translation.options as Record<string, { label: string; description: string }>}
            value={value}
            onChange={onChange}
            required={question.is_required && showValidation}
          />
        )

      case 'scale':
        return (
          <ScaleQuestion
            min={question.config.min || 1}
            max={question.config.max || 5}
            value={value}
            onChange={onChange}
            options={translation.options as Record<string, { label: string; description: string }> | undefined}
            required={question.is_required && showValidation}
          />
        )

      case 'multi_scale':
        return (
          <MultiScaleQuestion
            scales={question.config.scales || []}
            min={question.config.min || 1}
            max={question.config.max || 5}
            value={value}
            onChange={onChange}
            options={translation.options as Record<string, { label: string; description: string }> | undefined}
            required={question.is_required && showValidation}
          />
        )

      case 'text':
        return (
          <TextQuestion
            value={value}
            onChange={onChange}
            maxLength={question.config.maxLength || 500}
            multiline={question.question_key === 'additional_comments'}
            required={question.is_required && showValidation}
            placeholder={translation.question_description || ''}
          />
        )

      default:
        return <div className="text-gray-400">Unknown question type</div>
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          {translation.question_text}
        </h2>
        {translation.question_description && (
          <p className="text-gray-400">{translation.question_description}</p>
        )}
      </div>
      {renderQuestion()}
    </div>
  )
}
