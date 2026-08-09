import { HTML_LANG, LOCALES, nav, type Locale } from '@/content'
import { localeHref } from '@/lib/locale'

/**
 * RF-108 (navegación interna) + RF-109 (selector de idioma).
 *
 * NO introduce rutas: los destinos de la nav son anclas (`#seccion`) del mismo
 * documento, y el selector de idioma es un parámetro de query sobre la misma
 * página. La restricción de "una sola página" del §3 de la SRS se mantiene.
 *
 * El selector son ENLACES, no botones con JavaScript: así el idioma elegido es
 * compartible y se puede marcar como favorito, que es un criterio de
 * aceptación explícito de RF-109.
 */
function LanguageSwitch({ locale }: { locale: Locale }) {
  return (
    <div
      role="group"
      aria-label={nav.language.label[locale]}
      className="flex items-center rounded-full border border-hairline p-0.5"
    >
      {LOCALES.map((candidate) => {
        const isActive = candidate === locale
        return (
          <a
            key={candidate}
            href={localeHref(candidate)}
            hrefLang={HTML_LANG[candidate]}
            // `aria-current` es lo que anuncia "estás en esta versión". El
            // color por sí solo no es información accesible.
            aria-current={isActive ? 'true' : undefined}
            className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-widest2 transition-colors ${
              isActive
                ? 'bg-accent text-surface-card'
                : 'text-ink-muted hover:bg-surface-subtle hover:text-ink'
            }`}
          >
            {candidate}
            {!isActive && (
              <span className="sr-only">. {nav.language.switchTo[candidate]}</span>
            )}
          </a>
        )
      })}
    </div>
  )
}

export function SiteNav({ locale }: { locale: Locale }) {
  return (
    <nav
      aria-label={locale === 'es' ? 'Secciones de la página' : 'Page sections'}
      className="sticky top-3 z-40 mx-auto mb-2 mt-3 w-[calc(100%-1.5rem)] max-w-content sm:top-4 sm:mt-4"
    >
      <div className="flex items-center justify-between gap-3 rounded-full border border-hairline bg-surface-card/85 px-3 py-2 shadow-[0_1px_2px_rgba(33,29,22,0.04)] backdrop-blur-md sm:px-5">
        <a
          href="#contenido"
          className="shrink-0 rounded-full px-1 text-sm font-bold tracking-widest2 text-ink"
        >
          {nav.brand}
        </a>

        <ul className="flex min-w-0 items-center gap-0.5 overflow-x-auto sm:gap-2">
          {nav.items.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="inline-block whitespace-nowrap rounded-full px-2.5 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-subtle hover:text-ink sm:px-3"
              >
                {item.label[locale]}
              </a>
            </li>
          ))}
        </ul>

        <div className="shrink-0">
          <LanguageSwitch locale={locale} />
        </div>
      </div>
    </nav>
  )
}
