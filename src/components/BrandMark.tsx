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
      <span className="grid h-9 w-9 shrink-0 place-items-center border border-[var(--rule-strong)] text-[var(--ink)]">
        <BrandGlyph size={20} />
      </span>
      <div className="min-w-0">
        <p className="fig text-[21px] leading-none text-[var(--ink)]">
          flow
        </p>
        <p className="label mt-1.5">local-first</p>
      </div>
    </div>
  )
}
