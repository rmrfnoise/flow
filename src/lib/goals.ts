import { daysBetween, isDateKey, toDateKey } from './date'

/**
 * A goal is a dated finish line with a handful of nodes on the way to it.
 * Dates are calendar days ("YYYY-MM-DD"), like habits and expenses; only the
 * moments that cannot be a day — when a node was lit, when the goal ended —
 * are timestamps.
 */

export type GoalOutcome = 'achieved' | 'abandoned' | 'archived'

export interface GoalNode {
  id: string
  title: string
  litAt: number | null
  createdAt: number
}

export interface Goal {
  id: string
  title: string
  startDate: string
  endDate: string
  nodes: GoalNode[]
  outcome: GoalOutcome | null
  endedAt: number | null
  createdAt: number
  updatedAt: number
}

export interface NewGoalInput {
  title: string
  startDate: string
  endDate: string
  nodes: GoalNode[]
}

export type GoalVerdict =
  | 'not-started'
  | 'no-nodes'
  | 'overdue'
  | 'ahead'
  | 'on-track'
  | 'behind'

export type GoalPace =
  | { kind: 'none' }
  | { kind: 'per-day'; count: number }
  | { kind: 'every-days'; days: number }
  | { kind: 'every-weeks'; weeks: number }
  | { kind: 'every-months'; months: number }

export const GOALS_STORAGE_KEY = 'flow.goals.v1'
export const GOAL_TITLE_MAX = 40
export const GOAL_NODE_TITLE_MAX = 40
export const GOAL_NODE_LIMIT = 999

/**
 * A goal counts as on track while the gap between node progress and time
 * progress stays inside ten percentage points. Node counts and goal lengths
 * differ too much for "one node" to be a stable unit.
 */
export const VERDICT_THRESHOLD = 0.1

export function isGoalEnded(goal: Goal) {
  return goal.outcome !== null
}

export function getLitNodeCount(goal: Goal) {
  return goal.nodes.filter((node) => node.litAt !== null).length
}

export function getGoalProgress(goal: Goal): number | null {
  if (goal.nodes.length === 0) return null
  return getLitNodeCount(goal) / goal.nodes.length
}

export function getTimeProgress(goal: Goal, todayKey: string) {
  const total = daysBetween(goal.startDate, goal.endDate)
  if (total <= 0) return 1
  const elapsed = daysBetween(goal.startDate, todayKey)
  return Math.min(1, Math.max(0, elapsed / total))
}

export function getGoalDelta(goal: Goal, todayKey: string) {
  const progress = getGoalProgress(goal)
  if (progress === null) return null
  return Math.round(
    (progress - getTimeProgress(goal, todayKey)) * 100,
  )
}

export function getDaysRemaining(goal: Goal, todayKey: string) {
  return daysBetween(todayKey, goal.endDate)
}

/**
 * The cadence needed to finish on time: how many nodes per day, or how many
 * days one node may take. Deliberately based on the calendar, not on a
 * measured velocity — goal work arrives in bursts, so a projected date from
 * recent speed reads as false precision.
 */
export function getGoalPace(goal: Goal, todayKey: string): GoalPace {
  const remainingNodes =
    goal.nodes.length - getLitNodeCount(goal)
  const remainingDays = daysBetween(todayKey, goal.endDate)
  if (remainingNodes <= 0 || remainingDays <= 0) {
    return { kind: 'none' }
  }

  const perDay = remainingNodes / remainingDays
  if (perDay >= 0.75) {
    return { kind: 'per-day', count: Math.max(1, Math.ceil(perDay)) }
  }

  const daysPerNode = remainingDays / remainingNodes
  if (daysPerNode < 14) {
    return {
      kind: 'every-days',
      days: Math.max(2, Math.round(daysPerNode)),
    }
  }
  if (daysPerNode < 45) {
    return {
      kind: 'every-weeks',
      weeks: Math.max(2, Math.round(daysPerNode / 7)),
    }
  }
  return {
    kind: 'every-months',
    months: Math.max(2, Math.round(daysPerNode / 30)),
  }
}

export function getGoalVerdict(
  goal: Goal,
  todayKey: string,
): GoalVerdict {
  if (todayKey < goal.startDate) return 'not-started'
  if (todayKey > goal.endDate) return 'overdue'
  if (goal.nodes.length === 0) return 'no-nodes'

  const progress = getGoalProgress(goal)
  if (progress === null) return 'no-nodes'

  const delta = progress - getTimeProgress(goal, todayKey)
  if (delta > VERDICT_THRESHOLD) return 'ahead'
  if (delta < -VERDICT_THRESHOLD) return 'behind'
  return 'on-track'
}

/** Days between the end date and the day the goal was closed. */
export function getOutcomeOffset(goal: Goal): number | null {
  if (goal.endedAt === null) return null
  return daysBetween(goal.endDate, toDateKey(new Date(goal.endedAt)))
}

export function sortGoals(goals: Goal[]) {
  return [...goals].sort((a, b) => {
    const aEnded = isGoalEnded(a)
    const bEnded = isGoalEnded(b)
    if (aEnded !== bEnded) return aEnded ? 1 : -1
    if (aEnded && bEnded) {
      return (b.endedAt ?? 0) - (a.endedAt ?? 0)
    }
    if (a.endDate !== b.endDate) {
      return a.endDate < b.endDate ? -1 : 1
    }
    return a.createdAt - b.createdAt
  })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isTimestamp(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isGoalOutcome(value: unknown): value is GoalOutcome {
  return (
    value === 'achieved' ||
    value === 'abandoned' ||
    value === 'archived'
  )
}

function isGoalNode(value: unknown): value is GoalNode {
  if (!isRecord(value)) return false
  if (typeof value.id !== 'string' || value.id.trim().length === 0) {
    return false
  }
  if (typeof value.title !== 'string') return false
  const title = value.title.trim()
  if (title.length === 0 || title.length > GOAL_NODE_TITLE_MAX) {
    return false
  }
  if (value.litAt !== null && !isTimestamp(value.litAt)) return false
  return isTimestamp(value.createdAt)
}

export function isGoal(value: unknown): value is Goal {
  if (!isRecord(value)) return false
  if (typeof value.id !== 'string' || value.id.trim().length === 0) {
    return false
  }
  if (typeof value.title !== 'string') return false
  const title = value.title.trim()
  if (title.length === 0 || title.length > GOAL_TITLE_MAX) return false
  if (typeof value.startDate !== 'string' || !isDateKey(value.startDate)) {
    return false
  }
  if (typeof value.endDate !== 'string' || !isDateKey(value.endDate)) {
    return false
  }
  if (value.endDate <= value.startDate) return false
  if (
    !Array.isArray(value.nodes) ||
    value.nodes.length > GOAL_NODE_LIMIT ||
    !value.nodes.every(isGoalNode)
  ) {
    return false
  }
  const nodeIds = new Set(value.nodes.map((node) => node.id))
  if (nodeIds.size !== value.nodes.length) return false
  if (value.outcome !== null && !isGoalOutcome(value.outcome)) return false
  if (value.endedAt !== null && !isTimestamp(value.endedAt)) return false
  // An outcome and an end time only exist together.
  if ((value.outcome === null) !== (value.endedAt === null)) return false
  return isTimestamp(value.createdAt) && isTimestamp(value.updatedAt)
}

export function isGoalArray(value: unknown): value is Goal[] {
  return Array.isArray(value) && value.every(isGoal)
}
