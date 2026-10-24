import { Check } from 'lucide-react'
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
    <div className="grid grid-cols-7 gap-1">
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
            className={`flex flex-col items-center gap-1 rounded-[10px] py-2 transition-colors ${
              isToday
                ? 'bg-[var(--surface-sunken)]'
                : 'hover:bg-[var(--surface-sunken)]'
            } ${disabled ? 'opacity-40' : ''}`}
          >
            <span className="text-[10px] text-[var(--text-3)]">
              {labels[index]}
            </span>
            <span
              className={`text-[13px] tabular-nums ${
                isToday
                  ? 'font-semibold text-[var(--text)]'
                  : 'text-[var(--text-2)]'
              }`}
            >
              {Number(key.slice(8, 10))}
            </span>
            <span
              className={`mt-0.5 grid h-6 w-6 place-items-center rounded-full border-[1.5px] ${
                isChecked
                  ? 'border-transparent bg-[var(--accent)] text-[var(--on-accent)]'
                  : state === 'available'
                    ? 'border-[var(--checkbox-border)] text-transparent'
                    : state === 'out-of-window'
                      ? 'border-[var(--line)] text-[var(--text-3)]'
                      : state === 'rest'
                        ? 'border-transparent'
                        : 'border-[var(--line)]'
              }`}
            >
              {isChecked ? (
                <Check size={12} strokeWidth={3} />
              ) : state === 'rest' ? (
                <span className="h-1 w-1 rounded-full bg-[var(--text-3)]" />
              ) : null}
            </span>
          </button>
        )
      })}
    </div>
  )
}
