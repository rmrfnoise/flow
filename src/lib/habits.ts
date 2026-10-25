import type { Locale } from '../i18n/messages'

export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7

export type HabitSchedule =
  | { type: 'daily' }
  | { type: 'weekly'; weekdays: Weekday[] }

export const HABIT_ICON_IDS = [
  'spark',
  'fire',
  'star',
  'heart',
  'bolt',
  'plant',
  'sun',
  'moon',
  'drop',
  'target',
  'run',
  'bike',
  'yoga',
  'strength',
  'workout',
  'walk',
  'sleep',
  'tooth',
  'noSmoke',
  'book',
  'write',
  'brain',
  'code',
  'art',
  'music',
  'language',
  'journal',
  'cook',
  'clean',
  'pet',
  'money',
  'home',
  'social',
  'party',
  'coffee',
  'food',
  'heartPulse',
  'graduationCap',
  'lightbulb',
  'puzzle',
  'calculator',
  'camera',
  'film',
  'brush',
  'scissors',
  'mic',
  'headphones',
  'palette',
  'penTool',
  'utensils',
  'basket',
  'piggyBank',
  'users',
  'message',
  'phone',
  'gift',
  'cake',
  'smile',
  'heartHandshake',
  'leaf',
  'flower',
  'tree',
  'mountain',
  'cloudSun',
  'waves',
  'flag',
  'trophy',
  'medal',
  'rocket',
  'compass',
  'clock',
  'alarm',
  'calendar',
  'smartphone',
  'laptop',
  'terminal',
  'gamepad',
  'wifi',
  'battery',
  'monitor',
] as const

export type HabitIcon = (typeof HABIT_ICON_IDS)[number]

export function isHabitIcon(value: unknown): value is HabitIcon {
  return (
    typeof value === 'string' &&
    (HABIT_ICON_IDS as readonly string[]).includes(value)
  )
}

export interface Habit {
  id: string
  name: string
  schedule: HabitSchedule
  startDate: string
  createdAt: number
  updatedAt: number
  checkInIcon?: HabitIcon
}

export type HabitCheckins = Record<string, string[]>

export type HabitDayState =
  | 'checked'
  | 'available'
  | 'rest'
  | 'future'
  | 'before-start'
  | 'out-of-window'

export const HABITS_STORAGE_KEY = 'flow.habits.v1'
export const HABIT_CHECKINS_STORAGE_KEY = 'flow.habitCheckins.v1'
export const MAKEUP_WINDOW_DAYS = 30

const MS_PER_DAY = 86_400_000

function pad(value: number) {
  return String(value).padStart(2, '0')
}

export function toDateKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`
}

export function parseDateKey(key: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(key)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day, 12)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }
  return date
}

export function isDateKey(key: string) {
  return parseDateKey(key) !== null
}

export function addDaysKey(key: string, days: number) {
  const date = parseDateKey(key)
  if (!date) return key
  date.setDate(date.getDate() + days)
  return toDateKey(date)
}

export function weekdayOfKey(key: string): Weekday {
  const date = parseDateKey(key) ?? new Date()
  const day = date.getDay()
  return (day === 0 ? 7 : day) as Weekday
}

export function startOfWeekKey(key: string) {
  return addDaysKey(key, -(weekdayOfKey(key) - 1))
}

export function endOfWeekKey(key: string) {
  return addDaysKey(startOfWeekKey(key), 6)
}

export function startOfMonthKey(key: string) {
  return `${key.slice(0, 7)}-01`
}

export function endOfMonthKey(key: string) {
  const date = parseDateKey(key)
  if (!date) return key
  return toDateKey(new Date(date.getFullYear(), date.getMonth() + 1, 0, 12))
}

export function shiftMonthKey(key: string, delta: number) {
  const [year, month] = key.split('-').map(Number)
  if (!year || !month) return key.slice(0, 7)
  const next = new Date(year, month - 1 + delta, 1, 12)
  return `${next.getFullYear()}-${pad(next.getMonth() + 1)}`
}

export function monthDates(monthKey: string) {
  const start = startOfMonthKey(`${monthKey}-01`)
  const total = Number(endOfMonthKey(start).slice(8, 10))
  return Array.from({ length: total }, (_, index) =>
    addDaysKey(start, index),
  )
}

export function getWeekdayLabels(locale: Locale) {
  const tag = locale === 'zh' ? 'zh-CN' : 'en-US'
  const formatter = new Intl.DateTimeFormat(tag, { weekday: 'short' })
  const monday = new Date(2024, 0, 1, 12)
  return Array.from({ length: 7 }, (_, index) =>
    formatter.format(
      new Date(
        monday.getFullYear(),
        monday.getMonth(),
        monday.getDate() + index,
        12,
      ),
    ),
  )
}

export function formatWeekdays(
  weekdays: Weekday[],
  locale: Locale,
) {
  const labels = getWeekdayLabels(locale)
  const sorted = [...new Set(weekdays)].sort((a, b) => a - b)
  return sorted
    .map((day) => labels[day - 1])
    .join(locale === 'zh' ? '、' : ', ')
}

export function formatHabitSchedule(
  habit: Habit,
  locale: Locale,
  everyDayLabel: string,
) {
  return habit.schedule.type === 'daily'
    ? everyDayLabel
    : formatWeekdays(habit.schedule.weekdays, locale)
}

export function formatMonthDay(key: string, locale: Locale) {
  const date = parseDateKey(key)
  if (!date) return key
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    month: locale === 'zh' ? 'long' : 'short',
    day: 'numeric',
  }).format(date)
}

export function formatMonthLabel(monthKey: string, locale: Locale) {
  const date = parseDateKey(`${monthKey}-01`)
  if (!date) return monthKey
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'long',
  }).format(date)
}

export function formatWeekRange(startKey: string, locale: Locale) {
  const endKey = addDaysKey(startKey, 6)
  return `${formatMonthDay(startKey, locale)} – ${formatMonthDay(
    endKey,
    locale,
  )}`
}

export function formatFullDate(key: string, locale: Locale) {
  const date = parseDateKey(key)
  if (!date) return key
  return new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function isScheduled(habit: Habit, dateKey: string) {
  if (habit.schedule.type === 'daily') return true
  return habit.schedule.weekdays.includes(weekdayOfKey(dateKey))
}

export function isChecked(
  checkins: HabitCheckins,
  habitId: string,
  dateKey: string,
) {
  return (checkins[habitId] ?? []).includes(dateKey)
}

export function getHabitDayState(
  habit: Habit,
  dateKey: string,
  checked: boolean,
  todayKey: string,
): HabitDayState {
  if (dateKey < habit.startDate) return 'before-start'
  if (dateKey > todayKey) return 'future'
  if (checked) return 'checked'
  if (!isScheduled(habit, dateKey)) return 'rest'

  const earliestMakeup = addDaysKey(
    todayKey,
    -(MAKEUP_WINDOW_DAYS - 1),
  )
  if (dateKey >= earliestMakeup) return 'available'
  return 'out-of-window'
}

export function currentStreak(
  habit: Habit,
  dates: string[] | Set<string>,
  todayKey: string,
) {
  const checked = dates instanceof Set ? dates : new Set(dates)
  let count = 0
  let cursor = todayKey

  if (isScheduled(habit, todayKey) && !checked.has(todayKey)) {
    cursor = addDaysKey(todayKey, -1)
  }

  while (cursor >= habit.startDate) {
    if (!isScheduled(habit, cursor)) {
      cursor = addDaysKey(cursor, -1)
      continue
    }
    if (checked.has(cursor)) {
      count += 1
      cursor = addDaysKey(cursor, -1)
      continue
    }
    break
  }

  return count
}

export function countPlanned(
  habit: Habit,
  fromKey: string,
  toKey: string,
) {
  if (fromKey > toKey) return 0
  let cursor = fromKey < habit.startDate ? habit.startDate : fromKey
  let count = 0
  while (cursor <= toKey) {
    if (isScheduled(habit, cursor)) count += 1
    cursor = addDaysKey(cursor, 1)
  }
  return count
}

export function countChecked(
  habit: Habit,
  dates: string[] | Set<string>,
  fromKey: string,
  toKey: string,
) {
  if (fromKey > toKey) return 0
  const checked = dates instanceof Set ? dates : new Set(dates)
  let cursor = fromKey < habit.startDate ? habit.startDate : fromKey
  let count = 0
  while (cursor <= toKey) {
    if (isScheduled(habit, cursor) && checked.has(cursor)) count += 1
    cursor = addDaysKey(cursor, 1)
  }
  return count
}

export function daysBetween(fromKey: string, toKey: string) {
  const from = parseDateKey(fromKey)
  const to = parseDateKey(toKey)
  if (!from || !to) return 0
  return Math.round((to.getTime() - from.getTime()) / MS_PER_DAY)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isTimestamp(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isWeekday(value: unknown): value is Weekday {
  return (
    typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 7
  )
}

function isSchedule(value: unknown): value is HabitSchedule {
  if (!isRecord(value)) return false
  if (value.type === 'daily') return true
  if (value.type !== 'weekly') return false
  if (!Array.isArray(value.weekdays)) return false
  const unique = new Set(value.weekdays)
  return (
    value.weekdays.length > 0 &&
    unique.size === value.weekdays.length &&
    value.weekdays.every(isWeekday)
  )
}

export function isHabitArray(value: unknown): value is Habit[] {
  return (
    Array.isArray(value) &&
    value.every((item) => {
      if (!isRecord(item)) return false
      return (
        typeof item.id === 'string' &&
        item.id.trim().length > 0 &&
        typeof item.name === 'string' &&
        item.name.trim().length > 0 &&
        item.name.trim().length <= 40 &&
        isSchedule(item.schedule) &&
        typeof item.startDate === 'string' &&
        isDateKey(item.startDate) &&
        isTimestamp(item.createdAt) &&
        isTimestamp(item.updatedAt) &&
        (item.checkInIcon === undefined ||
          isHabitIcon(item.checkInIcon))
      )
    })
  )
}

export function isHabitCheckins(value: unknown): value is HabitCheckins {
  if (!isRecord(value)) return false
  return Object.values(value).every(
    (dates) =>
      Array.isArray(dates) &&
      dates.every((date) => typeof date === 'string' && isDateKey(date)),
  )
}

export function getHabitDates(checkins: HabitCheckins, habitId: string) {
  return checkins[habitId] ?? []
}
