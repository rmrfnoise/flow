import { useEffect, useRef, type ReactNode } from 'react'
import { AlertTriangle, X } from 'lucide-react'

interface ConfirmDialogProps {
  title: string
  description: ReactNode
  confirmLabel: string
  cancelLabel?: string
  onConfirm: () => void
  onClose: () => void
}

export default function ConfirmDialog({
  title,
  description,
  confirmLabel,
  cancelLabel = '先留着',
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    const focusTimer = window.setTimeout(() => {
      cancelRef.current?.focus()
    }, 80)
    return () => window.clearTimeout(focusTimer)
  }, [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-5">
      <button
        type="button"
        aria-label="关闭确认窗口"
        onClick={onClose}
        className="backdrop-enter absolute inset-0 cursor-default bg-[#000402]/85 backdrop-blur-[4px]"
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className="dialog-enter chamfer relative z-10 w-full max-w-[348px] border border-[var(--danger-panel-border)] bg-[var(--surface-0)] p-5 shadow-[0_0_50px_rgba(255,92,122,0.10),0_24px_70px_var(--dialog-drop)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭"
          className="chamfer-sm absolute right-3.5 top-3.5 grid h-7 w-7 place-items-center border border-transparent text-[var(--muted)] transition-colors hover:border-[var(--line-soft)] hover:text-[var(--ink-soft)]"
        >
          <X size={14} strokeWidth={2} />
        </button>

        <p className="font-mono text-[10.5px] uppercase tracking-[0.26em] text-[#8c4a58]">
          // warning
        </p>

        <div className="chamfer-sm mt-3 grid h-10 w-10 place-items-center border border-[var(--danger-icon-border)] bg-[var(--danger-icon-bg)] text-[var(--danger-icon-text)]">
          <AlertTriangle size={18} strokeWidth={1.8} />
        </div>

        <h2
          id="confirm-dialog-title"
          className="mt-4 font-display text-[20px] font-semibold tracking-[0.02em] text-[var(--ink)]"
        >
          {title}
        </h2>
        <div
          id="confirm-dialog-description"
          className="mt-2 font-mono text-[14px] leading-[1.85] text-[var(--muted)]"
        >
          {description}
        </div>

        <div className="mt-5 flex gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            className="chamfer-sm h-11 flex-1 border border-[var(--line-mid)] bg-[var(--surface-2)] font-mono text-[13px] font-medium text-[var(--ink-soft)] transition-all active:scale-[0.98] hover:border-[var(--accent-line)]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="chamfer-sm h-11 flex-1 border border-[var(--danger-action-border)] bg-[var(--danger-action-bg)] font-mono text-[13px] font-medium text-[var(--danger-action-text)] shadow-[0_0_18px_rgba(255,92,122,0.14)] transition-all active:scale-[0.98] active:bg-[var(--danger-action-active)]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
