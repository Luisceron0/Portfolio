import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /*
         * RF-110 v5 — zine de papel: magenta + negro + papel.
         *
         * Cada color es un MATERIAL que podría estar sobre una mesa de trabajo:
         * cartulina negra (lienzo y tarjetas), fotocopia (papel), papel magenta
         * (bandas), tinta (texto sobre papel y sobre magenta), papel kraft,
         * papel rosa, resaltador cian, fotocopia vieja lila y la nota adhesiva
         * amarilla. Sin neón, sin brillo, sin gradientes luminosos.
         *
         * Reglas que el contraste obliga (medidas en `npm run check:contrast`):
         *   - Sobre `magenta` el texto es SIEMPRE `tinta` (4.63:1); `paper` no
         *     llega (3.71:1).
         *   - Sobre papel, el texto va en `tinta`, `tinta.muted` o
         *     `magenta.deep`. NUNCA `ink.muted`.
         *   - Sobre `tone.lilac` solo `tinta`: `tinta.muted` (4.11:1) y
         *     `magenta.deep` (2.88:1) no llegan.
         *   - `magenta.text` es la tinta magenta para TEXTO sobre negro;
         *     `magenta.deep` es el relleno con letra papel y el magenta como
         *     texto sobre papel. Un solo magenta no pasa las tres pruebas.
         *
         * Si cambias un hex, cámbialo también en scripts/check-contrast.mjs.
         */
        surface: {
          DEFAULT: '#121014', // cartulina negra (lienzo)
          card: '#1b181e', // cartulina negra de tarjeta
        },
        paper: {
          DEFAULT: '#f2efe8', // fotocopia
          dark: '#e6e2d8', // papel un punto más oscuro: campos del formulario
        },
        ink: {
          DEFAULT: '#f2efe8', // texto claro sobre negro (igual que paper)
          muted: '#b9b3ab', // texto secundario SOLO sobre negro
        },
        tinta: {
          DEFAULT: '#0b0a0f', // tinta negra: texto sobre papel y sobre magenta
          muted: '#4a4540', // texto secundario SOLO sobre papel
        },
        magenta: {
          DEFAULT: '#D903D5', // papel magenta (bandas), letra tinta
          deep: '#A8009F', // relleno con letra papel; magenta como texto sobre papel
          text: '#F25CEB', // tinta magenta como texto sobre negro
        },
        /** SOLO decoración: sombras sólidas y papeles de fondo. */
        plum: '#5a1257',
        /**
         * Tonos de material. Todos legibles como texto sobre negro y con tinta
         * encima cuando son papel (rosa, kraft, cian, lila).
         */
        tone: {
          magenta: '#F25CEB',
          pink: '#FF9CF5',
          ochre: '#E0A24A',
          cyan: '#46C3D8',
          lilac: '#B6A6B6',
        },
        /** Nota adhesiva amarilla (estado). Tinta encima. */
        warn: '#ffd23f',
        /** Grapas y metal: solo decoración. */
        steel: '#8d8a92',
      },
      fontFamily: {
        /*
         * Tres voces impresas (D-05 actualizada en tasks/plan.md):
         *   - sans: texto impreso, del sistema.
         *   - mono: máquina de escribir, del sistema, sin tracking abierto.
         *   - display: rotulador a mano. ÚNICA fuente autoalojada (Permanent
         *     Marker, Apache 2.0, subset Latin, 28 KB) con next/font/local:
         *     sale del mismo origen, así que `font-src 'self'` no cambia.
         */
        sans: ['var(--font-sans)', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        display: ['var(--font-display)', 'Arial Black', 'sans-serif'],
      },
      maxWidth: {
        content: '72rem',
      },
      letterSpacing: {
        /* Etiqueta Dymo: mayúsculas con aire, sin el tracking de terminal. */
        dymo: '0.08em',
      },
      /*
       * Sin esquinas redondeadas: el papel se corta, no se redondea. El override
       * evita que un `rounded-*` olvidado reintroduzca una curva.
       */
      borderRadius: {
        none: '0',
        sm: '0',
        DEFAULT: '0',
        md: '0',
        lg: '0',
        xl: '0',
        '2xl': '0',
        '3xl': '0',
        full: '0',
      },
    },
  },
  plugins: [],
}

export default config
