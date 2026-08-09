import { Contact } from '@/components/contact'
import { CvDownloads } from '@/components/cv'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/hero'
import { SiteNav } from '@/components/nav'
import { Profile } from '@/components/profile'
import { Projects } from '@/components/projects'
import { Skills } from '@/components/skills'
import { Timeline } from '@/components/timeline'

/**
 * Una sola página. Regla 1 de copilot-instructions: no se añaden rutas, blog ni
 * CMS sin cambiar antes el alcance de la SRS.
 *
 * La navegación de RF-108 tampoco introduce rutas: cada destino es un ancla de
 * este mismo documento.
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
      <SiteNav />

      <main id="contenido">
        <Hero />
        <Profile />
        <Timeline />
        <Projects />
        <Skills />
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
