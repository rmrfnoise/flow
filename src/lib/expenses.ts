import type { Locale } from '../i18n/messages'
import {
  addDaysKey,
  daysBetween,
  endOfMonthKey,
  formatMonthDay,
  formatWeekRange,
  parseDateKey,
  startOfMonthKey,
} from './habits'

export type ExpenseCategoryGroup =
  | 'food'
  | 'transport'
  | 'housing'
  | 'clothing'
  | 'communication'
  | 'development'
  | 'learning'
  | 'entertainment'
  | 'health'
  | 'social'
  | 'income'
  | 'other'
  | 'custom'

export type EntryType = 'expense' | 'income' | 'adjustment'
export type PresetCategoryGroup = Exclude<ExpenseCategoryGroup, 'custom'>

export interface PresetCategory {
  id: string
  group: PresetCategoryGroup
  en: string
  zh: string
  type?: 'expense' | 'income'
}

export interface ExpenseCategoryView {
  id: string
  group: ExpenseCategoryGroup
  name: string
  builtin: boolean
  type: 'expense' | 'income'
}

export interface Expense {
  id: string
  type?: EntryType
  categoryId: string
  content: string
  amountCents: number
  date: string
  createdAt: number
  updatedAt: number
}

export interface BalanceState {
  enabled: boolean
  startCents: number | null
  startAt: number | null
  pausedAt?: number | null
}

export interface CustomExpenseCategory {
  id: string
  name: string
  createdAt: number
  type?: 'expense' | 'income'
}

export interface ExpenseDayGroup {
  date: string
  expenses: Expense[]
  incomeCents: number
  expenseCents: number
  netCents: number
}

export interface ExpenseCategoryTotal {
  id: string
  name: string
  group: ExpenseCategoryGroup
  totalCents: number
  percent: number
}

export interface ExpenseReport {
  totalCents: number
  incomeCents: number
  netCents: number
  count: number
  incomeCount: number
  expenseCount: number
  averageCents: number
  days: number
  daily: Array<{ date: string; totalCents: number }>
  categories: ExpenseCategoryTotal[]
}

export const EXPENSES_STORAGE_KEY = 'flow.expenses.v1'
export const CUSTOM_CATEGORIES_STORAGE_KEY =
  'flow.customExpenseCategories.v1'
export const BALANCE_STORAGE_KEY = 'flow.balance.v1'
export const MAX_AMOUNT_CENTS = 999_999_999
export const MISC_CATEGORY_ID = 'other.misc'
export const INCOME_MISC_CATEGORY_ID = 'income.other'
export const BALANCE_ADJUSTMENT_CATEGORY_ID = 'balance.adjustment'

export const DEFAULT_BALANCE_STATE: BalanceState = {
  enabled: false,
  startCents: null,
  startAt: null,
  pausedAt: null,
}

export const CATEGORY_GROUP_ORDER: ExpenseCategoryGroup[] = [
  'custom',
  'food',
  'transport',
  'housing',
  'clothing',
  'communication',
  'development',
  'learning',
  'entertainment',
  'health',
  'social',
  'income',
  'other',
]

export const PRESET_CATEGORIES: PresetCategory[] = [
  // Food — most used first
  { id: 'food.lunch', group: 'food', en: 'Lunch', zh: '午餐' },
  { id: 'food.dinner', group: 'food', en: 'Dinner', zh: '晚餐' },
  { id: 'food.breakfast', group: 'food', en: 'Breakfast', zh: '早餐' },
  { id: 'food.takeout', group: 'food', en: 'Takeout', zh: '外卖' },
  { id: 'food.coffee', group: 'food', en: 'Coffee & tea', zh: '咖啡奶茶' },
  { id: 'food.groceries', group: 'food', en: 'Groceries', zh: '买菜' },
  { id: 'food.snacks', group: 'food', en: 'Snacks', zh: '零食' },
  { id: 'food.dining_out', group: 'food', en: 'Dining out', zh: '聚餐' },

  // Transport
  { id: 'transport.transit', group: 'transport', en: 'Transit', zh: '地铁公交' },
  { id: 'transport.taxi', group: 'transport', en: 'Taxi', zh: '打车' },
  { id: 'transport.fuel', group: 'transport', en: 'Fuel', zh: '加油' },
  { id: 'transport.parking', group: 'transport', en: 'Parking', zh: '停车' },
  { id: 'transport.train_flight', group: 'transport', en: 'Train & flights', zh: '高铁机票' },
  { id: 'transport.bike', group: 'transport', en: 'Bike share', zh: '共享单车' },
  { id: 'transport.car_care', group: 'transport', en: 'Car care', zh: '车辆保养' },

  // Housing
  { id: 'housing.rent', group: 'housing', en: 'Rent', zh: '房租' },
  { id: 'housing.utilities', group: 'housing', en: 'Utilities', zh: '水电燃气' },
  { id: 'housing.property', group: 'housing', en: 'Property fee', zh: '物业' },
  { id: 'housing.internet', group: 'housing', en: 'Internet', zh: '宽带' },
  { id: 'housing.mortgage', group: 'housing', en: 'Mortgage', zh: '房贷' },
  { id: 'housing.home_goods', group: 'housing', en: 'Home goods', zh: '家居' },
  { id: 'housing.repairs', group: 'housing', en: 'Repairs', zh: '维修' },

  // Clothing
  { id: 'clothing.clothes', group: 'clothing', en: 'Clothes', zh: '衣服' },
  { id: 'clothing.shoes', group: 'clothing', en: 'Shoes & hats', zh: '鞋帽' },
  { id: 'clothing.beauty', group: 'clothing', en: 'Beauty', zh: '美妆' },
  { id: 'clothing.accessories', group: 'clothing', en: 'Accessories', zh: '配饰' },
  { id: 'clothing.laundry', group: 'clothing', en: 'Laundry', zh: '洗衣' },

  // Communication
  { id: 'communication.mobile', group: 'communication', en: 'Mobile', zh: '手机话费' },
  { id: 'communication.data', group: 'communication', en: 'Data', zh: '流量' },
  { id: 'communication.memberships', group: 'communication', en: 'Memberships', zh: '会员订阅' },
  { id: 'communication.cloud_storage', group: 'communication', en: 'Cloud storage', zh: '云存储' },

  // Development / API
  { id: 'development.api', group: 'development', en: 'API usage', zh: 'API 调用' },
  { id: 'development.server', group: 'development', en: 'Server', zh: '服务器' },
  { id: 'development.domain', group: 'development', en: 'Domain', zh: '域名' },
  { id: 'development.cloud', group: 'development', en: 'Cloud services', zh: '云服务' },
  { id: 'development.dev_tools', group: 'development', en: 'Dev tools', zh: '开发工具' },
  { id: 'development.code_hosting', group: 'development', en: 'Code hosting', zh: '代码托管' },
  { id: 'development.software', group: 'development', en: 'Software', zh: '软件订阅' },

  // Learning
  { id: 'learning.course', group: 'learning', en: 'Courses', zh: '课程' },
  { id: 'learning.books', group: 'learning', en: 'Books', zh: '书籍' },
  { id: 'learning.exam', group: 'learning', en: 'Exams', zh: '考试' },
  { id: 'learning.training', group: 'learning', en: 'Training', zh: '培训' },
  { id: 'learning.stationery', group: 'learning', en: 'Stationery', zh: '文具' },

  // Entertainment
  { id: 'entertainment.movies', group: 'entertainment', en: 'Movies', zh: '电影' },
  { id: 'entertainment.games', group: 'entertainment', en: 'Games', zh: '游戏' },
  { id: 'entertainment.travel', group: 'entertainment', en: 'Travel', zh: '旅行' },
  { id: 'entertainment.sports', group: 'entertainment', en: 'Sports', zh: '运动' },
  { id: 'entertainment.events', group: 'entertainment', en: 'Events', zh: '演出' },

  // Health
  { id: 'health.medical', group: 'health', en: 'Medical', zh: '医疗' },
  { id: 'health.pharmacy', group: 'health', en: 'Pharmacy', zh: '药品' },
  { id: 'health.checkup', group: 'health', en: 'Checkup', zh: '体检' },
  { id: 'health.fitness', group: 'health', en: 'Fitness', zh: '健身' },
  { id: 'health.insurance', group: 'health', en: 'Insurance', zh: '保险' },

  // Social
  { id: 'social.red_packet', group: 'social', en: 'Red packets', zh: '红包' },
  { id: 'social.gifts', group: 'social', en: 'Gifts', zh: '礼物' },
  { id: 'social.treating', group: 'social', en: 'Treating', zh: '请客' },

  // Other
  { id: 'other.misc', group: 'other', en: 'Misc', zh: '杂项' },
  { id: 'other.fees', group: 'other', en: 'Fees', zh: '手续费' },
  { id: 'other.pets', group: 'other', en: 'Pets', zh: '宠物' },
  { id: 'other.donations', group: 'other', en: 'Donations', zh: '捐赠' },

  // Income
  {
    id: 'income.salary',
    group: 'income',
    type: 'income',
    en: 'Salary',
    zh: '工资',
  },
  {
    id: 'income.bonus',
    group: 'income',
    type: 'income',
    en: 'Bonus',
    zh: '奖金',
  },
  {
    id: 'income.freelance',
    group: 'income',
    type: 'income',
    en: 'Freelance',
    zh: '自由职业',
  },
  {
    id: 'income.investment',
    group: 'income',
    type: 'income',
    en: 'Investments',
    zh: '投资收益',
  },
  {
    id: 'income.gift',
    group: 'income',
    type: 'income',
    en: 'Gift',
    zh: '礼金',
  },
  {
    id: 'income.refund',
    group: 'income',
    type: 'income',
    en: 'Refund',
    zh: '退款',
  },
  {
    id: 'income.other',
    group: 'income',
    type: 'income',
    en: 'Other income',
    zh: '其他收入',
  },
]

// Keep old category ids in PRESET_CATEGORIES for existing records, but only
// surface the common ones in the picker.
const PICKER_CATEGORY_IDS = new Set([
  'food.lunch',
  'food.dinner',
  'food.breakfast',
  'food.takeout',
  'food.coffee',
  'food.groceries',
  'food.dining_out',
  'transport.transit',
  'transport.taxi',
  'transport.fuel',
  'transport.parking',
  'housing.rent',
  'housing.utilities',
  'housing.internet',
  'housing.home_goods',
  'clothing.clothes',
  'clothing.shoes',
  'clothing.beauty',
  'communication.mobile',
  'communication.memberships',
  'development.api',
  'development.server',
  'development.software',
  'development.cloud',
  'learning.course',
  'learning.books',
  'learning.exam',
  'entertainment.movies',
  'entertainment.games',
  'entertainment.travel',
  'entertainment.sports',
  'health.medical',
  'health.pharmacy',
  'health.checkup',
  'health.fitness',
  'social.red_packet',
  'social.gifts',
  'social.treating',
  'other.misc',
  'other.fees',
  'other.pets',
])

export function getCategoryViews(
  customCategories: CustomExpenseCategory[],
  locale: Locale,
  type: 'expense' | 'income' = 'expense',
): ExpenseCategoryView[] {
  return [
    ...PRESET_CATEGORIES.filter((category) => {
      if ((category.type ?? 'expense') !== type) return false
      return (
        type === 'income' || PICKER_CATEGORY_IDS.has(category.id)
      )
    }).map((category) => ({
      id: category.id,
      group: category.group as ExpenseCategoryGroup,
      name: locale === 'zh' ? category.zh : category.en,
      builtin: true,
      type,
    })),
    ...customCategories
      .filter((category) => (category.type ?? 'expense') === type)
      .map((category) => ({
        id: category.id,
        group: 'custom' as const,
        name: category.name,
        builtin: false,
        type,
      })),
  ]
}

export function getCategoryView(
  id: string,
  customCategories: CustomExpenseCategory[],
  locale: Locale,
): ExpenseCategoryView | null {
  const preset = PRESET_CATEGORIES.find((item) => item.id === id)
  if (preset) {
    return {
      id: preset.id,
      group: preset.group,
      name: locale === 'zh' ? preset.zh : preset.en,
      builtin: true,
      type: preset.type ?? 'expense',
    }
  }
  const custom = customCategories.find((item) => item.id === id)
  if (custom) {
    return {
      id: custom.id,
      group: 'custom',
      name: custom.name,
      builtin: false,
      type: custom.type ?? 'expense',
    }
  }
  return null
}

export function isCategoryNameTaken(
  name: string,
  customCategories: CustomExpenseCategory[],
) {
  const target = name.trim().toLocaleLowerCase()
  if (!target) return true

  const presetNames = PRESET_CATEGORIES.flatMap((category) => [
    category.en.toLocaleLowerCase(),
    category.zh.toLocaleLowerCase(),
  ])
  if (presetNames.includes(target)) return true

  return customCategories.some(
    (category) =>
      category.name.trim().toLocaleLowerCase() === target,
  )
}

export function parseAmountInput(value: string): number | null {
  const trimmed = value.trim()
  if (!/^\d{1,7}(\.\d{0,2})?$/u.test(trimmed)) return null
  const [whole, fraction = ''] = trimmed.split('.')
  const cents =
    Number(whole) * 100 + Number(`${fraction}00`.slice(0, 2))
  if (
    !Number.isSafeInteger(cents) ||
    cents <= 0 ||
    cents > MAX_AMOUNT_CENTS
  ) {
    return null
  }
  return cents
}

export function formatAmountInput(cents: number) {
  return (cents / 100).toFixed(2)
}

const MONEY_FORMATTERS: Record<Locale, Intl.NumberFormat> = {
  en: new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
  zh: new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }),
}

export function formatMoney(cents: number, locale: Locale) {
  const formatted = MONEY_FORMATTERS[locale].format(
    Math.abs(cents) / 100,
  )
  return cents < 0 ? `-¥\u00A0${formatted}` : `¥\u00A0${formatted}`
}

export function formatSignedMoney(cents: number, locale: Locale) {
  const amount = formatMoney(Math.abs(cents), locale)
  if (cents > 0) return `+${amount}`
  if (cents < 0) return `-${amount}`
  return amount
}

export function parseSignedAmountInput(value: string): number | null {
  const trimmed = value.trim().replace(/,/g, '')
  if (!/^-?\d{1,7}(\.\d{0,2})?$/u.test(trimmed)) return null
  const negative = trimmed.startsWith('-')
  const unsigned = negative ? trimmed.slice(1) : trimmed
  const [whole, fraction = ''] = unsigned.split('.')
  const cents =
    Number(whole) * 100 + Number(`${fraction}00`.slice(0, 2))
  const signed = negative ? -cents : cents
  if (
    !Number.isInteger(cents) ||
    Math.abs(signed) > MAX_AMOUNT_CENTS
  ) {
    return null
  }
  return signed
}

export function getEntryType(expense: Expense): EntryType {
  return expense.type ?? 'expense'
}

export function getEntrySignedCents(expense: Expense) {
  const type = getEntryType(expense)
  if (type === 'expense') return -expense.amountCents
  return expense.amountCents
}

export function getBalanceCents(
  expenses: Expense[],
  balance: BalanceState,
): number | null {
  if (
    !balance.enabled ||
    balance.startCents === null ||
    balance.startAt === null
  ) {
    return null
  }

  return getBalanceAt(expenses, balance, Date.now())
}

export function getBalanceAt(
  expenses: Expense[],
  balance: BalanceState,
  at: number,
): number | null {
  if (balance.startCents === null || balance.startAt === null) {
    return null
  }

  let total = balance.startCents
  for (const expense of expenses) {
    if (expense.createdAt <= balance.startAt) continue
    if (expense.createdAt > at) continue
    total += getEntrySignedCents(expense)
  }
  return total
}

export function isBalanceState(value: unknown): value is BalanceState {
  if (!isRecord(value)) return false
  return (
    typeof value.enabled === 'boolean' &&
    (value.startCents === null ||
      (typeof value.startCents === 'number' &&
        Number.isInteger(value.startCents) &&
        Math.abs(value.startCents) <= MAX_AMOUNT_CENTS)) &&
    (value.startAt === null ||
      (typeof value.startAt === 'number' &&
        Number.isFinite(value.startAt))) &&
    (value.pausedAt === undefined ||
      value.pausedAt === null ||
      (typeof value.pausedAt === 'number' &&
        Number.isFinite(value.pausedAt)))
  )
}

export function getMonthRange(monthKey: string) {
  const start = startOfMonthKey(`${monthKey}-01`)
  return { start, end: endOfMonthKey(start) }
}

export function expensesInRange(
  expenses: Expense[],
  fromKey: string,
  toKey: string,
) {
  return expenses.filter(
    (expense) => expense.date >= fromKey && expense.date <= toKey,
  )
}

export function sumCents(expenses: Expense[]) {
  return expenses.reduce(
    (total, expense) => total + expense.amountCents,
    0,
  )
}

export function sumExpenseCents(expenses: Expense[]) {
  return expenses.reduce(
    (total, expense) =>
      getEntryType(expense) === 'expense'
        ? total + expense.amountCents
        : total,
    0,
  )
}

export function sumIncomeCents(expenses: Expense[]) {
  return expenses.reduce(
    (total, expense) =>
      getEntryType(expense) === 'income'
        ? total + expense.amountCents
        : total,
    0,
  )
}

export function sortExpensesDesc(expenses: Expense[]) {
  return [...expenses].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1
    return b.createdAt - a.createdAt
  })
}

export function groupExpensesByDay(expenses: Expense[]): ExpenseDayGroup[] {
  const map = new Map<string, Expense[]>()
  for (const expense of sortExpensesDesc(expenses)) {
    const group = map.get(expense.date)
    if (group) group.push(expense)
    else map.set(expense.date, [expense])
  }

  return [...map.entries()]
    .sort(([a], [b]) => (a < b ? 1 : -1))
    .map(([date, items]) => {
      const incomeCents = sumIncomeCents(items)
      const expenseCents = sumExpenseCents(items)
      return {
        date,
        expenses: items,
        incomeCents,
        expenseCents,
        netCents: incomeCents - expenseCents,
      }
    })
}

export function countExpensesForCategory(
  expenses: Expense[],
  categoryId: string,
) {
  return expenses.filter(
    (expense) => expense.categoryId === categoryId,
  ).length
}

export function buildExpenseReport({
  expenses,
  fromKey,
  toKey,
  todayKey,
  customCategories,
  locale,
  uncategorizedLabel,
  otherLabel,
}: {
  expenses: Expense[]
  fromKey: string
  toKey: string
  todayKey: string
  customCategories: CustomExpenseCategory[]
  locale: Locale
  uncategorizedLabel: string
  otherLabel: string
}): ExpenseReport {
  const items = expensesInRange(expenses, fromKey, toKey)
  const expenseItems = items.filter(
    (expense) => getEntryType(expense) === 'expense',
  )
  const incomeItems = items.filter(
    (expense) => getEntryType(expense) === 'income',
  )
  const totalCents = sumExpenseCents(expenseItems)
  const incomeCents = sumIncomeCents(incomeItems)
  const count = expenseItems.length + incomeItems.length
  const fullDays = Math.max(1, daysBetween(fromKey, toKey) + 1)
  const elapsedDays =
    fromKey > todayKey
      ? 0
      : Math.min(fullDays, daysBetween(fromKey, todayKey) + 1)
  const days = toKey < todayKey ? fullDays : elapsedDays

  const daily = Array.from({ length: fullDays }, (_, index) => {
    const date = addDaysKey(fromKey, index)
    const total = expenseItems
      .filter((expense) => expense.date === date)
      .reduce((sum, expense) => sum + expense.amountCents, 0)
    return { date, totalCents: total }
  })

  const totals = new Map<string, number>()
  for (const expense of expenseItems) {
    totals.set(
      expense.categoryId,
      (totals.get(expense.categoryId) ?? 0) + expense.amountCents,
    )
  }

  const allCategories = [...totals.entries()]
    .map(([id, amount]) => {
      const category = getCategoryView(id, customCategories, locale)
      return {
        id,
        name: category?.name ?? uncategorizedLabel,
        group: category?.group ?? ('other' as ExpenseCategoryGroup),
        totalCents: amount,
        percent:
          totalCents > 0
            ? Math.max(
                1,
                Math.round((amount / totalCents) * 100),
              )
            : 0,
      }
    })
    .sort((a, b) => b.totalCents - a.totalCents)

  const categories: ExpenseCategoryTotal[] = allCategories.slice(0, 8)
  const rest = allCategories.slice(8)
  if (rest.length > 0) {
    const restTotal = rest.reduce(
      (sum, category) => sum + category.totalCents,
      0,
    )
    categories.push({
      id: '__other_categories__',
      name: otherLabel,
      group: 'other',
      totalCents: restTotal,
      percent:
        totalCents > 0
          ? Math.max(1, Math.round((restTotal / totalCents) * 100))
          : 0,
    })
  }

  return {
    totalCents,
    incomeCents,
    netCents: incomeCents - totalCents,
    count,
    incomeCount: incomeItems.length,
    expenseCount: expenseItems.length,
    averageCents: days > 0 ? Math.round(totalCents / days) : 0,
    days,
    daily,
    categories,
  }
}

export function formatExpenseDayLabel(
  dateKey: string,
  todayKey: string,
  locale: Locale,
  labels: { today: string; yesterday: string },
) {
  if (dateKey === todayKey) return labels.today
  if (dateKey === addDaysKey(todayKey, -1)) return labels.yesterday
  return formatMonthDay(dateKey, locale)
}

export function formatExpensePeriod(
  fromKey: string,
  toKey: string,
  locale: Locale,
) {
  if (fromKey.slice(0, 7) === toKey.slice(0, 7)) {
    return formatWeekRange(fromKey, locale)
  }
  return `${formatMonthDay(fromKey, locale)} – ${formatMonthDay(
    toKey,
    locale,
  )}`
}

export function isValidExpenseDate(dateKey: string) {
  return parseDateKey(dateKey) !== null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isTimestamp(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

export function isExpenseArray(value: unknown): value is Expense[] {
  return (
    Array.isArray(value) &&
    value.every((item) => {
      if (!isRecord(item)) return false
      const type =
        item.type === undefined ? 'expense' : item.type
      if (
        type !== 'expense' &&
        type !== 'income' &&
        type !== 'adjustment'
      ) {
        return false
      }
      const amountIsValid =
        typeof item.amountCents === 'number' &&
        Number.isInteger(item.amountCents) &&
        Math.abs(item.amountCents) <= MAX_AMOUNT_CENTS &&
        (type === 'adjustment'
          ? item.amountCents !== 0
          : item.amountCents > 0)
      return (
        typeof item.id === 'string' &&
        item.id.trim().length > 0 &&
        typeof item.categoryId === 'string' &&
        item.categoryId.trim().length > 0 &&
        typeof item.content === 'string' &&
        item.content.trim().length > 0 &&
        item.content.trim().length <= 80 &&
        amountIsValid &&
        typeof item.date === 'string' &&
        isValidExpenseDate(item.date) &&
        isTimestamp(item.createdAt) &&
        isTimestamp(item.updatedAt)
      )
    })
  )
}

export function isCustomCategoryArray(
  value: unknown,
): value is CustomExpenseCategory[] {
  return (
    Array.isArray(value) &&
    value.every((item) => {
      if (!isRecord(item)) return false
      return (
        typeof item.id === 'string' &&
        item.id.trim().length > 0 &&
        typeof item.name === 'string' &&
        item.name.trim().length > 0 &&
        item.name.trim().length <= 20 &&
        (item.type === undefined ||
          item.type === 'expense' ||
          item.type === 'income') &&
        isTimestamp(item.createdAt)
      )
    })
  )
}
