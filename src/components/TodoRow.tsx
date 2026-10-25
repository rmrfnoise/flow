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
    ? 'text-[var(--text-3)]'
    : status === 'overdue'
      ? 'text-[var(--danger)]'
      : status === 'urgent'
        ? 'text-[var(--warning)]'
        : 'text-[var(--text-3)]'
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
    <li className="relative overflow-hidden border-b border-[var(--line)] last:border-b-0">
      <div
        className={`absolute inset-y-0 right-0 flex w-[88px] items-stretch justify-end bg-[var(--danger)] ${
          offset === 0 ? 'invisible' : ''
        }`}
        aria-hidden={offset === 0}
      >
        <button
          type="button"
          tabIndex={offset === 0 ? -1 : 0}
          onClick={() => onDelete(todo)}
          aria-label={m.row.deleteAria(todo.text)}
          className="flex w-full flex-col items-center justify-center gap-1 text-[var(--on-danger)] transition-opacity active:opacity-80"
        >
          <Trash2 size={17} strokeWidth={1.9} />
          <span className="text-[13px] font-medium">{m.row.delete}</span>
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
        className={`relative flex cursor-pointer select-none items-start gap-3 bg-[var(--surface)] px-4 py-3 outline-none transition-colors hover:bg-[var(--surface-sunken)] ${
          dragging ? 'bg-[var(--surface-sunken)]' : ''
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
          className={`relative mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-[1.5px] transition-colors after:absolute after:-inset-2 after:content-[''] ${
            completed
              ? 'border-transparent bg-[var(--accent)] text-[var(--on-accent)]'
              : 'border-[var(--checkbox-border)] text-transparent hover:border-[var(--accent)]'
          }`}
        >
          <Check
            size={13}
            strokeWidth={3}
            className={completed ? 'check-pop' : ''}
          />
        </button>

        <div className="min-w-0 flex-1 pt-[1px]">
          <p
            className={`break-words text-[15px] leading-[1.45] tracking-[-0.004em] sm:text-[16.5px] ${
              completed
                ? 'text-[var(--text-3)] line-through decoration-[var(--text-3)] decoration-[1.5px]'
                : 'text-[var(--text)]'
            }`}
          >
            {todo.text}
          </p>

          {hasMeta && (
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] leading-[1.4] sm:text-[13px]">
              {todo.dueAt !== null && (
                <span
                  title={`${formatDeadlineLong(todo.dueAt, todo.dueHasTime, locale)} · ${formatCountdown(todo.dueAt, todo.dueHasTime, now, locale)}`}
                  className={`inline-flex items-center gap-1 ${dueTone}`}
                >
                  <Clock3 size={11} strokeWidth={1.9} />
                  {formatDueDate(todo.dueAt, todo.dueHasTime, now, locale)}
                </span>
              )}

              {todo.tags.map((tag) => (
                <span key={tag} className="text-[var(--text-3)]">
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
