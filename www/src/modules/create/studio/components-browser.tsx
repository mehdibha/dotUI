'use client'

import { useState } from 'react'
import { LinkIcon, SlidersHorizontalIcon } from 'lucide-react'

import { colorTokenNames } from '@/registry/theme'
import type { ParamDef, RegistryItem, ScalarParamDef } from '@/registry/types'
import { Badge } from '@/registry/ui/badge'
import { Button } from '@/registry/ui/button'
import { registryUi } from '@/registry/ui/registry'
import { SearchField } from '@/registry/ui/search-field'
import {
  BLUR_OPTIONS,
  CURSOR_OPTIONS,
  OPACITY_OPTIONS,
  RADIUS_OPTIONS,
  SHADOW_OPTIONS,
} from '@/publisher/token-map'

import { getComponentDisplayName } from '../components'
import { useDesignSystem } from '../preset'
import { toTitleCase } from './data'
import { useStudio } from './nav'
import {
  Group,
  Hint,
  NavRow,
  type Option,
  ScreenHeader,
  Segmented,
  SelectField,
  SliderField,
} from './primitives'

/* ------------------------------------------------------------------ *
 * Components browser + per-component editor.
 *
 * Reuses the registry's param metadata (the source of truth) but renders
 * a fresh control surface. Real params drive the live preview; the curated
 * hover axis is the new per-component knob the product layers on top.
 * ------------------------------------------------------------------ */

const COMPONENTS: RegistryItem[] = registryUi
  .filter((item) => item.group)
  .sort((a, b) => a.name.localeCompare(b.name))

function paramCount(item: RegistryItem): number {
  return item.params ? Object.keys(item.params).length : 0
}

/** Other components in the same synced group (Button ⇄ ToggleButton, …). */
function syncedSiblings(name: string): string[] {
  const item = COMPONENTS.find((c) => c.name === name)
  if (!item?.group) return []
  return COMPONENTS.filter(
    (c) => c.group === item.group && c.name !== name,
  ).map((c) => c.name)
}

/* ----------------------------- The list ----------------------------- */

export function ComponentList({
  query,
  onSelect,
}: {
  query: string
  onSelect: (name: string) => void
}) {
  const q = query.trim().toLowerCase()
  const visible = COMPONENTS.filter(
    (c) => paramCount(c) >= 1 && (!q || c.name.toLowerCase().includes(q)),
  )

  if (visible.length === 0) {
    return (
      <p className="px-1 py-6 text-center text-xs text-fg-muted">
        No components match “{query}”.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {visible.map((comp) => {
        const count = paramCount(comp)
        return (
          <NavRow
            key={comp.name}
            title={getComponentDisplayName(comp.name)}
            onPress={() => onSelect(comp.name)}
            preview={
              <span className="flex items-center gap-1 text-[10px] text-fg-muted/70">
                <SlidersHorizontalIcon className="size-3" />
                {count}
              </span>
            }
          />
        )
      })}
    </div>
  )
}

export function ComponentsBrowser() {
  const { pop, push } = useStudio()
  const [query, setQuery] = useState('')
  return (
    <div className="flex flex-col gap-4">
      <ScreenHeader title="Components" onBack={pop} />
      <SearchField
        aria-label="Search components"
        placeholder="Search components…"
        value={query}
        onChange={setQuery}
      />
      <ComponentList query={query} onSelect={push} />
    </div>
  )
}

/* --------------------------- The editor --------------------------- */

export function ComponentScreen({ name }: { name: string }) {
  const { pop } = useStudio()
  const { designSystem, setComponentParam, setDesignSystem } = useDesignSystem()
  const [hover, setHover] = useState('none')

  const meta = COMPONENTS.find((c) => c.name === name)
  const selected = designSystem.componentParams[name] ?? {}
  const siblings = syncedSiblings(name)
  const params = meta?.params ? Object.entries(meta.params) : []

  const reset = () => {
    setDesignSystem((prev) => {
      const next = { ...prev.componentParams }
      delete next[name]
      return { ...prev, componentParams: next }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <ScreenHeader
        title={getComponentDisplayName(name)}
        onBack={pop}
        action={
          <Button variant="quiet" size="sm" onPress={reset}>
            Reset
          </Button>
        }
      />

      <div className="flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2 text-xs text-fg-muted">
        <span>Live preview on the right →</span>
        {siblings.length > 0 && (
          <Badge className="gap-1">
            <LinkIcon className="size-3" />
            Synced
          </Badge>
        )}
      </div>

      {siblings.length > 0 && (
        <Hint>
          Shares one style with{' '}
          {siblings.map((s) => getComponentDisplayName(s)).join(', ')}. Edits
          stay in sync.
        </Hint>
      )}

      <Group label="Interaction">
        <SelectField
          label="Hover effect"
          value={hover}
          onChange={setHover}
          options={[
            { id: 'none', label: 'None' },
            { id: 'lift', label: 'Lift' },
            { id: 'glow', label: 'Glow' },
            { id: 'scale', label: 'Scale' },
            { id: 'underline', label: 'Underline' },
          ]}
        />
      </Group>

      {params.length > 0 ? (
        <Group label="Parameters">
          {params.map(([paramName, def]) => (
            <ParamControl
              key={paramName}
              paramName={paramName}
              def={def}
              value={selected[paramName]}
              onChange={(v) => setComponentParam(name, paramName, v)}
            />
          ))}
        </Group>
      ) : (
        <Hint>This component has no exposed parameters yet.</Hint>
      )}
    </div>
  )
}

/* --------------------------- Param controls --------------------------- */

const colorOptions: ReadonlyArray<Option<string>> = colorTokenNames(
  'background',
).map((n) => ({ id: `--${n}`, label: toTitleCase(n.replace(/^color-/, '')) }))

function toOptions(opts: ReadonlyArray<{ value: string; label: string }>) {
  return opts.map((o) => ({ id: o.value, label: o.label }))
}

function ParamControl({
  paramName,
  def,
  value,
  onChange,
}: {
  paramName: string
  def: ParamDef
  value: string | undefined
  onChange: (value: string) => void
}) {
  const label = toTitleCase(paramName)

  if (def.kind === 'enum') {
    const options = def.values.map((v) => ({ id: v, label: toTitleCase(v) }))
    const current = value ?? def.default
    // Short option sets read better as a segmented control; long ones as a select.
    if (options.length <= 3 && options.every((o) => o.label.length <= 9)) {
      return (
        <Segmented
          label={label}
          value={current}
          onChange={onChange}
          options={options}
        />
      )
    }
    return (
      <SelectField
        label={label}
        value={current}
        onChange={onChange}
        options={options}
        hint={def.description}
      />
    )
  }

  if (def.type === 'radius') {
    return (
      <RadiusParam label={label} def={def} value={value} onChange={onChange} />
    )
  }

  if (def.type === 'spacing') {
    return (
      <SpacingParam label={label} def={def} value={value} onChange={onChange} />
    )
  }

  const optionsByType: Record<string, ReadonlyArray<Option<string>>> = {
    blur: toOptions(BLUR_OPTIONS),
    color: colorOptions,
    cursor: toOptions(CURSOR_OPTIONS),
    'font-size': [],
    opacity: toOptions(OPACITY_OPTIONS),
    shadow: toOptions(SHADOW_OPTIONS),
  }
  const options = optionsByType[def.type] ?? []
  return (
    <SelectField
      label={label}
      value={value ?? def.default}
      onChange={onChange}
      options={options}
      hint={def.description}
    />
  )
}

function RadiusParam({
  label,
  def,
  value,
  onChange,
}: {
  label: string
  def: ScalarParamDef
  value: string | undefined
  onChange: (value: string) => void
}) {
  const current = value ?? def.default
  const idx = Math.max(
    0,
    RADIUS_OPTIONS.findIndex((o) => o.value === current),
  )
  const safeIdx = idx >= 0 ? idx : 0
  return (
    <SliderField
      label={label}
      value={safeIdx}
      minValue={0}
      maxValue={RADIUS_OPTIONS.length - 1}
      step={1}
      onChange={(v) => {
        const next = RADIUS_OPTIONS[Math.round(v)]
        if (next) onChange(next.value)
      }}
      format={() => RADIUS_OPTIONS[safeIdx]?.label ?? ''}
      hint={def.description}
    />
  )
}

function parseSpacingScale(value: string): number | null {
  const m = value.match(/var\(--spacing\)\s*\*\s*(-?\d*\.?\d+)/)
  if (m?.[1]) return Number.parseFloat(m[1])
  const num = Number.parseFloat(value)
  if (Number.isFinite(num)) {
    if (value.endsWith('rem')) return num / 0.25
    if (value.endsWith('px')) return num / 4
    return num
  }
  return null
}

function SpacingParam({
  label,
  def,
  value,
  onChange,
}: {
  label: string
  def: ScalarParamDef
  value: string | undefined
  onChange: (value: string) => void
}) {
  const min = def.minValue ?? 0
  const max = def.maxValue ?? 8
  const step = def.step ?? 0.5
  const current = Math.min(
    Math.max(parseSpacingScale(value ?? def.default) ?? min, min),
    max,
  )
  return (
    <SliderField
      label={label}
      value={current}
      minValue={min}
      maxValue={max}
      step={step}
      onChange={(v) =>
        onChange(`calc(var(--spacing) * ${Number(v.toFixed(2))})`)
      }
      format={(v) => String(Number(v.toFixed(2)))}
      hint={def.description}
    />
  )
}
