import { Contact } from '@/components/contact'
import { CvDownloads } from '@/components/cv'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/hero'
import { CrossedMarquees } from '@/components/persona'
import { SiteNav } from '@/components/nav'
import { Profile } from '@/components/profile'
import { Projects } from '@/components/projects'
import { Skills } from '@/components/skills'
import { Timeline } from '@/components/timeline'
import { hero } from '@/content'
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
      <div aria-hidden="true" className="tone-strip fixed inset-x-0 top-0 z-50 h-[3px]" />
      {/* Progreso de lectura: crece con el scroll (solo con animation-timeline). */}
      <div aria-hidden="true" className="p-progress fixed inset-x-0 top-[3px] z-50 h-[3px] scale-x-0 bg-tone-green" />

      <SiteNav locale={locale} />

      <main id="contenido">
        <Hero locale={locale} />
        {/* Las disciplinas del rol, en las cintas cruzadas que cierran el hero. */}
        <CrossedMarquees
          items={hero.role[locale]
            .split(/[·]/)
            .map((part) => part.trim())
            .filter(Boolean)}
        />
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
