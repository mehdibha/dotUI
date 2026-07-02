'use client'

/**
 * Shared primitives for the Studio panel — the redesigned /create control surface.
 *
 * Every section is built from these so the whole panel reads as one instrument:
 * the same label rhythm, the same control widths, the same "is this live?" honesty
 * dot. Nothing here owns state — sections pass values down from `useDesignSystem()`.
 */

import { createContext, type ReactNode, useContext, useState } from 'react'
import { ChevronDownIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { ColorArea } from '@/registry/ui/color-area'
import { ColorField } from '@/registry/ui/color-field'
import { ColorPicker } from '@/registry/ui/color-picker'
import { ColorSlider } from '@/registry/ui/color-slider'
import { ColorSwatch } from '@/registry/ui/color-swatch'
import { DialogContent } from '@/registry/ui/dialog'
import { Input } from '@/registry/ui/input'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import { Select, SelectValue } from '@/registry/ui/select'
import { Slider, SliderControl } from '@/registry/ui/slider'
import { Switch } from '@/registry/ui/switch'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

/* ----------------------------------------------------------------------------
 * Mode — the macro/micro duality the whole product hinges on.
 *
 * "Simple" surfaces a handful of big levers so a non-expert lands a complete,
 * tasteful system in seconds. "Pro" unfolds every knob underneath. Sections read
 * this to decide how much to show; the same control set, two depths.
 * -------------------------------------------------------------------------- */

const StudioModeContext = createContext<boolean>(false)

export function StudioModeProvider({
  pro,
  children,
}: {
  pro: boolean
  children: ReactNode
}) {
  return (
    <StudioModeContext.Provider value={pro}>
      {children}
    </StudioModeContext.Provider>
  )
}

/** True when the panel is in Pro mode (every control visible). */
export function usePro() {
  return useContext(StudioModeContext)
}

/* ------------------------------- Section intro --------------------------- */

export function SectionIntro({
  title,
  children,
  action,
}: {
  title: string
  children?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {children && (
          <p className="mt-0.5 text-xs leading-snug text-balance text-fg-muted">
            {children}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

/** A hairline-divided block heading inside a section. */
export function GroupLabel({
  children,
  hint,
}: {
  children: ReactNode
  hint?: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-2 pt-1">
      <span className="text-[11px] font-semibold tracking-wider text-fg-muted uppercase">
        {children}
      </span>
      {hint}
    </div>
  )
}

/* --------------------------------- Field --------------------------------- */

/** Label-over-control. The default layout — every widget gets full width. */
export function Field({
  label,
  hint,
  live,
  children,
}: {
  label: ReactNode
  hint?: ReactNode
  live?: boolean
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium text-fg">{label}</span>
        {live != null && <LiveDot live={live} />}
      </div>
      {children}
      {hint && <p className="text-xs leading-snug text-fg-muted/80">{hint}</p>}
    </div>
  )
}

/** Label-left, control-right — for compact toggles and small selects. */
export function InlineField({
  label,
  hint,
  live,
  children,
}: {
  label: ReactNode
  hint?: ReactNode
  live?: boolean
  children: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex min-w-0 flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-xs font-medium text-fg">{label}</span>
          {live != null && <LiveDot live={live} />}
        </div>
        {hint && (
          <p className="text-[11px] leading-snug text-fg-muted/80">{hint}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

/* ------------------------------ Honesty dot ------------------------------ */

/**
 * Filled dot = the control drives the live preview through a real token channel.
 * Hollow dot = a UI stub the preview has no consumer for yet. Borrowed from the
 * panel lab — a builder this deep should never pretend a knob is wired when it
 * isn't. The dot is the contract.
 */
export function LiveDot({ live }: { live: boolean }) {
  return (
    <Tooltip delay={300}>
      <span
        className={cn(
          'inline-block size-1.5 shrink-0 rounded-full',
          live ? 'bg-success' : 'border border-fg-muted/50',
        )}
        aria-hidden
      />
      <TooltipContent>
        {live ? 'Live — updates the preview' : 'Preview wiring coming soon'}
      </TooltipContent>
    </Tooltip>
  )
}

/* ------------------------------- Segmented ------------------------------- */

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
  size = 'sm',
}: {
  value: T
  onChange: (value: T) => void
  options: ReadonlyArray<{ value: T; label: ReactNode; hint?: string }>
  ariaLabel?: string
  size?: 'sm' | 'md'
}) {
  return (
    <ToggleButtonGroup
      aria-label={ariaLabel}
      selectionMode="single"
      disallowEmptySelection
      size={size}
      selectedKeys={[value]}
      onSelectionChange={(keys) => {
        const next = keys.values().next().value
        if (next) onChange(next as T)
      }}
      className="w-full *:flex-1"
    >
      {options.map((opt) => (
        <ToggleButton key={opt.value} id={opt.value} aria-label={opt.hint}>
          {opt.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}

/* --------------------------------- Slider -------------------------------- */

export function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format = (v) => v.toString(),
  live,
  hint,
}: {
  label: ReactNode
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
  format?: (value: number) => string
  live?: boolean
  hint?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-fg">{label}</span>
          {live != null && <LiveDot live={live} />}
        </div>
        <span className="font-mono text-xs text-fg-muted tabular-nums">
          {format(value)}
        </span>
      </div>
      <Slider
        aria-label={typeof label === 'string' ? label : undefined}
        value={value}
        minValue={min}
        maxValue={max}
        step={step}
        onChange={(v) => onChange(typeof v === 'number' ? v : (v[0] ?? min))}
      >
        <SliderControl />
      </Slider>
      {hint && (
        <p className="text-[11px] leading-snug text-fg-muted/80">{hint}</p>
      )}
    </div>
  )
}

/* --------------------------------- Switch -------------------------------- */

export function SwitchRow({
  label,
  hint,
  isSelected,
  onChange,
  live,
}: {
  label: ReactNode
  hint?: ReactNode
  isSelected: boolean
  onChange: (value: boolean) => void
  live?: boolean
}) {
  return (
    <InlineField label={label} hint={hint} live={live}>
      <Switch
        isSelected={isSelected}
        onChange={onChange}
        aria-label={typeof label === 'string' ? label : 'Toggle'}
      />
    </InlineField>
  )
}

/* --------------------------------- Select -------------------------------- */

export function SelectRow<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T
  onChange: (value: T) => void
  options: ReadonlyArray<{ value: T; label: ReactNode }>
  ariaLabel?: string
}) {
  return (
    <Select
      className="w-full"
      selectedKey={value}
      onSelectionChange={(key) => onChange(key as T)}
      aria-label={ariaLabel}
    >
      <Button size="sm" className="w-full justify-between">
        <SelectValue className="truncate" />
        <ChevronDownIcon data-icon-end="" />
      </Button>
      <Popover>
        <ListBox>
          {options.map((opt) => (
            <ListBoxItem key={opt.value} id={opt.value}>
              {opt.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  )
}

/* ------------------------------- Seed swatch ----------------------------- */

/**
 * A brand-color picker bound to one hex value. Self-contained (its own
 * ColorPicker context) so it can be dropped anywhere a seed is edited — the
 * Brand front door, the Color section, status families.
 */
export function SeedSwatch({
  value,
  onChange,
  label,
}: {
  value: string
  onChange: (hex: string) => void
  label?: string
}) {
  // ColorPicker accepts the hex string directly and yields a parsed `color` via
  // its render prop — the same shape the colors/ config uses, so a bad value is
  // handled by the shared primitive rather than here.
  return (
    <ColorPicker value={value} onChange={(c) => onChange(c.toString('hex'))}>
      {({ color }) => (
        <>
          <Button
            size="sm"
            className="w-full justify-start pl-2"
            aria-label={label}
          >
            <ColorSwatch />
            <span className="truncate font-mono text-xs">
              {color.toString('hex')}
            </span>
          </Button>
          <Popover>
            <DialogContent className="flex w-56 flex-col gap-2">
              <div className="flex gap-2">
                <ColorArea
                  colorSpace="hsb"
                  xChannel="saturation"
                  yChannel="brightness"
                />
                <ColorSlider
                  orientation="vertical"
                  colorSpace="hsb"
                  channel="hue"
                  className="h-auto self-stretch"
                />
              </div>
              <ColorField aria-label="Hex" className="w-full">
                <Input size="sm" className="w-full" />
              </ColorField>
            </DialogContent>
          </Popover>
        </>
      )}
    </ColorPicker>
  )
}

/* ------------------------------- Ramp strip ------------------------------ */

/** One generated palette rendered as a contiguous tonal bar. */
export function RampStrip({
  steps,
  title,
}: {
  steps: [string, string][]
  title?: string
}) {
  return (
    <div className="flex h-5 overflow-hidden rounded-md" title={title}>
      {steps.map(([step, value]) => (
        <div
          key={step}
          className="flex-1"
          style={{ backgroundColor: value }}
          title={`${step}: ${value}`}
        />
      ))}
    </div>
  )
}

/* -------------------------------- Advanced ------------------------------- */

/**
 * A collapsible "advanced" group — keeps Pro mode powerful without dumping every
 * deep knob on screen at once. Closed by default; the chevron and count tell the
 * user there's more underneath.
 */
export function Advanced({
  label = 'Advanced',
  count,
  defaultOpen = false,
  children,
}: {
  label?: string
  count?: number
  defaultOpen?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-lg border bg-bg">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2 text-xs font-medium focus-reset focus-visible:focus-ring"
      >
        <span className="flex items-center gap-2">
          {label}
          {count != null && (
            <span className="font-mono text-[10px] text-fg-muted tabular-nums">
              {count}
            </span>
          )}
        </span>
        <ChevronDownIcon
          className={cn(
            'size-3.5 text-fg-muted transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>
      {open && (
        <div className="flex flex-col gap-4 border-t p-3">{children}</div>
      )}
    </div>
  )
}

/* -------------------------- "Pro unlocks more" note ---------------------- */

/** Shown at the foot of a Simple-mode section when Pro reveals more controls. */
export function ProHint({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-1.5 rounded-lg border border-dashed px-3 py-2 text-[11px] text-fg-muted">
      {children}
    </p>
  )
}
