export default function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <div className="chamfer-sm relative grid h-10 w-10 place-items-center border border-[var(--accent-line)] bg-[var(--surface-2)] shadow-[0_0_18px_var(--accent-glow-faint)]">
        <span className="font-mono text-[17px] font-bold tracking-[-0.12em] text-[var(--accent)]">
          &gt;_
        </span>
        <span className="absolute right-0 top-0 h-2 w-2 border-r border-t border-[var(--accent-strong)]" />
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[20px] font-bold uppercase tracking-[0.12em] text-[var(--ink)]">
            flow
          </span>
          <span className="h-1.5 w-1.5 animate-pulse bg-[var(--accent)] shadow-[0_0_8px_var(--accent-glow-strong)]" />
        </div>
        <p className="hidden font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--faint)] sm:block">
          personal_todo_os
        </p>
      </div>
    </div>
  )
}
