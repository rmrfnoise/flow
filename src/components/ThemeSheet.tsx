import { useEffect } from 'react'
import { Check, Palette, X } from 'lucide-react'
import {
  NEON_THEMES,
  type NeonThemeId,
} from '../lib/theme'

interface ThemeSheetProps {
  current: NeonThemeId
  onSelect: (theme: NeonThemeId) => void
  onClose: () => void
}

export default function ThemeSheet({
  current,
  onSelect,
  onClose,
}: ThemeSheetProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-5">
      <button
        type="button"
        aria-label="关闭配色选择"
        onClick={onClose}
        className="backdrop-enter absolute inset-0 cursor-default bg-[#000402]/82 backdrop-blur-[5px]"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="theme-sheet-title"
        className="sheet-enter hide-scrollbar relative z-10 max-h-[92dvh] w-full max-w-[430px] overflow-y-auto overscroll-contain rounded-t-[20px] border-x border-t border-[var(--accent-line)] bg-[var(--surface-0)] px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-20px_80px_var(--accent-glow-faint)] sm:rounded-[14px] sm:border"
      >
        <div className="mb-3 flex justify-center">
          <span className="h-[2px] w-10 bg-[var(--accent)] shadow-[0_0_10px_var(--accent-glow)]" />
        </div>

        <div className="flex items-start justify-between">
          <div>
            <p className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.24em] text-[var(--accent-dim)]">
              <Palette size={10} strokeWidth={1.8} />
              // neon_palette
            </p>
            <h2
              id="theme-sheet-title"
              className="mt-1.5 font-display text-[22px] font-semibold tracking-[0.02em] text-[var(--ink)]"
            >
              选择霓虹配色
            </h2>
            <p className="mt-1 font-mono text-[13px] text-[var(--muted)]">
              背景、卡片与霓虹主色会一起切换，布局和交互保持不变
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭"
            className="chamfer-sm grid h-8 w-8 place-items-center border border-[var(--line-soft)] bg-[var(--surface-2)] text-[var(--muted)] transition-all active:scale-95 hover:border-[var(--accent-line)] hover:text-[var(--ink-soft)]"
          >
            <X size={15} strokeWidth={2} />
          </button>
        </div>

        <div className="mt-4 grid gap-2">
          {NEON_THEMES.map((theme) => {
            const selected = current === theme.id
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => onSelect(theme.id)}
                aria-pressed={selected}
                className={`chamfer-sm flex w-full items-center gap-3 border p-3 text-left transition-all active:scale-[0.99] ${
                  selected
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)]'
                    : 'border-[var(--line-soft)] bg-[var(--surface-1)] hover:border-[var(--accent-line)]'
                }`}
              >
                <span className="flex shrink-0 gap-1" aria-hidden="true">
                  {theme.swatches.map((swatch) => (
                    <span
                      key={swatch}
                      className="h-7 w-2.5"
                      style={{ backgroundColor: swatch }}
                    />
                  ))}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[13px] font-semibold tracking-[0.08em] text-[var(--ink)]">
                    {theme.name}
                  </span>
                  <span className="mt-0.5 block font-mono text-[11px] text-[var(--muted)]">
                    {theme.label} · {theme.mode === 'light' ? 'LIGHT' : 'DARK'}
                  </span>
                </span>
                {selected && (
                  <Check
                    size={14}
                    strokeWidth={2.4}
                    className="shrink-0 text-[var(--accent)]"
                  />
                )}
              </button>
            )
          })}
        </div>

        <p className="mt-4 text-center font-mono text-[11px] text-[var(--accent-dim)]">
          LOCAL_ONLY // 配色只保存在本机
        </p>
      </section>
    </div>
  )
}
