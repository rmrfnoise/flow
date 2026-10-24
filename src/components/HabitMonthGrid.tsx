import { useI18n } from '../i18n/I18nProvider'
import {
  formatFullDate,
  getHabitDayState,
  getWeekdayLabels,
  monthDates,
  startOfMonthKey,
  weekdayOfKey,
  type Habit,
  type HabitDayState,
} from '../lib/habits'

interface HabitMonthGridProps {
  habit: Habit
  dates: string[]
  todayKey: string
  monthKey: string
  onToggle: (dateKey: string) => void
}

export default function HabitMonthGrid({
  habit,
  dates,
  todayKey,
  monthKey,
  onToggle,
}: HabitMonthGridProps) {
  const { locale, m } = useI18n()
  const labels = getWeekdayLabels(locale)
  const checked = new Set(dates)
  const monthStart = startOfMonthKey(`${monthKey}-01`)
  const leading = weekdayOfKey(monthStart) - 1
  const days = monthDates(monthKey)
  const cells: Array<string | null> = [
    ...Array.from({ length: leading }, () => null),
    ...days,
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  function stateLabel(state: HabitDayState) {
    if (state === 'checked') return m.habits.stateChecked
    if (state === 'available') return m.habits.statePlanned
    if (state === 'rest') return m.habits.stateRest
    if (state === 'future') return m.habits.stateFuture
    return m.habits.stateUnavailable
  }

  return (
    <div>
      <div className="grid grid-cols-7 gap-1">
        {labels.map((label) => (
          <span
            key={label}
            className="py-1 text-center text-[11px] text-[var(--text-3)]"
          >
            {label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((key, index) => {
          if (key === null) {
            return <span key={`blank-${index}`} className="h-10" />
          }

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
              className={`flex h-10 items-center justify-center rounded-[10px] text-[13px] tabular-nums transition-colors ${
                isToday ? 'bg-[var(--surface-sunken)]' : ''
              } ${disabled ? 'opacity-40' : 'hover:bg-[var(--surface-sunken)]'}`}
            >
              <span
                className={`relative grid h-8 w-8 place-items-center rounded-full border-[1.5px] ${
                  isChecked
                    ? 'border-transparent bg-[var(--accent)] font-semibold text-[var(--on-accent)]'
                    : state === 'available'
                      ? 'border-[var(--checkbox-border)] text-[var(--text)]'
                      : state === 'out-of-window'
                        ? 'border-[var(--line)] text-[var(--text-3)]'
                        : state === 'future'
                          ? 'border-dashed border-[var(--line)] text-[var(--text-3)]'
                          : state === 'rest'
                            ? 'border-transparent text-[var(--text-3)]'
                            : 'border-transparent text-[var(--text-3)]'
                }`}
              >
                {Number(key.slice(8, 10))}
                {state === 'rest' && (
                  <span className="absolute bottom-0.5 h-[3px] w-[3px] rounded-full bg-[var(--text-3)]" />
                )}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
