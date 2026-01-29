/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sci-fi inspired color palette
        space: {
          50: '#e6f1ff',
          100: '#b3d9ff',
          200: '#80c1ff',
          300: '#4da9ff',
          400: '#1a91ff',
          500: '#0079e6',
          600: '#005fb3',
          700: '#004580',
          800: '#002b4d',
          900: '#00111a',
        },
        cyber: {
          50: '#e6f3ff',
          100: '#b3dcff',
          200: '#80c5ff',
          300: '#4daeff',
          400: '#1a97ff',
          500: '#007bff',
          600: '#0062cc',
          700: '#004999',
          800: '#003166',
          900: '#001833',
        },
        neon: {
          cyan: '#00ffff',
          purple: '#bf00ff',
          pink: '#ff00bf',
          green: '#00ff66',
        },
        dark: {
          bg: '#0f172a',
          surface: '#1e293b',
          elevated: '#334155',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-space': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      },
    },
  },
  plugins: [],
}
