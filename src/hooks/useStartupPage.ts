import { useCallback, useState } from 'react'

export type StartupPage = 'tasks' | 'habits' | 'money'

export const STARTUP_PAGE_STORAGE_KEY = 'flow.startupPage.v1'
export const DEFAULT_STARTUP_PAGE: StartupPage = 'tasks'

export function isStartupPage(value: unknown): value is StartupPage {
  return value === 'tasks' || value === 'habits' || value === 'money'
}

function readStartupPage(): StartupPage {
  try {
    const stored = window.localStorage.getItem(STARTUP_PAGE_STORAGE_KEY)
    if (isStartupPage(stored)) return stored
  } catch {
    // The default page is used when storage is unavailable.
  }
  return DEFAULT_STARTUP_PAGE
}

/**
 * The page flow opens on when there is no route in the URL. Stored as a raw
 * string (like locale and appearance) so backups stay simple to validate.
 */
export function useStartupPage() {
  const [page, setPageState] = useState<StartupPage>(readStartupPage)

  const setPage = useCallback((next: StartupPage) => {
    setPageState(next)
    try {
      window.localStorage.setItem(STARTUP_PAGE_STORAGE_KEY, next)
    } catch {
      // The choice still applies for this session.
    }
  }, [])

  return { page, setPage }
}
