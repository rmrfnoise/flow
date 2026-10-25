import {
  Activity,
  AppWindow,
  BookOpen,
  Car,
  CarTaxiFront,
  ClipboardCheck,
  Cloud,
  Coffee,
  CreditCard,
  Croissant,
  Dumbbell,
  Film,
  Footprints,
  Fuel,
  Gamepad2,
  Gift,
  GraduationCap,
  HandCoins,
  HeartPulse,
  House,
  Plane,
  PawPrint,
  Pill,
  Receipt,
  Sandwich,
  Server,
  Shapes,
  Shirt,
  ShoppingBag,
  ShoppingBasket,
  Smartphone,
  Sofa,
  Sparkles,
  SquareParking,
  Stethoscope,
  Tag,
  TrainFront,
  Utensils,
  UtensilsCrossed,
  Webhook,
  Wifi,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import type { ExpenseCategoryGroup } from './expenses'

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'food.lunch': Sandwich,
  'food.dinner': UtensilsCrossed,
  'food.breakfast': Croissant,
  'food.takeout': ShoppingBag,
  'food.coffee': Coffee,
  'food.groceries': ShoppingBasket,
  'food.dining_out': Utensils,

  'transport.transit': TrainFront,
  'transport.taxi': CarTaxiFront,
  'transport.fuel': Fuel,
  'transport.parking': SquareParking,

  'housing.rent': House,
  'housing.utilities': Zap,
  'housing.internet': Wifi,
  'housing.home_goods': Sofa,

  'clothing.clothes': Shirt,
  'clothing.shoes': Footprints,
  'clothing.beauty': Sparkles,

  'communication.mobile': Smartphone,
  'communication.memberships': CreditCard,

  'development.api': Webhook,
  'development.server': Server,
  'development.software': AppWindow,
  'development.cloud': Cloud,

  'learning.course': GraduationCap,
  'learning.books': BookOpen,
  'learning.exam': ClipboardCheck,

  'entertainment.movies': Film,
  'entertainment.games': Gamepad2,
  'entertainment.travel': Plane,
  'entertainment.sports': Dumbbell,

  'health.medical': Stethoscope,
  'health.pharmacy': Pill,
  'health.checkup': HeartPulse,
  'health.fitness': Activity,

  'social.red_packet': HandCoins,
  'social.gifts': Gift,
  'social.treating': UtensilsCrossed,

  'other.misc': Shapes,
  'other.fees': Receipt,
  'other.pets': PawPrint,
}

const GROUP_ICONS: Record<ExpenseCategoryGroup, LucideIcon> = {
  food: Utensils,
  transport: Car,
  housing: House,
  clothing: Shirt,
  communication: Smartphone,
  development: Server,
  learning: BookOpen,
  entertainment: Film,
  health: HeartPulse,
  social: Gift,
  other: Shapes,
  custom: Tag,
}

export function getCategoryIcon(
  id?: string,
  group?: ExpenseCategoryGroup,
) {
  return (
    (id ? CATEGORY_ICONS[id] : undefined) ??
    (group ? GROUP_ICONS[group] : undefined) ??
    Shapes
  )
}
