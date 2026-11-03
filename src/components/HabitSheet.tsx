import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import { X } from 'lucide-react'
import SegmentedTabs from './SegmentedTabs'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useKeyboardInset } from '../hooks/useKeyboardInset'
import { useI18n } from '../i18n/I18nProvider'
import {
  HABIT_ICON_GROUPS,
  findHabitIconOption,
  getHabitIconGroupId,
  type HabitIconGroupId,
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
    checkInIcon?: HabitIcon
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
  const [checkInIcon, setCheckInIcon] = useState<HabitIcon | null>(
    initialHabit?.checkInIcon ?? null,
  )
  const [iconGroup, setIconGroup] = useState<HabitIconGroupId>(() =>
    initialHabit?.checkInIcon
      ? getHabitIconGroupId(initialHabit.checkInIcon)
      : HABIT_ICON_GROUPS[0].id,
  )
  const [error, setError] = useState('')
  const SelectedIcon = checkInIcon
    ? findHabitIconOption(checkInIcon)?.Icon ?? null
    : null
  const groupIcons =
    HABIT_ICON_GROUPS.find((group) => group.id === iconGroup)?.icons ?? []

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
      checkInIcon: checkInIcon ?? undefined,
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
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ bottom: keyboardInset }}
    >
      <button
        type="button"
        aria-label={m.habits.closeBackdrop}
        onClick={onClose}
        className="fade-enter absolute inset-0 cursor-default bg-[var(--scrim)] "
      />

      <section
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="habit-sheet-title"
        className="sheet-enter relative z-10 flex max-h-[92dvh] w-full max-w-[520px] flex-col overflow-hidden rounded-t-[2px] border-t-2 border-[var(--ink)] bg-[var(--paper)] shadow-[var(--shadow-sheet)]"
        style={{
          maxHeight: keyboardInset > 0 ? '100%' : undefined,
        }}
      >
        <div className="flex items-start justify-between px-5 pb-3 pt-5">
          <h2
            id="habit-sheet-title"
            className="page-title text-[var(--ink)]"
          >
            {initialHabit ? m.habits.editHabit : m.habits.newHabit}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={m.habits.close}
            className="-mr-1 grid h-9 w-9 place-items-center text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
          >
            <X size={18} strokeWidth={1.9} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="hide-scrollbar flex-1 overflow-y-auto px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3"
        >
          <label
            htmlFor="habit-name"
            className="label block"
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
            className="field mt-1 h-10 text-[16px] placeholder:text-[var(--ink-3)]"
          />

          <div className="mt-6">
            <span className="label block">{m.habits.frequency}</span>
            <div className="mt-2">
              <SegmentedTabs
                ariaLabel={m.habits.frequency}
                options={[
                  { value: 'daily' as const, label: m.habits.daily },
                  { value: 'weekly' as const, label: m.habits.weekly },
                ]}
                value={frequency}
                onChange={selectFrequency}
              />
            </div>
          </div>

          {frequency === 'weekly' && (
            <div className="dialog-enter mt-5">
              <span className="label block">{m.habits.weekdays}</span>
              <div className="mt-2 grid grid-cols-7 gap-px border border-[var(--rule)] bg-[var(--rule)]">
                {weekdayLabels.map((label, index) => {
                  const day = (index + 1) as Weekday
                  const active = weekdays.includes(day)
                  return (
                    <button
                      key={day}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleWeekday(day)}
                      className={`flex h-10 items-center justify-center text-[11px] font-medium transition-colors ${
                        active
                          ? 'bg-[var(--ink)] text-[var(--bg)]'
                          : 'bg-[var(--paper)] text-[var(--ink-2)] hover:bg-[var(--sunken)] hover:text-[var(--ink)]'
                      }`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
              {weekdays.length === 0 && !error && (
                <p className="mt-1.5 text-[13px] text-[var(--ink-3)]">
                  {m.habits.errorWeekdays}
                </p>
              )}
            </div>
          )}

          <div className="mt-5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[13px] font-medium text-[var(--ink-2)]">
                {m.habits.checkInIcon}
              </span>
              {checkInIcon && SelectedIcon ? (
                <span className="flex min-w-0 items-center gap-1 text-[11px] text-[var(--ink-3)]">
                  <SelectedIcon size={13} strokeWidth={1.9} />
                  <span className="truncate">{m.habits.icons[checkInIcon]}</span>
                  <button
                    type="button"
                    onClick={() => setCheckInIcon(null)}
                    aria-label={m.habits.clearIcon}
                    className="-mr-1.5 grid h-6 w-6 shrink-0 place-items-center rounded-[2px] text-[var(--ink-3)] transition-colors hover:bg-[var(--sunken)] hover:text-[var(--ink)]"
                  >
                    <X size={13} strokeWidth={2} />
                  </button>
                </span>
              ) : (
                <span className="text-[11px] text-[var(--ink-3)]">
                  {m.habits.iconOptional}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[11px] leading-relaxed text-[var(--ink-3)]">
              {m.habits.checkInIconHint}
            </p>
            <div className="hide-scrollbar mt-2 flex flex-nowrap gap-1 overflow-x-auto">
              {HABIT_ICON_GROUPS.map((group) => {
                const active = group.id === iconGroup
                return (
                  <button
                    key={group.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setIconGroup(group.id)}
                    className={`h-7 shrink-0 border-b-2 px-1.5 text-[11.5px] font-medium transition-colors ${
                      active
                        ? 'border-[var(--red)] text-[var(--ink)]'
                        : 'border-transparent text-[var(--ink-3)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {m.habits.habitIconGroups[group.id]}
                  </button>
                )
              })}
            </div>
            <div className="mt-1.5 grid max-h-[138px] grid-cols-8 gap-1 overflow-y-auto overscroll-contain pr-0.5">
              {groupIcons.map((option) => {
                const active = checkInIcon === option.id
                const OptionIcon = option.Icon
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-label={m.habits.icons[option.id]}
                    aria-pressed={active}
                    onClick={() => setCheckInIcon(option.id)}
                    className={`grid h-9 place-items-center border transition-colors ${
                      active
                        ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]'
                        : 'border-[var(--rule)] bg-transparent text-[var(--ink-2)] hover:border-[var(--rule-strong)] hover:text-[var(--ink)]'
                    }`}
                  >
                    <OptionIcon size={18} strokeWidth={1.8} />
                  </button>
                )
              })}
            </div>
          </div>

          {initialHabit && (
            <p className="mt-4 text-[13px] leading-relaxed text-[var(--ink-3)]">
              {m.habits.scheduleEditHint}
            </p>
          )}

          {error && (
            <p
              role="alert"
              className="mt-3 text-[13px] text-[var(--red)]"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="btn btn-primary mt-7 h-12 w-full"
          >
            {initialHabit ? m.habits.save : m.habits.create}
          </button>
        </form>
      </section>
    </div>
  )
}
