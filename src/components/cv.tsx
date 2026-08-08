import { cv } from '@/content'
import { ExternalLinkButton } from '@/components/external-link'

/**
 * RF-103 — descarga del CV.
 *
 * Los dos idiomas se ofrecen etiquetados de forma explícita. No se detecta el
 * idioma del visitante ni se elige por él: es un requisito del criterio, no una
 * preferencia de diseño.
 *
 * Los PDF los genera RenderCV en otro repo (RF-006 de la SRS del portafolio);
 * este sitio solo enlaza a los archivos ya generados.
 */
export function CvDownloads() {
  return (
    <section
      aria-labelledby="cv-title"
      id="cv"
      className="bg-surface-subtle py-14 sm:py-20"
    >
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <h2 id="cv-title" className="text-3xl font-bold tracking-tight sm:text-4xl">
          {cv.heading}
        </h2>

        <ul className="mt-6 flex flex-col gap-3 sm:flex-row">
          {cv.downloads.map((download) => (
            <li key={download.language}>
              <ExternalLinkButton
                link={{ label: download.label, href: download.href }}
                variant="secondary"
                download={download.fileName}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
