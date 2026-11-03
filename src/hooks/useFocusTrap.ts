import { useEffect, useRef } from 'react'

const trapStack: HTMLElement[] = []

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function getFocusable(element: HTMLElement) {
  return [...element.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)].filter(
    (item) => item.getClientRects().length > 0,
  )
}

/**
 * Keeps Tab focus inside the top-most modal. A module-level stack lets
 * nested sheets (expense → category, expense → delete confirm) coexist
 * without fighting over the keydown event.
 */
export function useFocusTrap<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const previous = document.activeElement as HTMLElement | null
    trapStack.push(element)

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Tab') return
      if (trapStack[trapStack.length - 1] !== element) return

      const items = getFocusable(element)
      if (items.length === 0) {
        event.preventDefault()
        element.focus()
        return
      }

      const first = items[0]
      const last = items[items.length - 1]
      const active = document.activeElement

      if (!element.contains(active)) {
        event.preventDefault()
        const next = event.shiftKey ? last : first
        next.focus()
        return
      }
      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      const index = trapStack.lastIndexOf(element)
      if (index >= 0) trapStack.splice(index, 1)
      if (
        previous &&
        previous !== document.body &&
        document.contains(previous) &&
        !element.contains(previous)
      ) {
        previous.focus()
      }
    }
  }, [])

  return ref
}
