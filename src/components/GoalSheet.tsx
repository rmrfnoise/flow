import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { CalendarDays, Check, ChevronRight, Plus, X } from 'lucide-react'
import {
  BACK_PRIORITY,
  hasBackHandlerAbove,
  useBackHandler,
} from '../hooks/useBackHandler'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useKeyboardInset } from '../hooks/useKeyboardInset'
import { useI18n } from '../i18n/I18nProvider'
import {
  addDaysKey,
  formatHeaderDate,
  parseDateKey,
  toDateKey,
} from '../lib/date'
import {
  GOAL_NODE_LIMIT,
  GOAL_NODE_TITLE_MAX,
  GOAL_TITLE_MAX,
  type Goal,
  type GoalNode,
  type NewGoalInput,
} from '../lib/goals'
import { Z_LAYER } from '../lib/layers'
import { makeId } from '../lib/storage'
import ConfirmDialog from './ConfirmDialog'
import DuePicker from './DuePicker'

interface GoalSheetProps {
  initialGoal?: Goal
  onClose: () => void
  onSave: (input: NewGoalInput) => void
}

const DEFAULT_GOAL_DAYS = 30

function dateLabel(key: string, locale: 'en' | 'zh') {
  const date = parseDateKey(key)
  return date ? formatHeaderDate(date, locale) : key
}

export default function GoalSheet({
  initialGoal,
  onClose,
  onSave,
}: GoalSheetProps) {
  const { locale, m } = useI18n()
  const todayKey = toDateKey()
  const defaultEndDate = addDaysKey(todayKey, DEFAULT_GOAL_DAYS)
  const isEditing = Boolean(initialGoal)

  const [title, setTitle] = useState(initialGoal?.title ?? '')
  const [startDate, setStartDate] = useState(
    initialGoal?.startDate ?? todayKey,
  )
  const [endDate, setEndDate] = useState(
    initialGoal?.endDate ?? defaultEndDate,
  )
  const [nodes, setNodes] = useState<GoalNode[]>(
    initialGoal?.nodes ?? [],
  )
  const [picker, setPicker] = useState<'start' | 'end' | null>(null)
  const [error, setError] = useState('')
  const [discardOpen, setDiscardOpen] = useState(false)
  const [focusNodeId, setFocusNodeId] = useState<string | null>(null)

  const titleRef = useRef<HTMLInputElement | null>(null)
  const nodeRefs = useRef(new Map<string, HTMLInputElement>())
  const trapRef = useFocusTrap<HTMLElement>()
  useBodyScrollLock()
  const keyboardInset = useKeyboardInset()

  const initialTitle = initialGoal?.title ?? ''
  const initialStart = initialGoal?.startDate ?? todayKey
  const initialEnd = initialGoal?.endDate ?? defaultEndDate
  const initialNodeTitles = (initialGoal?.nodes ?? []).map(
    (node) => node.title,
  )
  const isDirty =
    title.trim() !== initialTitle.trim() ||
    startDate !== initialStart ||
    endDate !== initialEnd ||
    nodes.map((node) => node.title).join('\u0000') !==
      initialNodeTitles.join('\u0000')

  const requestClose = useCallback(() => {
    if (picker !== null || discardOpen) return
    if (isDirty) {
      setDiscardOpen(true)
      return
    }
    onClose()
  }, [discardOpen, isDirty, onClose, picker])

  useBackHandler(requestClose, { priority: BACK_PRIORITY.sheet })

  useEffect(() => {
    const focusTimer = window.setTimeout(() => {
      titleRef.current?.focus()
    }, 160)
    return () => window.clearTimeout(focusTimer)
  }, [])

  useEffect(() => {
    if (focusNodeId === null) return
    nodeRefs.current.get(focusNodeId)?.focus()
    setFocusNodeId(null)
  }, [focusNodeId, nodes])

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

  function addNode() {
    if (nodes.length >= GOAL_NODE_LIMIT) {
      setError(m.goals.errors.nodeTooMany)
      return
    }
    const node: GoalNode = {
      id: makeId('goal-node'),
      title: '',
      litAt: null,
      createdAt: Date.now(),
    }
    setError('')
    setNodes((current) => [...current, node])
    setFocusNodeId(node.id)
  }

  function updateNodeTitle(id: string, value: string) {
    setNodes((current) =>
      current.map((node) =>
        node.id === id ? { ...node, title: value } : node,
      ),
    )
    if (error) setError('')
  }

  function removeNode(id: string) {
    setNodes((current) => current.filter((node) => node.id !== id))
    if (error) setError('')
  }

  function selectStartDate(value: string) {
    setStartDate(value)
    // Keep the range valid without making the user fix two fields by hand.
    if (value >= endDate) {
      setEndDate(addDaysKey(value, DEFAULT_GOAL_DAYS))
    }
    setError('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedTitle = title.trim()

    if (!trimmedTitle) {
      setError(m.goals.errors.title)
      titleRef.current?.focus()
      return
    }
    if (trimmedTitle.length > GOAL_TITLE_MAX) {
      setError(m.goals.errors.titleTooLong)
      return
    }
    if (endDate <= startDate) {
      setError(m.goals.errors.endBeforeStart)
      return
    }

    const nextNodes = nodes
      .map((node) => ({ ...node, title: node.title.trim() }))
      .filter((node) => node.title.length > 0)

    onSave({
      title: trimmedTitle,
      startDate,
      endDate,
      nodes: nextNodes,
    })
  }

  function handleNodeKeyDown(
    event: ReactKeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
      event.preventDefault()
      addNode()
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-end justify-center"
      style={{ bottom: keyboardInset, zIndex: Z_LAYER.sheet }}
    >
      <button
        type="button"
        aria-label={m.goals.closeBackdrop}
        onClick={requestClose}
        className="fade-enter absolute inset-0 cursor-default bg-[var(--scrim)] "
      />

      <section
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="goal-sheet-title"
        className="sheet-enter relative z-10 flex max-h-[92dvh] w-full max-w-[520px] flex-col overflow-hidden rounded-t-[2px] border-t-2 border-[var(--ink)] bg-[var(--paper)] shadow-[var(--shadow-sheet)]"
        style={{ maxHeight: keyboardInset > 0 ? '100%' : undefined }}
      >
        <div className="flex items-start justify-between px-5 pb-3 pt-5">
          <h2
            id="goal-sheet-title"
            className="page-title text-[var(--ink)]"
          >
            {isEditing ? m.goals.editGoal : m.goals.newGoal}
          </h2>
          <button
            type="button"
            onClick={requestClose}
            aria-label={m.goals.close}
            className="-mr-1 grid h-9 w-9 place-items-center text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
          >
            <X size={18} strokeWidth={1.9} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="hide-scrollbar flex-1 overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2"
        >
          <label htmlFor="goal-title" className="label">
            {m.goals.titleLabel}
          </label>
          <input
            id="goal-title"
            ref={titleRef}
            type="text"
            value={title}
            maxLength={GOAL_TITLE_MAX}
            placeholder={m.goals.titlePlaceholder}
            aria-invalid={Boolean(error)}
            onChange={(event) => {
              setTitle(event.target.value)
              if (error) setError('')
            }}
            className="field mt-1.5 text-[16px]"
          />

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div>
              <p className="label">{m.goals.startDate}</p>
              <button
                type="button"
                onClick={() => setPicker('start')}
                aria-haspopup="dialog"
                className="mt-1.5 flex h-11 w-full items-center gap-1.5 rounded-[2px] border border-[var(--rule)] bg-[var(--sunken)] px-2.5 text-left transition-colors hover:border-[var(--rule-strong)]"
              >
                <CalendarDays
                  size={13}
                  strokeWidth={1.9}
                  className="shrink-0 text-[var(--ink-3)]"
                />
                <span className="fig min-w-0 flex-1 truncate text-[13px] text-[var(--ink)]">
                  {dateLabel(startDate, locale)}
                </span>
              </button>
            </div>
            <div>
              <p className="label">{m.goals.endDate}</p>
              <button
                type="button"
                onClick={() => setPicker('end')}
                aria-haspopup="dialog"
                className="mt-1.5 flex h-11 w-full items-center gap-1.5 rounded-[2px] border border-[var(--rule)] bg-[var(--sunken)] px-2.5 text-left transition-colors hover:border-[var(--rule-strong)]"
              >
                <span className="fig min-w-0 flex-1 truncate text-[13px] text-[var(--ink)]">
                  {dateLabel(endDate, locale)}
                </span>
                <ChevronRight
                  size={13}
                  strokeWidth={1.9}
                  className="shrink-0 text-[var(--ink-3)]"
                />
              </button>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-baseline justify-between gap-3">
              <span className="label">{m.goals.nodes}</span>
              {nodes.length > 0 && (
                <span className="fig text-[11px] text-[var(--ink-3)]">
                  {nodes.length}
                </span>
              )}
            </div>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--ink-3)]">
              {m.goals.nodesHint}
            </p>

            {nodes.length > 0 && (
              <ul className="ledger mt-3">
                {nodes.map((node, index) => (
                  <li
                    key={node.id}
                    className="flex items-center gap-2 py-2"
                  >
                    <span
                      aria-hidden="true"
                      className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-[1px] border ${
                        node.litAt !== null
                          ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]'
                          : 'border-[var(--rule-strong)] text-[var(--ink-3)]'
                      }`}
                    >
                      {node.litAt !== null ? (
                        <Check size={10} strokeWidth={3} />
                      ) : (
                        <span className="fig text-[8.5px] leading-none">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      )}
                    </span>
                    <input
                      ref={(element) => {
                        if (element) nodeRefs.current.set(node.id, element)
                        else nodeRefs.current.delete(node.id)
                      }}
                      type="text"
                      value={node.title}
                      maxLength={GOAL_NODE_TITLE_MAX}
                      placeholder={m.goals.nodePlaceholder}
                      aria-label={m.goals.nodePlaceholder}
                      onChange={(event) =>
                        updateNodeTitle(node.id, event.target.value)
                      }
                      onKeyDown={handleNodeKeyDown}
                      className="field min-w-0 flex-1 text-[15px]"
                    />
                    <button
                      type="button"
                      aria-label={m.goals.deleteNode(
                        node.title || m.goals.nodePlaceholder,
                      )}
                      onClick={() => removeNode(node.id)}
                      className="grid h-11 w-11 shrink-0 place-items-center text-[var(--ink-3)] transition-colors hover:text-[var(--red)]"
                    >
                      <X size={15} strokeWidth={1.9} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <button
              type="button"
              onClick={addNode}
              className="mt-3 flex h-11 items-center gap-1.5 text-[13px] font-medium text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
            >
              <Plus size={14} strokeWidth={2.2} />
              {m.goals.addNode}
            </button>
          </div>

          {error && (
            <p
              id="goal-sheet-error"
              role="alert"
              className="mt-1 text-[13px] text-[var(--red)]"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!title.trim()}
            className="btn btn-primary mt-6 h-12 w-full"
          >
            {!isEditing && <Plus size={16} strokeWidth={2.2} />}
            {isEditing ? m.goals.save : m.goals.create}
          </button>
        </form>
      </section>

      {picker !== null && (
        <DuePicker
          mode="date"
          initialDate={picker === 'start' ? startDate : endDate}
          initialTime="09:00"
          minDate={picker === 'end' ? startDate : undefined}
          onClose={() => setPicker(null)}
          onConfirm={(date) => {
            if (picker === 'start') selectStartDate(date)
            else {
              setEndDate(date)
              setError('')
            }
            setPicker(null)
          }}
        />
      )}

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
