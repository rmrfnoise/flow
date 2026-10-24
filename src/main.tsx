import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import AppErrorBoundary from './components/AppErrorBoundary'
import { I18nProvider } from './i18n/I18nProvider'
import './index.css'

if (!Capacitor.isNativePlatform()) {
  registerSW({ immediate: true })
}

if (typeof navigator.storage?.persist === 'function') {
  void navigator.storage.persist().catch(() => {
    // Persistence is best-effort; the app still works without it.
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <I18nProvider>
        <App />
      </I18nProvider>
    </AppErrorBoundary>
  </StrictMode>,
)
