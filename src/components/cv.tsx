import { cv, type Locale } from '@/content'
import { ExternalLinkButton } from '@/components/external-link'
import { Reveal } from '@/components/reveal'

/**
 * RF-103 — descarga del CV.
 *
 * Los dos idiomas se ofrecen etiquetados de forma explícita. No se detecta el
 * idioma del visitante ni se elige por él: es un requisito del criterio, no una
 * preferencia de diseño. Ojo: esto es independiente del idioma en que se esté
 * viendo la página; ambos PDF se ofrecen siempre.
 *
 * Los PDF los genera RenderCV en otro repo (RF-006 de la SRS del portafolio);
 * este sitio solo enlaza a los archivos ya generados.
 */
export function CvDownloads({ locale }: { locale: Locale }) {
  return (
    <section aria-labelledby="cv-title" id="cv" className="bg-surface-subtle py-16 sm:py-20">
      <div className="mx-auto max-w-content px-5 sm:px-8">
        <Reveal>
          <h2 id="cv-title" className="text-3xl font-bold tracking-tight sm:text-4xl">
            {cv.heading[locale]}
          </h2>

          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">
            {cv.intro[locale]}
          </p>

          <ul className="mt-8 flex flex-col gap-3 sm:flex-row">
            {cv.downloads.map((download) => (
              <li key={download.language}>
                <ExternalLinkButton
                  link={{ label: download.label, href: download.href }}
                  locale={locale}
                  variant="secondary"
                  download={download.fileName}
                />
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
