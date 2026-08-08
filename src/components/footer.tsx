import { footer, hero } from '@/content'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-surface-subtle">
      <div className="mx-auto flex max-w-content flex-col gap-2 px-5 py-8 text-sm text-ink-muted sm:px-8">
        <p>{footer.note}</p>
        <p>{hero.name}</p>
      </div>
    </footer>
  )
}
