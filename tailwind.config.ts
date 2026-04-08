import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        masters: {
          green: '#006747',
          'green-dark': '#004d35',
          'green-light': '#008055',
          'green-lighter': '#e8f5f1',
          gold: '#d4af37',
          'gold-dark': '#b8941f',
          'gold-light': '#f4e5b7',
          navy: '#001d3d',
          cream: '#faf9f7',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        serif: ['Georgia', '"Times New Roman"', 'serif'],
        display: ['Georgia', 'serif'],
      },
      boxShadow: {
        'premium': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'premium-lg': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'gold': '0 2px 12px rgba(212, 175, 55, 0.25)',
      },
    },
  },
  plugins: [],
}
export default config
