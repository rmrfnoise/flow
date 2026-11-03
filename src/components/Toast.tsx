import { X } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'

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
  const { m } = useI18n()

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+70px)] z-40 px-5">
      <div
        role="status"
        aria-live="polite"
        className="toast-enter pointer-events-auto mx-auto flex min-h-[46px] max-w-[440px] items-center gap-3 rounded-[2px] bg-[var(--toast-bg)] px-4 py-2.5 text-[13px] text-[var(--toast-fg)]"
      >
        <span className="flex-1 leading-snug">{message}</span>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="shrink-0 text-[12.5px] font-semibold tracking-[0.04em] text-[var(--toast-accent)] transition-opacity active:opacity-70"
          >
            {actionLabel}
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label={m.toast.close}
          className="-mr-1 grid h-6 w-6 shrink-0 place-items-center text-[var(--toast-fg)]/50 transition-colors hover:text-[var(--toast-fg)]"
        >
          <X size={13} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  )
}
