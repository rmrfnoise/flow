import { useRef, useState } from 'react'
import {
  Check,
  Download,
  Monitor,
  Moon,
  Sun,
  Trash2,
  Upload,
} from 'lucide-react'
import BrandMark from './BrandMark'
import BackupExportDialog from './BackupExportDialog'
import ConfirmDialog from './ConfirmDialog'
import { useI18n } from '../i18n/I18nProvider'
import type { Locale } from '../i18n/messages'
import type { AppearanceMode } from '../hooks/useAppearance'
import {
  applyBackup,
  backupFileName,
  clearAllData,
  createBackup,
  parseBackup,
  serializeBackup,
  type BackupSummary,
  type FlowBackup,
} from '../lib/backup'

interface SettingsViewProps {
  appearanceMode: AppearanceMode
  onAppearanceModeChange: (mode: AppearanceMode) => void
  taskCount: number
  habitCount: number
  expenseCount: number
}

const APPEARANCE_OPTIONS: AppearanceMode[] = ['system', 'light', 'dark']
const LANGUAGE_OPTIONS: Locale[] = ['en', 'zh']

export default function SettingsView({
  appearanceMode,
  onAppearanceModeChange,
  taskCount,
  habitCount,
  expenseCount,
}: SettingsViewProps) {
  const { locale, setLocale, m } = useI18n()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [importCandidate, setImportCandidate] = useState<{
    backup: FlowBackup
    summary: BackupSummary
  } | null>(null)
  const [clearOpen, setClearOpen] = useState(false)
  const [dataError, setDataError] = useState('')
  const [exportCandidate, setExportCandidate] = useState<{
    json: string
    fileName: string
  } | null>(null)

  function handleExport() {
    try {
      const backup = createBackup()
      setExportCandidate({
        json: serializeBackup(backup),
        fileName: backupFileName(),
      })
      setDataError('')
    } catch {
      setDataError(m.settings.exportError)
    }
  }

  async function handleImportFile(file: File) {
    if (file.size > 5 * 1024 * 1024) {
      setDataError(m.settings.importInvalid)
      return
    }

    try {
      const result = parseBackup(await file.text())
      if (!result.ok) {
        setDataError(
          result.reason === 'unsupported'
            ? m.settings.importUnsupported
            : m.settings.importInvalid,
        )
        return
      }
      setDataError('')
      setImportCandidate({
        backup: result.backup,
        summary: result.summary,
      })
    } catch {
      setDataError(m.settings.importError)
    }
  }

  function handleRestore() {
    if (!importCandidate) return
    try {
      applyBackup(importCandidate.backup)
      window.location.reload()
    } catch {
      setImportCandidate(null)
      setDataError(m.settings.importError)
    }
  }

  function handleClear() {
    try {
      clearAllData()
      window.location.reload()
    } catch {
      setClearOpen(false)
      setDataError(m.settings.exportError)
    }
  }

  return (
    <div className="flex max-w-[560px] flex-col gap-7 pb-6">
      <section>
        <h2 className="px-1 text-[15px] font-semibold text-[var(--text)]">
          {m.settings.appearance}
        </h2>
        <p className="mt-1 px-1 text-[12.5px] leading-relaxed text-[var(--text-3)]">
          {m.settings.appearanceHint}
        </p>

        <div className="mt-3 grid grid-cols-3 gap-1 rounded-[12px] bg-[var(--surface-sunken)] p-1">
          {APPEARANCE_OPTIONS.map((mode) => {
            const active = appearanceMode === mode
            return (
              <button
                key={mode}
                type="button"
                aria-pressed={active}
                onClick={() => onAppearanceModeChange(mode)}
                className={`flex h-14 flex-col items-center justify-center gap-1 rounded-[9px] text-[12px] font-medium transition-all ${
                  active
                    ? 'bg-[var(--segment-active)] text-[var(--text)] shadow-[var(--shadow-card)]'
                    : 'text-[var(--text-2)] hover:text-[var(--text)]'
                }`}
              >
                {mode === 'system' ? (
                  <Monitor size={16} strokeWidth={1.9} />
                ) : mode === 'light' ? (
                  <Sun size={16} strokeWidth={1.9} />
                ) : (
                  <Moon size={16} strokeWidth={1.9} />
                )}
                {m.settings[mode]}
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="px-1 text-[15px] font-semibold text-[var(--text)]">
          {m.settings.language}
        </h2>
        <p className="mt-1 px-1 text-[12.5px] leading-relaxed text-[var(--text-3)]">
          {m.settings.languageHint}
        </p>

        <div className="mt-3 overflow-hidden rounded-[16px] border border-[var(--line)] bg-[var(--surface)]">
          {LANGUAGE_OPTIONS.map((code, index) => {
            const active = locale === code
            return (
              <button
                key={code}
                type="button"
                aria-pressed={active}
                onClick={() => setLocale(code)}
                className={`flex h-12 w-full items-center justify-between px-4 text-left transition-colors hover:bg-[var(--surface-sunken)] ${
                  index > 0 ? 'border-t border-[var(--line)]' : ''
                }`}
              >
                <span className="text-[15px] text-[var(--text)]">
                  {code === 'en' ? 'English' : '简体中文'}
                </span>
                {active && (
                  <Check
                    size={17}
                    strokeWidth={2.4}
                    className="text-[var(--accent)]"
                  />
                )}
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="px-1 text-[15px] font-semibold text-[var(--text)]">
          {m.settings.data}
        </h2>
        <div className="mt-3 flex flex-col gap-1 rounded-[16px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
          <span className="text-[14px] text-[var(--text)]">
            {m.settings.dataLocal}
          </span>
          <span className="font-mono text-[12px] tabular-nums text-[var(--text-3)] sm:text-right">
            {m.settings.dataSummary(
              taskCount,
              habitCount,
              expenseCount,
            )}
          </span>
        </div>

        <p className="mt-3 px-1 text-[12.5px] leading-relaxed text-[var(--text-3)]">
          {m.settings.backupHint}
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="flex h-11 items-center justify-center gap-1.5 rounded-[12px] border border-[var(--line)] bg-[var(--surface)] text-[13px] font-medium text-[var(--text)] transition-colors hover:bg-[var(--surface-sunken)]"
          >
            <Download size={15} strokeWidth={1.9} />
            {m.settings.exportBackup}
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-11 items-center justify-center gap-1.5 rounded-[12px] border border-[var(--line)] bg-[var(--surface)] text-[13px] font-medium text-[var(--text)] transition-colors hover:bg-[var(--surface-sunken)]"
          >
            <Upload size={15} strokeWidth={1.9} />
            {m.settings.importBackup}
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(event) => {
            const file = event.currentTarget.files?.[0]
            event.currentTarget.value = ''
            if (file) void handleImportFile(file)
          }}
        />
        {dataError && (
          <p
            role="alert"
            className="mt-2 px-1 text-[12px] text-[var(--danger)]"
          >
            {dataError}
          </p>
        )}

        <button
          type="button"
          onClick={() => setClearOpen(true)}
          className="mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-[10px] text-[12.5px] font-medium text-[var(--danger)] transition-colors hover:bg-[var(--danger-soft)]"
        >
          <Trash2 size={14} strokeWidth={1.9} />
          {m.settings.clearData}
        </button>
      </section>

      <section>
        <h2 className="px-1 text-[15px] font-semibold text-[var(--text)]">
          {m.settings.about}
        </h2>
        <div className="mt-3 rounded-[16px] border border-[var(--line)] bg-[var(--surface)] px-4 py-4">
          <BrandMark />
          <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-2)]">
            {m.settings.aboutText}
          </p>
          <p className="mt-2 text-[11.5px] text-[var(--text-3)]">
            {m.settings.version}
          </p>
        </div>
      </section>

      {exportCandidate && (
        <BackupExportDialog
          json={exportCandidate.json}
          fileName={exportCandidate.fileName}
          onClose={() => setExportCandidate(null)}
        />
      )}

      {importCandidate && (
        <ConfirmDialog
          title={m.settings.importTitle}
          description={m.settings.importDescription(
            importCandidate.summary.tasks,
            importCandidate.summary.habits,
            importCandidate.summary.expenses,
            importCandidate.summary.categories,
          )}
          cancelLabel={m.app.cancel}
          confirmLabel={m.settings.importConfirm}
          onClose={() => setImportCandidate(null)}
          onConfirm={handleRestore}
        />
      )}

      {clearOpen && (
        <ConfirmDialog
          title={m.settings.clearTitle}
          description={m.settings.clearDescription(
            taskCount,
            habitCount,
            expenseCount,
          )}
          cancelLabel={m.app.cancel}
          confirmLabel={m.settings.clearConfirm}
          onClose={() => setClearOpen(false)}
          onConfirm={handleClear}
        />
      )}
    </div>
  )
}
