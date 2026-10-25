import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  ListTodo,
  Pencil,
  Plus,
  Repeat,
  Settings as SettingsIcon,
  Trash2,
  Wallet,
} from 'lucide-react'
import { App as CapacitorApp } from '@capacitor/app'
import { Capacitor } from '@capacitor/core'
import AddTodoSheet from './components/AddTodoSheet'
import BalanceSheet, {
  type BalanceSheetMode,
} from './components/BalanceSheet'
import ConfirmDialog from './components/ConfirmDialog'
import EmptyState from './components/EmptyState'
import ExpenseSheet, {
  type ExpenseSaveInput,
} from './components/ExpenseSheet'
import FilterBar from './components/FilterBar'
import HabitDetail from './components/HabitDetail'
import HabitSheet from './components/HabitSheet'
import HabitsView from './components/HabitsView'
import MoneyView, { type MoneyTab } from './components/MoneyView'
import SettingsView from './components/SettingsView'
import Toast from './components/Toast'
import TodoRow from './components/TodoRow'
import { useAppearance } from './hooks/useAppearance'
import { useI18n } from './i18n/I18nProvider'
import {
  formatHeaderDate,
  getActiveDueBucket,
  type DueBucket,
} from './lib/date'
import {
  BALANCE_ADJUSTMENT_CATEGORY_ID,
  BALANCE_STORAGE_KEY,
  CUSTOM_CATEGORIES_STORAGE_KEY,
  DEFAULT_BALANCE_STATE,
  EXPENSES_STORAGE_KEY,
  INCOME_MISC_CATEGORY_ID,
  MISC_CATEGORY_ID,
  countExpensesForCategory,
  getBalanceAt,
  getBalanceCents,
  getEntryType,
  isBalanceState,
  isCategoryNameTaken,
  isCustomCategoryArray,
  isExpenseArray,
  type BalanceState,
  type CustomExpenseCategory,
  type Expense,
} from './lib/expenses'
import {
  HABITS_STORAGE_KEY,
  HABIT_CHECKINS_STORAGE_KEY,
  formatHabitSchedule,
  formatMonthDay,
  getHabitDates,
  getHabitDayState,
  isHabitArray,
  isHabitCheckins,
  isScheduled,
  toDateKey,
  type Habit,
  type HabitCheckins,
  type HabitIcon,
  type HabitSchedule,
} from './lib/habits'
import { makeId, usePersistentState } from './lib/storage'
import { getHabitIconOption } from './lib/habitIcons'
import { TODOS_STORAGE_KEY, isTodoArray } from './lib/todos'
import type { NewTodoInput, Todo } from './types'

interface ToastState {
  message: string
  actionLabel?: string
  onAction?: () => void
}

type Route =
  | { name: 'tasks' }
  | { name: 'habits' }
  | { name: 'habit'; id: string }
  | { name: 'money'; tab: MoneyTab }
  | { name: 'settings' }

function readRoute(): Route {
  const hash = window.location.hash
  if (hash === '#/settings') return { name: 'settings' }
  if (hash === '#/habits') return { name: 'habits' }
  if (hash === '#/money') {
    return { name: 'money', tab: 'records' }
  }
  if (hash === '#/money/week' || hash === '#/money/reports') {
    return { name: 'money', tab: 'week' }
  }
  if (hash === '#/money/month') {
    return { name: 'money', tab: 'month' }
  }

  const match = /^#\/habits\/([^/]+)$/u.exec(hash)
  if (match) {
    try {
      return { name: 'habit', id: decodeURIComponent(match[1]) }
    } catch {
      return { name: 'habits' }
    }
  }

  return { name: 'tasks' }
}

const GROUPS: Array<{
  bucket: Exclude<DueBucket, 'none'>
  danger?: boolean
}> = [
  { bucket: 'overdue', danger: true },
  { bucket: 'today' },
  { bucket: 'tomorrow' },
  { bucket: 'later' },
]

interface TaskGroupProps {
  title: string
  todos: Todo[]
  now: number
  danger?: boolean
  onToggle: (id: string) => void
  onDelete: (todo: Todo) => void
  onEdit: (todo: Todo) => void
}

function BottomNavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: ReactNode
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
      className="grid h-12 place-items-center"
    >
      <span
        className={`grid h-8 w-12 place-items-center rounded-full transition-colors ${
          active
            ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
            : 'text-[var(--text-3)]'
        }`}
      >
        {icon}
      </span>
    </button>
  )
}

function TaskGroup({
  title,
  todos,
  now,
  danger = false,
  onToggle,
  onDelete,
  onEdit,
}: TaskGroupProps) {
  return (
    <section className="mt-5 first:mt-1">
      <div className="mb-1.5 flex items-baseline justify-between px-1">
        <h2
          className={`type-section font-medium ${
            danger ? 'text-[var(--danger)]' : 'text-[var(--text-2)]'
          }`}
        >
          {title}
        </h2>
        <span className="font-mono text-[11px] tabular-nums text-[var(--text-3)]">
          {todos.length}
        </span>
      </div>
      <ul className="overflow-hidden rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface)]">
        {todos.map((todo) => (
          <TodoRow
            key={todo.id}
            todo={todo}
            now={now}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </ul>
    </section>
  )
}

export default function App() {
  const [todos, setTodos] = usePersistentState<Todo[]>(
    TODOS_STORAGE_KEY,
    [],
    isTodoArray,
  )
  const [habits, setHabits] = usePersistentState<Habit[]>(
    HABITS_STORAGE_KEY,
    [],
    isHabitArray,
  )
  const [habitCheckins, setHabitCheckins] =
    usePersistentState<HabitCheckins>(
      HABIT_CHECKINS_STORAGE_KEY,
      {},
      isHabitCheckins,
    )
  const [expenses, setExpenses] = usePersistentState<Expense[]>(
    EXPENSES_STORAGE_KEY,
    [],
    isExpenseArray,
  )
  const [customCategories, setCustomCategories] = usePersistentState<
    CustomExpenseCategory[]
  >(CUSTOM_CATEGORIES_STORAGE_KEY, [], isCustomCategoryArray)
  const [balance, setBalance] = usePersistentState<BalanceState>(
    BALANCE_STORAGE_KEY,
    DEFAULT_BALANCE_STATE,
    isBalanceState,
  )

  const { mode: appearanceMode, setMode: setAppearanceMode } =
    useAppearance()
  const { locale, m } = useI18n()
  const [route, setRoute] = useState<Route>(readRoute)
  const [filter, setFilter] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [completedOpen, setCompletedOpen] = useState(false)
  const [clearOpen, setClearOpen] = useState(false)
  const [habitSheetOpen, setHabitSheetOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null)
  const [expenseSheetOpen, setExpenseSheetOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(
    null,
  )
  const [balanceSheetMode, setBalanceSheetMode] =
    useState<BalanceSheetMode | null>(null)
  const [categoryToDelete, setCategoryToDelete] =
    useState<CustomExpenseCategory | null>(null)
  const [toast, setToast] = useState<ToastState | null>(null)
  const [now, setNow] = useState(() => Date.now())

  const toastTimerRef = useRef<number | null>(null)
  const todayKey = toDateKey(new Date(now))
  const categoryExpenseCount = categoryToDelete
    ? countExpensesForCategory(expenses, categoryToDelete.id)
    : 0
  const recentCategoryIds = useMemo(() => {
    const seen = new Set<string>()
    const ids: string[] = []
    const sorted = [...expenses].sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1
      return b.createdAt - a.createdAt
    })
    for (const expense of sorted) {
      if (seen.has(expense.categoryId)) continue
      seen.add(expense.categoryId)
      ids.push(expense.categoryId)
      if (ids.length >= 4) break
    }
    return ids
  }, [expenses])
  const balanceCents = useMemo(
    () => getBalanceCents(expenses, balance),
    [balance, expenses],
  )
  const lastTrackedCents = useMemo(
    () =>
      getBalanceAt(
        expenses,
        balance,
        balance.pausedAt ?? Date.now(),
      ),
    [balance, expenses],
  )
  const offEntryCount = useMemo(() => {
    if (!balance.pausedAt) return 0
    return expenses.filter(
      (expense) => expense.createdAt > balance.pausedAt!,
    ).length
  }, [balance.pausedAt, expenses])
  const activeHabit =
    route.name === 'habit'
      ? habits.find((habit) => habit.id === route.id) ?? null
      : null
  const ActiveHabitIcon = activeHabit
    ? getHabitIconOption(activeHabit.checkInIcon).Icon
    : null
  const showHabitsList =
    route.name === 'habits' ||
    (route.name === 'habit' && activeHabit === null)

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    function handleHashChange() {
      setRoute(readRoute())
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return
    let disposed = false
    let handle: { remove: () => void } | undefined

    void CapacitorApp.addListener('backButton', () => {
      void CapacitorApp.exitApp()
    }).then((listener) => {
      if (disposed) {
        void listener.remove()
      } else {
        handle = listener
      }
    })

    return () => {
      disposed = true
      void handle?.remove()
    }
  }, [])

  useEffect(() => {
    if (route.name === 'habit' && !activeHabit) {
      window.location.hash = '#/habits'
    }
  }, [activeHabit, route])

  useEffect(() => {
    let title = m.meta.title
    if (route.name === 'settings') title = m.meta.settingsTitle
    else if (route.name === 'habits') title = m.meta.habitsTitle
    else if (route.name === 'money') title = m.meta.moneyTitle
    else if (route.name === 'habit' && activeHabit) {
      title = `flow · ${activeHabit.name}`
    }
    document.title = title
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [activeHabit, m, route])

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current)
      }
    }
  }, [])

  const allTags = useMemo(() => {
    const tags: string[] = []
    const seen = new Set<string>()
    const newestFirst = [...todos].sort((a, b) => b.createdAt - a.createdAt)

    for (const todo of newestFirst) {
      for (const tag of todo.tags) {
        if (seen.has(tag)) continue
        seen.add(tag)
        tags.push(tag)
      }
    }

    return tags
  }, [todos])

  useEffect(() => {
    if (filter !== null && !allTags.includes(filter)) {
      setFilter(null)
    }
  }, [allTags, filter])

  const visibleTodos = useMemo(
    () =>
      filter === null
        ? todos
        : todos.filter((todo) => todo.tags.includes(filter)),
    [filter, todos],
  )

  const activeVisible = useMemo(
    () => visibleTodos.filter((todo) => todo.completedAt === null),
    [visibleTodos],
  )

  const completedVisible = useMemo(
    () =>
      visibleTodos
        .filter(
          (todo): todo is Todo & { completedAt: number } =>
            todo.completedAt !== null,
        )
        .sort((a, b) => b.completedAt - a.completedAt),
    [visibleTodos],
  )

  const groups = useMemo(() => {
    const buckets: Record<DueBucket, Todo[]> = {
      overdue: [],
      today: [],
      tomorrow: [],
      later: [],
      none: [],
    }

    for (const todo of activeVisible) {
      buckets[getActiveDueBucket(todo.dueAt, todo.dueHasTime, now)].push(todo)
    }

    const byDueAt = (a: Todo, b: Todo) => (a.dueAt ?? 0) - (b.dueAt ?? 0)
    buckets.overdue.sort(byDueAt)
    buckets.today.sort(byDueAt)
    buckets.tomorrow.sort(byDueAt)
    buckets.later.sort(byDueAt)
    buckets.none.sort((a, b) => b.createdAt - a.createdAt)

    return buckets
  }, [activeVisible, now])

  const completedAllCount = todos.filter(
    (todo) => todo.completedAt !== null,
  ).length
  const totalCount = todos.length
  const dateInfo = formatHeaderDate(new Date(now), locale)
  const { planned: todayPlannedCount, done: todayDone } =
    useMemo(() => {
      const planned = habits.filter(
        (habit) =>
          todayKey >= habit.startDate &&
          isScheduled(habit, todayKey),
      )
      return {
        planned: planned.length,
        done: planned.filter((habit) =>
          getHabitDates(habitCheckins, habit.id).includes(todayKey),
        ).length,
      }
    }, [habitCheckins, habits, todayKey])
  const habitSubtitle =
    habits.length === 0
      ? m.habits.subtitleEmpty
      : todayPlannedCount === 0
        ? m.habits.restDay
        : m.habits.todaySummary(todayDone, todayPlannedCount)
  const visibleTotal = activeVisible.length + completedVisible.length
  const subtitle =
    totalCount === 0
      ? m.app.subtitleEmpty
      : activeVisible.length === 0
        ? completedVisible.length > 0
          ? m.app.allDone
          : m.app.noMatches
        : groups.overdue.length > 0
          ? `${m.app.activeCount(activeVisible.length)} · ${m.app.overdueCount(groups.overdue.length)}`
          : m.app.activeCount(activeVisible.length)

  function dismissToast() {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current)
      toastTimerRef.current = null
    }
    setToast(null)
  }

  function showToast(next: ToastState, duration = 4200) {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current)
    }
    setToast(next)
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null)
      toastTimerRef.current = null
    }, duration)
  }

  function openAddSheet() {
    setEditingTodo(null)
    setSheetOpen(true)
  }

  function openEditSheet(todo: Todo) {
    setEditingTodo(todo)
    setSheetOpen(true)
  }

  function closeSheet() {
    setSheetOpen(false)
    setEditingTodo(null)
  }

  function handleSave(input: NewTodoInput) {
    if (editingTodo) {
      setTodos((current) =>
        current.map((todo) =>
          todo.id === editingTodo.id
            ? {
                ...todo,
                text: input.text,
                tags: input.tags,
                dueAt: input.dueAt,
                dueHasTime: input.dueHasTime,
              }
            : todo,
        ),
      )
      setNow(Date.now())
      closeSheet()
      showToast({ message: m.toast.saved }, 2600)
    } else {
      const todo: Todo = {
        id: makeId('todo'),
        text: input.text,
        tags: input.tags,
        createdAt: Date.now(),
        dueAt: input.dueAt,
        dueHasTime: input.dueHasTime,
        completedAt: null,
      }

      setTodos((current) => [todo, ...current])
      setNow(Date.now())
      closeSheet()
    }

    if (filter !== null && !input.tags.includes(filter)) {
      setFilter(null)
    }
  }

  function toggleTodo(id: string) {
    const currentTodo = todos.find((todo) => todo.id === id)
    if (currentTodo?.completedAt === null) {
      setCompletedOpen(false)
    }
    setNow(Date.now())
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completedAt:
                todo.completedAt === null ? Date.now() : null,
            }
          : todo,
      ),
    )
  }

  function deleteTodo(todo: Todo) {
    setTodos((current) =>
      current.filter((item) => item.id !== todo.id),
    )
    showToast(
      {
        message: m.toast.deleted,
        actionLabel: m.toast.undo,
        onAction: () => {
          setTodos((current) =>
            current.some((item) => item.id === todo.id)
              ? current
              : [...current, todo],
          )
          setNow(Date.now())
          dismissToast()
        },
      },
      5200,
    )
  }

  function navigate(
    next: 'tasks' | 'habits' | 'money' | 'settings',
  ) {
    const hash =
      next === 'settings'
        ? '#/settings'
        : next === 'habits'
          ? '#/habits'
          : next === 'money'
            ? '#/money'
            : '#/tasks'
    if (window.location.hash !== hash) {
      window.location.hash = hash
    } else {
      setRoute(
        next === 'tasks'
          ? { name: 'tasks' }
          : next === 'habits'
            ? { name: 'habits' }
            : next === 'money'
              ? { name: 'money', tab: 'records' }
              : { name: 'settings' },
      )
    }
    dismissToast()
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  function navigateMoney(tab: MoneyTab) {
    const hash =
      tab === 'week'
        ? '#/money/week'
        : tab === 'month'
          ? '#/money/month'
          : '#/money'
    if (window.location.hash !== hash) {
      window.location.hash = hash
    } else {
      setRoute({ name: 'money', tab })
    }
    dismissToast()
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  function openHabit(id: string) {
    const hash = `#/habits/${encodeURIComponent(id)}`
    if (window.location.hash !== hash) {
      window.location.hash = hash
    } else {
      setRoute({ name: 'habit', id })
    }
    dismissToast()
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  function openHabitSheet(habit?: Habit) {
    setEditingHabit(habit ?? null)
    setHabitSheetOpen(true)
  }

  function closeHabitSheet() {
    setHabitSheetOpen(false)
    setEditingHabit(null)
  }

  function handleSaveHabit(input: {
    name: string
    schedule: HabitSchedule
    checkInIcon: HabitIcon
  }) {
    const timestamp = Date.now()

    if (editingHabit) {
      setHabits((current) =>
        current.map((habit) =>
          habit.id === editingHabit.id
            ? {
                ...habit,
                name: input.name,
                schedule: input.schedule,
                checkInIcon: input.checkInIcon,
                updatedAt: timestamp,
              }
            : habit,
        ),
      )
      showToast({ message: m.toast.saved }, 2600)
    } else {
      const habit: Habit = {
        id: makeId('habit'),
        name: input.name,
        schedule: input.schedule,
        checkInIcon: input.checkInIcon,
        startDate: todayKey,
        createdAt: timestamp,
        updatedAt: timestamp,
      }
      setHabits((current) => [...current, habit])
    }

    setNow(timestamp)
    closeHabitSheet()
  }

  function toggleHabitDate(habit: Habit, dateKey: string) {
    const dates = getHabitDates(habitCheckins, habit.id)
    const checked = dates.includes(dateKey)
    const state = getHabitDayState(
      habit,
      dateKey,
      checked,
      todayKey,
    )

    if (state === 'out-of-window') {
      showToast({ message: m.habits.outOfWindow }, 3200)
      return
    }

    if (state === 'checked') {
      setHabitCheckins((current) => ({
        ...current,
        [habit.id]: (current[habit.id] ?? []).filter(
          (date) => date !== dateKey,
        ),
      }))
      setNow(Date.now())
      showToast(
        {
          message: m.habits.toastCanceled,
          actionLabel: m.toast.undo,
          onAction: () => {
            setHabitCheckins((current) => {
              const existing = current[habit.id] ?? []
              if (existing.includes(dateKey)) return current
              return {
                ...current,
                [habit.id]: [...existing, dateKey].sort(),
              }
            })
            setNow(Date.now())
            dismissToast()
          },
        },
        5200,
      )
      return
    }

    if (state === 'available') {
      setHabitCheckins((current) => {
        const existing = current[habit.id] ?? []
        if (existing.includes(dateKey)) return current
        return {
          ...current,
          [habit.id]: [...existing, dateKey].sort(),
        }
      })
      setNow(Date.now())
      showToast(
        {
          message:
            dateKey === todayKey
              ? m.habits.toastChecked
              : m.habits.toastMadeUp(
                  formatMonthDay(dateKey, locale),
                ),
          actionLabel: m.toast.undo,
          onAction: () => {
            setHabitCheckins((current) => ({
              ...current,
              [habit.id]: (current[habit.id] ?? []).filter(
                (date) => date !== dateKey,
              ),
            }))
            setNow(Date.now())
            dismissToast()
          },
        },
        5200,
      )
    }
  }

  function handleDeleteHabit() {
    if (!habitToDelete) return
    const habitId = habitToDelete.id
    setHabits((current) =>
      current.filter((habit) => habit.id !== habitId),
    )
    setHabitCheckins((current) => {
      const next = { ...current }
      delete next[habitId]
      return next
    })
    setHabitToDelete(null)
    navigate('habits')
    showToast({ message: m.habits.toastDeleted }, 3000)
  }

  function handleFilterSelect(next: string | null) {
    setFilter(next)
    setCompletedOpen(false)
  }

  function handleClearCompleted() {
    if (completedAllCount === 0) return
    setTodos((current) =>
      current.filter((todo) => todo.completedAt === null),
    )
    setCompletedOpen(false)
    setClearOpen(false)
    showToast(
      { message: m.toast.cleared(completedAllCount) },
      3200,
    )
  }

  function openExpenseSheet(expense?: Expense) {
    if (expense && getEntryType(expense) === 'adjustment') return
    setEditingExpense(expense ?? null)
    setExpenseSheetOpen(true)
  }

  function closeExpenseSheet() {
    setExpenseSheetOpen(false)
    setEditingExpense(null)
  }

  function handleSaveExpense(input: ExpenseSaveInput) {
    const timestamp = Date.now()

    if (editingExpense) {
      setExpenses((current) =>
        current.map((expense) =>
          expense.id === editingExpense.id
            ? { ...expense, ...input, updatedAt: timestamp }
            : expense,
        ),
      )
      showToast({ message: m.toast.saved }, 2600)
    } else {
      const expense: Expense = {
        id: makeId('expense'),
        ...input,
        createdAt: timestamp,
        updatedAt: timestamp,
      }
      setExpenses((current) => [expense, ...current])
    }

    setNow(timestamp)
    closeExpenseSheet()
  }

  function handleToggleBalance() {
    if (balance.enabled) {
      setBalance((current) => ({
        ...current,
        enabled: false,
        pausedAt: Date.now(),
      }))
      return
    }
    if (balance.startCents === null || balance.startAt === null) {
      setBalanceSheetMode('setup')
      return
    }
    setBalanceSheetMode('resume')
  }

  function handleSetBalance(cents: number) {
    const timestamp = Date.now()
    setBalance({
      enabled: true,
      startCents: cents,
      startAt: timestamp,
      pausedAt: null,
    })
    setNow(timestamp)
    setBalanceSheetMode(null)
    showToast({ message: m.money.toastBalanceSet }, 2800)
  }

  function handleContinueBalance() {
    const timestamp = Date.now()
    setBalance((current) => ({
      ...current,
      enabled: true,
      pausedAt: null,
    }))
    setNow(timestamp)
    setBalanceSheetMode(null)
    showToast({ message: m.money.toastBalanceResumed }, 2800)
  }

  function handleCalibrateBalance(cents: number) {
    if (balanceCents === null) {
      setBalanceSheetMode('setup')
      return
    }

    const difference = cents - balanceCents
    if (difference === 0) {
      setBalanceSheetMode(null)
      showToast({ message: m.money.balanceAlreadyMatches }, 2600)
      return
    }

    const timestamp = Date.now()
    const adjustment: Expense = {
      id: makeId('adjustment'),
      type: 'adjustment',
      categoryId: BALANCE_ADJUSTMENT_CATEGORY_ID,
      content: m.money.balanceAdjustment,
      amountCents: difference,
      date: todayKey,
      createdAt: timestamp,
      updatedAt: timestamp,
    }
    setExpenses((current) => [adjustment, ...current])
    setNow(timestamp)
    setBalanceSheetMode(null)
    showToast({ message: m.money.toastBalanceAdjusted }, 2800)
  }

  function deleteExpense(expense: Expense) {
    setExpenses((current) =>
      current.filter((item) => item.id !== expense.id),
    )
    showToast(
      {
        message: m.money.toastDeleted,
        actionLabel: m.toast.undo,
        onAction: () => {
          setExpenses((current) =>
            current.some((item) => item.id === expense.id)
              ? current
              : [expense, ...current],
          )
          setNow(Date.now())
          dismissToast()
        },
      },
      5200,
    )
  }

  function handleAddCustomCategory(
    name: string,
    type: 'expense' | 'income',
  ) {
    const trimmed = name.trim()
    if (
      !trimmed ||
      trimmed.length > 20 ||
      isCategoryNameTaken(trimmed, customCategories)
    ) {
      return null
    }
    const category: CustomExpenseCategory = {
      id: makeId('category'),
      name: trimmed,
      type,
      createdAt: Date.now(),
    }
    setCustomCategories((current) => [...current, category])
    return category.id
  }

  function requestDeleteCategory(category: CustomExpenseCategory) {
    setCategoryToDelete(category)
  }

  function handleDeleteCategory() {
    if (!categoryToDelete) return
    const categoryId = categoryToDelete.id
    const count = countExpensesForCategory(expenses, categoryId)

    setCustomCategories((current) =>
      current.filter((category) => category.id !== categoryId),
    )
    if (count > 0) {
      const fallbackId =
        categoryToDelete.type === 'income'
          ? INCOME_MISC_CATEGORY_ID
          : MISC_CATEGORY_ID
      setExpenses((current) =>
        current.map((expense) =>
          expense.categoryId === categoryId
            ? {
                ...expense,
                categoryId: fallbackId,
                updatedAt: Date.now(),
              }
            : expense,
        ),
      )
    }
    setCategoryToDelete(null)
    setNow(Date.now())
    if (editingExpense?.categoryId === categoryId) {
      setExpenseSheetOpen(false)
      setEditingExpense(null)
    }
    showToast({ message: m.money.toastCategoryDeleted }, 3000)
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[560px] flex-col px-5 sm:px-6">
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="pt-[max(1.25rem,env(safe-area-inset-top))]">
          {route.name === 'habit' && activeHabit ? (
            <>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={m.habits.back}
                  onClick={() => navigate('habits')}
                  className="-ml-2 grid h-9 w-9 shrink-0 place-items-center rounded-full text-[var(--text-2)] transition-colors hover:bg-[var(--surface-sunken)] hover:text-[var(--text)]"
                >
                  <ChevronLeft size={20} strokeWidth={2} />
                </button>
                <h1 className="flex min-w-0 flex-1 items-center gap-2 text-[24px] font-semibold leading-[1.15] tracking-[-0.02em] text-[var(--text)] sm:text-[28px]">
                  {ActiveHabitIcon && (
                    <ActiveHabitIcon
                      size={22}
                      strokeWidth={1.8}
                      className="shrink-0 text-[var(--accent)]"
                    />
                  )}
                  <span className="truncate">{activeHabit.name}</span>
                </h1>
                <button
                  type="button"
                  aria-label={m.habits.edit}
                  onClick={() => openHabitSheet(activeHabit)}
                  className="-mr-2 grid h-9 w-9 shrink-0 place-items-center rounded-full text-[var(--text-2)] transition-colors hover:bg-[var(--surface-sunken)] hover:text-[var(--text)]"
                >
                  <Pencil size={17} strokeWidth={1.9} />
                </button>
              </div>
              <p className="mt-1.5 text-[13px] text-[var(--text-2)]">
                {formatHabitSchedule(
                  activeHabit,
                  locale,
                  m.habits.everyDay,
                )}
              </p>
            </>
          ) : (
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <h1 className="type-page font-semibold text-[var(--text)]">
                  {route.name === 'settings'
                    ? m.settings.title
                    : route.name === 'money'
                      ? m.money.title
                      : showHabitsList
                        ? m.habits.title
                        : m.app.title}
                </h1>
                {route.name !== 'settings' &&
                  route.name !== 'money' && (
                    <p className="mt-2 text-[13px] text-[var(--text-2)]">
                      {showHabitsList ? (
                        habitSubtitle
                      ) : (
                        <>
                          {dateInfo}
                          <span className="mx-1.5 text-[var(--text-3)]">
                            ·
                          </span>
                          {subtitle}
                        </>
                      )}
                    </p>
                  )}
              </div>
              {((route.name === 'tasks' && visibleTotal > 0) ||
                (showHabitsList && habits.length > 0)) && (
                <button
                  type="button"
                  aria-label={
                    showHabitsList
                      ? m.habits.addHabit
                      : m.app.addTask
                  }
                  onClick={
                    showHabitsList
                      ? () => openHabitSheet()
                      : openAddSheet
                  }
                  className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--accent)] text-[var(--on-accent)] transition-colors hover:bg-[var(--accent-hover)]"
                >
                  <Plus size={19} strokeWidth={2.1} />
                </button>
              )}
            </div>
          )}
        </header>

        {route.name === 'tasks' && allTags.length > 0 && (
          <div className="relative sticky top-0 z-20 -mx-5 mt-5 bg-[var(--bg)] px-5 pb-1 pt-2">
            <FilterBar
              tags={allTags}
              selected={filter}
              onSelect={handleFilterSelect}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[var(--bg)] to-transparent"
            />
          </div>
        )}

        {route.name === 'tasks' && (
          <main className="flex flex-1 flex-col pb-[calc(env(safe-area-inset-bottom)+96px)] pt-1">
            {visibleTotal === 0 ? (
          <EmptyState
            filtered={filter !== null}
            onAdd={openAddSheet}
          />
        ) : (
          <>
            {GROUPS.map(({ bucket, danger }) => {
              const items = groups[bucket]
              if (items.length === 0) return null
              return (
                <TaskGroup
                  key={bucket}
                  title={m.app.groups[bucket]}
                  todos={items}
                  now={now}
                  danger={danger}
                  onToggle={toggleTodo}
                  onDelete={deleteTodo}
                  onEdit={openEditSheet}
                />
              )
            })}

            {groups.none.length > 0 && (
              <TaskGroup
                title={m.app.groups.none}
                todos={groups.none}
                now={now}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={openEditSheet}
              />
            )}

            {activeVisible.length === 0 && completedVisible.length > 0 && (
              <div className="fade-enter mt-10 flex flex-col items-center text-center">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent)]">
                  <CheckCheck size={22} strokeWidth={1.8} />
                </div>
                <p className="mt-3 text-[15px] font-medium text-[var(--text)]">
                  {m.app.allDone}
                </p>
                <p className="mt-1 text-[13px] text-[var(--text-3)]">
                  {m.app.allDoneHint}
                </p>
              </div>
            )}

            {completedVisible.length > 0 && (
              <section className="mt-5">
                <button
                  type="button"
                  onClick={() => setCompletedOpen((value) => !value)}
                  aria-expanded={completedOpen}
                  aria-controls="completed-list"
                  className="flex w-full items-center justify-between px-1 py-2.5 text-left"
                >
                  <span className="flex items-center gap-2 text-[13px] font-medium text-[var(--text-2)]">
                    <CheckCheck size={15} strokeWidth={1.9} />
                    {m.app.completed}
                    <span className="font-mono text-[11px] tabular-nums text-[var(--text-3)]">
                      {completedVisible.length}
                    </span>
                  </span>
                  <ChevronDown
                    size={15}
                    strokeWidth={1.9}
                    className={`text-[var(--text-3)] transition-transform duration-200 ${
                      completedOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <div
                  id="completed-list"
                  className={
                    completedOpen
                      ? 'fade-enter mt-1 overflow-hidden rounded-[var(--radius-card)] border border-[var(--line)] bg-[var(--surface)]'
                      : 'hidden'
                  }
                >
                  <ul>
                    {completedVisible.map((todo) => (
                      <TodoRow
                        key={todo.id}
                        todo={todo}
                        now={now}
                        onToggle={toggleTodo}
                        onDelete={deleteTodo}
                        onEdit={openEditSheet}
                      />
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => setClearOpen(true)}
                    className="flex h-11 w-full items-center justify-center gap-1.5 border-t border-[var(--line)] text-[13px] font-medium text-[var(--danger)] transition-colors hover:bg-[var(--danger-soft)]"
                  >
                    <Trash2 size={14} strokeWidth={1.9} />
                    {m.app.clearCompleted}
                  </button>
                </div>
              </section>
            )}
          </>
            )}
          </main>
        )}

        {showHabitsList && (
          <main className="flex flex-1 flex-col pb-[calc(env(safe-area-inset-bottom)+96px)] pt-1">
            <HabitsView
              habits={habits}
              checkins={habitCheckins}
              todayKey={todayKey}
              onOpen={openHabit}
              onToggleToday={(habit) =>
                toggleHabitDate(habit, todayKey)
              }
              onAdd={() => openHabitSheet()}
            />
          </main>
        )}

        {route.name === 'habit' && activeHabit && (
          <main className="flex flex-1 flex-col pb-[calc(env(safe-area-inset-bottom)+96px)] pt-1">
            <HabitDetail
              key={activeHabit.id}
              habit={activeHabit}
              dates={getHabitDates(habitCheckins, activeHabit.id)}
              todayKey={todayKey}
              onDelete={() => setHabitToDelete(activeHabit)}
              onToggle={(dateKey) =>
                toggleHabitDate(activeHabit, dateKey)
              }
            />
          </main>
        )}

        {route.name === 'money' && (
          <main className="flex flex-1 flex-col pb-[calc(env(safe-area-inset-bottom)+96px)] pt-1">
            <MoneyView
              expenses={expenses}
              customCategories={customCategories}
              todayKey={todayKey}
              tab={route.tab}
              balanceEnabled={balance.enabled}
              balanceCents={balanceCents}
              onTabChange={navigateMoney}
              onAdd={() => openExpenseSheet()}
              onEdit={openExpenseSheet}
              onDelete={deleteExpense}
              onToggleBalance={handleToggleBalance}
              onSetBalance={() => setBalanceSheetMode('setup')}
              onCalibrateBalance={() => setBalanceSheetMode('calibrate')}
            />
          </main>
        )}

        {route.name === 'settings' && (
          <main className="flex flex-1 flex-col pb-[calc(env(safe-area-inset-bottom)+96px)] pt-6">
            <SettingsView
              appearanceMode={appearanceMode}
              onAppearanceModeChange={setAppearanceMode}
              taskCount={todos.length}
              habitCount={habits.length}
              expenseCount={expenses.length}
            />
          </main>
        )}
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-[var(--surface)] pb-[env(safe-area-inset-bottom)]"
        aria-label={m.nav.label}
      >
        <div className="mx-auto grid max-w-[500px] grid-cols-4">
          <BottomNavItem
            icon={<ListTodo size={19} strokeWidth={1.9} />}
            label={m.nav.tasks}
            active={route.name === 'tasks'}
            onClick={() => navigate('tasks')}
          />
          <BottomNavItem
            icon={<Repeat size={19} strokeWidth={1.9} />}
            label={m.nav.habits}
            active={
              route.name === 'habits' || route.name === 'habit'
            }
            onClick={() => navigate('habits')}
          />
          <BottomNavItem
            icon={<Wallet size={19} strokeWidth={1.9} />}
            label={m.nav.money}
            active={route.name === 'money'}
            onClick={() => navigate('money')}
          />
          <BottomNavItem
            icon={<SettingsIcon size={19} strokeWidth={1.9} />}
            label={m.nav.settings}
            active={route.name === 'settings'}
            onClick={() => navigate('settings')}
          />
        </div>
      </nav>

      {sheetOpen && (
        <AddTodoSheet
          initialTodo={editingTodo ?? undefined}
          availableTags={allTags}
          onClose={closeSheet}
          onSave={handleSave}
        />
      )}

      {habitSheetOpen && (
        <HabitSheet
          initialHabit={editingHabit ?? undefined}
          onClose={closeHabitSheet}
          onSave={handleSaveHabit}
        />
      )}

      {habitToDelete && (
        <ConfirmDialog
          title={m.habits.deleteTitle}
          description={m.habits.deleteDescription(
            habitToDelete.name,
          )}
          cancelLabel={m.app.cancel}
          confirmLabel={m.habits.deleteConfirm}
          onClose={() => setHabitToDelete(null)}
          onConfirm={handleDeleteHabit}
        />
      )}

      {expenseSheetOpen && (
        <ExpenseSheet
          initialExpense={editingExpense ?? undefined}
          customCategories={customCategories}
          recentCategoryIds={recentCategoryIds}
          todayKey={todayKey}
          onClose={closeExpenseSheet}
          onSave={handleSaveExpense}
          onAddCustom={handleAddCustomCategory}
          onRequestDeleteCategory={requestDeleteCategory}
        />
      )}

      {balanceSheetMode && (
        <BalanceSheet
          mode={balanceSheetMode}
          currentCents={balanceCents}
          lastTrackedCents={lastTrackedCents}
          offEntryCount={offEntryCount}
          onClose={() => setBalanceSheetMode(null)}
          onConfirm={
            balanceSheetMode === 'calibrate'
              ? handleCalibrateBalance
              : handleSetBalance
          }
          onContinue={
            balanceSheetMode === 'resume'
              ? handleContinueBalance
              : undefined
          }
        />
      )}

      {categoryToDelete && (
        <ConfirmDialog
          title={m.money.deleteCategoryTitle}
          description={
            categoryExpenseCount > 0
              ? m.money.deleteCategoryUsed(
                  categoryToDelete.name,
                  categoryExpenseCount,
                )
              : m.money.deleteCategoryUnused(categoryToDelete.name)
          }
          cancelLabel={m.app.cancel}
          confirmLabel={m.money.deleteCategory}
          onClose={() => setCategoryToDelete(null)}
          onConfirm={handleDeleteCategory}
        />
      )}

      {clearOpen && (
        <ConfirmDialog
          title={m.app.clearTitle}
          description={m.app.clearDescription(completedAllCount)}
          cancelLabel={m.app.cancel}
          confirmLabel={m.app.clearConfirm}
          onClose={() => setClearOpen(false)}
          onConfirm={handleClearCompleted}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          actionLabel={toast.actionLabel}
          onAction={toast.onAction}
          onClose={dismissToast}
        />
      )}
    </div>
  )
}
