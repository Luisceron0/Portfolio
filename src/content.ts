/**
 * Contenido del sitio. Fuente única de verdad.
 *
 * Regla 2 de .github/copilot-instructions.md: el dueño edita ESTE archivo, no
 * va a buscar strings dentro de los componentes. Ningún componente puede
 * contener copy visible al usuario.
 *
 * Regla 3: ninguna afirmación sin enlace que la respalde. Si un dato todavía no
 * se puede respaldar, se escribe como `[PENDIENTE: ...]` — nunca se inventa.
 * `scripts/check-pending.mjs` falla si queda alguno antes de un despliegue.
 */

// ---------------------------------------------------------------------------
// Mecanismo [PENDIENTE]
// ---------------------------------------------------------------------------

/** Marca de dato aún no aportado por el dueño. Convención del glosario de la SRS. */
export type Pending = `[PENDIENTE: ${string}]`

/** Un valor que puede estar todavía sin resolver. */
export type MaybePending<T extends string = string> = T | Pending

export function isPending(value: string | null | undefined): value is Pending {
  return typeof value === 'string' && value.startsWith('[PENDIENTE:')
}

/**
 * Devuelve el valor solo si está resuelto. Los componentes usan esto para NO
 * renderizar un enlace roto ni una afirmación sin respaldo.
 */
export function resolved(value: string | null | undefined): string | null {
  return typeof value === 'string' && value.length > 0 && !isPending(value) ? value : null
}

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

export interface ExternalLink {
  /** Texto del enlace. Regla 4: nombra el recurso exacto, nunca "Ver más". */
  label: string
  href: MaybePending
}

export interface ProjectImage {
  src: MaybePending
  /** Texto alternativo descriptivo. Requisito de accesibilidad WCAG AA. */
  alt: MaybePending
}

export interface Project {
  id: string
  name: string
  /** Qué problema resuelve, en lenguaje llano. Criterio RF-102. */
  problem: MaybePending
  /** Stack técnico real. Criterio RF-102. */
  stack: MaybePending
  /** Ángulo de seguridad. Criterio RF-102. */
  security: MaybePending
  screenshot: ProjectImage
  link: ExternalLink
}

export interface CvDownload {
  language: 'es' | 'en'
  /** Etiqueta explícita del idioma: RF-103 prohíbe adivinar el del visitante. */
  label: string
  href: MaybePending
  /** Nombre de archivo descriptivo. Criterio RF-103. */
  fileName: string
}

// ---------------------------------------------------------------------------
// Contenido
// ---------------------------------------------------------------------------

export const site = {
  /**
   * Dominio propio. T-104: cualquier URL absoluta del servidor sale de aquí,
   * JAMÁS del header `Host`. Mientras esté [PENDIENTE], `metadataBase` queda
   * sin definir en lugar de inventarse un dominio.
   */
  url: '[PENDIENTE: dominio propio, pendiente de registrar]' as MaybePending,
  locale: 'es-ES',
  title: 'Luis Alejandro Cerón Muñoz — Desarrollador full-stack',
  /** Meta description. Una frase, sin jerga. */
  description:
    'Desarrollo aplicaciones web completas y las diseño para que sean seguras desde el primer día.',
} as const

export const hero = {
  name: 'Luis Alejandro Cerón Muñoz',
  /** Título de una línea. RF-101: un reclutador no técnico lo entiende sin buscar nada. */
  role: 'Desarrollador full-stack con enfoque en seguridad',
  /**
   * RF-101: máximo dos frases, legibles sin hacer scroll en 375 px.
   * Sin jerga que obligue a buscar un término.
   *
   * La longitud NO es libre: e2e/landing.spec.ts mide que el hero completo
   * entre en 375x667. Si alargas esto, ese test falla. Es intencionado.
   */
  pitch:
    'Construyo aplicaciones web completas y las diseño desde el principio para que resistan a quien intente romperlas. Entrego producto que funciona, sin dejarte un problema de seguridad detrás.',
  /** RF-105: visible sin pasar del hero. Enlace al perfil, no a un repo suelto. */
  githubLink: {
    label: 'Ver mi perfil de GitHub',
    href: 'https://github.com/Luisceron0',
  } satisfies ExternalLink,
  contactCta: {
    label: 'Escríbeme',
    /** Ancla interna a la sección de contacto. Una sola página (regla 1). */
    href: '#contacto',
  },
} as const

export const projects: readonly Project[] = [
  {
    id: 'carelink',
    name: 'CareLink',
    // Fuente: README de github.com/Luisceron0/CareLink (repo público).
    problem:
      'Un hospital necesita llevar historia clínica, triage y coordinación entre médicos sin que nadie —ni un administrador— pueda alterar un registro después de firmado, ni ver el historial de un paciente que no le corresponde.',
    stack: 'Java (Spring Boot) y PostgreSQL 16 en el backend, React 18 + Vite en el frontend, todo en Docker.',
    security:
      'Un encuentro clínico firmado es inmutable a nivel de trigger de PostgreSQL — ni la aplicación ni un acceso directo a la base pueden editarlo (ver la captura: intento de edición rechazado con 409). El acceso de un especialista a una interconsulta se revalida en cada petición, y el motor de búsqueda de casos previos oculta resultados por debajo de 5 pacientes distintos para evitar la re-identificación.',
    screenshot: {
      // Descargada directamente de docs/portfolio/screenshots/07-encounter-edit-409.png
      // del repo público de CareLink (asset público, no se tocó el repo).
      src: '/proyectos/carelink.png',
      alt: 'Pantalla de CareLink mostrando el intento de editar un encuentro clínico ya firmado, rechazado con un error 409 por un trigger de la base de datos.',
    },
    link: {
      label: 'Ver las capturas de CareLink',
      href: 'https://github.com/Luisceron0/CareLink/blob/main/docs/portfolio/SCREENSHOTS.md',
    },
  },
  {
    id: 'koa',
    name: 'ElevaForge / KOA',
    // Fuente: README de github.com/luisCeron0Portfolio/koa-landing (repo público).
    problem:
      'Captar la lista de espera de un lanzamiento de producto sin que el formulario se convierta en una puerta abierta para spam ni en un ataque de fuerza bruta contra la bandeja de correo.',
    stack: 'Astro 7 + React para el frontend, Neon Postgres y Resend para el backend, desplegado en Vercel.',
    security:
      'El formulario valida los datos en servidor, limita los envíos por IP con Upstash (la IP se guarda con hash, no en claro), y bloquea el envío hasta que Cloudflare Turnstile confirma que no es un bot — el mismo patrón fail-closed que reutilicé en el formulario de contacto de este sitio, después de corregir una condición de carrera real (ver tasks/lessons.md).',
    screenshot: {
      // Captura tomada en vivo con agent-browser contra el despliegue real de Vercel.
      src: '/proyectos/koa.png',
      alt: 'Página de inicio de la demo en vivo de KOA Buds, con el CTA "Unirme a la lista de espera".',
    },
    link: {
      label: 'Abrir la demo en vivo de KOA',
      href: 'https://demo-landing-delta.vercel.app',
    },
  },
] as const

export const cv = {
  heading: 'Descarga mi CV',
  /** RF-103: los dos idiomas etiquetados de forma explícita, sin autodetección. */
  downloads: [
    {
      language: 'es',
      label: 'CV en español (PDF)',
      href: '[PENDIENTE: añadir /cv/luis-ceron-cv-es.pdf generado con RenderCV]',
      fileName: 'luis-ceron-cv-es.pdf',
    },
    {
      language: 'en',
      label: 'CV in English (PDF)',
      href: '[PENDIENTE: añadir /cv/luis-ceron-cv-en.pdf generado con RenderCV]',
      fileName: 'luis-ceron-cv-en.pdf',
    },
  ] satisfies readonly CvDownload[],
} as const

export const contact = {
  heading: 'Hablemos',
  intro:
    'Cuéntame qué necesitas y te respondo. No guardo tus datos: el mensaje llega a mi correo y nada más.',
  labels: {
    name: 'Nombre',
    email: 'Correo electrónico',
    message: 'Mensaje',
    submit: 'Enviar mensaje',
    submitting: 'Enviando…',
  },
  hints: {
    message: 'Entre 10 y 5000 caracteres.',
  },
  /**
   * Estados del widget antifraude. El primero explica por qué el botón está
   * deshabilitado: un botón inerte sin explicación se lee como una web rota.
   */
  captcha: {
    pending: 'Comprobando que no eres un robot… el botón se activa al terminar.',
    unavailable:
      'La verificación antifraude no está disponible ahora mismo, así que el formulario está deshabilitado. Escríbeme por GitHub mientras tanto.',
  },
  /**
   * T-103: todos los mensajes son texto estático. Nunca se devuelve a la página
   * nada de lo que el visitante haya escrito.
   */
  successMessage: 'Mensaje enviado. Te responderé al correo que indicaste.',
  /** Un código de error del servidor → un texto. El motivo técnico no se expone. */
  errors: {
    VALIDATION: 'Revisa los campos marcados y vuelve a intentarlo.',
    CAPTCHA:
      'No se pudo completar la verificación antifraude. Recarga la página e inténtalo otra vez.',
    RATE_LIMITED:
      'Has enviado varios mensajes seguidos. Espera unos minutos antes de volver a intentarlo.',
    SEND_FAILED:
      'No se pudo enviar el mensaje. Vuelve a intentarlo o escríbeme directamente por GitHub.',
  },
  /** Un código de validación → un texto. Nunca se repite lo que escribió el visitante. */
  fieldErrors: {
    REQUIRED: 'Este campo es obligatorio.',
    TOO_SHORT: 'Es demasiado corto.',
    TOO_LONG: 'Es demasiado largo.',
    INVALID_EMAIL: 'No parece una dirección de correo válida.',
    CONTROL_CHARS: 'Contiene caracteres que no se admiten.',
  },
} as const

export const footer = {
  note: 'Sitio propio, sin cookies de terceros ni analítica que te siga.',
} as const
