import { useEffect, useState } from 'react'

const KEYBOARD_THRESHOLD = 120

/**
 * Page chrome (URL bar, safe area) can make visualViewport differ from
 * innerHeight by a few dozen pixels. Only treat a larger difference as a
 * keyboard, so the sheet does not jump when mobile browser chrome collapses.
 */
export function useKeyboardInset() {
  const [inset, setInset] = useState(0)

  useEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return

    const update = () => {
      const next = Math.max(
        0,
        window.innerHeight - viewport.height - viewport.offsetTop,
      )
      setInset(next > KEYBOARD_THRESHOLD ? Math.round(next) : 0)
    }

    update()
    viewport.addEventListener('resize', update)
    viewport.addEventListener('scroll', update)
    return () => {
      viewport.removeEventListener('resize', update)
      viewport.removeEventListener('scroll', update)
    }
  }, [])

  return inset
}
