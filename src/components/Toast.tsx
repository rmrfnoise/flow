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
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom)+64px)] z-40 px-5">
      <div
        role="status"
        aria-live="polite"
        className="toast-enter pointer-events-auto mx-auto flex min-h-[46px] max-w-[420px] items-center gap-3 rounded-[12px] bg-[#1f2126] px-4 py-2.5 text-[#f2f3f5] shadow-[0_12px_32px_rgba(0,0,0,0.28)] ring-1 ring-white/10"
      >
        <span className="flex-1 text-[13px] leading-snug">{message}</span>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="shrink-0 text-[13px] font-semibold text-[#7be3ae] transition-opacity active:opacity-70"
          >
            {actionLabel}
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label={m.toast.close}
          className="-mr-1 grid h-6 w-6 shrink-0 place-items-center rounded-full text-white/45 transition-colors hover:text-white/80"
        >
          <X size={13} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  )
}
