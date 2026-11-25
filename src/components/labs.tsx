import { labsSection, writeups, type Locale } from '@/content'
import { Reveal } from '@/components/reveal'
import { Section, SectionHeading } from '@/components/section'

/**
 * Labs (portafolio v2). Sin write-ups no renderiza nada: ni sección ni ancla
 * (la nav usa `navItems()`, que tampoco la incluye). Ver la regla de
 * divulgación en el tipo `Writeup` de content.ts.
 */
export function Labs({ locale }: { locale: Locale }) {
  if (writeups.length === 0) return null
  const labels = labsSection.labels

  return (
    <Section id="labs" labelledBy="labs-title">
      <SectionHeading
        id="labs-title"
        number="L"
        title={labsSection.heading[locale]}
        intro={labsSection.intro[locale]}
        tone="lilac"
      />
      <ul className="mt-12 grid gap-5 md:grid-cols-2">
        {writeups.map((writeup) => (
          <li key={writeup.link}>
            <Reveal className="h-full">
              <article className="m-card h-full p-5 sm:p-6">
                <h3 className="text-lg font-bold leading-snug text-ink">
                  <a
                    href={writeup.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-link px-0.5"
                  >
                    {writeup.title}
                  </a>
                </h3>
                <dl className="p-type mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs text-ink-muted">
                  <dt>{labels.platform[locale]}</dt>
                  <dd>{writeup.platform}</dd>
                  <dt>{labels.vulnClass[locale]}</dt>
                  <dd>{writeup.vulnClass}</dd>
                </dl>
                <p className="mt-3 text-base leading-relaxed text-ink">
                  <span className="font-bold">{labels.lesson[locale]}: </span>
                  {writeup.lesson[locale]}
                </p>
                <p className="m-stamp mt-3 text-xs [--stamp-r:-3deg]">{writeup.date}</p>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}
