import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /*
         * RF-110 v4 — paleta EVA: dos colores principales sobre negro violáceo.
         *
         *   - Violeta eléctrico: la identidad. Botones, banda del CV, cursor
         *     del menú, cuñas y reglas.
         *   - Verde lima: el contrapunto. Pestañas de fecha, foco, progreso y
         *     los acentos de las bandas `abyss` (trayectoria, habilidades).
         *
         * Los secundarios (`tone.lilac`, `tone.mint`, `tone.silver`) son tintes
         * de esos dos y un gris frío: dan variedad a las tarjetas sin abrir una
         * tercera familia de color. `warn` es la única excepción, y es de
         * estado, no de marca.
         *
         * Hay DOS violetas y no es redundancia: `tone.violet` es violeta para
         * TEXTO sobre negro (6.8:1) y `violet` es violeta de RELLENO con letra
         * blanca encima (5.5:1). Un solo violeta no pasa las dos pruebas. El
         * verde no tiene ese problema: es tan claro que vale como texto sobre
         * negro y como relleno con letra `surface` encima.
         *
         * Los ratios se miden con `npm run check:contrast`, que falla por
         * debajo de 4.5:1. Si cambias un hex, cámbialo también en ese script.
         */
        ink: {
          DEFAULT: '#f5f3fa', // blanco con un punto de lila
          muted: '#aaa6b8', // gris lavanda para texto secundario
          dim: '#3a3448', // gris oscuro: texto secundario sobre fondo `ink`
        },
        surface: {
          DEFAULT: '#09080d', // negro violáceo
          card: '#15121d',
          subtle: '#1d1a27',
          inverse: '#f5f3fa',
        },
        /** Fondo de las bandas de trayectoria y habilidades. Medido con texto encima. */
        abyss: {
          DEFAULT: '#130a26',
          card: '#1e1238',
        },
        hairline: {
          DEFAULT: '#2b2738',
          strong: '#47405a',
        },
        /** SOLO decoración: no llega a 4.5:1. Para texto gris, `ink.muted`. */
        deco: '#5a536b',
        /** Violeta eléctrico de relleno (botones, banda del CV). Letra SIEMPRE `ink`. */
        violet: {
          DEFAULT: '#7a1fff',
          hover: '#6420cf',
        },
        /**
         * Tonos de sección y de tarjeta, todos legibles como texto sobre negro
         * y sobre `abyss`, y con letra `surface` encima cuando se rellenan.
         */
        tone: {
          violet: '#b07cff',
          green: '#a6f13c',
          mint: '#5ef0a8',
          lilac: '#d7c4ff',
          silver: '#c3c0cf',
        },
        warn: {
          DEFAULT: '#ffd23f',
          surface: '#241d0c',
          border: '#4a3a12',
        },
      },
      fontFamily: {
        /*
         * Estilo suizo con tipografía del sistema: Helvetica Neue en macOS,
         * Arial en Windows, y en Linux el clon métrico que el sistema mapee a
         * Arial. Ninguna descarga, ninguna ampliación de `font-src` en la CSP,
         * cero bytes de fuente. La restricción D-05 se mantiene intacta y aun
         * así se consigue la familia que define el estilo.
         */
        sans: ['var(--font-sans)', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
        /*
         * Rótulos estilo Persona: la letra más pesada que trae el sistema.
         * Arial Black en Windows y macOS; en Linux cae en el sans más negro
         * disponible. Sigue sin haber descarga de fuentes (D-05).
         */
        display: ['var(--font-display)', 'sans-serif'],
      },
      maxWidth: {
        content: '72rem',
      },
      letterSpacing: {
        widest2: '0.18em',
        // Etiquetas de ficha técnica: tracking aún más abierto en mayúsculas.
        spec: '0.24em',
      },
      /*
       * Ángulo recto en todo el sistema.
       *
       * El estilo suizo no tiene esquinas redondeadas, y una ficha técnica
       * tampoco. Esto invalida a propósito la píldora y el `rounded-3xl` de la
       * versión anterior: el override está en el tema para que ninguna clase
       * `rounded-*` olvidada en un componente reintroduzca una curva por
       * accidente. Los puntos decorativos pasan a ser cuadrados, que es lo
       * correcto en este lenguaje visual.
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
