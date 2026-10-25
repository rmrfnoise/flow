export function BrandGlyph({
  size = 22,
  className = '',
}: {
  size?: number
  className?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M3 8.2c3.1-3.5 5.9 3.3 9 0s5.5-2.8 9-.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M3 12.4c3.1-3.5 5.9 3.3 9 0s5.5-2.8 9-.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.62"
      />
      <path
        d="M3 16.6c3.1-3.5 5.9 3.3 9 0s5.5-2.8 9-.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity="0.34"
      />
    </svg>
  )
}

export default function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[12px] bg-[var(--accent-soft)] text-[var(--accent)]">
        <BrandGlyph size={25} />
      </span>
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-[18px] font-semibold tracking-[-0.045em] text-[var(--text)]">
            flow
          </span>
          <span className="text-[9px] font-medium uppercase tracking-[0.13em] text-[var(--text-3)]">
            local-first
          </span>
        </div>
        <p className="mt-0.5 text-[10px] uppercase tracking-[0.11em] text-[var(--text-3)]">
          quiet by design
        </p>
      </div>
    </div>
  )
}
