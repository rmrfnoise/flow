import { useI18n } from '../i18n/I18nProvider'

interface EmptyStateProps {
  filtered: boolean
  onAdd: () => void
}

export default function EmptyState({ filtered, onAdd }: EmptyStateProps) {
  const { m } = useI18n()

  return (
    <div className="fade-enter mt-8">
      <span aria-hidden="true" className="block h-[2px] w-8 bg-[var(--red)]" />
      <h2 className="page-title mt-4">
        {filtered ? m.empty.filteredTitle : m.empty.title}
      </h2>
      <p className="mt-2 max-w-[280px] text-[13.5px] leading-relaxed text-[var(--ink-2)]">
        {filtered ? m.empty.filteredBody : m.empty.body}
      </p>

      <button type="button" onClick={onAdd} className="btn btn-ghost mt-6">
        {filtered ? m.empty.addNew : m.empty.addFirst}
      </button>
    </div>
  )
}
