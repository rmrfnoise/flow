import { useI18n } from '../i18n/I18nProvider'

interface FilterBarProps {
  tags: string[]
  selected: string | null
  onSelect: (tag: string | null) => void
}

const baseChip =
  'h-8 shrink-0 rounded-full px-3.5 text-[13px] font-medium transition-colors'

export default function FilterBar({
  tags,
  selected,
  onSelect,
}: FilterBarProps) {
  const { m } = useI18n()

  return (
    <div
      className="hide-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 py-1"
      role="group"
      aria-label={m.filter.label}
    >
      <button
        type="button"
        aria-pressed={selected === null}
        onClick={() => onSelect(null)}
        className={`${baseChip} ${
          selected === null
            ? 'bg-[var(--text)] text-[var(--bg)]'
            : 'border border-[var(--line)] bg-[var(--surface)] text-[var(--text-2)] hover:text-[var(--text)]'
        }`}
      >
        {m.filter.all}
      </button>

      {tags.map((tag) => {
        const active = selected === tag
        return (
          <button
            key={tag}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(tag)}
            className={`${baseChip} ${
              active
                ? 'bg-[var(--text)] text-[var(--bg)]'
                : 'border border-[var(--line)] bg-[var(--surface)] text-[var(--text-2)] hover:text-[var(--text)]'
            }`}
          >
            {tag}
          </button>
        )
      })}
    </div>
  )
}
