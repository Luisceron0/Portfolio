'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'

import { submitContact } from '@/app/actions/contact'
import { contact } from '@/content'
import { initialContactState } from '@/lib/contact-state'
import { LIMITS } from '@/lib/validation'

/**
 * Formulario de contacto — RF-104.
 *
 * EL PUNTO CRÍTICO DE ESTE ARCHIVO:
 * el botón de envío está deshabilitado hasta que Turnstile entrega el token.
 * Es la regresión exacta que ya ocurrió en koa-landing y que `tasks/lessons.md`
 * documenta: permitir el submit y rechazar solo en el servidor produce un 400
 * que el visitante vive como "la web no funciona".
 *
 * Fail-closed en tres niveles, no uno:
 *   1. Sin site key → el formulario entero se renderiza deshabilitado.
 *   2. Con site key pero sin token → el botón sigue deshabilitado.
 *   3. Aunque alguien fuerce el submit desde la consola → el server action
 *      rechaza por su cuenta (src/app/actions/contact.ts).
 * El nivel 3 es el que protege de verdad. Los niveles 1 y 2 son los que hacen
 * que la página no parezca rota.
 */

const TURNSTILE_SCRIPT =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

interface TurnstileApi {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string
      callback: (token: string) => void
      'error-callback': () => void
      'expired-callback': () => void
      theme?: 'light' | 'dark' | 'auto'
    }
  ) => string
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  // useFormStatus solo funciona en un hijo del <form>, de ahí este componente.
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-transparent bg-accent px-5 py-2.5 text-base font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-200 disabled:text-slate-600"
    >
      {pending ? contact.labels.submitting : contact.labels.submit}
    </button>
  )
}

function FieldError({ id, code }: { id: string; code?: keyof typeof contact.fieldErrors }) {
  if (!code) return null
  return (
    <p id={id} className="mt-1 text-sm font-medium text-warn">
      {contact.fieldErrors[code]}
    </p>
  )
}

export function ContactForm({ sitekey }: { sitekey: string | null }) {
  const [state, formAction] = useFormState(submitContact, initialContactState)
  const [token, setToken] = useState<string | null>(null)
  const widgetRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)

  const renderWidget = () => {
    if (!sitekey || !window.turnstile || !widgetRef.current) return
    if (widgetIdRef.current !== null) return
    widgetIdRef.current = window.turnstile.render(widgetRef.current, {
      sitekey,
      callback: (issued) => setToken(issued),
      // Si el desafío falla o el token caduca, se vuelve al estado sin token y
      // el botón se deshabilita otra vez. Un token caducado es igual de
      // inservible que no tenerlo.
      'error-callback': () => setToken(null),
      'expired-callback': () => setToken(null),
    })
  }

  // Cubre el caso de que el script ya estuviera cargado (navegación cliente).
  useEffect(() => {
    if (window.turnstile) renderWidget()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sitekey])

  // Tras un envío correcto se descarta el token: cada envío necesita el suyo.
  useEffect(() => {
    if (state.status === 'success') setToken(null)
  }, [state.status])

  const fieldErrors = state.status === 'error' ? state.fieldErrors : undefined
  const captchaReady = Boolean(sitekey) && token !== null

  return (
    <>
      {sitekey && (
        <Script src={TURNSTILE_SCRIPT} strategy="afterInteractive" onLoad={renderWidget} />
      )}

      <form action={formAction} noValidate className="mt-8 max-w-xl">
        {/* El token viaja como campo del formulario, con el nombre que espera el servidor. */}
        <input type="hidden" name="cf-turnstile-response" value={token ?? ''} />

        <div className="space-y-5">
          <div>
            <label htmlFor="contact-name" className="block text-sm font-semibold">
              {contact.labels.name}
            </label>
            <input
              id="contact-name"
              name="name"
              type="text"
              required
              maxLength={LIMITS.name.max}
              autoComplete="name"
              aria-invalid={fieldErrors?.name ? true : undefined}
              aria-describedby={fieldErrors?.name ? 'contact-name-error' : undefined}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-base"
            />
            <FieldError id="contact-name-error" code={fieldErrors?.name} />
          </div>

          <div>
            <label htmlFor="contact-email" className="block text-sm font-semibold">
              {contact.labels.email}
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              maxLength={LIMITS.email.max}
              autoComplete="email"
              aria-invalid={fieldErrors?.email ? true : undefined}
              aria-describedby={fieldErrors?.email ? 'contact-email-error' : undefined}
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-base"
            />
            <FieldError id="contact-email-error" code={fieldErrors?.email} />
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-sm font-semibold">
              {contact.labels.message}
            </label>
            <textarea
              id="contact-message"
              name="message"
              required
              rows={5}
              minLength={LIMITS.message.min}
              maxLength={LIMITS.message.max}
              aria-invalid={fieldErrors?.message ? true : undefined}
              aria-describedby={
                fieldErrors?.message ? 'contact-message-error' : 'contact-message-hint'
              }
              className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-base"
            />
            <p id="contact-message-hint" className="mt-1 text-sm text-ink-muted">
              {contact.hints.message}
            </p>
            <FieldError id="contact-message-error" code={fieldErrors?.message} />
          </div>
        </div>

        {/* Contenedor del widget de Turnstile. */}
        <div ref={widgetRef} className="mt-6" data-testid="turnstile-widget" />

        <div className="mt-6 flex flex-col gap-3">
          <SubmitButton disabled={!captchaReady} />

          {/* Por qué el botón está deshabilitado, dicho en voz alta. */}
          {!sitekey && (
            <p role="alert" className="text-sm font-medium text-warn">
              {contact.captcha.unavailable}
            </p>
          )}
          {sitekey && !token && (
            <p data-testid="captcha-pending" className="text-sm text-ink-muted">
              {contact.captcha.pending}
            </p>
          )}
        </div>

        {/* aria-live: un lector de pantalla anuncia el resultado sin mover el foco. */}
        <div aria-live="polite" className="mt-6">
          {state.status === 'success' && (
            <p
              data-testid="contact-success"
              className="rounded-md border border-accent bg-surface-subtle px-4 py-3 text-base font-medium text-accent"
            >
              {contact.successMessage}
            </p>
          )}
          {state.status === 'error' && (
            <p
              data-testid="contact-error"
              className="rounded-md border border-warn-border bg-warn-surface px-4 py-3 text-base font-medium text-warn"
            >
              {contact.errors[state.code]}
            </p>
          )}
        </div>
      </form>
    </>
  )
}
