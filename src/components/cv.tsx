import { cv, type Locale } from '@/content'
import { ExternalLinkButton } from '@/components/external-link'
import { Reveal } from '@/components/reveal'
import { SlashRule } from '@/components/persona'

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
 *
 * Es la banda violeta a sangre. Sobre violeta TODO el texto es `ink`: el gris
 * secundario no llega a 4.5:1 ahí, y los botones usan la variante `dark`.
 */
export function CvDownloads({ locale }: { locale: Locale }) {
  return (
    <section
      aria-labelledby="cv-title"
      id="cv"
      className="p-band p-halftone relative my-8 overflow-hidden bg-violet"
    >
      {/* Tajos negros decorativos que cruzan la banda. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-0 h-full w-72 -skew-x-[24deg] bg-surface/90 sm:w-96"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-60 top-0 hidden h-full w-6 -skew-x-[24deg] bg-ink sm:block sm:right-[26rem]"
      />
      <div className="relative mx-auto max-w-content px-5 sm:px-8">
        <Reveal>
          <SlashRule className="mb-8 max-w-xs [&>span:first-child]:bg-surface" />

          <h2 id="cv-title" className="p-display text-4xl leading-none sm:text-6xl">
            {cv.heading[locale]}
          </h2>

          <p className="mt-5 max-w-2xl text-lg font-medium leading-relaxed text-ink">
            {cv.intro[locale]}
          </p>

          <ul className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:gap-6">
            {cv.downloads.map((download) => (
              <li key={download.language}>
                <ExternalLinkButton
                  link={{ label: download.label, href: download.href }}
                  locale={locale}
                  variant="dark"
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
