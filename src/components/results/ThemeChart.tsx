import React from 'react'
import { Bar } from 'react-chartjs-2'
import { chartColors, defaultChartOptions } from '../../lib/chartConfig'

interface ThemeChartProps {
  themeCounts: Record<string, number>
}

const themeLabels: Record<string, string> = {
  scifi: 'Sci-Fi',
  fantasy: 'Fantasy',
  horror: 'Horror',
  modern: 'Modern',
  historical: 'Historical',
  cyberpunk: 'Cyberpunk',
  postapoc: 'Post-Apocalyptic'
}

export const ThemeChart: React.FC<ThemeChartProps> = ({ themeCounts }) => {
  const sortedThemes = Object.entries(themeCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 7)

  const data = {
    labels: sortedThemes.map(([key]) => themeLabels[key] || key),
    datasets: [
      {
        label: 'Number of Players',
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
        text: 'Theme Preferences',
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
