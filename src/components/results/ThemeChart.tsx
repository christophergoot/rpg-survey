import React from 'react'
import { useTranslation } from 'react-i18next'
import { Bar } from 'react-chartjs-2'
import { chartColors, defaultChartOptions } from '../../lib/chartConfig'

interface ThemeChartProps {
  themeCounts: Record<string, number>
}

export const ThemeChart: React.FC<ThemeChartProps> = ({ themeCounts }) => {
  const { t } = useTranslation()

  const sortedThemes = Object.entries(themeCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 7)

  const data = {
    labels: sortedThemes.map(([key]) => t(`results.values.theme.${key}`)),
    datasets: [
      {
        label: t('results.charts.numberOfPlayers'),
        data: sortedThemes.map(([, count]) => count),
        backgroundColor: chartColors.gradients,
        borderColor: chartColors.primary,
        borderWidth: 1
      }
    ]
  }

  const options = {
    ...defaultChartOptions,
    plugins: {
      ...defaultChartOptions.plugins,
      title: {
        display: true,
        text: t('results.charts.themeDistribution'),
        color: '#fff',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      }
    }
  }

  return (
    <div className="h-80">
      <Bar data={data} options={options} />
    </div>
  )
}
