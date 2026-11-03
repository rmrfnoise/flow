import { useI18n } from '../i18n/I18nProvider'
import {
  addDaysKey,
  formatFullDate,
  getHabitDayState,
  getWeekdayLabels,
  type Habit,
  type HabitDayState,
} from '../lib/habits'

interface HabitWeekGridProps {
  habit: Habit
  dates: string[]
  todayKey: string
  weekStart: string
  onToggle: (dateKey: string) => void
}

export default function HabitWeekGrid({
  habit,
  dates,
  todayKey,
  weekStart,
  onToggle,
}: HabitWeekGridProps) {
  const { locale, m } = useI18n()
  const labels = getWeekdayLabels(locale)
  const checked = new Set(dates)

  function stateLabel(state: HabitDayState) {
    if (state === 'checked') return m.habits.stateChecked
    if (state === 'available') return m.habits.statePlanned
    if (state === 'rest') return m.habits.stateRest
    if (state === 'future') return m.habits.stateFuture
    return m.habits.stateUnavailable
  }

  return (
    <div className="grid grid-cols-7 gap-px border border-[var(--rule)] bg-[var(--rule)]">
      {Array.from({ length: 7 }, (_, index) => {
        const key = addDaysKey(weekStart, index)
        const state = getHabitDayState(
          habit,
          key,
          checked.has(key),
          todayKey,
        )
        const isToday = key === todayKey
        const disabled = !(
          state === 'checked' ||
          state === 'available' ||
          state === 'out-of-window'
        )
        const isChecked = state === 'checked'

        return (
          <button
            key={key}
            type="button"
            disabled={disabled}
            aria-pressed={isChecked}
            aria-label={`${formatFullDate(key, locale)} · ${stateLabel(state)}`}
            onClick={() => onToggle(key)}
            className={`relative flex aspect-square flex-col items-center justify-center gap-1 transition-colors ${
              isChecked
                ? 'bg-[var(--ink)] text-[var(--bg)]'
                : state === 'rest'
                  ? 'bg-[var(--sunken)] text-[var(--ink-3)]'
                  : 'bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--sunken)]'
            } ${disabled ? 'opacity-45' : ''}`}
          >
            <span
              className={`text-[9.5px] leading-none tracking-[0.08em] ${
                isChecked ? 'text-[var(--bg)]/70' : 'text-[var(--ink-3)]'
              }`}
            >
              {labels[index]}
            </span>
            <span className="fig text-[15px] leading-none">
              {Number(key.slice(8, 10))}
            </span>
            <span
              aria-hidden="true"
              className={`h-[3px] w-[3px] ${
                isChecked
                  ? 'bg-transparent'
                  : state === 'rest'
                    ? 'bg-[var(--rule-strong)]'
                    : state === 'available'
                      ? 'bg-[var(--ink-3)]'
                      : 'bg-transparent'
              }`}
            />
            {isToday && !isChecked && (
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[2px] bg-[var(--red)]"
              />
            )}
          </button>
        )
      })}
    </div>
  )
}
