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
      <div className="grid grid-cols-7 pb-1.5">
        {labels.map((label) => (
          <span
            key={label}
            className="text-center text-[9.5px] leading-none tracking-[0.08em] text-[var(--ink-3)]"
          >
            {label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px border border-[var(--rule)] bg-[var(--rule)]">
        {cells.map((key, index) => {
          if (key === null) {
            return (
              <span
                key={`blank-${index}`}
                className="h-11 bg-[var(--paper)]"
                aria-hidden="true"
              />
            )
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
          const muted =
            state === 'future' ||
            state === 'before-start' ||
            state === 'out-of-window'

          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              aria-pressed={isChecked}
              aria-label={`${formatFullDate(key, locale)} · ${stateLabel(state)}`}
              onClick={() => onToggle(key)}
              className={`relative flex h-11 items-center justify-center transition-colors ${
                isChecked
                  ? 'bg-[var(--ink)] text-[var(--bg)]'
                  : state === 'rest'
                    ? 'bg-[var(--sunken)] text-[var(--ink-3)]'
                    : `bg-[var(--paper)] hover:bg-[var(--sunken)] ${
                        muted ? 'text-[var(--ink-3)]' : 'text-[var(--ink)]'
                      }`
              } ${disabled ? 'opacity-55' : ''}`}
            >
              <span
                className={`fig text-[12.5px] leading-none ${
                  isToday && !isChecked
                    ? 'font-semibold text-[var(--red)]'
                    : ''
                }`}
              >
                {Number(key.slice(8, 10))}
              </span>
              {state === 'rest' && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-1.5 h-[3px] w-[3px] bg-[var(--rule-strong)]"
                />
              )}
              {isToday && (
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[2px] bg-[var(--red)]"
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
