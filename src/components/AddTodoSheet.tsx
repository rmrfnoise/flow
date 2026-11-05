import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { CalendarClock, ChevronRight, Plus, X } from 'lucide-react'
import { parseHashtags, stripHashtags } from '../data/tags'
import { useBackHandler, BACK_PRIORITY, hasBackHandlerAbove } from '../hooks/useBackHandler'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useKeyboardInset } from '../hooks/useKeyboardInset'
import { useI18n } from '../i18n/I18nProvider'
import {
  dateStringToEndOfDay,
  formatDueDate,
  fromDateTimeLocal,
  timestampToDateInput,
  toDateInputValue,
  toTimeInputValue,
} from '../lib/date'
import { TODO_TEXT_MAX } from '../lib/todos'
import { Z_LAYER } from '../lib/layers'
import ConfirmDialog from './ConfirmDialog'
import DuePicker from './DuePicker'
import SegmentedTabs from './SegmentedTabs'
import type {
  DeadlineMode,
  NewTodoInput,
  Todo,
} from '../types'

interface AddTodoSheetProps {
  initialTodo?: Todo
  availableTags: string[]
  onClose: () => void
  onSave: (input: NewTodoInput) => void
}

const DEADLINE_MODES: DeadlineMode[] = ['none', 'date', 'datetime']

function deadlineForTodo(todo: Todo | undefined): {
  mode: DeadlineMode
  date: string
  time: string
} {
  if (!todo || todo.dueAt === null) {
    return { mode: 'none', date: toDateInputValue(), time: '09:00' }
  }

  return {
    mode: todo.dueHasTime ? 'datetime' : 'date',
    date: timestampToDateInput(todo.dueAt),
    time: todo.dueHasTime ? toTimeInputValue(todo.dueAt) : '09:00',
  }
}

export default function AddTodoSheet({
  initialTodo,
  availableTags,
  onClose,
  onSave,
}: AddTodoSheetProps) {
  const { locale, m } = useI18n()
  const initialDeadline = deadlineForTodo(initialTodo)
  const initialText = initialTodo
    ? [initialTodo.text, ...initialTodo.tags.map((tag) => `#${tag}`)]
        .join(' ')
        .trim()
    : ''
  const isEditing = Boolean(initialTodo)

  const [text, setText] = useState(initialText)
  const [error, setError] = useState('')
  const [deadlineMode, setDeadlineMode] = useState<DeadlineMode>(
    initialDeadline.mode,
  )
  const [dueDate, setDueDate] = useState(initialDeadline.date)
  const [dueTime, setDueTime] = useState(initialDeadline.time)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [discardOpen, setDiscardOpen] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const trapRef = useFocusTrap<HTMLElement>()
  useBodyScrollLock()
  const keyboardInset = useKeyboardInset()
  const parsedTags = parseHashtags(text)
  const parsedTagKeys = new Set(parsedTags)
  const tagOptions = [
    ...availableTags,
    ...parsedTags.filter((tag) => !availableTags.includes(tag)),
  ]
  const deadlineChanged =
    deadlineMode !== initialDeadline.mode ||
    (deadlineMode !== 'none' && dueDate !== initialDeadline.date) ||
    (deadlineMode === 'datetime' &&
      dueTime !== initialDeadline.time)
  const isDirty =
    text.trim() !== initialText.trim() || deadlineChanged

  const requestClose = useCallback(() => {
    if (pickerOpen || discardOpen) return
    if (isDirty) {
      setDiscardOpen(true)
      return
    }
    onClose()
  }, [discardOpen, isDirty, onClose, pickerOpen])

  useBackHandler(requestClose, { priority: BACK_PRIORITY.sheet })

  useEffect(() => {
    const focusTimer = window.setTimeout(() => {
      textareaRef.current?.focus()
    }, 160)
    return () => window.clearTimeout(focusTimer)
  }, [])

  useLayoutEffect(() => {
    const element = textareaRef.current
    if (!element) return

    const viewportHeight =
      window.visualViewport?.height ?? window.innerHeight
    const maxHeight = Math.max(
      120,
      Math.min(viewportHeight * 0.4, 320),
    )

    element.style.height = 'auto'
    element.style.height = `${Math.min(
      element.scrollHeight,
      maxHeight,
    )}px`
    element.style.overflowY =
      element.scrollHeight > maxHeight ? 'auto' : 'hidden'
  }, [keyboardInset, text])

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

  function selectDeadlineMode(mode: DeadlineMode) {
    setError('')
    if (!dueDate) setDueDate(toDateInputValue())
    if (mode === 'datetime' && !dueTime) setDueTime('09:00')
    setDeadlineMode(mode)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const rawText = text.trim()
    const content = stripHashtags(rawText)

    if (!content) {
      setError(m.sheet.errors.content)
      textareaRef.current?.focus()
      return
    }

    let dueAt: number | null = null
    let dueHasTime = false

    if (deadlineMode !== 'none') {
      if (!dueDate) {
        setError(m.sheet.errors.date)
        return
      }

      if (deadlineMode === 'date') {
        dueAt = dateStringToEndOfDay(dueDate)
        if (dueAt === null) {
          setError(m.sheet.errors.badDate)
          return
        }
      } else {
        dueAt = fromDateTimeLocal(`${dueDate}T${dueTime || '09:00'}`)
        dueHasTime = true
        if (dueAt === null) {
          setError(m.sheet.errors.badTime)
          return
        }
      }
    }

    onSave({
      text: content,
      tags: parsedTags,
      dueAt,
      dueHasTime,
    })
  }

  function handleTextKeyDown(
    event: ReactKeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (
      event.key === 'Enter' &&
      (event.metaKey || event.ctrlKey) &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  function toggleTag(tag: string) {
    setText((current) => {
      const hasTag = parseHashtags(current).includes(tag)
      if (hasTag) {
        const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        return current
          .replace(
            new RegExp(`#${escaped}(?![\\p{L}\\p{N}_-])`, 'gu'),
            '',
          )
          .replace(/[ \t]{2,}/g, ' ')
          .trim()
      }

      const base = current.trimEnd()
      return `${base}${base ? ' ' : ''}#${tag}`.slice(
        0,
        TODO_TEXT_MAX,
      )
    })

    if (error) setError('')
    window.setTimeout(() => {
      const element = textareaRef.current
      if (!element) return
      element.focus()
      element.setSelectionRange(element.value.length, element.value.length)
    }, 0)
  }

  const dueTimestamp =
    deadlineMode === 'datetime'
      ? fromDateTimeLocal(`${dueDate}T${dueTime || '09:00'}`)
      : deadlineMode === 'date'
        ? dateStringToEndOfDay(dueDate)
        : null
  const dueLabel =
    dueTimestamp === null
      ? ''
      : formatDueDate(
          dueTimestamp,
          deadlineMode === 'datetime',
          Date.now(),
          locale,
        )

  return (
    <div
      className="fixed inset-0 flex items-end justify-center"
      style={{ bottom: keyboardInset, zIndex: Z_LAYER.sheet }}
    >
      <button
        type="button"
        aria-label={m.sheet.closeBackdrop}
        onClick={requestClose}
        className="fade-enter absolute inset-0 cursor-default bg-[var(--scrim)] "
      />

      <section
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="todo-sheet-title"
        className="sheet-enter relative z-10 flex max-h-[92dvh] w-full max-w-[520px] flex-col overflow-hidden rounded-t-[2px] border-t-2 border-[var(--ink)] bg-[var(--paper)] shadow-[var(--shadow-sheet)]"
        style={{
          maxHeight: keyboardInset > 0 ? '100%' : undefined,
        }}
      >
        <div className="flex items-start justify-between px-5 pb-3 pt-5">
          <h2
            id="todo-sheet-title"
            className="page-title text-[var(--ink)]"
          >
            {isEditing ? m.sheet.editTask : m.sheet.newTask}
          </h2>
          <button
            type="button"
            onClick={requestClose}
            aria-label={m.sheet.close}
            className="-mr-1 grid h-9 w-9 place-items-center text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
          >
            <X size={18} strokeWidth={1.9} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="hide-scrollbar flex-1 overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2"
        >
          <div className="border-b border-[var(--ink)] pb-2 transition-colors focus-within:border-[var(--red)]">
            <label htmlFor="todo-text" className="sr-only">
              {m.sheet.contentLabel}
            </label>
            <textarea
              id="todo-text"
              ref={textareaRef}
              rows={3}
              value={text}
              maxLength={TODO_TEXT_MAX}
              placeholder={m.sheet.placeholder}
              enterKeyHint="enter"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'todo-text-error' : undefined}
              onChange={(event) => {
                setText(event.target.value)
                if (error) setError('')
              }}
              onKeyDown={handleTextKeyDown}
              className="block min-h-[92px] w-full resize-none bg-transparent text-[16px] leading-[1.5] text-[var(--ink)] outline-none placeholder:text-[var(--ink-3)]"
            />
          </div>

          <div className="mt-3">
            <div className="flex items-baseline justify-between">
              <span className="text-[13px] font-medium text-[var(--ink-2)]">
                {m.sheet.tags}
              </span>
              {text.length > TODO_TEXT_MAX - 50 && (
                <span className="font-mono text-[11px] tabular-nums text-[var(--ink-3)]">
                  {text.length}/{TODO_TEXT_MAX}
                </span>
              )}
            </div>

            <div className="mt-1.5 flex min-h-[28px] flex-wrap items-center gap-1.5">
              {tagOptions.length > 0 ? (
                tagOptions.map((tag) => {
                  const active = parsedTagKeys.has(tag)
                  return (
                    <button
                      key={tag}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleTag(tag)}
                      className={`h-7 border-b-2 px-1.5 text-[12px] font-medium transition-colors ${
                        active
                          ? 'border-[var(--red)] text-[var(--ink)]'
                          : 'border-transparent text-[var(--ink-3)] hover:text-[var(--ink)]'
                      }`}
                    >
                      #{tag}
                    </button>
                  )
                })
              ) : (
                <span className="text-[13px] text-[var(--ink-3)]">
                  {m.sheet.tagHint}
                </span>
              )}
            </div>
          </div>

          {error && (
            <p
              id="todo-text-error"
              role="alert"
              className="mt-1 text-[13px] text-[var(--red)]"
            >
              {error}
            </p>
          )}

          <div className="mt-5">
            <div className="flex items-baseline justify-between">
              <span className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--ink-2)]">
                <CalendarClock
                  size={14}
                  strokeWidth={1.9}
                  className="text-[var(--ink-3)]"
                />
                {m.sheet.due}
              </span>
              <span className="text-[11px] text-[var(--ink-3)]">
                {deadlineMode === 'none'
                  ? m.sheet.optional
                  : deadlineMode === 'date'
                    ? m.sheet.dueBy
                    : m.sheet.exactTime}
              </span>
            </div>

            <div className="mt-2.5">
              <SegmentedTabs
                ariaLabel={m.sheet.modeAria}
                options={DEADLINE_MODES.map((mode) => ({
                  value: mode,
                  label: m.sheet[mode],
                }))}
                value={deadlineMode}
                onChange={selectDeadlineMode}
              />
            </div>

            {deadlineMode !== 'none' && (
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                aria-haspopup="dialog"
                className="mt-2 flex h-11 w-full items-center gap-2 rounded-[2px] border border-[var(--rule)] bg-[var(--sunken)] px-3 text-left transition-colors hover:border-[var(--rule-strong)]"
              >
                <span className="min-w-0 flex-1 truncate text-[15px] text-[var(--ink)]">
                  {dueLabel || m.sheet.due}
                </span>
                <ChevronRight
                  size={15}
                  strokeWidth={1.9}
                  className="shrink-0 text-[var(--ink-3)]"
                />
              </button>
            )}
          </div>

          <button
            type="submit"
            aria-keyshortcuts="Control+Enter Meta+Enter"
            disabled={!text.trim()}
            className="btn btn-primary mt-7 h-12 w-full"
          >
            {!isEditing && <Plus size={16} strokeWidth={2.2} />}
            {isEditing ? m.sheet.save : m.sheet.add}
          </button>
        </form>
      </section>

      {pickerOpen && deadlineMode !== 'none' && (
        <DuePicker
          mode={deadlineMode === 'datetime' ? 'datetime' : 'date'}
          initialDate={dueDate}
          initialTime={dueTime}
          onClose={() => setPickerOpen(false)}
          onConfirm={(date, time) => {
            setDueDate(date)
            if (deadlineMode === 'datetime') setDueTime(time)
            setError('')
            setPickerOpen(false)
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
