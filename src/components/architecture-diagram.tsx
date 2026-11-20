import type { CaseLayer, Locale } from '@/content'
import { TONE_BORDER, TONE_TEXT, type Tone } from '@/components/section'

/**
 * Diagrama simple de capas de un caso, de fuera hacia dentro.
 *
 * Es HTML y no una imagen: una lista ordenada se lee igual con lector de
 * pantalla que a la vista, no necesita texto alternativo aparte y no puede
 * desincronizarse del contenido de content.ts. Las flechas son decorativas.
 */
export function ArchitectureDiagram({
  layers,
  locale,
  tone,
  label,
  compact = false,
}: {
  layers: readonly CaseLayer[]
  locale: Locale
  tone: Tone
  label: string
  compact?: boolean
}) {
  return (
    <ol aria-label={label} className="flex flex-col items-stretch">
      {layers.map((layer, index) => (
        <li key={layer.label.es} className="flex flex-col items-stretch">
          {index > 0 && (
            <span aria-hidden="true" className={`self-center py-1 font-mono text-sm leading-none ${TONE_TEXT[tone]}`}>
              ↓
            </span>
          )}
          <div className={`border-l-4 bg-surface px-4 ${compact ? 'py-2' : 'py-3'} ${TONE_BORDER[tone]}`}>
            <p className={`font-mono text-[0.68rem] font-bold uppercase tracking-spec ${TONE_TEXT[tone]}`}>
              {layer.label[locale]}
            </p>
            {!compact && <p className="mt-1 text-sm leading-relaxed text-ink">{layer.detail[locale]}</p>}
          </div>
        </li>
      ))}
    </ol>
  )
}
