/* The preset codec: studio state ⇄ the compact string that rides in `?preset=`,
   localStorage and `components.json`. Only the diff against the defaults is
   stored, so an untouched system encodes to nothing. Canonical — encode∘decode
   is byte-identity — and strict: decoding validates the state and reports
   what is wrong instead of falling back. */

import { deflateRaw, inflateRaw } from "pako"

import {
  DEFAULT_CODE_OPTIONS,
  sanitizeCodeOptions,
} from "@/publisher/code-options"
import type { CodeOptions } from "@/publisher/code-options"
import { DEFAULT_STATE, DEFAULTS, validate } from "@/modules/studio/axes"
import type {
  StateIssue,
  StudioState,
  StudioStateInput,
} from "@/modules/studio/axes"

/** A studio state plus the exported-code style — everything a preset holds. */
export interface StudioPreset {
  state: StudioState
  /** `undefined` means the default code style. */
  codeOptions?: CodeOptions
}

export const DEFAULT_PRESET: StudioPreset = { state: DEFAULT_STATE }

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

const VERSION = 4

interface Encoded {
  v: typeof VERSION
  /** State keys that differ from the defaults, in sorted key order. */
  s?: Partial<StudioStateInput>
  o?: CodeOptions
}

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)

/** The keys of `state` that differ from the defaults, sorted. */
function diffState(state: StudioState): Partial<StudioStateInput> {
  const diff: Record<string, unknown> = {}
  for (const key of Object.keys(DEFAULTS).sort()) {
    const k = key as keyof StudioStateInput
    if (state[k] !== DEFAULTS[k]) diff[key] = state[k]
  }
  return diff
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

export type DecodeResult =
  | { ok: true; preset: StudioPreset }
  | { ok: false; issues: StateIssue[] }

const unreadable: DecodeResult = {
  ok: false,
  issues: [{ key: "", problem: "not a preset string" }],
}

export function decodePreset(encoded: string): DecodeResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(inflateRaw(fromBase64Url(encoded), { to: "string" }))
  } catch {
    return unreadable
  }
  if (
    !parsed ||
    typeof parsed !== "object" ||
    (parsed as Encoded).v !== VERSION
  )
    return unreadable
  const { s, o } = parsed as Encoded
  const result = validate(s ?? {})
  if (!result.ok) return result
  const codeOptions = o ? sanitizeCodeOptions(o) : undefined
  return {
    ok: true,
    preset: {
      state: result.state,
      ...(codeOptions && !same(codeOptions, DEFAULT_CODE_OPTIONS)
        ? { codeOptions }
        : {}),
    },
  }
}
