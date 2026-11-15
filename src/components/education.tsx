import { education, type Locale } from '@/content'
import { Reveal } from '@/components/reveal'
import { Section, SectionHeading } from '@/components/section'
import { ProfileIcon } from '@/components/icons'

/**
 * Formación y certificaciones (SRS v1.4): estudios, certificaciones vigentes
 * relacionadas con seguridad e idiomas. Mismo contenido que las secciones
 * Educación, Certificaciones e Idiomas del CV.
 */
export function Education({ locale }: { locale: Locale }) {
  return (
    <Section id="formacion" labelledBy="formacion-title">
      <SectionHeading
        id="formacion-title"
        number="06"
        title={education.heading[locale]}
        tone="mint"
        icon={<ProfileIcon />}
      />

      <ul className="mt-12 grid gap-5 md:grid-cols-2">
        {education.entries.map((entry, index) => (
          <li key={entry.id}>
            <Reveal delayMs={index * 70} className="h-full">
              <article
                aria-labelledby={`formacion-${entry.id}`}
                className="h-full border-t-4 border-tone-mint bg-surface-card/90 p-5 sm:p-6"
              >
                <p className="p-slant inline-block px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest2 text-surface [--slant-bg:#5ef0a8]">
                  {entry.period[locale]}
                </p>
                <h3 id={`formacion-${entry.id}`} className="p-display mt-4 text-xl leading-tight sm:text-2xl">
                  {entry.title[locale]}
                </h3>
                <p className="mt-1.5 text-base font-bold text-tone-mint">
                  {entry.organization}
                  <span className="font-normal text-ink-muted"> · {entry.location[locale]}</span>
                </p>
                <ul className="mt-4 space-y-2">
                  {entry.highlights[locale].map((highlight) => (
                    <li key={highlight} className="relative pl-5 text-base leading-relaxed text-ink-muted">
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-[0.55em] h-2 w-2 -skew-x-[20deg] bg-tone-mint"
                      />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>

      <div className="mt-12 grid gap-10 md:grid-cols-2">
        <Reveal>
          <h3>
            <span className="p-slant p-display inline-block px-4 py-1 text-base text-surface [--slant-bg:#a6f13c]">
              {education.certificationsHeading[locale]}
            </span>
          </h3>
          <ul className="mt-5">
            {education.certifications[locale].map((certification) => (
              <li
                key={certification}
                className="flex gap-3 border-b border-tone-green/25 py-3 text-base leading-relaxed text-ink"
              >
                <span aria-hidden="true" className="shrink-0 text-tone-mint">
                  ★
                </span>
                {certification}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delayMs={80}>
          <h3>
            <span className="p-slant p-display inline-block px-4 py-1 text-base text-surface [--slant-bg:#d7c4ff]">
              {education.languagesHeading[locale]}
            </span>
          </h3>
          <ul className="mt-5">
            {education.languages[locale].map((language) => (
              <li key={language} className="border-b border-tone-lilac/25 py-3 text-base leading-relaxed text-ink">
                {language}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}
