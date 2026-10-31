import { contact, type Locale } from '@/content'
import { ContactForm } from '@/components/contact-form'
import { Reveal } from '@/components/reveal'
import { Section, SectionHeading } from '@/components/section'
import { isTestMode, TURNSTILE_TEST_KEYS } from '@/lib/test-mode'
import { ContactIcon } from '@/components/icons'

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
        tone="pink"
        icon={<ContactIcon />}
      />

      {/*
        La "carta de aviso" de P5R: el formulario en un panel negro con borde
        blanco, una cuña roja en la esquina y la sombra sólida roja. Es marco,
        no control: nada aquí recorta el foco de los campos.
      */}
      <Reveal>
        <div className="relative mt-10 max-w-2xl border-2 border-ink bg-surface p-5 shadow-[10px_10px_0_#c8101b] sm:p-8">
          <span
            aria-hidden="true"
            className="absolute -right-3 -top-4 rotate-6 bg-blood px-3 py-1 font-display text-xs font-black uppercase italic text-ink"
          >
            ★ ★ ★
          </span>
          <ContactForm sitekey={resolveSitekey()} locale={locale} />
        </div>
      </Reveal>
    </Section>
  )
}
