import { Contact } from '@/components/contact'
import { Cases } from '@/components/cases'
import { CvDownloads } from '@/components/cv'
import { Education } from '@/components/education'
import { Footer } from '@/components/footer'
import { Hero } from '@/components/hero'
import { Labs } from '@/components/labs'
import { Pillars } from '@/components/pillars'
import { Process } from '@/components/process'
import { CrossedMarquees } from '@/components/persona'
import { SiteNav } from '@/components/nav'
import { Skills } from '@/components/skills'
import { Timeline } from '@/components/timeline'
import { hero } from '@/content'
import { getLocale } from '@/lib/locale'

/**
 * La home. Regla 1 de copilot-instructions (SRS v1.4): la home más una página
 * por caso de seguridad (`/casos/<slug>`, RF-111); nada más sin cambiar antes
 * el alcance de la SRS.
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
        {/* Las disciplinas del rol, en las cintas cruzadas que cierran el hero. */}
        <CrossedMarquees
          items={hero.role[locale]
            .split(/[|·]/)
            .map((part) => part.trim())
            .filter(Boolean)}
        />
        <Pillars locale={locale} />
        <Cases locale={locale} />
        <Process locale={locale} />
        <Timeline locale={locale} />
        <Skills locale={locale} />
        <Labs locale={locale} />
        <Education locale={locale} />
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
