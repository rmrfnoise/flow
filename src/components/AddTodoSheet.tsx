import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { CalendarClock, ChevronRight, Plus, X } from 'lucide-react'
import { parseHashtags, stripHashtags } from '../data/tags'
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
import DuePicker from './DuePicker'
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

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const trapRef = useFocusTrap<HTMLElement>()
  useBodyScrollLock()
  const keyboardInset = useKeyboardInset()
  const parsedTags = parseHashtags(text)
  const parsedTagKeys = new Set(
    parsedTags.map((tag) => tag.toLocaleLowerCase()),
  )
  const tagOptions = [
    ...availableTags,
    ...parsedTags.filter(
      (tag) =>
        !availableTags.some(
          (available) =>
            available.toLocaleLowerCase() === tag.toLocaleLowerCase(),
        ),
    ),
  ]

  useEffect(() => {
    const focusTimer = window.setTimeout(() => {
      textareaRef.current?.focus()
    }, 160)
    return () => window.clearTimeout(focusTimer)
  }, [])

  useEffect(() => {
    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape' && !pickerOpen) onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, pickerOpen])

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
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  function toggleTag(tag: string) {
    const key = tag.toLocaleLowerCase()
    setText((current) => {
      const hasTag = parseHashtags(current).some(
        (currentTag) => currentTag.toLocaleLowerCase() === key,
      )
      if (hasTag) {
        const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        return current
          .replace(
            new RegExp(`#${escaped}(?![\\p{L}\\p{N}_-])`, 'giu'),
            '',
          )
          .replace(/[ \t]{2,}/g, ' ')
          .trim()
      }

      const base = current.trimEnd()
      return `${base}${base ? ' ' : ''}#${tag}`.slice(0, 180)
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
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
      style={{ bottom: keyboardInset }}
    >
      <button
        type="button"
        aria-label={m.sheet.closeBackdrop}
        onClick={onClose}
        className="fade-enter absolute inset-0 cursor-default bg-[var(--scrim)] backdrop-blur-[2px]"
      />

      <section
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="todo-sheet-title"
        className="sheet-enter relative z-10 flex max-h-[92dvh] w-full max-w-[520px] flex-col overflow-hidden rounded-t-[20px] bg-[var(--surface)] shadow-[var(--shadow-sheet)] sm:rounded-[18px] sm:shadow-[var(--shadow-dialog)]"
        style={{
          maxHeight: keyboardInset > 0 ? '100%' : undefined,
        }}
      >
        <div className="flex justify-center pt-2.5">
          <span
            aria-hidden="true"
            className="h-1 w-9 rounded-full bg-[var(--line-strong)]"
          />
        </div>

        <div className="flex items-center justify-between px-5 pb-1 pt-3">
          <h2
            id="todo-sheet-title"
            className="text-[18px] font-semibold tracking-[-0.015em] text-[var(--text)]"
          >
            {isEditing ? m.sheet.editTask : m.sheet.newTask}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={m.sheet.close}
            className="-mr-1.5 grid h-8 w-8 place-items-center rounded-full text-[var(--text-3)] transition-colors hover:bg-[var(--surface-sunken)] hover:text-[var(--text)]"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="hide-scrollbar flex-1 overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2"
        >
          <div className="rounded-[10px] border border-[var(--line)] bg-[var(--surface-sunken)] px-3.5 py-3 transition-colors focus-within:border-[var(--accent)]">
            <label htmlFor="todo-text" className="sr-only">
              {m.sheet.contentLabel}
            </label>
            <textarea
              id="todo-text"
              ref={textareaRef}
              rows={3}
              value={text}
              maxLength={180}
              placeholder={m.sheet.placeholder}
              enterKeyHint="done"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'todo-text-error' : undefined}
              onChange={(event) => {
                setText(event.target.value)
                if (error) setError('')
              }}
              onKeyDown={handleTextKeyDown}
              className="block min-h-[80px] w-full resize-none bg-transparent text-[16px] leading-[1.5] text-[var(--text)] outline-none placeholder:text-[var(--text-3)]"
            />
          </div>

          <div className="mt-3">
            <div className="flex items-baseline justify-between">
              <span className="text-[12px] font-medium text-[var(--text-2)]">
                {m.sheet.tags}
              </span>
              {text.length > 150 && (
                <span className="font-mono text-[11px] tabular-nums text-[var(--text-3)]">
                  {text.length}/180
                </span>
              )}
            </div>

            <div className="mt-1.5 flex min-h-[28px] flex-wrap items-center gap-1.5">
              {tagOptions.length > 0 ? (
                tagOptions.map((tag) => {
                  const active = parsedTagKeys.has(
                    tag.toLocaleLowerCase(),
                  )
                  return (
                    <button
                      key={tag}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleTag(tag)}
                      className={`h-7 rounded-full px-2.5 text-[11.5px] font-medium transition-colors ${
                        active
                          ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                          : 'bg-[var(--surface-sunken)] text-[var(--text-2)] hover:text-[var(--text)]'
                      }`}
                    >
                      #{tag}
                    </button>
                  )
                })
              ) : (
                <span className="text-[12.5px] text-[var(--text-3)]">
                  {m.sheet.tagHint}
                </span>
              )}
            </div>
          </div>

          {error && (
            <p
              id="todo-text-error"
              role="alert"
              className="mt-1 text-[13px] text-[var(--danger)]"
            >
              {error}
            </p>
          )}

          <div className="mt-5">
            <div className="flex items-baseline justify-between">
              <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-[var(--text-2)]">
                <CalendarClock
                  size={14}
                  strokeWidth={1.9}
                  className="text-[var(--text-3)]"
                />
                {m.sheet.due}
              </span>
              <span className="text-[11.5px] text-[var(--text-3)]">
                {deadlineMode === 'none'
                  ? m.sheet.optional
                  : deadlineMode === 'date'
                    ? m.sheet.dueBy
                    : m.sheet.exactTime}
              </span>
            </div>

            <div
              className="mt-2.5 grid grid-cols-3 gap-1 rounded-[10px] bg-[var(--surface-sunken)] p-1"
              role="group"
              aria-label={m.sheet.modeAria}
            >
              {DEADLINE_MODES.map((mode) => {
                const active = deadlineMode === mode
                return (
                  <button
                    key={mode}
                    type="button"
                    aria-pressed={active}
                    onClick={() => selectDeadlineMode(mode)}
                    className={`h-9 rounded-[7px] text-[12.5px] font-medium transition-colors ${
                      active
                        ? 'bg-[var(--segment-active)] text-[var(--text)]'
                        : 'text-[var(--text-2)] hover:text-[var(--text)]'
                    }`}
                  >
                    {m.sheet[mode]}
                  </button>
                )
              })}
            </div>

            {deadlineMode !== 'none' && (
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                aria-haspopup="dialog"
                className="mt-2 flex h-11 w-full items-center gap-2 rounded-[10px] border border-[var(--line)] bg-[var(--surface-sunken)] px-3 text-left transition-colors hover:border-[var(--line-strong)]"
              >
                <span className="min-w-0 flex-1 truncate text-[14px] text-[var(--text)]">
                  {dueLabel || m.sheet.due}
                </span>
                <ChevronRight
                  size={15}
                  strokeWidth={1.9}
                  className="shrink-0 text-[var(--text-3)]"
                />
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!text.trim()}
            className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[var(--accent)] text-[14px] font-medium text-[var(--on-accent)] transition-colors hover:bg-[var(--accent-hover)] disabled:bg-[var(--surface-sunken)] disabled:text-[var(--text-3)]"
          >
            {!isEditing && <Plus size={17} strokeWidth={2.2} />}
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
    </div>
  )
}
