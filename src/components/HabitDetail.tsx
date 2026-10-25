import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
} from 'lucide-react'
import HabitMonthGrid from './HabitMonthGrid'
import HabitWeekGrid from './HabitWeekGrid'
import { useI18n } from '../i18n/I18nProvider'
import {
  addDaysKey,
  countChecked,
  countPlanned,
  currentStreak,
  endOfMonthKey,
  endOfWeekKey,
  formatMonthDay,
  formatMonthLabel,
  formatWeekRange,
  shiftMonthKey,
  startOfMonthKey,
  startOfWeekKey,
  type Habit,
} from '../lib/habits'

interface HabitDetailProps {
  habit: Habit
  dates: string[]
  todayKey: string
  onDelete: () => void
  onToggle: (dateKey: string) => void
}

type DetailView = 'week' | 'month'

export default function HabitDetail({
  habit,
  dates,
  todayKey,
  onDelete,
  onToggle,
}: HabitDetailProps) {
  const { locale, m } = useI18n()
  const [view, setView] = useState<DetailView>('week')
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeekKey(todayKey),
  )
  const [monthKey, setMonthKey] = useState(() => todayKey.slice(0, 7))

  const todayWeekStart = startOfWeekKey(todayKey)
  const todayWeekEnd = endOfWeekKey(todayKey)
  const streak = currentStreak(habit, dates, todayKey)
  const weekChecked = countChecked(
    habit,
    dates,
    todayWeekStart,
    todayWeekEnd,
  )
  const weekPlanned = countPlanned(
    habit,
    todayWeekStart,
    todayWeekEnd,
  )

  const viewedWeekEnd = addDaysKey(weekStart, 6)
  const viewedWeekChecked = countChecked(
    habit,
    dates,
    weekStart,
    viewedWeekEnd,
  )
  const viewedWeekPlanned = countPlanned(
    habit,
    weekStart,
    viewedWeekEnd,
  )

  const monthStart = startOfMonthKey(`${monthKey}-01`)
  const monthEnd = endOfMonthKey(monthStart)
  const viewedMonthChecked = countChecked(
    habit,
    dates,
    monthStart,
    monthEnd,
  )
  const viewedMonthPlanned = countPlanned(
    habit,
    monthStart,
    monthEnd,
  )

  const rangeLabel =
    view === 'week'
      ? formatWeekRange(weekStart, locale)
      : formatMonthLabel(monthKey, locale)
  const viewingBeforeStart =
    view === 'week'
      ? viewedWeekEnd < habit.startDate
      : monthEnd < habit.startDate

  function goToday() {
    setWeekStart(startOfWeekKey(todayKey))
    setMonthKey(todayKey.slice(0, 7))
  }

  function moveBack() {
    if (view === 'week') {
      setWeekStart((current) => addDaysKey(current, -7))
    } else {
      setMonthKey((current) => shiftMonthKey(current, -1))
    }
  }

  function moveForward() {
    if (view === 'week') {
      setWeekStart((current) => addDaysKey(current, 7))
    } else {
      setMonthKey((current) => shiftMonthKey(current, 1))
    }
  }

  return (
    <div className="mt-5 flex flex-col">
      <div className="grid grid-cols-3 divide-x divide-[var(--line)] rounded-[16px] border border-[var(--line)] bg-[var(--surface)] py-3 shadow-[var(--shadow-card)]">
        <div className="px-2 text-center">
          <p className="text-[18px] font-semibold tabular-nums text-[var(--text)]">
            {streak}
          </p>
          <p className="mt-0.5 text-[11px] text-[var(--text-3)]">
            {m.habits.streakLabel}
          </p>
        </div>
        <div className="px-2 text-center">
          <p className="text-[18px] font-semibold tabular-nums text-[var(--text)]">
            {weekPlanned === 0
              ? '—'
              : `${weekChecked}/${weekPlanned}`}
          </p>
          <p className="mt-0.5 text-[11px] text-[var(--text-3)]">
            {m.habits.weekLabel}
          </p>
        </div>
        <div className="px-2 text-center">
          <p className="text-[18px] font-semibold tabular-nums text-[var(--text)]">
            {dates.length}
          </p>
          <p className="mt-0.5 text-[11px] text-[var(--text-3)]">
            {m.habits.totalLabel}
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-1 rounded-[10px] bg-[var(--surface-sunken)] p-1">
        <button
          type="button"
          aria-pressed={view === 'week'}
          onClick={() => setView('week')}
          className={`h-9 rounded-[7px] text-[13px] font-medium transition-all ${
            view === 'week'
              ? 'bg-[var(--segment-active)] text-[var(--text)] shadow-[var(--shadow-card)]'
              : 'text-[var(--text-2)] hover:text-[var(--text)]'
          }`}
        >
          {m.habits.week}
        </button>
        <button
          type="button"
          aria-pressed={view === 'month'}
          onClick={() => setView('month')}
          className={`h-9 rounded-[7px] text-[13px] font-medium transition-all ${
            view === 'month'
              ? 'bg-[var(--segment-active)] text-[var(--text)] shadow-[var(--shadow-card)]'
              : 'text-[var(--text-2)] hover:text-[var(--text)]'
          }`}
        >
          {m.habits.month}
        </button>
      </div>

      <div className="mt-3 rounded-[16px] border border-[var(--line)] bg-[var(--surface)] p-3 shadow-[var(--shadow-card)]">
        <div className="mx-auto w-full max-w-[460px]">
          <div className="mb-2 flex items-center gap-1">
            <button
              type="button"
              aria-label={m.habits.previous}
              onClick={moveBack}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[var(--text-2)] transition-colors hover:bg-[var(--surface-sunken)] hover:text-[var(--text)]"
            >
              <ChevronLeft size={16} strokeWidth={2} />
            </button>
            <span className="min-w-0 flex-1 truncate text-center text-[13px] font-semibold text-[var(--text)]">
              {rangeLabel}
            </span>
            <button
              type="button"
              onClick={goToday}
              className="h-7 shrink-0 rounded-full px-2 text-[11px] font-medium text-[var(--accent)] transition-colors hover:bg-[var(--accent-soft)]"
            >
              {m.habits.today}
            </button>
            <button
              type="button"
              aria-label={m.habits.next}
              onClick={moveForward}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[var(--text-2)] transition-colors hover:bg-[var(--surface-sunken)] hover:text-[var(--text)]"
            >
              <ChevronRight size={16} strokeWidth={2} />
            </button>
          </div>

          {view === 'week' ? (
            <HabitWeekGrid
              habit={habit}
              dates={dates}
              todayKey={todayKey}
              weekStart={weekStart}
              onToggle={onToggle}
            />
          ) : (
            <HabitMonthGrid
              habit={habit}
              dates={dates}
              todayKey={todayKey}
              monthKey={monthKey}
              onToggle={onToggle}
            />
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-4 text-[11px] text-[var(--text-3)]">
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
          {m.habits.stateChecked}
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full border border-[var(--checkbox-border)]" />
          {m.habits.statePlanned}
        </span>
        <span className="flex items-center gap-1">
          <span className="grid h-2.5 w-2.5 place-items-center">
            <span className="h-[3px] w-[3px] rounded-full bg-[var(--text-3)]" />
          </span>
          {m.habits.stateRest}
        </span>
      </div>

      <p className="mt-3 text-center text-[13px] text-[var(--text-3)]">
        {viewingBeforeStart
          ? m.habits.startsOn(
              formatMonthDay(habit.startDate, locale),
            )
          : view === 'week'
            ? viewedWeekPlanned === 0
              ? m.habits.noPlanned
              : m.habits.weekSummary(
                  viewedWeekChecked,
                  viewedWeekPlanned,
                )
            : viewedMonthPlanned === 0
              ? m.habits.noPlanned
              : m.habits.monthSummary(
                  viewedMonthChecked,
                  viewedMonthPlanned,
                )}
      </p>

      <button
        type="button"
        onClick={onDelete}
        className="mt-8 flex h-11 w-full items-center justify-center gap-1.5 rounded-[10px] text-[13px] font-medium text-[var(--danger)] transition-colors hover:bg-[var(--danger-soft)]"
      >
        <Trash2 size={14} strokeWidth={1.9} />
        {m.habits.deleteHabit}
      </button>
    </div>
  )
}
