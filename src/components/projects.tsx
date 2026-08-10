import Image from 'next/image'

import {
  linkHref,
  projects,
  projectsSection,
  resolved,
  type Locale,
  type Project,
} from '@/content'
import { PendingNote } from '@/components/pending'
import { Reveal } from '@/components/reveal'
import {
  Section,
  SectionHeading,
  TONE_BORDER_SOLID,
  TONE_DOT,
  TONE_HOVER_BORDER,
  TONE_TEXT,
  type Tone,
} from '@/components/section'
import { ProjectsIcon } from '@/components/icons'

/**
 * RF-110: un tono por proyecto. Cuatro tarjetas del mismo color se leen como
 * una lista; con un tono cada una, se leen como cuatro trabajos distintos.
 * El orden sigue al de `projects` en content.ts.
 */
const PROJECT_TONES: readonly Tone[] = ['indigo', 'ochre', 'teal', 'plum']

/**
 * RF-102 — cuatro proyectos destacados.
 *
 * Cada bloque responde las tres preguntas del criterio de aceptación (qué
 * problema, qué stack, cuál es el ángulo de seguridad) y añade viñetas
 * técnicas verificables contra el repo enlazado. Todo viene de content.ts;
 * aquí no se escribe ni una frase de contenido.
 *
 * Las tarjetas alternan el lado de la imagen en escritorio: rompe la
 * monotonía de una rejilla de cuatro bloques idénticos.
 */

function ProjectScreenshot({ project, locale }: { project: Project; locale: Locale }) {
  const src = resolved(project.screenshot.src)
  const alt = project.screenshot.alt[locale]

  // Sin captura confirmada no se renderiza una imagen rota ni un placeholder
  // gris que parezca contenido real.
  if (!src) {
    return (
      <div className="flex aspect-[16/10] w-full items-center justify-center border border-dashed border-warn-border bg-warn-surface p-4 text-center">
        <PendingNote value={project.screenshot.src} />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={1280}
      height={577}
      className="w-full border border-hairline"
      sizes="(min-width: 768px) 50vw, 100vw"
    />
  )
}

function ProjectCard({
  project,
  index,
  locale,
}: {
  project: Project
  index: number
  locale: Locale
}) {
  const headingId = `proyecto-${project.id}`
  const imageFirst = index % 2 === 0
  const tone = PROJECT_TONES[index % PROJECT_TONES.length]
  // Referencia de ficha técnica: PRJ-01, PRJ-02... Decorativa, va aria-hidden.
  const ref = `PRJ-${String(index + 1).padStart(2, '0')}`

  return (
    <article
      aria-labelledby={headingId}
      className={`card-surface crop-marks border border-hairline p-5 transition-colors duration-300 sm:p-8 ${TONE_HOVER_BORDER[tone]}`}
    >
      <div className="grid items-start gap-8 lg:grid-cols-2">
        {/* `order` solo en pantallas grandes: en móvil el orden es siempre el
            del DOM, que es el orden de lectura correcto.
            `sticky` evita el hueco muerto cuando la columna de texto es mucho
            más alta que la captura, que es lo normal en los proyectos con más
            detalle técnico. */}
        <Reveal
          className={`lg:sticky lg:top-24 ${imageFirst ? 'lg:order-1' : 'lg:order-2'}`}
        >
          <ProjectScreenshot project={project} locale={locale} />
        </Reveal>

        <Reveal delayMs={80} className={imageFirst ? 'lg:order-2' : 'lg:order-1'}>
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className={`font-mono text-[0.65rem] uppercase tracking-spec ${TONE_TEXT[tone]}`}
            >
              {ref}
            </span>
            <span aria-hidden="true" className={`h-px w-8 ${TONE_DOT[tone]}`} />
          </div>

          <p
            className={`mt-3 font-mono text-[0.7rem] uppercase tracking-spec ${TONE_TEXT[tone]}`}
          >
            {project.kicker[locale]}
          </p>

          <h3
            id={headingId}
            className="mt-3 text-3xl font-bold tracking-tighter sm:text-4xl"
          >
            {project.name}
          </h3>

          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            {project.problem[locale]}
          </p>

          <ul
            aria-label={projectsSection.labels.technologies[locale]}
            className="mt-6 flex flex-wrap gap-2"
          >
            {project.stack.map((tech) => (
              <li
                key={tech}
                className={`border border-hairline bg-surface-subtle px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-widest2 text-ink-muted transition-colors duration-200 ${TONE_HOVER_BORDER[tone]}`}
              >
                {tech}
              </li>
            ))}
          </ul>

          {/*
            Panel de especificación del ángulo de seguridad.

            En la versión clara esto era una tarjeta "terminal" oscura, que
            funcionaba porque era el único bloque oscuro de una página clara.
            Con el sitio entero en oscuro ese truco deja de distinguir nada, así
            que el énfasis pasa a la estructura: bloque hundido, regla superior
            del color del proyecto, etiqueta en monoespaciada y el texto también
            monoespaciado. Sigue leyéndose como una lectura de instrumento, que
            es el registro que le corresponde.
          */}
          <div className="mt-6 border-t-2 border-hairline bg-surface-subtle">
            <div
              className={`flex items-center gap-2 border-b border-hairline px-4 py-2.5 ${TONE_TEXT[tone]}`}
            >
              <span aria-hidden="true" className={`h-1.5 w-1.5 ${TONE_DOT[tone]}`} />
              <h4 className="font-mono text-[0.65rem] font-bold uppercase tracking-spec">
                {projectsSection.labels.securityAngle[locale]}
              </h4>
            </div>
            <p className="px-4 py-4 font-mono text-sm leading-relaxed text-ink">
              {project.security[locale]}
            </p>
          </div>

          <ul className="mt-6 space-y-2">
            {project.highlights[locale].map((highlight) => (
              <li
                key={highlight}
                className="relative pl-5 text-base leading-relaxed text-ink-muted"
              >
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-[0.6em] h-1.5 w-1.5 ${TONE_DOT[tone]}`}
                />
                {highlight}
              </li>
            ))}
          </ul>

          <ul className="mt-7 flex flex-wrap gap-3">
            {project.links.map((link) => {
              const target = linkHref(link, locale)
              const href = resolved(target)
              return (
                <li key={link.label[locale]}>
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex min-h-[44px] items-center border px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest2 transition-colors duration-200 hover:bg-surface-subtle ${TONE_BORDER_SOLID[tone]} ${TONE_TEXT[tone]}`}
                    >
                      {link.label[locale]}
                      <span className="sr-only">
                        {projectsSection.labels.newTab[locale]}
                      </span>
                    </a>
                  ) : (
                    <PendingNote value={target} />
                  )}
                </li>
              )
            })}
          </ul>
        </Reveal>
      </div>
    </article>
  )
}

export function Projects({ locale }: { locale: Locale }) {
  return (
    <Section id="proyectos" labelledBy="proyectos-title">
      <SectionHeading
        id="proyectos-title"
        number="03"
        title={projectsSection.heading[locale]}
        intro={projectsSection.intro[locale]}
        tone="ochre"
        icon={<ProjectsIcon />}
      />

      <div className="mt-12 space-y-8">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} locale={locale} />
        ))}
      </div>
    </Section>
  )
}
