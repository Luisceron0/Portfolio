import Image from 'next/image'

import { projects, resolved, type Project } from '@/content'
import { PendingNote, TextOrPending } from '@/components/pending'
import { Reveal } from '@/components/reveal'
import { Section, SectionHeading } from '@/components/section'

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

function ProjectScreenshot({ project }: { project: Project }) {
  const src = resolved(project.screenshot.src)
  const alt = resolved(project.screenshot.alt)

  // Sin captura confirmada no se renderiza una imagen rota ni un placeholder
  // gris que parezca contenido real.
  if (!src || !alt) {
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
      className="w-full rounded-2xl border border-hairline"
      sizes="(min-width: 768px) 50vw, 100vw"
    />
  )
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const headingId = `proyecto-${project.id}`
  const imageFirst = index % 2 === 0

  return (
    <article
      aria-labelledby={headingId}
      className="rounded-3xl border border-hairline bg-surface-card p-5 sm:p-8"
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
          <ProjectScreenshot project={project} />
        </Reveal>

        <Reveal delayMs={80} className={imageFirst ? 'lg:order-2' : 'lg:order-1'}>
          <p className="text-xs font-semibold uppercase tracking-widest2 text-accent">
            {project.kicker}
          </p>

          <h3
            id={headingId}
            className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl"
          >
            {project.name}
          </h3>

          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            <TextOrPending value={project.problem} />
          </p>

          <ul aria-label="Tecnologías" className="mt-5 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-hairline-strong bg-surface px-2.5 py-1 text-xs font-medium text-ink"
              >
                {tech}
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-2xl border border-hairline bg-surface p-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest2 text-ink-muted">
              El ángulo de seguridad
            </h4>
            <p className="mt-2 text-base leading-relaxed text-ink">
              <TextOrPending value={project.security} />
            </p>
          </div>

          <ul className="mt-5 space-y-2">
            {project.highlights.map((highlight) => (
              <li
                key={highlight}
                className="relative pl-5 text-base leading-relaxed text-ink-muted"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-accent"
                />
                {highlight}
              </li>
            ))}
          </ul>

          <ul className="mt-6 flex flex-wrap gap-3">
            {project.links.map((link) => {
              const href = resolved(link.href)
              return (
                <li key={link.label}>
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center rounded-full border border-accent px-4 py-2 text-sm font-semibold text-accent transition-colors hover:bg-surface-subtle"
                    >
                      {link.label}
                      <span className="sr-only"> (se abre en una pestaña nueva)</span>
                    </a>
                  ) : (
                    <PendingNote value={link.href} />
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

export function Projects() {
  return (
    <Section id="proyectos" labelledBy="proyectos-title">
      <SectionHeading
        id="proyectos-title"
        number="03"
        title="Proyectos"
        intro="Cuatro sistemas que construí de principio a fin. Cada uno enlaza a su código y, cuando existe, al sitio en vivo — nada de lo que afirmo aquí queda sin respaldo."
      />

      <div className="mt-12 space-y-8">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} />
        ))}
      </div>
    </Section>
  )
}
