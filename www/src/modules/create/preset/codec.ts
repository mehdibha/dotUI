/* The preset codec: studio state ⇄ the compact string that rides in `?preset=`,
   localStorage and `components.json`. Only the diff against the defaults is
   stored, so an untouched system encodes to nothing. Canonical — encode∘decode
   is byte-identity — and tolerant: garbage decodes to the defaults, and the
   pre-studio shape (a resolved design system) migrates onto the axes it maps
   to. */

import { deflateRaw, inflateRaw } from "pako"

import { familyFromStack } from "@/lib/fonts"
import { iconLibraries } from "@/registry/icons/icon-map"
import type { IconLibraryName } from "@/registry/icons/icon-map"
import { migrateColorConfig } from "@/registry/theme"
import type { ColorConfig } from "@/registry/theme"
import {
  DEFAULT_CODE_OPTIONS,
  sanitizeCodeOptions,
} from "@/publisher/code-options"
import type { CodeOptions } from "@/publisher/code-options"
import { DEFAULTS } from "@/modules/studio/axes"
import type { StudioState } from "@/modules/studio/axes"

/** A studio state plus the exported-code style — everything a preset holds. */
export interface StudioPreset {
  state: StudioState
  /** `undefined` means the default code style. */
  codeOptions?: CodeOptions
}

export const DEFAULT_PRESET: StudioPreset = { state: DEFAULTS }

/* ------------------------------ base64url ------------------------------ */

function toBase64Url(bytes: Uint8Array): string {
  let binary = ""
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function fromBase64Url(str: string): Uint8Array {
  const padded =
    str.replace(/-/g, "+").replace(/_/g, "/") +
    "==".slice(0, (4 - (str.length % 4)) % 4)
  const binary = atob(padded)
  return Uint8Array.from(binary, (c) => c.charCodeAt(0))
}

/* -------------------------------- encode -------------------------------- */

const VERSION = 3

interface Encoded {
  v: typeof VERSION
  /** State keys that differ from the defaults, in sorted key order. */
  s?: Partial<StudioState>
  o?: CodeOptions
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)

/** The keys of `state` that differ from the defaults, sorted. */
export function diffState(state: StudioState): Partial<StudioState> {
  const diff: Record<string, unknown> = {}
  for (const key of Object.keys(DEFAULTS).sort()) {
    const k = key as keyof StudioState
    if (!same(state[k], DEFAULTS[k])) diff[key] = state[k]
  }
  return diff as Partial<StudioState>
}

/** `undefined` when everything matches the defaults (no preset needed). */
export function encodePreset(preset: StudioPreset): string | undefined {
  const compact: Encoded = { v: VERSION }
  const diff = diffState(preset.state)
  if (Object.keys(diff).length > 0) compact.s = diff
  if (preset.codeOptions) {
    const codeOptions = sanitizeCodeOptions(preset.codeOptions)
    if (!same(codeOptions, DEFAULT_CODE_OPTIONS)) compact.o = codeOptions
  }
  if (!compact.s && !compact.o) return undefined
  return toBase64Url(deflateRaw(JSON.stringify(compact), { level: 9 }))
}

/** Encode a bare state (default code style). */
export function encodeState(state: StudioState): string | undefined {
  return encodePreset({ state })
}

/* -------------------------------- decode -------------------------------- */

/** Keep a stored value only when it has the default's shape. */
function sanitizeState(raw: unknown): StudioState {
  const state = { ...DEFAULTS } as Record<string, unknown>
  if (!raw || typeof raw !== "object") return state as StudioState
  for (const [key, fallback] of Object.entries(DEFAULTS)) {
    const value = (raw as Record<string, unknown>)[key]
    if (value === undefined) continue
    if (fallback === null) {
      if (value === null || typeof value === "number") state[key] = value
    } else if (Array.isArray(fallback)) {
      if (Array.isArray(value)) state[key] = value
    } else if (typeof value === typeof fallback) {
      state[key] = value
    }
  }
  return state as StudioState
}

/** Falls back to the defaults on any error. */
export function decodePreset(encoded: string): StudioPreset {
  try {
    const json = inflateRaw(fromBase64Url(encoded), { to: "string" })
    const parsed = JSON.parse(json) as Encoded | LegacyState
    if ("v" in parsed && parsed.v === VERSION) {
      const codeOptions = parsed.o ? sanitizeCodeOptions(parsed.o) : undefined
      return {
        state: sanitizeState(parsed.s),
        ...(codeOptions && !same(codeOptions, DEFAULT_CODE_OPTIONS)
          ? { codeOptions }
          : {}),
      }
    }
    return migrateLegacy(parsed as LegacyState)
  } catch {
    return DEFAULT_PRESET
  }
}

export function decodeState(encoded: string): StudioState {
  return decodePreset(encoded).state
}

/* ------------------------------- migration ------------------------------- */

/**
 * The pre-studio compact shape (a diffed resolved design system):
 *   p = component params · t = global tokens · d = density · c = color
 *   recipe · o = code options · i = icon library
 */
interface LegacyState {
  p?: Record<string, Record<string, string>>
  t?: Record<string, string>
  d?: string
  c?: ColorConfig
  o?: CodeOptions
  i?: IconLibraryName
}

const px = (value: string | undefined): number | undefined => {
  if (!value) return undefined
  const parsed = Number.parseFloat(value)
  if (!Number.isFinite(parsed)) return undefined
  return value.trim().endsWith("rem") ? parsed * 16 : parsed
}

/** Best-effort: the axes a resolved system maps back onto. Component params
 *  don't survive — they were a different vocabulary. */
function migrateLegacy(legacy: LegacyState): StudioPreset {
  const state: Record<string, unknown> = { ...DEFAULTS }
  const tokens = legacy.t ?? {}

  const color = legacy.c ? migrateColorConfig(legacy.c) : undefined
  if (color) {
    state.brand = color.seeds.accent
    if (color.primary === "accent") state.primary = "accent"
    if (color.seeds.success) state.successSeed = color.seeds.success
    if (color.seeds.warning) state.warningSeed = color.seeds.warning
    if (color.seeds.danger) state.dangerSeed = color.seeds.danger
    if (color.seeds.selection) state.selectionSeed = color.seeds.selection
    if (color.vividness !== undefined) state.vividness = color.vividness
    if (color.hueShift !== undefined) state.hueShift = color.hueShift
    if (color.neutralTint !== undefined) state.neutralTint = color.neutralTint
    if (color.neutralHue !== undefined) state.neutralHue = color.neutralHue
    if (color.preserveSeed) state.preserveSeed = true
    if (color.guaranteePolicy) state.guarantees = color.guaranteePolicy
    if (color.background) {
      state.modes = DEFAULTS.modes.map((mode) => {
        const bg = color.background?.[mode.polarity]
        if (bg === undefined) return mode
        return { ...mode, bg: bg === "oled" ? 0 : bg }
      })
    }
  }

  if (legacy.d === "compact" || legacy.d === "comfortable")
    state.density = legacy.d

  const radius = px(tokens["--radius"])
  if (radius !== undefined) state.radiusPx = radius

  if (tokens["--font-sans"])
    state.bodyFont = familyFromStack(tokens["--font-sans"])
  if (tokens["--font-heading"])
    state.headingFont = familyFromStack(tokens["--font-heading"])
  if (tokens["--font-mono"])
    state.monoFont = familyFromStack(tokens["--font-mono"])

  if (legacy.i && iconLibraries.some((lib) => lib.name === legacy.i))
    state.iconLibrary = legacy.i
  const stroke = px(tokens["--icon-stroke-width"])
  if (stroke !== undefined) state.iconStroke = stroke
  if (tokens["--icon-weight"]) state.iconWeight = tokens["--icon-weight"]

  if (tokens["--cursor-interactive"])
    state.cursorControls = tokens["--cursor-interactive"]
  if (tokens["--cursor-disabled"])
    state.cursorDisabled = tokens["--cursor-disabled"]

  const codeOptions = legacy.o ? sanitizeCodeOptions(legacy.o) : undefined
  return {
    state: sanitizeState(state),
    ...(codeOptions && !same(codeOptions, DEFAULT_CODE_OPTIONS)
      ? { codeOptions }
      : {}),
  }
}
