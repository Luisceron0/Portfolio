import { headers } from 'next/headers'

import { DEFAULT_LOCALE, toLocale, type Locale } from '@/content'
import { LOCALE_HEADER, LOCALE_PARAM } from '@/middleware'

/**
 * Idioma de la petición actual, resuelto en el servidor.
 *
 * Lo pone `src/middleware.ts` a partir del parámetro `?lang=` de la URL. Se lee
 * de una cabecera porque un layout de Next 14 no recibe `searchParams`, y el
 * `<html lang>` tiene que ser correcto ya en la primera respuesta (criterio de
 * aceptación de RF-109), no después de un intercambio en el cliente.
 */
export function getLocale(): Locale {
  return toLocale(headers().get(LOCALE_HEADER))
}

/**
 * URL de una página del sitio en el idioma indicado.
 *
 * El español, que es el idioma por defecto, se queda sin parámetro para que la
 * URL canónica sea limpia. `path` es la ruta de la página (`/` para la home,
 * `/casos/carelink` para un caso, RF-111).
 */
export function localeHref(locale: Locale, path = '/'): string {
  return locale === DEFAULT_LOCALE ? path : `${path}?${LOCALE_PARAM}=${locale}`
}

/** Ruta de la página de detalle de un caso de seguridad (RF-111). */
export function casePath(slug: string): string {
  return `/casos/${slug}`
}

/** URL del detalle de un caso, en el idioma indicado. */
export function caseHref(slug: string, locale: Locale): string {
  return localeHref(locale, casePath(slug))
}

/**
 * Ancla de la home en el idioma indicado. Desde la propia home basta con
 * `#casos`; desde una página de caso hay que volver a `/` (o `/?lang=en`).
 */
export function homeAnchor(anchor: string, locale: Locale, onHome: boolean): string {
  return onHome ? anchor : `${localeHref(locale)}${anchor}`
}
