import { useEffect, useMemo, useState } from 'react'
import { Check, Plus, Search, Trash2, X } from 'lucide-react'
import { getCategoryIcon } from '../lib/categoryIcons'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useKeyboardInset } from '../hooks/useKeyboardInset'
import { useI18n } from '../i18n/I18nProvider'
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
  customCategories: CustomExpenseCategory[]
  recentCategoryIds: string[]
  selectedId: string
  onSelect: (id: string) => void
  onAddCustom: (name: string) => string | null
  onRequestDelete: (category: CustomExpenseCategory) => void
  onClose: () => void
}

export default function CategoryPicker({
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

  const categories = useMemo(
    () => getCategoryViews(customCategories, locale),
    [customCategories, locale],
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
      className="fixed inset-0 z-[60] flex items-end justify-center"
      style={{ bottom: keyboardInset }}
    >
      <button
        type="button"
        aria-label={m.money.closeBackdrop}
        onClick={onClose}
        className="absolute inset-0 bg-black/35 backdrop-blur-[1px]"
      />

      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-label={m.money.categoriesTitle}
        className="fade-enter relative flex max-h-[90dvh] w-full max-w-[520px] flex-col rounded-t-[var(--radius-sheet)] bg-[var(--surface)] shadow-[var(--shadow-sheet)]"
        style={{
          maxHeight: keyboardInset > 0 ? '100%' : undefined,
        }}
      >
        <div className="flex items-start justify-between px-5 pb-2 pt-3">
          <div>
            <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-[var(--line-strong)] sm:hidden" />
            <h2 className="type-title font-semibold text-[var(--text)]">
              {m.money.categoriesTitle}
            </h2>
          </div>
          <button
            type="button"
            aria-label={m.money.close}
            onClick={onClose}
            className="-mr-2 grid h-8 w-8 place-items-center rounded-full text-[var(--text-3)] transition-colors hover:bg-[var(--surface-sunken)] hover:text-[var(--text)]"
          >
            <X size={18} strokeWidth={1.9} />
          </button>
        </div>

        <div className="px-5">
          <div className="relative">
            <Search
              size={16}
              strokeWidth={1.9}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)]"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={m.money.searchPlaceholder}
              aria-label={m.money.searchPlaceholder}
              className="h-11 w-full rounded-[10px] border border-[var(--line)] bg-[var(--surface-sunken)] pl-9 pr-3 text-[14px] text-[var(--text)] outline-none placeholder:text-[var(--text-3)] focus:border-[var(--accent)]"
            />
          </div>

          {adding ? (
            <div className="mt-3 rounded-[12px] border border-[var(--line)] bg-[var(--surface-sunken)] p-3">
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
                className="h-10 w-full rounded-[8px] border border-[var(--line)] bg-[var(--surface)] px-3 text-[14px] text-[var(--text)] outline-none placeholder:text-[var(--text-3)] focus:border-[var(--accent)]"
              />
              {error && (
                <p
                  role="alert"
                  className="mt-2 text-[12px] text-[var(--danger)]"
                >
                  {error}
                </p>
              )}
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={submitNewCategory}
                  className="h-9 flex-1 rounded-[8px] bg-[var(--accent)] text-[13px] font-medium text-[var(--on-accent)]"
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
                  className="h-9 rounded-[8px] px-4 text-[13px] font-medium text-[var(--text-2)]"
                >
                  {m.app.cancel}
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="mt-3 flex h-10 w-full items-center gap-2 rounded-[10px] px-1 text-[14px] font-medium text-[var(--accent)]"
            >
              <Plus size={16} strokeWidth={2} />
              {m.money.newCategory}
            </button>
          )}
        </div>

        <div className="mt-1 min-h-0 flex-1 overflow-y-auto px-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          {sections.length === 0 ? (
            <p className="px-3 py-8 text-center text-[13px] text-[var(--text-3)]">
              {m.money.noResults}
            </p>
          ) : (
            sections.map((section) => (
              <section key={section.key} className="mt-3">
                <h3 className="px-2 pb-1 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[var(--text-3)]">
                  {section.label}
                </h3>
                <div className="overflow-hidden rounded-[12px] border border-[var(--line)] bg-[var(--surface)]">
                  {section.items.map((category, index) => {
                    const selected = category.id === selectedId
                    const custom = customCategories.find(
                      (item) => item.id === category.id,
                    )
                    const CategoryIcon = getCategoryIcon(
                      category.id,
                      category.group,
                    )
                    return (
                      <div
                        key={category.id}
                        className={`flex items-center ${
                          index > 0 ? 'border-t border-[var(--line)]' : ''
                        }`}
                      >
                        <button
                          type="button"
                          aria-pressed={selected}
                          onClick={() => {
                            onSelect(category.id)
                            onClose()
                          }}
                          className={`flex h-11 min-w-0 flex-1 items-center gap-2 px-3 text-left text-[14px] transition-colors ${
                            selected
                              ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                              : 'text-[var(--text)] hover:bg-[var(--surface-sunken)]'
                          }`}
                        >
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[7px] bg-[var(--surface-sunken)] text-[var(--text-2)]">
                            <CategoryIcon size={15} strokeWidth={1.8} />
                          </span>
                          <span className="min-w-0 flex-1 truncate">
                            {category.name}
                          </span>
                          {selected && (
                            <Check
                              size={15}
                              strokeWidth={2.2}
                              className="shrink-0"
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
                            className="grid h-11 w-10 shrink-0 place-items-center text-[var(--text-3)] transition-colors hover:text-[var(--danger)]"
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
