import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Capacitor } from '@capacitor/core'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
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
    <App />
  </StrictMode>,
)
