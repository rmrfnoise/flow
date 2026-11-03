interface SegmentedOption<T extends string> {
  value: T
  label: string
}

interface SegmentedTabsProps<T extends string> {
  ariaLabel: string
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
}

export default function SegmentedTabs<T extends string>({
  ariaLabel,
  options,
  value,
  onChange,
}: SegmentedTabsProps<T>) {
  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  )

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="relative flex border-b border-[var(--rule)]"
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={`relative flex-1 pb-2.5 pt-1 text-[12.5px] tracking-[0.06em] transition-colors duration-200 ${
              active
                ? 'font-semibold text-[var(--ink)]'
                : 'text-[var(--ink-3)] hover:text-[var(--ink-2)]'
            }`}
          >
            {option.label}
          </button>
        )
      })}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-[2px] bg-[var(--red)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          width: `calc(100% / ${options.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
    </div>
  )
}
