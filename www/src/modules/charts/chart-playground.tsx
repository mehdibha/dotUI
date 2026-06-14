'use client'

import { useMemo, useState } from 'react'
import { CheckIcon, CopyIcon, TerminalIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { DynamicPre } from '@/modules/docs/dynamic-pre'

import { ChartPreview } from './chart-preview'
import { CHART_FAMILIES, getDemoSource, variantsFor } from './data'

type Palette = (string | null)[]

/** Inherit every slot from the active theme. */
const THEME_PALETTE: Palette = [null, null, null, null, null]

/** Preset palettes the visitor can flip between — `null` slots inherit the theme. */
const PALETTES: { name: string; colors: Palette }[] = [
  { name: 'Theme', colors: THEME_PALETTE },
  {
    name: 'Vivid',
    colors: ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'],
  },
  {
    name: 'Sunset',
    colors: ['#f97316', '#ef4444', '#ec4899', '#a855f7', '#f59e0b'],
  },
  {
    name: 'Ocean',
    colors: ['#0ea5e9', '#06b6d4', '#3b82f6', '#6366f1', '#14b8a6'],
  },
  {
    name: 'Forest',
    colors: ['#10b981', '#22c55e', '#84cc16', '#16a34a', '#65a30d'],
  },
]

export function ChartPlayground({
  family: controlledFamily,
  onFamilyChange,
}: {
  family?: string
  onFamilyChange?: (id: string) => void
}) {
  const [internalFamily, setInternalFamily] = useState<string>(
    CHART_FAMILIES[0].id,
  )
  const familyId = controlledFamily ?? internalFamily
  const family =
    CHART_FAMILIES.find((f) => f.id === familyId) ?? CHART_FAMILIES[0]

  const variants = useMemo(() => variantsFor(family.id), [family.id])
  const [variantKey, setVariantKey] = useState<string>(family.hero)
  const [palette, setPalette] = useState<Palette>(THEME_PALETTE)

  // Keep the selected variant valid when the family changes.
  const activeVariant = variants.some((v) => v.key === variantKey)
    ? variantKey
    : (variants[0]?.key ?? family.hero)

  const selectFamily = (id: string) => {
    const next = CHART_FAMILIES.find((f) => f.id === id)
    if (next) setVariantKey(next.hero)
    if (onFamilyChange) onFamilyChange(id)
    else setInternalFamily(id)
  }

  const source = getDemoSource(activeVariant)
  const installCmd = `npx shadcn@latest add @dotui/${family.id}`

  return (
    <div className="flex flex-col gap-6">
      {/* Family tabs */}
      <div className="flex flex-wrap gap-2">
        {CHART_FAMILIES.map((f) => (
          <Button
            key={f.id}
            size="sm"
            variant={f.id === family.id ? 'primary' : 'quiet'}
            onPress={() => selectFamily(f.id)}
          >
            {f.name}
          </Button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)]">
        {/* Variant list */}
        <aside className="flex flex-col gap-1">
          <span className="px-2 pb-1 text-[10px] font-medium tracking-widest text-fg-muted uppercase">
            {variants.length} variants
          </span>
          <div className="flex flex-row gap-1 overflow-x-auto pb-1 lg:max-h-[460px] lg:flex-col lg:overflow-y-auto">
            {variants.map((v) => (
              <button
                key={v.key}
                type="button"
                onClick={() => setVariantKey(v.key)}
                className={cn(
                  'shrink-0 rounded-md px-2.5 py-1.5 text-left text-sm whitespace-nowrap capitalize transition-colors',
                  v.key === activeVariant
                    ? 'bg-neutral font-medium text-fg'
                    : 'text-fg-muted hover:bg-muted hover:text-fg',
                )}
              >
                {v.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Preview + palette + code */}
        <div className="flex min-w-0 flex-col gap-4">
          <div className="relative flex min-h-[380px] flex-col justify-center rounded-2xl border bg-card p-6">
            <ChartPreview
              key={activeVariant}
              demoKey={activeVariant}
              palette={palette}
            />
          </div>

          {/* Palette presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-medium tracking-widest text-fg-muted uppercase">
              Palette
            </span>
            {PALETTES.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => setPalette(p.colors)}
                className={cn(
                  'flex items-center gap-2 rounded-full border py-1 pr-3 pl-1.5 text-xs transition-colors',
                  palette === p.colors
                    ? 'border-border-hover bg-neutral text-fg'
                    : 'text-fg-muted hover:bg-muted hover:text-fg',
                )}
              >
                <span className="flex -space-x-1">
                  {p.colors.map((c, j) => (
                    <span
                      key={j}
                      className="size-3.5 rounded-full border border-bg"
                      style={{ backgroundColor: c ?? `var(--chart-${j + 1})` }}
                    />
                  ))}
                </span>
                {p.name}
              </button>
            ))}
          </div>

          {/* Code */}
          <div className="relative min-w-0 overflow-hidden rounded-2xl border bg-card">
            <div className="flex items-center justify-between border-b px-4 py-2">
              <span className="font-mono text-xs text-fg-muted">
                {activeVariant.split('/').pop()}.tsx
              </span>
              <CopyButton text={source} />
            </div>
            <div className="max-h-[420px] overflow-auto text-[13px] [&_pre]:bg-transparent! [&_pre]:p-4">
              <DynamicPre lang="tsx">{source}</DynamicPre>
            </div>
          </div>

          {/* Install */}
          <div className="flex items-center justify-between gap-3 rounded-2xl border bg-card px-4 py-2.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <TerminalIcon className="size-4 shrink-0 text-fg-muted" />
              <code className="truncate font-mono text-sm">{installCmd}</code>
            </div>
            <CopyButton text={installCmd} />
          </div>
        </div>
      </div>
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <Button
      variant="quiet"
      size="sm"
      isIconOnly
      aria-label={copied ? 'Copied' : 'Copy'}
      onPress={() => {
        void navigator.clipboard.writeText(text)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1500)
      }}
    >
      {copied ? (
        <CheckIcon className="size-4 text-fg-success" />
      ) : (
        <CopyIcon className="size-4" />
      )}
    </Button>
  )
}
