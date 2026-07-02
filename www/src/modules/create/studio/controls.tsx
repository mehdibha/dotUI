'use client'

import { ChevronDownIcon, UploadIcon } from 'lucide-react'

import { cn } from '@/registry/lib/utils'
import { Button } from '@/registry/ui/button'
import { ListBox, ListBoxItem } from '@/registry/ui/list-box'
import { Popover } from '@/registry/ui/popover'
import { Select, SelectValue } from '@/registry/ui/select'
import { Switch } from '@/registry/ui/switch'

import { Segmented, ValueSlider } from '../panel/primitives'
import { useDesignSystem } from '../preset'

/* ----------------------------------------------------------------------------
 * New-axis widgets.
 *
 * These extend the builder past the shipped axes — surface translucency,
 * background texture, shadow tint, motion easing, hover/press feedback,
 * accessibility targets, finer typography and brand. Each writes a CSS var
 * through the existing token channel; the preview has no consumer for most yet
 * (honest "Planned" pips in the inspector), but they persist and serialize and
 * go live the moment a token consumer lands.
 * -------------------------------------------------------------------------- */

export const TRANSLUCENT_VAR = '--ds-translucent-surfaces'
export const BG_TEXTURE_VAR = '--ds-bg-texture'
export const SHADOW_TINT_VAR = '--ds-shadow-tint'
export const EASING_VAR = '--ds-ease'
export const HOVER_EFFECT_VAR = '--ds-hover-effect'
export const PRESS_SCALE_VAR = '--ds-press-scale'
export const CONTRAST_TARGET_VAR = '--ds-contrast-target'
export const COLORBLIND_VAR = '--ds-colorblind-safe'
export const TAP_TARGET_VAR = '--ds-tap-target'
export const FONT_WEIGHT_VAR = '--ds-font-weight'
export const TRACKING_VAR = '--ds-tracking'
export const LINE_HEIGHT_VAR = '--ds-line-height'
export const FONT_HEADING_VAR = '--ds-font-heading'
export const FONT_BODY_VAR = '--ds-font-body'

function useToken(name: string, fallback: string) {
  const { designSystem, setToken } = useDesignSystem()
  const value = designSystem.tokens[name] ?? fallback
  return [value, (v: string) => setToken(name, v)] as const
}

/* ------------------------------- Surface -------------------------------- */

export function TranslucentSurfacesWidget() {
  const [value, set] = useToken(TRANSLUCENT_VAR, 'false')
  return (
    <Switch
      isSelected={value === 'true'}
      onChange={(s) => set(String(s))}
      aria-label="Translucent menus & popovers"
    />
  )
}

export function BackgroundTextureWidget() {
  const [value, set] = useToken(BG_TEXTURE_VAR, 'none')
  const options = [
    { value: 'none', label: 'None' },
    { value: 'grid', label: 'Grid' },
    { value: 'dots', label: 'Dots' },
    { value: 'noise', label: 'Grain' },
  ] as const
  return (
    <div className="flex flex-col gap-2">
      <Segmented
        ariaLabel="Background texture"
        value={value}
        onChange={set}
        options={options}
      />
      <div
        className="h-10 rounded-md border bg-bg"
        style={textureStyle(value)}
        aria-hidden
      />
    </div>
  )
}

function textureStyle(kind: string): React.CSSProperties {
  if (kind === 'grid')
    return {
      backgroundImage:
        'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)',
      backgroundSize: '12px 12px',
    }
  if (kind === 'dots')
    return {
      backgroundImage:
        'radial-gradient(var(--color-border) 1px, transparent 1px)',
      backgroundSize: '10px 10px',
    }
  if (kind === 'noise')
    return {
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
    }
  return {}
}

/* ------------------------------ Elevation ------------------------------- */

export function ShadowTintWidget() {
  const [value, set] = useToken(SHADOW_TINT_VAR, 'neutral')
  return (
    <Segmented
      ariaLabel="Shadow tint"
      value={value}
      onChange={set}
      options={[
        { value: 'neutral', label: 'Neutral' },
        { value: 'warm', label: 'Warm' },
        { value: 'cool', label: 'Cool' },
        { value: 'brand', label: 'Brand' },
      ]}
    />
  )
}

/* ------------------------------- Motion --------------------------------- */

const EASINGS: Record<string, [number, number, number, number]> = {
  snappy: [0.2, 0, 0, 1],
  smooth: [0.4, 0, 0.2, 1],
  spring: [0.34, 1.4, 0.64, 1],
  linear: [0, 0, 1, 1],
}

export function EasingWidget() {
  const [value, set] = useToken(EASING_VAR, 'smooth')
  const curve: [number, number, number, number] = EASINGS[value] ?? [
    0.4, 0, 0.2, 1,
  ]
  return (
    <div className="flex items-center gap-3">
      <EasingCurve curve={curve} />
      <Select
        className="flex-1"
        selectedKey={value}
        onSelectionChange={(k) => set(k as string)}
        aria-label="Easing curve"
      >
        <Button size="sm" className="w-full justify-between">
          <SelectValue className="truncate capitalize" />
          <ChevronDownIcon data-icon-end="" />
        </Button>
        <Popover>
          <ListBox>
            {Object.keys(EASINGS).map((id) => (
              <ListBoxItem key={id} id={id} className="capitalize">
                {id}
              </ListBoxItem>
            ))}
          </ListBox>
        </Popover>
      </Select>
    </div>
  )
}

function EasingCurve({ curve }: { curve: [number, number, number, number] }) {
  const [x1, y1, x2, y2] = curve
  const s = 40
  // Unit bezier with y flipped into SVG space; clamp the overshoot into view.
  const px = (n: number) => 4 + n * (s - 8)
  const py = (n: number) => s - 4 - n * (s - 8)
  const d = `M ${px(0)} ${py(0)} C ${px(x1)} ${py(y1)} ${px(x2)} ${py(y2)} ${px(1)} ${py(1)}`
  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      className="shrink-0 rounded-md border bg-neutral/40"
    >
      <path
        d={d}
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </svg>
  )
}

export function HoverEffectWidget() {
  const [value, set] = useToken(HOVER_EFFECT_VAR, 'none')
  return (
    <Segmented
      ariaLabel="Hover effect"
      value={value}
      onChange={set}
      options={[
        { value: 'none', label: 'None' },
        { value: 'lift', label: 'Lift' },
        { value: 'glow', label: 'Glow' },
        { value: 'scale', label: 'Scale' },
      ]}
    />
  )
}

export function PressScaleWidget() {
  const [value, set] = useToken(PRESS_SCALE_VAR, '0.98')
  return (
    <ValueSlider
      ariaLabel="Press scale"
      value={Number.parseFloat(value) || 0.98}
      min={0.9}
      max={1}
      step={0.01}
      format={(v) => `${Math.round(v * 100)}%`}
      onChange={(v) => set(String(v))}
    />
  )
}

/* --------------------------- Accessibility ------------------------------ */

export function ContrastTargetWidget() {
  const [value, set] = useToken(CONTRAST_TARGET_VAR, 'AA')
  return (
    <Segmented
      ariaLabel="Contrast target"
      value={value}
      onChange={set}
      options={[
        { value: 'AA', label: 'AA' },
        { value: 'AAA', label: 'AAA' },
      ]}
    />
  )
}

export function ColorblindSafeWidget() {
  const [value, set] = useToken(COLORBLIND_VAR, 'false')
  return (
    <Switch
      isSelected={value === 'true'}
      onChange={(s) => set(String(s))}
      aria-label="Color-blind safe palette"
    />
  )
}

export function TapTargetWidget() {
  const [value, set] = useToken(TAP_TARGET_VAR, '40')
  return (
    <ValueSlider
      ariaLabel="Minimum tap target"
      value={Number.parseFloat(value) || 40}
      min={24}
      max={56}
      step={2}
      format={(v) => `${v}px`}
      onChange={(v) => set(String(v))}
    />
  )
}

/* ----------------------------- Typography ------------------------------- */

const PAIRINGS = [
  { id: 'geist', heading: 'Geist', body: 'Geist', note: 'Neutral & modern' },
  { id: 'inter', heading: 'Inter', body: 'Inter', note: 'Workhorse UI' },
  {
    id: 'editorial',
    heading: 'Lora',
    body: 'Inter',
    note: 'Serif display, clean body',
  },
  {
    id: 'expressive',
    heading: 'Satoshi',
    body: 'Inter',
    note: 'Characterful headings',
  },
  { id: 'technical', heading: 'Söhne', body: 'Mono', note: 'Grotesk + mono' },
] as const

export function FontPairingWidget() {
  const { designSystem, setToken } = useDesignSystem()
  const heading = designSystem.tokens[FONT_HEADING_VAR] ?? 'Geist'
  const body = designSystem.tokens[FONT_BODY_VAR] ?? 'Geist'
  const activeId = PAIRINGS.find(
    (p) => p.heading === heading && p.body === body,
  )?.id

  return (
    <div className="flex flex-col gap-1.5">
      {PAIRINGS.map((p) => {
        const active = p.id === activeId
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              setToken(FONT_HEADING_VAR, p.heading)
              setToken(FONT_BODY_VAR, p.body)
            }}
            className={cn(
              'flex items-center justify-between rounded-lg border px-3 py-2 text-left focus-reset transition-colors focus-visible:focus-ring',
              active
                ? 'border-border-focus bg-accent-muted'
                : 'hover:bg-neutral',
            )}
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium">
                {p.heading}
                <span className="text-fg-muted"> / {p.body}</span>
              </span>
              <span className="text-xs text-fg-muted">{p.note}</span>
            </div>
            <span className="text-2xl leading-none text-fg-muted">Ag</span>
          </button>
        )
      })}
    </div>
  )
}

export function FontWeightWidget() {
  const [value, set] = useToken(FONT_WEIGHT_VAR, 'regular')
  return (
    <Segmented
      ariaLabel="Base font weight"
      value={value}
      onChange={set}
      options={[
        { value: 'light', label: 'Light' },
        { value: 'regular', label: 'Regular' },
        { value: 'medium', label: 'Medium' },
      ]}
    />
  )
}

export function TrackingWidget() {
  const [value, set] = useToken(TRACKING_VAR, '0')
  return (
    <ValueSlider
      ariaLabel="Letter spacing"
      value={Number.parseFloat(value) || 0}
      min={-0.05}
      max={0.05}
      step={0.005}
      format={(v) => `${v > 0 ? '+' : ''}${(v * 100).toFixed(1)}%`}
      onChange={(v) => set(String(v))}
    />
  )
}

export function LineHeightWidget() {
  const [value, set] = useToken(LINE_HEIGHT_VAR, '1.5')
  return (
    <ValueSlider
      ariaLabel="Body line height"
      value={Number.parseFloat(value) || 1.5}
      min={1.2}
      max={1.9}
      step={0.05}
      format={(v) => v.toFixed(2)}
      onChange={(v) => set(String(v))}
    />
  )
}

/* -------------------------------- Brand --------------------------------- */

export function BrandLogoWidget() {
  return (
    <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed py-5 text-center transition-colors hover:bg-neutral/50">
      <UploadIcon className="size-4 text-fg-muted" />
      <span className="text-xs font-medium">Drop a logo or screenshot</span>
      <span className="text-[11px] text-fg-muted">
        SVG / PNG — we'll extract a palette
      </span>
      <input type="file" accept="image/*" className="sr-only" />
    </label>
  )
}
