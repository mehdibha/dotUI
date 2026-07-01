'use client'

import type { ReactNode } from 'react'
import { ChevronDownIcon } from 'lucide-react'
import * as ButtonPrimitives from 'react-aria-components/Button'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import { Select, SelectValue } from '@/registry/ui/select'
import { Slider, SliderControl } from '@/registry/ui/slider'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'
import { Tooltip, TooltipContent } from '@/registry/ui/tooltip'

import { useDesignSystem } from '../preset'

/* ------------------------------ Stub tokens ------------------------------ */

/**
 * Bind a value to a global CSS var through the live `setToken` channel. Used for
 * the new axes the preview can't render yet — harmless until a component reads
 * the var, instantly live the moment one does. Pair with `<StatusDot live={false}>`.
 */
export function useToken(name: string, fallback: string) {
  const { designSystem, setToken } = useDesignSystem()
  const value = designSystem.tokens[name] ?? fallback
  const set = (v: string) => setToken(name, v)
  return [value, set] as const
}

/* ------------------------------ Status dot ------------------------------ */

/**
 * Honest wiring indicator: a filled dot means the control drives the live
 * preview; a hollow ring means it's UI only for now. Surfacing this keeps the
 * builder from pretending every axis is wired while it's still an experiment.
 */
export function StatusDot({ live }: { live: boolean }) {
  return (
    <Tooltip delay={250}>
      <span
        className={cn(
          'inline-block size-1.5 shrink-0 rounded-full',
          live ? 'bg-success' : 'border border-fg-muted/50',
        )}
        aria-hidden
      />
      <TooltipContent>
        {live ? 'Live — drives the preview' : 'Preview-only for now'}
      </TooltipContent>
    </Tooltip>
  )
}

/* -------------------------------- Field --------------------------------- */

/**
 * The chrome around one control: a label line (with status dot), an optional
 * hint, and the control itself stacked below. The atom every section is built
 * from, so spacing and type rhythm stay identical everywhere.
 */
export function Field({
  label,
  hint,
  live = true,
  children,
}: {
  label: ReactNode
  hint?: ReactNode
  live?: boolean
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[13px] font-medium text-fg">{label}</span>
          <StatusDot live={live} />
        </div>
        {hint && (
          <p className="text-xs leading-snug text-balance text-fg-muted">
            {hint}
          </p>
        )}
      </div>
      {children}
    </div>
  )
}

/* ------------------------------- Subgroup ------------------------------- */

/** A labelled cluster of related controls within a section. */
export function Subgroup({
  title,
  action,
  children,
}: {
  title: string
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold tracking-[0.12em] text-fg-muted/80 uppercase">
          {title}
        </span>
        {action}
      </div>
      {children}
    </div>
  )
}

/* ----------------------------- Section shell ----------------------------- */

/** The header + scroll body wrapper shared by every section's inspector. */
export function SectionShell({
  title,
  blurb,
  children,
}: {
  title: string
  blurb?: string
  children: ReactNode
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 px-4 pt-4 pb-3">
        <h2 className="text-base font-semibold tracking-tight text-fg">
          {title}
        </h2>
        {blurb && (
          <p className="mt-0.5 text-xs text-balance text-fg-muted">{blurb}</p>
        )}
      </div>
      <div className="scrollbar-none min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pt-1 pb-6">
        <div className="flex flex-col gap-6">{children}</div>
      </div>
    </div>
  )
}

/* -------------------------------- Swatch -------------------------------- */

const CHECKER =
  'repeating-conic-gradient(var(--color-border) 0% 25%, transparent 0% 50%) 50% / 8px 8px'

/** A color chip on a checkerboard so transparency reads correctly. */
export function Swatch({
  color,
  className,
  style,
}: {
  color: string
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <span
      className={cn(
        'inline-block size-5 shrink-0 rounded-[5px] ring-1 ring-black/10 ring-inset',
        className,
      )}
      style={{ background: CHECKER, ...style }}
    >
      <span
        className="block size-full rounded-[5px]"
        style={{ backgroundColor: color }}
      />
    </span>
  )
}

/* ------------------------------- Segmented ------------------------------- */

/** Segmented control over a small option set — the workhorse macro picker. */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  size = 'sm',
  ariaLabel,
}: {
  value: T
  onChange: (value: T) => void
  options: ReadonlyArray<{ value: T; label: ReactNode; hint?: string }>
  size?: 'sm' | 'md'
  ariaLabel?: string
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
      className="w-full *:min-w-0 *:flex-1"
    >
      {options.map((opt) => (
        <ToggleButton
          key={opt.value}
          id={opt.value}
          aria-label={opt.hint ?? undefined}
          className="truncate"
        >
          {opt.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}

/* ------------------------------ ValueSlider ------------------------------ */

/** Slider with a live monospace readout — the standard scalar control. */
export function ValueSlider({
  value,
  onChange,
  min,
  max,
  step,
  format = (v) => v.toString(),
  ariaLabel,
}: {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  format?: (value: number) => string
  ariaLabel?: string
}) {
  return (
    <div className="flex items-center gap-3">
      <Slider
        aria-label={ariaLabel}
        value={value}
        minValue={min}
        maxValue={max}
        step={step}
        onChange={(v) => onChange(v as number)}
        className="flex-1"
      >
        <SliderControl />
      </Slider>
      <span className="w-12 text-right font-mono text-xs text-fg-muted tabular-nums">
        {format(value)}
      </span>
    </div>
  )
}

/* ----------------------------- Select field ----------------------------- */

/** A compact themed select bound to a string value. */
export function SelectField<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: T
  onChange: (value: T) => void
  options: ReadonlyArray<{ id: T; label: ReactNode }>
  ariaLabel?: string
}) {
  return (
    <Select
      aria-label={ariaLabel}
      className="w-full"
      selectedKey={value}
      onSelectionChange={(key) => onChange(key as T)}
    >
      <Button size="sm" className="w-full justify-between">
        <SelectValue className="truncate" />
        <ChevronDownIcon data-icon-end="" />
      </Button>
      <Popover>
        <ListBox>
          {options.map((opt) => (
            <ListBoxItem key={opt.id} id={opt.id}>
              {opt.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </Select>
  )
}

/* ------------------------------ Preset card ----------------------------- */

/** A tappable card used for starters and vibes — the macro front door. */
export function PresetCard({
  onPress,
  isActive,
  children,
  className,
}: {
  onPress: () => void
  isActive?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <ButtonPrimitives.Button
      onPress={onPress}
      className={cn(
        'group/preset flex flex-col items-stretch gap-2 rounded-lg border bg-neutral/40 p-2.5 text-left text-sm focus-reset transition-[background-color,border-color,transform] hover:bg-neutral focus-visible:focus-ring pressed:scale-[0.98]',
        isActive && 'border-border-focus bg-neutral ring-1 ring-border-focus',
        className,
      )}
    >
      {children}
    </ButtonPrimitives.Button>
  )
}
