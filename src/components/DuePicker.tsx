import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Minus,
  Plus,
  X,
} from 'lucide-react'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useBackHandler, BACK_PRIORITY } from '../hooks/useBackHandler'
import { useI18n } from '../i18n/I18nProvider'
import { Z_LAYER } from '../lib/layers'
import { formatHeaderDate } from '../lib/date'

interface DuePickerProps {
  mode: 'date' | 'datetime'
  initialDate: string
  initialTime: string
  maxDate?: string
  onClose: () => void
  onConfirm: (date: string, time: string) => void
}

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function toDateValue(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`
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
  return {
    hour: Math.min(23, Math.max(0, Number(match[1]))),
    minute: Math.min(59, Math.max(0, Number(match[2]))),
  }
}

export default function DuePicker({
  mode,
  initialDate,
  initialTime,
  maxDate,
  onClose,
  onConfirm,
}: DuePickerProps) {
  const { locale, m } = useI18n()
  const tag = locale === 'zh' ? 'zh-CN' : 'en-US'

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

  const panelRef = useFocusTrap<HTMLDivElement>()
  useBackHandler(onClose, { priority: BACK_PRIORITY.picker })
  const todayValue = toDateValue(new Date())

  const days = useMemo(() => {
    const firstWeekday = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7
    const dayCount = new Date(viewYear, viewMonth + 1, 0).getDate()
    const cells: Array<number | null> = Array(firstWeekday).fill(null)
    for (let day = 1; day <= dayCount; day += 1) cells.push(day)
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }, [viewMonth, viewYear])

  const monthLabel = new Intl.DateTimeFormat(tag, {
    year: 'numeric',
    month: 'long',
  }).format(new Date(viewYear, viewMonth, 1))

  const weekdayLabels = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(tag, { weekday: 'short' })
    return Array.from({ length: 7 }, (_, index) =>
      formatter.format(new Date(2024, 0, 1 + index)),
    )
  }, [tag])

  const dayLabel = useMemo(() => {
    return new Intl.DateTimeFormat(tag, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    })
  }, [tag])

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

  function goToday() {
    const now = new Date()
    setSelectedDate(todayValue)
    setViewYear(now.getFullYear())
    setViewMonth(now.getMonth())
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
  const selectedParts = selectedDate.split('-').map(Number)
  const selectedTimestamp = new Date(
    selectedParts[0] ?? initial.getFullYear(),
    (selectedParts[1] ?? initial.getMonth() + 1) - 1,
    selectedParts[2] ?? initial.getDate(),
    hour,
    minute,
  ).getTime()
  const summaryDate = formatHeaderDate(
    new Date(selectedTimestamp),
    locale,
  )
  const summaryTime =
    mode === 'datetime'
      ? new Intl.DateTimeFormat(tag, {
          hour: 'numeric',
          minute: '2-digit',
          hour12: locale === 'en',
        }).format(new Date(selectedTimestamp))
      : ''
  const summary = summaryTime
    ? `${summaryDate} · ${summaryTime}`
    : summaryDate

  return (
    <div
      className="fixed inset-0 grid place-items-center p-5"
      style={{ zIndex: Z_LAYER.picker }}
    >
      <button
        type="button"
        aria-label={m.sheet.close}
        onClick={onClose}
        className="fade-enter absolute inset-0 cursor-default bg-[var(--scrim)] "
      />

      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="due-picker-title"
        className="dialog-enter hide-scrollbar relative z-10 max-h-[92dvh] w-full max-w-[380px] overflow-y-auto rounded-[2px] border border-[var(--rule-strong)] border-t-2 border-t-[var(--ink)] bg-[var(--paper)] p-5 shadow-[var(--shadow-dialog)] outline-none"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2
              id="due-picker-title"
              className="page-title text-[var(--ink)]"
            >
              {mode === 'datetime'
                ? m.picker.titleDateTime
                : m.picker.titleDate}
            </h2>
            <p className="mt-0.5 text-[13px] text-[var(--ink-3)]">
              {summary}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={m.sheet.close}
            className="-mr-1 grid h-9 w-9 shrink-0 place-items-center text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
          >
            <X size={17} strokeWidth={2} />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            aria-label={m.picker.previousMonth}
            onClick={() => moveMonth(-1)}
            className="-ml-1 grid h-8 w-8 place-items-center text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
          >
            <ChevronLeft size={16} strokeWidth={1.9} />
          </button>
          <span className="fig text-[14px] text-[var(--ink)]">
            {monthLabel}
          </span>
          <button
            type="button"
            aria-label={m.picker.nextMonth}
            onClick={() => moveMonth(1)}
            className="-mr-1 grid h-8 w-8 place-items-center text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
          >
            <ChevronRight size={16} strokeWidth={1.9} />
          </button>
        </div>

        <div className="mt-3 grid grid-cols-7 gap-1">
          {weekdayLabels.map((label) => (
            <span
              key={label}
              className="py-1 text-center text-[9.5px] tracking-[0.08em] text-[var(--ink-3)]"
            >
              {label}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (day === null) {
              return <span key={`blank-${index}`} className="h-9" />
            }

            const value = toDateValue(new Date(viewYear, viewMonth, day))
            const selected = value === selectedDate
            const today = value === todayValue
            const disabled = maxDate ? value > maxDate : false

            return (
              <button
                key={value}
                type="button"
                aria-label={dayLabel.format(
                  new Date(viewYear, viewMonth, day),
                )}
                aria-pressed={selected}
                disabled={disabled}
                onClick={() => selectDay(day)}
                className={`h-9 w-full rounded-[1px] text-[13px] tabular-nums transition-colors ${
                  disabled
                    ? 'cursor-not-allowed text-[var(--ink-3)] opacity-35'
                    : selected
                      ? 'bg-[var(--ink)] font-semibold text-[var(--bg)]'
                      : today
                        ? 'font-semibold text-[var(--red)] hover:bg-[var(--sunken)]'
                        : 'text-[var(--ink-2)] hover:bg-[var(--sunken)] hover:text-[var(--ink)]'
                }`}
              >
                {day}
              </button>
            )
          })}
        </div>

        <div className="mt-2 flex justify-center">
          <button
            type="button"
            onClick={goToday}
            className="border-b border-transparent px-2 py-1 text-[12px] text-[var(--ink-3)] transition-colors hover:border-[var(--red)] hover:text-[var(--ink)]"
          >
            {m.picker.today}
          </button>
        </div>

        {mode === 'datetime' && (
          <div className="mt-3 border-t border-[var(--rule)] pt-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--ink)]">
                <Clock3
                  size={13}
                  strokeWidth={1.9}
                  className="text-[var(--ink-3)]"
                />
                {m.picker.time}
              </span>
              <span className="text-[11px] text-[var(--ink-3)]">
                {selectedTime}
              </span>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="rounded-[2px] border border-[var(--rule)] bg-[var(--sunken)] px-2.5 py-2">
                <p className="text-[11px] text-[var(--ink-3)]">
                  {m.picker.hours}
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <button
                    type="button"
                    aria-label={`${m.picker.hours} -`}
                    onClick={() => adjustHour(-1)}
                    className="grid h-7 w-7 place-items-center rounded-[2px] text-[var(--ink-2)] transition-colors hover:bg-[var(--paper)] hover:text-[var(--ink)]"
                  >
                    <Minus size={14} strokeWidth={2.2} />
                  </button>
                  <span className="font-mono text-[20px] font-medium tabular-nums text-[var(--ink)]">
                    {pad(hour)}
                  </span>
                  <button
                    type="button"
                    aria-label={`${m.picker.hours} +`}
                    onClick={() => adjustHour(1)}
                    className="grid h-7 w-7 place-items-center rounded-[2px] text-[var(--ink-2)] transition-colors hover:bg-[var(--paper)] hover:text-[var(--ink)]"
                  >
                    <Plus size={14} strokeWidth={2.2} />
                  </button>
                </div>
              </div>

              <div className="rounded-[2px] border border-[var(--rule)] bg-[var(--sunken)] px-2.5 py-2">
                <p className="text-[11px] text-[var(--ink-3)]">
                  {m.picker.minutes}
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <button
                    type="button"
                    aria-label={`${m.picker.minutes} -`}
                    onClick={() => adjustMinute(-1)}
                    className="grid h-7 w-7 place-items-center rounded-[2px] text-[var(--ink-2)] transition-colors hover:bg-[var(--paper)] hover:text-[var(--ink)]"
                  >
                    <Minus size={14} strokeWidth={2.2} />
                  </button>
                  <span className="font-mono text-[20px] font-medium tabular-nums text-[var(--ink)]">
                    {pad(minute)}
                  </span>
                  <button
                    type="button"
                    aria-label={`${m.picker.minutes} +`}
                    onClick={() => adjustMinute(1)}
                    className="grid h-7 w-7 place-items-center rounded-[2px] text-[var(--ink-2)] transition-colors hover:bg-[var(--paper)] hover:text-[var(--ink)]"
                  >
                    <Plus size={14} strokeWidth={2.2} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] text-[var(--ink-3)]">
                {m.picker.quickTimes}
              </span>
              <div className="flex gap-1">
                {['09:00', '12:00', '18:00', '21:00'].map((time) => {
                  const active = selectedTime === time
                  return (
                    <button
                      key={time}
                      type="button"
                      aria-pressed={active}
                      onClick={() => selectQuickTime(time)}
                      className={`h-7 rounded-[2px] px-2 font-mono text-[11px] tabular-nums transition-colors ${
                        active
                          ? 'bg-[var(--sunken)] text-[var(--ink)]'
                          : 'text-[var(--ink-2)] hover:bg-[var(--sunken)]'
                      }`}
                    >
                      {time}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost h-11 flex-1"
          >
            {m.app.cancel}
          </button>
          <button
            type="button"
            onClick={() =>
              onConfirm(
                selectedDate,
                mode === 'datetime' ? selectedTime : '',
              )
            }
            className="btn btn-primary h-11 flex-1"
          >
            {m.picker.done}
          </button>
        </div>
      </div>
    </div>
  )
}
