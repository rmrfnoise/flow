import { ListChecks } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'

interface EmptyStateProps {
  filtered: boolean
  onAdd: () => void
}

export default function EmptyState({ filtered, onAdd }: EmptyStateProps) {
  const { m } = useI18n()

  return (
    <div className="fade-enter flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-6 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-[var(--surface-sunken)] text-[var(--text-3)]">
        <ListChecks size={22} strokeWidth={1.6} />
      </div>

      <h2 className="mt-3 text-[16px] font-semibold text-[var(--text)]">
        {filtered ? m.empty.filteredTitle : m.empty.title}
      </h2>
      <p className="mt-1.5 max-w-[250px] text-[13.5px] leading-relaxed text-[var(--text-2)]">
        {filtered ? m.empty.filteredBody : m.empty.body}
      </p>

      <button
        type="button"
        onClick={onAdd}
        className="mt-5 h-10 rounded-[10px] bg-[var(--accent)] px-4 text-[13px] font-medium text-[var(--on-accent)] transition-colors hover:bg-[var(--accent-hover)]"
      >
        {filtered ? m.empty.addNew : m.empty.addFirst}
      </button>
    </div>
  )
}
