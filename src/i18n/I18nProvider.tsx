import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  getMessages,
  type Locale,
  type Messages,
} from './messages'

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  m: Messages
}

const I18nContext = createContext<I18nContextValue | null>(null)

function readLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
    if (stored === 'en' || stored === 'zh') return stored
  } catch {
    // The default locale is used when storage is unavailable.
  }
  return DEFAULT_LOCALE
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readLocale)
  const m = getMessages(locale)

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next)
    } catch {
      // The locale still applies for this session.
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
    const description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    )
    if (description) description.content = m.meta.description
  }, [locale, m])

  const value = useMemo(
    () => ({ locale, setLocale, m }),
    [locale, setLocale, m],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used inside I18nProvider')
  }
  return context
}
