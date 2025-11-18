import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'constellation': {
          'bg': '#0a0e27',
          'star': '#ffd700',
          'link': '#4a90e2',
        }
      }
    },
  },
  plugins: [],
}
export default config
