import { footer, hero, type Locale } from '@/content'
import { SpecRule } from '@/components/ascii'

export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="border-t border-hairline bg-surface-card">
      <div className="mx-auto max-w-content px-5 py-10 sm:px-8">
        <SpecRule className="mb-6" />
        <div className="flex flex-col gap-2 font-mono text-xs uppercase tracking-widest2 text-ink-muted">
          <p>{footer.note[locale]}</p>
          {/* `deco` NO se usa aquí aunque encajaría visualmente: es texto real
              y ese token no llega a 4.5:1 contra ningún fondo. Ver la nota en
              scripts/check-contrast.mjs. */}
          <p className="text-ink">{hero.name}</p>
        </div>
      </div>
    </footer>
  )
}
