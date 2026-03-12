/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        primary: {
          DEFAULT: '#4F46E5',
          light: '#6366F1',
          dark: '#3730A3',
        },
        success: '#22C55E',
        card: '#FFFFFF',
        border: '#E5E7EB',
        text: {
          DEFAULT: '#111827',
          muted: '#6B7280',
          light: '#9CA3AF',
        },
        pastel: {
          blue: '#E0F2FE',
          green: '#DCFCE7',
          purple: '#EDE9FE',
          pink: '#FCE7F3',
          yellow: '#FEF9C3',
          orange: '#FFEDD5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        soft: '0 2px 8px rgba(79,70,229,0.12)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pop': 'pop 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        pop: { '0%': { transform: 'scale(0.95)' }, '50%': { transform: 'scale(1.05)' }, '100%': { transform: 'scale(1)' } },
        pulseSoft: { '0%, 100%': { opacity: '0.7' }, '50%': { opacity: '1' } },
      }
    },
  },
  plugins: [],
}
