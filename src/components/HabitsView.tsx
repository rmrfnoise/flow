import {
  Check,
  ChevronRight,
  Minus,
  Repeat,
} from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { getHabitIconOption } from '../lib/habitIcons'
import {
  addDaysKey,
  currentStreak,
  formatHabitSchedule,
  getHabitDates,
  getHabitDayState,
  startOfWeekKey,
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
  const weekStart = startOfWeekKey(todayKey)
  const weekDays = Array.from({ length: 7 }, (_, index) =>
    addDaysKey(weekStart, index),
  )

  if (habits.length === 0) {
    return (
      <div className="fade-enter flex flex-1 flex-col items-center justify-center px-6 pb-24 pt-8 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-[var(--surface-sunken)] text-[var(--text-3)]">
          <Repeat size={22} strokeWidth={1.6} />
        </div>
        <h2 className="mt-3 text-[16px] font-semibold text-[var(--text)]">
          {m.habits.emptyTitle}
        </h2>
        <p className="mt-1.5 max-w-[250px] text-[13.5px] leading-relaxed text-[var(--text-2)]">
          {m.habits.emptyBody}
        </p>
        <button
          type="button"
          onClick={onAdd}
          className="mt-5 h-10 rounded-[10px] bg-[var(--accent)] px-4 text-[13px] font-medium text-[var(--on-accent)] transition-colors hover:bg-[var(--accent-hover)]"
        >
          {m.habits.addFirst}
        </button>
      </div>
    )
  }

  return (
    <ul className="mt-1 overflow-hidden rounded-[14px] border border-[var(--line)] bg-[var(--surface)]">
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
        const icon = getHabitIconOption(habit.checkInIcon)
        const HabitIcon = icon.Icon
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
              className="relative flex cursor-pointer items-start gap-3 bg-[var(--surface)] px-4 py-3.5 transition-colors hover:bg-[var(--surface-sunken)]"
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
                className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-[1.5px] transition-colors ${
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
                <p className="flex min-w-0 items-center gap-1.5 text-[15.5px] leading-[1.4] text-[var(--text)]">
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-[var(--text-3)]"
                  >
                    <HabitIcon size={14} strokeWidth={1.9} />
                  </span>
                  <span className="truncate">{habit.name}</span>
                </p>
                <p className="mt-1 flex flex-wrap items-center gap-x-1.5 text-[11.5px] leading-[1.4] text-[var(--text-3)]">
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
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[9px] font-medium uppercase tracking-[0.08em] text-[var(--text-3)]">
                    {m.habits.week}
                  </span>
                  <div
                    aria-hidden="true"
                    className="flex items-center gap-[3px]"
                  >
                    {weekDays.map((key) => {
                      const done = dates.includes(key)
                      const dayState = getHabitDayState(
                        habit,
                        key,
                        done,
                        todayKey,
                      )
                      const dotClass = done
                        ? 'bg-[var(--accent)]'
                        : dayState === 'rest'
                          ? 'bg-[var(--surface-sunken)] ring-1 ring-inset ring-[var(--line)]'
                          : dayState === 'available'
                            ? 'bg-[var(--line-strong)]'
                            : 'bg-[var(--line)]'
                      return (
                        <span
                          key={key}
                          className={`h-[5px] w-[5px] rounded-full ${dotClass} ${
                            key === todayKey
                              ? 'ring-2 ring-[var(--accent-soft)]'
                              : ''
                          }`}
                        />
                      )
                    })}
                  </div>
                </div>
              </div>

              <ChevronRight
                size={14}
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
