import { isPending } from '@/content'

/**
 * Renderiza un dato de content.ts que todavía no está resuelto.
 *
 * Existe para que un `[PENDIENTE: ...]` sea IMPOSIBLE de pasar por alto: se ve
 * como un aviso, no se cuela como texto normal ni como un enlace roto.
 * `scripts/check-pending.mjs` impide además que llegue a un despliegue.
 */
export function PendingNote({ value }: { value: string }) {
  return (
    <span
      role="note"
      className="inline-block rounded-lg border border-warn-border bg-warn-surface px-2.5 py-1 text-sm font-medium text-warn"
    >
      {value}
    </span>
  )
}

/** Muestra el texto si está resuelto; si no, el aviso de pendiente. */
export function TextOrPending({ value }: { value: string }) {
  return isPending(value) ? <PendingNote value={value} /> : <>{value}</>
}
