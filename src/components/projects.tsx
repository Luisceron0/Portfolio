import Image from 'next/image'
import type { CSSProperties } from 'react'

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
  TONE_BG,
  TONE_BORDER,
  TONE_HOVER_BORDER,
  TONE_TEXT,
  toneVar,
  type Tone,
} from '@/components/section'
import { ProjectsIcon } from '@/components/icons'

/**
 * RF-110: un tono por proyecto. Cinco tarjetas del mismo color se leen como
 * una lista; con un tono cada una, se leen como cinco trabajos distintos.
 * El orden sigue al de `projects` en content.ts.
 *
 * Son exactamente los cinco tonos de la paleta, uno por proyecto. Un sexto
 * proyecto obligaría a repetir tono (el módulo lo hace solo, sin romperse) o a
 * ampliar la paleta en `section.tsx`, que es la decisión de diseño real.
 */
const PROJECT_TONES: readonly Tone[] = ['violet', 'mint', 'green', 'silver', 'lilac']

/**
 * RF-102 — cinco proyectos destacados.
 *
 * Cada bloque responde las tres preguntas del criterio de aceptación (qué
 * problema, qué stack, cuál es el ángulo de seguridad) y añade viñetas
 * técnicas verificables contra el repo enlazado. Todo viene de content.ts;
 * aquí no se escribe ni una frase de contenido.
 *
 * Las tarjetas alternan el lado de la imagen en escritorio: rompe la
 * monotonía de una rejilla de bloques idénticos.
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

  /*
   * El tamaño por defecto es el de las capturas del propio sitio (1280x577).
   * Una captura con otras dimensiones las declara en content.ts: si estos
   * números no coinciden con el archivo, el navegador reserva un hueco de la
   * altura equivocada y la página salta al cargar la imagen.
   */
  return (
    <Image
      src={src}
      alt={alt}
      width={project.screenshot.width ?? 1280}
      height={project.screenshot.height ?? 577}
      className="w-full border-2 border-ink"
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
    /*
     * Dos capas a propósito: el envoltorio lleva la elevación y la sombra
     * sólida (`.p-lift`, con `drop-shadow`) y el artículo lleva el corte de
     * esquina (`.p-notch`, con `clip-path`). En el mismo elemento, el recorte
     * se comería la sombra.
     */
    <div className="p-lift group" style={toneVar(tone)}>
      <article
        aria-labelledby={headingId}
        className="p-notch border-t-4 border-ink bg-surface-card p-5 sm:p-8"
      >
        <div className="grid items-start gap-8 lg:grid-cols-2">
          {/* `order` solo en pantallas grandes: en móvil el orden es siempre el
              del DOM, que es el orden de lectura correcto.
              `sticky` evita el hueco muerto cuando la columna de texto es mucho
              más alta que la captura, que es lo normal en los proyectos con más
              detalle técnico. */}
          <Reveal
            className={`min-w-0 lg:sticky lg:top-24 ${imageFirst ? 'lg:order-1' : 'lg:order-2'}`}
          >
            {/* Captura torcida sobre un bloque del tono del proyecto; se
                endereza al pasar el ratón por la tarjeta. */}
            <div className="group/shot relative">
              <span
                aria-hidden="true"
                className={`absolute inset-0 translate-x-2.5 translate-y-2.5 -skew-x-3 ${TONE_BG[tone]}`}
              />
              <div className="p-wipe relative -rotate-1 transition-transform duration-300 ease-out group-hover/shot:rotate-0">
                <ProjectScreenshot project={project} locale={locale} />
              </div>
            </div>
          </Reveal>

          <Reveal delayMs={80} className={`min-w-0 ${imageFirst ? 'lg:order-2' : 'lg:order-1'}`}>
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className={`p-display p-outline text-4xl leading-none ${TONE_TEXT[tone]}`}
              >
                {ref}
              </span>
              <span aria-hidden="true" className={`h-1.5 w-12 -skew-x-[30deg] ${TONE_BG[tone]}`} />
            </div>

            <p
              className={`mt-3 font-mono text-[0.7rem] uppercase tracking-spec ${TONE_TEXT[tone]}`}
            >
              {project.kicker[locale]}
            </p>

            <h3
              id={headingId}
              className="p-display p-glitch mt-3 text-3xl leading-none sm:text-4xl"
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
              {project.stack.map((tech, techIndex) => (
                <li
                  key={tech}
                  style={{ '--i': techIndex } as CSSProperties}
                  className={`p-chip border border-hairline-strong bg-surface px-2.5 py-1 font-mono text-[0.7rem] uppercase tracking-widest2 text-ink-muted ${TONE_HOVER_BORDER[tone]}`}
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
            <div className={`mt-6 border-l-4 bg-surface ${TONE_BORDER[tone]}`}>
              <div
                className={`flex items-center gap-2 border-b border-hairline px-4 py-2.5 ${TONE_TEXT[tone]}`}
              >
                <span aria-hidden="true" className="text-sm">★</span>
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
                    className={`absolute left-0 top-[0.55em] h-2 w-2 -skew-x-[20deg] ${TONE_BG[tone]}`}
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
                        className="p-slant p-btn p-btn--secondary p-display inline-flex min-h-[44px] items-center px-5 py-2 text-xs tracking-wide text-ink"
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
    </div>
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
        tone="mint"
        icon={<ProjectsIcon />}
      />

      <div className="mt-12 space-y-12">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} locale={locale} />
        ))}
      </div>
    </Section>
  )
}
