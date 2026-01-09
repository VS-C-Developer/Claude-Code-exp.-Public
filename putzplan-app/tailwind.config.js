/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        win11: {
          blue: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
          },
          gray: {
            50: '#fafafa',
            100: '#f4f4f5',
            200: '#e4e4e7',
            300: '#d4d4d8',
            400: '#a1a1aa',
            500: '#71717a',
            600: '#52525b',
            700: '#3f3f46',
            800: '#27272a',
            900: '#18181b',
          },
        },
      },
      borderRadius: {
        'win11': '8px',
        'win11-lg': '12px',
        'win11-xl': '16px',
      },
      boxShadow: {
        'win11-sm': '0 2px 8px rgba(0, 0, 0, 0.05)',
        'win11': '0 8px 16px rgba(0, 0, 0, 0.08)',
        'win11-lg': '0 16px 32px rgba(0, 0, 0, 0.1)',
        'win11-hover': '0 12px 24px rgba(0, 0, 0, 0.12)',
      },
      backdropBlur: {
        'win11': '40px',
      },
    },
  },
  plugins: [],
}
