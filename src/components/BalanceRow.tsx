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
      className={`flex min-h-[58px] items-center gap-3 py-3 ${
        bordered ? 'border-t border-[var(--rule)]' : ''
      }`}
    >
      <div className="min-w-0 flex-1">
        <p className="label">
          {enabled ? m.money.balanceActual : m.money.balance}
        </p>
        <p
          className={`fig mt-1 truncate text-[15px] ${
            enabled && cents !== null
              ? 'text-[var(--ink)]'
              : 'text-[var(--ink-3)]'
          }`}
        >
          {!enabled
            ? m.money.balanceOff
            : cents === null
              ? '--'
              : formatMoney(cents, locale)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        {enabled && (
          <button
            type="button"
            onClick={cents === null ? onSet : onCalibrate}
            className="text-[12px] tracking-[0.02em] text-[var(--ink-2)] underline decoration-[var(--rule-strong)] decoration-1 underline-offset-4 transition-colors hover:text-[var(--ink)] hover:decoration-[var(--ink)]"
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
          className="switch"
        >
          <span aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
