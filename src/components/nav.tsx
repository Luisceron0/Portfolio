import { HTML_LANG, LOCALES, nav, navItems, type Locale } from '@/content'
import { homeAnchor, localeHref } from '@/lib/locale'
import { NavLinks } from '@/components/nav-links'
import { TornEdge } from '@/components/zine'

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
function LanguageSwitch({ locale, path }: { locale: Locale; path: string }) {
  return (
    <div role="group" aria-label={nav.language.label[locale]} className="flex items-center gap-1.5">
      {LOCALES.map((candidate) => {
        const isActive = candidate === locale
        return (
          <a
            key={candidate}
            href={localeHref(candidate, path)}
            hrefLang={HTML_LANG[candidate]}
            // `aria-current` es lo que anuncia "estás en esta versión". El
            // color por sí solo no es información accesible.
            aria-current={isActive ? 'true' : undefined}
            // Dos etiquetas Dymo: la activa en magenta, la otra en tinta con borde papel.
            className={`m-dymo text-[0.7rem] transition-transform duration-200 hover:-translate-y-0.5 ${
              isActive ? 'm-dymo--magenta' : 'm-dymo--edge'
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

/**
 * `path` es la ruta de la página actual. En la home los destinos son anclas
 * (`#casos`); en una página de caso (RF-111) vuelven a la home en el mismo
 * idioma (`/?lang=en#casos`), y el selector de idioma cambia el idioma de la
 * página en la que se está, no manda a la home.
 */
export function SiteNav({ locale, path = '/' }: { locale: Locale; path?: string }) {
  const onHome = path === '/'

  return (
    <nav
      aria-label={locale === 'es' ? 'Secciones de la página' : 'Page sections'}
      className="sticky top-0 z-40 bg-surface"
    >
      {/*
        Header acoplado a todo el ancho, no una tarjeta flotante: nada que se
        corte en los bordes ni scroll horizontal propio. Los enlaces van en
        línea desde `xl`; por debajo se pliegan tras el botón de menú (ver
        nav-links.tsx) y el selector de idioma queda siempre a la vista. Por
        debajo de 260px (zoom de accesibilidad alto) la marca se oculta para
        que idioma y menú sigan cabiendo.
      */}
      <div className="relative mx-auto flex h-16 max-w-content items-center gap-3 px-3 sm:px-8 xl:gap-6">
        {/* Marca: monograma recortado de revista, en papel y tinta, con cinta. */}
        <a
          href={onHome ? '#contenido' : localeHref(locale)}
          className="p-display p-on-paper relative shrink-0 -rotate-6 bg-paper px-2 py-0.5 text-base text-tinta transition-transform duration-200 [filter:drop-shadow(2px_2px_0_#5a1257)] hover:rotate-0 hover:scale-110 max-[259px]:hidden"
        >
          {nav.brand}
          <span aria-hidden="true" className="m-tape -top-2 left-1 !h-3 !w-8 [--tape-r:12deg]" />
        </a>

        <NavLinks
          items={navItems().map((item) => ({
            href: homeAnchor(item.href, locale, onHome),
            label: item.label[locale],
          }))}
          menuLabel={locale === 'es' ? 'Menú de secciones' : 'Sections menu'}
        />

        <div className="ml-auto shrink-0 xl:ml-0">
          <LanguageSwitch locale={locale} path={path} />
        </div>
      </div>

      {/* Borde inferior rasgado en magenta: la tira de cartulina se corta a mano. */}
      <TornEdge className="pointer-events-none absolute inset-x-0 -bottom-2 h-2.5 w-full" color="#d903d5" />

      {/* Progreso de lectura: una tira de cinta magenta con extremo dentado que
          crece con el scroll (solo con animation-timeline). */}
      <div
        aria-hidden="true"
        className="p-progress pointer-events-none absolute inset-x-0 -bottom-3 h-1.5 scale-x-0 bg-magenta [clip-path:polygon(0_0,100%_0,99%_50%,100%_100%,0_100%)]"
      />
    </nav>
  )
}
