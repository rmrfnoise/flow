import type { Todo } from '../types'

export const TODOS_STORAGE_KEY = 'flow.todos.v1'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isTimestamp(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

export function isTodoArray(value: unknown): value is Todo[] {
  return (
    Array.isArray(value) &&
    value.every((item) => {
      if (!isRecord(item)) return false
      return (
        typeof item.id === 'string' &&
        item.id.trim().length > 0 &&
        typeof item.text === 'string' &&
        item.text.trim().length > 0 &&
        Array.isArray(item.tags) &&
        item.tags.every(
          (tag) => typeof tag === 'string' && tag.trim().length > 0,
        ) &&
        item.tags.length <= 12 &&
        isTimestamp(item.createdAt) &&
        (item.dueAt === null || isTimestamp(item.dueAt)) &&
        typeof item.dueHasTime === 'boolean' &&
        (item.dueAt !== null || item.dueHasTime === false) &&
        (item.completedAt === null || isTimestamp(item.completedAt))
      )
    })
  )
}
