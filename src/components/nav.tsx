import { HTML_LANG, LOCALES, nav, type Locale } from '@/content'
import { localeHref } from '@/lib/locale'
import { NavLinks } from '@/components/nav-links'
import { TONE_BG, type Tone } from '@/components/section'

/**
 * RF-110: el orden de `nav.items` es el mismo que el de las secciones
 * numeradas (01 Perfil … 05 Contacto), así que el cursor de la sección activa
 * usa el tono de la sección a la que apunta cada enlace.
 */
const NAV_TONES: readonly Tone[] = ['red', 'cyan', 'gold', 'blue', 'pink']

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
                ? 'bg-blood text-ink'
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
      <div className="flex items-center gap-3 border-b-4 border-blood bg-surface/90 px-3 py-2 shadow-[6px_6px_0_rgba(26,84,209,0.55)] backdrop-blur-md sm:px-5">
        {/* Marca: monograma en un recorte rojo girado, como la carta de aviso. */}
        <a
          href="#contenido"
          className="p-display shrink-0 -rotate-6 bg-blood px-2 py-0.5 text-base text-ink transition-transform duration-200 hover:rotate-0 hover:scale-110"
        >
          {nav.brand}
        </a>

        {/*
          Enlaces de sección Y selector de idioma comparten UN solo contenedor
          deslizable. No siempre fue así, y el porqué es un fallo real que
          costó dos vueltas:
          1ª vuelta: solo el `<ul>` de enlaces tenía `overflow-x-auto`, con el
          selector de idioma como hermano `shrink-0` aparte. En viewports
          estrechos (comprobado hasta 414px) los cinco enlaces no cabían y el
          `<ul>` se encogía hasta 0px de ancho REAL (medido): "Proyectos" se
          veía cortado a mitad de letra en "Proye" y "Habilidades"/"Contacto"
          quedaban fuera de pantalla, sin ninguna pista de que había más.
          2ª vuelta: se le puso un `min-w-[44px]` al `<ul>` para que nunca
          llegara a 0. Pero por debajo de ~200px eso empujaba al selector de
          idioma (el otro hermano `shrink-0`, que NUNCA se encoge) fuera del
          borde derecho de la barra. Y el scroll de PÁGINA que en teoría
          debía alcanzarlo no funcionaba: `document.scrollingElement.scrollLeft`
          medía siempre 0 pese a que `scrollWidth > clientWidth`, así que el
          selector quedaba invisible y SIN NINGUNA forma de llegar a él, peor
          que el fallo original.
          La raíz real: dos mecanismos de scroll separados, uno que
          funcionaba (el del `<ul>`) y otro que no (el implícito de la
          página). La solución no es ajustar anchos mínimos por separado, es
          que solo exista UN mecanismo: todo lo que no es la marca vive en
          este único `overflow-x-auto`, así que cualquier cosa que no quepa
          se alcanza con el MISMO gesto, nunca queda aislada.
          `min-w-0` dejar encoger este contenedor por debajo de su contenido
          es lo que activa `overflow-x-auto`; sin él, un flex item por
          defecto no se encoge más allá de su propio contenido y el scroll
          nunca entraría en juego. La máscara difumina los 20px del borde en
          vez de cortar a lo bruto, señal de "esto se desliza" en vez de
          verse como contenido roto. En desktop, donde todo cabe sin scroll,
          el padding de cada enlace absorbe el difuminado y no se nota.
        */}
        <div className="flex min-w-0 flex-1 items-center justify-between gap-3 overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_20px,black_calc(100%-20px),transparent)]">
          <NavLinks
            items={nav.items.map((item) => ({ href: item.href, label: item.label[locale] }))}
            tones={NAV_TONES.map((tone) => TONE_BG[tone])}
          />

          <div className="shrink-0">
            <LanguageSwitch locale={locale} />
          </div>
        </div>
      </div>
    </nav>
  )
}
