import { ImageResponse } from 'next/og'

import { hero } from '@/content'
import { OG_IMAGE_SIZE } from '@/lib/seo'

/**
 * RF-112 — imagen de previsualización (Open Graph y Twitter Card), generada
 * con next/og. Por decisión del dueño lleva SOLO su nombre y el titular, en los
 * dos idiomas: la URL de la imagen no lleva `?lang=`, así que una sola imagen
 * sirve a las dos versiones.
 *
 * Es una ruta propia (`/og`) y no el archivo convencional `opengraph-image`:
 * ese convenio exige `metadataBase`, que el layout omite a propósito (ver el
 * comentario de `generateMetadata` en layout.tsx).
 */
export const runtime = 'edge'

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px 80px',
          background: '#121014',
          color: '#f2efe8',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', width: 180, height: 22, background: '#D903D5', marginBottom: 40, transform: 'rotate(-2deg)' }} />
        <div style={{ display: 'flex', fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>{hero.name}</div>
        <div style={{ display: 'flex', fontSize: 31, marginTop: 36, color: '#f2efe8' }}>{hero.role.en}</div>
        <div style={{ display: 'flex', fontSize: 27, marginTop: 14, color: '#b9b3ab' }}>{hero.role.es}</div>
      </div>
    ),
    { ...OG_IMAGE_SIZE }
  )
}
