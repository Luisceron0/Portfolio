import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta mínima. Los ratios de contraste NO se calculan de memoria en
        // este comentario: se miden con `npm run check:contrast`
        // (scripts/check-contrast.mjs), que falla si algún par baja de 4.5:1.
        // Si cambias un hex aquí, cámbialo también en ese script.
        ink: {
          DEFAULT: '#0f172a', // slate-900
          muted: '#475569', // slate-600
        },
        accent: {
          DEFAULT: '#3730a3', // indigo-800
          hover: '#312e81', // indigo-900
        },
        surface: {
          DEFAULT: '#ffffff',
          subtle: '#f8fafc', // slate-50
          inverse: '#0f172a',
        },
        warn: {
          DEFAULT: '#854d0e', // amber-800
          surface: '#fffbeb', // amber-50
          border: '#fcd34d', // amber-300
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '68rem',
      },
    },
  },
  plugins: [],
}

export default config
