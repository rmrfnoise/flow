import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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
      <div className="flex items-center gap-1 pb-2">
        <button
          type="button"
          aria-label={m.money.previous}
          onClick={() => movePeriod(-1)}
          className="-ml-1 grid h-9 w-9 shrink-0 place-items-center text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
        >
          <ChevronLeft size={16} strokeWidth={1.9} />
        </button>
        <span className="fig min-w-0 flex-1 truncate text-center text-[13px] text-[var(--ink-2)]">
          {rangeLabel}
        </span>
        {!isCurrentPeriod && (
          <button
            type="button"
            onClick={goCurrent}
            className="shrink-0 px-2 py-1 text-[11.5px] tracking-[0.06em] text-[var(--ink-3)] transition-colors hover:text-[var(--ink)]"
          >
            {period === 'week' ? m.money.thisWeek : m.money.thisMonth}
          </button>
        )}
        <button
          type="button"
          aria-label={m.money.next}
          onClick={() => movePeriod(1)}
          className="-mr-1 grid h-9 w-9 shrink-0 place-items-center text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
        >
          <ChevronRight size={16} strokeWidth={1.9} />
        </button>
      </div>

      {report.count === 0 ? (
        <>
          <div className="border-y border-[var(--rule)]">
            <BalanceRow
              enabled={balanceEnabled}
              cents={balanceCents}
              onToggle={onToggleBalance}
              onSet={onSetBalance}
              onCalibrate={onCalibrateBalance}
              bordered={false}
            />
          </div>
          <div className="mt-8">
            <span
              aria-hidden="true"
              className="block h-[2px] w-8 bg-[var(--red)]"
            />
            <p className="page-title mt-4">
              {m.money.noExpensesPeriod}
            </p>
          </div>
        </>
      ) : (
        <>
          <section className="border-y border-[var(--rule)] py-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className="label">{m.money.net}</p>
              <span className="fig text-[11px] leading-none text-[var(--ink-3)]">
                {m.money.entryCount(report.count)}
              </span>
            </div>
            <p className="fig mt-2.5 text-[34px] leading-none tracking-[-0.035em] text-[var(--ink)]">
              {formatSignedMoney(report.netCents, locale)}
            </p>
            <div className="mt-4 grid grid-cols-3 border-t border-[var(--rule)] pt-3">
              <div className="pr-3">
                <p className="label">{m.money.income}</p>
                <p className="fig mt-1.5 text-[14px] text-[var(--moss)]">
                  {formatMoney(report.incomeCents, locale)}
                </p>
              </div>
              <div className="border-l border-[var(--rule)] px-3">
                <p className="label">{m.money.expenses}</p>
                <p className="fig mt-1.5 text-[14px] text-[var(--ink)]">
                  {formatMoney(report.totalCents, locale)}
                </p>
              </div>
              <div className="border-l border-[var(--rule)] pl-3">
                <p className="label">{m.money.dailyAverage}</p>
                <p className="fig mt-1.5 text-[14px] text-[var(--ink)]">
                  {formatMoney(report.averageCents, locale)}
                </p>
              </div>
            </div>
            <div className="-mb-4 mt-4">
              <BalanceRow
                enabled={balanceEnabled}
                cents={balanceCents}
                onToggle={onToggleBalance}
                onSet={onSetBalance}
                onCalibrate={onCalibrateBalance}
              />
            </div>
          </section>

          <section className="mt-6">
            <p className="label">{m.money.trend}</p>
            <div className="mt-4 flex h-[84px] items-end gap-1.5 border-b border-[var(--ink)]">
              {trendBuckets.map((bucket, index) => {
                const active = bucket.key === activeKey
                const height =
                  bucket.totalCents === 0
                    ? 2
                    : Math.max(
                        5,
                        Math.round(
                          (bucket.totalCents / maxBucket) * 84,
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
                    className="flex h-full min-w-0 flex-1 items-end outline-none"
                  >
                    <span
                      className={`trend-bar mx-auto w-full max-w-[38px] ${
                        bucket.totalCents > 0
                          ? active
                            ? 'bg-[var(--red)]'
                            : 'bg-[var(--ink)]'
                          : 'bg-[var(--rule)]'
                      }`}
                      style={{
                        height: `${height}px`,
                        animationDelay: `${index * 30}ms`,
                      }}
                    />
                  </button>
                )
              })}
            </div>
            <div className="mt-2 flex gap-1.5">
              {trendBuckets.map((bucket) => (
                <span
                  key={bucket.key}
                  className={`min-w-0 flex-1 truncate text-center text-[10px] ${
                    bucket.key === activeKey
                      ? 'font-semibold text-[var(--red)]'
                      : 'text-[var(--ink-3)]'
                  }`}
                >
                  {bucket.label}
                </span>
              ))}
            </div>
            <div className="mt-3 flex min-h-[28px] items-baseline justify-between gap-3 border-t border-[var(--rule)] pt-2 text-[11.5px]">
              {activeBucket ? (
                <>
                  <span className="min-w-0 truncate text-[var(--ink-2)]">
                    {activeBucket.range}
                  </span>
                  <span className="fig shrink-0 text-[var(--ink)]">
                    {formatMoney(activeBucket.totalCents, locale)}
                  </span>
                </>
              ) : (
                <span className="truncate text-[var(--ink-3)]">
                  {m.money.trendHint}
                </span>
              )}
            </div>
          </section>

          <section className="mt-7">
            <p className="label">{m.money.byCategory}</p>
            <div className="mt-3 ledger">
              {report.categories.map((category) => {
                const CategoryIcon = getCategoryIcon(
                  category.id,
                  category.group,
                )
                return (
                  <div key={category.id} className="py-3">
                    <div className="flex items-baseline gap-2">
                      <CategoryIcon
                        size={13}
                        strokeWidth={1.8}
                        className="shrink-0 translate-y-[2px] text-[var(--ink-3)]"
                      />
                      <span className="min-w-0 flex-1 truncate text-[13px] text-[var(--ink-2)]">
                        {category.name}
                      </span>
                      <span className="fig shrink-0 text-[13px] text-[var(--ink)]">
                        {formatMoney(category.totalCents, locale)}
                      </span>
                      <span className="fig w-8 shrink-0 text-right text-[11px] text-[var(--ink-3)]">
                        {category.percent}%
                      </span>
                    </div>
                    <div className="mt-2 h-[3px] bg-[var(--sunken)]">
                      <div
                        className="category-bar h-full bg-[var(--ink)]"
                        style={{
                          width: `${Math.max(2, category.percent)}%`,
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
