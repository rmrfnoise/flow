export default function BrandMark() {
  return (
    <div className="flex items-center gap-[7px]">
      <span className="text-[15px] font-semibold tracking-[-0.015em] text-[var(--text)]">
        flow
      </span>
      <span
        aria-hidden="true"
        className="h-[5px] w-[5px] rounded-full bg-[var(--accent)]"
      />
    </div>
  )
}
