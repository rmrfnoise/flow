import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Wallet, X } from 'lucide-react'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useKeyboardInset } from '../hooks/useKeyboardInset'
import { useI18n } from '../i18n/I18nProvider'
import {
  formatMoney,
  parseSignedAmountInput,
} from '../lib/expenses'

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
  const inputRef = useRef<HTMLInputElement>(null)
  const trapRef = useFocusTrap<HTMLDivElement>()
  useBodyScrollLock()
  const keyboardInset = useKeyboardInset()

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

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
      className="fixed inset-0 z-[70] flex items-end justify-center"
      style={{ bottom: keyboardInset }}
    >
      <button
        type="button"
        aria-label={m.money.closeBackdrop}
        onClick={onClose}
        className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
      />

      <section
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="balance-sheet-title"
        className="sheet-enter relative z-10 flex w-full max-w-[520px] flex-col overflow-hidden rounded-t-[var(--radius-sheet)] bg-[var(--surface)] shadow-[var(--shadow-sheet)]"
        style={{ maxHeight: keyboardInset > 0 ? '100%' : undefined }}
      >
        <div className="flex justify-center pt-2.5">
          <span
            aria-hidden="true"
            className="h-1 w-9 rounded-full bg-[var(--line-strong)]"
          />
        </div>

        <div className="flex items-center justify-between px-5 pb-1 pt-3">
          <h2
            id="balance-sheet-title"
            className="type-title font-semibold text-[var(--text)]"
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={m.money.close}
            className="-mr-1.5 grid h-8 w-8 place-items-center rounded-full text-[var(--text-3)] transition-colors hover:bg-[var(--surface-sunken)] hover:text-[var(--text)]"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2"
        >
          {mode === 'calibrate' && currentCents !== null && (
            <div className="mb-4 flex items-center justify-between rounded-[10px] bg-[var(--surface-sunken)] px-3.5 py-3">
              <span className="text-[13px] text-[var(--text-2)]">
                {m.money.balanceCurrent}
              </span>
              <span className="text-[15px] font-medium tabular-nums text-[var(--text)]">
                {formatMoney(currentCents, locale)}
              </span>
            </div>
          )}

          <label
            htmlFor="balance-amount"
            className="block text-[13px] font-medium text-[var(--text-2)]"
          >
            {m.money.balanceActual}
          </label>
          <div
            className={`mt-1.5 flex items-baseline gap-2.5 rounded-[12px] border bg-[var(--surface-sunken)] px-4 py-3.5 ${
              error
                ? 'border-[var(--danger)]'
                : 'border-[var(--line)] focus-within:border-[var(--accent)]'
            }`}
          >
            <Wallet
              size={18}
              strokeWidth={1.8}
              className="shrink-0 text-[var(--text-3)]"
            />
            <span className="text-[20px] font-medium text-[var(--text-3)]">
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
              className="min-w-0 flex-1 bg-transparent text-[34px] font-semibold leading-none tracking-[-0.035em] tabular-nums text-[var(--text)] outline-none placeholder:text-[var(--text-3)]"
            />
          </div>
          {error && (
            <p
              id="balance-amount-error"
              role="alert"
              className="mt-1.5 text-[13px] text-[var(--danger)]"
            >
              {error}
            </p>
          )}

          <p className="mt-4 text-[13px] font-medium text-[var(--text)]">
            {hint}
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-[var(--text-3)]">
            {note}
          </p>

          <button
            type="submit"
            className="mt-5 flex h-12 w-full items-center justify-center rounded-[10px] bg-[var(--accent)] text-[15px] font-medium text-[var(--on-accent)] transition-colors hover:bg-[var(--accent-hover)]"
          >
            {mode === 'calibrate'
              ? m.money.balanceAdjust
              : m.money.balanceSave}
          </button>
        </form>
      </section>
    </div>
  )
}
