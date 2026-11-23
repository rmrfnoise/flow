import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  Pencil,
  Plus,
  Trash2,
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
import GoalDetail from './components/GoalDetail'
import GoalSheet from './components/GoalSheet'
import GoalsView from './components/GoalsView'
import HabitDetail from './components/HabitDetail'
import HabitSheet from './components/HabitSheet'
import HabitsView from './components/HabitsView'
import MoneyView, { type MoneyTab } from './components/MoneyView'
import SettingsView from './components/SettingsView'
import Toast from './components/Toast'
import TodoRow from './components/TodoRow'
import { useAppearance } from './hooks/useAppearance'
import { runBack } from './hooks/useBackHandler'
import {
  DEFAULT_STARTUP_PAGE,
  useStartupPage,
  type StartupPage,
} from './hooks/useStartupPage'
import { useI18n } from './i18n/I18nProvider'
import { getActiveDueBucket, type DueBucket } from './lib/date'
import {
  BALANCE_ADJUSTMENT_CATEGORY_ID,
  BALANCE_STORAGE_KEY,
  CUSTOM_CATEGORIES_STORAGE_KEY,
  DEFAULT_BALANCE_STATE,
  EXPENSES_STORAGE_KEY,
  INCOME_MISC_CATEGORY_ID,
  MISC_CATEGORY_ID,
  countExpensesForCategory,
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
  GOAL_NODE_LIMIT,
  GOALS_STORAGE_KEY,
  getGoalVerdict,
  getLitNodeCount,
  isGoalArray,
  isGoalEnded,
  type Goal,
  type NewGoalInput,
} from './lib/goals'
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
import { findHabitIconOption } from './lib/habitIcons'
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
  | { name: 'goals' }
  | { name: 'goal'; id: string }
  | { name: 'money'; tab: MoneyTab }
  | { name: 'settings' }

type NavPage = 'tasks' | 'habits' | 'money' | 'goals' | 'settings'

type GoalPromptKind =
  | 'achieved'
  | 'abandoned'
  | 'archived'
  | 'reopen'
  | 'delete'

function startupRoute(page: StartupPage): Route {
  if (page === 'habits') return { name: 'habits' }
  if (page === 'money') return { name: 'money', tab: 'records' }
  if (page === 'goals') return { name: 'goals' }
  return { name: 'tasks' }
}

function readRoute(
  startup: StartupPage = DEFAULT_STARTUP_PAGE,
): Route {
  const hash = window.location.hash
  if (hash === '#/settings') return { name: 'settings' }
  if (hash === '#/habits') return { name: 'habits' }
  if (hash === '#/goals') return { name: 'goals' }
  if (hash === '#/money') {
    return { name: 'money', tab: 'records' }
  }
  if (hash === '#/money/week' || hash === '#/money/reports') {
    return { name: 'money', tab: 'week' }
  }
  if (hash === '#/money/month') {
    return { name: 'money', tab: 'month' }
  }

  const goalMatch = /^#\/goals\/([^/]+)$/u.exec(hash)
  if (goalMatch) {
    try {
      return { name: 'goal', id: decodeURIComponent(goalMatch[1]) }
    } catch {
      return { name: 'goals' }
    }
  }

  const match = /^#\/habits\/([^/]+)$/u.exec(hash)
  if (match) {
    try {
      return { name: 'habit', id: decodeURIComponent(match[1]) }
    } catch {
      return { name: 'habits' }
    }
  }

  return startupRoute(startup)
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

function NavTab({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      className="nav-tab"
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
    >
      <span className="whitespace-nowrap">{label}</span>
      <span className="nav-mark" aria-hidden="true" />
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
    <section className="mt-7 first:mt-1">
      <div className="mb-2 flex items-baseline justify-between">
        <h2 className={`label ${danger ? 'text-[var(--red)]' : ''}`}>
          {title}
        </h2>
        <span className="fig text-[12px] leading-none text-[var(--ink-3)]">
          {todos.length}
        </span>
      </div>
      <ul className="ledger">
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
  const [goals, setGoals] = usePersistentState<Goal[]>(
    GOALS_STORAGE_KEY,
    [],
    isGoalArray,
  )

  const { mode: appearanceMode, setMode: setAppearanceMode } =
    useAppearance()
  const { page: startupPage, setPage: setStartupPage } = useStartupPage()
  const { locale, m } = useI18n()
  const [route, setRoute] = useState<Route>(() => readRoute(startupPage))
  const [filter, setFilter] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [completedOpen, setCompletedOpen] = useState(false)
  const [clearOpen, setClearOpen] = useState(false)
  const [habitSheetOpen, setHabitSheetOpen] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null)
  const [goalSheetOpen, setGoalSheetOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null)
  const [goalPrompt, setGoalPrompt] = useState<{
    goal: Goal
    kind: GoalPromptKind
  } | null>(null)
  const [expenseSheetOpen, setExpenseSheetOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(
    null,
  )
  const [balanceSheetMode, setBalanceSheetMode] =
    useState<BalanceSheetMode | null>(null)
  const [balanceDisableOpen, setBalanceDisableOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] =
    useState<CustomExpenseCategory | null>(null)
  const [toast, setToast] = useState<ToastState | null>(null)
  const [now, setNow] = useState(() => Date.now())

  const toastTimerRef = useRef<number | null>(null)
  const backRef = useRef<() => void>(() => {})
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
  const activeHabit =
    route.name === 'habit'
      ? habits.find((habit) => habit.id === route.id) ?? null
      : null
  const activeGoal =
    route.name === 'goal'
      ? goals.find((goal) => goal.id === route.id) ?? null
      : null
  const ActiveHabitIcon = activeHabit
    ? findHabitIconOption(activeHabit.checkInIcon)?.Icon
    : null
  const showHabitsList =
    route.name === 'habits' ||
    (route.name === 'habit' && activeHabit === null)
  const showGoalsList =
    route.name === 'goals' ||
    (route.name === 'goal' && activeGoal === null)

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    function handleHashChange() {
      setRoute(readRoute(startupPage))
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [startupPage])

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return
    let disposed = false
    let handle: { remove: () => void } | undefined

    void CapacitorApp.addListener('backButton', () => {
      backRef.current()
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
    if (route.name === 'goal' && !activeGoal) {
      window.location.hash = '#/goals'
    }
  }, [activeGoal, route])

  useEffect(() => {
    let title = m.meta.title
    if (route.name === 'settings') title = m.meta.settingsTitle
    else if (route.name === 'habits') title = m.meta.habitsTitle
    else if (route.name === 'goals') title = m.meta.goalsTitle
    else if (route.name === 'money') title = m.meta.moneyTitle
    else if (route.name === 'habit' && activeHabit) {
      title = `flow · ${activeHabit.name}`
    } else if (route.name === 'goal' && activeGoal) {
      title = `flow · ${activeGoal.title}`
    }
    document.title = title
  }, [activeGoal, activeHabit, m, route])

  // Only a route change scrolls to the top. Editing data (lighting a node,
  // renaming a goal) must leave the reader where they were.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [route])

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
  const nowDate = new Date(now)
  const intlLocale = locale === 'zh' ? 'zh-CN' : 'en-US'
  const dayNumber = String(nowDate.getDate()).padStart(2, '0')
  const weekdayLabel = new Intl.DateTimeFormat(intlLocale, {
    weekday: 'long',
  }).format(nowDate)
  const monthYearLabel = new Intl.DateTimeFormat(intlLocale, {
    year: 'numeric',
    month: 'long',
  }).format(nowDate)
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
  const goalSummary = useMemo(() => {
    const active = goals.filter((goal) => !isGoalEnded(goal))
    const behind = active.filter((goal) => {
      const verdict = getGoalVerdict(goal, todayKey)
      return verdict === 'behind' || verdict === 'overdue'
    }).length
    const year = new Date(now).getFullYear()
    const achievedThisYear = goals.filter(
      (goal) =>
        goal.outcome === 'achieved' &&
        goal.endedAt !== null &&
        new Date(goal.endedAt).getFullYear() === year,
    ).length

    const parts = [m.goals.activeCount(active.length)]
    if (behind > 0) parts.push(m.goals.behindCount(behind))
    if (achievedThisYear > 0) {
      parts.push(m.goals.achievedThisYear(achievedThisYear))
    }
    return parts.join(' · ')
  }, [goals, m.goals, now, todayKey])
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

  function navigate(next: NavPage) {
    const hash =
      next === 'settings'
        ? '#/settings'
        : next === 'habits'
          ? '#/habits'
          : next === 'goals'
            ? '#/goals'
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
            : next === 'goals'
              ? { name: 'goals' }
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

  function openGoal(id: string) {
    const hash = `#/goals/${encodeURIComponent(id)}`
    if (window.location.hash !== hash) {
      window.location.hash = hash
    } else {
      setRoute({ name: 'goal', id })
    }
    dismissToast()
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  function handleBack() {
    // Overlays consume back first. Routed subpages are habit and goal detail;
    // every other screen (including money reports) exits the app.
    if (runBack()) return
    if (route.name === 'habit') {
      navigate('habits')
      return
    }
    if (route.name === 'goal') {
      navigate('goals')
      return
    }
    void CapacitorApp.exitApp()
  }

  backRef.current = handleBack

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
    checkInIcon?: HabitIcon
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

  function openGoalSheet(goal?: Goal) {
    setEditingGoal(goal ?? null)
    setGoalSheetOpen(true)
  }

  function closeGoalSheet() {
    setGoalSheetOpen(false)
    setEditingGoal(null)
  }

  function handleSaveGoal(input: NewGoalInput) {
    const timestamp = Date.now()

    if (editingGoal) {
      const previous = new Map(
        editingGoal.nodes.map((node) => [node.id, node]),
      )
      const nodes = input.nodes.map((node) => {
        const existing = previous.get(node.id)
        return existing
          ? { ...existing, title: node.title }
          : {
              id: node.id,
              title: node.title,
              litAt: null,
              createdAt: timestamp,
            }
      })

      setGoals((current) =>
        current.map((goal) =>
          goal.id === editingGoal.id
            ? {
                ...goal,
                title: input.title,
                startDate: input.startDate,
                endDate: input.endDate,
                nodes,
                updatedAt: timestamp,
              }
            : goal,
        ),
      )
      showToast({ message: m.toast.saved }, 2600)
    } else {
      const goal: Goal = {
        id: makeId('goal'),
        title: input.title,
        startDate: input.startDate,
        endDate: input.endDate,
        nodes: input.nodes.map((node) => ({
          id: node.id,
          title: node.title,
          litAt: null,
          createdAt: timestamp,
        })),
        outcome: null,
        endedAt: null,
        createdAt: timestamp,
        updatedAt: timestamp,
      }
      setGoals((current) => [goal, ...current])
    }

    setNow(timestamp)
    closeGoalSheet()
  }

  function toggleGoalNode(goal: Goal, nodeId: string) {
    if (isGoalEnded(goal)) return
    const node = goal.nodes.find((item) => item.id === nodeId)
    if (!node) return

    const timestamp = Date.now()
    const willLight = node.litAt === null
    const nodes = goal.nodes.map((item) =>
      item.id === nodeId
        ? { ...item, litAt: willLight ? timestamp : null }
        : item,
    )
    const allLit =
      willLight && nodes.every((item) => item.litAt !== null)

    setGoals((current) =>
      current.map((item) =>
        item.id === goal.id
          ? {
              ...item,
              nodes,
              ...(allLit
                ? { outcome: 'achieved' as const, endedAt: timestamp }
                : {}),
              updatedAt: timestamp,
            }
          : item,
      ),
    )
    setNow(timestamp)

    if (allLit) {
      showToast(
        {
          message: m.goals.toastAchieved,
          actionLabel: m.toast.undo,
          onAction: () => {
            // Undo the tap that closed the goal, not just the outcome.
            setGoals((current) =>
              current.map((item) =>
                item.id === goal.id ? goal : item,
              ),
            )
            setNow(Date.now())
            dismissToast()
          },
        },
        5200,
      )
    }
  }

  function addGoalNode(goal: Goal, title: string) {
    if (isGoalEnded(goal) || goal.nodes.length >= GOAL_NODE_LIMIT) return
    const timestamp = Date.now()

    setGoals((current) =>
      current.map((item) =>
        item.id === goal.id
          ? {
              ...item,
              nodes: [
                ...item.nodes,
                {
                  id: makeId('goal-node'),
                  title,
                  litAt: null,
                  createdAt: timestamp,
                },
              ],
              updatedAt: timestamp,
            }
          : item,
      ),
    )
    setNow(timestamp)
  }

  function insertGoalNode(goal: Goal, index: number, title: string) {
    if (isGoalEnded(goal) || goal.nodes.length >= GOAL_NODE_LIMIT) {
      return
    }
    const timestamp = Date.now()

    setGoals((current) =>
      current.map((item) => {
        if (item.id !== goal.id) return item
        const nodes = [...item.nodes]
        nodes.splice(index, 0, {
          id: makeId('goal-node'),
          title,
          litAt: null,
          createdAt: timestamp,
        })
        return { ...item, nodes, updatedAt: timestamp }
      }),
    )
    setNow(timestamp)
  }

  function renameGoalNode(goal: Goal, nodeId: string, title: string) {
    if (isGoalEnded(goal)) return
    const timestamp = Date.now()

    setGoals((current) =>
      current.map((item) =>
        item.id === goal.id
          ? {
              ...item,
              nodes: item.nodes.map((node) =>
                node.id === nodeId ? { ...node, title } : node,
              ),
              updatedAt: timestamp,
            }
          : item,
      ),
    )
    setNow(timestamp)
  }

  function deleteGoalNode(goal: Goal, nodeId: string) {
    if (isGoalEnded(goal)) return
    const index = goal.nodes.findIndex((node) => node.id === nodeId)
    if (index < 0) return
    const node = goal.nodes[index]
    const timestamp = Date.now()

    setGoals((current) =>
      current.map((item) =>
        item.id === goal.id
          ? {
              ...item,
              nodes: item.nodes.filter((entry) => entry.id !== nodeId),
              updatedAt: timestamp,
            }
          : item,
      ),
    )
    setNow(timestamp)
    showToast(
      {
        message: m.goals.toastNodeRemoved,
        actionLabel: m.toast.undo,
        onAction: () => {
          setGoals((current) =>
            current.map((item) => {
              if (item.id !== goal.id) return item
              if (item.nodes.some((entry) => entry.id === nodeId)) {
                return item
              }
              const nodes = [...item.nodes]
              nodes.splice(Math.min(index, nodes.length), 0, node)
              return { ...item, nodes, updatedAt: Date.now() }
            }),
          )
          setNow(Date.now())
          dismissToast()
        },
      },
      5200,
    )
  }

  function confirmGoalPrompt() {
    if (!goalPrompt) return
    const { goal, kind } = goalPrompt
    const timestamp = Date.now()

    if (kind === 'delete') {
      setGoals((current) =>
        current.filter((item) => item.id !== goal.id),
      )
      setGoalPrompt(null)
      navigate('goals')
      showToast({ message: m.goals.toastGoalDeleted }, 3000)
      return
    }

    if (kind === 'reopen') {
      setGoals((current) =>
        current.map((item) =>
          item.id === goal.id
            ? {
                ...item,
                outcome: null,
                endedAt: null,
                updatedAt: timestamp,
              }
            : item,
        ),
      )
      setGoalPrompt(null)
      setNow(timestamp)
      return
    }

    setGoals((current) =>
      current.map((item) =>
        item.id === goal.id
          ? {
              ...item,
              outcome: kind,
              endedAt: timestamp,
              updatedAt: timestamp,
            }
          : item,
      ),
    )
    setGoalPrompt(null)
    setNow(timestamp)
    showToast(
      {
        message:
          kind === 'achieved'
            ? m.goals.toastAchieved
            : kind === 'abandoned'
              ? m.goals.toastAbandoned
              : m.goals.toastArchived,
      },
      3200,
    )
  }

  function goalPromptCopy() {
    if (!goalPrompt) return null
    const { goal, kind } = goalPrompt

    if (kind === 'achieved') {
      return {
        title: m.goals.markAchievedTitle,
        description: m.goals.markAchievedDescription(
          getLitNodeCount(goal),
          goal.nodes.length,
        ),
        confirm: m.goals.markAchieved,
        tone: 'primary' as const,
      }
    }
    if (kind === 'abandoned') {
      return {
        title: m.goals.abandonTitle,
        description: m.goals.abandonDescription(goal.title),
        confirm: m.goals.abandon,
        tone: 'danger' as const,
      }
    }
    if (kind === 'archived') {
      return {
        title: m.goals.archiveTitle,
        description: m.goals.archiveDescription(goal.title),
        confirm: m.goals.archive,
        tone: 'primary' as const,
      }
    }
    if (kind === 'reopen') {
      return {
        title: m.goals.reopenTitle,
        description: m.goals.reopenDescription(goal.title),
        confirm: m.goals.reopen,
        tone: 'primary' as const,
      }
    }
    return {
      title: m.goals.deleteTitle,
      description: m.goals.deleteDescription(goal.title),
      confirm: m.goals.deleteConfirm,
      tone: 'danger' as const,
    }
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
      setBalanceDisableOpen(true)
      return
    }
    setBalanceSheetMode('setup')
  }

  function handleDisableBalance() {
    setBalance(DEFAULT_BALANCE_STATE)
    setExpenses((current) =>
      current.filter(
        (expense) => getEntryType(expense) !== 'adjustment',
      ),
    )
    setBalanceDisableOpen(false)
    setNow(Date.now())
    showToast({ message: m.money.toastBalanceCleared }, 2800)
  }

  function handleSetBalance(cents: number) {
    const timestamp = Date.now()
    setBalance({
      enabled: true,
      startCents: cents,
      startAt: timestamp,
    })
    setNow(timestamp)
    setBalanceSheetMode(null)
    showToast({ message: m.money.toastBalanceSet }, 2800)
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

  const goalDialog = goalPromptCopy()

  return (
    <div className="app-frame mx-auto flex min-h-dvh w-full max-w-[560px] flex-col px-5 sm:px-6">
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="pt-[max(1.5rem,env(safe-area-inset-top))]">
          {route.name === 'habit' && activeHabit ? (
            <>
              <div className="flex items-start gap-2">
                <button
                  type="button"
                  aria-label={m.habits.back}
                  onClick={() => navigate('habits')}
                  className="-ml-2 grid h-10 w-10 shrink-0 place-items-center text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
                >
                  <ChevronLeft size={20} strokeWidth={1.8} />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="label">
                    {formatHabitSchedule(
                      activeHabit,
                      locale,
                      m.habits.everyDay,
                    )}
                  </p>
                  <h1 className="page-title mt-1.5 flex min-w-0 items-center gap-2">
                    {ActiveHabitIcon && (
                      <ActiveHabitIcon
                        size={19}
                        strokeWidth={1.7}
                        className="shrink-0 text-[var(--ink-3)]"
                      />
                    )}
                    <span className="truncate">{activeHabit.name}</span>
                  </h1>
                </div>
                <button
                  type="button"
                  aria-label={m.habits.edit}
                  onClick={() => openHabitSheet(activeHabit)}
                  className="-mr-1 grid h-10 w-10 shrink-0 place-items-center text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
                >
                  <Pencil size={16} strokeWidth={1.8} />
                </button>
              </div>
              <div className="rule mt-4" />
            </>
          ) : route.name === 'goal' && activeGoal ? (
            <>
              <div className="flex items-start gap-2">
                <button
                  type="button"
                  aria-label={m.goals.back}
                  onClick={() => navigate('goals')}
                  className="-ml-2 grid h-10 w-10 shrink-0 place-items-center text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
                >
                  <ChevronLeft size={20} strokeWidth={1.8} />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="label">
                    {formatMonthDay(activeGoal.startDate, locale)} –{' '}
                    {formatMonthDay(activeGoal.endDate, locale)}
                  </p>
                  <h1 className="page-title mt-1.5 truncate">
                    {activeGoal.title}
                  </h1>
                </div>
                {!isGoalEnded(activeGoal) && (
                  <button
                    type="button"
                    aria-label={m.goals.edit}
                    onClick={() => openGoalSheet(activeGoal)}
                    className="-mr-1 grid h-10 w-10 shrink-0 place-items-center text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
                  >
                    <Pencil size={16} strokeWidth={1.8} />
                  </button>
                )}
              </div>
              <div className="rule mt-4" />
            </>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                {route.name === 'tasks' ? (
                  <div className="min-w-0">
                    <p className="label">{weekdayLabel}</p>
                    <div className="mt-2 flex items-end gap-3">
                      <h1 className="day-number">
                        <span className="sr-only">{m.app.title} </span>
                        {dayNumber}
                      </h1>
                      <p className="fig mb-1 text-[13px] leading-none text-[var(--ink-2)]">
                        {monthYearLabel}
                      </p>
                    </div>
                  </div>
                ) : (
                  <h1 className="page-title pt-1">
                    {route.name === 'settings'
                      ? m.settings.title
                      : route.name === 'money'
                        ? m.money.title
                        : showGoalsList
                          ? m.goals.title
                          : m.habits.title}
                  </h1>
                )}
                {((route.name === 'tasks' && visibleTotal > 0) ||
                  (showHabitsList && habits.length > 0) ||
                  (showGoalsList && goals.length > 0) ||
                  route.name === 'money') && (
                  <button
                    type="button"
                    aria-label={
                      route.name === 'money'
                        ? m.money.addEntry
                        : showHabitsList
                          ? m.habits.addHabit
                          : showGoalsList
                            ? m.goals.addGoal
                            : m.app.addTask
                    }
                    onClick={
                      route.name === 'money'
                        ? () => openExpenseSheet()
                        : showHabitsList
                          ? () => openHabitSheet()
                          : showGoalsList
                            ? () => openGoalSheet()
                            : openAddSheet
                    }
                    className="stamp shrink-0"
                  >
                    <Plus size={19} strokeWidth={1.9} />
                  </button>
                )}
              </div>
              {route.name === 'tasks' ? (
                <p className="mt-3 text-[12.5px] leading-snug text-[var(--ink-2)]">
                  {subtitle}
                </p>
              ) : showHabitsList && habits.length > 0 ? (
                <p className="meta mt-1.5">{habitSubtitle}</p>
              ) : showGoalsList && goals.length > 0 ? (
                <p className="meta mt-1.5">{goalSummary}</p>
              ) : null}
              {route.name === 'tasks' ? (
                <div className="mt-4 h-[2px] bg-[var(--ink)]">
                  <div className="h-[2px] w-10 bg-[var(--red)]" />
                </div>
              ) : (
                <div className="rule mt-4" />
              )}
            </>
          )}
        </header>

        {route.name === 'tasks' && allTags.length > 0 && (
          <div className="sticky top-0 z-20 -mx-5 mt-5 border-b border-[var(--rule)] bg-[var(--paper)] px-5 sm:-mx-6 sm:px-6">
            <FilterBar
              tags={allTags}
              selected={filter}
              onSelect={handleFilterSelect}
            />
          </div>
        )}

        {route.name === 'tasks' && (
          <main className="page-enter flex flex-1 flex-col pb-[calc(env(safe-area-inset-bottom)+88px)] pt-1">
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
              <div className="fade-enter mt-10 flex flex-col items-start">
                <p className="label flex items-center gap-2 text-[var(--red)]">
                  <CheckCheck size={13} strokeWidth={2.1} />
                  {m.app.allDone}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-[var(--ink-2)]">
                  {m.app.allDoneHint}
                </p>
              </div>
            )}

            {completedVisible.length > 0 && (
              <section className="mt-8">
                <button
                  type="button"
                  onClick={() => setCompletedOpen((value) => !value)}
                  aria-expanded={completedOpen}
                  aria-controls="completed-list"
                  className="flex w-full items-baseline justify-between pb-2 text-left"
                >
                  <span className="label flex items-baseline gap-2">
                    {m.app.completed}
                    <span className="fig text-[12px] leading-none text-[var(--ink-3)]">
                      {completedVisible.length}
                    </span>
                  </span>
                  <ChevronDown
                    size={14}
                    strokeWidth={1.8}
                    className={`text-[var(--ink-3)] transition-transform duration-200 ${
                      completedOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <div
                  id="completed-list"
                  className={completedOpen ? 'fade-enter' : 'hidden'}
                >
                  <ul className="ledger">
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
                    className="btn btn-danger mt-3 h-10 w-full border border-[var(--rule)]"
                  >
                    <Trash2 size={14} strokeWidth={1.8} />
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
          <main className="page-enter flex flex-1 flex-col pb-[calc(env(safe-area-inset-bottom)+88px)] pt-1">
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
          <main className="page-enter flex flex-1 flex-col pb-[calc(env(safe-area-inset-bottom)+88px)] pt-1">
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

        {showGoalsList && (
          <main className="page-enter flex flex-1 flex-col pb-[calc(env(safe-area-inset-bottom)+88px)] pt-1">
            <GoalsView
              goals={goals}
              todayKey={todayKey}
              onOpen={openGoal}
              onAdd={() => openGoalSheet()}
            />
          </main>
        )}

        {route.name === 'goal' && activeGoal && (
          <main className="page-enter flex flex-1 flex-col pb-[calc(env(safe-area-inset-bottom)+88px)] pt-1">
            <GoalDetail
              key={activeGoal.id}
              goal={activeGoal}
              todayKey={todayKey}
              onToggleNode={(nodeId) =>
                toggleGoalNode(activeGoal, nodeId)
              }
              onAddNode={(title) => addGoalNode(activeGoal, title)}
              onInsertNode={(index, title) =>
                insertGoalNode(activeGoal, index, title)
              }
              onRenameNode={(nodeId, title) =>
                renameGoalNode(activeGoal, nodeId, title)
              }
              onDeleteNode={(nodeId) =>
                deleteGoalNode(activeGoal, nodeId)
              }
              onMarkAchieved={() =>
                setGoalPrompt({ goal: activeGoal, kind: 'achieved' })
              }
              onAbandon={() =>
                setGoalPrompt({ goal: activeGoal, kind: 'abandoned' })
              }
              onArchive={() =>
                setGoalPrompt({ goal: activeGoal, kind: 'archived' })
              }
              onReopen={() =>
                setGoalPrompt({ goal: activeGoal, kind: 'reopen' })
              }
              onDelete={() =>
                setGoalPrompt({ goal: activeGoal, kind: 'delete' })
              }
            />
          </main>
        )}

        {route.name === 'money' && (
          <main className="page-enter flex flex-1 flex-col pb-[calc(env(safe-area-inset-bottom)+88px)] pt-1">
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
          <main className="page-enter flex flex-1 flex-col pb-[calc(env(safe-area-inset-bottom)+88px)] pt-6">
            <SettingsView
              appearanceMode={appearanceMode}
              onAppearanceModeChange={setAppearanceMode}
              startupPage={startupPage}
              onStartupPageChange={setStartupPage}
              taskCount={todos.length}
              habitCount={habits.length}
              expenseCount={expenses.length}
              goalCount={goals.length}
              hasAnyData={
                todos.length > 0 ||
                habits.length > 0 ||
                expenses.length > 0 ||
                goals.length > 0 ||
                customCategories.length > 0 ||
                balance.enabled ||
                balance.startCents !== null
              }
            />
          </main>
        )}
      </div>

      <nav
        className="app-nav fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)]"
        aria-label={m.nav.label}
      >
        <div className="mx-auto grid max-w-[560px] grid-cols-5">
          <NavTab
            label={m.nav.tasks}
            active={route.name === 'tasks'}
            onClick={() => navigate('tasks')}
          />
          <NavTab
            label={m.nav.habits}
            active={
              route.name === 'habits' || route.name === 'habit'
            }
            onClick={() => navigate('habits')}
          />
          <NavTab
            label={m.nav.money}
            active={route.name === 'money'}
            onClick={() => navigate('money')}
          />
          <NavTab
            label={m.nav.goals}
            active={
              route.name === 'goals' || route.name === 'goal'
            }
            onClick={() => navigate('goals')}
          />
          <NavTab
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

      {goalSheetOpen && (
        <GoalSheet
          initialGoal={editingGoal ?? undefined}
          onClose={closeGoalSheet}
          onSave={handleSaveGoal}
        />
      )}

      {goalDialog && goalPrompt && (
        <ConfirmDialog
          title={goalDialog.title}
          description={goalDialog.description}
          cancelLabel={m.app.cancel}
          confirmLabel={goalDialog.confirm}
          tone={goalDialog.tone}
          onClose={() => setGoalPrompt(null)}
          onConfirm={confirmGoalPrompt}
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
          onClose={() => setBalanceSheetMode(null)}
          onConfirm={
            balanceSheetMode === 'calibrate'
              ? handleCalibrateBalance
              : handleSetBalance
          }
        />
      )}

      {balanceDisableOpen && (
        <ConfirmDialog
          title={m.money.balanceOffTitle}
          description={m.money.balanceOffDescription}
          cancelLabel={m.app.cancel}
          confirmLabel={m.money.balanceOffConfirm}
          onClose={() => setBalanceDisableOpen(false)}
          onConfirm={handleDisableBalance}
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
