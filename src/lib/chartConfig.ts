import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// Default chart options with sci-fi theme
export const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: '#9ca3af',
        font: {
          family: 'Inter, system-ui, sans-serif'
        }
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
    x: {
      grid: {
        color: 'rgba(51, 65, 85, 0.3)'
      },
      ticks: {
        color: '#9ca3af'
      }
    },
    y: {
      grid: {
        color: 'rgba(51, 65, 85, 0.3)'
      },
      ticks: {
        color: '#9ca3af'
      }
    }
  }
}

// Sci-fi color palette for charts
export const chartColors = {
  primary: '#0079e6',
  secondary: '#00ffff',
  tertiary: '#bf00ff',
  accent: '#00ff66',
  gradients: [
    '#0079e6',
    '#00a8ff',
    '#00d4ff',
    '#00ffff',
    '#00e6ac',
    '#00cc78',
    '#00b34c'
  ]
}
