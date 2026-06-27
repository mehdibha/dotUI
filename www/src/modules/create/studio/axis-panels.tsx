'use client'

import { type ReactNode, useState } from 'react'
import { PlayIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { Label } from '@/registry/ui/field'
import { Slider, SliderControl, SliderOutput } from '@/registry/ui/slider'
import { Switch } from '@/registry/ui/switch'
import { ToggleButton } from '@/registry/ui/toggle-button'
import { ToggleButtonGroup } from '@/registry/ui/toggle-button-group'

/* ----------------------------------------------------------------------------
 * The new design axes. These are UI-only in this experiment: each control is
 * fully interactive (local state) so the panel feels real, but the values are
 * not yet wired to live preview tokens — that's a follow-up. The dashed note
 * keeps that honest, mirroring the lab's live/stub distinction.
 * -------------------------------------------------------------------------- */

function ProposalNote() {
  return (
    <p className="rounded-md border border-dashed bg-neutral/40 px-2 py-1.5 text-[11px] leading-snug text-fg-muted">
      New axis — interactive here, wired to live tokens in a follow-up.
    </p>
  )
}

/* ------------------------------ Shared rows ------------------------------ */

export function SegmentedRow<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: T
  onChange: (value: T) => void
  options: ReadonlyArray<{ value: T; label: string }>
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-fg-muted">{label}</span>
      <ToggleButtonGroup
        aria-label={label}
        selectionMode="single"
        disallowEmptySelection
        size="sm"
        selectedKeys={[value]}
        onSelectionChange={(keys) => {
          const next = keys.values().next().value
          if (next) onChange(next as T)
        }}
        className="*:flex-1"
      >
        {options.map((opt) => (
          <ToggleButton key={opt.value} id={opt.value}>
            {opt.label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </div>
  )
}

export function SliderRow({
  label,
  value,
  minValue,
  maxValue,
  step = 1,
  format,
  onChange,
}: {
  label: string
  value: number
  minValue: number
  maxValue: number
  step?: number
  format?: (value: number) => string
  onChange: (value: number) => void
}) {
  return (
    <Slider
      aria-label={label}
      value={value}
      minValue={minValue}
      maxValue={maxValue}
      step={step}
      onChange={(v) => onChange(typeof v === 'number' ? v : (v[0] ?? minValue))}
    >
      <div className="flex items-center justify-between text-xs">
        <Label>{label}</Label>
        {format ? (
          <SliderOutput className="text-fg-muted tabular-nums">
            {format(value)}
          </SliderOutput>
        ) : (
          <SliderOutput className="text-fg-muted tabular-nums" />
        )}
      </div>
      <SliderControl />
    </Slider>
  )
}

export function SwitchRow({
  label,
  description,
  value,
  onChange,
}: {
  label: string
  description?: string
  value: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex flex-col">
        <span className="text-xs font-medium text-fg-muted">{label}</span>
        {description && (
          <span className="text-[11px] text-fg-muted/60">{description}</span>
        )}
      </div>
      <Switch isSelected={value} onChange={onChange} aria-label={label} />
    </div>
  )
}

function SwatchRow({
  label,
  colors,
  value,
  onChange,
}: {
  label: string
  colors: readonly string[]
  value: string
  onChange: (value: string) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-fg-muted">{label}</span>
      <div className="flex flex-wrap gap-2">
        {colors.map((c) => (
          <button
            key={c}
            type="button"
            aria-label={c}
            onClick={() => onChange(c)}
            style={{ backgroundColor: c }}
            className={cn(
              'size-6 rounded-md border focus-reset focus-visible:focus-ring',
              value === c && 'ring-2 ring-fg ring-offset-2 ring-offset-card',
            )}
          />
        ))}
      </div>
    </div>
  )
}

function PanelShell({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-5">{children}</div>
}

/* ------------------------------ Elevation ------------------------------ */

type ElevationPreset = 'none' | 'subtle' | 'floating' | 'dramatic'

const ELEVATION_SHADOWS: Record<ElevationPreset, { y: number; blur: number }> =
  {
    none: { y: 0, blur: 0 },
    subtle: { y: 1, blur: 2 },
    floating: { y: 8, blur: 24 },
    dramatic: { y: 24, blur: 48 },
  }

export function ElevationPanel() {
  const [preset, setPreset] = useState<ElevationPreset>('subtle')
  const [intensity, setIntensity] = useState(40)
  const [tint, setTint] = useState('#000000')
  const { y, blur } = ELEVATION_SHADOWS[preset]
  const alpha = (intensity / 100) * 0.32
  const shadow =
    preset === 'none' ? 'none' : `0 ${y}px ${blur}px rgba(0,0,0,${alpha})`

  return (
    <PanelShell>
      <ProposalNote />
      <SegmentedRow
        label="Shadow preset"
        value={preset}
        onChange={setPreset}
        options={[
          { value: 'none', label: 'None' },
          { value: 'subtle', label: 'Subtle' },
          { value: 'floating', label: 'Float' },
          { value: 'dramatic', label: 'Drama' },
        ]}
      />
      <SliderRow
        label="Intensity"
        value={intensity}
        minValue={0}
        maxValue={100}
        format={(v) => `${Math.round(v)}%`}
        onChange={setIntensity}
      />
      <SwatchRow
        label="Tint"
        colors={['#000000', '#1e293b', '#3b1d60', '#5b3a1d']}
        value={tint}
        onChange={setTint}
      />
      <div className="flex h-24 items-center justify-center rounded-lg border bg-bg">
        <div
          className="size-16 rounded-lg border bg-card"
          style={{ boxShadow: shadow }}
        />
      </div>
    </PanelShell>
  )
}

/* -------------------------------- Motion -------------------------------- */

type EasingId = 'ease' | 'spring' | 'linear'

const EASINGS: Record<EasingId, string> = {
  ease: 'cubic-bezier(0.32, 0.72, 0, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  linear: 'linear',
}

export function MotionPanel() {
  const [duration, setDuration] = useState(1)
  const [easing, setEasing] = useState<EasingId>('spring')
  const [hoverLift, setHoverLift] = useState(true)
  const [reduce, setReduce] = useState(true)
  const [run, setRun] = useState(false)

  return (
    <PanelShell>
      <ProposalNote />
      <SliderRow
        label="Duration scale"
        value={duration}
        minValue={0.5}
        maxValue={2}
        step={0.05}
        format={(v) => `${v.toFixed(2)}×`}
        onChange={setDuration}
      />
      <SegmentedRow
        label="Easing"
        value={easing}
        onChange={setEasing}
        options={[
          { value: 'ease', label: 'Ease' },
          { value: 'spring', label: 'Spring' },
          { value: 'linear', label: 'Linear' },
        ]}
      />
      <div className="flex items-center gap-3">
        <div className="relative h-9 flex-1 overflow-hidden rounded-lg border bg-bg">
          <div
            className="absolute top-1/2 size-3.5 -translate-y-1/2 rounded-full bg-primary"
            style={{
              left: run ? 'calc(100% - 22px)' : '8px',
              transitionProperty: 'left',
              transitionDuration: `${0.7 * duration}s`,
              transitionTimingFunction: EASINGS[easing],
            }}
          />
        </div>
        <Button size="sm" onPress={() => setRun((r) => !r)}>
          <PlayIcon />
          Play
        </Button>
      </div>
      <SwitchRow label="Hover lift" value={hoverLift} onChange={setHoverLift} />
      <SwitchRow
        label="Respect reduced motion"
        description="Honor prefers-reduced-motion"
        value={reduce}
        onChange={setReduce}
      />
    </PanelShell>
  )
}

/* -------------------------------- Surface -------------------------------- */

export function SurfacePanel() {
  const [glass, setGlass] = useState(true)
  const [blur, setBlur] = useState(8)
  const [tint, setTint] = useState(0)
  const [background, setBackground] = useState('solid')
  const [noise, setNoise] = useState(false)

  return (
    <PanelShell>
      <ProposalNote />
      <SwitchRow
        label="Translucent overlays"
        description="Glassy menus and popovers"
        value={glass}
        onChange={setGlass}
      />
      <SliderRow
        label="Backdrop blur"
        value={blur}
        minValue={0}
        maxValue={24}
        format={(v) => `${Math.round(v)}px`}
        onChange={setBlur}
      />
      <SliderRow
        label="Surface tint"
        value={tint}
        minValue={0}
        maxValue={20}
        format={(v) => `${Math.round(v)}%`}
        onChange={setTint}
      />
      <SegmentedRow
        label="Background"
        value={background}
        onChange={setBackground}
        options={[
          { value: 'solid', label: 'Solid' },
          { value: 'dots', label: 'Dots' },
          { value: 'lines', label: 'Lines' },
          { value: 'mesh', label: 'Mesh' },
        ]}
      />
      <SwitchRow label="Noise texture" value={noise} onChange={setNoise} />
    </PanelShell>
  )
}

/* --------------------------------- Focus --------------------------------- */

export function FocusPanel() {
  const [style, setStyle] = useState('ring')
  const [width, setWidth] = useState(2)
  const [offset, setOffset] = useState(2)
  const [color, setColor] = useState('accent')

  const ringColor =
    color === 'accent' ? 'var(--color-accent)' : 'var(--color-fg)'
  const ring =
    style === 'glow'
      ? `0 0 0 ${width + 2}px color-mix(in oklab, ${ringColor} 40%, transparent)`
      : `0 0 0 ${offset}px var(--color-card), 0 0 0 ${offset + width}px ${ringColor}`

  return (
    <PanelShell>
      <ProposalNote />
      <SegmentedRow
        label="Ring style"
        value={style}
        onChange={setStyle}
        options={[
          { value: 'ring', label: 'Ring' },
          { value: 'outline', label: 'Outline' },
          { value: 'glow', label: 'Glow' },
        ]}
      />
      <SliderRow
        label="Width"
        value={width}
        minValue={1}
        maxValue={4}
        format={(v) => `${Math.round(v)}px`}
        onChange={setWidth}
      />
      <SliderRow
        label="Offset"
        value={offset}
        minValue={0}
        maxValue={4}
        format={(v) => `${Math.round(v)}px`}
        onChange={setOffset}
      />
      <SegmentedRow
        label="Color"
        value={color}
        onChange={setColor}
        options={[
          { value: 'accent', label: 'Accent' },
          { value: 'neutral', label: 'Neutral' },
        ]}
      />
      <div className="flex h-20 items-center justify-center rounded-lg border bg-bg">
        <Button size="sm" style={{ boxShadow: ring }}>
          Focused
        </Button>
      </div>
    </PanelShell>
  )
}

/* -------------------------------- States -------------------------------- */

export function StatesPanel() {
  const [hover, setHover] = useState('tint')
  const [press, setPress] = useState(98)
  const [transition, setTransition] = useState('snappy')
  const [dim, setDim] = useState(true)

  return (
    <PanelShell>
      <ProposalNote />
      <SegmentedRow
        label="Hover effect"
        value={hover}
        onChange={setHover}
        options={[
          { value: 'lift', label: 'Lift' },
          { value: 'tint', label: 'Tint' },
          { value: 'underline', label: 'Line' },
          { value: 'none', label: 'None' },
        ]}
      />
      <SliderRow
        label="Press scale"
        value={press}
        minValue={92}
        maxValue={100}
        format={(v) => `${Math.round(v)}%`}
        onChange={setPress}
      />
      <SegmentedRow
        label="Transition"
        value={transition}
        onChange={setTransition}
        options={[
          { value: 'instant', label: 'Instant' },
          { value: 'snappy', label: 'Snappy' },
          { value: 'smooth', label: 'Smooth' },
        ]}
      />
      <SwitchRow label="Disabled dims controls" value={dim} onChange={setDim} />
    </PanelShell>
  )
}

/* ----------------------- Extras for existing axes ----------------------- */

export function ShapeExtras() {
  const [corner, setCorner] = useState('rounded')
  const [borderWidth, setBorderWidth] = useState(1)
  const [hairlines, setHairlines] = useState('solid')

  return (
    <>
      <SegmentedRow
        label="Corner style"
        value={corner}
        onChange={setCorner}
        options={[
          { value: 'sharp', label: 'Sharp' },
          { value: 'rounded', label: 'Rounded' },
          { value: 'pill', label: 'Pill' },
        ]}
      />
      <SliderRow
        label="Border width"
        value={borderWidth}
        minValue={0}
        maxValue={3}
        step={0.5}
        format={(v) => `${v}px`}
        onChange={setBorderWidth}
      />
      <SegmentedRow
        label="Hairlines"
        value={hairlines}
        onChange={setHairlines}
        options={[
          { value: 'solid', label: 'Solid' },
          { value: 'hairline', label: 'Hairline' },
          { value: 'none', label: 'None' },
        ]}
      />
      <ProposalNote />
    </>
  )
}

export function SpacingExtras() {
  const [unit, setUnit] = useState(4)
  const [rhythm, setRhythm] = useState(1)
  const [controlHeight, setControlHeight] = useState(36)

  return (
    <>
      <SliderRow
        label="Base unit"
        value={unit}
        minValue={2}
        maxValue={8}
        format={(v) => `${Math.round(v)}px`}
        onChange={setUnit}
      />
      <SliderRow
        label="Gap rhythm"
        value={rhythm}
        minValue={0.75}
        maxValue={1.5}
        step={0.05}
        format={(v) => `${v.toFixed(2)}×`}
        onChange={setRhythm}
      />
      <SliderRow
        label="Control height"
        value={controlHeight}
        minValue={28}
        maxValue={44}
        format={(v) => `${Math.round(v)}px`}
        onChange={setControlHeight}
      />
      <ProposalNote />
    </>
  )
}
