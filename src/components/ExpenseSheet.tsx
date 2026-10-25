import { useState } from 'react'
import { CalendarDays, ChevronRight, X } from 'lucide-react'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useKeyboardInset } from '../hooks/useKeyboardInset'
import { useI18n } from '../i18n/I18nProvider'
import { getCategoryIcon } from '../lib/categoryIcons'
import {
  formatAmountInput,
  getCategoryView,
  parseAmountInput,
  type CustomExpenseCategory,
  type Expense,
} from '../lib/expenses'
import { addDaysKey, formatMonthDay } from '../lib/habits'
import CategoryPicker from './CategoryPicker'
import DuePicker from './DuePicker'

export interface ExpenseSaveInput {
  categoryId: string
  content: string
  amountCents: number
  date: string
}

interface ExpenseSheetProps {
  initialExpense?: Expense
  customCategories: CustomExpenseCategory[]
  recentCategoryIds: string[]
  todayKey: string
  onClose: () => void
  onSave: (input: ExpenseSaveInput) => void
  onAddCustom: (name: string) => string | null
  onRequestDeleteCategory: (category: CustomExpenseCategory) => void
}

interface FormErrors {
  amount?: string
  category?: string
  content?: string
  date?: string
}

export default function ExpenseSheet({
  initialExpense,
  customCategories,
  recentCategoryIds,
  todayKey,
  onClose,
  onSave,
  onAddCustom,
  onRequestDeleteCategory,
}: ExpenseSheetProps) {
  const { locale, m } = useI18n()
  const [amount, setAmount] = useState(
    initialExpense ? formatAmountInput(initialExpense.amountCents) : '',
  )
  const [categoryId, setCategoryId] = useState(
    initialExpense?.categoryId ?? '',
  )
  const [content, setContent] = useState(initialExpense?.content ?? '')
  const [date, setDate] = useState(initialExpense?.date ?? todayKey)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})

  const selectedCategory = getCategoryView(
    categoryId,
    customCategories,
    locale,
  )
  const SelectedCategoryIcon = getCategoryIcon(
    selectedCategory?.id,
    selectedCategory?.group,
  )
  const yesterdayKey = addDaysKey(todayKey, -1)
  const trapRef = useFocusTrap<HTMLDivElement>()
  useBodyScrollLock()
  const keyboardInset = useKeyboardInset()

  function selectDate(nextDate: string) {
    setDate(nextDate)
    setErrors((current) => ({ ...current, date: undefined }))
  }

  function handleSave() {
    const nextErrors: FormErrors = {}
    const amountCents = parseAmountInput(amount)
    const trimmedContent = content.trim()

    if (amountCents === null) nextErrors.amount = m.money.errors.amount
    if (!selectedCategory) {
      nextErrors.category = m.money.errors.category
    }
    if (!trimmedContent) nextErrors.content = m.money.errors.content
    if (!date || date > todayKey) nextErrors.date = m.money.errors.date

    if (Object.keys(nextErrors).length > 0 || amountCents === null) {
      setErrors(nextErrors)
      return
    }

    onSave({
      categoryId,
      content: trimmedContent,
      amountCents,
      date,
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ bottom: keyboardInset }}
    >
      <button
        type="button"
        aria-label={m.money.closeBackdrop}
        onClick={onClose}
        className="absolute inset-0 bg-black/35 backdrop-blur-[1px]"
      />

      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label={
          initialExpense ? m.money.editExpense : m.money.newExpense
        }
        className="fade-enter relative flex max-h-[92dvh] w-full max-w-[520px] flex-col rounded-t-[var(--radius-sheet)] bg-[var(--surface)] shadow-[var(--shadow-sheet)]"
        style={{
          maxHeight: keyboardInset > 0 ? '100%' : undefined,
        }}
      >
        <div className="flex items-start justify-between px-5 pb-2 pt-3">
          <div>
            <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-[var(--line-strong)] sm:hidden" />
            <h2 className="type-title font-semibold text-[var(--text)]">
              {initialExpense
                ? m.money.editExpense
                : m.money.newExpense}
            </h2>
          </div>
          <button
            type="button"
            aria-label={m.money.close}
            onClick={onClose}
            className="-mr-2 grid h-8 w-8 place-items-center rounded-full text-[var(--text-3)] transition-colors hover:bg-[var(--surface-sunken)] hover:text-[var(--text)]"
          >
            <X size={18} strokeWidth={1.9} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <label className="mt-2 block text-[12px] font-medium text-[var(--text-2)]">
            {m.money.amount}
          </label>
          <div
            className={`mt-1.5 flex items-baseline gap-2.5 rounded-[12px] border bg-[var(--surface-sunken)] px-4 py-3.5 ${
              errors.amount
                ? 'border-[var(--danger)]'
                : 'border-[var(--line)] focus-within:border-[var(--accent)]'
            }`}
          >
            <span className="text-[20px] font-medium text-[var(--text-3)]">
              ¥
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={amount}
              onChange={(event) => {
                const next = event.target.value
                if (
                  next === '' ||
                  /^\d{0,7}(\.\d{0,2})?$/u.test(next)
                ) {
                  setAmount(next)
                  setErrors((current) => ({
                    ...current,
                    amount: undefined,
                  }))
                }
              }}
              placeholder="0.00"
              aria-label={m.money.amount}
              aria-invalid={Boolean(errors.amount)}
              className="min-w-0 flex-1 bg-transparent text-[34px] font-semibold leading-none tracking-[-0.035em] tabular-nums text-[var(--text)] outline-none placeholder:text-[var(--text-3)]"
            />
          </div>
          {errors.amount && (
            <p role="alert" className="mt-1.5 text-[12px] text-[var(--danger)]">
              {errors.amount}
            </p>
          )}

          <p className="mt-4 text-[12px] font-medium text-[var(--text-2)]">
            {m.money.category}
          </p>
          <button
            type="button"
            onClick={() => setCategoryOpen(true)}
            className={`mt-1.5 flex h-11 w-full items-center gap-2 rounded-[10px] border bg-[var(--surface-sunken)] px-3.5 text-left transition-colors hover:border-[var(--line-strong)] ${
              errors.category
                ? 'border-[var(--danger)]'
                : 'border-[var(--line)]'
            }`}
          >
            <SelectedCategoryIcon
              size={16}
              strokeWidth={1.8}
              className="shrink-0 text-[var(--text-3)]"
            />
            <span
              className={`min-w-0 flex-1 truncate text-[14px] ${
                selectedCategory
                  ? 'text-[var(--text)]'
                  : 'text-[var(--text-3)]'
              }`}
            >
              {selectedCategory?.name ?? m.money.chooseCategory}
            </span>
            <ChevronRight
              size={16}
              strokeWidth={1.9}
              className="shrink-0 text-[var(--text-3)]"
            />
          </button>
          {errors.category && (
            <p role="alert" className="mt-1.5 text-[12px] text-[var(--danger)]">
              {errors.category}
            </p>
          )}

          <label
            htmlFor="expense-content"
            className="mt-4 block text-[12px] font-medium text-[var(--text-2)]"
          >
            {m.money.contentLabel}
          </label>
          <input
            id="expense-content"
            type="text"
            value={content}
            maxLength={80}
            onChange={(event) => {
              setContent(event.target.value)
              setErrors((current) => ({
                ...current,
                content: undefined,
              }))
            }}
            placeholder={m.money.contentPlaceholder}
            aria-invalid={Boolean(errors.content)}
            className={`mt-1.5 h-11 w-full rounded-[10px] border bg-[var(--surface-sunken)] px-3.5 text-[14px] text-[var(--text)] outline-none placeholder:text-[var(--text-3)] ${
              errors.content
                ? 'border-[var(--danger)]'
                : 'border-[var(--line)] focus:border-[var(--accent)]'
            }`}
          />
          {errors.content && (
            <p role="alert" className="mt-1.5 text-[12px] text-[var(--danger)]">
              {errors.content}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between gap-2">
            <p className="text-[12px] font-medium text-[var(--text-2)]">
              {m.money.date}
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => selectDate(todayKey)}
                className={`h-7 rounded-full px-2.5 text-[11px] font-medium transition-colors ${
                  date === todayKey
                    ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                    : 'text-[var(--text-3)] hover:text-[var(--text)]'
                }`}
              >
                {m.money.todayLabel}
              </button>
              <button
                type="button"
                onClick={() => selectDate(yesterdayKey)}
                className={`h-7 rounded-full px-2.5 text-[11px] font-medium transition-colors ${
                  date === yesterdayKey
                    ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                    : 'text-[var(--text-3)] hover:text-[var(--text)]'
                }`}
              >
                {m.money.yesterdayLabel}
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDateOpen(true)}
            className={`mt-1.5 flex h-11 w-full items-center gap-2 rounded-[10px] border bg-[var(--surface-sunken)] px-3.5 text-left transition-colors hover:border-[var(--line-strong)] ${
              errors.date
                ? 'border-[var(--danger)]'
                : 'border-[var(--line)]'
            }`}
          >
            <CalendarDays
              size={16}
              strokeWidth={1.9}
              className="shrink-0 text-[var(--text-3)]"
            />
            <span className="min-w-0 flex-1 text-[14px] text-[var(--text)]">
              {formatMonthDay(date, locale)}
            </span>
            <ChevronRight
              size={16}
              strokeWidth={1.9}
              className="shrink-0 text-[var(--text-3)]"
            />
          </button>
          {errors.date && (
            <p role="alert" className="mt-1.5 text-[12px] text-[var(--danger)]">
              {errors.date}
            </p>
          )}

          <button
            type="button"
            onClick={handleSave}
            className="mt-6 flex h-12 w-full items-center justify-center rounded-[10px] bg-[var(--accent)] text-[14px] font-medium text-[var(--on-accent)] transition-colors hover:bg-[var(--accent-hover)]"
          >
            {initialExpense ? m.money.save : m.money.add}
          </button>
        </div>

        {categoryOpen && (
          <CategoryPicker
            customCategories={customCategories}
            recentCategoryIds={recentCategoryIds}
            selectedId={categoryId}
            onSelect={(id) => {
              setCategoryId(id)
              setErrors((current) => ({
                ...current,
                category: undefined,
              }))
            }}
            onAddCustom={onAddCustom}
            onRequestDelete={onRequestDeleteCategory}
            onClose={() => setCategoryOpen(false)}
          />
        )}

        {dateOpen && (
          <DuePicker
            mode="date"
            initialDate={date}
            initialTime="09:00"
            maxDate={todayKey}
            onClose={() => setDateOpen(false)}
            onConfirm={(nextDate) => {
              setDate(nextDate)
              setErrors((current) => ({ ...current, date: undefined }))
              setDateOpen(false)
            }}
          />
        )}
      </div>
    </div>
  )
}

