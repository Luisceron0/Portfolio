import { HTML_LANG, LOCALES, nav, type Locale } from '@/content'
import { localeHref } from '@/lib/locale'
import { NavLinks } from '@/components/nav-links'
import { TONE_BG, type Tone } from '@/components/section'

/**
 * RF-110: el orden de `nav.items` es el mismo que el de las secciones
 * numeradas (01 Perfil … 05 Contacto), así que el cursor de la sección activa
 * usa el tono de la sección a la que apunta cada enlace.
 */
const NAV_TONES: readonly Tone[] = ['violet', 'green', 'mint', 'lilac', 'silver']

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
      className="flex -skew-x-[10deg] items-center border-2 border-ink"
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
            className={`px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-widest2 transition-colors ${
              isActive
                ? 'bg-violet text-ink'
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
      className="sticky top-0 z-40 border-b-2 border-violet bg-surface/95 backdrop-blur-md"
    >
      {/*
        Header acoplado a todo el ancho, no una tarjeta flotante: nada que se
        corte en los bordes ni scroll horizontal propio. Los enlaces van en
        línea desde `lg`; por debajo se pliegan tras el botón de menú (ver
        nav-links.tsx) y el selector de idioma queda siempre a la vista. Por
        debajo de 260px (zoom de accesibilidad alto) la marca se oculta para
        que idioma y menú sigan cabiendo.
      */}
      <div className="relative mx-auto flex h-16 max-w-content items-center gap-3 px-3 sm:px-8 lg:gap-6">
        {/* Marca: monograma en un recorte violeta girado, como la carta de aviso. */}
        <a
          href="#contenido"
          className="p-display shrink-0 -rotate-6 bg-violet px-2 py-0.5 text-base text-ink transition-transform duration-200 hover:rotate-0 hover:scale-110 max-[259px]:hidden"
        >
          {nav.brand}
        </a>

        <NavLinks
          items={nav.items.map((item) => ({ href: item.href, label: item.label[locale] }))}
          tones={NAV_TONES.map((tone) => TONE_BG[tone])}
          menuLabel={locale === 'es' ? 'Menú de secciones' : 'Sections menu'}
        />

        <div className="ml-auto shrink-0 lg:ml-0">
          <LanguageSwitch locale={locale} />
        </div>
      </div>

      {/* Progreso de lectura sobre el filo inferior del header: crece con el
          scroll (solo con animation-timeline). `sticky` hace de contenedor. */}
      <div
        aria-hidden="true"
        className="p-progress pointer-events-none absolute inset-x-0 -bottom-[2px] h-[2px] scale-x-0 bg-tone-green"
      />
    </nav>
  )
}
