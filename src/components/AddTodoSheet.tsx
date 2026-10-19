import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import {
  CalendarClock,
  ChevronRight,
  LockKeyhole,
  Plus,
  X,
} from 'lucide-react'
import DeadlinePicker from './DeadlinePicker'
import TagBadge from './TagBadge'
import { parseHashtags, stripHashtags } from '../data/tags'
import {
  dateStringToEndOfDay,
  fromDateTimeLocal,
  timestampToDateInput,
} from '../lib/date'
import type {
  DeadlineMode,
  NewTodoInput,
  Todo,
} from '../types'

interface AddTodoSheetProps {
  initialTodo?: Todo
  onClose: () => void
  onSave: (input: NewTodoInput) => void
}

const DEADLINE_MODES: Array<{ id: DeadlineMode; label: string }> = [
  { id: 'none', label: '不设' },
  { id: 'date', label: '仅日期' },
  { id: 'datetime', label: '日期+时间' },
]

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function deadlineForTodo(todo: Todo | undefined): {
  mode: DeadlineMode
  date: string
  time: string
} {
  if (!todo || todo.dueAt === null) {
    return { mode: 'none', date: '', time: '09:00' }
  }
  const date = timestampToDateInput(todo.dueAt)
  const due = new Date(todo.dueAt)
  const time = `${pad(due.getHours())}:${pad(due.getMinutes())}`
  return {
    mode: todo.dueHasTime ? 'datetime' : 'date',
    date,
    time: todo.dueHasTime ? time : '09:00',
  }
}

export default function AddTodoSheet({
  initialTodo,
  onClose,
  onSave,
}: AddTodoSheetProps) {
  const initialDeadline = deadlineForTodo(initialTodo)
  const initialText = initialTodo
    ? [initialTodo.text, ...initialTodo.tags.map((tag) => `#${tag}`)]
        .join(' ')
        .trim()
    : ''
  const isEditing = Boolean(initialTodo)

  const [text, setText] = useState(initialText)
  const [textError, setTextError] = useState('')
  const [deadlineMode, setDeadlineMode] = useState<DeadlineMode>(
    initialDeadline.mode,
  )
  const [dueDate, setDueDate] = useState(initialDeadline.date)
  const [dueTime, setDueTime] = useState(initialDeadline.time)
  const [deadlineError, setDeadlineError] = useState('')
  const [pickerOpen, setPickerOpen] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const parsedTags = parseHashtags(text)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    const focusTimer = window.setTimeout(() => {
      textareaRef.current?.focus()
    }, 140)
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
    setDeadlineError('')
    if (mode === 'datetime' && !dueTime) {
      setDueTime('09:00')
    }
    setDeadlineMode(mode)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const rawText = text.trim()

    if (!rawText) {
      setTextError('先写点什么吧，一句话就够')
      textareaRef.current?.focus()
      return
    }

    const content = stripHashtags(rawText)
    if (!content) {
      setTextError('标签会自动收好，但还差一点具体内容')
      textareaRef.current?.focus()
      return
    }

    let dueAt: number | null = null
    let dueHasTime = false

    if (deadlineMode === 'date') {
      if (!dueDate) {
        setDeadlineError('选一个日期，或者切回“不设”')
        return
      }
      dueAt = dateStringToEndOfDay(dueDate)
      dueHasTime = false
      if (dueAt === null) {
        setDeadlineError('这个日期似乎不太对，再选一次吧')
        return
      }
    }

    if (deadlineMode === 'datetime') {
      if (!dueDate) {
        setDeadlineError('选一个日期和时间，或者切回“不设”')
        return
      }
      dueAt = fromDateTimeLocal(`${dueDate}T${dueTime}`)
      dueHasTime = true
      if (dueAt === null) {
        setDeadlineError('这个时间似乎不太对，再选一次吧')
        return
      }
    }

    onSave({
      text: content,
      tags: parsedTags,
      dueAt,
      dueHasTime,
    })
  }

  function handleNewTagKeyDown(
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

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-5">
      <button
        type="button"
        aria-label="关闭添加待办面板"
        onClick={onClose}
        className="backdrop-enter absolute inset-0 cursor-default bg-[#000402]/82 backdrop-blur-[5px]"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-sheet-title"
        className="sheet-enter relative z-10 flex max-h-[92dvh] w-full max-w-[540px] flex-col overflow-hidden rounded-t-[20px] border-x border-t border-[var(--accent-line)] bg-[var(--surface-0)] shadow-[0_-20px_80px_var(--accent-glow-faint)] sm:rounded-[14px] sm:border"
      >
        <div className="relative flex justify-center pb-1 pt-2.5">
          <span className="h-[2px] w-10 bg-[var(--accent-strong)] shadow-[0_0_10px_var(--accent-glow)]" />
        </div>

        <div className="flex items-start justify-between px-5 pb-4 pt-3 sm:pt-4">
          <div>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.28em] text-[var(--faint)]">
              {isEditing ? '// edit_entry' : '// new_entry'}
            </p>
            <h2
              id="add-sheet-title"
              className="mt-1.5 font-display text-[22px] font-semibold tracking-[0.02em] text-[var(--ink)]"
            >
              {isEditing ? '编辑这条待办' : '记下一件待办'}
            </h2>
            <p className="mt-1 font-mono text-[14px] text-[var(--muted)]">
              {isEditing
                ? '重新校准，保存后自动归位'
                : '清空脑内缓存，写进终端'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭"
            className="chamfer-sm grid h-8 w-8 place-items-center border border-[var(--line-soft)] bg-[var(--surface-2)] text-[var(--muted)] transition-all active:scale-95 hover:border-[var(--accent-line)] hover:text-[var(--ink-soft)]"
          >
            <X size={15} strokeWidth={2} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="hide-scrollbar flex-1 overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pb-5"
        >
          <div
            className={`chamfer-sm border bg-[var(--surface-1)] px-3.5 py-3 transition-colors ${
              textError
                ? 'border-[#8f3348] shadow-[0_0_0_1px_rgba(255,92,122,0.15)]'
                : 'border-[var(--accent-line)] focus-within:border-[var(--accent-strong)] focus-within:shadow-[0_0_18px_var(--accent-glow-faint)]'
            }`}
          >
            <div className="flex items-start gap-2">
              <span
                aria-hidden="true"
                className="pt-[3px] font-mono text-[14px] text-[var(--accent-strong)]"
              >
                &gt;
              </span>
              <label htmlFor="todo-text" className="sr-only">
                待办内容
              </label>
              <textarea
                id="todo-text"
                ref={textareaRef}
                rows={2}
                value={text}
                maxLength={180}
                placeholder="记录点什么..."
                enterKeyHint="done"
                aria-invalid={Boolean(textError)}
                aria-describedby={
                  textError ? 'todo-text-error' : undefined
                }
                onChange={(event) => {
                  setText(event.target.value)
                  if (textError) setTextError('')
                }}
                onKeyDown={handleNewTagKeyDown}
                className="block min-h-[64px] w-full resize-none bg-transparent font-mono text-[17px] leading-[1.75] text-[var(--ink)] outline-none placeholder:text-[var(--faint)]"
              />
            </div>
            <div className="mt-1 flex items-center justify-between border-t border-dashed border-[var(--line-whisper)] pt-2 font-mono text-[11.5px] text-[var(--faint)]">
              <span>shift+enter 换行</span>
              <span className="tabular-nums text-[var(--faint)]">
                {text.length}/180
              </span>
            </div>
          </div>
          {textError && (
            <p
              id="todo-text-error"
              role="alert"
              className="mt-2 px-1 font-mono text-[13px] text-[var(--danger-text)]"
            >
              ! {textError}
            </p>
          )}

          <div
            className="mt-3 flex min-h-[24px] flex-wrap items-center gap-1.5"
            aria-live="polite"
          >
            {parsedTags.length > 0 ? (
              parsedTags.map((tag) => <TagBadge key={tag} tag={tag} />)
            ) : (
              <span className="font-mono text-[13px] text-[var(--muted)]">
                输入 #标签名称丨自动归档
              </span>
            )}
          </div>

          <div className="mt-5 border-t border-[var(--line-whisper)] pt-4">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--faint)]">
                // deadline
              </p>
              <span className="font-mono text-[11px] text-[var(--faint)]">
                optional
              </span>
            </div>

            <div
              className="mt-2.5 grid grid-cols-3 gap-1.5"
              role="group"
              aria-label="截止时间类型"
            >
              {DEADLINE_MODES.map((mode) => {
                const active = deadlineMode === mode.id
                return (
                  <button
                    key={mode.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => selectDeadlineMode(mode.id)}
                    className={`chamfer-sm h-10 border font-mono text-[13px] transition-all active:scale-[0.98] ${
                      active
                        ? 'border-[var(--accent-strong)] bg-[var(--accent-soft)] text-[var(--accent-ink)] shadow-[0_0_14px_var(--accent-glow-faint)]'
                        : 'border-[var(--line-soft)] bg-[var(--surface-0)] text-[var(--muted)] hover:border-[var(--accent-line)]'
                    }`}
                  >
                    {mode.label}
                  </button>
                )
              })}
            </div>

            {deadlineMode !== 'none' && (
              <div className="dialog-enter mt-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setDeadlineError('')
                    setPickerOpen(true)
                  }}
                  aria-haspopup="dialog"
                  aria-expanded={pickerOpen}
                  className="chamfer-sm flex w-full items-center gap-2 border border-[var(--line-mid)] bg-[var(--surface-1)] px-3 py-2 text-left transition-colors hover:border-[var(--line-strong)]"
                >
                  <CalendarClock
                    size={14}
                    strokeWidth={1.8}
                    className="shrink-0 text-[var(--faint)]"
                  />
                  <span className="min-w-0 flex-1 font-mono text-[14px] tabular-nums text-[var(--ink-soft)]">
                    {dueDate ? (
                      <>
                        {dueDate.replaceAll('-', '.')}
                        <span className="ml-1.5 text-[var(--faint)]">
                          {deadlineMode === 'datetime'
                            ? `// ${dueTime}`
                            : '// 全天'}
                        </span>
                      </>
                    ) : deadlineMode === 'datetime' ? (
                      '选择日期与时间'
                    ) : (
                      '选择截止日期'
                    )}
                  </span>
                  <ChevronRight
                    size={14}
                    strokeWidth={1.8}
                    className="shrink-0 text-[var(--faint)]"
                  />
                </button>
                <p className="mt-2 font-mono text-[13px] leading-relaxed text-[var(--muted)]">
                  {deadlineMode === 'date'
                    ? '仅日期模式 // 当天 23:59 自动截止'
                    : '精确模式 // 按小时与分钟执行'}
                </p>
              </div>
            )}

            {deadlineMode === 'none' && (
              <p className="mt-2 font-mono text-[13px] text-[var(--muted)]">
                无时限模式 // 随时可以启动
              </p>
            )}

            {deadlineError && (
              <p
                role="alert"
                className="mt-2 font-mono text-[12.5px] text-[var(--danger-text)]"
              >
                ! {deadlineError}
              </p>
            )}
          </div>

          <div className="mt-5 flex items-center justify-center gap-1.5 font-mono text-[13px] text-[var(--muted)]">
            <LockKeyhole size={11} strokeWidth={1.8} />
            LOCAL_ONLY // 待办只留在本机
          </div>

          <button
            type="submit"
            className="chamfer-sm mt-3 flex h-[52px] w-full items-center justify-center gap-2 border border-[var(--accent)] bg-[var(--accent)] font-mono text-[14.5px] font-bold tracking-[0.06em] text-[var(--accent-contrast)] shadow-[0_0_24px_var(--accent-glow-soft)] transition-all active:scale-[0.99] active:bg-[var(--accent-strong)]"
          >
            <Plus size={15} strokeWidth={2.4} />
            {isEditing ? '保存修改' : '添加待办'}
          </button>
        </form>
      </section>

      {pickerOpen && deadlineMode !== 'none' && (
        <DeadlinePicker
          mode={deadlineMode}
          initialDate={dueDate}
          initialTime={dueTime}
          onClose={() => setPickerOpen(false)}
          onConfirm={(date, time) => {
            setDueDate(date)
            if (deadlineMode === 'datetime') setDueTime(time)
            setDeadlineError('')
            setPickerOpen(false)
          }}
        />
      )}
    </div>
  )
}
