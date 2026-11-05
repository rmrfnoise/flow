import { useEffect, useMemo, useState } from 'react'
import { Check, Plus, Search, Trash2, X } from 'lucide-react'
import { getCategoryIcon } from '../lib/categoryIcons'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useBackHandler, BACK_PRIORITY } from '../hooks/useBackHandler'
import { useKeyboardInset } from '../hooks/useKeyboardInset'
import { useI18n } from '../i18n/I18nProvider'
import { Z_LAYER } from '../lib/layers'
import {
  CATEGORY_GROUP_ORDER,
  PRESET_CATEGORIES,
  getCategoryViews,
  isCategoryNameTaken,
  type CustomExpenseCategory,
  type ExpenseCategoryGroup,
  type ExpenseCategoryView,
} from '../lib/expenses'

interface CategoryPickerProps {
  type: 'expense' | 'income'
  customCategories: CustomExpenseCategory[]
  recentCategoryIds: string[]
  selectedId: string
  onSelect: (id: string) => void
  onAddCustom: (name: string) => string | null
  onRequestDelete: (category: CustomExpenseCategory) => void
  onClose: () => void
}

export default function CategoryPicker({
  type,
  customCategories,
  recentCategoryIds,
  selectedId,
  onSelect,
  onAddCustom,
  onRequestDelete,
  onClose,
}: CategoryPickerProps) {
  const { locale, m } = useI18n()
  const [query, setQuery] = useState('')
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const trapRef = useFocusTrap<HTMLDivElement>()
  const keyboardInset = useKeyboardInset()
  useBackHandler(onClose, { priority: BACK_PRIORITY.picker })

  const categories = useMemo(
    () => getCategoryViews(customCategories, locale, type),
    [customCategories, locale, type],
  )

  const filtered = useMemo(() => {
    const term = query.trim().toLocaleLowerCase()
    if (!term) return categories
    return categories.filter((category) => {
      if (category.name.toLocaleLowerCase().includes(term)) return true
      const preset = PRESET_CATEGORIES.find(
        (item) => item.id === category.id,
      )
      return Boolean(
        preset &&
          (preset.en.toLocaleLowerCase().includes(term) ||
            preset.zh.toLocaleLowerCase().includes(term)),
      )
    })
  }, [categories, query])

  const grouped = useMemo(() => {
    const map = new Map<ExpenseCategoryGroup, typeof filtered>()
    for (const group of CATEGORY_GROUP_ORDER) {
      const items = filtered.filter((category) => category.group === group)
      if (items.length > 0) map.set(group, items)
    }
    return map
  }, [filtered])

  const recentItems = useMemo(() => {
    if (query.trim()) return []
    return recentCategoryIds
      .map((id) => categories.find((category) => category.id === id))
      .filter(
        (category): category is ExpenseCategoryView =>
          Boolean(category),
      )
  }, [categories, query, recentCategoryIds])

  const sections = useMemo(() => {
    const result: Array<{
      key: string
      label: string
      items: ExpenseCategoryView[]
    }> = []
    if (recentItems.length > 0) {
      result.push({
        key: 'recent',
        label: m.money.recent,
        items: recentItems,
      })
    }
    for (const [group, items] of grouped) {
      result.push({
        key: group,
        label: m.money.groups[group],
        items,
      })
    }
    return result
  }, [grouped, m.money.groups, m.money.recent, recentItems])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  function submitNewCategory() {
    const trimmed = name.trim()
    if (!trimmed) {
      setError(m.money.categoryNameEmpty)
      return
    }
    if (trimmed.length > 20) {
      setError(m.money.categoryNameTaken)
      return
    }
    if (isCategoryNameTaken(trimmed, customCategories)) {
      setError(m.money.categoryNameTaken)
      return
    }
    const id = onAddCustom(trimmed)
    if (!id) {
      setError(m.money.categoryNameTaken)
      return
    }
    onSelect(id)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 flex items-end justify-center"
      style={{ bottom: keyboardInset, zIndex: Z_LAYER.picker }}
    >
      <button
        type="button"
        aria-label={m.money.closeBackdrop}
        onClick={onClose}
        className="absolute inset-0 bg-[var(--scrim)]"
      />

      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label={m.money.categoriesTitle}
        className="fade-enter relative flex max-h-[90dvh] w-full max-w-[520px] flex-col rounded-t-[2px] border-t-2 border-[var(--ink)] bg-[var(--paper)] shadow-[var(--shadow-sheet)]"
        style={{
          maxHeight: keyboardInset > 0 ? '100%' : undefined,
        }}
      >
        <div className="flex items-start justify-between px-5 pb-2 pt-5">
          <h2 className="page-title text-[var(--ink)]">
            {m.money.categoriesTitle}
          </h2>
          <button
            type="button"
            aria-label={m.money.close}
            onClick={onClose}
            className="-mr-1 grid h-9 w-9 place-items-center text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
          >
            <X size={18} strokeWidth={1.9} />
          </button>
        </div>

        <div className="px-5">
          <div className="relative mt-1 border-b border-[var(--rule-strong)] focus-within:border-[var(--ink)]">
            <Search
              size={15}
              strokeWidth={1.9}
              className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-[var(--ink-3)]"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={m.money.searchPlaceholder}
              aria-label={m.money.searchPlaceholder}
              className="h-11 w-full bg-transparent pl-6 pr-2 text-[15px] text-[var(--ink)] outline-none placeholder:text-[var(--ink-3)]"
            />
          </div>

          {adding ? (
            <div className="mt-3">
              <input
                type="text"
                value={name}
                maxLength={20}
                onChange={(event) => {
                  setName(event.target.value)
                  setError('')
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    submitNewCategory()
                  }
                }}
                placeholder={m.money.categoryNamePlaceholder}
                aria-label={m.money.categoryNamePlaceholder}
                className="field h-10 text-[15px] placeholder:text-[var(--ink-3)]"
              />
              {error && (
                <p
                  role="alert"
                  className="mt-2 text-[13px] text-[var(--red)]"
                >
                  {error}
                </p>
              )}
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={submitNewCategory}
                  className="btn btn-primary h-9 flex-1"
                >
                  {m.money.newCategory}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAdding(false)
                    setName('')
                    setError('')
                  }}
                  className="h-9 px-4 text-[13px] font-medium text-[var(--ink-2)]"
                >
                  {m.app.cancel}
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="mt-3 flex h-10 w-full items-center gap-2 rounded-[2px] px-1 text-[15px] font-medium text-[var(--ink)]"
            >
              <Plus size={16} strokeWidth={2} />
              {m.money.newCategory}
            </button>
          )}
        </div>

        <div className="mt-1 min-h-0 flex-1 overflow-y-auto px-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          {sections.length === 0 ? (
            <p className="px-3 py-8 text-center text-[13px] text-[var(--ink-3)]">
              {m.money.noResults}
            </p>
          ) : (
            sections.map((section) => (
              <section key={section.key} className="mt-5">
                <h3 className="label pb-1.5">{section.label}</h3>
                <div className="ledger">
                  {section.items.map((category) => {
                    const selected = category.id === selectedId
                    const custom = customCategories.find(
                      (item) => item.id === category.id,
                    )
                    const CategoryIcon = getCategoryIcon(
                      category.id,
                      category.group,
                    )
                    return (
                      <div key={category.id} className="flex items-center">
                        <button
                          type="button"
                          aria-pressed={selected}
                          onClick={() => {
                            onSelect(category.id)
                            onClose()
                          }}
                          className={`flex h-12 min-w-0 flex-1 items-center gap-2.5 text-left text-[15px] transition-colors ${
                            selected
                              ? 'text-[var(--ink)]'
                              : 'text-[var(--ink)] hover:bg-[var(--sunken)]'
                          }`}
                        >
                          <CategoryIcon
                            size={15}
                            strokeWidth={1.8}
                            className="shrink-0 text-[var(--ink-3)]"
                          />
                          <span className="min-w-0 flex-1 truncate">
                            {category.name}
                          </span>
                          {selected && (
                            <Check
                              size={15}
                              strokeWidth={2.2}
                              className="shrink-0 text-[var(--red)]"
                            />
                          )}
                        </button>
                        {custom && (
                          <button
                            type="button"
                            aria-label={`${m.money.deleteCategory}: ${custom.name}`}
                            onClick={() => {
                              onClose()
                              onRequestDelete(custom)
                            }}
                            className="grid h-11 w-10 shrink-0 place-items-center text-[var(--ink-3)] transition-colors hover:text-[var(--red)]"
                          >
                            <Trash2 size={14} strokeWidth={1.9} />
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
