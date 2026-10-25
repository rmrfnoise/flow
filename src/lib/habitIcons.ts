import type { HabitIcon } from './habits'

export interface HabitIconOption {
  id: HabitIcon
  emoji: string
}

export const DEFAULT_HABIT_ICON: HabitIcon = 'spark'

export const HABIT_ICON_OPTIONS: HabitIconOption[] = [
  { id: 'spark', emoji: '✨' },
  { id: 'fire', emoji: '🔥' },
  { id: 'star', emoji: '⭐' },
  { id: 'heart', emoji: '💚' },
  { id: 'bolt', emoji: '⚡' },
  { id: 'plant', emoji: '🌱' },
  { id: 'sun', emoji: '☀️' },
  { id: 'moon', emoji: '🌙' },
  { id: 'drop', emoji: '💧' },
  { id: 'target', emoji: '🎯' },
  { id: 'run', emoji: '🏃' },
  { id: 'bike', emoji: '🚴' },
  { id: 'yoga', emoji: '🧘' },
  { id: 'strength', emoji: '💪' },
  { id: 'workout', emoji: '🏋️' },
  { id: 'walk', emoji: '🚶' },
  { id: 'sleep', emoji: '😴' },
  { id: 'tooth', emoji: '🦷' },
  { id: 'noSmoke', emoji: '🚭' },
  { id: 'book', emoji: '📚' },
  { id: 'write', emoji: '✍️' },
  { id: 'brain', emoji: '🧠' },
  { id: 'code', emoji: '💻' },
  { id: 'art', emoji: '🎨' },
  { id: 'music', emoji: '🎸' },
  { id: 'language', emoji: '🗣️' },
  { id: 'journal', emoji: '📝' },
  { id: 'cook', emoji: '🍳' },
  { id: 'clean', emoji: '🧹' },
  { id: 'pet', emoji: '🐾' },
  { id: 'money', emoji: '💰' },
  { id: 'home', emoji: '🏠' },
  { id: 'social', emoji: '🤝' },
  { id: 'party', emoji: '🎉' },
  { id: 'coffee', emoji: '☕' },
  { id: 'food', emoji: '🥗' },
]

const ICON_MAP = new Map(
  HABIT_ICON_OPTIONS.map((option) => [option.id, option]),
)

export function getHabitIconOption(icon?: string) {
  return ICON_MAP.get(icon as HabitIcon) ?? ICON_MAP.get(DEFAULT_HABIT_ICON)!
}
