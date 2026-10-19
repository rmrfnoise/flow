export type NeonThemeId =
  | 'green'
  | 'ice'
  | 'pink'
  | 'ember'
  | 'sakura'
  | 'apricot'

export type NeonThemeMode = 'dark' | 'light'

export interface NeonTheme {
  id: NeonThemeId
  name: string
  label: string
  mode: NeonThemeMode
  swatches: [string, string, string]
}

export const NEON_THEME_STORAGE_KEY = 'flow.neonTheme.v1'

export const NEON_THEMES: NeonTheme[] = [
  {
    id: 'green',
    name: 'NEON GREEN',
    label: '酸性绿',
    mode: 'dark',
    swatches: ['#7cff9b', '#5ce1ff', '#ff4fd8'],
  },
  {
    id: 'ice',
    name: 'ICE BLUE',
    label: '冰蓝',
    mode: 'dark',
    swatches: ['#6fe9ff', '#ff4fd8', '#b794ff'],
  },
  {
    id: 'pink',
    name: 'NEON PINK',
    label: '霓虹粉',
    mode: 'dark',
    swatches: ['#ff8ec4', '#ff4fd8', '#ffc857'],
  },
  {
    id: 'ember',
    name: 'EMBER',
    label: '余烬橙',
    mode: 'dark',
    swatches: ['#ff8b5c', '#ffc857', '#ff4fd8'],
  },
  {
    id: 'sakura',
    name: 'SAKURA',
    label: '樱花亮',
    mode: 'light',
    swatches: ['#c92a6a', '#ff8ec4', '#5ce1ff'],
  },
  {
    id: 'apricot',
    name: 'APRICOT',
    label: '杏色亮',
    mode: 'light',
    swatches: ['#b85c00', '#ffb066', '#5ce1ff'],
  },
]

export function isNeonThemeId(value: unknown): value is NeonThemeId {
  return NEON_THEMES.some((theme) => theme.id === value)
}
