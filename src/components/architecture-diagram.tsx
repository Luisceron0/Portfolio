import type { CaseLayer, Locale } from '@/content'
import type { Tone } from '@/components/section'
import { ArrowDoodle } from '@/components/zine'

/**
 * Diagrama de capas de un caso, de fuera hacia dentro, como fichas de papel
 * apiladas (RF-110 v5): cada capa es una fotocopia pequeña en tinta, con giro
 * alterno, una grapa en la primera y una flecha dibujada entre capas.
 *
 * Es HTML y no una imagen: una lista ordenada se lee igual con lector de
 * pantalla que a la vista, no necesita texto alternativo aparte y no puede
 * desincronizarse del contenido de content.ts. Grapas y flechas son
 * decorativas. El modo compacto conserva el material y omite el detalle.
 */
export function ArchitectureDiagram({
  layers,
  locale,
  label,
  compact = false,
}: {
  layers: readonly CaseLayer[]
  locale: Locale
  /** Se acepta por compatibilidad con los llamadores; el material es el mismo. */
  tone?: Tone
  label: string
  compact?: boolean
}) {
  return (
    <ol aria-label={label} className="flex flex-col items-stretch px-1">
      {layers.map((layer, index) => (
        <li key={layer.label.es} className="flex flex-col items-stretch">
          {index > 0 && <ArrowDoodle className="h-6 w-5 self-center text-ink-muted" />}
          <div
            className={`m-sheet px-4 ${compact ? 'py-2' : 'py-3'}`}
            style={{ rotate: `${index % 2 === 0 ? -1 : 1}deg` }}
          >
            <p className="p-type text-xs font-bold text-tinta">{layer.label[locale]}</p>
            {!compact && <p className="mt-1 text-sm leading-relaxed text-tinta">{layer.detail[locale]}</p>}
          </div>
        </li>
      ))}
    </ol>
  )
}
