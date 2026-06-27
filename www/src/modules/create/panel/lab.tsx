'use client'

import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import {
  AlignLeftIcon,
  ChevronsLeftRightIcon,
  FlaskConicalIcon,
  GripVerticalIcon,
  LayoutGridIcon,
  ListTreeIcon,
  type LucideIcon,
  PanelLeftIcon,
  RotateCcwIcon,
  RowsIcon,
  SearchIcon,
  XIcon,
} from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { Slider, SliderControl } from '@/registry/ui/slider'
import { Switch } from '@/registry/ui/switch'

import { usePanelConfig } from './config'
import type {
  DockSide,
  Grouping,
  LayoutId,
  PanelDensity,
  RowLayout,
} from './types'

/* ----------------------------------------------------------------------------
 * The panel lab — a floating, draggable instrument that restructures the
 * control panel itself, live. Every toggle writes the shared PanelConfig, so
 * flipping it genuinely re-renders the panel in a different shape.
 * -------------------------------------------------------------------------- */

const LAYOUTS: Array<{ id: LayoutId; label: string; icon: LucideIcon }> = [
  { id: 'scroll', label: 'Scroll', icon: AlignLeftIcon },
  { id: 'tabs', label: 'Tabs', icon: LayoutGridIcon },
  { id: 'accordion', label: 'Accordion', icon: RowsIcon },
  { id: 'sidebar', label: 'Sidebar', icon: PanelLeftIcon },
  { id: 'command', label: 'Command', icon: SearchIcon },
]

const GROUPINGS: Array<{ id: Grouping; label: string; icon: LucideIcon }> = [
  { id: 'domain', label: 'Domain', icon: LayoutGridIcon },
  { id: 'tier', label: 'Tier', icon: ListTreeIcon },
  { id: 'tempo', label: 'Macro→micro', icon: ChevronsLeftRightIcon },
]

function useDrag(initial: { x: number; y: number }) {
  const [pos, setPos] = useState(initial)
  const origin = useRef({ px: 0, py: 0, x: 0, y: 0 })

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
      origin.current = { px: e.clientX, py: e.clientY, x: pos.x, y: pos.y }
    },
    [pos],
  )

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!(e.target as HTMLElement).hasPointerCapture?.(e.pointerId)) return
    const { px, py, x, y } = origin.current
    const nx = Math.max(8, x + (e.clientX - px))
    const ny = Math.max(8, y + (e.clientY - py))
    setPos({ x: nx, y: ny })
  }, [])

  return { pos, setPos, dragProps: { onPointerDown, onPointerMove } }
}

export function PanelLab() {
  const { config, setConfig, setHeader, reset } = usePanelConfig()
  const [open, setOpen] = useState(false)
  const { pos, setPos, dragProps } = useDrag({ x: 0, y: 0 })

  // Park it in the bottom-right on first mount (window-safe).
  useEffect(() => {
    setPos({ x: window.innerWidth - 340, y: window.innerHeight - 220 })
  }, [setPos])

  if (!open) {
    return (
      <ButtonPrimitives.Button
        data-panel-lab-toggle
        onPress={() => setOpen(true)}
        className="fixed right-5 bottom-5 z-50 flex h-10 items-center gap-2 rounded-full border bg-card px-3.5 text-sm font-medium shadow-lg focus-reset transition-colors hover:bg-neutral focus-visible:focus-ring"
      >
        <FlaskConicalIcon className="size-4 text-primary" />
        Panel lab
      </ButtonPrimitives.Button>
    )
  }

  return (
    <div
      style={{ left: pos.x, top: pos.y }}
      className="fixed z-50 flex max-h-[80vh] w-80 flex-col overflow-hidden rounded-xl border bg-card shadow-2xl"
    >
      {/* Drag handle */}
      <div
        {...dragProps}
        className="flex shrink-0 cursor-grab items-center gap-2 border-b bg-neutral/40 px-3 py-2 active:cursor-grabbing"
      >
        <GripVerticalIcon className="size-4 text-fg-muted" />
        <FlaskConicalIcon className="size-3.5 text-primary" />
        <span className="text-sm font-semibold">Panel lab</span>
        <span className="ml-1 font-mono text-[10px] text-fg-muted/70">
          restructures the panel
        </span>
        <div className="ml-auto flex items-center">
          <Button
            size="sm"
            variant="quiet"
            isIconOnly
            aria-label="Reset"
            onPress={reset}
          >
            <RotateCcwIcon />
          </Button>
          <Button
            data-panel-lab-toggle
            size="sm"
            variant="quiet"
            isIconOnly
            aria-label="Close panel lab"
            onPress={() => setOpen(false)}
          >
            <XIcon />
          </Button>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-3">
        <LabGroup label="Navigation">
          <IconGrid
            options={LAYOUTS}
            value={config.layout}
            onChange={(layout) => setConfig({ layout })}
          />
        </LabGroup>

        <LabGroup label="Grouping">
          <IconGrid
            options={GROUPINGS}
            value={config.grouping}
            onChange={(grouping) => setConfig({ grouping })}
            columns={3}
          />
        </LabGroup>

        <LabGroup label="Disclosure & density">
          <PillRow<PanelDensity>
            label="Density"
            value={config.density}
            onChange={(density) => setConfig({ density })}
            options={[
              { value: 'compact', label: 'Compact' },
              { value: 'comfortable', label: 'Comfortable' },
            ]}
          />
          <PillRow<RowLayout>
            label="Row layout"
            value={config.rowLayout}
            onChange={(rowLayout) => setConfig({ rowLayout })}
            options={[
              { value: 'stacked', label: 'Stacked' },
              { value: 'inline', label: 'Inline' },
            ]}
          />
          <SwitchRow
            label="Descriptions"
            value={config.showDescriptions}
            onChange={(showDescriptions) => setConfig({ showDescriptions })}
          />
          <SwitchRow
            label="Macro front door"
            value={config.showMacros}
            onChange={(showMacros) => setConfig({ showMacros })}
          />
          <SwitchRow
            label="Show advanced (Expert)"
            value={config.advanced}
            onChange={(advanced) => setConfig({ advanced })}
          />
        </LabGroup>

        <LabGroup label="Header">
          <SwitchRow
            label="Brand mark"
            value={config.header.showBrand}
            onChange={(showBrand) => setHeader({ showBrand })}
          />
          <SwitchRow
            label="Editable name"
            value={config.header.showName}
            onChange={(showName) => setHeader({ showName })}
          />
          <SwitchRow
            label="Mode toggle"
            value={config.header.showMode}
            onChange={(showMode) => setHeader({ showMode })}
          />
          <SwitchRow
            label="Search"
            value={config.header.showSearch}
            onChange={(showSearch) => setHeader({ showSearch })}
          />
          <SwitchRow
            label="Re-roll"
            value={config.header.showReroll}
            onChange={(showReroll) => setHeader({ showReroll })}
          />
          <SwitchRow
            label="Tall header"
            value={config.header.tall}
            onChange={(tall) => setHeader({ tall })}
          />
        </LabGroup>

        <LabGroup label="Chrome">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-fg-muted">Width</span>
              <span className="font-mono text-xs text-fg tabular-nums">
                {config.width}px
              </span>
            </div>
            <Slider
              aria-label="Panel width"
              value={config.width}
              minValue={280}
              maxValue={460}
              step={4}
              onChange={(v) => setConfig({ width: v as number })}
            >
              <SliderControl />
            </Slider>
          </div>
          <PillRow<DockSide>
            label="Dock side"
            value={config.dockSide}
            onChange={(dockSide) => setConfig({ dockSide })}
            options={[
              { value: 'left', label: 'Left' },
              { value: 'right', label: 'Right' },
            ]}
          />
          <SwitchRow
            label="Sticky footer"
            value={config.stickyFooter}
            onChange={(stickyFooter) => setConfig({ stickyFooter })}
          />
        </LabGroup>
      </div>
    </div>
  )
}

/* ------------------------------- Lab atoms ------------------------------- */

function LabGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="font-mono text-[10px] tracking-wider text-fg-muted/80 uppercase">
        {label}
      </span>
      {children}
    </div>
  )
}

function IconGrid<T extends string>({
  options,
  value,
  onChange,
  columns = 5,
}: {
  options: Array<{ id: T; label: string; icon: LucideIcon }>
  value: T
  onChange: (value: T) => void
  columns?: number
}) {
  return (
    <div
      className="grid gap-1.5"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {options.map((opt) => {
        const active = opt.id === value
        return (
          <ButtonPrimitives.Button
            key={opt.id}
            onPress={() => onChange(opt.id)}
            className={cn(
              'flex flex-col items-center gap-1 rounded-md border px-1 py-2 text-[10px] focus-reset transition-colors focus-visible:focus-ring',
              active
                ? 'border-primary/40 bg-primary/10 text-primary'
                : 'text-fg-muted hover:bg-neutral hover:text-fg',
            )}
          >
            <opt.icon className="size-4" />
            <span className="w-full truncate text-center">{opt.label}</span>
          </ButtonPrimitives.Button>
        )
      })}
    </div>
  )
}

function PillRow<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: T
  onChange: (value: T) => void
  options: Array<{ value: T; label: string }>
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-fg-muted">{label}</span>
      <div className="flex gap-1 rounded-md bg-neutral p-0.5">
        {options.map((opt) => (
          <ButtonPrimitives.Button
            key={opt.value}
            onPress={() => onChange(opt.value)}
            className={cn(
              'rounded px-2 py-0.5 text-xs focus-reset transition-colors focus-visible:focus-ring',
              opt.value === value
                ? 'bg-card text-fg shadow-sm'
                : 'text-fg-muted hover:text-fg',
            )}
          >
            {opt.label}
          </ButtonPrimitives.Button>
        ))}
      </div>
    </div>
  )
}

function SwitchRow({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-fg-muted">{label}</span>
      <Switch isSelected={value} onChange={onChange} aria-label={label} />
    </div>
  )
}
