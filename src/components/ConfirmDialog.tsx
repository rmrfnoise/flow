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
        className="fade-enter absolute inset-0 cursor-default bg-[var(--scrim)] "
      />

      <div
        ref={trapRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        tabIndex={-1}
        className="dialog-enter relative z-10 w-full max-w-[330px] rounded-[2px] border border-[var(--rule-strong)] border-t-2 border-t-[var(--ink)] bg-[var(--paper)] p-6 text-center shadow-[var(--shadow-dialog)]"
      >
        <div className="mx-auto grid h-8 w-8 place-items-center text-[var(--red)]">
          <AlertTriangle size={20} strokeWidth={1.9} />
        </div>

        <h2
          id="confirm-dialog-title"
          className="page-title mt-3 text-[var(--ink)]"
        >
          {title}
        </h2>
        <div
          id="confirm-dialog-description"
          className="mt-2 text-[13px] leading-relaxed text-[var(--ink-2)]"
        >
          {description}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            className="btn btn-ghost h-11 min-w-0 px-3"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn h-11 min-w-0 px-3 bg-[var(--red)] text-[#fdf7f4] hover:bg-[var(--red-hover)]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
