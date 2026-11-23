import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import GoalRow from './GoalRow'
import { useI18n } from '../i18n/I18nProvider'
import { isGoalEnded, sortGoals, type Goal } from '../lib/goals'

interface GoalsViewProps {
  goals: Goal[]
  todayKey: string
  onOpen: (id: string) => void
  onAdd: () => void
}

export default function GoalsView({
  goals,
  todayKey,
  onOpen,
  onAdd,
}: GoalsViewProps) {
  const { m } = useI18n()

  const sorted = sortGoals(goals)
  const active = sorted.filter((goal) => !isGoalEnded(goal))
  const ended = sorted.filter((goal) => isGoalEnded(goal))

  // When nothing is active, the finished section is the whole page.
  const [endedOpen, setEndedOpen] = useState(active.length === 0)

  if (goals.length === 0) {
    return (
      <div className="fade-enter mt-8">
        <span
          aria-hidden="true"
          className="block h-[2px] w-8 bg-[var(--red)]"
        />
        <h2 className="page-title mt-4">{m.goals.emptyTitle}</h2>
        <p className="mt-2 max-w-[300px] text-[13.5px] leading-relaxed text-[var(--ink-2)]">
          {m.goals.emptyBody}
        </p>
        <button
          type="button"
          onClick={onAdd}
          className="btn btn-ghost mt-6"
        >
          {m.goals.addFirst}
        </button>
      </div>
    )
  }

  return (
    <div className="mt-1">
      {active.length > 0 && (
        <ul className="ledger stagger-list">
          {active.map((goal) => (
            <GoalRow
              key={goal.id}
              goal={goal}
              todayKey={todayKey}
              onOpen={onOpen}
            />
          ))}
        </ul>
      )}

      {ended.length > 0 && (
        <section className={active.length > 0 ? 'mt-8' : ''}>
          <button
            type="button"
            onClick={() => setEndedOpen((value) => !value)}
            aria-expanded={endedOpen}
            aria-controls="ended-goals"
            className="flex w-full items-baseline justify-between pb-2 text-left"
          >
            <span className="label flex items-baseline gap-2">
              {m.goals.endedSection}
              <span className="fig text-[12px] leading-none text-[var(--ink-3)]">
                {ended.length}
              </span>
            </span>
            <ChevronDown
              size={14}
              strokeWidth={1.8}
              className={`text-[var(--ink-3)] transition-transform duration-200 ${
                endedOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          <div
            id="ended-goals"
            className={endedOpen ? 'fade-enter' : 'hidden'}
          >
            <ul className="ledger">
              {ended.map((goal) => (
                <GoalRow
                  key={goal.id}
                  goal={goal}
                  todayKey={todayKey}
                  onOpen={onOpen}
                />
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  )
}
