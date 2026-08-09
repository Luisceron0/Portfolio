import { footer, hero, type Locale } from '@/content'

export function Footer({ locale }: { locale: Locale }) {
  return (
    <footer className="border-t border-hairline bg-surface-subtle">
      <div className="mx-auto flex max-w-content flex-col gap-2 px-5 py-8 text-sm text-ink-muted sm:px-8">
        <p>{footer.note[locale]}</p>
        <p>{hero.name}</p>
      </div>
    </footer>
  )
}
