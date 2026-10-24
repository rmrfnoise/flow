import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react'

type LoadResult = 'valid' | 'missing' | 'invalid' | 'error' | 'user'

export function usePersistentState<T>(
  key: string,
  initialValue: T | (() => T),
  validate?: (value: unknown) => value is T,
) {
  const loadResultRef = useRef<LoadResult>('missing')

  const [value, setValueState] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key)
      if (stored !== null) {
        const parsed: unknown = JSON.parse(stored)
        if (!validate || validate(parsed)) {
          loadResultRef.current = 'valid'
          return parsed as T
        }
        loadResultRef.current = 'invalid'
      }
    } catch {
      loadResultRef.current = 'error'
    }

    return typeof initialValue === 'function'
      ? (initialValue as () => T)()
      : initialValue
  })

  const setValue: Dispatch<SetStateAction<T>> = useCallback((next) => {
    loadResultRef.current = 'user'
    setValueState(next)
  }, [])

  useEffect(() => {
    // Do not erase an unreadable value on first mount. Keep the raw
    // localStorage entry available for recovery until the user edits.
    if (
      loadResultRef.current === 'invalid' ||
      loadResultRef.current === 'error'
    ) {
      return
    }

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
        if (!validate || validate(parsed)) {
          loadResultRef.current = 'valid'
          setValueState(parsed as T)
        }
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
