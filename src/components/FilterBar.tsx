import { useI18n } from '../i18n/I18nProvider'

interface FilterBarProps {
  tags: string[]
  selected: string | null
  onSelect: (tag: string | null) => void
}

const base =
  'relative shrink-0 pb-2.5 pt-2 text-[12.5px] tracking-[0.06em] transition-colors'

export default function FilterBar({
  tags,
  selected,
  onSelect,
}: FilterBarProps) {
  const { m } = useI18n()

  function tabClass(active: boolean) {
    return `${base} ${
      active
        ? 'font-semibold text-[var(--ink)]'
        : 'text-[var(--ink-3)] hover:text-[var(--ink-2)]'
    }`
  }

  function Mark({ active }: { active: boolean }) {
    return active ? (
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[2px] bg-[var(--red)]"
      />
    ) : null
  }

  return (
    <div
      className="hide-scrollbar -mx-1 flex gap-5 overflow-x-auto px-1"
      role="group"
      aria-label={m.filter.label}
    >
      <button
        type="button"
        aria-pressed={selected === null}
        onClick={() => onSelect(null)}
        className={tabClass(selected === null)}
      >
        {m.filter.all}
        <Mark active={selected === null} />
      </button>

      {tags.map((tag) => {
        const active = selected === tag
        return (
          <button
            key={tag}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(tag)}
            className={tabClass(active)}
          >
            <span className="text-[var(--ink-3)]">#</span>
            {tag}
            <Mark active={active} />
          </button>
        )
      })}
    </div>
  )
}
