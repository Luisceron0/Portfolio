import { education, type Locale } from '@/content'
import { Reveal } from '@/components/reveal'
import { Section, SectionHeading } from '@/components/section'
import { ProfileIcon } from '@/components/icons'

/**
 * Formación y certificaciones (SRS v1.4), en papel (RF-110 v5): los estudios
 * como boletas de cartulina con el borde izquierdo perforado y la fecha
 * sellada; certificaciones e idiomas en hojas rayadas con encabezado Dymo y
 * checks a mano. Mismo contenido que las secciones del CV.
 */
export function Education({ locale }: { locale: Locale }) {
  return (
    <Section id="formacion" labelledBy="formacion-title">
      <SectionHeading
        id="formacion-title"
        number="06"
        title={education.heading[locale]}
        tone="cyan"
        icon={<ProfileIcon />}
      />

      <ul className="mt-12 grid gap-6 md:grid-cols-2">
        {education.entries.map((entry, index) => (
          <li key={entry.id}>
            <Reveal delayMs={index * 70} className="h-full">
              <article aria-labelledby={`formacion-${entry.id}`} className="m-card m-ticket h-full py-6 pl-8 pr-5 sm:pr-6">
                <span className="m-stamp text-sm [--stamp-r:-3deg]">{entry.period[locale]}</span>
                <h3 id={`formacion-${entry.id}`} className="p-display mt-4 text-xl leading-tight sm:text-2xl">
                  {entry.title[locale]}
                </h3>
                <p className="mt-1.5 text-base font-bold text-tone-cyan">
                  {entry.organization}
                  <span className="font-normal text-ink-muted"> · {entry.location[locale]}</span>
                </p>
                <ul className="mt-4 space-y-2">
                  {entry.highlights[locale].map((highlight) => (
                    <li key={highlight} className="p-bullet text-base leading-relaxed text-ink-muted [--bullet:#46C3D8]">
                      {highlight}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>

      <div className="mt-14 grid gap-10 md:grid-cols-2">
        {(
          [
            [education.certificationsHeading, education.certifications],
            [education.languagesHeading, education.languages],
          ] as const
        ).map(([heading, list], index) => (
          <Reveal key={heading.es} delayMs={index * 80}>
            <h3>
              <span className={`m-dymo text-xs ${index === 0 ? 'm-dymo--magenta' : ''}`}>{heading[locale]}</span>
            </h3>
            <ul className="m-sheet m-ruled mt-4 py-4 pl-12 pr-5">
              {list[locale].map((item) => (
                <li key={item} className="p-bullet p-bullet--check py-1.5 text-base leading-relaxed text-tinta">
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
