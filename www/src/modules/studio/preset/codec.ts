/* The preset codec: studio state ⇄ the compact string that rides in `?preset=`,
   localStorage and `components.json`. Only the diff against the current
   version's frozen defaults is stored, so an untouched system encodes to
   nothing. Canonical — encode∘decode is byte-identity. Decoding reads older
   versions and the pre-studio shape through the migrations, validates every
   value against the axis schema and says what it dropped. */

import { deflateRaw, inflateRaw } from "pako"

import {
  DEFAULT_CODE_OPTIONS,
  sanitizeCodeOptions,
} from "@/publisher/code-options"
import type { CodeOptions } from "@/publisher/code-options"
import { DEFAULTS, validateState } from "@/modules/studio/axes"
import type { StudioState } from "@/modules/studio/axes"

import {
  BASELINES,
  currentBaseline,
  fromLegacy,
  isRecord,
  LEGACY_CODE_OPTIONS,
  migrate,
  same,
  VERSION,
} from "./migrations"
import type { Baseline, LegacyState } from "./migrations"

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

const BASELINE = currentBaseline()
const { codeOptions: BASELINE_CODE_OPTIONS } = BASELINES[VERSION] as Baseline

interface Encoded {
  v: number
  /** State keys that differ from the baseline, in sorted key order. */
  s?: Partial<StudioState>
  o?: CodeOptions
}

/** The keys of `state` that differ from the baseline, sorted. */
function diffState(state: StudioState): Partial<StudioState> {
  const diff: Record<string, unknown> = {}
  for (const key of Object.keys(BASELINE).sort()) {
    const k = key as keyof StudioState
    if (!same(state[k], BASELINE[k])) diff[key] = state[k]
  }
  return diff as Partial<StudioState>
}

/** `undefined` when everything matches the baseline (no preset needed). */
export function encodePreset(preset: StudioPreset): string | undefined {
  const compact: Encoded = { v: VERSION }
  const diff = diffState(preset.state)
  if (Object.keys(diff).length > 0) compact.s = diff
  if (preset.codeOptions) {
    const codeOptions = sanitizeCodeOptions(preset.codeOptions)
    if (!same(codeOptions, BASELINE_CODE_OPTIONS)) compact.o = codeOptions
  }
  if (!compact.s && !compact.o) return undefined
  return toBase64Url(deflateRaw(JSON.stringify(compact), { level: 9 }))
}

/** Encode a bare state (default code style). */
export function encodeState(state: StudioState): string | undefined {
  return encodePreset({ state })
}

/* -------------------------------- decode -------------------------------- */

export type DecodeResult =
  | (StudioPreset & {
      ok: true
      /** Settings the string carried that didn't survive migration or
       *  validation. */
      dropped: string[]
    })
  | { ok: false; reason: "corrupt" | "invalid" | "newer-version" }

/** Code options over the string's own era defaults. */
function withCodeOptions(
  state: StudioState,
  dropped: string[],
  raw: unknown,
  base: CodeOptions,
): DecodeResult {
  const codeOptions: CodeOptions = { ...base }
  if (isRecord(raw)) {
    for (const [key, value] of Object.entries(raw)) {
      if (Object.hasOwn(base, key) && typeof value === "boolean")
        Object.assign(codeOptions, { [key]: value })
      else dropped.push(`o.${key}`)
    }
  } else if (raw !== undefined) dropped.push("o")
  return {
    ok: true,
    state,
    ...(same(codeOptions, DEFAULT_CODE_OPTIONS) ? {} : { codeOptions }),
    dropped,
  }
}

const LEGACY_KEYS = new Set(["p", "t", "d", "c", "o", "i"])

const isLegacy = (
  value: Record<string, unknown>,
): value is Record<string, unknown> & LegacyState =>
  Object.keys(value).every((key) => LEGACY_KEYS.has(key)) &&
  (value.t === undefined ||
    (isRecord(value.t) &&
      Object.values(value.t).every((token) => typeof token === "string")))

export function decode(encoded: string): DecodeResult {
  // A version prefix is a format this codec predates.
  if (/^v\d+\./.test(encoded)) return { ok: false, reason: "newer-version" }
  let parsed: unknown
  try {
    parsed = JSON.parse(inflateRaw(fromBase64Url(encoded), { to: "string" }))
  } catch {
    return { ok: false, reason: "corrupt" }
  }
  if (!isRecord(parsed)) return { ok: false, reason: "invalid" }

  const dropped: string[] = []
  let full: Record<string, unknown>
  let version: number
  let codeOptions: CodeOptions
  if (!("v" in parsed)) {
    if (!isLegacy(parsed)) return { ok: false, reason: "invalid" }
    full = fromLegacy(parsed, dropped)
    version = 3
    codeOptions = LEGACY_CODE_OPTIONS
  } else {
    const { v, s = {} } = parsed
    if (typeof v !== "number" || !Number.isInteger(v))
      return { ok: false, reason: "invalid" }
    if (v > VERSION) return { ok: false, reason: "newer-version" }
    const baseline = BASELINES[v]
    if (!baseline || !isRecord(s)) return { ok: false, reason: "invalid" }
    full = { ...baseline.state, ...s }
    version = v
    codeOptions = baseline.codeOptions
  }
  const { state, dropped: invalid } = validateState(
    migrate(full, version, dropped),
    BASELINE,
  )
  return withCodeOptions(state, [...dropped, ...invalid], parsed.o, codeOptions)
}

/** The decoded preset; the defaults when it fails to decode. */
export function decodePreset(encoded: string): StudioPreset {
  const result = decode(encoded)
  if (!result.ok) return DEFAULT_PRESET
  const { state, codeOptions } = result
  return codeOptions ? { state, codeOptions } : { state }
}

export function decodeState(encoded: string): StudioState {
  return decodePreset(encoded).state
}
