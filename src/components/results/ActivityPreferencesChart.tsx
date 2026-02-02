import React from 'react'
import { useTranslation } from 'react-i18next'
import { Radar } from 'react-chartjs-2'
import { chartColors } from '../../lib/chartConfig'

interface ActivityPreferencesChartProps {
  avgActivityPreferences: {
    combat: number
    puzzles: number
    diplomacy: number
    exploration: number
  }
}

export const ActivityPreferencesChart: React.FC<ActivityPreferencesChartProps> = ({
  avgActivityPreferences
}) => {
  const { t } = useTranslation()

  const data = {
    labels: [
      t('results.values.activity.combat'),
      t('results.values.activity.puzzles'),
      t('results.values.activity.diplomacy'),
      t('results.values.activity.exploration')
    ],
    datasets: [
      {
        label: t('results.charts.avgInterestLevel'),
        data: [
          avgActivityPreferences.combat,
          avgActivityPreferences.puzzles,
          avgActivityPreferences.diplomacy,
          avgActivityPreferences.exploration
        ],
        backgroundColor: 'rgba(0, 121, 230, 0.2)',
        borderColor: chartColors.primary,
        borderWidth: 2,
        pointBackgroundColor: chartColors.secondary,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: chartColors.secondary
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: t('results.charts.activityPreferences'),
        color: '#fff',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#fff',
        bodyColor: '#e5e7eb',
        borderColor: '#3b82f6',
        borderWidth: 1
      }
    },
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
          color: '#9ca3af'
        },
        grid: {
          color: 'rgba(51, 65, 85, 0.3)'
        },
        pointLabels: {
          color: '#fff',
          font: {
            size: 12,
            weight: 'bold' as const
          }
        }
      }
    }
  }

  return (
    <div className="h-80">
      <Radar data={data} options={options} />
    </div>
  )
}
