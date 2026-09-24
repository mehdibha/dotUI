/* The preset codec: studio state ⇄ the compact string that rides in `?preset=`
   and localStorage. Only the diff against the defaults is
   stored, so an untouched system encodes to nothing. Canonical — encode∘decode
   is byte-identity — and strict: decoding validates the state and reports
   what is wrong instead of falling back. */

import { deflateRaw, Inflate } from "pako"

import { DEFAULTS, validate } from "@/modules/studio/axes"
import type {
  StateIssue,
  StudioState,
  StudioStateInput,
} from "@/modules/studio/axes"

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
}

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
export function encodeState(state: StudioState): string | undefined {
  const diff = diffState(state)
  if (Object.keys(diff).length === 0) return undefined
  const compact: Encoded = { v: VERSION, s: diff }
  return toBase64Url(deflateRaw(JSON.stringify(compact), { level: 9 }))
}

/* -------------------------------- decode -------------------------------- */

export type DecodeResult =
  | { ok: true; state: StudioState }
  | { ok: false; issues: StateIssue[] }

const unreadable: DecodeResult = {
  ok: false,
  issues: [{ key: "", problem: "not a preset string" }],
}

/** A full preset inflates to ~3 KB; anything far past that is hostile. */
const MAX_INFLATED_BYTES = 16 * 1024

function inflateCapped(bytes: Uint8Array): string {
  const inflator = new Inflate({ raw: true, chunkSize: MAX_INFLATED_BYTES })
  const onData = inflator.onData.bind(inflator)
  let size = 0
  inflator.onData = (chunk) => {
    size += (chunk as Uint8Array).length
    if (size > MAX_INFLATED_BYTES) throw new Error("preset too large")
    onData(chunk)
  }
  inflator.push(bytes, true)
  if (inflator.err) throw new Error(inflator.msg)
  return new TextDecoder().decode(inflator.result as Uint8Array)
}

export function decodeState(encoded: string): DecodeResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(inflateCapped(fromBase64Url(encoded)))
  } catch {
    return unreadable
  }
  if (
    !parsed ||
    typeof parsed !== "object" ||
    (parsed as Encoded).v !== VERSION
  )
    return unreadable
  return validate((parsed as Encoded).s ?? {})
}
