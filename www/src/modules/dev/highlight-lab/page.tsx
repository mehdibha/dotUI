// TEMPORARY (PR #587): shiki vs @tanstack/highlight comparison lab — delete after merge decision.

'use client'

import './highlight-lab.css'

import * as React from 'react'
import { ArrowRightIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import { Badge } from '@/registry/ui/badge'
import { Button } from '@/registry/ui/button'
import { Label } from '@/registry/ui/field'
import {
  SegmentedControl,
  SegmentedControlItem,
} from '@/registry/ui/segmented-control'
import { Switch, SwitchControl } from '@/registry/ui/switch'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ThemeToggle } from '@/components/theme-toggle'
import { InternalShell } from '@/modules/internal/shell'

import {
  loadLabData,
  parseBucketColors,
  type Block,
  type LabData,
  type Seg,
  type Snippet,
} from './data'

const PAGE_SIZE = 30

export function HighlightLabPage() {
  const [data, setData] = React.useState<LabData | null>(null)
  const [failed, setFailed] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    loadLabData().then(
      (loaded) => {
        if (!cancelled) setData(loaded)
      },
      () => {
        if (!cancelled) setFailed(true)
      },
    )
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <InternalShell
      crumbs={[{ label: 'Highlight Lab' }]}
      title="Highlight Lab"
      description="Every code block where @tanstack/highlight colors a character differently from shiki, shown side by side. Judge whether what is left matters."
      actions={
        <>
          <Badge variant="warning" appearance="subtle" size="lg">
            Temporary — PR #587
          </Badge>
          <ThemeToggle variant="quiet" size="sm" isIconOnly />
        </>
      }
    >
      {data ? (
        <Lab data={data} />
      ) : (
        <p className="text-sm text-fg-muted">
          {failed ? 'Could not load data.json.' : 'Loading comparison data…'}
        </p>
      )}
    </InternalShell>
  )
}

function Lab({ data }: { data: LabData }) {
  const [mode, setMode] = React.useState<'refined' | 'raw'>('refined')
  const [mark, setMark] = React.useState(true)
  const [bucket, setBucket] = React.useState<number | null>(null)
  const [lang, setLang] = React.useState<string | null>(null)
  const [visible, setVisible] = React.useState(PAGE_SIZE)

  const langs = React.useMemo(() => {
    const counts = new Map<string, number>()
    for (const block of data.blocks) {
      counts.set(block.lang, (counts.get(block.lang) ?? 0) + 1)
    }
    return [...counts].sort((a, b) => b[1] - a[1])
  }, [data.blocks])

  const buckets = React.useMemo(
    () =>
      data.buckets
        .map((entry, index) => ({ ...entry, index }))
        .sort((a, b) => b.count - a.count),
    [data.buckets],
  )

  const blocks = React.useMemo(
    () =>
      data.blocks.filter(
        (block) =>
          (lang === null || block.lang === lang) &&
          (bucket === null || block.buckets.includes(bucket)),
      ),
    [data.blocks, lang, bucket],
  )

  function selectBucket(index: number) {
    setBucket((current) => (current === index ? null : index))
    setVisible(PAGE_SIZE)
  }

  function selectLang(value: string) {
    setLang((current) => (current === value ? null : value))
    setVisible(PAGE_SIZE)
  }

  return (
    <div className="flex flex-col gap-8">
      <Headline data={data} />

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold tracking-wider text-fg-muted uppercase">
              Right pane
            </span>
            <SegmentedControl
              aria-label="Right pane"
              selectedKeys={[mode]}
              onSelectionChange={(keys) => {
                const next = [...keys][0]
                if (next === 'refined' || next === 'raw') setMode(next)
              }}
            >
              <SegmentedControlItem id="refined">Refined</SegmentedControlItem>
              <SegmentedControlItem id="raw">Raw</SegmentedControlItem>
            </SegmentedControl>
          </div>
          <Switch isSelected={mark} onChange={setMark}>
            <SwitchControl />
            <Label>Mark differences</Label>
          </Switch>
          <span className="text-xs text-fg-muted">
            {blocks.length} of {data.blocks.length} blocks
            {mode === 'raw' &&
              ' · in raw mode only the tanstack pane is marked (the shiki pane’s marks track the refined diff)'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {langs.map(([value, count]) => (
            <ToggleButton
              key={value}
              size="xs"
              variant="quiet"
              isSelected={lang === value}
              onChange={() => selectLang(value)}
            >
              <span className="font-mono">{value}</span>
              <span className="text-fg-muted">{count}</span>
            </ToggleButton>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {buckets.map((entry) => (
            <BucketChip
              key={entry.index}
              label={entry.label}
              count={entry.count}
              isSelected={bucket === entry.index}
              onPress={() => selectBucket(entry.index)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {blocks.slice(0, visible).map((block) => (
          <BlockCard key={block.id} block={block} mode={mode} mark={mark} />
        ))}
        {blocks.length === 0 && (
          <p className="text-sm text-fg-muted">No block matches this filter.</p>
        )}
        {visible < blocks.length && (
          <Button
            variant="secondary"
            size="sm"
            className="self-start"
            onPress={() => setVisible((current) => current + PAGE_SIZE)}
          >
            Show {Math.min(PAGE_SIZE, blocks.length - visible)} more
          </Button>
        )}
      </div>
    </div>
  )
}

function Headline({ data }: { data: LabData }) {
  const { stats } = data
  return (
    <div className="flex max-w-4xl flex-col gap-5 rounded-xl border border-border/45 bg-card p-6 sm:flex-row sm:items-center sm:gap-8">
      <div className="flex items-center gap-5">
        <div className="flex flex-col gap-0.5">
          <span className="text-4xl leading-none font-semibold text-danger tabular-nums">
            {stats.rawPct}%
          </span>
          <span className="text-xs text-fg-muted">raw</span>
        </div>
        <ArrowRightIcon className="size-4 shrink-0 text-fg-muted" />
        <div className="flex flex-col gap-0.5">
          <span className="text-4xl leading-none font-semibold text-success tabular-nums">
            {stats.refinedPct}%
          </span>
          <span className="text-xs text-fg-muted">refined</span>
        </div>
      </div>
      <p className="text-sm/relaxed text-pretty text-fg-muted">
        Dropped straight in, @tanstack/highlight colors{' '}
        <strong className="font-medium text-fg">
          {stats.rawPct}% of characters
        </strong>{' '}
        differently from shiki ({format(stats.rawMismatch)} chars). With the
        refinement layer that falls to{' '}
        <strong className="font-medium text-fg">
          {stats.refinedPct}% — {format(stats.refinedMismatch)}
        </strong>{' '}
        of {format(stats.comparedChars)} compared characters, across{' '}
        {stats.mismatchingBlocks} of {format(stats.corpusBlocks)} code blocks.
        Those {stats.mismatchingBlocks} blocks are what you see below.
      </p>
    </div>
  )
}

function BucketChip({
  label,
  count,
  isSelected,
  onPress,
}: {
  label: string
  count: number
  isSelected: boolean
  onPress: () => void
}) {
  const { from, to } = parseBucketColors(label)
  return (
    <button
      type="button"
      title={label}
      onClick={onPress}
      className={cn(
        'flex cursor-interactive items-center gap-1.5 rounded-md border border-border/45 px-2 py-1 text-xs focus-reset transition-colors focus-visible:focus-ring',
        isSelected ? 'border-border-accent bg-accent-muted' : 'hover:bg-muted',
      )}
    >
      <Swatch light={from?.light} dark={from?.dark} />
      <ArrowRightIcon className="size-3 text-fg-muted" />
      <Swatch light={to?.light} dark={to?.dark} />
      <span className="text-fg-muted tabular-nums">{count}</span>
    </button>
  )
}

function Swatch({ light, dark }: { light?: string; dark?: string }) {
  if (!light || !dark) return null
  return (
    <span
      className="hl-swatch inline-block size-3 shrink-0 rounded-xs border border-border/45"
      style={{ '--l': light, '--d': dark } as React.CSSProperties}
    />
  )
}

function BlockCard({
  block,
  mode,
  mark,
}: {
  block: Block
  mode: 'refined' | 'raw'
  mark: boolean
}) {
  return (
    <article className="overflow-hidden rounded-xl border border-border/45 bg-card">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 px-4 py-3">
        <span className="min-w-0 flex-1 truncate font-mono text-xs text-fg">
          {block.id}
        </span>
        <Badge variant="neutral" appearance="subtle" size="sm">
          {block.lang}
        </Badge>
        <span className="text-xs text-fg-muted tabular-nums">
          {block.mismatchChars} chars
        </span>
      </div>

      <div className="hidden border-y border-border/45 bg-muted/40 lg:grid lg:grid-cols-2">
        <PaneLabel className="border-r border-border/45">shiki</PaneLabel>
        <PaneLabel>
          {mode === 'refined' ? 'tanstack (refined)' : 'tanstack (raw)'}
        </PaneLabel>
      </div>

      <div className="border-t border-border/45 lg:border-t-0">
        {block.snippets.map((snippet, index) => (
          <React.Fragment key={`${snippet.line}-${index}`}>
            {(index > 0 || snippet.line > 1) && (
              <div className="border-b border-border/45 bg-muted/40 px-4 py-1 font-mono text-[0.6875rem] text-fg-muted">
                ⋯ line {snippet.line}
              </div>
            )}
            <SnippetRow
              snippet={snippet}
              mode={mode}
              mark={mark}
              showLabels={index === 0}
            />
          </React.Fragment>
        ))}
      </div>
    </article>
  )
}

function SnippetRow({
  snippet,
  mode,
  mark,
  showLabels,
}: {
  snippet: Snippet
  mode: 'refined' | 'raw'
  mark: boolean
  showLabels: boolean
}) {
  return (
    <div className="grid grid-cols-1 border-b border-border/45 last:border-b-0 lg:grid-cols-2">
      <div className="min-w-0 border-b border-border/45 lg:border-r lg:border-b-0">
        {showLabels && <PaneLabel className="lg:hidden">shiki</PaneLabel>}
        <Pane
          segs={snippet.shiki}
          // The shiki pane's diff flags track the refined comparison, so in raw
          // mode they would point at the wrong characters.
          mark={mark && mode === 'refined'}
        />
      </div>
      <div className="min-w-0">
        {showLabels && (
          <PaneLabel className="lg:hidden">
            {mode === 'refined' ? 'tanstack (refined)' : 'tanstack (raw)'}
          </PaneLabel>
        )}
        <Pane segs={snippet[mode]} mark={mark} />
      </div>
    </div>
  )
}

function PaneLabel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'border-b border-border/45 bg-muted/40 px-4 py-1.5 text-[10px] font-semibold tracking-wider text-fg-muted uppercase lg:border-b-0',
        className,
      )}
    >
      {children}
    </div>
  )
}

function Pane({ segs, mark }: { segs: Seg[]; mark: boolean }) {
  return (
    <pre
      className={cn(
        'overflow-x-auto px-4 py-3 font-mono text-[0.8125rem]/relaxed',
        mark && 'hl-mark',
      )}
      style={{ tabSize: 2 }}
    >
      {segs.map((seg, index) => (
        <span
          key={index}
          className="hl-seg"
          data-diff={seg[3] === 1 ? '' : undefined}
          style={{ '--l': seg[1], '--d': seg[2] } as React.CSSProperties}
        >
          {seg[0]}
        </span>
      ))}
    </pre>
  )
}

function format(value: number) {
  return value.toLocaleString('en-US')
}
