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
  TONE_TEXT_BRIGHT,
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
      <div className="flex aspect-[16/10] w-full items-center justify-center rounded-2xl border border-dashed border-warn-border bg-warn-surface p-4 text-center">
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
      className="w-full rounded-2xl border border-hairline transition-transform duration-500 hover:scale-[1.015]"
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

  return (
    <article
      aria-labelledby={headingId}
      className={`card-surface rounded-3xl border border-hairline p-5 transition-colors duration-300 sm:p-8 ${TONE_HOVER_BORDER[tone]}`}
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
          <p
            className={`text-xs font-semibold uppercase tracking-widest2 ${TONE_TEXT[tone]}`}
          >
            {project.kicker[locale]}
          </p>

          <h3
            id={headingId}
            className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl"
          >
            {project.name}
          </h3>

          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            {project.problem[locale]}
          </p>

          <ul
            aria-label={projectsSection.labels.technologies[locale]}
            className="mt-5 flex flex-wrap gap-2"
          >
            {project.stack.map((tech) => (
              <li
                key={tech}
                className={`rounded-full border border-hairline-strong bg-surface px-2.5 py-1 text-xs font-medium text-ink transition-colors duration-200 ${TONE_HOVER_BORDER[tone]}`}
              >
                {tech}
              </li>
            ))}
          </ul>

          {/*
            RF-110: único momento oscuro del sitio, a propósito. El ángulo de
            seguridad es el dato que más distingue a cada proyecto, así que se
            presenta como una terminal, no como una caja de texto más. El tono
            del proyecto sigue presente en el encabezado y los "puntos" de la
            barra superior: no es un color nuevo, es el mismo con más contraste.
          */}
          <div className="mt-6 overflow-hidden rounded-2xl bg-console-bg">
            <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-2.5">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-white/15" />
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-white/15" />
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-white/15" />
              <h4
                className={`ml-2 text-xs font-semibold uppercase tracking-widest2 ${TONE_TEXT_BRIGHT[tone]}`}
              >
                {projectsSection.labels.securityAngle[locale]}
              </h4>
            </div>
            <p className="px-4 py-4 font-mono text-sm leading-relaxed text-console-text sm:text-[0.95rem]">
              <span aria-hidden="true" className={TONE_TEXT_BRIGHT[tone]}>
                ${' '}
              </span>
              {project.security[locale]}
            </p>
          </div>

          <ul className="mt-5 space-y-2">
            {project.highlights[locale].map((highlight) => (
              <li
                key={highlight}
                className="relative pl-5 text-base leading-relaxed text-ink-muted"
              >
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full ${TONE_DOT[tone]}`}
                />
                {highlight}
              </li>
            ))}
          </ul>

          <ul className="mt-6 flex flex-wrap gap-3">
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
                      className={`inline-flex min-h-[44px] items-center rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface-subtle ${TONE_BORDER_SOLID[tone]} ${TONE_TEXT[tone]}`}
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
