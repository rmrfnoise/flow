import { useCallback, useEffect, useState } from 'react'
import { CalendarDays, ChevronRight, X } from 'lucide-react'
import { useBackHandler, BACK_PRIORITY, hasBackHandlerAbove } from '../hooks/useBackHandler'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useKeyboardInset } from '../hooks/useKeyboardInset'
import { useI18n } from '../i18n/I18nProvider'
import { getCategoryIcon } from '../lib/categoryIcons'
import {
  formatAmountInput,
  getCategoryView,
  getEntryType,
  parseAmountInput,
  type CustomExpenseCategory,
  type Expense,
} from '../lib/expenses'
import { addDaysKey, formatMonthDay } from '../lib/habits'
import { Z_LAYER } from '../lib/layers'
import CategoryPicker from './CategoryPicker'
import ConfirmDialog from './ConfirmDialog'
import SegmentedTabs from './SegmentedTabs'
import DuePicker from './DuePicker'

export interface ExpenseSaveInput {
  type: 'expense' | 'income'
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
  onAddCustom: (
    name: string,
    type: 'expense' | 'income',
  ) => string | null
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
  const initialType: 'expense' | 'income' = initialExpense
    ? getEntryType(initialExpense) === 'income'
      ? 'income'
      : 'expense'
    : 'expense'
  const initialAmount = initialExpense
    ? formatAmountInput(initialExpense.amountCents)
    : ''
  const initialCategoryId = initialExpense?.categoryId ?? ''
  const initialContent = initialExpense?.content ?? ''
  const initialDate = initialExpense?.date ?? todayKey

  const [type, setType] = useState<'expense' | 'income'>(initialType)
  const [amount, setAmount] = useState(initialAmount)
  const [categoryId, setCategoryId] = useState(initialCategoryId)
  const [content, setContent] = useState(initialContent)
  const [date, setDate] = useState(initialDate)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)
  const [discardOpen, setDiscardOpen] = useState(false)
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
  const isDirty =
    type !== initialType ||
    amount !== initialAmount ||
    categoryId !== initialCategoryId ||
    content.trim() !== initialContent.trim() ||
    date !== initialDate

  const requestClose = useCallback(() => {
    if (categoryOpen || dateOpen || discardOpen) return
    if (isDirty) {
      setDiscardOpen(true)
      return
    }
    onClose()
  }, [categoryOpen, dateOpen, discardOpen, isDirty, onClose])

  useBackHandler(requestClose, { priority: BACK_PRIORITY.sheet })

  useEffect(() => {
    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (
        event.key === 'Escape' &&
        !hasBackHandlerAbove(BACK_PRIORITY.sheet)
      ) {
        requestClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [requestClose])

  function selectType(next: 'expense' | 'income') {
    setType(next)
    if (selectedCategory && selectedCategory.type !== next) {
      setCategoryId('')
    }
    setErrors((current) => ({
      ...current,
      category: undefined,
      content: undefined,
    }))
  }

  function selectDate(nextDate: string) {
    setDate(nextDate)
    setErrors((current) => ({ ...current, date: undefined }))
  }

  function handleSave() {
    const nextErrors: FormErrors = {}
    const amountCents = parseAmountInput(amount)
    const trimmedContent = content.trim()

    if (amountCents === null) nextErrors.amount = m.money.errors.amount
    if (!selectedCategory || selectedCategory.type !== type) {
      nextErrors.category = m.money.errors.category
    }
    if (!trimmedContent) nextErrors.content = m.money.errors.content
    if (!date || date > todayKey) nextErrors.date = m.money.errors.date

    if (Object.keys(nextErrors).length > 0 || amountCents === null) {
      setErrors(nextErrors)
      return
    }

    onSave({
      type,
      categoryId,
      content: trimmedContent,
      amountCents,
      date,
    })
  }

  const sheetTitle = initialExpense
    ? type === 'income'
      ? m.money.editIncome
      : m.money.editExpense
    : type === 'income'
      ? m.money.newIncome
      : m.money.newExpense

  return (
    <div
      className="fixed inset-0 flex items-end justify-center"
      style={{ bottom: keyboardInset, zIndex: Z_LAYER.sheet }}
    >
      <button
        type="button"
        aria-label={m.money.closeBackdrop}
        onClick={requestClose}
        className="absolute inset-0 bg-[var(--scrim)]"
      />

      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label={sheetTitle}
        className="fade-enter relative flex max-h-[92dvh] w-full max-w-[520px] flex-col rounded-t-[2px] border-t-2 border-[var(--ink)] bg-[var(--paper)] shadow-[var(--shadow-sheet)]"
        style={{
          maxHeight: keyboardInset > 0 ? '100%' : undefined,
        }}
      >
        <div className="flex items-start justify-between px-5 pb-2 pt-5">
          <h2 className="page-title text-[var(--ink)]">
            {sheetTitle}
          </h2>
          <button
            type="button"
            aria-label={m.money.close}
            onClick={requestClose}
            className="-mr-1 grid h-9 w-9 place-items-center text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
          >
            <X size={18} strokeWidth={1.9} />
          </button>
        </div>

        <div className="mx-5">
          <SegmentedTabs
            ariaLabel={sheetTitle}
            options={[
              { value: 'expense' as const, label: m.money.expenseType },
              { value: 'income' as const, label: m.money.income },
            ]}
            value={type}
            onChange={selectType}
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <label className="label mt-5 block">
            {m.money.amount}
          </label>
          <div
            className={`mt-2 flex items-baseline gap-2.5 border-b pb-2 transition-colors ${
              errors.amount
                ? 'border-[var(--red)]'
                : 'border-[var(--ink)] focus-within:border-[var(--red)]'
            }`}
          >
            <span className="fig text-[22px] text-[var(--ink-3)]">
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
              className="fig min-w-0 flex-1 bg-transparent text-[40px] leading-none tracking-[-0.03em] tabular-nums text-[var(--ink)] outline-none placeholder:text-[var(--ink-3)]"
            />
          </div>
          {errors.amount && (
            <p role="alert" className="mt-1.5 text-[13px] text-[var(--red)]">
              {errors.amount}
            </p>
          )}

          <p className="label mt-6">{m.money.category}</p>
          <button
            type="button"
            onClick={() => setCategoryOpen(true)}
            className={`flex h-12 w-full items-center gap-2 border-b text-left transition-colors ${
              errors.category
                ? 'border-[var(--red)]'
                : 'border-[var(--rule)] hover:border-[var(--ink)]'
            }`}
          >
            <SelectedCategoryIcon
              size={16}
              strokeWidth={1.8}
              className="shrink-0 text-[var(--ink-3)]"
            />
            <span
              className={`min-w-0 flex-1 truncate text-[15px] ${
                selectedCategory
                  ? 'text-[var(--ink)]'
                  : 'text-[var(--ink-3)]'
              }`}
            >
              {selectedCategory?.name ?? m.money.chooseCategory}
            </span>
            <ChevronRight
              size={16}
              strokeWidth={1.9}
              className="shrink-0 text-[var(--ink-3)]"
            />
          </button>
          {errors.category && (
            <p role="alert" className="mt-1.5 text-[13px] text-[var(--red)]">
              {errors.category}
            </p>
          )}

          <label
            htmlFor="expense-content"
            className="label mt-6 block"
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
            placeholder={
              type === 'income'
                ? m.money.incomeNotePlaceholder
                : m.money.expenseNotePlaceholder
            }
            aria-invalid={Boolean(errors.content)}
            className={`field mt-1 h-10 text-[16px] placeholder:text-[var(--ink-3)] ${
              errors.content ? 'border-[var(--red)]' : ''
            }`}
          />
          {errors.content && (
            <p role="alert" className="mt-1.5 text-[13px] text-[var(--red)]">
              {errors.content}
            </p>
          )}

          <div className="mt-6 flex items-baseline justify-between gap-2">
            <p className="label">{m.money.date}</p>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => selectDate(todayKey)}
                className={`border-b pb-0.5 text-[12px] transition-colors ${
                  date === todayKey
                    ? 'border-[var(--red)] text-[var(--ink)]'
                    : 'border-transparent text-[var(--ink-3)] hover:text-[var(--ink)]'
                }`}
              >
                {m.money.todayLabel}
              </button>
              <button
                type="button"
                onClick={() => selectDate(yesterdayKey)}
                className={`border-b pb-0.5 text-[12px] transition-colors ${
                  date === yesterdayKey
                    ? 'border-[var(--red)] text-[var(--ink)]'
                    : 'border-transparent text-[var(--ink-3)] hover:text-[var(--ink)]'
                }`}
              >
                {m.money.yesterdayLabel}
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setDateOpen(true)}
            className={`flex h-12 w-full items-center gap-2 border-b text-left transition-colors ${
              errors.date
                ? 'border-[var(--red)]'
                : 'border-[var(--rule)] hover:border-[var(--ink)]'
            }`}
          >
            <CalendarDays
              size={16}
              strokeWidth={1.9}
              className="shrink-0 text-[var(--ink-3)]"
            />
            <span className="min-w-0 flex-1 text-[15px] text-[var(--ink)]">
              {formatMonthDay(date, locale)}
            </span>
            <ChevronRight
              size={16}
              strokeWidth={1.9}
              className="shrink-0 text-[var(--ink-3)]"
            />
          </button>
          {errors.date && (
            <p role="alert" className="mt-1.5 text-[13px] text-[var(--red)]">
              {errors.date}
            </p>
          )}

          <button
            type="button"
            onClick={handleSave}
            className="btn btn-primary mt-7 h-12 w-full"
          >
            {initialExpense
              ? m.money.save
              : type === 'income'
                ? m.money.addIncomeAction
                : m.money.add}
          </button>
        </div>

        {categoryOpen && (
          <CategoryPicker
            type={type}
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
            onAddCustom={(name) => onAddCustom(name, type)}
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
