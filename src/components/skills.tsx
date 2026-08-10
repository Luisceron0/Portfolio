import { skills, type Locale } from '@/content'
import { Reveal } from '@/components/reveal'
import {
  Section,
  SectionHeading,
  TONE_DOT,
  TONE_HOVER_BORDER,
  TONE_TEXT,
  type Tone,
} from '@/components/section'
import { SkillsIcon } from '@/components/icons'

/** RF-110: un tono por grupo, para que cinco tarjetas no se lean como una sola. */
const GROUP_TONES: readonly Tone[] = ['indigo', 'teal', 'rust', 'ochre', 'plum']

/**
 * RF-107 — habilidades y certificaciones.
 *
 * Grupos y elementos salen del YAML del CV, exactamente como están ahí. Se
 * renderizan como chips escaneables y no como prosa, que es el criterio de
 * aceptación literal.
 */
export function Skills({ locale }: { locale: Locale }) {
  return (
    <Section id="habilidades" labelledBy="habilidades-title">
      <SectionHeading
        id="habilidades-title"
        number="04"
        title={skills.heading[locale]}
        intro={skills.intro[locale]}
        tone="plum"
        icon={<SkillsIcon />}
      />

      <div className="mt-12 grid gap-px border border-hairline bg-hairline sm:grid-cols-2">
        {/*
          `gap-px` sobre fondo `hairline`: las celdas se separan por la rejilla
          misma en vez de por márgenes, así que los grupos forman una tabla
          continua y no cinco tarjetas flotando. Es el recurso más suizo de la
          página y no cuesta un solo borde extra.
        */}
        {skills.groups.map((group, index) => {
          const tone = GROUP_TONES[index % GROUP_TONES.length]
          return (
            <Reveal key={group.label.es} delayMs={index * 70} className="bg-surface">
              <div className="h-full p-5 sm:p-6">
                <div className="flex items-center gap-2.5">
                  <span aria-hidden="true" className={`h-2 w-2 shrink-0 ${TONE_DOT[tone]}`} />
                  <h3
                    className={`font-mono text-[0.65rem] font-bold uppercase tracking-spec ${TONE_TEXT[tone]}`}
                  >
                    {group.label[locale]}
                  </h3>
                </div>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.items[locale].map((item) => (
                    <li
                      key={item}
                      className={`border border-hairline-strong bg-surface-subtle px-3 py-1.5 font-mono text-xs text-ink transition-colors duration-200 ${TONE_HOVER_BORDER[tone]}`}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )
        })}

        {/*
          Relleno de la última celda.

          La rejilla dibuja sus separadores con `gap-px` sobre un fondo
          `hairline`: lo que se ve como línea es el contenedor asomando entre
          celdas. Con un número impar de grupos queda un hueco sin celda, y ahí
          el contenedor se ve entero, como un bloque gris que parece un error de
          maquetación. Esto lo tapa. Solo aplica a partir de `sm`, que es donde
          hay dos columnas; en móvil la rejilla es de una sola y nunca sobra.
        */}
        {skills.groups.length % 2 === 1 && (
          <div aria-hidden="true" className="hidden bg-surface sm:block" />
        )}
      </div>

      <Reveal delayMs={140}>
        <h3 className="mt-14 border-b border-hairline pb-3 font-mono text-[0.65rem] font-bold uppercase tracking-spec text-ink-muted">
          {skills.certificationsHeading[locale]}
        </h3>
        <ul className="mt-6 grid gap-x-8 sm:grid-cols-2">
          {skills.certifications[locale].map((certification) => (
            <li
              key={certification}
              className="flex gap-3 border-b border-hairline py-3 text-base leading-relaxed text-ink"
            >
              <span aria-hidden="true" className="shrink-0 font-mono text-deco">
                +
              </span>
              {certification}
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  )
}
