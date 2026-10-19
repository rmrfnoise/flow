import { useEffect, useState } from 'react'
import {
  isNeonThemeId,
  NEON_THEME_STORAGE_KEY,
  NEON_THEMES,
  type NeonThemeId,
} from '../lib/theme'

function initialTheme(): NeonThemeId {
  if (typeof document !== 'undefined') {
    const fromDom = document.documentElement.dataset.theme
    if (isNeonThemeId(fromDom)) return fromDom
  }

  try {
    const stored = window.localStorage.getItem(NEON_THEME_STORAGE_KEY)
    if (isNeonThemeId(stored)) return stored
  } catch {
    // Theme persistence is optional.
  }

  return 'green'
}

export function useNeonTheme() {
  const [theme, setTheme] = useState<NeonThemeId>(initialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      window.localStorage.setItem(NEON_THEME_STORAGE_KEY, theme)
    } catch {
      // The theme still applies for this session.
    }

    const isLight =
      NEON_THEMES.find((candidate) => candidate.id === theme)?.mode ===
      'light'
    const meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    )
    if (meta) {
      const canvas = getComputedStyle(document.documentElement)
        .getPropertyValue('--canvas-base')
        .trim()
      if (canvas) meta.content = canvas
    }

    const colorScheme = document.querySelector<HTMLMetaElement>(
      'meta[name="color-scheme"]',
    )
    if (colorScheme) colorScheme.content = isLight ? 'light' : 'dark'
  }, [theme])

  return { theme, setTheme }
}
