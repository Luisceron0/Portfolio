import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta editorial: lienzo cálido tipo papel en vez de blanco puro y
        // bordes finos en vez de sombras.
        //
        // RF-110: la paleta NO es monocromática. El índigo sigue siendo el
        // ancla de marca (CTA, foco, enlaces), pero cada sección y cada
        // proyecto tienen su propio tono. El color deja de ser decoración y
        // pasa a ser orientación: dice en qué parte de la página estás.
        //
        // Los ratios de contraste NO se calculan de memoria en este
        // comentario: se miden con `npm run check:contrast`
        // (scripts/check-contrast.mjs), que falla si algún par baja de 4.5:1.
        // Si cambias un hex aquí, cámbialo también en ese script.
        ink: {
          DEFAULT: '#211d16', // near-black cálido, no slate frío
          muted: '#6b6255', // gris cálido para texto secundario
        },
        accent: {
          DEFAULT: '#322d84', // índigo profundo: ancla de marca
          hover: '#26215f',
        },
        /**
         * Tonos de sección. Cada uno medido sobre lienzo y sobre tarjeta.
         * Se usan en números de sección, reglas, viñetas, bordes y hover;
         * nunca como fondo de un bloque grande de texto.
         */
        tone: {
          indigo: '#322d84',
          teal: '#0f6459',
          plum: '#6d2a63',
          rust: '#9c3f2a',
          ochre: '#8a5310',
        },
        surface: {
          DEFAULT: '#f7f2ea', // papel cálido: lienzo principal
          card: '#fffdfa', // blanco cálido: tarjetas elevadas
          subtle: '#efe6d8', // tono más profundo para secciones alternas
          inverse: '#211d16',
        },
        /**
         * RF-110 — superficie "consola". Un único momento oscuro dentro de un
         * sitio claro: la tarjeta de ángulo de seguridad de cada proyecto, con
         * estética de terminal. No es un tema oscuro global, es un acento.
         * `console.bg` es el mismo hex que `surface.inverse`: no se duplica el
         * valor, se reutiliza el que ya existía.
         */
        console: {
          bg: '#211d16',
          text: '#efe6d5',
          muted: '#b8ab93',
        },
        /** Variantes claras de `tone.*` para texto sobre `console.bg` (oscuro). */
        toneBright: {
          indigo: '#a29cf2',
          teal: '#4fd6c4',
          plum: '#e08fd6',
          rust: '#f2896a',
          ochre: '#f0b93d',
        },
        hairline: {
          DEFAULT: '#e2d8c4',
          strong: '#c9bc9e',
        },
        warn: {
          DEFAULT: '#854d0e',
          surface: '#fdf3e0',
          border: '#e8c675',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '68rem',
      },
      letterSpacing: {
        // Tracking amplio para eyebrows y etiquetas editoriales; ninguna fuente
        // nueva, solo espaciado.
        widest2: '0.18em',
      },
    },
  },
  plugins: [],
}

export default config
