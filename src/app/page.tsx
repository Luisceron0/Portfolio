import { Contact } from '@/components/contact'
import { CvDownloads } from '@/components/cv'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/hero'
import { SiteNav } from '@/components/nav'
import { Profile } from '@/components/profile'
import { Projects } from '@/components/projects'
import { Skills } from '@/components/skills'
import { Timeline } from '@/components/timeline'
import { getLocale } from '@/lib/locale'

/**
 * Una sola página. Regla 1 de copilot-instructions: no se añaden rutas, blog ni
 * CMS sin cambiar antes el alcance de la SRS.
 *
 * Ni la navegación de RF-108 ni el idioma de RF-109 introducen rutas: la
 * primera son anclas de este mismo documento, el segundo un parámetro de query.
 *
 * `force-dynamic` es obligatorio, no una preferencia: la CSP usa un nonce por
 * petición (src/middleware.ts) y un HTML prerenderizado en build llevaría un
 * nonce caducado, así que 'strict-dynamic' bloquearía la hidratación. Además,
 * el idioma se resuelve por petición. El coste es despreciable, la página no
 * hace fetch de nada.
 */
export const dynamic = 'force-dynamic'

export default function HomePage() {
  const locale = getLocale()

  return (
    <>
      <SiteNav locale={locale} />

      <main id="contenido">
        <Hero locale={locale} />
        <Profile locale={locale} />
        <Timeline locale={locale} />
        <Projects locale={locale} />
        <Skills locale={locale} />
        <CvDownloads locale={locale} />
        <Contact locale={locale} />
      </main>

      {/*
       * El footer va FUERA de <main> a propósito: un <footer> anidado dentro de
       * un elemento de sección no expone el landmark `contentinfo`, y el sitio
       * se queda sin él para lectores de pantalla. Ver tasks/lessons.md.
       */}
      <Footer locale={locale} />
    </>
  )
}
