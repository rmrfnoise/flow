import { useI18n } from '../i18n/I18nProvider'
import { toDateKey } from '../lib/date'
import {
  getDaysRemaining,
  getGoalVerdict,
  getLitNodeCount,
  isGoalEnded,
  type Goal,
} from '../lib/goals'
import { formatMonthDay } from '../lib/habits'

interface GoalRowProps {
  goal: Goal
  todayKey: string
  onOpen: (id: string) => void
}

export default function GoalRow({
  goal,
  todayKey,
  onOpen,
}: GoalRowProps) {
  const { locale, m } = useI18n()
  const ended = isGoalEnded(goal)
  const lit = getLitNodeCount(goal)
  const total = goal.nodes.length
  const verdict = ended ? null : getGoalVerdict(goal, todayKey)
  const daysLeft = getDaysRemaining(goal, todayKey)
  const overdue = verdict === 'overdue'

  const endedDate =
    goal.endedAt === null
      ? ''
      : formatMonthDay(toDateKey(new Date(goal.endedAt)), locale)

  const outcomeText =
    goal.outcome === 'achieved'
      ? m.goals.achievedOn(endedDate)
      : goal.outcome === 'abandoned'
        ? m.goals.abandonedOn(endedDate)
        : goal.outcome === 'archived'
          ? m.goals.archivedOn(endedDate)
          : ''

  const countdown =
    daysLeft > 0
      ? m.goals.daysLeft(daysLeft)
      : daysLeft === 0
        ? m.goals.dueToday
        : m.goals.overdueDays(-daysLeft)

  return (
    <li>
      <div
        role="button"
        tabIndex={0}
        aria-label={m.goals.openGoal(goal.title)}
        onClick={() => onOpen(goal.id)}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onOpen(goal.id)
          }
        }}
        className="flex cursor-pointer items-start gap-3 py-3.5 transition-colors hover:bg-[var(--sunken)] active:bg-[var(--sunken)]"
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] leading-[1.4] text-[var(--ink)]">
            {goal.title}
          </p>
          <p className="mt-1 flex min-w-0 flex-wrap items-center gap-x-1.5 text-[11.5px] leading-[1.3] text-[var(--ink-3)]">
            {ended ? (
              <span className="fig text-[11px]">{outcomeText}</span>
            ) : (
              <>
                <span className="fig text-[11px]">
                  {m.goals.deadline(
                    formatMonthDay(goal.endDate, locale),
                  )}
                </span>
                <span aria-hidden="true">·</span>
                <span className={overdue ? 'text-[var(--red)]' : ''}>
                  {countdown}
                </span>
                {verdict === 'behind' && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-[var(--red)]">
                      {m.goals.verdict.behind}
                    </span>
                  </>
                )}
              </>
            )}
          </p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1.5 pt-0.5">
          <span className="fig text-[13px] leading-none text-[var(--ink)]">
            {total > 0 ? `${lit}/${total}` : '—'}
          </span>
          {total > 0 && total <= 12 && (
            <span
              aria-hidden="true"
              className="flex h-3.5 items-end gap-[3px]"
            >
              {goal.nodes.map((node) => (
                <span
                  key={node.id}
                  className={`h-3.5 w-[3px] ${
                    node.litAt !== null
                      ? 'bg-[var(--ink)]'
                      : 'bg-[var(--rule-strong)]'
                  }`}
                />
              ))}
            </span>
          )}
        </div>
      </div>
    </li>
  )
}
