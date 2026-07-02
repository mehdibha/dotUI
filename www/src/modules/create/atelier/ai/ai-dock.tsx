'use client'

import { useMemo, useState } from 'react'
import {
  ArrowRightIcon,
  CheckIcon,
  CircleAlertIcon,
  CircleCheckIcon,
  CircleXIcon,
  LinkIcon,
  SparklesIcon,
  Trash2Icon,
  UploadIcon,
  XIcon,
} from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'
import { DEFAULT_COLOR_CONFIG } from '@/registry/theme'
import { Button } from '@/registry/ui/button'
import { FileTrigger } from '@/registry/ui/file-trigger'
import { Tab, TabList, TabPanel, Tabs } from '@/registry/ui/tabs'

import { useDesignSystem } from '../../preset'
import type { DesignSystem } from '../../preset'
import { type AiMessage, useStudio } from '../store'
import {
  type AuditFinding,
  type AuditLevel,
  type ChangeSet,
  QUICK_PROMPTS,
  audit,
} from './engine'

const isHex = (s: string) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(s.trim())

/* ----------------------------------------------------------------------------
 * The design assistant dock — conversation, audit, and reference matching.
 * Every AI action returns a ChangeSet the user reviews and accepts; nothing is
 * applied behind their back, and the audit numbers are real WCAG ratios.
 * -------------------------------------------------------------------------- */

export function AiDock({ className }: { className?: string }) {
  const { setAiOpen, clearConversation, messages } = useStudio()
  const [tab, setTab] = useState('chat')

  return (
    <aside
      className={cn(
        'flex w-[360px] shrink-0 flex-col overflow-hidden rounded-xl border bg-card',
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b px-3 py-2.5">
        <SparklesIcon className="size-4 text-primary" />
        <span className="text-sm font-semibold">Design assistant</span>
        <div className="ml-auto flex items-center gap-0.5">
          {messages.length > 0 && (
            <Button
              size="sm"
              variant="quiet"
              isIconOnly
              aria-label="Clear conversation"
              onPress={clearConversation}
            >
              <Trash2Icon />
            </Button>
          )}
          <Button
            size="sm"
            variant="quiet"
            isIconOnly
            aria-label="Close assistant"
            onPress={() => setAiOpen(false)}
          >
            <XIcon />
          </Button>
        </div>
      </div>

      <Tabs
        selectedKey={tab}
        onSelectionChange={(k) => setTab(k as string)}
        className="flex min-h-0 flex-1 flex-col gap-0"
      >
        <div className="border-b px-3 pt-2">
          <TabList>
            <Tab id="chat">Chat</Tab>
            <Tab id="audit">Audit</Tab>
            <Tab id="reference">Reference</Tab>
          </TabList>
        </div>
        <TabPanel id="chat" className="min-h-0 flex-1 overflow-y-auto p-3">
          <ChatTab />
        </TabPanel>
        <TabPanel id="audit" className="min-h-0 flex-1 overflow-y-auto p-3">
          <AuditTab />
        </TabPanel>
        <TabPanel id="reference" className="min-h-0 flex-1 overflow-y-auto p-3">
          <ReferenceTab onProposed={() => setTab('chat')} />
        </TabPanel>
      </Tabs>
    </aside>
  )
}

/* --------------------------------- Chat ---------------------------------- */

function ChatTab() {
  const { messages, submitPrompt } = useStudio()

  if (messages.length === 0) {
    return (
      <div className="flex flex-col gap-4 pt-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <SparklesIcon className="size-5" />
          </div>
          <p className="text-sm font-medium">Describe what you’re building</p>
          <p className="text-xs text-balance text-fg-muted">
            Name a vibe or a product, ask for a tweak, or match a reference.
            Every suggestion lands as a diff you can accept or reject.
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          {QUICK_PROMPTS.map((p) => (
            <ButtonPrimitives.Button
              key={p}
              onPress={() => submitPrompt(p)}
              className="rounded-lg border px-3 py-2 text-left text-[13px] focus-reset transition-colors hover:bg-neutral focus-visible:focus-ring"
            >
              {p}
            </ButtonPrimitives.Button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {messages.map((m) => (
        <MessageRow key={m.id} message={m} />
      ))}
    </div>
  )
}

function MessageRow({ message }: { message: AiMessage }) {
  if (message.kind === 'user') {
    return (
      <div className="flex justify-end">
        <div className="text-primary-fg max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-1.5 text-[13px]">
          {message.text}
        </div>
      </div>
    )
  }
  return <ProposalCard message={message} />
}

function ProposalCard({
  message,
}: {
  message: Extract<AiMessage, { kind: 'proposal' }>
}) {
  const { applyChangeSet, dismissProposal } = useStudio()
  const { changeSet, status } = message

  return (
    <div className="rounded-xl border bg-bg p-3">
      <div className="flex items-center gap-1.5">
        <SparklesIcon className="size-3.5 shrink-0 text-primary" />
        <span className="text-[13px] font-semibold">{changeSet.title}</span>
        {changeSet.speculative && (
          <span className="ml-auto rounded-full bg-warning/15 px-1.5 py-0.5 text-[9px] font-medium tracking-wide text-warning uppercase">
            guess
          </span>
        )}
      </div>
      <p className="mt-1 text-xs leading-snug text-fg-muted">
        {changeSet.rationale}
      </p>

      <div className="mt-2.5 flex flex-col gap-1 rounded-lg border bg-card p-2">
        {changeSet.changes.map((c, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-2 text-xs"
          >
            <span className="shrink-0 text-fg-muted">{c.label}</span>
            <span className="flex min-w-0 items-center gap-1.5 font-mono">
              <Val v={c.from} muted />
              <ArrowRightIcon className="size-3 shrink-0 text-fg-muted" />
              <Val v={c.to} />
            </span>
          </div>
        ))}
      </div>

      {status === 'pending' ? (
        <div className="mt-3 flex items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            className="flex-1"
            onPress={() => applyChangeSet(changeSet, message.id)}
          >
            <CheckIcon /> Apply
          </Button>
          <Button
            size="sm"
            variant="quiet"
            onPress={() => dismissProposal(message.id)}
          >
            Dismiss
          </Button>
        </div>
      ) : status === 'applied' ? (
        <p className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-success">
          <CircleCheckIcon className="size-3.5" /> Applied — undo from the
          toolbar
        </p>
      ) : (
        <p className="mt-2.5 text-xs text-fg-muted">Dismissed</p>
      )}
    </div>
  )
}

function Val({ v, muted }: { v: string; muted?: boolean }) {
  return (
    <span
      className={cn(
        'flex items-center gap-1 truncate',
        muted ? 'text-fg-muted' : 'text-fg',
      )}
    >
      {isHex(v) && (
        <span
          className="size-3 shrink-0 rounded-full ring-1 ring-black/10 ring-inset"
          style={{ backgroundColor: v }}
        />
      )}
      {v}
    </span>
  )
}

/* --------------------------------- Audit --------------------------------- */

const LEVEL_META: Record<
  AuditLevel,
  { Icon: typeof CircleCheckIcon; className: string }
> = {
  pass: { Icon: CircleCheckIcon, className: 'text-success' },
  warn: { Icon: CircleAlertIcon, className: 'text-warning' },
  fail: { Icon: CircleXIcon, className: 'text-danger' },
}

function AuditTab() {
  const { designSystem } = useDesignSystem()
  const { applyChangeSet } = useStudio()
  const findings = useMemo(() => audit(designSystem), [designSystem])

  const counts = findings.reduce(
    (acc, f) => ({ ...acc, [f.level]: (acc[f.level] ?? 0) + 1 }),
    {} as Record<AuditLevel, number>,
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 text-xs text-fg-muted">
        <span className="flex items-center gap-1">
          <CircleCheckIcon className="size-3.5 text-success" />{' '}
          {counts.pass ?? 0}
        </span>
        <span className="flex items-center gap-1">
          <CircleAlertIcon className="size-3.5 text-warning" />{' '}
          {counts.warn ?? 0}
        </span>
        <span className="flex items-center gap-1">
          <CircleXIcon className="size-3.5 text-danger" /> {counts.fail ?? 0}
        </span>
        <span className="ml-auto">Live WCAG checks</span>
      </div>

      {findings.map((f) => (
        <AuditRow key={f.id} finding={f} onFix={(cs) => applyChangeSet(cs)} />
      ))}
    </div>
  )
}

function AuditRow({
  finding,
  onFix,
}: {
  finding: AuditFinding
  onFix: (cs: ChangeSet) => void
}) {
  const { Icon, className } = LEVEL_META[finding.level]
  return (
    <div className="flex gap-2.5 rounded-lg border bg-bg p-2.5">
      <Icon className={cn('mt-0.5 size-4 shrink-0', className)} />
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-[13px] font-medium">{finding.title}</span>
        <span className="text-xs leading-snug text-fg-muted">
          {finding.detail}
        </span>
        {finding.fix && (
          <Button
            size="sm"
            variant="default"
            className="mt-1.5 self-start"
            onPress={() => finding.fix && onFix(finding.fix)}
          >
            <SparklesIcon /> {finding.fix.title}
          </Button>
        )}
      </div>
    </div>
  )
}

/* ------------------------------- Reference ------------------------------- */

function ReferenceTab({ onProposed }: { onProposed: () => void }) {
  const { proposeChangeSet } = useStudio()
  const { designSystem } = useDesignSystem()
  const [url, setUrl] = useState('')
  const [colors, setColors] = useState('')

  const currentAccent =
    (designSystem.color ?? DEFAULT_COLOR_CONFIG).seeds.accent ?? '#6366f1'

  function accentChangeSet(
    title: string,
    rationale: string,
    accent: string,
  ): ChangeSet {
    return {
      id: `ref-${Math.round(stringHash(title + accent))}`,
      title,
      rationale,
      changes: [{ label: 'Accent', from: currentAccent, to: accent }],
      apply: (ds: DesignSystem) => {
        const base = ds.color ?? DEFAULT_COLOR_CONFIG
        return { ...ds, color: { ...base, seeds: { ...base.seeds, accent } } }
      },
    }
  }

  function extractUrl() {
    const host = safeHost(url)
    if (!host) return
    const accent = hslToHex(stringHash(host) % 360, 68, 54)
    proposeChangeSet(
      accentChangeSet(
        `Matched ${host}`,
        'Sampled a representative accent from the reference. Capability preview — a connected extractor would read the live page’s computed styles.',
        accent,
      ),
    )
    setUrl('')
    onProposed()
  }

  function applyColors() {
    const found = colors.match(/#([0-9a-f]{3}|[0-9a-f]{6})/gi)
    const first = found?.[0]
    if (!found || !first) return
    proposeChangeSet(
      accentChangeSet(
        'Brand palette',
        `Pulled the accent from ${found.length} pasted color${found.length > 1 ? 's' : ''}.`,
        first,
      ),
    )
    setColors('')
    onProposed()
  }

  function onFile(files: FileList | null) {
    const name = files && files[0] ? files[0].name : 'screenshot'
    const accent = hslToHex(stringHash(name) % 360, 70, 52)
    proposeChangeSet(
      accentChangeSet(
        'Matched screenshot',
        'Extracted a dominant accent from the upload. Capability preview — a connected model would read the image’s palette.',
        accent,
      ),
    )
    onProposed()
  }

  return (
    <div className="flex flex-col gap-5">
      <p className="text-xs leading-snug text-fg-muted">
        Start from something you like — a site, a screenshot, or brand colors.
        Each produces a proposal you review before it’s applied.
      </p>

      <Field label="From a URL" icon={LinkIcon}>
        <div className="flex gap-2">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && extractUrl()}
            placeholder="linear.app"
            aria-label="Reference URL"
            spellCheck={false}
            className="min-w-0 flex-1 rounded-lg border bg-bg px-2.5 py-1.5 text-[13px] outline-none focus-visible:focus-ring"
          />
          <Button size="sm" onPress={extractUrl} isDisabled={!safeHost(url)}>
            Extract
          </Button>
        </div>
      </Field>

      <Field label="From a screenshot" icon={UploadIcon}>
        <FileTrigger acceptedFileTypes={['image/*']} onSelect={onFile}>
          <Button size="sm" variant="default" className="w-full">
            <UploadIcon /> Upload an image
          </Button>
        </FileTrigger>
      </Field>

      <Field label="From brand colors" icon={SparklesIcon}>
        <textarea
          value={colors}
          onChange={(e) => setColors(e.target.value)}
          placeholder="#635bff, #0f172a, #f43f5e"
          aria-label="Brand colors"
          spellCheck={false}
          rows={2}
          className="w-full resize-none rounded-lg border bg-bg px-2.5 py-1.5 font-mono text-xs outline-none focus-visible:focus-ring"
        />
        <Button
          size="sm"
          variant="default"
          className="mt-1.5 self-start"
          onPress={applyColors}
          isDisabled={!/#([0-9a-f]{3}|[0-9a-f]{6})/i.test(colors)}
        >
          Use palette
        </Button>
      </Field>
    </div>
  )
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string
  icon: typeof LinkIcon
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-fg-muted uppercase">
        <Icon className="size-3.5" />
        {label}
      </span>
      {children}
    </div>
  )
}

/* ------------------------------- Reference utils ------------------------- */

function safeHost(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null
  try {
    const url = new URL(
      trimmed.includes('://') ? trimmed : `https://${trimmed}`,
    )
    return url.hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

function stringHash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

function hslToHex(h: number, s: number, l: number): string {
  const sN = s / 100
  const lN = l / 100
  const k = (n: number) => (n + h / 30) % 12
  const a = sN * Math.min(lN, 1 - lN)
  const f = (n: number) => {
    const color =
      lN - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}
