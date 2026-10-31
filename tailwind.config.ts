import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /*
         * RF-110 v3 — sistema Persona (P5R + P3R).
         *
         * Dos juegos de color con un papel cada uno, igual que en los juegos:
         *   - P5R (rojo sangre, negro, blanco): la identidad. Hero, perfil,
         *     proyectos, la banda del CV y la tarjeta de contacto.
         *   - P3R (azul medianoche y cian): lo que se recorre. Trayectoria y
         *     habilidades viven sobre bandas `midnight`.
         *
         * Hay DOS rojos y no es redundancia: `tone.red` es rojo para TEXTO sobre
         * negro (5.9:1) y `blood` es rojo de RELLENO con letra blanca encima
         * (5.4:1). Un solo rojo no pasa las dos pruebas: el que se lee bien
         * sobre negro es demasiado claro para llevar blanco encima.
         *
         * Los ratios se miden con `npm run check:contrast`, que falla por
         * debajo de 4.5:1. Si cambias un hex, cámbialo también en ese script.
         */
        ink: {
          DEFAULT: '#f5f5f2', // blanco de cómic, apenas cálido
          muted: '#a8a8b0', // gris frío para texto secundario
          dim: '#3d3d48', // gris oscuro: texto secundario sobre fondo `ink`
        },
        surface: {
          DEFAULT: '#08080a', // negro de tinta
          card: '#141418',
          subtle: '#1c1c22',
          inverse: '#f5f5f2',
        },
        /** Fondo de las bandas P3R. Medido con texto encima. */
        midnight: {
          DEFAULT: '#0b1430',
          card: '#111d42',
        },
        hairline: {
          DEFAULT: '#2a2a32',
          strong: '#45454f',
        },
        /** SOLO decoración: no llega a 4.5:1. Para texto gris, `ink.muted`. */
        deco: '#55555f',
        /** Rojo de relleno (botones, banda del CV). Letra SIEMPRE `ink`. */
        blood: {
          DEFAULT: '#c8101b',
          hover: '#a80d16',
        },
        /** Azul P3R de relleno. Letra SIEMPRE `ink`. */
        royal: '#1a54d1',
        accent: {
          DEFAULT: '#ff4552', // rojo para texto y bordes sobre negro
          hover: '#ff6b75',
        },
        /**
         * Tonos de sección y de tarjeta, todos legibles como texto sobre negro
         * y sobre `midnight`, y con letra `surface` encima cuando se rellenan.
         */
        tone: {
          red: '#ff4552',
          cyan: '#4fe0ff',
          gold: '#ffd23f',
          blue: '#7ea6ff',
          pink: '#ff7ab0',
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
