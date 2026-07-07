'use client'

import type { CSSProperties, ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { Choice } from '../../primitives'
import type { BaseColor, ColorTheme, Mode, ThemeOverrideToken } from './data'
import {
  BASE_COLORS,
  COLOR_THEME_STEPS,
  COLOR_THEME_VALUES,
  COLOR_THEMES,
  MODES,
  TAILWIND_MAP,
  THEME_OVERRIDE_TOKENS,
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

const OVERRIDE_TOKENS = new Set<string>(THEME_OVERRIDE_TOKENS)

export interface StepInfo {
  /** The Tailwind step this value resolves to. */
  label: string | null
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
        borrowed: isBorrowed(baseSteps[token] ?? '', base),
      }),
    }
  }

  const ov = COLOR_THEME_VALUES[theme][mode]
  const ovSteps = COLOR_THEME_STEPS[theme][mode]
  const values: Record<string, string> = { ...baseValues, ...ov }

  return {
    values,
    step: (token) => {
      if (OVERRIDE_TOKENS.has(token)) {
        const step = ovSteps[token as ThemeOverrideToken]
        return { label: step, borrowed: isBorrowed(step, base) }
      }
      return {
        label: baseSteps[token] ?? null,
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
/** Tailwind's `/NN` opacity modifier — `bg-destructive/60` etc. */
const alpha = (token: string, pct: number) =>
  `color-mix(in oklab, var(--${token}) ${pct}%, transparent)`

/** A realistic mini-UI painted entirely from a resolved token map. */
export function ThemedPreview({
  values,
  mode,
}: {
  values: Record<string, string>
  mode: Mode
}) {
  const dark = mode === 'dark'
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

        {/* shadcn's real Button variants, dark-mode treatments included. */}
        <div className="flex flex-wrap items-center gap-2">
          <Btn
            style={{ background: v('primary'), color: v('primary-foreground') }}
          >
            Default
          </Btn>
          <Btn
            style={{
              background: v('secondary'),
              color: v('secondary-foreground'),
            }}
          >
            Secondary
          </Btn>
          <Btn
            className="border"
            style={{
              background: dark ? alpha('input', 30) : v('background'),
              borderColor: dark ? v('input') : v('border'),
              color: v('foreground'),
            }}
          >
            Outline
          </Btn>
          <Btn style={{ color: v('foreground') }}>Ghost</Btn>
          <Btn
            style={{
              background: dark ? alpha('destructive', 60) : v('destructive'),
              color: '#fff',
            }}
          >
            Destructive
          </Btn>
          <Btn
            className="underline-offset-4 hover:underline"
            style={{ color: v('primary') }}
          >
            Link
          </Btn>
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
  style,
  className,
  children,
}: {
  style?: CSSProperties
  className?: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      style={style}
      className={cn('h-8 rounded-md px-3 text-xs font-medium', className)}
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
