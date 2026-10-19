import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Minus,
  Plus,
  X,
} from 'lucide-react'
import type { DeadlineMode } from '../types'

const WEEKDAY_LABELS = ['一', '二', '三', '四', '五', '六', '日']
const QUICK_TIMES = ['09:00', '12:00', '18:00', '21:00']

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function toDateValue(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

function parseDateValue(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(value)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }
  return date
}

function parseTimeValue(value: string) {
  const match = /^(\d{2}):(\d{2})$/u.exec(value)
  if (!match) return { hour: 9, minute: 0 }
  const hour = Math.min(23, Math.max(0, Number(match[1])))
  const minute = Math.min(59, Math.max(0, Number(match[2])))
  return { hour, minute }
}

interface TimeStepperProps {
  label: string
  value: string
  onDecrease: () => void
  onIncrease: () => void
}

function TimeStepper({
  label,
  value,
  onDecrease,
  onIncrease,
}: TimeStepperProps) {
  return (
    <div className="chamfer-sm border border-[var(--line-mid)] bg-[var(--surface-1)] p-2">
      <p className="font-mono text-[11.5px] uppercase tracking-[0.16em] text-[var(--muted)]">
        {label}
      </p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <button
          type="button"
          aria-label={`${label} 减少`}
          onClick={onDecrease}
          className="grid h-8 w-8 place-items-center border border-[var(--line-mid)] text-[var(--muted)] transition-all active:scale-90 hover:border-[var(--line-strong)] hover:text-[var(--ink-soft)]"
        >
          <Minus size={12} strokeWidth={2.2} />
        </button>
        <span className="font-mono text-[25px] font-semibold leading-none tabular-nums text-[var(--ink)]">
          {value}
        </span>
        <button
          type="button"
          aria-label={`${label} 增加`}
          onClick={onIncrease}
          className="grid h-8 w-8 place-items-center border border-[var(--line-mid)] text-[var(--muted)] transition-all active:scale-90 hover:border-[var(--line-strong)] hover:text-[var(--ink-soft)]"
        >
          <Plus size={12} strokeWidth={2.2} />
        </button>
      </div>
    </div>
  )
}

interface DeadlinePickerProps {
  mode: Exclude<DeadlineMode, 'none'>
  initialDate: string
  initialTime: string
  onClose: () => void
  onConfirm: (date: string, time: string) => void
}

export default function DeadlinePicker({
  mode,
  initialDate,
  initialTime,
  onClose,
  onConfirm,
}: DeadlinePickerProps) {
  const initial = parseDateValue(initialDate) ?? new Date()
  const initialTimeValue = parseTimeValue(initialTime)
  const initialDateValue = parseDateValue(initialDate)
    ? initialDate
    : toDateValue(initial)

  const [selectedDate, setSelectedDate] = useState(initialDateValue)
  const [viewYear, setViewYear] = useState(initial.getFullYear())
  const [viewMonth, setViewMonth] = useState(initial.getMonth())
  const [hour, setHour] = useState(initialTimeValue.hour)
  const [minute, setMinute] = useState(initialTimeValue.minute)

  const panelRef = useRef<HTMLElement | null>(null)
  const todayValue = toDateValue(new Date())

  const days = useMemo(() => {
    const firstWeekday =
      (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7
    const dayCount = new Date(viewYear, viewMonth + 1, 0).getDate()
    const cells: Array<number | null> = Array(firstWeekday).fill(null)
    for (let day = 1; day <= dayCount; day += 1) cells.push(day)
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }, [viewMonth, viewYear])

  useEffect(() => {
    panelRef.current?.focus()
  }, [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  function moveMonth(delta: number) {
    const next = new Date(viewYear, viewMonth + delta, 1)
    setViewYear(next.getFullYear())
    setViewMonth(next.getMonth())
  }

  function selectDay(day: number) {
    setSelectedDate(toDateValue(new Date(viewYear, viewMonth, day)))
  }

  function adjustHour(delta: number) {
    setHour((value) => (value + delta + 24) % 24)
  }

  function adjustMinute(delta: number) {
    setMinute((value) => (value + delta * 5 + 60) % 60)
  }

  function selectQuickTime(value: string) {
    const parsed = parseTimeValue(value)
    setHour(parsed.hour)
    setMinute(parsed.minute)
  }

  const selectedTime = `${pad(hour)}:${pad(minute)}`
  const selectedLabel =
    mode === 'datetime'
      ? `${selectedDate.replaceAll('-', '.')} // ${selectedTime}`
      : `${selectedDate.replaceAll('-', '.')} // 全天`

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-5">
      <button
        type="button"
        aria-label="关闭日期选择器"
        onClick={onClose}
        className="backdrop-enter absolute inset-0 cursor-default bg-[#000402]/86 backdrop-blur-[5px]"
      />

      <section
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="deadline-picker-title"
        className="dialog-enter hide-scrollbar relative z-10 max-h-[92dvh] w-full max-w-[430px] overflow-y-auto rounded-t-[20px] border-x border-t border-[var(--accent-line)] bg-[var(--surface-0)] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-20px_80px_var(--accent-glow-faint)] outline-none sm:rounded-[14px] sm:border"
      >
        <div className="mb-2 flex justify-center">
          <span className="h-[2px] w-10 bg-[var(--accent-strong)] shadow-[0_0_10px_var(--accent-glow)]" />
        </div>

        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.26em] text-[var(--faint)]">
              // deadline_picker
            </p>
            <h2
              id="deadline-picker-title"
              className="mt-1.5 font-display text-[21px] font-semibold tracking-[0.01em] text-[var(--ink)]"
            >
              {mode === 'datetime' ? '选择日期与时间' : '选择截止日期'}
            </h2>
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

        <div className="mt-3 flex items-center justify-between border border-[var(--line-soft)] bg-[var(--surface-2)] px-2 py-1.5">
          <button
            type="button"
            aria-label="上个月"
            onClick={() => moveMonth(-1)}
            className="grid h-7 w-7 place-items-center border border-transparent text-[var(--muted)] transition-colors hover:border-[var(--accent-line)] hover:text-[var(--ink-soft)]"
          >
            <ChevronLeft size={15} strokeWidth={2} />
          </button>
          <div className="flex items-center gap-1.5 font-mono text-[14px] tabular-nums text-[var(--ink-soft)]">
            <CalendarDays size={12} strokeWidth={1.9} className="text-[var(--faint)]" />
            <span>{viewYear}</span>
            <span className="text-[var(--faint)]">//</span>
            <span className="text-[var(--accent)]">{pad(viewMonth + 1)}</span>
          </div>
          <button
            type="button"
            aria-label="下个月"
            onClick={() => moveMonth(1)}
            className="grid h-7 w-7 place-items-center border border-transparent text-[var(--muted)] transition-colors hover:border-[var(--accent-line)] hover:text-[var(--ink-soft)]"
          >
            <ChevronRight size={15} strokeWidth={2} />
          </button>
        </div>

        <div className="mt-2 grid grid-cols-7 gap-1">
          {WEEKDAY_LABELS.map((label) => (
            <span
              key={label}
              className="py-1 text-center font-mono text-[12.5px] text-[var(--muted)]"
            >
              {label}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (day === null) {
              return <span key={`empty-${index}`} className="h-10" />
            }
            const value = toDateValue(
              new Date(viewYear, viewMonth, day),
            )
            const selected = value === selectedDate
            const today = value === todayValue
            return (
              <button
                key={value}
                type="button"
                aria-label={`${viewYear}年${viewMonth + 1}月${day}日`}
                aria-pressed={selected}
                onClick={() => selectDay(day)}
                className={`chamfer-sm h-10 border font-mono text-[15px] tabular-nums transition-all active:scale-95 ${
                  selected
                    ? 'border-[var(--accent)] bg-[var(--accent)] font-semibold text-[var(--accent-contrast)] shadow-[0_0_12px_var(--accent-glow-soft)]'
                    : today
                      ? 'border-[var(--line-strong)] bg-[var(--accent-soft)] text-[var(--ink)]'
                      : 'border-[var(--line-whisper)] text-[var(--ink-soft)] hover:border-[var(--line-strong)] hover:bg-[var(--accent-surface)] hover:text-[var(--ink)]'
                }`}
              >
                {day}
              </button>
            )
          })}
        </div>

        {mode === 'datetime' && (
          <div className="mt-4 border-t border-[var(--line-whisper)] pt-3">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 font-mono text-[11.5px] uppercase tracking-[0.22em] text-[var(--muted)]">
                <Clock3 size={10} strokeWidth={1.8} />
                // time
              </p>
              <span className="font-mono text-[11.5px] text-[var(--faint)]">
                24H · MIN/5
              </span>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <TimeStepper
                label="HOUR"
                value={pad(hour)}
                onDecrease={() => adjustHour(-1)}
                onIncrease={() => adjustHour(1)}
              />
              <TimeStepper
                label="MIN"
                value={pad(minute)}
                onDecrease={() => adjustMinute(-1)}
                onIncrease={() => adjustMinute(1)}
              />
            </div>

            <div className="mt-2 grid grid-cols-4 gap-1.5">
              {QUICK_TIMES.map((time) => {
                const active = selectedTime === time
                return (
                  <button
                    key={time}
                    type="button"
                    aria-pressed={active}
                    onClick={() => selectQuickTime(time)}
                    className={`chamfer-sm h-8 border font-mono text-[12.5px] tabular-nums transition-all active:scale-[0.97] ${
                      active
                        ? 'border-[var(--accent-strong)] bg-[var(--accent-soft)] text-[var(--accent-ink)]'
                        : 'border-[var(--line-soft)] bg-[var(--surface-0)] text-[var(--muted)] hover:border-[var(--accent-line)]'
                    }`}
                  >
                    {time}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="mt-4 border-t border-[var(--line-whisper)] pt-3">
          <div className="flex items-center justify-between gap-3 font-mono text-[12.5px]">
            <span className="uppercase tracking-[0.16em] text-[var(--faint)]">
              selected
            </span>
            <span className="truncate tabular-nums text-[var(--ink-soft)]">
              {selectedLabel}
            </span>
          </div>

          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="chamfer-sm h-11 flex-1 border border-[var(--line-mid)] bg-[var(--surface-2)] font-mono text-[14px] text-[var(--ink-soft)] transition-all active:scale-[0.98] hover:border-[var(--accent-line)]"
            >
              取消
            </button>
            <button
              type="button"
              onClick={() =>
                onConfirm(
                  selectedDate,
                  mode === 'datetime' ? selectedTime : '',
                )
              }
              className="chamfer-sm h-11 flex-1 border border-[var(--accent)] bg-[var(--accent)] font-mono text-[14px] font-bold tracking-[0.04em] text-[var(--accent-contrast)] shadow-[0_0_18px_var(--accent-glow-soft)] transition-all active:scale-[0.98]"
            >
              {mode === 'datetime' ? '确认时间' : '确认日期'}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
