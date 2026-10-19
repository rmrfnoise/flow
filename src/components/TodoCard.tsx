import {
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import { Check, Clock3, Trash2 } from 'lucide-react'
import TagBadge from './TagBadge'
import {
  formatCountdown,
  formatDeadlineLong,
  formatDueDate,
  getDueStatus,
} from '../lib/date'
import type { Todo } from '../types'

const DELETE_WIDTH = 92

const STATUS_STYLES = {
  normal: {
    pill:
      'border border-[var(--status-normal-border)] bg-[var(--status-normal-bg)] text-[var(--status-normal-text)]',
    dot: 'bg-[#5ce1ff]',
    label: '时间还宽裕',
  },
  urgent: {
    pill:
      'border border-[var(--status-urgent-border)] bg-[var(--status-urgent-bg)] text-[var(--status-urgent-text)]',
    dot: 'bg-[#ffc857]',
    label: '快到截止时间了',
  },
  overdue: {
    pill:
      'border border-[var(--status-overdue-border)] bg-[var(--status-overdue-bg)] text-[var(--status-overdue-text)]',
    dot: 'bg-[#ff5c7a]',
    label: '已经超时',
  },
} as const

interface TodoCardProps {
  todo: Todo
  now: number
  onToggle: (id: string) => void
  onDelete: (todo: Todo) => void
  onEdit: (todo: Todo) => void
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export default function TodoCard({
  todo,
  now,
  onToggle,
  onDelete,
  onEdit,
}: TodoCardProps) {
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)

  const startRef = useRef({ x: 0, y: 0, offset: 0 })
  const offsetRef = useRef(0)
  const pointerRef = useRef<number | null>(null)
  const gestureRef = useRef<'idle' | 'pending' | 'horizontal' | 'vertical'>(
    'idle',
  )
  const elementRef = useRef<HTMLElement | null>(null)
  const suppressClickRef = useRef(false)

  const completed = todo.completedAt !== null
  const status = getDueStatus(
    todo.dueAt ?? 0,
    todo.dueHasTime,
    completed,
    now,
  )
  const statusStyle = STATUS_STYLES[status]
  const hasMeta = todo.tags.length > 0 || todo.dueAt !== null

  function updateOffset(next: number) {
    offsetRef.current = next
    setOffset(next)
  }

  function releasePointer(pointerId: number) {
    const element = elementRef.current
    if (element?.hasPointerCapture?.(pointerId)) {
      try {
        element.releasePointerCapture(pointerId)
      } catch {
        // The pointer may already be gone.
      }
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    suppressClickRef.current = false
    const target = event.target as HTMLElement
    if (target.closest('button, a, input, textarea, select')) return

    pointerRef.current = event.pointerId
    startRef.current = {
      x: event.clientX,
      y: event.clientY,
      offset: offsetRef.current,
    }
    gestureRef.current = 'pending'
    setDragging(false)

    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      // Pointer capture is not available in every browser.
    }
  }

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (pointerRef.current !== event.pointerId) return

    const dx = event.clientX - startRef.current.x
    const dy = event.clientY - startRef.current.y

    if (gestureRef.current === 'pending') {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return

      if (Math.abs(dy) >= Math.abs(dx)) {
        gestureRef.current = 'vertical'
        return
      }

      gestureRef.current = 'horizontal'
      suppressClickRef.current = true
      setDragging(true)
    }

    if (gestureRef.current !== 'horizontal') return
    updateOffset(clamp(startRef.current.offset + dx, -DELETE_WIDTH, 0))
  }

  function finishGesture(event: PointerEvent<HTMLElement>) {
    if (pointerRef.current !== event.pointerId) return
    releasePointer(event.pointerId)
    pointerRef.current = null
    setDragging(false)

    if (gestureRef.current === 'horizontal') {
      suppressClickRef.current = true
      updateOffset(offsetRef.current <= -DELETE_WIDTH / 2 ? -DELETE_WIDTH : 0)
    } else if (offsetRef.current < 0) {
      suppressClickRef.current = true
      updateOffset(0)
    }

    gestureRef.current = 'idle'
  }

  function handlePointerCancel(event: PointerEvent<HTMLElement>) {
    if (pointerRef.current !== event.pointerId) return
    releasePointer(event.pointerId)
    pointerRef.current = null
    setDragging(false)
    if (gestureRef.current === 'horizontal') {
      updateOffset(offsetRef.current <= -DELETE_WIDTH / 2 ? -DELETE_WIDTH : 0)
    }
    gestureRef.current = 'idle'
  }

  function handleClick() {
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }
    onEdit(todo)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault()
      onDelete(todo)
      return
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onEdit(todo)
    }
  }

  return (
    <div className="card-enter chamfer-sm relative overflow-hidden bg-[var(--surface-0)]">
      <div
        className="delete-stripes absolute inset-y-0 right-0 flex w-[92px] items-stretch justify-end border-l border-[var(--delete-border)]"
        aria-hidden={offset === 0}
      >
        <button
          type="button"
          tabIndex={offset === 0 ? -1 : 0}
          onClick={() => onDelete(todo)}
          aria-label={`删除待办：${todo.text}`}
          className="flex w-full flex-col items-center justify-center gap-1.5 font-mono text-[var(--delete-text)] transition-colors active:bg-[var(--delete-active-bg)]"
        >
          <Trash2 size={16} strokeWidth={1.8} />
          <span className="text-[11.5px] tracking-[0.16em]">删除</span>
        </button>
      </div>

      <article
        ref={elementRef}
        tabIndex={0}
        aria-label={`待办：${todo.text}，点击编辑，向左滑动可以删除`}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishGesture}
        onPointerCancel={handlePointerCancel}
        onKeyDown={handleKeyDown}
        style={{
          transform: `translate3d(${offset}px, 0, 0)`,
          transition: dragging
            ? 'none'
            : 'transform 230ms cubic-bezier(0.22, 1, 0.36, 1)',
          touchAction: 'pan-y',
        }}
        className={`relative flex cursor-pointer select-none items-start gap-3 border px-3.5 py-3.5 outline-none transition-colors ${
          completed
            ? 'border-[var(--line-whisper)] bg-[var(--surface-0)]'
            : dragging
              ? 'border-[var(--accent-strong)] bg-[var(--surface-2)]'
              : 'border-[var(--line-soft)] bg-[var(--surface-1)]'
        } focus-visible:border-[var(--accent-strong)] focus-visible:shadow-[0_0_0_1px_var(--accent-glow-soft)]`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute right-0 top-0 h-4 w-4 border-b border-l ${
            completed ? 'border-[var(--line-soft)]' : 'border-[var(--line-mid)]'
          }`}
        />

        <button
          type="button"
          role="checkbox"
          aria-checked={completed}
          aria-label={completed ? '把待办标为未完成' : '完成这条待办'}
          onClick={(event) => {
            event.stopPropagation()
            onToggle(todo.id)
          }}
          onPointerDown={(event) => event.stopPropagation()}
          className={`mt-[1px] grid h-[22px] w-[22px] shrink-0 place-items-center rounded-[2px] border transition-all duration-200 active:scale-90 ${
            completed
              ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)] shadow-[0_0_12px_var(--accent-glow-soft)]'
              : 'border-[var(--line-strong)] bg-[var(--surface-deep)] text-transparent hover:border-[var(--accent-strong)] hover:bg-[var(--accent-surface)]'
          }`}
        >
          <Check
            size={13}
            strokeWidth={3}
            className={completed ? 'check-pop' : 'opacity-20'}
          />
        </button>

        <div className="min-w-0 flex-1">
          <p
            className={`break-words font-mono text-[16.5px] font-medium leading-[1.68] tracking-[0.005em] ${
              completed
                ? 'text-[var(--muted)] line-through decoration-[var(--muted)] decoration-[1.3px]'
                : 'text-[var(--ink)]'
            }`}
          >
            {todo.text}
          </p>

          {hasMeta && (
            <div className="mt-2 flex flex-wrap items-center gap-x-1.5 gap-y-1.5">
              {todo.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} muted={completed} />
              ))}

              {todo.dueAt !== null && (
                <span
                  title={formatDeadlineLong(todo.dueAt, todo.dueHasTime)}
                  className={`inline-flex h-[23px] items-center gap-1 font-mono text-[12px] tabular-nums ${
                    completed
                      ? 'text-[var(--faint)]'
                      : status === 'overdue'
                        ? 'text-[#ff8098]'
                        : 'text-[var(--muted)]'
                  }`}
                >
                  <Clock3 size={11} strokeWidth={1.8} />
                  {formatDueDate(todo.dueAt, todo.dueHasTime, now)}
                </span>
              )}

              {todo.dueAt !== null && !completed && (
                <span
                  title={statusStyle.label}
                  className={`chamfer-sm ml-auto inline-flex h-[23px] items-center gap-1 px-1.5 font-mono text-[11.5px] tabular-nums ${statusStyle.pill}`}
                >
                  <span
                    className={`h-1 w-1 rounded-full ${statusStyle.dot}`}
                  />
                  {formatCountdown(todo.dueAt, todo.dueHasTime, now)}
                </span>
              )}
            </div>
          )}
        </div>
      </article>
    </div>
  )
}
