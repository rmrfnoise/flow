import { tagStyle } from '../data/tags'

interface FilterBarProps {
  tags: string[]
  selected: string | null
  onSelect: (tag: string | null) => void
}

export default function FilterBar({
  tags,
  selected,
  onSelect,
}: FilterBarProps) {
  return (
    <div
      className="hide-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1 py-0.5"
      role="group"
      aria-label="按标签筛选待办"
    >
      <button
        type="button"
        aria-pressed={selected === null}
        onClick={() => onSelect(null)}
        className={`chamfer-sm flex h-9 shrink-0 items-center gap-1 border px-3 font-mono text-[13px] tracking-[0.04em] transition-all duration-200 active:scale-[0.97] ${
          selected === null
            ? 'border-[var(--accent-strong)] bg-[var(--accent-soft)] text-[var(--accent-ink)] shadow-[0_0_18px_var(--accent-glow-soft)]'
            : 'border-[var(--line-soft)] bg-[var(--surface-0)] text-[var(--muted)] hover:border-[var(--line-strong)]'
        }`}
      >
        <span
          className={
            selected === null ? 'text-[var(--accent-strong)]' : 'text-[var(--accent-dim)]'
          }
        >
          &gt;
        </span>
        全部
      </button>

      {tags.map((tag) => {
        const style = tagStyle(tag)
        const active = selected === tag
        return (
          <button
            key={tag}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(tag)}
            className={`chamfer-sm flex h-9 shrink-0 items-center gap-0.5 border px-2.5 font-mono text-[13px] tracking-[0.02em] transition-all duration-200 active:scale-[0.97] ${
              active
                ? style.active
                : `${style.border} ${style.background} ${style.text} opacity-75 hover:opacity-100`
            }`}
          >
            <span className="opacity-50">#</span>
            {tag}
          </button>
        )
      })}
    </div>
  )
}
