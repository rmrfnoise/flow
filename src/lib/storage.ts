import { useEffect, useState } from 'react'

export function usePersistentState<T>(
  key: string,
  initialValue: T | (() => T),
  validate?: (value: unknown) => value is T,
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key)
      if (stored) {
        const parsed: unknown = JSON.parse(stored)
        if (!validate || validate(parsed)) return parsed as T
      }
    } catch {
      // Fall through to the initializer when storage is unavailable or invalid.
    }

    return typeof initialValue === 'function'
      ? (initialValue as () => T)()
      : initialValue
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage can be unavailable in private browsing; the app still works in memory.
    }
  }, [key, value])

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key !== key || event.newValue === null) return
      try {
        const parsed: unknown = JSON.parse(event.newValue)
        if (!validate || validate(parsed)) setValue(parsed as T)
      } catch {
        // Ignore malformed values written by another tab.
      }
    }

    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [key, validate])

  return [value, setValue] as const
}

export function makeId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
