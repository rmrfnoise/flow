import { Plus } from 'lucide-react'

interface EmptyStateProps {
  filtered: boolean
  onAdd: () => void
}

export default function EmptyState({ filtered, onAdd }: EmptyStateProps) {
  return (
    <div className="px-1 pt-8">
      <div className="chamfer overflow-hidden border border-[var(--line-soft)] bg-[var(--surface-0)] shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-between border-b border-[var(--line-whisper)] bg-[var(--surface-1)] px-3.5 py-2">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff5c7a]/80" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#ffc857]/80" />
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]/90" />
          </div>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.24em] text-[var(--faint)]">
            flow_console
          </span>
        </div>

        <div className="p-4 font-mono sm:p-5">
          <p className="text-[13px] text-[var(--muted)]">
            <span className="text-[var(--accent)]">$</span> flow --list
          </p>
          <p className="mt-3 text-[13px] text-[var(--accent)]">
            [ OK ] {filtered ? '没有匹配项' : '队列为空'}
          </p>
          <p className="mt-2 max-w-[280px] text-[14px] leading-[1.9] text-[var(--muted)]">
            {filtered
              ? '这个标签下还没有记录，换个 #标签 看看，或直接新建一条'
              : '记下第一件想做的事吧'}
          </p>
          <p className="mt-4 text-[13px] text-[var(--faint)]">
            <span className="text-[var(--accent)]">&gt;</span>{' '}
            <span className="blink">_</span>
          </p>

          <button
            type="button"
            onClick={onAdd}
            className="chamfer-sm mt-5 flex h-11 w-full items-center justify-center gap-2 border border-[var(--accent-line)] bg-[var(--accent-surface)] font-mono text-[13px] font-medium tracking-[0.04em] text-[var(--accent-ink)] transition-all active:scale-[0.99] hover:border-[var(--accent-strong)] hover:bg-[var(--accent-surface-hover)]"
          >
            <Plus size={13} strokeWidth={2.4} />
            {filtered ? '在这里记一条待办' : '记一条待办'}
          </button>
        </div>
      </div>

      <p className="mt-4 text-center font-mono text-[10.5px] uppercase tracking-[0.22em] text-[var(--ghost)]">
        waiting_for_input
      </p>
    </div>
  )
}
