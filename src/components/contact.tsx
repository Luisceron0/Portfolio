import { contact, type Locale } from '@/content'
import { ContactForm } from '@/components/contact-form'
import { Reveal } from '@/components/reveal'
import { Section, SectionHeading } from '@/components/section'
import { isTestMode, TURNSTILE_TEST_KEYS } from '@/lib/test-mode'

/**
 * RF-104 — sección de contacto.
 *
 * Componente de servidor: resuelve aquí la site key de Turnstile y se la pasa
 * al componente cliente como prop. El cliente no puede leer variables de
 * entorno que no lleven prefijo NEXT_PUBLIC_, y la lógica de modo de prueba
 * vive en el servidor a propósito: no se envía al navegador.
 *
 * Si no hay site key, `sitekey` es null y el formulario se renderiza
 * deshabilitado con una explicación. Fail-closed también en la ausencia de
 * configuración: nunca un formulario que parece funcionar y no verifica nada.
 */
function resolveSitekey(): string | null {
  const configured = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  if (configured && configured.length > 0) return configured
  // La clave de prueba pública de Cloudflare solo entra con CONTACT_TEST_MODE=1.
  if (isTestMode) return TURNSTILE_TEST_KEYS.sitekeyAlwaysPasses
  return null
}

export function Contact({ locale }: { locale: Locale }) {
  return (
    <Section id="contacto" labelledBy="contacto-title">
      <SectionHeading
        id="contacto-title"
        number="05"
        title={contact.heading[locale]}
        intro={contact.intro[locale]}
      />

      <Reveal>
        <ContactForm sitekey={resolveSitekey()} locale={locale} />
      </Reveal>
    </Section>
  )
}
