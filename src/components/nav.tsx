import { HTML_LANG, LOCALES, nav, type Locale } from '@/content'
import { localeHref } from '@/lib/locale'
import { TONE_DOT, type Tone } from '@/components/section'

/**
 * RF-110: el orden de `nav.items` es el mismo que el de las secciones
 * numeradas (01 Perfil … 05 Contacto), así que el subrayado en hover usa el
 * tono de la sección a la que apunta cada enlace. No es un color nuevo: es el
 * mismo sistema de orientación por color que ya usan los números y las
 * tarjetas, aplicado a la navegación.
 */
const NAV_TONES: readonly Tone[] = ['indigo', 'teal', 'ochre', 'plum', 'rust']

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
      className="flex items-center border border-hairline"
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
                ? 'bg-accent text-surface'
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
      <div className="flex items-center justify-between gap-3 border border-hairline bg-surface/85 px-3 py-2 backdrop-blur-md sm:px-5">
        <a
          href="#contenido"
          className="shrink-0 px-1 font-mono text-sm font-bold tracking-widest2 text-ink"
        >
          {nav.brand}
        </a>

        {/*
          En viewports estrechos (comprobado hasta 414px) los cinco enlaces no
          caben junto a la marca y el selector de idioma: "Proyectos" se veía
          cortado a mitad de letra en "Proye" y "Habilidades"/"Contacto"
          quedaban fuera de pantalla. El scroll horizontal (`overflow-x-auto`)
          ya los alcanza arrastrando, pero sin ninguna pista de que hay más
          menú se lee como contenido roto, no como una lista deslizable.

          La máscara no recorta nada nuevo: solo difumina los 20px del borde
          por los que el `<ul>` ya cortaba antes a lo bruto, así que la letra
          cortada se lee como "hay más aquí" en vez de como un fallo visual.
          En desktop, donde los cinco enlaces caben sin scroll, el hueco de
          `px-2.5`/`px-3` de cada enlace absorbe el difuminado y no se nota.
        */}
        <ul
          className="flex min-w-0 items-center gap-0.5 overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_20px,black_calc(100%-20px),transparent)] sm:gap-2"
        >
          {nav.items.map((item, index) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="group relative inline-block whitespace-nowrap px-2.5 py-1.5 text-sm font-medium text-ink-muted transition-colors hover:text-ink sm:px-3"
              >
                {item.label[locale]}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-x-2.5 bottom-0.5 h-0.5 origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100 sm:inset-x-3 ${TONE_DOT[NAV_TONES[index % NAV_TONES.length]]}`}
                />
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
