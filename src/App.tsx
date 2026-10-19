import { useEffect, useMemo, useRef, useState } from 'react'
import {
  CheckCheck,
  ChevronDown,
  Eraser,
  Palette,
  Plus,
} from 'lucide-react'
import AddTodoSheet from './components/AddTodoSheet'
import BrandMark from './components/BrandMark'
import ConfirmDialog from './components/ConfirmDialog'
import EmptyState from './components/EmptyState'
import FilterBar from './components/FilterBar'
import ThemeSheet from './components/ThemeSheet'
import Toast from './components/Toast'
import TodoCard from './components/TodoCard'
import { useNeonTheme } from './hooks/useNeonTheme'
import { formatHeaderDate } from './lib/date'
import { makeId, usePersistentState } from './lib/storage'
import { TODOS_STORAGE_KEY, isTodoArray } from './lib/todos'
import type { NewTodoInput, Todo } from './types'

interface ToastState {
  message: string
  actionLabel?: string
  onAction?: () => void
}

function SectionHeader({
  index,
  title,
  count,
  hint,
  id,
}: {
  index: string
  title: string
  count: number
  hint: string
  id: string
}) {
  return (
    <div className="mb-2.5 mt-6 flex items-center gap-2">
      <span className="font-mono text-[11px] tabular-nums text-[var(--faint)]">
        {index}
      </span>
      <span className="h-px w-3 bg-[var(--line-whisper)]" />
      <h2
        id={id}
        className="font-display text-[13px] tracking-[0.08em] text-[var(--ink-soft)]"
      >
        {title}
      </h2>
      <span className="font-mono text-[11px] tabular-nums text-[var(--faint)]">
        [{count}]
      </span>
      <span className="ml-auto font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ghost)]">
        {hint}
      </span>
    </div>
  )
}

export default function App() {
  const [todos, setTodos] = usePersistentState<Todo[]>(
    TODOS_STORAGE_KEY,
    [],
    isTodoArray,
  )

  const { theme, setTheme } = useNeonTheme()
  const [filter, setFilter] = useState<string | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null)
  const [completedOpen, setCompletedOpen] = useState(false)
  const [clearOpen, setClearOpen] = useState(false)
  const [themeOpen, setThemeOpen] = useState(false)
  const [toast, setToast] = useState<ToastState | null>(null)
  const [now, setNow] = useState(() => Date.now())

  const toastTimerRef = useRef<number | null>(null)

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

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
    const newestFirst = [...todos].sort(
      (a, b) => b.createdAt - a.createdAt,
    )

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

  const deadlineTodos = useMemo(
    () =>
      activeVisible
        .filter(
          (todo): todo is Todo & { dueAt: number } => todo.dueAt !== null,
        )
        .sort((a, b) => a.dueAt - b.dueAt),
    [activeVisible],
  )

  const undatedTodos = useMemo(
    () =>
      activeVisible
        .filter((todo) => todo.dueAt === null)
        .sort((a, b) => b.createdAt - a.createdAt),
    [activeVisible],
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

  const activeAllCount = todos.filter(
    (todo) => todo.completedAt === null,
  ).length
  const completedAllCount = todos.length - activeAllCount
  const totalCount = todos.length
  const deadlineAllCount = todos.filter(
    (todo) => todo.completedAt === null && todo.dueAt !== null,
  ).length

  const dateInfo = formatHeaderDate(new Date(now))
  const visibleTotal = activeVisible.length + completedVisible.length
  const progressSegments = 14
  const completedSegments =
    totalCount === 0
      ? 0
      : Math.min(
          progressSegments,
          Math.max(
            completedAllCount > 0 ? 1 : 0,
            Math.round((completedAllCount / totalCount) * progressSegments),
          ),
        )

  const headline =
    activeAllCount > 0 ? (
      <>
        TODO <span className="text-[var(--accent-dim)]">//</span>{' '}
        <span className="text-[var(--accent)] drop-shadow-[0_0_14px_var(--accent-glow)]">
          [{String(activeAllCount).padStart(2, '0')}]
        </span>
      </>
    ) : totalCount === 0 ? (
      <>
        TODO <span className="text-[var(--accent-dim)]">//</span> EMPTY
      </>
    ) : (
      <>
        TODO <span className="text-[var(--accent-dim)]">//</span> DONE
      </>
    )

  const subtitle =
    totalCount === 0
      ? '写下第一条，终端开始运转'
      : activeAllCount === 0
        ? '全部归档，给自己一点空白'
        : deadlineAllCount > 0
          ? 'DDL 优先排序，其余自由巡航'
          : '没有 DDL，按自己的节奏运行'

  function dismissToast() {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current)
      toastTimerRef.current = null
    }
    setToast(null)
  }

  function showToast(next: ToastState, duration = 5000) {
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
      showToast({ message: '已更新这条待办' }, 2600)
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
        message: '已删除这条待办',
        actionLabel: '撤销',
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
      { message: `已清空 ${completedAllCount} 条已完成待办` },
      3600,
    )
  }

  return (
    <div className="app-canvas relative mx-auto flex min-h-dvh w-full max-w-[560px] flex-col overflow-x-clip font-sans text-[var(--ink)] sm:min-h-[calc(100dvh-48px)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[300px] overflow-hidden"
      >
        <span className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[var(--accent)]/10 blur-[90px]" />
        <span className="absolute -left-24 top-28 h-48 w-48 rounded-full bg-[#ff4fd8]/10 blur-[80px]" />
        <span className="absolute left-[18%] top-[196px] h-[3px] w-[3px] bg-[#5ce1ff]/60" />
      </div>

      <header className="relative z-10 px-5 pt-safe">
        <div className="flex flex-wrap items-center justify-between gap-2 gap-y-2">
          <BrandMark />
          <div className="ml-auto flex items-center gap-2">
            <div className="chamfer-sm flex items-center gap-2 border border-[var(--line-mid)] bg-[var(--surface-2)] px-3 py-1.5 font-mono text-[13.5px] tabular-nums text-[var(--ink-soft)]">
              <span>{dateInfo.date}</span>
              <span className="text-[12px] text-[var(--faint)]">//</span>
              <span className="text-[15px] font-semibold text-[var(--accent)]">
                {dateInfo.weekdayShort}
              </span>
            </div>
            <button
              type="button"
              aria-label="切换霓虹配色"
              aria-haspopup="dialog"
              onClick={() => setThemeOpen(true)}
              className="chamfer-sm grid h-[34px] w-[34px] place-items-center border border-[var(--accent-line)] bg-[var(--surface-2)] text-[var(--accent)] transition-colors hover:bg-[var(--accent-surface)]"
            >
              <Palette size={15} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        <div className="mt-8">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
            <span className="h-1 w-1 bg-[var(--accent)] shadow-[0_0_6px_var(--accent-glow-strong)]" />
            SYSTEM ONLINE // QUEUE READY
          </p>
          <h1 className="mt-2 font-display text-[32px] font-semibold leading-[1.32] tracking-[0.005em] text-[var(--ink)]">
            {headline}
          </h1>
          <p className="mt-2 font-mono text-[14px] leading-[1.8] text-[var(--muted)]">
            <span className="mr-1 text-[var(--accent)]">&gt;</span>
            {subtitle}
          </p>
        </div>

        <div className="mt-4 flex min-h-[28px] items-center gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <div
              className="flex h-[5px] min-w-[60px] flex-1 gap-[2px]"
              aria-hidden="true"
            >
              {Array.from({ length: progressSegments }, (_, index) => (
                <span
                  key={index}
                  className={`h-full flex-1 ${
                    index < completedSegments
                      ? 'bg-[var(--accent)] shadow-[0_0_6px_var(--accent-glow)]'
                      : 'bg-[var(--track)]'
                  }`}
                />
              ))}
            </div>
            <span className="shrink-0 font-mono text-[11px] tabular-nums text-[var(--muted)]">
              DONE {completedAllCount}/{totalCount}
            </span>
          </div>

          {completedAllCount > 0 && (
            <button
              type="button"
              onClick={() => setClearOpen(true)}
              className="chamfer-sm flex h-8 shrink-0 items-center gap-1 border border-[var(--danger-line)] bg-[var(--danger-surface)] px-2 font-mono text-[11px] text-[var(--danger-ink)] transition-all active:scale-[0.97] hover:border-[var(--danger-hover-line)] hover:text-[var(--danger-hover-ink)]"
            >
              <Eraser size={10} strokeWidth={1.8} />
              清空已完成
            </button>
          )}
        </div>
      </header>

      <div className="sticky top-0 z-30 mt-5 border-y border-[var(--line-whisper)] bg-[var(--surface-0)]/92 px-5 py-3 backdrop-blur-xl">
        <FilterBar
          tags={allTags}
          selected={filter}
          onSelect={handleFilterSelect}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-7 bg-gradient-to-l from-[var(--surface-0)] via-[var(--surface-0)]/85 to-transparent"
        />
      </div>

      <main className="flex-1 px-5 pb-36">
        {visibleTotal === 0 ? (
          <EmptyState
            filtered={filter !== null}
            onAdd={openAddSheet}
          />
        ) : (
          <>
            {activeVisible.length === 0 && completedVisible.length > 0 && (
              <div className="chamfer-sm mt-6 flex items-center gap-3 border border-[var(--line-mid)] bg-[var(--surface-1)] px-3.5 py-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center border border-[var(--accent-line)] bg-[var(--accent-soft)] text-[var(--accent)]">
                  <CheckCheck size={16} strokeWidth={2.2} />
                </span>
                <div>
                  <p className="font-mono text-[12.5px] uppercase tracking-[0.12em] text-[var(--accent-ink)]">
                    [ ALL CLEAR ]
                  </p>
                  <p className="mt-1 font-mono text-[12px] text-[var(--muted)]">
                    这组待办都完成啦，可以安心歇一会儿
                  </p>
                </div>
              </div>
            )}

            {deadlineTodos.length > 0 && (
              <section aria-labelledby="deadline-group">
                <SectionHeader
                  id="deadline-group"
                  index="01"
                  title="有截止时间"
                  count={deadlineTodos.length}
                  hint="sort // asc"
                />
                <div className="space-y-2">
                  {deadlineTodos.map((todo) => (
                    <TodoCard
                      key={todo.id}
                      todo={todo}
                      now={now}
                      onToggle={toggleTodo}
                      onDelete={deleteTodo}
                      onEdit={openEditSheet}
                    />
                  ))}
                </div>
              </section>
            )}

            {undatedTodos.length > 0 && (
              <section aria-labelledby="undated-group">
                <SectionHeader
                  id="undated-group"
                  index={deadlineTodos.length > 0 ? '02' : '01'}
                  title="没有截止时间"
                  count={undatedTodos.length}
                  hint="sort // new"
                />
                <div className="space-y-2">
                  {undatedTodos.map((todo) => (
                    <TodoCard
                      key={todo.id}
                      todo={todo}
                      now={now}
                      onToggle={toggleTodo}
                      onDelete={deleteTodo}
                      onEdit={openEditSheet}
                    />
                  ))}
                </div>
              </section>
            )}

            {completedVisible.length > 0 && (
              <section className="mt-6" aria-labelledby="completed-group">
                <button
                  type="button"
                  onClick={() => setCompletedOpen((value) => !value)}
                  aria-expanded={completedOpen}
                  aria-controls="completed-list"
                  className="chamfer-sm flex w-full items-center gap-2.5 border border-[var(--line-soft)] bg-[var(--surface-2)] px-3.5 py-3 text-left transition-colors hover:border-[var(--line-strong)] hover:bg-[var(--accent-surface)]"
                >
                  <span className="grid h-7 w-7 place-items-center border border-[var(--accent-line)] bg-[var(--accent-soft)] text-[var(--muted)]">
                    <CheckCheck size={13} strokeWidth={2.2} />
                  </span>
                  <span
                    id="completed-group"
                    className="font-mono text-[12.5px] uppercase tracking-[0.13em] text-[var(--ink-soft)]"
                  >
                    已完成
                  </span>
                  <span className="font-mono text-[11px] tabular-nums text-[var(--faint)]">
                    [{completedVisible.length}]
                  </span>
                  <span className="ml-auto font-mono text-[11px] text-[var(--faint)]">
                    {completedOpen ? '收起' : '展开'}
                  </span>
                  <ChevronDown
                    size={14}
                    strokeWidth={1.8}
                    className={`text-[var(--faint)] transition-transform duration-200 ${
                      completedOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <div
                  id="completed-list"
                  className="mt-2 space-y-2 overflow-hidden"
                >
                  {completedOpen &&
                    completedVisible.map((todo) => (
                      <TodoCard
                        key={todo.id}
                        todo={todo}
                        now={now}
                        onToggle={toggleTodo}
                        onDelete={deleteTodo}
                        onEdit={openEditSheet}
                      />
                    ))}
                </div>
              </section>
            )}

            <div className="mt-7 flex items-center justify-center gap-2.5 font-mono text-[13px] tracking-[0.08em] text-[var(--muted)]">
              <span className="h-px w-5 bg-[var(--accent-line)]" />
              勾选完成 · 轻点编辑 · 左滑删除
              <span className="h-px w-5 bg-[var(--accent-line)]" />
            </div>
          </>
        )}
      </main>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30">
        <div className="relative mx-auto h-[126px] max-w-[560px]">
          <div className="absolute inset-x-0 bottom-0 h-[112px] bg-gradient-to-t from-[var(--canvas-base)] via-[var(--canvas-base)]/90 to-transparent" />
          <button
            type="button"
            aria-label="添加待办"
            onClick={openAddSheet}
            className="fab-shadow pointer-events-auto absolute bottom-[max(1.25rem,calc(env(safe-area-inset-bottom)+0.9rem))] right-5 grid h-[58px] w-[58px] place-items-center rounded-[4px] border border-[var(--accent-strong)] bg-[var(--accent-surface)] text-[var(--accent)] transition-all duration-200 active:scale-95 hover:bg-[var(--accent-surface-hover)] sm:bottom-12"
          >
            <Plus size={24} strokeWidth={1.8} />
            <span className="absolute right-2 top-2 h-1 w-1 bg-[#ff4fd8] shadow-[0_0_6px_rgba(255,79,216,0.9)]" />
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--accent-dim)]">
              new
            </span>
          </button>
        </div>
      </div>

      {sheetOpen && (
        <AddTodoSheet
          initialTodo={editingTodo ?? undefined}
          onClose={closeSheet}
          onSave={handleSave}
        />
      )}

      {clearOpen && (
        <ConfirmDialog
          title="清空已完成？"
          description={
            <>
              <p>
                这 {completedAllCount} 条已完成的待办会被移除
              </p>
              <p className="mt-1">清空后不能找回，确定吗？</p>
            </>
          }
          cancelLabel="再想想"
          confirmLabel="清空"
          onClose={() => setClearOpen(false)}
          onConfirm={handleClearCompleted}
        />
      )}

      {themeOpen && (
        <ThemeSheet
          current={theme}
          onClose={() => setThemeOpen(false)}
          onSelect={(nextTheme) => {
            setTheme(nextTheme)
            setThemeOpen(false)
          }}
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
