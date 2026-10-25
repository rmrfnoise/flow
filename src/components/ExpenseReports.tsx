import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, ReceiptText } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import {
  addDaysKey,
  endOfMonthKey,
  endOfWeekKey,
  formatMonthDay,
  formatMonthLabel,
  shiftMonthKey,
  startOfMonthKey,
  startOfWeekKey,
} from '../lib/habits'
import {
  buildExpenseReport,
  formatExpensePeriod,
  formatMoney,
  formatSignedMoney,
  type CustomExpenseCategory,
  type Expense,
} from '../lib/expenses'
import { getCategoryIcon } from '../lib/categoryIcons'
import BalanceRow from './BalanceRow'

type ReportPeriod = 'week' | 'month'

interface ExpenseReportsProps {
  expenses: Expense[]
  customCategories: CustomExpenseCategory[]
  todayKey: string
  period: ReportPeriod
  balanceEnabled: boolean
  balanceCents: number | null
  onToggleBalance: () => void
  onSetBalance: () => void
  onCalibrateBalance: () => void
}

export default function ExpenseReports({
  expenses,
  customCategories,
  todayKey,
  period,
  balanceEnabled,
  balanceCents,
  onToggleBalance,
  onSetBalance,
  onCalibrateBalance,
}: ExpenseReportsProps) {
  const { locale, m } = useI18n()
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeekKey(todayKey),
  )
  const [monthKey, setMonthKey] = useState(() =>
    todayKey.slice(0, 7),
  )
  const [activeKey, setActiveKey] = useState<string | null>(null)

  const { fromKey, toKey, rangeLabel } = useMemo(() => {
    const from =
      period === 'week'
        ? weekStart
        : startOfMonthKey(`${monthKey}-01`)
    const to =
      period === 'week'
        ? endOfWeekKey(weekStart)
        : endOfMonthKey(from)
    return {
      fromKey: from,
      toKey: to,
      rangeLabel:
        period === 'week'
          ? formatExpensePeriod(from, to, locale)
          : formatMonthLabel(monthKey, locale),
    }
  }, [locale, monthKey, period, weekStart])

  const report = useMemo(
    () =>
      buildExpenseReport({
        expenses,
        fromKey,
        toKey,
        todayKey,
        customCategories,
        locale,
        uncategorizedLabel: m.money.uncategorized,
        otherLabel: m.money.otherCategories,
      }),
    [
      customCategories,
      expenses,
      fromKey,
      locale,
      m.money.otherCategories,
      m.money.uncategorized,
      toKey,
      todayKey,
    ],
  )

  function movePeriod(delta: number) {
    if (period === 'week') {
      setWeekStart((current) => addDaysKey(current, delta * 7))
    } else {
      setMonthKey((current) => shiftMonthKey(current, delta))
    }
  }

  function goCurrent() {
    if (period === 'week') {
      setWeekStart(startOfWeekKey(todayKey))
    } else {
      setMonthKey(todayKey.slice(0, 7))
    }
  }

  const isCurrentPeriod =
    period === 'week'
      ? weekStart === startOfWeekKey(todayKey)
      : monthKey === todayKey.slice(0, 7)

  const weekdayFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(
        locale === 'zh' ? 'zh-CN' : 'en-US',
        { weekday: 'short' },
      ),
    [locale],
  )

  const trendBuckets = useMemo(() => {
    if (period === 'week') {
      return report.daily.map((day) => {
        const dayNumber = Number(day.date.slice(8, 10))
        return {
          key: day.date,
          label: weekdayFormatter.format(
            new Date(
              Number(day.date.slice(0, 4)),
              Number(day.date.slice(5, 7)) - 1,
              dayNumber,
            ),
          ),
          range: formatMonthDay(day.date, locale),
          totalCents: day.totalCents,
        }
      })
    }

    const buckets: Array<{
      key: string
      label: string
      range: string
      totalCents: number
    }> = []
    for (let index = 0; index < report.daily.length; index += 7) {
      const days = report.daily.slice(index, index + 7)
      if (days.length === 0) continue
      const first = days[0]
      const last = days[days.length - 1]
      buckets.push({
        key: `week-${index / 7}`,
        label: m.money.weekBucket(index / 7 + 1),
        range: `${formatMonthDay(first.date, locale)} –?${formatMonthDay(
          last.date,
          locale,
        )}`,
        totalCents: days.reduce(
          (sum, day) => sum + day.totalCents,
          0,
        ),
      })
    }
    return buckets
  }, [locale, m.money, period, report.daily, weekdayFormatter])

  const maxBucket = useMemo(
    () =>
      Math.max(
        1,
        ...trendBuckets.map((bucket) => bucket.totalCents),
      ),
    [trendBuckets],
  )
  const activeBucket =
    trendBuckets.find((bucket) => bucket.key === activeKey) ?? null

  return (
    <div className="mt-4">
      <div className="flex items-center justify-center gap-1.5">
        <button
          type="button"
          aria-label={m.money.previous}
          onClick={() => movePeriod(-1)}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[var(--text-2)] transition-colors hover:bg-[var(--surface-sunken)]"
        >
          <ChevronLeft size={16} strokeWidth={2} />
        </button>
        <span className="min-w-[120px] max-w-[170px] truncate text-center text-[13px] font-medium text-[var(--text-2)]">
          {rangeLabel}
        </span>
        {!isCurrentPeriod && (
          <button
            type="button"
            onClick={goCurrent}
            className="h-7 shrink-0 rounded-full px-2 text-[11px] font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent-soft)]"
          >
            {period === 'week' ? m.money.thisWeek : m.money.thisMonth}
          </button>
        )}
        <button
          type="button"
          aria-label={m.money.next}
          onClick={() => movePeriod(1)}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[var(--text-2)] transition-colors hover:bg-[var(--surface-sunken)]"
        >
          <ChevronRight size={16} strokeWidth={2} />
        </button>
      </div>

      {report.count === 0 ? (
        <>
          <div className="mt-4 overflow-hidden rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface)]">
            <BalanceRow
              enabled={balanceEnabled}
              cents={balanceCents}
              onToggle={onToggleBalance}
              onSet={onSetBalance}
              onCalibrate={onCalibrateBalance}
              bordered={false}
            />
          </div>
          <div className="mt-4 flex flex-col items-center rounded-[16px] border border-[var(--line)] bg-[var(--surface)] px-6 py-12 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
              <ReceiptText size={22} strokeWidth={1.7} />
            </div>
            <p className="mt-4 text-[15px] font-semibold text-[var(--text)]">
              {m.money.noExpensesPeriod}
            </p>
          </div>
        </>
      ) : (
        <>
          <section className="mt-3 rounded-[16px] border border-[var(--line)] bg-[var(--surface)] p-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--text-3)]">
              {m.money.net}
            </p>
            <p className="mt-1.5 text-[32px] font-semibold leading-none tracking-[-0.035em] tabular-nums text-[var(--text)]">
              {formatSignedMoney(report.netCents, locale)}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <p className="text-[11px] text-[var(--text-3)]">
                  {m.money.income}
                </p>
                <p className="mt-0.5 text-[15px] font-medium tabular-nums text-[var(--accent)]">
                  {formatMoney(report.incomeCents, locale)}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-[var(--text-3)]">
                  {m.money.expenses}
                </p>
                <p className="mt-0.5 text-[15px] font-medium tabular-nums text-[var(--text)]">
                  {formatMoney(report.totalCents, locale)}
                </p>
              </div>
            </div>
            <div className="-mx-4 mt-4">
              <BalanceRow
                enabled={balanceEnabled}
                cents={balanceCents}
                onToggle={onToggleBalance}
                onSet={onSetBalance}
                onCalibrate={onCalibrateBalance}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[var(--line)] pt-3">
              <div>
                <p className="text-[11px] text-[var(--text-3)]">
                  {m.money.entries}
                </p>
                <p className="mt-0.5 text-[15px] font-medium tabular-nums text-[var(--text)]">
                  {report.count}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-[var(--text-3)]">
                  {m.money.dailyAverage}
                </p>
                <p className="mt-0.5 text-[15px] font-medium tabular-nums text-[var(--text)]">
                  {formatMoney(report.averageCents, locale)}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-4 rounded-[16px] border border-[var(--line)] bg-[var(--surface)] p-4">
            <h2 className="type-section font-semibold text-[var(--text)]">
              {m.money.trend}
            </h2>
            <div className="mt-5 flex h-[76px] items-end gap-2">
              {trendBuckets.map((bucket, index) => {
                const active = bucket.key === activeKey
                const height =
                  bucket.totalCents === 0
                    ? 2
                    : Math.max(
                        4,
                        Math.round(
                          (bucket.totalCents / maxBucket) * 76,
                        ),
                      )
                return (
                  <button
                    key={bucket.key}
                    type="button"
                    aria-pressed={active}
                    aria-label={`${bucket.range} · ${formatMoney(
                      bucket.totalCents,
                      locale,
                    )}`}
                    onClick={() =>
                      setActiveKey((current) =>
                        current === bucket.key ? null : bucket.key,
                      )
                    }
                    className="flex h-full min-w-0 flex-1 items-end rounded-[8px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  >
                    <span
                      className={`trend-bar mx-auto w-full max-w-[44px] rounded-t-[4px] ${
                        bucket.totalCents > 0
                          ? active
                            ? 'bg-[var(--accent)]'
                            : 'bg-[var(--text-2)]'
                          : 'bg-[var(--surface-sunken)]'
                      }`}
                      style={{
                        height: `${height}px`,
                        animationDelay: `${index * 35}ms`,
                      }}
                    />
                  </button>
                )
              })}
            </div>
            <div className="mt-2 flex gap-2">
              {trendBuckets.map((bucket) => (
                <span
                  key={bucket.key}
                  className={`min-w-0 flex-1 truncate text-center text-[11px] ${
                    bucket.key === activeKey
                      ? 'font-medium text-[var(--accent)]'
                      : 'text-[var(--text-3)]'
                  }`}
                >
                  {bucket.label}
                </span>
              ))}
            </div>
            <div className="mt-3 flex h-8 items-center justify-between gap-3 rounded-[8px] bg-[var(--surface-sunken)] px-2.5 text-[11px]">
              {activeBucket ? (
                <>
                  <span className="min-w-0 truncate text-[var(--text-2)]">
                    {activeBucket.range}
                  </span>
                  <span className="shrink-0 font-medium tabular-nums text-[var(--text)]">
                    {formatMoney(activeBucket.totalCents, locale)}
                  </span>
                </>
              ) : (
                <span className="truncate text-[var(--text-3)]">
                  {m.money.trendHint}
                </span>
              )}
            </div>
          </section>

          <section className="mt-4 rounded-[16px] border border-[var(--line)] bg-[var(--surface)] p-4">
            <h2 className="type-section font-semibold text-[var(--text)]">
              {m.money.byCategory}
            </h2>
            <div className="mt-4 flex flex-col gap-3.5">
              {report.categories.map((category, index) => {
                const CategoryIcon = getCategoryIcon(
                  category.id,
                  category.group,
                )
                return (
                <div key={category.id}>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="flex min-w-0 items-center gap-1.5 text-[13px] text-[var(--text-2)]">
                      <CategoryIcon
                        size={14}
                        strokeWidth={1.8}
                        className="shrink-0 text-[var(--text-3)]"
                      />
                      <span className="truncate">{category.name}</span>
                    </span>
                    <span className="shrink-0 text-[13px] tabular-nums text-[var(--text)]">
                      {formatMoney(category.totalCents, locale)}
                    </span>
                    <span className="w-9 shrink-0 text-right text-[11px] tabular-nums text-[var(--text-3)]">
                      {category.percent}%
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--surface-sunken)]">
                    <div
                      className={`category-bar h-full rounded-full ${
                        index === 0
                          ? 'bg-[var(--accent)]'
                          : 'bg-[var(--text-3)]'
                      }`}
                      style={{
                        width: `${Math.max(
                          2,
                          category.percent,
                        )}%`,
                        animationDelay: `${index * 35}ms`,
                      }}
                    />
                  </div>
                </div>
                )
              })}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
