'use client'

import { useEffect, useRef, useState } from 'react'
import {
  ArrowRightIcon,
  ArrowUpIcon,
  CheckIcon,
  GitCompareIcon,
  ImageIcon,
  PaperclipIcon,
  ShieldCheckIcon,
  SparklesIcon,
  Undo2Icon,
  XIcon,
} from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'

import { useDesignSystem } from '../preset'
import type { DesignSystem } from '../preset'
import {
  type AuditIssue,
  type DiffRow,
  REFINE_ACTIONS,
  type RefineAction,
  applyRows,
  auditSystem,
  diffFromTarget,
  extractFromImage,
  matchPrompt,
} from './ai'

type DiffStatus = 'pending' | 'applied' | 'discarded' | 'reverted'

type Turn =
  | { id: number; kind: 'user'; text: string; attachment?: string }
  | { id: number; kind: 'text'; text: string }
  | { id: number; kind: 'thinking' }
  | {
      id: number
      kind: 'diff'
      intro: string
      palette?: string[]
      rows: DiffRow[]
      status: DiffStatus
      appliedCount: number
      snapshot: DesignSystem | null
    }
  | {
      id: number
      kind: 'audit'
      intro: string
      issues: (AuditIssue & { fixed?: boolean })[]
    }

export function Assistant({ onClose }: { onClose: () => void }) {
  const { designSystem, setDesignSystem } = useDesignSystem()
  const idRef = useRef(2)
  const nextId = () => idRef.current++
  const [turns, setTurns] = useState<Turn[]>(() => {
    const preset = matchPrompt('linear')
    return [
      { id: 0, kind: 'user', text: preset.prompt },
      {
        id: 1,
        kind: 'diff',
        intro: preset.intro,
        rows: diffFromTarget(designSystem, preset.target),
        status: 'pending',
        appliedCount: 0,
        snapshot: null,
      },
    ]
  })
  const [input, setInput] = useState('')
  const threadRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = threadRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [turns])

  function withThinking(userTurn: Turn, produce: () => Turn[]) {
    const thinkingId = nextId()
    setTurns((t) => [...t, userTurn, { id: thinkingId, kind: 'thinking' }])
    window.setTimeout(() => {
      setTurns((t) => [...t.filter((x) => x.id !== thinkingId), ...produce()])
    }, 720)
  }

  function compose(prompt: string) {
    const preset = matchPrompt(prompt)
    withThinking({ id: nextId(), kind: 'user', text: prompt }, () => [
      {
        id: nextId(),
        kind: 'diff',
        intro: preset.intro,
        rows: diffFromTarget(designSystem, preset.target),
        status: 'pending',
        appliedCount: 0,
        snapshot: null,
      },
    ])
  }

  function refine(action: RefineAction) {
    withThinking({ id: nextId(), kind: 'user', text: action.prompt }, () => {
      const rows = diffFromTarget(designSystem, action.target)
      return [
        {
          id: nextId(),
          kind: 'diff',
          intro: action.intro,
          rows,
          status: 'pending',
          appliedCount: 0,
          snapshot: null,
        },
      ]
    })
  }

  function audit() {
    withThinking(
      { id: nextId(), kind: 'user', text: 'Audit my system' },
      () => [
        {
          id: nextId(),
          kind: 'audit',
          intro:
            'Scanned color, type, and components — three things to tighten:',
          issues: auditSystem(),
        },
      ],
    )
  }

  function extract() {
    const result = extractFromImage(designSystem)
    withThinking(
      { id: nextId(), kind: 'user', text: '', attachment: result.fileName },
      () => [
        {
          id: nextId(),
          kind: 'diff',
          intro: result.intro,
          palette: result.palette,
          rows: result.rows,
          status: 'pending',
          appliedCount: 0,
          snapshot: null,
        },
      ],
    )
  }

  function toggleRow(turnId: number, rowId: string) {
    setTurns((t) =>
      t.map((turn) =>
        turn.id === turnId && turn.kind === 'diff'
          ? {
              ...turn,
              rows: turn.rows.map((r) =>
                r.id === rowId ? { ...r, included: !r.included } : r,
              ),
            }
          : turn,
      ),
    )
  }

  function applyDiff(turnId: number) {
    const turn = turns.find((t) => t.id === turnId)
    if (!turn || turn.kind !== 'diff') return
    const snapshot = designSystem
    setDesignSystem(applyRows(snapshot, turn.rows))
    const count = turn.rows.filter((r) => r.included).length
    setTurns((t) =>
      t.map((x) =>
        x.id === turnId && x.kind === 'diff'
          ? { ...x, status: 'applied', appliedCount: count, snapshot }
          : x,
      ),
    )
  }

  function undoDiff(turnId: number) {
    const turn = turns.find((t) => t.id === turnId)
    if (!turn || turn.kind !== 'diff' || !turn.snapshot) return
    setDesignSystem(turn.snapshot)
    setTurns((t) =>
      t.map((x) =>
        x.id === turnId && x.kind === 'diff' ? { ...x, status: 'reverted' } : x,
      ),
    )
  }

  function discardDiff(turnId: number) {
    setTurns((t) =>
      t.map((x) =>
        x.id === turnId && x.kind === 'diff'
          ? { ...x, status: 'discarded' }
          : x,
      ),
    )
  }

  function fixIssue(turnId: number, issue: AuditIssue) {
    setDesignSystem(issue.fix.apply(designSystem))
    setTurns((t) =>
      t.map((turn) =>
        turn.id === turnId && turn.kind === 'audit'
          ? {
              ...turn,
              issues: turn.issues.map((i) =>
                i.id === issue.id ? { ...i, fixed: true } : i,
              ),
            }
          : turn,
      ),
    )
  }

  function submit() {
    const value = input.trim()
    if (!value) return
    setInput('')
    compose(value)
  }

  return (
    <div className="flex w-80 shrink-0 flex-col border-l bg-card max-lg:hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b px-3 py-2.5">
        <div className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
          <SparklesIcon className="size-4" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium">Assistant</div>
          <div className="text-[11px] text-fg-muted">
            Composes, refines, and audits
          </div>
        </div>
        <Quiet onPress={onClose} label="Close assistant">
          <XIcon className="size-4" />
        </Quiet>
      </div>

      {/* Thread */}
      <div
        ref={threadRef}
        className="scrollbar-none flex flex-1 flex-col gap-4 overflow-y-auto p-3"
      >
        {turns.map((turn) => (
          <TurnView
            key={turn.id}
            turn={turn}
            onToggle={toggleRow}
            onApply={applyDiff}
            onUndo={undoDiff}
            onDiscard={discardDiff}
            onFix={fixIssue}
          />
        ))}
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-1.5 border-t px-3 pt-2.5">
        {REFINE_ACTIONS.map((a) => (
          <Chip key={a.id} onPress={() => refine(a)}>
            {a.label}
          </Chip>
        ))}
        <Chip onPress={audit}>
          <ShieldCheckIcon className="size-3" />
          Audit
        </Chip>
        <Chip onPress={extract}>
          <ImageIcon className="size-3" />
          Extract
        </Chip>
      </div>

      {/* Input */}
      <div className="flex items-center gap-2 p-3">
        <Quiet onPress={extract} label="Attach image">
          <PaperclipIcon className="size-4" />
        </Quiet>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
          }}
          placeholder="Describe a change, or paste a URL…"
          className="h-9 min-w-0 flex-1 rounded-md border bg-neutral px-3 text-sm outline-none placeholder:text-fg-muted focus-visible:focus-ring"
        />
        <ButtonPrimitives.Button
          onPress={submit}
          aria-label="Send"
          className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-fg-on-primary focus-reset transition-opacity hover:opacity-90 focus-visible:focus-ring"
        >
          <ArrowUpIcon className="size-4" />
        </ButtonPrimitives.Button>
      </div>
    </div>
  )
}

/* --------------------------------- Turns --------------------------------- */

function TurnView({
  turn,
  onToggle,
  onApply,
  onUndo,
  onDiscard,
  onFix,
}: {
  turn: Turn
  onToggle: (turnId: number, rowId: string) => void
  onApply: (turnId: number) => void
  onUndo: (turnId: number) => void
  onDiscard: (turnId: number) => void
  onFix: (turnId: number, issue: AuditIssue) => void
}) {
  if (turn.kind === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-xl rounded-br-sm bg-primary px-3 py-1.5 text-xs leading-relaxed text-fg-on-primary">
          {turn.attachment ? (
            <span className="flex items-center gap-1.5 font-mono">
              <ImageIcon className="size-3.5" />
              {turn.attachment}
            </span>
          ) : (
            turn.text
          )}
        </div>
      </div>
    )
  }

  if (turn.kind === 'thinking') {
    return (
      <AssistantRow>
        <span className="flex items-center gap-1.5 text-xs text-primary">
          <span className="size-1.5 animate-pulse rounded-full bg-primary" />
          Thinking…
        </span>
      </AssistantRow>
    )
  }

  if (turn.kind === 'text') {
    return (
      <AssistantRow>
        <p className="text-sm leading-relaxed">{turn.text}</p>
      </AssistantRow>
    )
  }

  if (turn.kind === 'audit') {
    return (
      <AssistantRow>
        <p className="text-sm leading-relaxed">{turn.intro}</p>
        <div className="mt-2 flex flex-col rounded-lg border bg-bg">
          {turn.issues.map((issue) => (
            <div
              key={issue.id}
              className="flex items-start gap-2.5 border-b p-2.5 last:border-b-0"
            >
              <span
                className={cn(
                  'mt-1 size-2 shrink-0 rounded-full',
                  issue.severity === 'high' ? 'bg-danger' : 'bg-warning',
                )}
              />
              <div className="flex-1">
                <div className="text-xs font-medium">{issue.title}</div>
                <div className="text-xs text-fg-muted">{issue.detail}</div>
              </div>
              <ButtonPrimitives.Button
                onPress={() => onFix(turn.id, issue)}
                isDisabled={issue.fixed}
                className={cn(
                  'shrink-0 rounded-md border px-2 py-1 text-[11px] focus-reset transition-colors focus-visible:focus-ring',
                  issue.fixed
                    ? 'border-transparent text-success'
                    : 'hover:bg-neutral',
                )}
              >
                {issue.fixed ? (
                  <span className="flex items-center gap-1">
                    <CheckIcon className="size-3" />
                    Fixed
                  </span>
                ) : (
                  issue.fix.label
                )}
              </ButtonPrimitives.Button>
            </div>
          ))}
        </div>
      </AssistantRow>
    )
  }

  // diff
  return (
    <AssistantRow>
      <p className="text-sm leading-relaxed">{turn.intro}</p>
      {turn.palette && (
        <div className="mt-2 flex gap-1.5">
          {turn.palette.map((c) => (
            <span
              key={c}
              className="size-6 rounded-md border"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      )}
      <DiffCard
        turn={turn}
        onToggle={onToggle}
        onApply={onApply}
        onUndo={onUndo}
        onDiscard={onDiscard}
      />
    </AssistantRow>
  )
}

function DiffCard({
  turn,
  onToggle,
  onApply,
  onUndo,
  onDiscard,
}: {
  turn: Extract<Turn, { kind: 'diff' }>
  onToggle: (turnId: number, rowId: string) => void
  onApply: (turnId: number) => void
  onUndo: (turnId: number) => void
  onDiscard: (turnId: number) => void
}) {
  if (turn.rows.length === 0) {
    return (
      <div className="mt-2 rounded-lg border bg-bg px-3 py-2 text-xs text-fg-muted">
        Already matches — nothing to change.
      </div>
    )
  }

  if (turn.status === 'applied') {
    return (
      <div className="mt-2 flex items-center gap-2 rounded-lg border bg-bg px-3 py-2 text-xs text-success">
        <CheckIcon className="size-4" />
        Applied {turn.appliedCount}{' '}
        {turn.appliedCount === 1 ? 'change' : 'changes'}
        <ButtonPrimitives.Button
          onPress={() => onUndo(turn.id)}
          className="ml-auto flex items-center gap-1 text-fg-muted underline-offset-2 focus-reset hover:underline focus-visible:focus-ring"
        >
          <Undo2Icon className="size-3" />
          Undo
        </ButtonPrimitives.Button>
      </div>
    )
  }

  if (turn.status === 'discarded' || turn.status === 'reverted') {
    return (
      <div className="mt-2 flex items-center gap-2 rounded-lg border bg-bg px-3 py-2 text-xs text-fg-muted">
        <XIcon className="size-3.5" />
        {turn.status === 'discarded' ? 'Discarded' : 'Reverted'}
      </div>
    )
  }

  const selected = turn.rows.filter((r) => r.included).length

  return (
    <div className="mt-2 overflow-hidden rounded-lg border bg-bg">
      <div className="flex items-center justify-between border-b px-3 py-2 text-[11px] font-medium text-fg-muted">
        <span className="flex items-center gap-1.5">
          <GitCompareIcon className="size-3.5 text-primary" />
          Proposed changes
        </span>
        <span>{selected} selected</span>
      </div>
      {turn.rows.map((row) => (
        <ButtonPrimitives.Button
          key={row.id}
          onPress={() => onToggle(turn.id, row.id)}
          className={cn(
            'flex w-full items-center gap-2.5 border-b px-3 py-2 text-left focus-reset transition-colors last:border-b-0 hover:bg-neutral focus-visible:focus-ring',
            !row.included && 'opacity-40',
          )}
        >
          <span className="w-16 shrink-0 text-xs">{row.axis}</span>
          <span className="flex min-w-0 flex-1 items-center gap-1.5 font-mono text-[11px] text-fg-muted">
            {row.kind === 'color' && (
              <span
                className="size-3 shrink-0 rounded-full border"
                style={{ backgroundColor: row.fromColor }}
              />
            )}
            <span className="truncate">{row.fromLabel}</span>
            <ArrowRightIcon className="size-3 shrink-0" />
            {row.kind === 'color' && (
              <span
                className="size-3 shrink-0 rounded-full border"
                style={{ backgroundColor: row.toColor }}
              />
            )}
            <span className="truncate font-medium text-fg">{row.toLabel}</span>
          </span>
          <span
            className={cn(
              'flex size-4 shrink-0 items-center justify-center rounded border',
              row.included
                ? 'border-primary bg-primary text-fg-on-primary'
                : 'border-border',
            )}
          >
            {row.included && <CheckIcon className="size-3" />}
          </span>
        </ButtonPrimitives.Button>
      ))}
      <div className="flex items-center gap-2 p-2.5">
        <ButtonPrimitives.Button
          onPress={() => onApply(turn.id)}
          isDisabled={selected === 0}
          className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-fg-on-primary focus-reset transition-opacity hover:opacity-90 focus-visible:focus-ring disabled:opacity-50"
        >
          <CheckIcon className="size-3.5" />
          Apply {selected} {selected === 1 ? 'change' : 'changes'}
        </ButtonPrimitives.Button>
        <ButtonPrimitives.Button
          onPress={() => onDiscard(turn.id)}
          className="rounded-md border px-3 py-1.5 text-xs text-fg-muted focus-reset transition-colors hover:bg-neutral focus-visible:focus-ring"
        >
          Discard
        </ButtonPrimitives.Button>
      </div>
    </div>
  )
}

/* --------------------------------- Atoms --------------------------------- */

function AssistantRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        <SparklesIcon className="size-3" />
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

function Chip({
  onPress,
  children,
}: {
  onPress: () => void
  children: React.ReactNode
}) {
  return (
    <ButtonPrimitives.Button
      onPress={onPress}
      className="flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs text-fg-muted focus-reset transition-colors hover:bg-neutral hover:text-fg focus-visible:focus-ring"
    >
      {children}
    </ButtonPrimitives.Button>
  )
}

function Quiet({
  onPress,
  label,
  children,
}: {
  onPress: () => void
  label: string
  children: React.ReactNode
}) {
  return (
    <ButtonPrimitives.Button
      onPress={onPress}
      aria-label={label}
      className="flex size-7 items-center justify-center rounded-md text-fg-muted focus-reset transition-colors hover:bg-neutral hover:text-fg focus-visible:focus-ring"
    >
      {children}
    </ButtonPrimitives.Button>
  )
}
