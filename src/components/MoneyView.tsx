import { useMemo, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  ReceiptText,
} from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import {
  formatMonthLabel,
  shiftMonthKey,
} from '../lib/habits'
import {
  expensesInRange,
  formatExpenseDayLabel,
  formatMoney,
  formatSignedMoney,
  getCategoryView,
  getEntryType,
  getMonthRange,
  groupExpensesByDay,
  sumExpenseCents,
  sumIncomeCents,
  type CustomExpenseCategory,
  type Expense,
} from '../lib/expenses'
import ExpenseRow from './ExpenseRow'
import ExpenseReports from './ExpenseReports'
import BalanceRow from './BalanceRow'
import SegmentedTabs from './SegmentedTabs'

export type MoneyTab = 'records' | 'week' | 'month'

interface MoneyViewProps {
  expenses: Expense[]
  customCategories: CustomExpenseCategory[]
  todayKey: string
  tab: MoneyTab
  balanceEnabled: boolean
  balanceCents: number | null
  onTabChange: (tab: MoneyTab) => void
  onAdd: () => void
  onEdit: (expense: Expense) => void
  onDelete: (expense: Expense) => void
  onToggleBalance: () => void
  onSetBalance: () => void
  onCalibrateBalance: () => void
}

function RecordsEmpty({
  title,
  body,
  action,
  onAdd,
}: {
  title: string
  body: string
  action: string
  onAdd: () => void
}) {
  return (
    <div className="fade-enter mt-5 flex flex-col items-center rounded-[16px] border border-[var(--line)] bg-[var(--surface)] px-6 py-12 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-[var(--surface-sunken)] text-[var(--text-3)]">
        <ReceiptText size={22} strokeWidth={1.7} />
      </div>
      <p className="mt-3 text-[15px] font-semibold text-[var(--text)]">
        {title}
      </p>
      <p className="mt-1 max-w-[250px] text-[13px] leading-[1.6] text-[var(--text-2)]">
        {body}
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="mt-4 inline-flex h-10 items-center gap-1.5 rounded-[10px] bg-[var(--accent)] px-4 text-[13px] font-medium text-[var(--on-accent)] transition-colors hover:bg-[var(--accent-hover)]"
      >
        <Plus size={15} strokeWidth={2.2} />
        {action}
      </button>
    </div>
  )
}

export default function MoneyView({
  expenses,
  customCategories,
  todayKey,
  tab,
  balanceEnabled,
  balanceCents,
  onTabChange,
  onAdd,
  onEdit,
  onDelete,
  onToggleBalance,
  onSetBalance,
  onCalibrateBalance,
}: MoneyViewProps) {
  const { locale, m } = useI18n()
  const [monthKey, setMonthKey] = useState(() =>
    todayKey.slice(0, 7),
  )

  const currentMonthKey = todayKey.slice(0, 7)
  const hasAnyExpenses = expenses.length > 0

  const { groups, incomeCents, expenseCents, netCents, count } =
    useMemo(() => {
      const { start, end } = getMonthRange(monthKey)
      const items = expensesInRange(expenses, start, end)
      const income = sumIncomeCents(items)
      const spent = sumExpenseCents(items)
      return {
        groups: groupExpensesByDay(items),
        incomeCents: income,
        expenseCents: spent,
        netCents: income - spent,
        count: items.filter(
          (expense) => getEntryType(expense) !== 'adjustment',
        ).length,
      }
    }, [expenses, monthKey])

  const tabs = [
    { value: 'records' as const, label: m.money.records },
    { value: 'week' as const, label: m.money.week },
    { value: 'month' as const, label: m.money.month },
  ]

  return (
    <div className="mt-5">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <SegmentedTabs
            ariaLabel={m.money.viewLabel}
            options={tabs}
            value={tab}
            onChange={onTabChange}
          />
        </div>
        <button
          type="button"
          aria-label={m.money.addEntry}
          onClick={onAdd}
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--accent)] text-[var(--on-accent)] transition-colors hover:bg-[var(--accent-hover)] ${
            tab === 'records' && !hasAnyExpenses
              ? 'hidden'
              : ''
          }`}
        >
          <Plus size={20} strokeWidth={2.2} />
        </button>
      </div>

      <div
        key={tab === 'records' ? 'records' : 'reports'}
        className="fade-enter"
      >
        {tab === 'records' ? (
          !hasAnyExpenses ? (
            <>
              <div className="mt-3 overflow-hidden rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface)]">
                <BalanceRow
                  enabled={balanceEnabled}
                  cents={balanceCents}
                  onToggle={onToggleBalance}
                  onSet={onSetBalance}
                  onCalibrate={onCalibrateBalance}
                  bordered={false}
                />
              </div>
              <RecordsEmpty
                title={m.money.emptyTitle}
                body={m.money.emptyBody}
                action={m.money.addFirst}
                onAdd={onAdd}
              />
            </>
          ) : (
            <div className="mt-4">
              <section className="overflow-hidden rounded-[16px] border border-[var(--line)] bg-[var(--surface)]">
                <div className="flex items-center justify-center gap-2 px-4 pt-3">
                  <button
                    type="button"
                    aria-label={m.money.previous}
                    onClick={() =>
                      setMonthKey((current) =>
                        shiftMonthKey(current, -1),
                      )
                    }
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[var(--text-2)] transition-colors hover:bg-[var(--surface-sunken)]"
                  >
                    <ChevronLeft size={16} strokeWidth={2} />
                  </button>
                  <span className="min-w-[96px] truncate text-center text-[13px] font-medium text-[var(--text-2)]">
                    {formatMonthLabel(monthKey, locale)}
                  </span>
                  {monthKey !== currentMonthKey && (
                    <button
                      type="button"
                      onClick={() => setMonthKey(currentMonthKey)}
                      className="h-7 shrink-0 rounded-full px-2 text-[11px] font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent-soft)]"
                    >
                      {m.money.thisMonth}
                    </button>
                  )}
                  <button
                    type="button"
                    aria-label={m.money.next}
                    onClick={() =>
                      setMonthKey((current) =>
                        shiftMonthKey(current, 1),
                      )
                    }
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[var(--text-2)] transition-colors hover:bg-[var(--surface-sunken)]"
                  >
                    <ChevronRight size={16} strokeWidth={2} />
                  </button>
                </div>

                <div className="px-5 pb-5 pt-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--text-3)]">
                      {m.money.net}
                    </p>
                    <span className="shrink-0 rounded-full bg-[var(--surface-sunken)] px-2 py-0.5 text-[11px] tabular-nums text-[var(--text-3)]">
                      {m.money.entryCount(count)}
                    </span>
                  </div>
                  <p className="mt-1.5 min-w-0 truncate text-[32px] font-semibold leading-none tracking-[-0.035em] tabular-nums text-[var(--text)]">
                    {formatSignedMoney(netCents, locale)}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[var(--line)] pt-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-3)]">
                        {m.money.income}
                      </p>
                      <p className="mt-1 text-[15px] font-medium tabular-nums text-[var(--accent)]">
                        {formatMoney(incomeCents, locale)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.08em] text-[var(--text-3)]">
                        {m.money.expenses}
                      </p>
                      <p className="mt-1 text-[15px] font-medium tabular-nums text-[var(--text)]">
                        {formatMoney(expenseCents, locale)}
                      </p>
                    </div>
                  </div>
                </div>

                <BalanceRow
                  enabled={balanceEnabled}
                  cents={balanceCents}
                  onToggle={onToggleBalance}
                  onSet={onSetBalance}
                  onCalibrate={onCalibrateBalance}
                />
              </section>

              {groups.length === 0 ? (
                <div>
                  <RecordsEmpty
                    title={m.money.noExpensesPeriod}
                    body={m.money.emptyBody}
                    action={m.money.addEntry}
                    onAdd={onAdd}
                  />
                </div>
              ) : (
                <div className="mt-4 flex flex-col gap-5">
                  {groups.map((group, index) => (
                    <section
                      key={group.date}
                      className="fade-enter"
                      style={{
                        animationDelay: `${Math.min(
                          index,
                          6,
                        ) * 35}ms`,
                      }}
                    >
                      <div className="flex items-center justify-between px-1 pb-2">
                        <span className="text-[13px] font-medium text-[var(--text-2)]">
                          {formatExpenseDayLabel(
                            group.date,
                            todayKey,
                            locale,
                            {
                              today: m.money.todayLabel,
                              yesterday: m.money.yesterdayLabel,
                            },
                          )}
                        </span>
                        <span className="text-[11px] tabular-nums text-[var(--text-3)]">
                          {formatSignedMoney(group.netCents, locale)}
                        </span>
                      </div>
                      <div className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface)]">
                        <ul>
                          {group.expenses.map((expense) => (
                            <ExpenseRow
                              key={expense.id}
                              expense={expense}
                              categoryName={
                                getEntryType(expense) === 'adjustment'
                                  ? m.money.balanceAdjustmentCategory
                                  : getCategoryView(
                                      expense.categoryId,
                                      customCategories,
                                      locale,
                                    )?.name ?? m.money.uncategorized
                              }
                              onEdit={onEdit}
                              onDelete={onDelete}
                            />
                          ))}
                        </ul>
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </div>
          )
        ) : (
          <ExpenseReports
            expenses={expenses}
            customCategories={customCategories}
            todayKey={todayKey}
            period={tab === 'week' ? 'week' : 'month'}
            balanceEnabled={balanceEnabled}
            balanceCents={balanceCents}
            onToggleBalance={onToggleBalance}
            onSetBalance={onSetBalance}
            onCalibrateBalance={onCalibrateBalance}
          />
        )}
      </div>
    </div>
  )
}
