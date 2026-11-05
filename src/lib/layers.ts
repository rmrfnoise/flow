/**
 * Shared stacking scale for app chrome and overlays.
 *
 * Keep the fixed overlay roots on this scale so a newly opened layer is
 * always above the one it belongs to:
 * - navigation / toast: 40
 * - sheet: 50
 * - picker: 60
 * - floating sheet (balance, export): 70
 * - confirmation dialog: 80
 */
export const Z_LAYER = {
  nav: 40,
  sheet: 50,
  picker: 60,
  floating: 70,
  confirm: 80,
} as const
