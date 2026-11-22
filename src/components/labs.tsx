import { labsSection, writeups, type Locale } from '@/content'
import { Reveal } from '@/components/reveal'
import { Section, SectionHeading } from '@/components/section'
import { ProjectsIcon } from '@/components/icons'

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
        icon={<ProjectsIcon />}
      />
      <ul className="mt-12 grid gap-5 md:grid-cols-2">
        {writeups.map((writeup) => (
          <li key={writeup.link}>
            <Reveal className="h-full">
              <article className="h-full border-t-4 border-tone-lilac bg-surface-card/90 p-5 sm:p-6">
                <h3 className="text-lg font-bold leading-snug text-ink">
                  <a
                    href={writeup.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-2 underline-offset-4 hover:text-tone-green"
                  >
                    {writeup.title}
                  </a>
                </h3>
                <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-mono text-xs text-ink-muted">
                  <dt>{labels.platform[locale]}</dt>
                  <dd>{writeup.platform}</dd>
                  <dt>{labels.vulnClass[locale]}</dt>
                  <dd>{writeup.vulnClass}</dd>
                </dl>
                <p className="mt-3 text-base leading-relaxed text-ink">
                  <span className="font-bold">{labels.lesson[locale]}: </span>
                  {writeup.lesson[locale]}
                </p>
                <p className="mt-2 font-mono text-xs text-ink-muted">{writeup.date}</p>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}
