import { Contact } from '@/components/contact'
import { CvDownloads } from '@/components/cv'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/hero'
import { Projects } from '@/components/projects'

/**
 * Una sola página. Regla 1 de copilot-instructions: no se añaden rutas, blog ni
 * CMS sin cambiar antes el alcance de la SRS.
 *
 * `force-dynamic` es obligatorio, no una preferencia: la CSP usa un nonce por
 * petición (src/middleware.ts) y un HTML prerenderizado en build llevaría un
 * nonce caducado, así que 'strict-dynamic' bloquearía la hidratación. El coste
 * es despreciable —la página no hace fetch de nada— y a cambio no hace falta
 * 'unsafe-inline' en script-src.
 */
export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <>
      <main id="contenido">
        <Hero />
        <Projects />
        <CvDownloads />
        <Contact />
      </main>
      {/*
       * El footer va FUERA de <main> a propósito: un <footer> anidado dentro de
       * un elemento de sección no expone el landmark `contentinfo`, y el sitio
       * se queda sin él para lectores de pantalla. Ver tasks/lessons.md.
       */}
      <Footer />
    </>
  )
}
