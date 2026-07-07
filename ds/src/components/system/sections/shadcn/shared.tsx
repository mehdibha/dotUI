'use client'

import type { CSSProperties, ReactNode } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/select'

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

/** A labeled dropdown for an axis with many options (base color, color theme). */
function Dropdown<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: T
  onChange: (value: T) => void
  options: readonly { value: T; label: string }[]
}) {
  return (
    <Select
      aria-label={label}
      selectedKey={value}
      onSelectionChange={(key) => onChange(String(key) as T)}
    >
      <SelectTrigger size="sm" className="min-w-36">
        <span className="mr-1.5 text-fg-muted">{label}</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} id={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function BaseChoice({
  value,
  onChange,
}: {
  value: BaseColor
  onChange: (value: BaseColor) => void
}) {
  return (
    <Dropdown
      label="Base"
      value={value}
      onChange={onChange}
      options={BASE_OPTIONS}
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
    <Dropdown
      label="Theme"
      value={value}
      onChange={onChange}
      options={THEME_OPTIONS}
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

/** Button + input styling reproduced from shadcn's style-nova.css (base-ui):
    per-variant hover, and one shared focus ring — `ring-3` at --ring/50 with a
    --ring-colored border and no offset. Mode-aware where shadcn's classes are
    (outline, ghost, destructive differ in dark). */
function previewCss(dark: boolean): string {
  const mix = (t: string, p: number) =>
    `color-mix(in oklab, var(--${t}) ${p}%, transparent)`
  return `
[data-sh] .sh-btn {
  display:inline-flex; align-items:center; justify-content:center; gap:.5rem;
  height:2rem; padding:0 .75rem; border-radius:.5rem; white-space:nowrap;
  font-size:.75rem; font-weight:500; border:1px solid transparent;
  background-clip:padding-box; cursor:pointer;
  transition:background-color .15s, color .15s, border-color .15s, box-shadow .15s;
}
[data-sh] .sh-btn:active { transform:translateY(1px); }
[data-sh] .sh-btn:focus-visible, [data-sh] .sh-input:focus-visible {
  outline:none; border-color:var(--ring); box-shadow:0 0 0 3px ${mix('ring', 50)};
}
[data-sh] .sh-btn-default { background:var(--primary); color:var(--primary-foreground); }
[data-sh] .sh-btn-default:hover { background:${mix('primary', 80)}; }
[data-sh] .sh-btn-secondary { background:var(--secondary); color:var(--secondary-foreground); }
[data-sh] .sh-btn-secondary:hover { background:color-mix(in oklch, var(--secondary), var(--foreground) 5%); }
[data-sh] .sh-btn-outline { color:var(--foreground); ${dark ? `background:${mix('input', 30)}; border-color:var(--input);` : 'background:var(--background); border-color:var(--border);'} }
[data-sh] .sh-btn-outline:hover { background:${dark ? mix('input', 50) : 'var(--muted)'}; }
[data-sh] .sh-btn-ghost { background:transparent; color:var(--foreground); }
[data-sh] .sh-btn-ghost:hover { background:${dark ? mix('muted', 50) : 'var(--muted)'}; }
[data-sh] .sh-btn-destructive { background:${dark ? mix('destructive', 20) : mix('destructive', 10)}; color:var(--destructive); }
[data-sh] .sh-btn-destructive:hover { background:${dark ? mix('destructive', 30) : mix('destructive', 20)}; }
[data-sh] .sh-btn-destructive:focus-visible { border-color:${mix('destructive', 40)}; box-shadow:0 0 0 3px ${dark ? mix('destructive', 40) : mix('destructive', 20)}; }
[data-sh] .sh-btn-link { background:transparent; color:var(--primary); text-underline-offset:4px; }
[data-sh] .sh-btn-link:hover { text-decoration:underline; }
[data-sh] .sh-input {
  height:2rem; border-radius:.5rem; padding:0 .625rem; font-size:.75rem;
  border:1px solid var(--input); color:var(--foreground);
  background:${dark ? mix('input', 30) : 'transparent'};
  transition:color .15s, border-color .15s, box-shadow .15s;
}`
}

const BUTTON_VARIANTS = [
  'default',
  'secondary',
  'outline',
  'ghost',
  'destructive',
  'link',
] as const

/** A realistic mini-UI painted entirely from a resolved token map. */
export function ThemedPreview({
  values,
  mode,
}: {
  values: Record<string, string>
  mode: Mode
}) {
  return (
    <div
      data-sh=""
      style={{
        ...themeVars(values),
        background: v('background'),
        color: v('foreground'),
      }}
      className="rounded-lg border p-5"
    >
      <style>{previewCss(mode === 'dark')}</style>
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

        <input readOnly value="acme-inc" className="sh-input w-full" />

        {/* shadcn's base-ui Button variants — hover + focus per style-nova.css. */}
        <div className="flex flex-wrap items-center gap-2">
          {BUTTON_VARIANTS.map((variant) => (
            <button
              key={variant}
              type="button"
              className={`sh-btn sh-btn-${variant}`}
            >
              {variant[0]!.toUpperCase() + variant.slice(1)}
            </button>
          ))}
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
        </div>
      </div>
    </div>
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
