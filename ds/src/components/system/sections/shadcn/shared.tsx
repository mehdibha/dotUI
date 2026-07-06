'use client'

import type { CSSProperties, ReactNode } from 'react'

import { Choice } from '../../primitives'
import type { BaseColor, Mode } from './data'
import { BASE_COLORS, MODES, THEMES } from './data'

export const BASE_LABEL: Record<BaseColor, string> = {
  neutral: 'Neutral',
  stone: 'Stone',
  zinc: 'Zinc',
  gray: 'Gray',
  slate: 'Slate',
}

const BASE_OPTIONS = BASE_COLORS.map((base) => ({
  value: base,
  label: BASE_LABEL[base],
}))

const MODE_OPTIONS = MODES.map((mode) => ({
  value: mode,
  label: mode === 'light' ? 'Light' : 'Dark',
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

/** Scope a base color's tokens as `--token` custom properties on a container. */
export function themeVars(base: BaseColor, mode: Mode): CSSProperties {
  const theme = THEMES[base][mode]
  const vars: Record<string, string> = {}
  for (const [name, value] of Object.entries(theme)) vars[`--${name}`] = value
  return vars as CSSProperties
}

const v = (token: string) => `var(--${token})`

/** A realistic mini-UI painted entirely from the selected base color + mode. */
export function ThemedPreview({ base, mode }: { base: BaseColor; mode: Mode }) {
  return (
    <div
      style={{
        ...themeVars(base, mode),
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
