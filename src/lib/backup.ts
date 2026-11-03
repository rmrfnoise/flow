import {
  BALANCE_STORAGE_KEY,
  EXPENSES_STORAGE_KEY,
  CUSTOM_CATEGORIES_STORAGE_KEY,
  isBalanceState,
  isCustomCategoryArray,
  isExpenseArray,
} from './expenses'
import {
  HABITS_STORAGE_KEY,
  HABIT_CHECKINS_STORAGE_KEY,
  isHabitArray,
  isHabitCheckins,
} from './habits'
import { TODOS_STORAGE_KEY, isTodoArray } from './todos'
import { LOCALE_STORAGE_KEY } from '../i18n/messages'
import { APPEARANCE_STORAGE_KEY } from '../hooks/useAppearance'

export const BACKUP_VERSION = 3
export const BACKUP_MAX_BYTES = 5 * 1024 * 1024

const DATA_KEYS = [
  TODOS_STORAGE_KEY,
  HABITS_STORAGE_KEY,
  HABIT_CHECKINS_STORAGE_KEY,
  EXPENSES_STORAGE_KEY,
  CUSTOM_CATEGORIES_STORAGE_KEY,
  BALANCE_STORAGE_KEY,
] as const

const ALL_KEYS = [
  ...DATA_KEYS,
  LOCALE_STORAGE_KEY,
  APPEARANCE_STORAGE_KEY,
] as const

export interface BackupSummary {
  tasks: number
  habits: number
  expenses: number
  categories: number
}

export interface FlowBackup {
  app: 'flow'
  version: number
  exportedAt: string
  data: Record<string, string>
}

export type BackupParseResult =
  | { ok: true; backup: FlowBackup; summary: BackupSummary }
  | { ok: false; reason: 'invalid' | 'empty' | 'unsupported' }

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function createBackup(): FlowBackup {
  const data: Record<string, string> = {}
  for (const key of ALL_KEYS) {
    const value = window.localStorage.getItem(key)
    if (value !== null) data[key] = value
  }
  return {
    app: 'flow',
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data,
  }
}

export function serializeBackup(backup: FlowBackup) {
  return JSON.stringify(backup, null, 2)
}

export function backupFileName() {
  const date = new Date().toISOString().slice(0, 10)
  return `flow-backup-${date}.json`
}

export function downloadTextFile(text: string, fileName: string) {
  const blob = new Blob([text], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function copyText(text: string) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Fall through to the selection-based copy path.
  }

  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    textarea.style.pointerEvents = 'none'
    document.body.appendChild(textarea)
    try {
      textarea.focus()
      textarea.select()
      textarea.setSelectionRange(0, text.length)
      return document.execCommand('copy')
    } finally {
      textarea.remove()
    }
  } catch {
    return false
  }
}

export function parseBackup(text: string): BackupParseResult {
  if (text.length > BACKUP_MAX_BYTES) {
    return { ok: false, reason: 'invalid' }
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    return { ok: false, reason: 'invalid' }
  }

  if (
    !isRecord(parsed) ||
    parsed.app !== 'flow' ||
    typeof parsed.version !== 'number' ||
    typeof parsed.exportedAt !== 'string' ||
    !isRecord(parsed.data)
  ) {
    return { ok: false, reason: 'invalid' }
  }
  if (parsed.version > BACKUP_VERSION) {
    return { ok: false, reason: 'unsupported' }
  }

  const data: Record<string, string> = {}
  for (const key of ALL_KEYS) {
    const value = parsed.data[key]
    if (typeof value === 'string') data[key] = value
  }

  const summary: BackupSummary = {
    tasks: 0,
    habits: 0,
    expenses: 0,
    categories: 0,
  }

  const decode = (key: string) => {
    const raw = data[key]
    if (raw === undefined) return undefined
    try {
      return JSON.parse(raw) as unknown
    } catch {
      return null
    }
  }

  const tasks = decode(TODOS_STORAGE_KEY)
  if (tasks !== undefined && !isTodoArray(tasks)) {
    return { ok: false, reason: 'invalid' }
  }
  if (tasks) summary.tasks = tasks.length

  const habits = decode(HABITS_STORAGE_KEY)
  if (habits !== undefined && !isHabitArray(habits)) {
    return { ok: false, reason: 'invalid' }
  }
  if (habits) summary.habits = habits.length

  const checkins = decode(HABIT_CHECKINS_STORAGE_KEY)
  if (checkins !== undefined && !isHabitCheckins(checkins)) {
    return { ok: false, reason: 'invalid' }
  }

  const expenses = decode(EXPENSES_STORAGE_KEY)
  if (expenses !== undefined && !isExpenseArray(expenses)) {
    return { ok: false, reason: 'invalid' }
  }
  if (expenses) summary.expenses = expenses.length

  const categories = decode(CUSTOM_CATEGORIES_STORAGE_KEY)
  if (categories !== undefined && !isCustomCategoryArray(categories)) {
    return { ok: false, reason: 'invalid' }
  }
  if (categories) summary.categories = categories.length

  const balance = decode(BALANCE_STORAGE_KEY)
  if (balance !== undefined && !isBalanceState(balance)) {
    return { ok: false, reason: 'invalid' }
  }

  if (
    data[LOCALE_STORAGE_KEY] !== undefined &&
    data[LOCALE_STORAGE_KEY] !== 'en' &&
    data[LOCALE_STORAGE_KEY] !== 'zh'
  ) {
    return { ok: false, reason: 'invalid' }
  }

  if (
    data[APPEARANCE_STORAGE_KEY] !== undefined &&
    data[APPEARANCE_STORAGE_KEY] !== 'system' &&
    data[APPEARANCE_STORAGE_KEY] !== 'light' &&
    data[APPEARANCE_STORAGE_KEY] !== 'dark'
  ) {
    return { ok: false, reason: 'invalid' }
  }

  if (Object.keys(data).length === 0) {
    return { ok: false, reason: 'empty' }
  }

  return {
    ok: true,
    backup: {
      app: 'flow',
      version: parsed.version,
      exportedAt: parsed.exportedAt,
      data,
    },
    summary,
  }
}

export function applyBackup(backup: FlowBackup) {
  for (const key of ALL_KEYS) {
    const value = backup.data[key]
    if (value === undefined) {
      window.localStorage.removeItem(key)
    } else {
      window.localStorage.setItem(key, value)
    }
  }
}

export function clearAllData() {
  for (const key of ALL_KEYS) {
    window.localStorage.removeItem(key)
  }
}
