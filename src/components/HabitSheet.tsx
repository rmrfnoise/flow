import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import { X } from 'lucide-react'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useKeyboardInset } from '../hooks/useKeyboardInset'
import { useI18n } from '../i18n/I18nProvider'
import {
  DEFAULT_HABIT_ICON,
  HABIT_ICON_OPTIONS,
  getHabitIconOption,
} from '../lib/habitIcons'
import {
  getWeekdayLabels,
  type Habit,
  type HabitIcon,
  type HabitSchedule,
  type Weekday,
} from '../lib/habits'

interface HabitSheetProps {
  initialHabit?: Habit
  onClose: () => void
  onSave: (input: {
    name: string
    schedule: HabitSchedule
    checkInIcon: HabitIcon
  }) => void
}

type Frequency = 'daily' | 'weekly'

export default function HabitSheet({
  initialHabit,
  onClose,
  onSave,
}: HabitSheetProps) {
  const { locale, m } = useI18n()
  const [name, setName] = useState(initialHabit?.name ?? '')
  const [frequency, setFrequency] = useState<Frequency>(
    initialHabit?.schedule.type ?? 'daily',
  )
  const [weekdays, setWeekdays] = useState<Weekday[]>(
    initialHabit?.schedule.type === 'weekly'
      ? initialHabit.schedule.weekdays
      : [],
  )
  const [checkInIcon, setCheckInIcon] = useState<HabitIcon>(
    initialHabit?.checkInIcon ?? DEFAULT_HABIT_ICON,
  )
  const [error, setError] = useState('')
  const selectedIcon = getHabitIconOption(checkInIcon)
  const SelectedIcon = selectedIcon.Icon

  const inputRef = useRef<HTMLInputElement | null>(null)
  const trapRef = useFocusTrap<HTMLElement>()
  const weekdayLabels = getWeekdayLabels(locale)
  useBodyScrollLock()
  const keyboardInset = useKeyboardInset()

  useEffect(() => {
    const timer = window.setTimeout(() => inputRef.current?.focus(), 160)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  function selectFrequency(next: Frequency) {
    setFrequency(next)
    setError('')
  }

  function toggleWeekday(day: Weekday) {
    setWeekdays((current) =>
      current.includes(day)
        ? current.filter((value) => value !== day)
        : [...current, day].sort((a, b) => a - b),
    )
    setError('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError(m.habits.errorName)
      inputRef.current?.focus()
      return
    }
    if (frequency === 'weekly' && weekdays.length === 0) {
      setError(m.habits.errorWeekdays)
      return
    }

    onSave({
      name: trimmed,
      schedule:
        frequency === 'daily'
          ? { type: 'daily' }
          : {
              type: 'weekly',
              weekdays: [...weekdays].sort((a, b) => a - b),
            },
      checkInIcon,
    })
  }

  function handleNameKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
      style={{ bottom: keyboardInset }}
    >
      <button
        type="button"
        aria-label={m.habits.closeBackdrop}
        onClick={onClose}
        className="fade-enter absolute inset-0 cursor-default bg-[var(--scrim)] backdrop-blur-[2px]"
      />

      <section
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="habit-sheet-title"
        className="sheet-enter relative z-10 flex max-h-[92dvh] w-full max-w-[520px] flex-col overflow-hidden rounded-t-[var(--radius-sheet)] bg-[var(--surface)] shadow-[var(--shadow-sheet)] sm:rounded-[var(--radius-panel)] sm:shadow-[var(--shadow-dialog)]"
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
            id="habit-sheet-title"
            className="type-title font-semibold text-[var(--text)]"
          >
            {initialHabit ? m.habits.editHabit : m.habits.newHabit}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={m.habits.close}
            className="-mr-1.5 grid h-8 w-8 place-items-center rounded-full text-[var(--text-3)] transition-colors hover:bg-[var(--surface-sunken)] hover:text-[var(--text)]"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="hide-scrollbar flex-1 overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3"
        >
          <label
            htmlFor="habit-name"
            className="block text-[12px] font-medium text-[var(--text-2)]"
          >
            {m.habits.nameLabel}
          </label>
          <input
            id="habit-name"
            ref={inputRef}
            type="text"
            value={name}
            maxLength={40}
            placeholder={m.habits.namePlaceholder}
            enterKeyHint="done"
            onChange={(event) => {
              setName(event.target.value)
              if (error) setError('')
            }}
            onKeyDown={handleNameKeyDown}
            className="mt-1.5 h-11 w-full rounded-[10px] border border-[var(--line)] bg-[var(--surface-sunken)] px-3.5 text-[16px] text-[var(--text)] outline-none transition-colors placeholder:text-[var(--text-3)] focus:border-[var(--accent)]"
          />

          <div className="mt-5">
            <span className="block text-[12px] font-medium text-[var(--text-2)]">
              {m.habits.frequency}
            </span>
            <div className="mt-1.5 grid grid-cols-2 gap-1 rounded-[10px] bg-[var(--surface-sunken)] p-1">
              <button
                type="button"
                aria-pressed={frequency === 'daily'}
                onClick={() => selectFrequency('daily')}
                className={`h-9 rounded-[7px] text-[12.5px] font-medium transition-colors ${
                  frequency === 'daily'
                    ? 'bg-[var(--segment-active)] text-[var(--text)]'
                    : 'text-[var(--text-2)] hover:text-[var(--text)]'
                }`}
              >
                {m.habits.daily}
              </button>
              <button
                type="button"
                aria-pressed={frequency === 'weekly'}
                onClick={() => selectFrequency('weekly')}
                className={`h-9 rounded-[7px] text-[12.5px] font-medium transition-colors ${
                  frequency === 'weekly'
                    ? 'bg-[var(--segment-active)] text-[var(--text)]'
                    : 'text-[var(--text-2)] hover:text-[var(--text)]'
                }`}
              >
                {m.habits.weekly}
              </button>
            </div>
          </div>

          {frequency === 'weekly' && (
            <div className="dialog-enter mt-5">
              <span className="block text-[12px] font-medium text-[var(--text-2)]">
                {m.habits.weekdays}
              </span>
              <div className="mt-1.5 grid grid-cols-7 gap-1">
                {weekdayLabels.map((label, index) => {
                  const day = (index + 1) as Weekday
                  const active = weekdays.includes(day)
                  return (
                    <button
                      key={day}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleWeekday(day)}
                      className={`flex h-9 items-center justify-center rounded-[8px] text-[11px] font-medium transition-colors ${
                        active
                          ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                          : 'bg-[var(--surface-sunken)] text-[var(--text-2)] hover:text-[var(--text)]'
                      }`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
              {weekdays.length === 0 && !error && (
                <p className="mt-1.5 text-[12px] text-[var(--text-3)]">
                  {m.habits.errorWeekdays}
                </p>
              )}
            </div>
          )}

          <div className="mt-5">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[12px] font-medium text-[var(--text-2)]">
                {m.habits.checkInIcon}
              </span>
              <span className="flex items-center gap-1 truncate text-[11px] text-[var(--text-3)]">
                <SelectedIcon size={13} strokeWidth={1.9} />
                {m.habits.icons[selectedIcon.id]}
              </span>
            </div>
            <p className="mt-0.5 text-[11.5px] leading-relaxed text-[var(--text-3)]">
              {m.habits.checkInIconHint}
            </p>
            <div className="mt-2 grid grid-cols-8 gap-1">
              {HABIT_ICON_OPTIONS.map((option) => {
                const active = checkInIcon === option.id
                const OptionIcon = option.Icon
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-label={m.habits.icons[option.id]}
                    aria-pressed={active}
                    onClick={() => setCheckInIcon(option.id)}
                    className={`grid h-9 place-items-center rounded-[8px] border transition-colors ${
                      active
                        ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent)]'
                        : 'border-[var(--line)] bg-[var(--surface-sunken)] text-[var(--text-2)] hover:border-[var(--line-strong)] hover:text-[var(--text)]'
                    }`}
                  >
                    <OptionIcon size={18} strokeWidth={1.8} />
                  </button>
                )
              })}
            </div>
          </div>

          {initialHabit && (
            <p className="mt-4 text-[12px] leading-relaxed text-[var(--text-3)]">
              {m.habits.scheduleEditHint}
            </p>
          )}

          {error && (
            <p
              role="alert"
              className="mt-3 text-[13px] text-[var(--danger)]"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-6 flex h-12 w-full items-center justify-center rounded-[10px] bg-[var(--accent)] text-[14px] font-medium text-[var(--on-accent)] transition-colors hover:bg-[var(--accent-hover)]"
          >
            {initialHabit ? m.habits.save : m.habits.create}
          </button>
        </form>
      </section>
    </div>
  )
}
