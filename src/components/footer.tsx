import { footer, hero, type Locale } from '@/content'
import { BrushStroke, TornEdge } from '@/components/zine'

/**
 * Contraportada del zine (RF-110 v5): una tira de fotocopia lila con el borde
 * superior rasgado. Sobre el lila solo vale la tinta (tinta.muted 4.11:1 no
 * llega), así que todo el texto va en tinta.
 */
export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="relative mt-10 bg-tone-lilac text-tinta [background-image:var(--grain-dark)]">
      <TornEdge className="pointer-events-none absolute inset-x-0 -top-2 h-2.5 w-full" color="#B6A6B6" flip />
      <div className="mx-auto max-w-content px-5 py-10 sm:px-8">
        <BrushStroke className="mb-6 h-3 w-full max-w-sm" color="#0b0a0f" />
        <div className="p-type flex flex-col gap-2 text-xs text-tinta">
          <p>{footer.note[locale]}</p>
          <p className="p-display text-sm">{hero.name}</p>
        </div>
      </div>
    </footer>
  )
}
