import type { DueStatus } from '../types'

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const WEEKDAYS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
const WEEKDAY_SHORT = ['日', '一', '二', '三', '四', '五', '六']
const WEEKDAYS_LONG = [
  '星期日',
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
]

function pad(value: number) {
  return String(value).padStart(2, '0')
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

export function formatHeaderDate(date = new Date()) {
  return {
    date: `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`,
    weekdayShort: WEEKDAY_SHORT[date.getDay()],
  }
}

function formatTime(timestamp: number) {
  const date = new Date(timestamp)
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function dayLabel(timestamp: number, now: number) {
  const date = new Date(timestamp)
  const today = new Date(now)
  const dayDelta = Math.round((startOfDay(date) - startOfDay(today)) / DAY)

  if (dayDelta === 0) return '今天'
  if (dayDelta === 1) return '明天'
  if (dayDelta === -1) return '昨天'
  if (dayDelta === 2) return '后天'

  if (date.getFullYear() === today.getFullYear()) {
    return `${date.getMonth() + 1}月${date.getDate()}日 ${WEEKDAYS[date.getDay()]}`
  }

  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
}

export function formatDueDate(
  timestamp: number,
  hasTime: boolean,
  now = Date.now(),
) {
  const label = dayLabel(timestamp, now)
  return hasTime ? `${label} ${formatTime(timestamp)}` : `${label} · 全天`
}

export function formatDeadlineLong(timestamp: number, hasTime: boolean) {
  const date = new Date(timestamp)
  const dateText = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${WEEKDAYS_LONG[date.getDay()]}`
  return hasTime
    ? `${dateText} ${formatTime(timestamp)}`
    : `${dateText}（全天，当天 23:59 截止）`
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

function durationText(ms: number) {
  if (ms < MINUTE) return '不到 1 分钟'
  if (ms < HOUR) return `${Math.max(1, Math.ceil(ms / MINUTE))} 分钟`
  if (ms < DAY) return `${Math.max(1, Math.floor(ms / HOUR))} 小时`
  if (ms < 30 * DAY) return `${Math.max(1, Math.floor(ms / DAY))} 天`
  if (ms < 365 * DAY) return `${Math.max(1, Math.floor(ms / (30 * DAY)))} 个月`
  return `${Math.max(1, Math.floor(ms / (365 * DAY)))} 年`
}

export function formatCountdown(
  timestamp: number,
  hasTime: boolean,
  now = Date.now(),
) {
  if (hasTime) {
    if (timestamp <= now) {
      return `已超时 ${durationText(now - timestamp)}`
    }
    return `还有 ${durationText(timestamp - now)}`
  }

  const dueDay = startOfDay(new Date(timestamp))
  const today = startOfDay(new Date(now))
  const dayDelta = Math.round((dueDay - today) / DAY)

  if (dayDelta < 0) {
    return `已超时 ${Math.abs(dayDelta)} 天`
  }
  if (dayDelta === 0) return '今天截止'
  if (dayDelta === 1) return '明天截止'
  return `还有 ${dayDelta} 天`
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
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}
