import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import { Check, Ellipsis, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { toDateKey } from '../lib/date'
import {
  GOAL_NODE_TITLE_MAX,
  getDaysRemaining,
  getGoalDelta,
  getGoalPace,
  getGoalProgress,
  getGoalVerdict,
  getLitNodeCount,
  getOutcomeOffset,
  getTimeProgress,
  isGoalEnded,
  type Goal,
  type GoalNode,
} from '../lib/goals'
import { formatMonthDay } from '../lib/habits'

interface GoalDetailProps {
  goal: Goal
  todayKey: string
  onToggleNode: (nodeId: string) => void
  onAddNode: (title: string) => void
  onInsertNode: (index: number, title: string) => void
  onRenameNode: (nodeId: string, title: string) => void
  onDeleteNode: (nodeId: string) => void
  onMarkAchieved: () => void
  onAbandon: () => void
  onArchive: () => void
  onReopen: () => void
  onDelete: () => void
}

function percent(value: number | null) {
  return value === null ? '—' : `${Math.round(value * 100)}%`
}

export default function GoalDetail({
  goal,
  todayKey,
  onToggleNode,
  onAddNode,
  onInsertNode,
  onRenameNode,
  onDeleteNode,
  onMarkAchieved,
  onAbandon,
  onArchive,
  onReopen,
  onDelete,
}: GoalDetailProps) {
  const { locale, m } = useI18n()
  const [draft, setDraft] = useState('')
  const [editingNodeId, setEditingNodeId] = useState<string | null>(
    null,
  )
  const [editDraft, setEditDraft] = useState('')
  const [insertAt, setInsertAt] = useState<number | null>(null)
  const [insertDraft, setInsertDraft] = useState('')
  const [addOpen, setAddOpen] = useState(false)
  const [menuNodeId, setMenuNodeId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const ended = isGoalEnded(goal)
  const lit = getLitNodeCount(goal)
  const total = goal.nodes.length
  const timeProgress = getTimeProgress(goal, todayKey)
  const goalProgress = getGoalProgress(goal)
  const verdict = getGoalVerdict(goal, todayKey)
  const delta = getGoalDelta(goal, todayKey)
  const daysLeft = getDaysRemaining(goal, todayKey)
  const remainingNodes = Math.max(0, total - lit)
  const pace = getGoalPace(goal, todayKey)
  const paceText =
    pace.kind === 'per-day'
      ? m.goals.pacePerDay(pace.count)
      : pace.kind === 'every-days'
        ? m.goals.paceEveryDays(pace.days)
        : pace.kind === 'every-weeks'
          ? m.goals.paceEveryWeeks(pace.weeks)
          : pace.kind === 'every-months'
            ? m.goals.paceEveryMonths(pace.months)
            : ''
  const rhythmParts = [
    daysLeft > 0
      ? m.goals.daysLeft(daysLeft)
      : daysLeft === 0
        ? m.goals.dueToday
        : m.goals.overdueDays(-daysLeft),
    remainingNodes > 0 ? m.goals.nodesLeft(remainingNodes) : '',
    paceText,
  ].filter(Boolean)

  // A goal can close while an editor is open (lighting the last node from
  // another row). Close the editors with it.
  useEffect(() => {
    if (!ended) return
    setEditingNodeId(null)
    setEditDraft('')
    setInsertAt(null)
    setMenuNodeId(null)
    setAddOpen(false)
    setDraft('')
  }, [ended])

  useEffect(() => {
    if (menuNodeId === null) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuNodeId(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [menuNodeId])

  const verdictLabel =
    verdict === 'not-started'
      ? m.goals.verdict.notStarted
      : verdict === 'no-nodes'
        ? m.goals.verdict.noNodes
        : verdict === 'overdue'
          ? m.goals.verdict.overdue
          : verdict === 'ahead'
            ? m.goals.verdict.ahead
            : verdict === 'behind'
              ? m.goals.verdict.behind
              : m.goals.verdict.onTrack

  const verdictLine =
    verdict === 'overdue' ||
    verdict === 'not-started' ||
    verdict === 'no-nodes' ||
    delta === null
      ? verdictLabel
      : `${verdictLabel} · ${m.goals.verdictDetail(delta)}`

  const tone =
    verdict === 'behind' || verdict === 'overdue'
      ? 'text-[var(--red)]'
      : verdict === 'not-started' || verdict === 'no-nodes'
        ? 'text-[var(--ink-3)]'
        : 'text-[var(--ink-2)]'

  const outcomeLabel =
    goal.outcome === 'achieved'
      ? m.goals.achieved
      : goal.outcome === 'abandoned'
        ? m.goals.abandoned
        : goal.outcome === 'archived'
          ? m.goals.archived
          : ''

  const endedDate =
    goal.endedAt === null
      ? ''
      : formatMonthDay(toDateKey(new Date(goal.endedAt)), locale)

  const outcomeText =
    goal.outcome === 'achieved'
      ? m.goals.achievedOn(endedDate)
      : goal.outcome === 'abandoned'
        ? m.goals.abandonedOn(endedDate)
        : goal.outcome === 'archived'
          ? m.goals.archivedOn(endedDate)
          : ''

  const offset = getOutcomeOffset(goal)
  const offsetText =
    goal.outcome === 'achieved' && offset !== null
      ? offset > 0
        ? m.goals.late(offset)
        : offset < 0
          ? m.goals.early(-offset)
          : m.goals.onTime
      : ''

  function handleAddNode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = draft.trim()
    if (!title) return
    onAddNode(title)
    setDraft('')
    inputRef.current?.focus()
  }

  function commitPendingEdit() {
    if (editingNodeId === null) return
    const pending = editDraft.trim()
    if (pending) onRenameNode(editingNodeId, pending)
    setEditingNodeId(null)
    setEditDraft('')
  }

  function startEditing(node: GoalNode) {
    if (ended) return
    // Leaving another editor commits what was typed instead of dropping it.
    commitPendingEdit()
    setInsertAt(null)
    setMenuNodeId(null)
    setEditingNodeId(node.id)
    setEditDraft(node.title)
  }

  function commitEdit() {
    if (editingNodeId === null) return
    const title = editDraft.trim()
    if (title) onRenameNode(editingNodeId, title)
    setEditingNodeId(null)
    setEditDraft('')
  }

  function cancelEdit() {
    setEditingNodeId(null)
    setEditDraft('')
  }

  function openMenu(nodeId: string) {
    commitPendingEdit()
    setMenuNodeId((current) =>
      current === nodeId ? null : nodeId,
    )
  }

  function deleteFromMenu(nodeId: string) {
    commitPendingEdit()
    setMenuNodeId(null)
    setInsertAt(null)
    onDeleteNode(nodeId)
  }

  function startInsert(afterIndex: number) {
    if (ended) return
    commitPendingEdit()
    setMenuNodeId(null)
    setInsertDraft('')
    setInsertAt(afterIndex)
  }

  function commitInsert() {
    if (insertAt === null) return
    const title = insertDraft.trim()
    if (title) onInsertNode(insertAt, title)
    setInsertAt(null)
    setInsertDraft('')
  }

  function cancelInsert() {
    setInsertAt(null)
    setInsertDraft('')
  }

  function handleEditKeys(
    event: ReactKeyboardEvent<HTMLInputElement>,
  ) {
    if (event.nativeEvent.isComposing) return
    if (event.key === 'Enter') {
      event.preventDefault()
      commitEdit()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      cancelEdit()
    }
  }

  function handleInsertKeys(
    event: ReactKeyboardEvent<HTMLInputElement>,
  ) {
    if (event.nativeEvent.isComposing) return
    if (event.key === 'Enter') {
      event.preventDefault()
      commitInsert()
    } else if (event.key === 'Escape') {
      event.preventDefault()
      cancelInsert()
    }
  }

  return (
    <div className="mt-4 flex flex-col">
      {ended ? (
        <>
          <div className="flex items-start justify-between gap-3 border-y border-[var(--rule)] py-4">
            <div className="min-w-0">
              <p className="text-[15px] text-[var(--ink)]">
                {outcomeLabel}
              </p>
              <p className="fig mt-1.5 text-[11.5px] text-[var(--ink-3)]">
                {outcomeText}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="fig text-[23px] leading-none text-[var(--ink)]">
                {lit}/{total}
              </p>
              <p className="label mt-2">{m.goals.nodeProgress}</p>
            </div>
          </div>
          {offsetText && (
            <p className="mt-2.5 text-[12.5px] text-[var(--ink-3)]">
              {offsetText}
            </p>
          )}
        </>
      ) : (
        <section className="border-y border-[var(--rule)] py-4">
          <div className="flex items-baseline justify-between">
            <span className="label">{m.goals.timeProgress}</span>
            <span className="fig text-[12.5px] leading-none text-[var(--ink-2)]">
              {percent(timeProgress)}
            </span>
          </div>
          <div className="mt-2 h-[2px] bg-[var(--rule)]">
            <div
              className="h-[2px] bg-[var(--ink-3)]"
              style={{ width: `${timeProgress * 100}%` }}
            />
          </div>

          <div className="mt-4 flex items-baseline justify-between">
            <span className="label">{m.goals.nodeProgress}</span>
            <span className="fig text-[12.5px] leading-none text-[var(--ink)]">
              {percent(goalProgress)}
            </span>
          </div>
          <div className="mt-2 h-[2px] bg-[var(--rule)]">
            <div
              className="h-[2px] bg-[var(--ink)]"
              style={{
                width: `${(goalProgress ?? 0) * 100}%`,
              }}
            />
          </div>

          <p
            className={`mt-3 text-[12.5px] leading-relaxed ${tone}`}
          >
            {verdictLine}
          </p>
          {total > 0 && rhythmParts.length > 0 && (
            <p className="mt-1 text-[11.5px] leading-relaxed text-[var(--ink-3)]">
              {rhythmParts.join(' · ')}
            </p>
          )}
        </section>
      )}

      <section className="mt-7">
        <div className="flex items-baseline justify-between">
          <h2 className="label">{m.goals.nodes}</h2>
          <span
            aria-live="polite"
            className="fig text-[12px] leading-none text-[var(--ink-3)]"
          >
            {lit}/{total}
          </span>
        </div>

        {!ended && total > 0 && (
          <p className="mt-1 text-[11.5px] leading-relaxed text-[var(--ink-3)]">
            {m.goals.nodesEditHint}
          </p>
        )}

        {total === 0 ? (
          <div className="mt-3 border-y border-[var(--rule)] py-4">
            <p className="text-[13.5px] text-[var(--ink-2)]">
              {m.goals.noNodes}
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-[var(--ink-3)]">
              {m.goals.noNodesHint}
            </p>
          </div>
        ) : (
          <ul className="mt-2 border-y border-[var(--rule)]">
            {goal.nodes.map((node, index) => {
              const isLit = node.litAt !== null
              const editing = !ended && editingNodeId === node.id
              const litDate =
                node.litAt === null
                  ? ''
                  : formatMonthDay(
                      toDateKey(new Date(node.litAt)),
                      locale,
                    )
              return (
                <Fragment key={node.id}>
                  <li className="grid grid-cols-[22px_minmax(0,1fr)_auto] gap-x-3 py-3">
                    <div
                      className={`relative flex justify-center self-stretch ${
                        editing ? 'items-start pt-[3px]' : 'items-center'
                      }`}
                    >
                      {index > 0 && (
                        <span
                          aria-hidden="true"
                          className="absolute -top-3 bottom-1/2 left-1/2 w-px -translate-x-1/2 bg-[var(--rule-strong)]"
                        />
                      )}
                      {index < goal.nodes.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="absolute -bottom-3 top-1/2 left-1/2 w-px -translate-x-1/2 bg-[var(--rule-strong)]"
                        />
                      )}
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={isLit}
                        aria-label={
                          isLit
                            ? m.goals.markUnlit(node.title)
                            : m.goals.markLit(node.title)
                        }
                        disabled={ended}
                        data-lit={isLit}
                        onClick={() => onToggleNode(node.id)}
                        className="node-mark"
                      >
                        {isLit ? (
                          <Check
                            size={13}
                            strokeWidth={3}
                            className="tick"
                          />
                        ) : (
                          <span className="fig node-index">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        )}
                      </button>
                    </div>

                    {editing ? (
                      <input
                        autoFocus
                        type="text"
                        value={editDraft}
                        maxLength={GOAL_NODE_TITLE_MAX}
                        aria-label={m.goals.editNode(node.title)}
                        onFocus={(event) =>
                          event.currentTarget.select()
                        }
                        onChange={(event) =>
                          setEditDraft(event.target.value)
                        }
                        onKeyDown={handleEditKeys}
                        className="field min-w-0 self-center text-[15px]"
                      />
                    ) : (
                      <span
                        className={`min-w-0 self-center break-words text-[15px] leading-[1.45] ${
                          isLit
                            ? 'text-[var(--ink)]'
                            : 'text-[var(--ink-2)]'
                        }`}
                      >
                        {node.title}
                      </span>
                    )}

                    <div
                      className={`flex items-center gap-2 ${
                        editing ? 'self-start' : 'self-center'
                      }`}
                    >
                      {editing ? (
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            aria-label={m.goals.saveNode}
                            disabled={!editDraft.trim()}
                            onClick={commitEdit}
                            className="grid h-9 w-9 shrink-0 place-items-center text-[var(--ink)] transition-opacity disabled:opacity-40"
                          >
                            <Check size={15} strokeWidth={2.2} />
                          </button>
                          <button
                            type="button"
                            aria-label={m.app.cancel}
                            onClick={cancelEdit}
                            className="grid h-9 w-9 shrink-0 place-items-center text-[var(--ink-3)] transition-colors hover:text-[var(--ink)]"
                          >
                            <X size={15} strokeWidth={1.9} />
                          </button>
                        </div>
                      ) : (
                        <>
                          {isLit && (
                            <span className="fig text-[10.5px] leading-none text-[var(--ink-3)]">
                              {litDate}
                            </span>
                          )}
                          {!ended && (
                            <button
                              type="button"
                              aria-label={m.goals.nodeActions(node.title)}
                              aria-expanded={menuNodeId === node.id}
                              aria-controls={`goal-node-actions-${node.id}`}
                              onClick={() => openMenu(node.id)}
                              className="relative grid h-6 w-6 shrink-0 place-items-center text-[var(--ink-3)] transition-colors after:absolute after:-inset-[10px] after:content-[''] hover:text-[var(--ink)]"
                            >
                              <Ellipsis size={15} strokeWidth={1.8} />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </li>

                  {!ended && menuNodeId === node.id && (
                    <li className="grid grid-cols-[22px_minmax(0,1fr)_auto] gap-x-3">
                      <div className="relative self-stretch">
                        {index < goal.nodes.length - 1 && (
                          <span
                            aria-hidden="true"
                            className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[var(--rule-strong)]"
                          />
                        )}
                      </div>
                      <div
                        id={`goal-node-actions-${node.id}`}
                        className="col-span-2 flex flex-wrap items-center gap-x-5 gap-y-1 py-1"
                      >
                        <button
                          type="button"
                          onClick={() => startEditing(node)}
                          className="flex min-h-[44px] items-center gap-1 text-[12.5px] font-medium text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
                        >
                          <Pencil size={12} strokeWidth={1.9} />
                          {m.goals.edit}
                        </button>
                        <button
                          type="button"
                          onClick={() => startInsert(index + 1)}
                          className="flex min-h-[44px] items-center gap-1 text-[12.5px] font-medium text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
                        >
                          <Plus size={12} strokeWidth={2} />
                          {m.goals.insertShort}
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteFromMenu(node.id)}
                          className="flex min-h-[44px] items-center gap-1 text-[12.5px] font-medium text-[var(--red)] transition-colors hover:text-[var(--red-hover)]"
                        >
                          <Trash2 size={12} strokeWidth={1.9} />
                          {m.row.delete}
                        </button>
                      </div>
                    </li>
                  )}

                  {!ended && insertAt === index + 1 && (
                    <li className="grid grid-cols-[22px_minmax(0,1fr)_auto] gap-x-3 py-3">
                      <div className="relative flex items-center justify-center self-stretch">
                        <span
                          aria-hidden="true"
                          className="absolute -top-3 bottom-1/2 left-1/2 w-px -translate-x-1/2 bg-[var(--rule-strong)]"
                        />
                        {insertAt < goal.nodes.length && (
                          <span
                            aria-hidden="true"
                            className="absolute -bottom-3 top-1/2 left-1/2 w-px -translate-x-1/2 bg-[var(--rule-strong)]"
                          />
                        )}
                        <span
                          aria-hidden="true"
                          className="node-mark pointer-events-none"
                        >
                          <Plus size={12} strokeWidth={2} />
                        </span>
                      </div>
                      <input
                        autoFocus
                        type="text"
                        value={insertDraft}
                        maxLength={GOAL_NODE_TITLE_MAX}
                        placeholder={m.goals.nodePlaceholder}
                        aria-label={m.goals.insertNode}
                        onChange={(event) =>
                          setInsertDraft(event.target.value)
                        }
                        onKeyDown={handleInsertKeys}
                        className="field min-w-0 self-center text-[15px]"
                      />
                      <div className="flex items-center gap-3 self-center">
                        <button
                          type="button"
                          aria-label={m.goals.saveNode}
                          disabled={!insertDraft.trim()}
                          onClick={commitInsert}
                          className="grid h-9 w-9 shrink-0 place-items-center text-[var(--ink)] transition-opacity disabled:opacity-40"
                        >
                          <Check size={15} strokeWidth={2.2} />
                        </button>
                        <button
                          type="button"
                          aria-label={m.app.cancel}
                          onClick={cancelInsert}
                          className="grid h-9 w-9 shrink-0 place-items-center text-[var(--ink-3)] transition-colors hover:text-[var(--ink)]"
                        >
                          <X size={15} strokeWidth={1.9} />
                        </button>
                      </div>
                    </li>
                  )}
                </Fragment>
              )
            })}
          </ul>
        )}

        {!ended &&
          (addOpen ? (
            <form
              onSubmit={handleAddNode}
              className="mt-3 flex items-end gap-2"
            >
              <input
                ref={inputRef}
                autoFocus
                type="text"
                value={draft}
                maxLength={GOAL_NODE_TITLE_MAX}
                placeholder={m.goals.nodePlaceholder}
                aria-label={m.goals.addNode}
                onChange={(event) => setDraft(event.target.value)}
                className="field min-w-0 flex-1 text-[15px]"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                aria-label={m.goals.addNode}
                className="grid h-11 w-11 shrink-0 place-items-center text-[var(--ink)] transition-opacity disabled:opacity-40"
              >
                <Plus size={18} strokeWidth={2} />
              </button>
              <button
                type="button"
                aria-label={m.app.cancel}
                onClick={() => {
                  setAddOpen(false)
                  setDraft('')
                }}
                className="grid h-11 w-11 shrink-0 place-items-center text-[var(--ink-3)] transition-colors hover:text-[var(--ink)]"
              >
                <X size={16} strokeWidth={1.9} />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="mt-3 flex h-11 items-center gap-1.5 text-[13px] font-medium text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
            >
              <Plus size={14} strokeWidth={2} />
              {m.goals.addNode}
            </button>
          ))}
      </section>

      <div className="mt-10 flex flex-col gap-2">
        {ended ? (
          <button
            type="button"
            onClick={onReopen}
            className="btn btn-ghost h-11 w-full"
          >
            {m.goals.reopen}
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={onMarkAchieved}
              className="btn btn-primary h-11 w-full"
            >
              {m.goals.markAchieved}
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onAbandon}
                className="btn btn-ghost h-11 min-w-0 px-3"
              >
                {m.goals.abandon}
              </button>
              <button
                type="button"
                onClick={onArchive}
                className="btn btn-ghost h-11 min-w-0 px-3"
              >
                {m.goals.archive}
              </button>
            </div>
          </>
        )}

        <button
          type="button"
          onClick={onDelete}
          className="btn btn-danger mt-6 h-11 w-full border border-[var(--rule)]"
        >
          <Trash2 size={14} strokeWidth={1.8} />
          {m.goals.deleteGoal}
        </button>
      </div>
    </div>
  )
}
