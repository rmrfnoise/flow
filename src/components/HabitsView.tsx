import { Check, Minus } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { findHabitIconOption } from '../lib/habitIcons'
import {
  addDaysKey,
  currentStreak,
  formatHabitSchedule,
  formatHabitScheduleCompact,
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
      <div className="fade-enter mt-8">
        <span
          aria-hidden="true"
          className="block h-[2px] w-8 bg-[var(--red)]"
        />
        <h2 className="page-title mt-4">{m.habits.emptyTitle}</h2>
        <p className="mt-2 max-w-[280px] text-[13.5px] leading-relaxed text-[var(--ink-2)]">
          {m.habits.emptyBody}
        </p>
        <button type="button" onClick={onAdd} className="btn btn-ghost mt-6">
          {m.habits.addFirst}
        </button>
      </div>
    )
  }

  return (
    <ul className="ledger stagger-list mt-1">
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
        const schedule = formatHabitScheduleCompact(
          habit,
          locale,
          m.habits.everyDay,
          { workdays: m.habits.workdays, weekends: m.habits.weekends },
        )
        const fullSchedule = formatHabitSchedule(
          habit,
          locale,
          m.habits.everyDay,
        )
        const HabitIcon = findHabitIconOption(habit.checkInIcon)?.Icon
        const canToggle = state === 'checked' || state === 'available'

        return (
          <li key={habit.id}>
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
              className="flex cursor-pointer items-start gap-3 py-3.5 transition-colors hover:bg-[var(--sunken)] active:bg-[var(--sunken)]"
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
                className={`check mt-[3px] shrink-0 ${
                  canToggle ? '' : 'border-[var(--rule)] text-[var(--ink-3)]'
                }`}
              >
                {canToggle ? (
                  <Check size={13} strokeWidth={3} className="tick" />
                ) : (
                  <Minus size={11} strokeWidth={2.4} />
                )}
              </button>

              <div className="min-w-0 flex-1">
                <p className="flex min-w-0 items-center gap-1.5 text-[15px] leading-[1.4] text-[var(--ink)]">
                  {HabitIcon && (
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-[var(--ink-3)]"
                    >
                      <HabitIcon size={13} strokeWidth={1.9} />
                    </span>
                  )}
                  <span className="truncate">{habit.name}</span>
                </p>
                <p className="mt-1 flex min-w-0 flex-wrap items-center gap-x-1.5 text-[11.5px] leading-[1.3] text-[var(--ink-3)]">
                  <span aria-hidden="true">{schedule}</span>
                  <span className="sr-only">{fullSchedule}</span>
                  {state === 'rest' ? (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{m.habits.restDay}</span>
                    </>
                  ) : streak > 0 ? (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="fig text-[11px]">
                        {m.habits.streak(streak)}
                      </span>
                    </>
                  ) : null}
                </p>
              </div>

              <div
                role="img"
                aria-label={m.habits.week}
                className="mt-1 flex shrink-0 items-end gap-[4px]"
              >
                {weekDays.map((key) => {
                  const done = dates.includes(key)
                  const dayState = getHabitDayState(
                    habit,
                    key,
                    done,
                    todayKey,
                  )
                  const isToday = key === todayKey
                  const tone = done
                    ? 'bg-[var(--ink)]'
                    : isToday
                      ? 'bg-[var(--red)]'
                      : dayState === 'rest'
                        ? 'bg-[var(--rule)]'
                        : 'bg-[var(--rule-strong)]'
                  return (
                    <span
                      key={key}
                      className={`h-3.5 w-[3px] ${tone} ${
                        dayState === 'future' || dayState === 'before-start'
                          ? 'opacity-40'
                          : ''
                      }`}
                    />
                  )
                })}
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
