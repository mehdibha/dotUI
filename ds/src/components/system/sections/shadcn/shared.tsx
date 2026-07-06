'use client'

import type { CSSProperties, ReactNode } from 'react'

import { Choice } from '../../primitives'
import type { BaseColor, ColorTheme, Mode } from './data'
import {
  BASE_COLORS,
  COLOR_THEME_STEPS,
  COLOR_THEME_VALUES,
  COLOR_THEMES,
  MODES,
  TAILWIND_MAP,
  THEMES,
} from './data'

export const BASE_LABEL: Record<BaseColor, string> = {
  neutral: 'Neutral',
  stone: 'Stone',
  zinc: 'Zinc',
  gray: 'Gray',
  slate: 'Slate',
}

export const COLOR_THEME_LABEL: Record<ColorTheme, string> = {
  default: 'Default',
  red: 'Red',
  rose: 'Rose',
  orange: 'Orange',
  green: 'Green',
  blue: 'Blue',
  yellow: 'Yellow',
  violet: 'Violet',
}

const BASE_OPTIONS = BASE_COLORS.map((base) => ({
  value: base,
  label: BASE_LABEL[base],
}))

const MODE_OPTIONS = MODES.map((mode) => ({
  value: mode,
  label: mode === 'light' ? 'Light' : 'Dark',
}))

const THEME_OPTIONS = COLOR_THEMES.map((theme) => ({
  value: theme,
  label: COLOR_THEME_LABEL[theme],
}))

export function BaseChoice({
  value,
  onChange,
}: {
  value: BaseColor
  onChange: (value: BaseColor) => void
}) {
  return (
    <Choice
      label="Base color"
      options={BASE_OPTIONS}
      value={value}
      onChange={onChange}
    />
  )
}

export function ModeChoice({
  value,
  onChange,
}: {
  value: Mode
  onChange: (value: Mode) => void
}) {
  return (
    <Choice
      label="Mode"
      options={MODE_OPTIONS}
      value={value}
      onChange={onChange}
    />
  )
}

export function ThemeChoice({
  value,
  onChange,
}: {
  value: ColorTheme
  onChange: (value: ColorTheme) => void
}) {
  return (
    <Choice
      label="Color theme"
      options={THEME_OPTIONS}
      value={value}
      onChange={onChange}
    />
  )
}

// ── Token resolution ────────────────────────────────────────────────────────

/** The Tailwind family a step belongs to (`zinc-900` → `zinc`, `white / 10%` → `white`). */
function family(step: string): string {
  return step.split(/[-\s]/)[0]!
}

/** A step is "borrowed" when it's outside the chosen base's own gray family. */
export function isBorrowed(step: string, base: BaseColor): boolean {
  const f = family(step)
  return f !== base && f !== 'white' && f !== 'black'
}

/** The tokens a color theme repaints; a foreground rides on its colored surface. */
const PRIMARY_TOKENS = new Set(['primary', 'sidebar-primary'])
const RING_TOKENS = new Set(['ring', 'sidebar-ring'])
const ON_COLOR_TOKENS = new Set([
  'primary-foreground',
  'sidebar-primary-foreground',
])

export interface StepInfo {
  /** The Tailwind step, or null for an on-color foreground tint. */
  label: string | null
  /** True for color-theme values — legacy presets, not exact v4 steps. */
  approx: boolean
  /** Highlight: reaches outside the base gray family. */
  borrowed: boolean
}

export interface Resolved {
  values: Record<string, string>
  step: (token: string) => StepInfo
}

/** Compose the base gray with an optional color theme, plus each token's origin. */
export function resolveTheme(
  base: BaseColor,
  mode: Mode,
  theme: ColorTheme,
): Resolved {
  const baseValues = THEMES[base][mode]
  const baseSteps = TAILWIND_MAP[base][mode]

  if (theme === 'default') {
    return {
      values: baseValues,
      step: (token) => ({
        label: baseSteps[token] ?? null,
        approx: false,
        borrowed: isBorrowed(baseSteps[token] ?? '', base),
      }),
    }
  }

  const ov = COLOR_THEME_VALUES[theme][mode]
  const ovSteps = COLOR_THEME_STEPS[theme][mode]
  const values: Record<string, string> = {
    ...baseValues,
    primary: ov.primary,
    'primary-foreground': ov['primary-foreground'],
    ring: ov.ring,
    'sidebar-primary': ov.primary,
    'sidebar-primary-foreground': ov['primary-foreground'],
    'sidebar-ring': ov.ring,
  }

  return {
    values,
    step: (token) => {
      if (PRIMARY_TOKENS.has(token))
        return { label: ovSteps.primary, approx: true, borrowed: true }
      if (RING_TOKENS.has(token))
        return { label: ovSteps.ring, approx: true, borrowed: true }
      if (ON_COLOR_TOKENS.has(token))
        return { label: null, approx: true, borrowed: true }
      return {
        label: baseSteps[token] ?? null,
        approx: false,
        borrowed: isBorrowed(baseSteps[token] ?? '', base),
      }
    },
  }
}

/** Scope a resolved token map as `--token` custom properties on a container. */
export function themeVars(values: Record<string, string>): CSSProperties {
  const vars: Record<string, string> = {}
  for (const [name, value] of Object.entries(values)) vars[`--${name}`] = value
  return vars as CSSProperties
}

const v = (token: string) => `var(--${token})`

/** A realistic mini-UI painted entirely from a resolved token map. */
export function ThemedPreview({ values }: { values: Record<string, string> }) {
  return (
    <div
      style={{
        ...themeVars(values),
        background: v('background'),
        color: v('foreground'),
      }}
      className="rounded-lg border p-5"
    >
      <div
        style={{
          background: v('card'),
          color: v('card-foreground'),
          borderColor: v('border'),
        }}
        className="flex flex-col gap-4 rounded-lg border p-5 shadow-sm"
      >
        <div>
          <div className="text-sm font-semibold">Create project</div>
          <div style={{ color: v('muted-foreground') }} className="text-xs">
            Deploy your new project in one click.
          </div>
        </div>

        <input
          readOnly
          value="acme-inc"
          style={{
            background: v('background'),
            borderColor: v('input'),
            color: v('foreground'),
          }}
          className="h-8 rounded-md border px-3 text-xs"
        />

        <div className="flex flex-wrap gap-2">
          <Btn bg="primary" fg="primary-foreground">
            Deploy
          </Btn>
          <Btn bg="secondary" fg="secondary-foreground">
            Cancel
          </Btn>
          <button
            type="button"
            style={{ background: v('destructive'), color: '#fff' }}
            className="h-8 rounded-md px-3 text-xs font-medium"
          >
            Delete
          </button>
          <button
            type="button"
            style={{ borderColor: v('border'), color: v('foreground') }}
            className="h-8 rounded-md border px-3 text-xs font-medium"
          >
            Outline
          </button>
        </div>

        <div
          style={{ background: v('muted'), color: v('muted-foreground') }}
          className="rounded-md px-3 py-2 text-xs"
        >
          Muted note — secondary text sits here.
        </div>

        <div className="flex items-center gap-2">
          <Pill bg="primary" fg="primary-foreground">
            Primary
          </Pill>
          <Pill bg="accent" fg="accent-foreground">
            Accent
          </Pill>
          <span
            style={{
              outline: `2px solid ${v('ring')}`,
              outlineOffset: 2,
              borderColor: v('border'),
            }}
            className="rounded-md border px-2 py-0.5 text-[11px]"
          >
            Focus ring
          </span>
        </div>
      </div>
    </div>
  )
}

function Btn({
  bg,
  fg,
  children,
}: {
  bg: string
  fg: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      style={{ background: v(bg), color: v(fg) }}
      className="h-8 rounded-md px-3 text-xs font-medium"
    >
      {children}
    </button>
  )
}

function Pill({
  bg,
  fg,
  children,
}: {
  bg: string
  fg: string
  children: ReactNode
}) {
  return (
    <span
      style={{ background: v(bg), color: v(fg) }}
      className="rounded-full px-2 py-0.5 text-[11px] font-medium"
    >
      {children}
    </span>
  )
}
