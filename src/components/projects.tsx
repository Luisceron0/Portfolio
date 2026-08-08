import Image from 'next/image'

import { projects, resolved, type Project } from '@/content'
import { ExternalLinkButton } from '@/components/external-link'
import { PendingNote, TextOrPending } from '@/components/pending'

/**
 * RF-102 — máximo dos proyectos destacados.
 *
 * Cada bloque responde las tres preguntas del criterio de aceptación:
 * qué problema, qué stack, cuál es el ángulo de seguridad. Los tres campos
 * vienen de content.ts; ninguno se escribe aquí.
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
      height={800}
      className="w-full rounded-2xl border border-hairline"
      sizes="(min-width: 768px) 50vw, 100vw"
    />
  )
}

function ProjectCard({ project }: { project: Project }) {
  const headingId = `proyecto-${project.id}`

  return (
    <article
      aria-labelledby={headingId}
      className="rounded-2xl border border-hairline bg-surface-card p-5 sm:p-6"
    >
      <h3 id={headingId} className="text-xl font-bold tracking-tight sm:text-2xl">
        {project.name}
      </h3>

      <div className="mt-4">
        <ProjectScreenshot project={project} />
      </div>

      <dl className="mt-5 space-y-3 text-base leading-relaxed text-ink-muted">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-widest2 text-ink-muted">
            Qué problema resuelve
          </dt>
          <dd className="mt-1.5 text-ink">
            <TextOrPending value={project.problem} />
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-widest2 text-ink-muted">
            Con qué está hecho
          </dt>
          <dd className="mt-1.5 text-ink">
            <TextOrPending value={project.stack} />
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-widest2 text-ink-muted">
            El ángulo de seguridad
          </dt>
          <dd className="mt-1.5 text-ink">
            <TextOrPending value={project.security} />
          </dd>
        </div>
      </dl>

      <div className="mt-6">
        <ExternalLinkButton link={project.link} variant="secondary" />
      </div>
    </article>
  )
}

export function Projects() {
  return (
    <section
      aria-labelledby="proyectos-title"
      id="proyectos"
      className="mx-auto max-w-content px-5 py-14 sm:px-8 sm:py-20"
    >
      <h2 id="proyectos-title" className="text-3xl font-bold tracking-tight sm:text-4xl">
        Dos cosas que he construido
      </h2>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
