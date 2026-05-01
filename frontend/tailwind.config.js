/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  'hsl(220, 100%, 97%)',
          100: 'hsl(220, 95%, 93%)',
          200: 'hsl(220, 90%, 85%)',
          300: 'hsl(220, 85%, 74%)',
          400: 'hsl(220, 80%, 62%)',
          500: 'hsl(220, 75%, 52%)',
          600: 'hsl(220, 75%, 43%)',
          700: 'hsl(220, 75%, 36%)',
          800: 'hsl(220, 70%, 28%)',
          900: 'hsl(220, 65%, 20%)',
        },
        surface: {
          50:  'hsl(222, 20%, 96%)',
          100: 'hsl(222, 20%, 90%)',
          200: 'hsl(222, 18%, 80%)',
          700: 'hsl(222, 18%, 22%)',
          800: 'hsl(222, 20%, 16%)',
          900: 'hsl(222, 25%, 10%)',
          950: 'hsl(222, 30%, 7%)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
