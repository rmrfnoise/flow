import {
  Check,
  ChevronRight,
  Minus,
  Repeat,
} from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import {
  currentStreak,
  formatHabitSchedule,
  getHabitDates,
  getHabitDayState,
  type Habit,
  type HabitCheckins,
} from '../lib/habits'

interface HabitsViewProps {
  habits: Habit[]
  checkins: HabitCheckins
  todayKey: string
  onOpen: (id: string) => void
  onToggleToday: (habit: Habit) => void
  onAdd: () => void
}

export default function HabitsView({
  habits,
  checkins,
  todayKey,
  onOpen,
  onToggleToday,
  onAdd,
}: HabitsViewProps) {
  const { locale, m } = useI18n()

  if (habits.length === 0) {
    return (
      <div className="fade-enter flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-8 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-[var(--surface-sunken)] text-[var(--text-3)]">
          <Repeat size={24} strokeWidth={1.6} />
        </div>
        <h2 className="mt-4 text-[17px] font-semibold text-[var(--text)]">
          {m.habits.emptyTitle}
        </h2>
        <p className="mt-1.5 max-w-[250px] text-[14px] leading-relaxed text-[var(--text-2)]">
          {m.habits.emptyBody}
        </p>
        <button
          type="button"
          onClick={onAdd}
          className="mt-6 h-11 rounded-full bg-[var(--accent)] px-5 text-[14px] font-semibold text-[var(--on-accent)] transition-all active:scale-[0.98] hover:bg-[var(--accent-hover)]"
        >
          {m.habits.addFirst}
        </button>
      </div>
    )
  }

  return (
    <ul className="mt-1 overflow-hidden rounded-[16px] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
      {habits.map((habit) => {
        const dates = getHabitDates(checkins, habit.id)
        const checkedToday = dates.includes(todayKey)
        const state = getHabitDayState(
          habit,
          todayKey,
          checkedToday,
          todayKey,
        )
        const streak = currentStreak(habit, dates, todayKey)
        const schedule = formatHabitSchedule(
          habit,
          locale,
          m.habits.everyDay,
        )
        const canToggle =
          state === 'checked' || state === 'available'

        return (
          <li
            key={habit.id}
            className="border-b border-[var(--line)] last:border-b-0"
          >
            <div
              role="button"
              tabIndex={0}
              aria-label={m.habits.openHabit(habit.name)}
              onClick={() => onOpen(habit.id)}
              onKeyDown={(event) => {
                if (event.target !== event.currentTarget) return
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onOpen(habit.id)
                }
              }}
              className="flex cursor-pointer items-start gap-3 bg-[var(--surface)] px-4 py-3.5 transition-colors hover:bg-[var(--surface-sunken)]"
            >
              <button
                type="button"
                disabled={!canToggle}
                aria-pressed={state === 'checked'}
                aria-label={
                  state === 'checked'
                    ? m.habits.markUndone(habit.name)
                    : state === 'available'
                      ? m.habits.markDone(habit.name)
                      : state === 'rest'
                        ? m.habits.restDay
                        : m.habits.stateUnavailable
                }
                onClick={(event) => {
                  event.stopPropagation()
                  if (canToggle) onToggleToday(habit)
                }}
                className={`mt-[1px] grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border-[1.5px] transition-all duration-150 ${
                  state === 'checked'
                    ? 'border-transparent bg-[var(--accent)] text-[var(--on-accent)]'
                    : state === 'available'
                      ? 'border-[var(--checkbox-border)] text-transparent hover:border-[var(--accent)]'
                      : 'border-transparent bg-[var(--surface-sunken)] text-[var(--text-3)]'
                }`}
              >
                {state === 'checked' ? (
                  <Check size={13} strokeWidth={3} className="check-pop" />
                ) : state === 'available' ? (
                  <Check size={13} strokeWidth={3} />
                ) : (
                  <Minus size={12} strokeWidth={2} />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[16px] leading-[1.45] text-[var(--text)]">
                  {habit.name}
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-[12.5px] leading-[1.4] text-[var(--text-3)]">
                  <span>{schedule}</span>
                  {state === 'rest' ? (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{m.habits.restDay}</span>
                    </>
                  ) : streak > 0 ? (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{m.habits.streak(streak)}</span>
                    </>
                  ) : null}
                </p>
              </div>

              <ChevronRight
                size={15}
                strokeWidth={1.9}
                className="mt-1 shrink-0 text-[var(--text-3)]"
              />
            </div>
          </li>
        )
      })}
    </ul>
  )
}
