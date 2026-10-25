import { useEffect, useRef, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useI18n } from '../i18n/I18nProvider'

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
  cancelLabel = 'Cancel',
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const { m } = useI18n()
  const cancelRef = useRef<HTMLButtonElement | null>(null)
  const trapRef = useFocusTrap<HTMLDivElement>()
  useBodyScrollLock()

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
    <div className="fixed inset-0 z-[60] grid place-items-center p-6">
      <button
        type="button"
        aria-label={m.confirm.close}
        onClick={onClose}
        className="fade-enter absolute inset-0 cursor-default bg-[var(--scrim)] backdrop-blur-[2px]"
      />

      <div
        ref={trapRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        tabIndex={-1}
        className="dialog-enter relative z-10 w-full max-w-[320px] rounded-[16px] bg-[var(--surface)] p-6 text-center shadow-[var(--shadow-dialog)]"
      >
        <div className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-[var(--danger-soft)] text-[var(--danger)]">
          <AlertTriangle size={19} strokeWidth={1.9} />
        </div>

        <h2
          id="confirm-dialog-title"
          className="mt-3 text-[18px] font-semibold text-[var(--text)]"
        >
          {title}
        </h2>
        <div
          id="confirm-dialog-description"
          className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--text-2)]"
        >
          {description}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            className="h-11 rounded-[10px] bg-[var(--surface-sunken)] text-[14px] font-medium text-[var(--text)] transition-colors hover:brightness-95"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-11 rounded-[10px] bg-[var(--danger)] text-[14px] font-semibold text-[var(--on-danger)] transition-opacity active:opacity-85"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
