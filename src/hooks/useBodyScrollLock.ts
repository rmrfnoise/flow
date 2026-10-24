import { useEffect } from 'react'

let lockCount = 0
let previousOverflow = ''

/**
 * Reference-counted body scroll lock so nested sheets/dialogs do not
 * restore the page scroll while another overlay is still open.
 */
export function useBodyScrollLock() {
  useEffect(() => {
    if (lockCount === 0) {
      previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
    lockCount += 1

    return () => {
      lockCount = Math.max(0, lockCount - 1)
      if (lockCount === 0) {
        document.body.style.overflow = previousOverflow
      }
    }
  }, [])
}
