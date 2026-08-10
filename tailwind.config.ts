import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /*
         * RF-110 v2 — sistema oscuro, estilo suizo y hoja de especificaciones.
         *
         * El lienzo claro tipo papel se retiró por completo. La página es
         * oscura de principio a fin: no hay tema claro, no hay conmutador y no
         * se consulta `prefers-color-scheme`. Es una decisión de diseño, no una
         * preferencia del visitante, y tratarla como preferencia obligaría a
         * mantener y medir dos paletas en vez de una.
         *
         * Los nombres de token NO cambiaron respecto a la paleta clara (`ink`,
         * `surface`, `hairline`, `tone`, `accent`, `warn`): solo sus valores.
         * Así la inversión es un cambio de tokens y no una reescritura de cada
         * componente, y `grep` sobre un nombre sigue encontrando todos sus usos.
         *
         * Los ratios NO se calculan de memoria aquí: se miden con
         * `npm run check:contrast`, que falla si algún par de texto baja de
         * 4.5:1. Si cambias un hex, cámbialo también en ese script.
         */
        ink: {
          DEFAULT: '#ededea', // blanco levemente cálido, no blanco puro
          muted: '#9c9c98', // gris neutro para texto secundario
        },
        surface: {
          DEFAULT: '#0b0b0c', // lienzo: casi negro, neutro
          card: '#131315', // tarjeta elevada
          subtle: '#1a1a1d', // bloque hundido: entradas, chips, paneles de spec
          inverse: '#ededea', // claro, para lo que se invierte sobre oscuro
        },
        hairline: {
          DEFAULT: '#29292d',
          strong: '#3f3f45',
        },
        /**
         * SOLO decoración: rejilla de fondo, ASCII art, marcas de corte. No
         * alcanza 4.5:1 contra ningún fondo y por eso el nombre lo dice en voz
         * alta. Si necesitas un gris para TEXTO, es `ink.muted`.
         */
        deco: '#55555a',
        accent: {
          DEFAULT: '#a29cf2', // índigo claro: ancla de marca sobre oscuro
          hover: '#b8b3f6',
        },
        /**
         * Tonos de sección. Al invertir el fondo, estos pasaron a ser las
         * variantes claras: los tonos oscuros de la paleta anterior no llegan a
         * AA sobre casi negro. Por eso desapareció el mapa `toneBright`, ya no
         * hacen falta dos juegos.
         */
        tone: {
          indigo: '#a29cf2',
          teal: '#4fd6c4',
          plum: '#e08fd6',
          rust: '#f2896a',
          ochre: '#f0b93d',
        },
        warn: {
          DEFAULT: '#f0b93d',
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
