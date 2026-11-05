import { useLayoutEffect, useRef } from 'react'

export const BACK_PRIORITY = {
  sheet: 10,
  picker: 20,
  floating: 30,
  confirm: 100,
} as const

interface BackEntry {
  id: number
  priority: number
  handler: () => void
}

const stack: BackEntry[] = []
let nextId = 0

/**
 * Run the top-most registered back handler. Higher priority wins; for
 * handlers at the same priority the most recently mounted one wins.
 */
export function runBack() {
  let top: BackEntry | null = null

  for (const entry of stack) {
    if (
      top === null ||
      entry.priority > top.priority ||
      (entry.priority === top.priority && entry.id > top.id)
    ) {
      top = entry
    }
  }

  if (!top) return false
  top.handler()
  return true
}

/** True when an overlay with a higher priority is currently mounted. */
export function hasBackHandlerAbove(priority: number) {
  return stack.some((entry) => entry.priority > priority)
}

/**
 * Register a handler for the Android hardware/gesture back button. The
 * handler stays registered while the calling component is mounted, so
 * sheets, pickers, and dialogs can layer naturally.
 */
export function useBackHandler(
  handler: () => void,
  {
    enabled = true,
    priority = BACK_PRIORITY.sheet,
  }: { enabled?: boolean; priority?: number } = {},
) {
  const handlerRef = useRef(handler)
  handlerRef.current = handler

  useLayoutEffect(() => {
    if (!enabled) return

    const entry: BackEntry = {
      id: (nextId += 1),
      priority,
      handler: () => handlerRef.current(),
    }
    stack.push(entry)

    return () => {
      const index = stack.indexOf(entry)
      if (index >= 0) stack.splice(index, 1)
    }
  }, [enabled, priority])
}
