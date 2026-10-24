import { useEffect, useState } from 'react'

export type AppearanceMode = 'system' | 'light' | 'dark'

export const APPEARANCE_STORAGE_KEY = 'flow.appearance.v1'
const THEME_COLORS: Record<'light' | 'dark', string> = {
  light: '#f5f5f7',
  dark: '#0b0c0e',
}

function readStoredMode(): AppearanceMode {
  try {
    const stored = window.localStorage.getItem(APPEARANCE_STORAGE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored
    }
  } catch {
    // Appearance falls back to the system preference.
  }
  return 'system'
}

function prefersDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function useAppearance() {
  const [mode, setMode] = useState<AppearanceMode>(readStoredMode)
  const [systemIsDark, setSystemIsDark] = useState(prefersDark)

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => setSystemIsDark(query.matches)
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  const isDark = mode === 'dark' || (mode === 'system' && systemIsDark)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = isDark ? 'dark' : 'light'
    root.style.colorScheme = isDark ? 'dark' : 'light'

    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    )
    if (meta) meta.content = THEME_COLORS[isDark ? 'dark' : 'light']

    try {
      window.localStorage.setItem(APPEARANCE_STORAGE_KEY, mode)
    } catch {
      // The appearance still applies for this session.
    }
  }, [isDark, mode])

  return { mode, isDark, setMode }
}
