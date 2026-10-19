export interface Todo {
  id: string
  text: string
  tags: string[]
  createdAt: number
  dueAt: number | null
  dueHasTime: boolean
  completedAt: number | null
}

export type DueStatus = 'normal' | 'urgent' | 'overdue'

export type DeadlineMode = 'none' | 'date' | 'datetime'

export interface NewTodoInput {
  text: string
  tags: string[]
  dueAt: number | null
  dueHasTime: boolean
}
