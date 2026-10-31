import { profile, resolved, linkHref, type Locale } from '@/content'
import { Reveal } from '@/components/reveal'
import { Section, SectionHeading } from '@/components/section'
import { projectsSection } from '@/content'
import { ProfileIcon } from '@/components/icons'

/**
 * RF-106 — perfil profesional.
 *
 * Los datos de la ficha salen del CV del dueño; el resumen ya no es su copia
 * literal (ver la nota en `profile.summary`). Lo que no puede pasar es que la
 * página y el CV se CONTRADIGAN, que es un criterio de aceptación explícito
 * (§9 de la SRS).
 *
 * La ficha de datos es una `<dl>` de verdad, y aquí sí corresponde: cada par
 * es literalmente término y definición ("Ubicación" / "Pasto, Colombia"). Se
 * presenta como tabla de especificaciones, en monoespaciada y con una regla
 * entre filas.
 *
 * El perfil son TRES párrafos (desarrollo/arquitectura/seguridad, la estructura
 * antes del código, y la seguridad desde el diseño). Pasó por varias formas
 * antes: el resumen del CV a secas, el resumen más un bloque DEV/ARCH/SEC, el
 * resumen más prosa, y un único párrafo largo. El número de párrafos lo manda
 * `profile.summary`, no este componente: si el dueño añade o quita uno, aquí no
 * hay nada que tocar. El panel de diálogo envuelve el bloque entero para que
 * no se corte entre párrafo y párrafo.
 */
export function Profile({ locale }: { locale: Locale }) {
  return (
    <Section id="perfil" labelledBy="perfil-title">
      <SectionHeading
        id="perfil-title"
        number="01"
        title={profile.heading[locale]}
        tone="red"
        icon={<ProfileIcon />}
      />

      <div className="mt-12 grid gap-12 md:grid-cols-[1.5fr_1fr]">
        <Reveal>
          {/* Panel de diálogo de P5R: negro, borde blanco grueso y una cuña
              roja que asoma por la esquina. */}
          <div className="relative border-2 border-ink bg-surface p-6 shadow-[8px_8px_0_#c8101b] sm:p-8">
            <span
              aria-hidden="true"
              className="absolute -left-3 -top-3 h-6 w-14 -skew-x-[20deg] bg-blood"
            />
            <div className="space-y-5">
              {profile.summary[locale].map((paragraph) => (
                <p key={paragraph} className="text-lg leading-relaxed text-ink">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <ul className="mt-10 flex flex-wrap gap-3">
            {profile.links.map((link) => {
              const href = resolved(linkHref(link, locale))
              if (!href) return null
              return (
                <li key={link.label[locale]}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-slant p-btn p-btn--secondary p-display inline-flex min-h-[44px] items-center px-5 py-2 text-xs tracking-wide text-ink"
                  >
                    {link.label[locale]}
                    <span className="sr-only">{projectsSection.labels.newTab[locale]}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </Reveal>

        <Reveal delayMs={90} className="md:pt-2">
          {/* Ficha de "estadísticas": cada etiqueta es un recorte inclinado
              y cada fila entra desde la izquierda al pasar el ratón. */}
          <dl className="space-y-3">
            {profile.facts.map((fact, index) => (
              <div
                key={fact.label[locale]}
                className="group border-l-4 border-blood bg-surface-card/90 px-5 py-4 transition-transform duration-200 ease-out hover:translate-x-1.5"
              >
                <dt
                  className={`p-slant inline-block px-2.5 py-0.5 font-mono text-[0.65rem] font-bold uppercase tracking-spec ${
                    index % 2 === 0 ? 'text-ink [--slant-bg:#c8101b]' : 'text-surface [--slant-bg:#f5f5f2]'
                  }`}
                >
                  {fact.label[locale]}
                </dt>
                <dd className="mt-2.5 text-base leading-relaxed text-ink">
                  {fact.value[locale]}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  )
}
