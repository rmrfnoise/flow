import { useState } from 'react'
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import HabitMonthGrid from './HabitMonthGrid'
import HabitWeekGrid from './HabitWeekGrid'
import SegmentedTabs from './SegmentedTabs'
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

  const stats = [
    { value: String(streak), label: m.habits.streakLabel },
    {
      value: weekPlanned === 0 ? '—' : `${weekChecked}/${weekPlanned}`,
      label: m.habits.weekLabel,
    },
    { value: String(dates.length), label: m.habits.totalLabel },
  ]

  return (
    <div className="mt-4 flex flex-col">
      <div className="grid grid-cols-3 border-y border-[var(--rule)]">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`py-3.5 ${
              index === 0 ? 'pr-3' : index === 1 ? 'px-3' : 'pl-3'
            } ${index > 0 ? 'border-l border-[var(--rule)]' : ''}`}
          >
            <p className="fig text-[23px] leading-none text-[var(--ink)]">
              {stat.value}
            </p>
            <p className="label mt-2">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <SegmentedTabs
          ariaLabel={m.habits.title}
          options={[
            { value: 'week' as const, label: m.habits.week },
            { value: 'month' as const, label: m.habits.month },
          ]}
          value={view}
          onChange={setView}
        />
      </div>

      <div className="mt-4">
        <div className="mb-3 flex items-center gap-1">
          <button
            type="button"
            aria-label={m.habits.previous}
            onClick={moveBack}
            className="-ml-1 grid h-9 w-9 shrink-0 place-items-center text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
          >
            <ChevronLeft size={16} strokeWidth={1.9} />
          </button>
          <span className="fig min-w-0 flex-1 truncate text-center text-[13px] text-[var(--ink)]">
            {rangeLabel}
          </span>
          <button
            type="button"
            onClick={goToday}
            className="shrink-0 px-2 py-1 text-[11.5px] tracking-[0.06em] text-[var(--ink-3)] transition-colors hover:text-[var(--ink)]"
          >
            {m.habits.today}
          </button>
          <button
            type="button"
            aria-label={m.habits.next}
            onClick={moveForward}
            className="-mr-1 grid h-9 w-9 shrink-0 place-items-center text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
          >
            <ChevronRight size={16} strokeWidth={1.9} />
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

      <div className="mt-5 flex items-center justify-center gap-5 text-[11px] text-[var(--ink-3)]">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 bg-[var(--ink)]" />
          {m.habits.stateChecked}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 border border-[var(--rule-strong)]" />
          {m.habits.statePlanned}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 bg-[var(--sunken)]" />
          {m.habits.stateRest}
        </span>
      </div>

      <p className="mt-4 text-center text-[12.5px] leading-relaxed text-[var(--ink-3)]">
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
        className="btn btn-danger mt-10 h-11 w-full border border-[var(--rule)]"
      >
        <Trash2 size={14} strokeWidth={1.8} />
        {m.habits.deleteHabit}
      </button>
    </div>
  )
}
