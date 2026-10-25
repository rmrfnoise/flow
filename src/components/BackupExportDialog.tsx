import { useEffect, useRef, useState } from 'react'
import { Check, Copy, Download, FileJson, X } from 'lucide-react'
import { copyText, downloadTextFile } from '../lib/backup'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { useI18n } from '../i18n/I18nProvider'

interface BackupExportDialogProps {
  json: string
  fileName: string
  onClose: () => void
}

type ExportStatus = 'idle' | 'download' | 'copied' | 'copyError' | 'downloadError'

export default function BackupExportDialog({
  json,
  fileName,
  onClose,
}: BackupExportDialogProps) {
  const { m } = useI18n()
  const trapRef = useFocusTrap<HTMLDivElement>()
  const downloadRef = useRef<HTMLButtonElement | null>(null)
  const [status, setStatus] = useState<ExportStatus>('idle')
  useBodyScrollLock()

  useEffect(() => {
    const timer = window.setTimeout(() => downloadRef.current?.focus(), 80)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const sizeKb = Math.max(1, Math.round(new Blob([json]).size / 1024))

  function handleDownload() {
    try {
      downloadTextFile(json, fileName)
      setStatus('download')
    } catch {
      setStatus('downloadError')
    }
  }

  async function handleCopy() {
    const copied = await copyText(json)
    setStatus(copied ? 'copied' : 'copyError')
  }

  const statusText =
    status === 'download'
      ? m.settings.backupDownloadStarted
      : status === 'copied'
        ? m.settings.backupCopied
        : status === 'copyError'
          ? m.settings.backupCopyFailed
          : status === 'downloadError'
            ? m.settings.backupDownloadError
            : ''

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <button
        type="button"
        tabIndex={-1}
        aria-label={m.sheet.close}
        onClick={onClose}
        className="absolute inset-0 bg-black/35 backdrop-blur-[1px]"
      />
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="backup-export-title"
        className="dialog-enter relative z-10 max-h-[90dvh] w-full max-w-[380px] overflow-y-auto rounded-[18px] bg-[var(--surface)] p-5 shadow-[var(--shadow-dialog)]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2
              id="backup-export-title"
              className="text-[18px] font-semibold tracking-[-0.015em] text-[var(--text)]"
            >
              {m.settings.backupReady}
            </h2>
            <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--text-3)]">
              {m.settings.backupReadyHint}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={m.sheet.close}
            className="-mr-1 -mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full text-[var(--text-3)] transition-colors hover:bg-[var(--surface-sunken)] hover:text-[var(--text)]"
          >
            <X size={17} strokeWidth={2} />
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2.5 rounded-[12px] border border-[var(--line)] bg-[var(--surface-sunken)] px-3 py-2.5">
          <FileJson
            size={17}
            strokeWidth={1.8}
            className="shrink-0 text-[var(--accent)]"
          />
          <div className="min-w-0">
            <p className="truncate font-mono text-[11px] text-[var(--text)]">
              {fileName}
            </p>
            <p className="mt-0.5 text-[10.5px] text-[var(--text-3)]">
              {sizeKb} KB
            </p>
          </div>
        </div>

        <button
          ref={downloadRef}
          type="button"
          onClick={handleDownload}
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[var(--accent)] text-[14px] font-medium text-[var(--on-accent)] transition-colors hover:bg-[var(--accent-hover)]"
        >
          <Download size={16} strokeWidth={2} />
          {m.settings.downloadFile}
        </button>
        <button
          type="button"
          onClick={() => void handleCopy()}
          className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-[10px] border border-[var(--line)] bg-[var(--surface)] text-[13px] font-medium text-[var(--text)] transition-colors hover:bg-[var(--surface-sunken)]"
        >
          {status === 'copied' ? (
            <Check size={16} strokeWidth={2.2} className="text-[var(--accent)]" />
          ) : (
            <Copy size={16} strokeWidth={1.9} />
          )}
          {m.settings.copyJson}
        </button>

        {statusText && (
          <p
            role="status"
            className={`mt-3 text-center text-[11.5px] leading-relaxed ${
              status === 'copyError' || status === 'downloadError'
                ? 'text-[var(--danger)]'
                : 'text-[var(--text-3)]'
            }`}
          >
            {statusText}
          </p>
        )}

        <details className="mt-3 border-t border-[var(--line)] pt-3">
          <summary className="cursor-pointer text-[11.5px] text-[var(--text-3)]">
            {m.settings.showBackupText}
          </summary>
          <textarea
            readOnly
            value={json}
            rows={6}
            spellCheck={false}
            className="mt-2 w-full resize-none rounded-[10px] border border-[var(--line)] bg-[var(--surface-sunken)] p-2 font-mono text-[10px] leading-relaxed text-[var(--text-2)] outline-none"
          />
        </details>
      </div>
    </div>
  )
}
