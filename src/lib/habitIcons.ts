import type { HabitIcon } from './habits'

export interface HabitIconOption {
  id: HabitIcon
  emoji: string
  animation: string
}

export const DEFAULT_HABIT_ICON: HabitIcon = 'spark'

export const HABIT_ICON_OPTIONS: HabitIconOption[] = [
  { id: 'spark', emoji: '✨', animation: 'pop' },
  { id: 'fire', emoji: '🔥', animation: 'rise' },
  { id: 'star', emoji: '⭐', animation: 'spin' },
  { id: 'heart', emoji: '💚', animation: 'pulse' },
  { id: 'bolt', emoji: '⚡', animation: 'zap' },
  { id: 'plant', emoji: '🌱', animation: 'grow' },
  { id: 'sun', emoji: '☀️', animation: 'glow' },
  { id: 'moon', emoji: '🌙', animation: 'float' },
  { id: 'drop', emoji: '💧', animation: 'drop' },
  { id: 'target', emoji: '🎯', animation: 'focus' },
]

const ICON_MAP = new Map(
  HABIT_ICON_OPTIONS.map((option) => [option.id, option]),
)

export function getHabitIconOption(icon?: string) {
  return ICON_MAP.get(icon as HabitIcon) ?? ICON_MAP.get(DEFAULT_HABIT_ICON)!
}
