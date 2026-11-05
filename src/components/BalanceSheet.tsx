import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react'
import { X } from 'lucide-react'
import { useBackHandler, BACK_PRIORITY, hasBackHandlerAbove } from '../hooks/useBackHandler'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useKeyboardInset } from '../hooks/useKeyboardInset'
import { useI18n } from '../i18n/I18nProvider'
import {
  formatMoney,
  parseSignedAmountInput,
} from '../lib/expenses'
import { Z_LAYER } from '../lib/layers'
import ConfirmDialog from './ConfirmDialog'

export type BalanceSheetMode = 'setup' | 'calibrate'

interface BalanceSheetProps {
  mode: BalanceSheetMode
  currentCents: number | null
  onClose: () => void
  onConfirm: (cents: number) => void
}

export default function BalanceSheet({
  mode,
  currentCents,
  onClose,
  onConfirm,
}: BalanceSheetProps) {
  const { locale, m } = useI18n()
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [discardOpen, setDiscardOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const trapRef = useFocusTrap<HTMLDivElement>()
  useBodyScrollLock()
  const keyboardInset = useKeyboardInset()
  const isDirty = value !== ''

  const requestClose = useCallback(() => {
    if (discardOpen) return
    if (isDirty) {
      setDiscardOpen(true)
      return
    }
    onClose()
  }, [discardOpen, isDirty, onClose])

  useBackHandler(requestClose, { priority: BACK_PRIORITY.floating })

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.key === 'Escape' &&
        !hasBackHandlerAbove(BACK_PRIORITY.floating)
      ) {
        requestClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [requestClose])

  const title =
    mode === 'setup'
      ? m.money.balanceSetupTitle
      : m.money.balanceCalibrateTitle
  const hint =
    mode === 'setup'
      ? m.money.balanceSetupHint
      : m.money.balanceCalibrateHint
  const note =
    mode === 'setup'
      ? m.money.balanceSetupNote
      : m.money.balanceCalibrateNote

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const cents = parseSignedAmountInput(value)
    if (cents === null) {
      setError(m.money.balanceInvalid)
      inputRef.current?.focus()
      return
    }
    onConfirm(cents)
  }

  return (
    <div
      className="fixed inset-0 flex items-end justify-center"
      style={{ bottom: keyboardInset, zIndex: Z_LAYER.floating }}
    >
      <button
        type="button"
        aria-label={m.money.closeBackdrop}
        onClick={requestClose}
        className="absolute inset-0 bg-[var(--scrim)]"
      />

      <section
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="balance-sheet-title"
        className="sheet-enter relative z-10 flex w-full max-w-[520px] flex-col overflow-hidden rounded-t-[2px] border-t-2 border-[var(--ink)] bg-[var(--paper)] shadow-[var(--shadow-sheet)]"
        style={{ maxHeight: keyboardInset > 0 ? '100%' : undefined }}
      >
        <div className="flex items-start justify-between px-5 pb-3 pt-5">
          <h2
            id="balance-sheet-title"
            className="page-title text-[var(--ink)]"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={requestClose}
            aria-label={m.money.close}
            className="-mr-1 grid h-9 w-9 place-items-center text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2"
        >
          {mode === 'calibrate' && currentCents !== null && (
            <div className="mb-5 flex items-baseline justify-between border-b border-[var(--rule)] pb-2.5">
              <span className="text-[12.5px] text-[var(--ink-3)]">
                {m.money.balanceCurrent}
              </span>
              <span className="fig text-[15px] text-[var(--ink)]">
                {formatMoney(currentCents, locale)}
              </span>
            </div>
          )}

          <label
            htmlFor="balance-amount"
            className="label block"
          >
            {m.money.balanceActual}
          </label>
          <div
            className={`mt-2 flex items-baseline gap-2.5 border-b pb-2 transition-colors ${
              error
                ? 'border-[var(--red)]'
                : 'border-[var(--ink)] focus-within:border-[var(--red)]'
            }`}
          >
            <span className="fig text-[22px] text-[var(--ink-3)]">
              ¥
            </span>
            <input
              id="balance-amount"
              ref={inputRef}
              type="text"
              inputMode="text"
              value={value}
              onChange={(event) => {
                const next = event.target.value
                if (
                  next === '' ||
                  /^-?\d{0,7}(\.\d{0,2})?$/u.test(next)
                ) {
                  setValue(next)
                  setError('')
                }
              }}
              placeholder={m.money.balanceInputPlaceholder}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'balance-amount-error' : undefined}
              autoComplete="off"
              autoFocus
              className="fig min-w-0 flex-1 bg-transparent text-[40px] leading-none tracking-[-0.03em] tabular-nums text-[var(--ink)] outline-none placeholder:text-[var(--ink-3)]"
            />
          </div>
          {error && (
            <p
              id="balance-amount-error"
              role="alert"
              className="mt-1.5 text-[13px] text-[var(--red)]"
            >
              {error}
            </p>
          )}

          <p className="mt-5 text-[13px] font-medium text-[var(--ink)]">
            {hint}
          </p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--ink-3)]">
            {note}
          </p>

          <button
            type="submit"
            className="btn btn-primary mt-6 h-12 w-full"
          >
            {mode === 'calibrate'
              ? m.money.balanceAdjust
              : m.money.balanceSave}
          </button>
        </form>
      </section>

      {discardOpen && (
        <ConfirmDialog
          title={m.app.unsavedTitle}
          description={m.app.unsavedDescription}
          cancelLabel={m.app.cancel}
          confirmLabel={m.app.discard}
          onClose={() => setDiscardOpen(false)}
          onConfirm={() => {
            setDiscardOpen(false)
            onClose()
          }}
        />
      )}
    </div>
  )
}
