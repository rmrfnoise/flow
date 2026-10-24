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
      <div className="grid h-14 w-14 place-items-center rounded-full bg-[var(--surface-sunken)] text-[var(--text-3)]">
        <ListChecks size={24} strokeWidth={1.6} />
      </div>

      <h2 className="mt-4 text-[17px] font-semibold text-[var(--text)]">
        {filtered ? m.empty.filteredTitle : m.empty.title}
      </h2>
      <p className="mt-1.5 max-w-[250px] text-[14px] leading-relaxed text-[var(--text-2)]">
        {filtered ? m.empty.filteredBody : m.empty.body}
      </p>

      <button
        type="button"
        onClick={onAdd}
        className="mt-6 h-11 rounded-full bg-[var(--accent)] px-5 text-[14px] font-semibold text-[var(--on-accent)] transition-all active:scale-[0.98] hover:bg-[var(--accent-hover)]"
      >
        {filtered ? m.empty.addNew : m.empty.addFirst}
      </button>
    </div>
  )
}
