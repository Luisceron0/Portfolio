import { cv, type Locale } from '@/content'
import { ExternalLinkButton } from '@/components/external-link'
import { Reveal } from '@/components/reveal'
import { BrushStroke, Staple } from '@/components/zine'

/**
 * RF-103 — descarga del CV.
 *
 * Los dos idiomas se ofrecen etiquetados de forma explícita. No se detecta el
 * idioma del visitante ni se elige por él: es un requisito del criterio, no una
 * preferencia de diseño. Ambos PDF se ofrecen siempre.
 *
 * Los PDF los genera RenderCV desde `cv/*.yaml`; este sitio solo enlaza a los
 * archivos ya generados.
 *
 * En papel (RF-110 v5): un afiche magenta pegado con cuatro grapas, con una
 * tira de cinta kraft cruzada. Sobre magenta TODO el texto es tinta (papel no
 * llega a 4.5:1) y los botones usan la variante `dark`.
 */
export function CvDownloads({ locale }: { locale: Locale }) {
  return (
    <section aria-labelledby="cv-title" id="cv" className="m-magenta relative my-8 overflow-x-clip py-20 sm:py-24">
      {/* Tira de kraft cruzada en diagonal: solo decoración, detrás del texto. */}
      <div aria-hidden="true" className="m-kraft pointer-events-none absolute -right-10 top-10 hidden h-10 w-[28rem] rotate-[-14deg] opacity-90 md:block" />
      <Staple className="left-6 top-6" />
      <Staple className="right-6 top-6" />
      <Staple className="bottom-6 left-6" />
      <Staple className="bottom-6 right-6" />

      <div className="relative mx-auto max-w-content px-5 sm:px-8">
        <Reveal>
          <BrushStroke className="mb-8 h-3 w-full max-w-xs" color="#0b0a0f" draw />

          <h2 id="cv-title" className="p-display text-4xl leading-none text-tinta sm:text-6xl">
            {cv.heading[locale]}
          </h2>

          <p className="mt-5 max-w-2xl text-lg font-medium leading-relaxed text-tinta">{cv.intro[locale]}</p>

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
