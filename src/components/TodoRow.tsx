import {
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import { Check, Clock3, Trash2 } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import {
  formatCountdown,
  formatDeadlineLong,
  formatDueDate,
  getDueStatus,
} from '../lib/date'
import type { Todo } from '../types'

const DELETE_WIDTH = 88

interface TodoRowProps {
  todo: Todo
  now: number
  onToggle: (id: string) => void
  onDelete: (todo: Todo) => void
  onEdit: (todo: Todo) => void
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export default function TodoRow({
  todo,
  now,
  onToggle,
  onDelete,
  onEdit,
}: TodoRowProps) {
  const { locale, m } = useI18n()
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
  const dueTone = completed
    ? 'text-[var(--ink-3)]'
    : status === 'overdue'
      ? 'text-[var(--red)]'
      : status === 'urgent'
        ? 'text-[var(--ink-2)]'
        : 'text-[var(--ink-3)]'
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
    <li className="relative overflow-hidden">
      <div
        className={`absolute inset-y-0 right-0 flex w-[88px] items-stretch justify-end bg-[var(--red)] ${
          offset === 0 ? 'invisible' : ''
        }`}
        aria-hidden={offset === 0}
      >
        <button
          type="button"
          tabIndex={offset === 0 ? -1 : 0}
          onClick={() => onDelete(todo)}
          aria-label={m.row.deleteAria(todo.text)}
          className="flex w-full flex-col items-center justify-center gap-1 text-[#fdf7f4] transition-opacity active:opacity-80"
        >
          <Trash2 size={16} strokeWidth={1.8} />
          <span className="text-[12px] font-medium tracking-wide">
            {m.row.delete}
          </span>
        </button>
      </div>

      <article
        ref={elementRef}
        tabIndex={0}
        aria-label={m.row.aria(todo.text)}
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
        className={`relative flex cursor-pointer select-none items-start gap-3 py-3.5 outline-none transition-colors hover:bg-[var(--sunken)] active:bg-[var(--sunken)] ${
          dragging ? 'bg-[var(--sunken)]' : ''
        }`}
      >
        <button
          type="button"
          role="checkbox"
          aria-checked={completed}
          aria-label={completed ? m.row.markIncomplete : m.row.markComplete}
          onClick={(event) => {
            event.stopPropagation()
            onToggle(todo.id)
          }}
          onPointerDown={(event) => event.stopPropagation()}
          className="check mt-[3px] shrink-0"
        >
          <Check size={13} strokeWidth={3} className="tick" />
        </button>

        <div className="min-w-0 flex-1">
          <p
            className={`break-words text-[15px] leading-[1.45] tracking-[-0.004em] sm:text-[15.5px] ${
              completed
                ? 'text-[var(--ink-3)] line-through decoration-[var(--ink-3)] decoration-1'
                : 'text-[var(--ink)]'
            }`}
          >
            {todo.text}
          </p>

          {hasMeta && (
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11.5px] leading-[1.3]">
              {todo.dueAt !== null && (
                <span
                  title={`${formatDeadlineLong(todo.dueAt, todo.dueHasTime, locale)} · ${formatCountdown(todo.dueAt, todo.dueHasTime, now, locale)}`}
                  className={`inline-flex items-center gap-1 ${dueTone}`}
                >
                  <Clock3 size={10} strokeWidth={2} />
                  <span className="fig text-[11px]">{formatDueDate(todo.dueAt, todo.dueHasTime, now, locale)}</span>
                </span>
              )}

              {todo.tags.map((tag) => (
                <span key={tag} className="text-[var(--ink-3)]">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </li>
  )
}
