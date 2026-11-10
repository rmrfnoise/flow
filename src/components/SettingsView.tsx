import { useRef, useState } from 'react'
import { Check, Download, Trash2, Upload } from 'lucide-react'
import BrandMark from './BrandMark'
import BackupExportDialog from './BackupExportDialog'
import ConfirmDialog from './ConfirmDialog'
import SegmentedTabs from './SegmentedTabs'
import { useI18n } from '../i18n/I18nProvider'
import { LANGUAGE_NAMES, type Locale } from '../i18n/messages'
import type { AppearanceMode } from '../hooks/useAppearance'
import type { StartupPage } from '../hooks/useStartupPage'
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
  startupPage: StartupPage
  onStartupPageChange: (page: StartupPage) => void
  taskCount: number
  habitCount: number
  expenseCount: number
  hasAnyData: boolean
}

const APPEARANCE_OPTIONS: AppearanceMode[] = ['system', 'light', 'dark']
const LANGUAGE_OPTIONS: Locale[] = ['en', 'zh']
const STARTUP_OPTIONS: StartupPage[] = ['tasks', 'habits', 'money']

export default function SettingsView({
  appearanceMode,
  onAppearanceModeChange,
  startupPage,
  onStartupPageChange,
  taskCount,
  habitCount,
  expenseCount,
  hasAnyData,
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
    <div className="flex flex-col gap-9 pb-8">
      <section>
        <h2 className="label">{m.settings.appearance}</h2>
        <p className="mt-1.5 text-[12.5px] text-[var(--ink-3)]">
          {m.settings.appearanceHint}
        </p>

        <div className="mt-3">
          <SegmentedTabs
            ariaLabel={m.settings.appearance}
            options={APPEARANCE_OPTIONS.map((mode) => ({
              value: mode,
              label: m.settings[mode],
            }))}
            value={appearanceMode}
            onChange={onAppearanceModeChange}
          />
        </div>
      </section>

      <section>
        <h2 className="label">{m.settings.language}</h2>
        <p className="mt-1.5 text-[12.5px] text-[var(--ink-3)]">
          {m.settings.languageHint}
        </p>

        <div className="ledger mt-3">
          {LANGUAGE_OPTIONS.map((code) => {
            const active = locale === code
            return (
              <button
                key={code}
                type="button"
                aria-pressed={active}
                onClick={() => setLocale(code)}
                className="flex h-12 w-full items-center justify-between text-left transition-colors hover:bg-[var(--sunken)]"
              >
                <span
                  className={`text-[14px] ${
                    active
                      ? 'text-[var(--ink)]'
                      : 'text-[var(--ink-2)]'
                  }`}
                >
                  {LANGUAGE_NAMES[code]}
                </span>
                {active && (
                  <Check
                    size={15}
                    strokeWidth={2.4}
                    className="text-[var(--red)]"
                  />
                )}
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="label">{m.settings.startup}</h2>
        <p className="mt-1.5 text-[12.5px] text-[var(--ink-3)]">
          {m.settings.startupHint}
        </p>

        <div className="ledger mt-3">
          {STARTUP_OPTIONS.map((page) => {
            const active = startupPage === page
            return (
              <button
                key={page}
                type="button"
                aria-pressed={active}
                onClick={() => onStartupPageChange(page)}
                className="flex h-12 w-full items-center justify-between text-left transition-colors hover:bg-[var(--sunken)]"
              >
                <span
                  className={`text-[14px] ${
                    active
                      ? 'text-[var(--ink)]'
                      : 'text-[var(--ink-2)]'
                  }`}
                >
                  {m.nav[page]}
                </span>
                {active && (
                  <Check
                    size={15}
                    strokeWidth={2.4}
                    className="text-[var(--red)]"
                  />
                )}
              </button>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="label">{m.settings.data}</h2>
        <div className="ledger mt-3">
          <div className="py-3.5">
            <p className="text-[14px] text-[var(--ink)]">
              {m.settings.dataLocal}
            </p>
            <p className="fig mt-1 text-[11.5px] text-[var(--ink-3)]">
              {m.settings.dataSummary(
                taskCount,
                habitCount,
                expenseCount,
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={handleExport}
            className="flex h-12 w-full items-center gap-2.5 text-left text-[14px] text-[var(--ink)] transition-colors hover:bg-[var(--sunken)]"
          >
            <Download
              size={15}
              strokeWidth={1.8}
              className="text-[var(--ink-3)]"
            />
            {m.settings.exportBackup}
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-12 w-full items-center gap-2.5 text-left text-[14px] text-[var(--ink)] transition-colors hover:bg-[var(--sunken)]"
          >
            <Upload
              size={15}
              strokeWidth={1.8}
              className="text-[var(--ink-3)]"
            />
            {m.settings.importBackup}
          </button>
          <button
            type="button"
            onClick={() => setClearOpen(true)}
            disabled={!hasAnyData}
            className="flex h-12 w-full items-center gap-2.5 text-left text-[14px] text-[var(--red)] transition-colors hover:bg-[var(--red-soft)] disabled:cursor-not-allowed disabled:text-[var(--ink-3)] disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <Trash2 size={15} strokeWidth={1.8} />
            {m.settings.clearData}
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
        <p className="mt-2.5 text-[11.5px] leading-relaxed text-[var(--ink-3)]">
          {m.settings.backupHint}
        </p>
        {dataError && (
          <p
            role="alert"
            className="mt-2 text-[12.5px] text-[var(--red)]"
          >
            {dataError}
          </p>
        )}
      </section>

      <section>
        <h2 className="label">{m.settings.about}</h2>
        <div className="mt-3 border-y border-[var(--rule)] py-4">
          <BrandMark />
          <p className="mt-4 max-w-[420px] text-[13px] leading-relaxed text-[var(--ink-2)]">
            {m.settings.aboutText}
          </p>
          <p className="fig mt-3 text-[11px] text-[var(--ink-3)]">
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
