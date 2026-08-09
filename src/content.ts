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
 *
 * FUENTES DE ESTE ARCHIVO (nada aquí es inventado):
 *  - Perfil, trayectoria, educación, certificaciones, habilidades: el YAML de
 *    RenderCV del dueño (RF-106/107). Si el CV cambia, este archivo cambia.
 *  - Proyectos: los README públicos de cada repo + las URLs en vivo, todas
 *    verificadas con HTTP 200 antes de escribirlas aquí (RF-102).
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
  /** Una línea de contexto: qué es, para quién. */
  kicker: string
  /** Qué problema resuelve, en lenguaje llano. Criterio RF-102. */
  problem: MaybePending
  /** Stack técnico real, como chips. Criterio RF-102. */
  stack: readonly string[]
  /** Ángulo de seguridad o de ingeniería. Criterio RF-102. */
  security: MaybePending
  /** Detalles técnicos verificables, en viñetas. */
  highlights: readonly string[]
  screenshot: ProjectImage
  /** Enlaces del proyecto: demo en vivo, repositorio, documentación. */
  links: readonly ExternalLink[]
}

export interface TimelineEntry {
  id: string
  /** 'trabajo' | 'estudio' — determina el icono y la etiqueta. */
  kind: 'trabajo' | 'estudio'
  title: string
  organization: string
  location: string
  /** Rango legible tal cual se muestra. Sale del CV, no se calcula. */
  period: string
  highlights: readonly string[]
}

export interface SkillGroup {
  label: string
  items: readonly string[]
}

export interface CvDownload {
  language: 'es' | 'en'
  /** Etiqueta explícita del idioma: RF-103 prohíbe adivinar el del visitante. */
  label: string
  href: MaybePending
  /** Nombre de archivo descriptivo. Criterio RF-103. */
  fileName: string
}

export interface NavItem {
  label: string
  href: string
}

// ---------------------------------------------------------------------------
// Sitio
// ---------------------------------------------------------------------------

export const site = {
  /**
   * Dominio propio. T-104: cualquier URL absoluta del servidor sale de aquí,
   * JAMÁS del header `Host`. Mientras esté [PENDIENTE], `metadataBase` queda
   * sin definir en lugar de inventarse un dominio.
   */
  url: '[PENDIENTE: dominio propio, pendiente de registrar]' as MaybePending,
  locale: 'es-ES',
  title: 'Luis Alejandro Cerón Muñoz — Ingeniero de Software Full-Stack',
  /** Meta description. Una frase, sin jerga. */
  description:
    'Ingeniero de software full-stack. Construyo aplicaciones web completas y las diseño para que sean seguras desde el primer día.',
} as const

/** RF-108: navegación dentro de la misma página. Ningún destino es una ruta. */
export const nav = {
  brand: 'LC',
  items: [
    { label: 'Perfil', href: '#perfil' },
    { label: 'Trayectoria', href: '#trayectoria' },
    { label: 'Proyectos', href: '#proyectos' },
    { label: 'Habilidades', href: '#habilidades' },
    { label: 'Contacto', href: '#contacto' },
  ] satisfies readonly NavItem[],
} as const

// ---------------------------------------------------------------------------
// RF-101 — Hero
// ---------------------------------------------------------------------------

export const hero = {
  name: 'Luis Alejandro Cerón Muñoz',
  /** Título de una línea. RF-101: un reclutador no técnico lo entiende sin buscar nada. */
  role: 'Ingeniero de Software Full-Stack',
  /**
   * RF-101: máximo dos frases, legibles sin hacer scroll en 375 px.
   * Sin jerga que obligue a buscar un término.
   *
   * La longitud NO es libre: e2e/landing.spec.ts mide que el hero completo
   * entre en 375x667. Si alargas esto, ese test falla. Es intencionado.
   */
  pitch:
    'Construyo aplicaciones web completas y las diseño desde el principio para que resistan a quien intente romperlas. Entrego producto que funciona, sin dejarte un problema de seguridad detrás.',
  location: 'Pasto, Nariño, Colombia',
  availability: 'Disponible para relocalización',
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

// ---------------------------------------------------------------------------
// RF-106 — Perfil profesional
// ---------------------------------------------------------------------------

export const profile = {
  heading: 'Perfil',
  /** Texto del CV, sin reescribir: si el CV cambia, esto cambia. */
  summary:
    'Ingeniero de Software Full-Stack con experiencia en desarrollo de aplicaciones web escalables (React, Vue, Spring Boot, Django), integración de protocolos de seguridad (RBAC, JWT) y despliegue en la nube (AWS, Docker). Egresado de la Universidad Cooperativa de Colombia, actualmente cursando una especialización en Seguridad de la Información en el Politécnico Grancolombiano. Bilingüe (inglés C1), con disponibilidad para relocalización.',
  /** Datos de contacto públicos, tomados del CV. */
  facts: [
    { label: 'Ubicación', value: 'Pasto, Nariño, Colombia' },
    { label: 'Correo', value: 'luiscerontrabajos@gmail.com' },
    { label: 'Formación', value: 'Ing. de Software · Esp. en Seguridad de la Información (en curso)' },
    { label: 'Idiomas', value: 'Español nativo · Inglés C1 (EF SET)' },
  ],
  links: [
    { label: 'LinkedIn: luis-ceronmunoz', href: 'https://www.linkedin.com/in/luis-ceronmunoz' },
    { label: 'GitHub: Luisceron0', href: 'https://github.com/Luisceron0' },
  ] satisfies readonly ExternalLink[],
} as const

// ---------------------------------------------------------------------------
// RF-106 — Trayectoria (más reciente primero)
// ---------------------------------------------------------------------------

export const timeline = {
  heading: 'Trayectoria',
  intro:
    'Experiencia y formación, en orden cronológico inverso. Todo lo de aquí sale del mismo CV que puedes descargar más abajo.',
  entries: [
    {
      id: 'especializacion',
      kind: 'estudio',
      title: 'Especialización en Seguridad de la Información',
      organization: 'Politécnico Grancolombiano',
      location: 'Colombia',
      period: 'Ene 2026 — en curso',
      highlights: ['En curso — finalización estimada: 2027.'],
    },
    {
      id: 'alcaldia',
      kind: 'trabajo',
      title: 'Practicante de Ingeniería de Software Full-Stack',
      organization: 'Alcaldía de Pasto',
      location: 'Pasto, Colombia',
      period: 'Oct 2025 — Dic 2025',
      highlights: [
        'Desarrollé un sistema full-stack de gestión de mantenimientos para una entidad pública, construyendo la interfaz de usuario y la lógica backend.',
        'Implementé Control de Acceso Basado en Roles (RBAC) y sanitización de entradas para prevenir inyecciones SQL y ataques XSS.',
        'Optimicé consultas de base de datos y arquitectura backend para mejorar los tiempos de respuesta del sistema.',
      ],
    },
    {
      id: 'universidad',
      kind: 'estudio',
      title: 'Ingeniería de Software',
      organization: 'Universidad Cooperativa de Colombia',
      location: 'Pasto, Colombia',
      period: 'Feb 2022 — Dic 2025',
      highlights: [
        'Proyecto de grado: API REST para gestión de espacios físicos utilizando IA, con autenticación JWT y gestión segura de secretos.',
        'Cursos relevantes: Arquitectura de Sistemas Escalables, Desarrollo Back-End, Metodologías Ágiles (Scrum), Ciberseguridad, Seguridad de Redes.',
      ],
    },
    {
      id: 'freelance',
      kind: 'trabajo',
      title: 'Desarrollador de Software Full-Stack',
      organization: 'Freelance',
      location: 'Remoto',
      period: 'Mar 2023 — actualidad',
      highlights: [
        'Trabajo desarrollado en modalidad de medio tiempo, en paralelo a la carrera universitaria y, posteriormente, a la práctica en la Alcaldía de Pasto.',
        'Ejecución de migraciones de datos hacia SAP y Oracle NetSuite, aplicando cifrado y respaldo de información.',
        'Implementación de soluciones CRM personalizadas (Salesforce, HubSpot) para negocios de e-commerce, incluyendo configuración de controles de acceso.',
        'Desarrollo de sistemas de reportes automatizados con Odoo, Python y PostgreSQL para procesamiento de datos en tiempo real.',
      ],
    },
  ] satisfies readonly TimelineEntry[],
} as const

// ---------------------------------------------------------------------------
// RF-102 — Proyectos (4)
// ---------------------------------------------------------------------------

export const projects: readonly Project[] = [
  {
    id: 'carelink',
    name: 'CareLink',
    kicker: 'Plataforma clínica multi-tenant · implementación de referencia',
    // Fuente: README de github.com/Luisceron0/CareLink (repo público).
    problem:
      'Un hospital necesita llevar historia clínica, triage y coordinación entre médicos sin que nadie —ni un administrador— pueda alterar un registro después de firmado, ni ver el historial de un paciente que no le corresponde.',
    stack: ['Java', 'Spring Boot', 'PostgreSQL 16', 'React 18', 'Vite', 'Docker', 'Flyway'],
    security:
      'Un encuentro clínico firmado es inmutable a nivel de trigger de PostgreSQL — ni la aplicación ni un acceso directo a la base pueden editarlo. La captura muestra el intento de edición rechazado con 409.',
    highlights: [
      'Aislamiento por schema-per-tenant, con filtro por servicio dentro del WHERE de la consulta, no sobre filas ya traídas.',
      'El acceso de un especialista vía interconsulta se revalida en cada request: el mismo JWT pasa de 200 a 403 al cerrarse, sin re-login.',
      'El motor de conocimiento suprime resultados con menos de 5 pacientes distintos, dentro de la propia query, para evitar la re-identificación.',
      'Cifrado de PHI con AES-256-GCM, IV aleatorio por operación y clave derivada por tenant.',
      'Auditoría de seguridad end-to-end: reglas Semgrep propias validadas contra código deliberadamente vulnerable, sqlmap contra la instancia real, y un hallazgo de severidad alta corregido con evidencia.',
    ],
    screenshot: {
      // Descargada del repo público de CareLink (asset público, no se tocó el repo).
      src: '/proyectos/carelink.png',
      alt: 'Pantalla de CareLink mostrando el intento de editar un encuentro clínico ya firmado, rechazado con un error 409 por un trigger de la base de datos.',
    },
    links: [
      {
        label: 'Ver las capturas del sistema',
        href: 'https://github.com/Luisceron0/CareLink/blob/main/docs/portfolio/SCREENSHOTS.md',
      },
      { label: 'Código en GitHub', href: 'https://github.com/Luisceron0/CareLink' },
    ],
  },
  {
    id: 'elevaforge',
    name: 'ElevaForge',
    kicker: 'Agencia de software · sitio corporativo con panel de administración',
    // Fuente: README de github.com/Luisceron0/ElevaForge + sitio en vivo.
    problem:
      'Una agencia de software necesita captar clientes potenciales y poder editar el contenido de su propio sitio —paquetes, proyectos, equipo— sin llamar a un desarrollador cada vez.',
    stack: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'Supabase', 'PostgreSQL', 'Vercel'],
    security:
      'Las tablas de Supabase tienen Row Level Security activado y deny-by-default: ninguna tiene policies para usuarios anónimos o autenticados a propósito. Todo el acceso pasa por el servidor, nunca por la clave pública del navegador.',
    highlights: [
      'Panel de administración con múltiples cuentas, altas y bajas gestionadas desde la propia interfaz.',
      'La semilla de sesión del panel es un secreto propio y dedicado; el arranque avisa si quedan credenciales legacy activas.',
      'Contenido editable desde el panel: paquetes, proyectos y sección de equipo, sin tocar código.',
      'Outbox de leads de contacto y diagnóstico, con estado revisable desde el panel.',
    ],
    screenshot: {
      src: '/proyectos/elevaforge.png',
      alt: 'Página de inicio de ElevaForge con el titular "Forjamos el motor digital de tu empresa".',
    },
    links: [
      { label: 'Ver elevaforge.com', href: 'https://www.elevaforge.com' },
      { label: 'Código en GitHub', href: 'https://github.com/Luisceron0/ElevaForge' },
    ],
  },
  {
    id: 'koa-landing',
    name: 'KOA Landing',
    kicker: 'Lanzamiento de producto · captación de lista de espera',
    // Fuente: README de github.com/luisCeron0Portfolio/koa-landing + sitio en vivo.
    problem:
      'Captar la lista de espera de un lanzamiento de producto sin que el formulario se convierta en una puerta abierta para spam ni en un ataque de fuerza bruta contra la bandeja de correo.',
    stack: ['Astro 7', 'React', 'TypeScript', 'Neon Postgres', 'Resend', 'Upstash', 'Turnstile'],
    security:
      'El envío se bloquea hasta que Cloudflare Turnstile confirma que no es un bot — el mismo patrón fail-closed que reutilicé en el formulario de este sitio, después de corregir una condición de carrera real.',
    highlights: [
      'Validación en servidor y flujo de confirmación por token antes de dar por buena una suscripción.',
      'Rate limiting por IP con Upstash: la IP se almacena con hash, nunca en claro.',
      'Contenido de las secciones gestionado desde un CMS, editable sin desplegar.',
      'Cobertura con tests unitarios (Vitest) y end-to-end (Playwright), incluidos los caminos de bot y de rate limit.',
    ],
    screenshot: {
      src: '/proyectos/koa-landing.png',
      alt: 'Página de inicio de KOA Landing, con el producto KOA Buds y el llamado a unirse a la lista de espera.',
    },
    links: [
      { label: 'Ver koa.elevaforge.com', href: 'https://koa.elevaforge.com/' },
      { label: 'Código en GitHub', href: 'https://github.com/luisCeron0Portfolio/koa-landing' },
    ],
  },
  {
    id: 'koa-store',
    name: 'KOA Store',
    kicker: 'Tienda de producto · catálogo bilingüe y simulación de compra',
    // Fuente: README de github.com/luisCeron0Portfolio/koa-store + sitio en vivo.
    problem:
      'Mostrar un catálogo de producto completo, en dos idiomas, con un flujo de compra realista de principio a fin — pero sin procesar pagos reales ni retener datos de nadie.',
    stack: ['Astro', 'TypeScript', 'Content Collections', 'PostgreSQL', 'Vitest', 'Vercel'],
    security:
      'El precio se valida en el servidor, no se confía en lo que llega del carrito. El carrito es anónimo y de sesión, y la tienda incluye una vía explícita de borrado de datos.',
    highlights: [
      'Catálogo bilingüe (español e inglés) con páginas de producto y selección de variantes.',
      'Simulación de checkout con validación de precios en servidor: no se procesa ningún pago real.',
      'SEO completo: sitemap, robots.txt, datos estructurados JSON-LD y metadatos por página.',
      'Cabeceras de seguridad y CSP gestionadas para el despliegue en Vercel.',
    ],
    screenshot: {
      src: '/proyectos/koa-store.png',
      alt: 'Tienda KOA con el titular "Seis productos. Ninguno de más." y el selector de idioma español/inglés.',
    },
    links: [
      { label: 'Ver store.koa.elevaforge.com', href: 'https://store.koa.elevaforge.com/es' },
      { label: 'Código en GitHub', href: 'https://github.com/luisCeron0Portfolio/koa-store' },
    ],
  },
] as const

// ---------------------------------------------------------------------------
// RF-107 — Habilidades
// ---------------------------------------------------------------------------

export const skills = {
  heading: 'Habilidades',
  intro: 'Las tecnologías con las que trabajo, agrupadas como aparecen en mi CV.',
  groups: [
    {
      label: 'Desarrollo',
      items: [
        'React',
        'Vue.js',
        'Angular',
        'Spring Boot',
        'Django',
        'JavaScript',
        'TypeScript',
        'Java',
        'Python',
        'C#',
      ],
    },
    {
      label: 'Seguridad y DevOps',
      items: [
        'RBAC',
        'JWT',
        'Prácticas de código seguro',
        'Docker',
        'AWS (EC2, S3)',
        'CI/CD',
        'Seguridad de redes',
      ],
    },
    { label: 'Bases de datos', items: ['PostgreSQL', 'MySQL', 'MongoDB'] },
    { label: 'Idiomas', items: ['Español (nativo)', 'Inglés (C1 — EF SET Certified)'] },
  ] satisfies readonly SkillGroup[],
  certificationsHeading: 'Certificaciones',
  certifications: [
    'Ciberseguridad — MinTIC Colombia (Sept 2024)',
    'Network Security — Cisco (Dic 2024)',
    'Desarrollo de Software Ágil y Scrum — IBM (Ene 2025)',
    'Building Scalable Systems — IBM (Feb 2025)',
    'Introduction to Back-End Development — Meta (Feb 2025)',
    'Certificaciones en IA y Productividad — Microsoft & LinkedIn (Feb 2025)',
  ],
} as const

// ---------------------------------------------------------------------------
// RF-103 — CV
// ---------------------------------------------------------------------------

export const cv = {
  heading: 'Descarga mi CV',
  intro: 'El mismo contenido de esta página, en un PDF que puedes guardar o reenviar.',
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

// ---------------------------------------------------------------------------
// RF-104 — Contacto
// ---------------------------------------------------------------------------

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
