import {
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import { Trash2 } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { getCategoryIcon } from '../lib/categoryIcons'
import {
  BALANCE_ADJUSTMENT_CATEGORY_ID,
  formatSignedMoney,
  getEntryType,
  type Expense,
} from '../lib/expenses'

const DELETE_WIDTH = 84

interface ExpenseRowProps {
  expense: Expense
  categoryName: string
  onEdit: (expense: Expense) => void
  onDelete: (expense: Expense) => void
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export default function ExpenseRow({
  expense,
  categoryName,
  onEdit,
  onDelete,
}: ExpenseRowProps) {
  const { locale, m } = useI18n()
  const entryType = getEntryType(expense)
  const isAdjustment = entryType === 'adjustment'
  const CategoryIcon = getCategoryIcon(
    isAdjustment
      ? BALANCE_ADJUSTMENT_CATEGORY_ID
      : expense.categoryId,
  )
  const signedCents =
    entryType === 'expense'
      ? -expense.amountCents
      : expense.amountCents
  const displayContent = isAdjustment
    ? m.money.balanceAdjustment
    : expense.content
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
      updateOffset(
        offsetRef.current <= -DELETE_WIDTH / 2 ? -DELETE_WIDTH : 0,
      )
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
      updateOffset(
        offsetRef.current <= -DELETE_WIDTH / 2 ? -DELETE_WIDTH : 0,
      )
    }
    gestureRef.current = 'idle'
  }

  function handleClick() {
    if (isAdjustment) return
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }
    onEdit(expense)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      event.preventDefault()
      onDelete(expense)
      return
    }
    if (isAdjustment) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onEdit(expense)
    }
  }

  return (
    <li className="relative overflow-hidden border-b border-[var(--line)] last:border-b-0">
      <div
        className={`absolute inset-y-0 right-0 flex w-[84px] items-stretch justify-end bg-[var(--danger)] ${
          offset === 0 ? 'invisible' : ''
        }`}
        aria-hidden={offset === 0}
      >
        <button
          type="button"
          tabIndex={offset === 0 ? -1 : 0}
          onClick={() => onDelete(expense)}
          aria-label={`${m.row.delete}: ${displayContent}`}
          className="flex w-full flex-col items-center justify-center gap-1 text-[var(--on-danger)] transition-opacity active:opacity-80"
        >
          <Trash2 size={17} strokeWidth={1.9} />
          <span className="text-[13px] font-medium">{m.row.delete}</span>
        </button>
      </div>

      <article
        ref={elementRef}
        tabIndex={0}
        aria-label={
          isAdjustment
            ? `${m.money.balanceAdjustment}: ${displayContent}`
            : `${m.money.editExpense}: ${expense.content}`
        }
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishGesture}
        onPointerCancel={handlePointerCancel}
        onKeyDown={handleKeyDown}
        style={{
          width:
            offset === 0 ? '100%' : `calc(100% + ${offset}px)`,
          transition: dragging
            ? 'none'
            : 'width 230ms cubic-bezier(0.22, 1, 0.36, 1)',
          touchAction: 'pan-y',
        }}
        className={`relative flex select-none items-center gap-3 bg-[var(--surface)] px-4 py-3 outline-none transition-colors ${
          isAdjustment
            ? 'cursor-default'
            : 'cursor-pointer hover:bg-[var(--surface-sunken)] active:bg-[var(--surface-sunken)]'
        } ${dragging ? 'bg-[var(--surface-sunken)]' : ''}`}
      >
        <span
          className={`grid h-6 w-6 shrink-0 place-items-center ${
            entryType === 'income'
              ? 'text-[var(--accent)]'
              : 'text-[var(--text-3)]'
          }`}
        >
          <CategoryIcon size={17} strokeWidth={1.8} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] leading-[1.4] text-[var(--text)]">
            {displayContent}
          </p>
          <p className="mt-0.5 truncate text-[11px] text-[var(--text-3)]">
            {categoryName}
          </p>
        </div>
        <span
          className={`shrink-0 text-[15px] font-semibold tabular-nums ${
            entryType === 'income'
              ? 'text-[var(--accent)]'
              : entryType === 'adjustment'
                ? 'text-[var(--text-2)]'
                : 'text-[var(--text)]'
          }`}
        >
          {formatSignedMoney(signedCents, locale)}
        </span>
      </article>
    </li>
  )
}
