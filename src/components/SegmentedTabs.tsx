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
      className="relative grid rounded-[12px] bg-[var(--surface-sunken)] p-1"
      style={{
        gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-1 left-1 top-1 rounded-[9px] bg-[var(--segment-active)] shadow-[var(--shadow-card)] transition-transform duration-[280ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          width: `calc((100% - 0.5rem) / ${options.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={`relative z-10 h-9 rounded-[9px] text-[13px] font-medium transition-colors duration-200 ${
              active
                ? 'text-[var(--text)]'
                : 'text-[var(--text-2)] hover:text-[var(--text)]'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
