import { useI18n } from '../i18n/I18nProvider'
import { formatMoney } from '../lib/expenses'

interface BalanceRowProps {
  enabled: boolean
  cents: number | null
  onToggle: () => void
  onSet: () => void
  onCalibrate: () => void
  bordered?: boolean
}

export default function BalanceRow({
  enabled,
  cents,
  onToggle,
  onSet,
  onCalibrate,
  bordered = true,
}: BalanceRowProps) {
  const { locale, m } = useI18n()

  return (
    <div
      className={`flex min-h-[54px] items-center gap-3 px-4 py-2.5 ${
        bordered ? 'border-t border-[var(--line)]' : ''
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--text-3)]">
          {enabled ? m.money.balanceActual : m.money.balance}
        </p>
        <p
          className={`mt-0.5 truncate text-[15px] font-medium tabular-nums ${
            enabled && cents !== null
              ? 'text-[var(--text)]'
              : 'text-[var(--text-2)]'
          }`}
        >
          {!enabled
            ? m.money.balanceOff
            : cents === null
              ? '--'
              : formatMoney(cents, locale)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        {enabled && (
          <button
            type="button"
            onClick={cents === null ? onSet : onCalibrate}
            className="h-8 rounded-full px-2 text-[13px] font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent-soft)]"
          >
            {cents === null ? m.money.setBalance : m.money.calibrate}
          </button>
        )}
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label={m.money.trackBalance}
          onClick={onToggle}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
            enabled ? 'bg-[var(--accent)]' : 'bg-[var(--line-strong)]'
          }`}
        >
          <span
            aria-hidden="true"
            className={`absolute left-0 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
              enabled ? 'translate-x-[20px]' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>
    </div>
  )
}
