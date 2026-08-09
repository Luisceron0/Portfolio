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
 * URL de esta misma página en el idioma indicado.
 *
 * El español, que es el idioma por defecto, se queda sin parámetro para que la
 * URL canónica sea limpia.
 */
export function localeHref(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '/' : `/?${LOCALE_PARAM}=${locale}`
}
