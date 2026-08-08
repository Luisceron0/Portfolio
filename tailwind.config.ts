import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta editorial: lienzo cálido tipo papel en vez de blanco puro,
        // un solo color ancla (índigo), bordes finos en vez de sombras.
        // Síntesis de 5 referencias de diseño (ver tasks/lessons.md) adaptada
        // a un portafolio de seguridad: sin ilustraciones, sin tipografía
        // externa, sin gradientes arcoíris — la calidez y la tipografía
        // grande hacen el trabajo que ahí hacían los personajes ilustrados.
        //
        // Los ratios de contraste NO se calculan de memoria en este
        // comentario: se miden con `npm run check:contrast`
        // (scripts/check-contrast.mjs), que falla si algún par baja de 4.5:1.
        // Si cambias un hex aquí, cámbialo también en ese script.
        ink: {
          DEFAULT: '#211d16', // near-black cálido, no slate frío — hermana con el papel
          muted: '#6b6255', // gris cálido para texto secundario
        },
        accent: {
          DEFAULT: '#322d84', // índigo profundo, el único ancla cromática del sitio
          hover: '#26215f',
        },
        surface: {
          DEFAULT: '#f7f2ea', // papel cálido: lienzo principal de la página
          card: '#fffdfa', // blanco cálido: reservado para tarjetas elevadas
          subtle: '#efe6d8', // tono más profundo para secciones alternas (CV)
          inverse: '#211d16',
        },
        hairline: {
          DEFAULT: '#e2d8c4', // borde fino "marco de galería", reemplaza las sombras
          strong: '#c9bc9e',
        },
        warn: {
          DEFAULT: '#854d0e', // amber-800
          surface: '#fdf3e0', // ajustado a tono cálido en vez de amber-50 frío
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
        // Tracking amplio para eyebrows/labels editoriales; ninguna fuente
        // nueva, solo espaciado — funciona con cualquier fuente del sistema.
        widest2: '0.18em',
      },
    },
  },
  plugins: [],
}

export default config
