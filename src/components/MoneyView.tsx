import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
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
    <div className="fade-enter mt-8">
      <span aria-hidden="true" className="block h-[2px] w-8 bg-[var(--red)]" />
      <p className="page-title mt-4">{title}</p>
      <p className="mt-2 max-w-[280px] text-[13.5px] leading-relaxed text-[var(--ink-2)]">
        {body}
      </p>
      <button type="button" onClick={onAdd} className="btn btn-ghost mt-6">
        <Plus size={15} strokeWidth={2} />
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
    <div className="mt-4">
      <SegmentedTabs
        ariaLabel={m.money.viewLabel}
        options={tabs}
        value={tab}
        onChange={onTabChange}
      />

      <div
        key={tab === 'records' ? 'records' : 'reports'}
        className="fade-enter"
      >
        {tab === 'records' ? (
          !hasAnyExpenses ? (
            <>
              <div className="mt-4 border-y border-[var(--rule)]">
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
            <div className="mt-3">
              <section>
                <div className="flex items-center gap-1 pb-2">
                  <button
                    type="button"
                    aria-label={m.money.previous}
                    onClick={() =>
                      setMonthKey((current) =>
                        shiftMonthKey(current, -1),
                      )
                    }
                    className="-ml-1 grid h-9 w-9 shrink-0 place-items-center text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
                  >
                    <ChevronLeft size={16} strokeWidth={1.9} />
                  </button>
                  <span className="fig min-w-0 flex-1 truncate text-center text-[13px] text-[var(--ink-2)]">
                    {formatMonthLabel(monthKey, locale)}
                  </span>
                  {monthKey !== currentMonthKey && (
                    <button
                      type="button"
                      onClick={() => setMonthKey(currentMonthKey)}
                      className="shrink-0 px-2 py-1 text-[11.5px] tracking-[0.06em] text-[var(--ink-3)] transition-colors hover:text-[var(--ink)]"
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
                    className="-mr-1 grid h-9 w-9 shrink-0 place-items-center text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
                  >
                    <ChevronRight size={16} strokeWidth={1.9} />
                  </button>
                </div>

                <div className="border-y border-[var(--rule)] py-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="label">{m.money.net}</p>
                    <span className="fig text-[11px] leading-none text-[var(--ink-3)]">
                      {m.money.entryCount(count)}
                    </span>
                  </div>
                  <p className="fig mt-2.5 text-[34px] leading-none tracking-[-0.035em] text-[var(--ink)]">
                    {formatSignedMoney(netCents, locale)}
                  </p>
                  <div className="mt-4 grid grid-cols-2 border-t border-[var(--rule)] pt-3">
                    <div className="pr-3">
                      <p className="label">{m.money.income}</p>
                      <p
                        className={`fig mt-1.5 text-[15px] ${
                          incomeCents > 0
                            ? 'text-[var(--moss)]'
                            : 'text-[var(--ink-3)]'
                        }`}
                      >
                        {formatMoney(incomeCents, locale)}
                      </p>
                    </div>
                    <div className="border-l border-[var(--rule)] pl-3">
                      <p className="label">{m.money.expenses}</p>
                      <p className="fig mt-1.5 text-[15px] text-[var(--ink)]">
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
                <div className="mt-7 flex flex-col gap-6">
                  {groups.map((group, index) => (
                    <section
                      key={group.date}
                      className="fade-enter"
                      style={{
                        animationDelay: `${Math.min(
                          index,
                          6,
                        ) * 30}ms`,
                      }}
                    >
                      <div className="mb-2 flex items-baseline justify-between">
                        <span
                          className={`label ${
                            group.date === todayKey
                              ? 'text-[var(--red)]'
                              : ''
                          }`}
                        >
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
                        <span className="fig text-[11.5px] leading-none text-[var(--ink-3)]">
                          {formatSignedMoney(group.netCents, locale)}
                        </span>
                      </div>
                      <ul className="ledger">
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
