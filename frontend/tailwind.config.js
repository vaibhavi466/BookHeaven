/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        bronze: {
          50: '#fdf6ed',
          100: '#f9e6cc',
          200: '#f2cc95',
          300: '#eaad5e',
          400: '#e4953a',
          500: '#d97b22',
          600: '#cd7f32',  /* true bronze */
          700: '#a0622e',
          800: '#834f2a',
          900: '#6c4226',
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out both',
        'fade-in': 'fadeIn 0.5s ease-out both',
        'float': 'float 4s ease-in-out infinite',
        'gradient': 'gradientShift 8s ease infinite',
        'slide-down': 'slideDown 0.3s ease-out both',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
