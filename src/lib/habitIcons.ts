import {
  AlarmClock,
  BatteryCharging,
  BedDouble,
  BicepsFlexed,
  Bike,
  BookOpen,
  Brain,
  Brush,
  Cake,
  Calculator,
  CalendarCheck,
  Camera,
  CigaretteOff,
  Clock,
  CloudSun,
  Code,
  Coffee,
  Compass,
  CookingPot,
  createLucideIcon,
  Droplets,
  Dumbbell,
  Film,
  Flag,
  Flame,
  Flower2,
  Footprints,
  Gamepad2,
  Gauge,
  Gift,
  GraduationCap,
  Handshake,
  Headphones,
  Heart,
  HeartHandshake,
  HeartPulse,
  House,
  Languages,
  Laptop,
  Laugh,
  Leaf,
  Lightbulb,
  Medal,
  MessageCircle,
  Mic,
  Monitor,
  Moon,
  Mountain,
  Music,
  NotebookPen,
  Paintbrush,
  Palette,
  PartyPopper,
  PawPrint,
  PenLine,
  PenTool,
  PersonStanding,
  Phone,
  PiggyBank,
  Puzzle,
  Rocket,
  Salad,
  Scissors,
  ShoppingBasket,
  Smartphone,
  Sparkles,
  SprayCan,
  Sprout,
  Star,
  Sun,
  Target,
  Terminal,
  TreePine,
  Trophy,
  Users,
  Utensils,
  Wallet,
  Waves,
  Wifi,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import type { HabitIcon } from './habits'

export type HabitIconGroupId =
  | 'body'
  | 'mind'
  | 'create'
  | 'life'
  | 'social'
  | 'nature'
  | 'goals'
  | 'tech'

export interface HabitIconOption {
  id: HabitIcon
  Icon: LucideIcon
}

export interface HabitIconGroup {
  id: HabitIconGroupId
  icons: HabitIconOption[]
}

const icon = (id: HabitIcon, Icon: LucideIcon): HabitIconOption => ({
  id,
  Icon,
})

const Tooth = createLucideIcon('Tooth', [
  [
    'path',
    {
      d: 'M7 3.5c-2.1 0-3.5 1.7-3.5 3.9 0 1.8.7 3.5 1.2 5.1.4 1.3.6 2.8 1 4.1.3 1 1.7 1.1 2.1.1l1.1-2.7c.2-.5.9-.5 1.1 0l1.1 2.7c.4 1 1.8.9 2.1-.1.4-1.3.6-2.8 1-4.1.5-1.6 1.2-3.3 1.2-5.1 0-2.2-1.4-3.9-3.5-3.9-1 0-1.9.5-2.8.5S8 3.5 7 3.5Z',
      key: 'tooth',
    },
  ],
])

export const HABIT_ICON_GROUPS: HabitIconGroup[] = [
  {
    id: 'body',
    icons: [
      icon('run', Gauge),
      icon('bike', Bike),
      icon('workout', Dumbbell),
      icon('strength', BicepsFlexed),
      icon('yoga', PersonStanding),
      icon('walk', Footprints),
      icon('sleep', BedDouble),
      icon('tooth', Tooth),
      icon('noSmoke', CigaretteOff),
      icon('heartPulse', HeartPulse),
    ],
  },
  {
    id: 'mind',
    icons: [
      icon('book', BookOpen),
      icon('write', PenLine),
      icon('brain', Brain),
      icon('language', Languages),
      icon('journal', NotebookPen),
      icon('code', Code),
      icon('graduationCap', GraduationCap),
      icon('lightbulb', Lightbulb),
      icon('puzzle', Puzzle),
      icon('calculator', Calculator),
    ],
  },
  {
    id: 'create',
    icons: [
      icon('art', Paintbrush),
      icon('music', Music),
      icon('camera', Camera),
      icon('film', Film),
      icon('brush', Brush),
      icon('scissors', Scissors),
      icon('mic', Mic),
      icon('headphones', Headphones),
      icon('palette', Palette),
      icon('penTool', PenTool),
    ],
  },
  {
    id: 'life',
    icons: [
      icon('cook', CookingPot),
      icon('clean', SprayCan),
      icon('pet', PawPrint),
      icon('money', Wallet),
      icon('home', House),
      icon('coffee', Coffee),
      icon('food', Salad),
      icon('utensils', Utensils),
      icon('basket', ShoppingBasket),
      icon('piggyBank', PiggyBank),
    ],
  },
  {
    id: 'social',
    icons: [
      icon('heart', Heart),
      icon('social', Handshake),
      icon('party', PartyPopper),
      icon('users', Users),
      icon('message', MessageCircle),
      icon('phone', Phone),
      icon('gift', Gift),
      icon('cake', Cake),
      icon('smile', Laugh),
      icon('heartHandshake', HeartHandshake),
    ],
  },
  {
    id: 'nature',
    icons: [
      icon('plant', Sprout),
      icon('sun', Sun),
      icon('moon', Moon),
      icon('drop', Droplets),
      icon('leaf', Leaf),
      icon('flower', Flower2),
      icon('tree', TreePine),
      icon('mountain', Mountain),
      icon('cloudSun', CloudSun),
      icon('waves', Waves),
    ],
  },
  {
    id: 'goals',
    icons: [
      icon('spark', Sparkles),
      icon('fire', Flame),
      icon('star', Star),
      icon('bolt', Zap),
      icon('target', Target),
      icon('flag', Flag),
      icon('trophy', Trophy),
      icon('medal', Medal),
      icon('rocket', Rocket),
      icon('compass', Compass),
    ],
  },
  {
    id: 'tech',
    icons: [
      icon('clock', Clock),
      icon('alarm', AlarmClock),
      icon('calendar', CalendarCheck),
      icon('smartphone', Smartphone),
      icon('laptop', Laptop),
      icon('terminal', Terminal),
      icon('gamepad', Gamepad2),
      icon('wifi', Wifi),
      icon('battery', BatteryCharging),
      icon('monitor', Monitor),
    ],
  },
]

export const HABIT_ICON_OPTIONS = HABIT_ICON_GROUPS.flatMap(
  (group) => group.icons,
)

export const DEFAULT_HABIT_ICON: HabitIcon = 'spark'

const ICON_MAP = new Map(
  HABIT_ICON_OPTIONS.map((option) => [option.id, option]),
)

export function getHabitIconOption(iconId?: string) {
  return ICON_MAP.get(iconId as HabitIcon) ?? ICON_MAP.get(DEFAULT_HABIT_ICON)!
}

export function getHabitIconGroupId(iconId?: string): HabitIconGroupId {
  return (
    HABIT_ICON_GROUPS.find((group) =>
      group.icons.some((option) => option.id === iconId),
    )?.id ?? 'goals'
  )
}
