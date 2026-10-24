import { getMessages, type Locale } from '../i18n/messages'
import type { DueStatus } from '../types'

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export type DueBucket = 'overdue' | 'today' | 'tomorrow' | 'later' | 'none'

const formatterCache = new Map<string, Intl.DateTimeFormat>()

function dtf(locale: Locale, options: Intl.DateTimeFormatOptions) {
  const tag = locale === 'zh' ? 'zh-CN' : 'en-US'
  const key = `${tag}|${JSON.stringify(options)}`
  let formatter = formatterCache.get(key)
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(tag, options)
    formatterCache.set(key, formatter)
  }
  return formatter
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
}

export function formatHeaderDate(date = new Date(), locale: Locale = 'en') {
  if (locale === 'zh') {
    const monthDay = dtf('zh', {
      month: 'long',
      day: 'numeric',
    }).format(date)
    const weekday = dtf('zh', { weekday: 'short' }).format(date)
    return `${monthDay} ${weekday}`
  }

  return dtf('en', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function getActiveDueBucket(
  dueAt: number | null,
  hasTime: boolean,
  now = Date.now(),
): DueBucket {
  if (dueAt === null) return 'none'

  const dueDay = startOfDay(new Date(dueAt))
  const today = startOfDay(new Date(now))
  const tomorrow = startOfDay(addDays(new Date(now), 1))

  if (hasTime && dueAt < now) return 'overdue'
  if (dueDay < today) return 'overdue'
  if (dueDay === today) return 'today'
  if (dueDay === tomorrow) return 'tomorrow'
  return 'later'
}

function formatTime(timestamp: number, locale: Locale) {
  return dtf(locale, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: locale === 'en',
  }).format(new Date(timestamp))
}

function dayLabel(timestamp: number, now: number, locale: Locale) {
  const date = new Date(timestamp)
  const today = new Date(now)
  const dayDelta = Math.round((startOfDay(date) - startOfDay(today)) / DAY)
  const m = getMessages(locale)

  if (dayDelta === 0) return m.date.today
  if (dayDelta === 1) return m.date.tomorrow
  if (dayDelta === -1) return m.date.yesterday
  if (dayDelta === 2) return m.date.dayAfterTomorrow

  if (date.getFullYear() === today.getFullYear()) {
    if (locale === 'zh') {
      const monthDay = dtf('zh', {
        month: 'long',
        day: 'numeric',
      }).format(date)
      const weekday = dtf('zh', { weekday: 'short' }).format(date)
      return `${monthDay} ${weekday}`
    }

    const monthDay = dtf('en', {
      month: 'short',
      day: 'numeric',
    }).format(date)
    const weekday = dtf('en', { weekday: 'short' }).format(date)
    return `${monthDay}, ${weekday}`
  }

  if (locale === 'zh') {
    return dtf('zh', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  return dtf('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

export function formatDueDate(
  timestamp: number,
  hasTime: boolean,
  now = Date.now(),
  locale: Locale = 'en',
) {
  const label = dayLabel(timestamp, now, locale)
  if (!hasTime) return label
  return `${label} ${formatTime(timestamp, locale)}`
}

export function formatDeadlineLong(
  timestamp: number,
  hasTime: boolean,
  locale: Locale = 'en',
) {
  const date = new Date(timestamp)
  const dateText = dtf(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
  const m = getMessages(locale)

  if (!hasTime) {
    return dateText
  }

  return m.date.deadlineTimed(dateText, formatTime(timestamp, locale))
}

export function getDueStatus(
  dueAt: number,
  hasTime: boolean,
  completed: boolean,
  now = Date.now(),
): DueStatus {
  if (completed) return 'normal'

  if (hasTime) {
    if (dueAt <= now) return 'overdue'
    if (dueAt - now <= DAY) return 'urgent'
    return 'normal'
  }

  const dueDay = startOfDay(new Date(dueAt))
  const today = startOfDay(new Date(now))
  if (dueDay < today) return 'overdue'
  if (dueDay === today) return 'urgent'
  return 'normal'
}

function durationText(ms: number, locale: Locale) {
  const units = getMessages(locale).units

  if (ms < MINUTE) return units.lessThanMinute
  if (ms < HOUR) return units.minutes(Math.max(1, Math.ceil(ms / MINUTE)))
  if (ms < DAY) return units.hours(Math.max(1, Math.floor(ms / HOUR)))
  if (ms < 30 * DAY) return units.days(Math.max(1, Math.floor(ms / DAY)))
  if (ms < 365 * DAY) {
    return units.months(Math.max(1, Math.floor(ms / (30 * DAY))))
  }
  return units.years(Math.max(1, Math.floor(ms / (365 * DAY))))
}

export function formatCountdown(
  timestamp: number,
  hasTime: boolean,
  now = Date.now(),
  locale: Locale = 'en',
) {
  const m = getMessages(locale)

  if (hasTime) {
    if (timestamp <= now) {
      return m.date.overdueDuration(durationText(now - timestamp, locale))
    }
    return m.date.inDuration(durationText(timestamp - now, locale))
  }

  const dueDay = startOfDay(new Date(timestamp))
  const today = startOfDay(new Date(now))
  const dayDelta = Math.round((dueDay - today) / DAY)

  if (dayDelta < 0) return m.date.overdueDays(Math.abs(dayDelta))
  if (dayDelta === 0) return m.date.dueToday
  if (dayDelta === 1) return m.date.dueTomorrow
  return m.date.inDays(dayDelta)
}

export function dateStringToEndOfDay(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/u.exec(value)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(year, month - 1, day, 23, 59, 59, 999)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null
  }
  return date.getTime()
}

export function fromDateTimeLocal(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/u.exec(value)
  if (!match) return null
  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const hour = Number(match[4])
  const minute = Number(match[5])
  const date = new Date(year, month - 1, day, hour, minute)
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day ||
    date.getHours() !== hour ||
    date.getMinutes() !== minute
  ) {
    return null
  }
  return date.getTime()
}

export function timestampToDateInput(timestamp: number | null) {
  if (timestamp === null) return ''
  const date = new Date(timestamp)
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function toDateInputValue(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function toTimeInputValue(timestamp: number | null) {
  if (timestamp === null) return '09:00'
  const date = new Date(timestamp)
  return `${String(date.getHours()).padStart(2, '0')}:${String(
    date.getMinutes(),
  ).padStart(2, '0')}`
}
