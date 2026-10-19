import { X } from 'lucide-react'

interface ToastProps {
  message: string
  actionLabel?: string
  onAction?: () => void
  onClose: () => void
}

export default function Toast({
  message,
  actionLabel,
  onAction,
  onClose,
}: ToastProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+92px)] z-40 px-5">
      <div className="mx-auto flex max-w-[520px] justify-start">
        <div
          role="status"
          aria-live="polite"
          className="toast-enter chamfer-sm pointer-events-auto flex min-h-[48px] max-w-full items-center gap-2.5 border border-[var(--accent-line)] bg-[var(--surface-2)] px-3.5 py-2.5 shadow-[0_12px_35px_rgba(0,0,0,0.5),0_0_20px_var(--accent-glow-faint)]"
        >
          <span className="font-mono text-[10.5px] text-[var(--accent-strong)]">[OK]</span>
          <span className="font-mono text-[13px] text-[var(--ink-soft)]">
            {message}
          </span>
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="shrink-0 border border-[var(--accent-line)] bg-[var(--accent-soft)] px-2 py-1 font-mono text-[11.5px] font-semibold text-[var(--accent-ink)] transition-colors active:bg-[var(--accent-soft)]"
            >
              {actionLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭提示"
            className="ml-0.5 grid h-5 w-5 shrink-0 place-items-center text-[var(--faint)] transition-colors hover:text-[var(--ink-soft)]"
          >
            <X size={11} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  )
}
