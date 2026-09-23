/* The preset codec, the only reader and writer of preset strings. The URL
   grammar names a built-in revision and pins the state's diff to it:

     preset=<id>[@<rev>]   a built-in; without a rev, its latest
     d=v5.<payload>        the state's diff against <id>@<rev> (rev required)
     code=<payload>        the code options' diff against the defaults

   A payload is base64url(deflateRaw(JSON)) with sorted keys, so a state has
   one string per base. Any other `preset=` value is a legacy blob (a v3/v4
   diff against frozen defaults, or the pre-studio shape) that decodes through
   the migrations. The studio still writes blobs until its URL moves to the
   grammar. Decoding validates every value against the axis schema and says
   what it dropped. */

import { deflateRaw, inflateRaw } from "pako"

import {
  DEFAULT_CODE_OPTIONS,
  sanitizeCodeOptions,
} from "@/publisher/code-options"
import type { CodeOptions } from "@/publisher/code-options"
import { loadRevision, REVISIONS } from "@/modules/presets/built-ins"
import type { PresetRevision } from "@/modules/presets/built-ins"
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

/** A built-in preset revision. */
export interface PresetRef {
  id: string
  rev: number
}

/** The grammar's query params; an empty value counts as absent. */
export interface PresetParams {
  preset?: string
  d?: string
  code?: string
}

export function readParams(search: URLSearchParams): PresetParams {
  const get = (name: string) => search.get(name) || undefined
  return { preset: get("preset"), d: get("d"), code: get("code") }
}

export type DecodeResult =
  | (StudioPreset & {
      ok: true
      /** The revision the state builds on. */
      base: PresetRef
      /** Settings the string carried that didn't survive migration or
       *  validation. */
      dropped: string[]
    })
  | {
      ok: false
      reason: "corrupt" | "invalid" | "newer-version" | "unknown-preset"
    }

type Failure = Extract<DecodeResult, { ok: false }>
const CORRUPT: Failure = { ok: false, reason: "corrupt" }
const INVALID: Failure = { ok: false, reason: "invalid" }

/* ------------------------------ payloads ------------------------------- */

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

/** JSON with every object's keys sorted. */
const stringify = (value: unknown) =>
  JSON.stringify(value, (_, inner: unknown) =>
    isRecord(inner)
      ? Object.fromEntries(
          Object.keys(inner)
            .sort()
            .map((key) => [key, inner[key]]),
        )
      : inner,
  )

const pack = (value: unknown) =>
  toBase64Url(deflateRaw(stringify(value), { level: 9 }))

/** Throws on anything that isn't a payload. */
const unpack = (payload: string): unknown =>
  JSON.parse(inflateRaw(fromBase64Url(payload), { to: "string" }))

/** The keys of `value` that differ from `base`. */
function diff<T extends object>(value: T, base: T): Partial<T> {
  const out: Partial<T> = {}
  for (const key of Object.keys(base) as Array<keyof T>)
    if (stringify(value[key]) !== stringify(base[key])) out[key] = value[key]
  return out
}

/* ------------------------------ built-ins ------------------------------ */

export const ORIGIN_ID = "origin"

function revisionOf(id: string, rev?: number): PresetRevision | undefined {
  const revisions = Object.hasOwn(REVISIONS, id) ? REVISIONS[id] : undefined
  return rev === undefined
    ? revisions?.at(-1)
    : revisions?.find((revision) => revision.rev === rev)
}

/** `id`'s latest revision. */
export function latest(id: string): PresetRef {
  const revision = revisionOf(id)
  if (!revision) throw new Error(`no built-in preset "${id}"`)
  return { id, rev: revision.rev }
}

const baseStates = new Map<string, StudioState>()

/** A revision's state at the current version. */
function baseState(id: string, revision: PresetRevision): StudioState {
  const key = `${id}@${revision.rev}`
  let state = baseStates.get(key)
  if (!state) {
    state = loadRevision(revision).state
    baseStates.set(key, state)
  }
  return state
}

/* ------------------------------- grammar ------------------------------- */

const REF = /^([a-z0-9-]+)(?:@([1-9]\d*))?$/
const CODE = /^v(\d+)\.(.*)$/
/** The first version whose codes diff against a built-in revision. */
const FIRST_CODE_VERSION = 5

/** The grammar's query for `preset` on `base`, rev-pinned, without `?`. */
export function encodeQuery(
  preset: StudioPreset,
  base: PresetRef = latest(ORIGIN_ID),
): string {
  const revision = revisionOf(base.id, base.rev)
  if (!revision) throw new Error(`no built-in preset ${base.id}@${base.rev}`)
  const params = [`preset=${base.id}@${base.rev}`]
  const state = diff(preset.state, baseState(base.id, revision))
  if (Object.keys(state).length > 0) params.push(`d=v${VERSION}.${pack(state)}`)
  const code = diff(
    sanitizeCodeOptions(preset.codeOptions),
    DEFAULT_CODE_OPTIONS,
  )
  if (Object.keys(code).length > 0) params.push(`code=${pack(code)}`)
  return params.join("&")
}

/** Code options over `base`, or `undefined` when they're the defaults. */
function readCodeOptions(
  raw: unknown,
  base: CodeOptions,
  name: string,
  dropped: string[],
): CodeOptions | undefined {
  const codeOptions: CodeOptions = { ...base }
  if (isRecord(raw)) {
    for (const [key, value] of Object.entries(raw)) {
      if (Object.hasOwn(base, key) && typeof value === "boolean")
        Object.assign(codeOptions, { [key]: value })
      else dropped.push(`${name}.${key}`)
    }
  } else if (raw !== undefined) dropped.push(name)
  return same(codeOptions, DEFAULT_CODE_OPTIONS) ? undefined : codeOptions
}

/** A `d=` code against `revision`: its diff, lifted from the code's version. */
function decodeDiff(
  id: string,
  revision: PresetRevision,
  d: string,
): Failure | { state: StudioState; dropped: string[] } {
  const [, prefix, payload = ""] = CODE.exec(d) ?? []
  if (prefix === undefined) return CORRUPT
  const version = Number(prefix)
  if (version > VERSION) return { ok: false, reason: "newer-version" }
  if (version < FIRST_CODE_VERSION || revision.version > version) return INVALID
  let raw: unknown
  try {
    raw = unpack(payload)
  } catch {
    return CORRUPT
  }
  if (!isRecord(raw)) return INVALID
  const dropped: string[] = []
  const base = migrate(revision.state, revision.version, [], version)
  const { state, dropped: invalid } = validateState(
    migrate({ ...base, ...raw }, version, dropped),
    baseState(id, revision),
  )
  return { state, dropped: [...dropped, ...invalid] }
}

export function decode({ preset, d, code }: PresetParams): DecodeResult {
  const ref = REF.exec(preset || ORIGIN_ID)
  if (!ref) return d || code ? INVALID : decodeBlob(preset as string)
  const [, id = ORIGIN_ID, pinned] = ref
  const revision = revisionOf(id, pinned ? Number(pinned) : undefined)
  if (!revision) return { ok: false, reason: "unknown-preset" }
  // An unpinned diff would drift when the preset gets a new revision.
  if (d && !pinned) return INVALID

  const design = d
    ? decodeDiff(id, revision, d)
    : { state: baseState(id, revision), dropped: [] }
  if ("ok" in design) return design
  let raw: unknown
  if (code) {
    try {
      raw = unpack(code)
    } catch {
      return CORRUPT
    }
  }
  const codeOptions = readCodeOptions(
    raw,
    DEFAULT_CODE_OPTIONS,
    "code",
    design.dropped,
  )
  return {
    ok: true,
    base: { id, rev: revision.rev },
    state: design.state,
    ...(codeOptions ? { codeOptions } : {}),
    dropped: design.dropped,
  }
}

/* -------------------------------- blobs -------------------------------- */

/** The last version whose strings are blobs. */
const BLOB_VERSION = 4
const BASELINE = currentBaseline()
const { codeOptions: BASELINE_CODE_OPTIONS } = BASELINES[
  BLOB_VERSION
] as Baseline

interface Encoded {
  v: number
  /** State keys that differ from the baseline, in sorted key order. */
  s?: Partial<StudioState>
  o?: CodeOptions
}

/** The keys of `state` that differ from the baseline, sorted. */
function diffState(state: StudioState): Partial<StudioState> {
  const out: Record<string, unknown> = {}
  for (const key of Object.keys(BASELINE).sort()) {
    const k = key as keyof StudioState
    if (!same(state[k], BASELINE[k])) out[key] = state[k]
  }
  return out as Partial<StudioState>
}

/** The studio's blob for `preset`; `undefined` for the default system. */
export function encodePreset(preset: StudioPreset): string | undefined {
  const codeOptions = sanitizeCodeOptions(
    preset.codeOptions ?? DEFAULT_CODE_OPTIONS,
  )
  const isDefault = (Object.keys(DEFAULTS) as Array<keyof StudioState>).every(
    (key) => same(preset.state[key], DEFAULTS[key]),
  )
  if (isDefault && same(codeOptions, DEFAULT_CODE_OPTIONS)) return undefined
  // The frozen baseline is not the default system: an empty diff still encodes.
  const compact: Encoded = { v: BLOB_VERSION }
  const s = diffState(preset.state)
  if (Object.keys(s).length > 0) compact.s = s
  if (!same(codeOptions, BASELINE_CODE_OPTIONS)) compact.o = codeOptions
  return toBase64Url(deflateRaw(JSON.stringify(compact), { level: 9 }))
}

/** Encode a bare state (default code style). */
export function encodeState(state: StudioState): string | undefined {
  return encodePreset({ state })
}

const LEGACY_KEYS = new Set(["p", "t", "d", "c", "o", "i"])

const isLegacy = (
  value: Record<string, unknown>,
): value is Record<string, unknown> & LegacyState =>
  Object.keys(value).every((key) => LEGACY_KEYS.has(key)) &&
  (value.t === undefined ||
    (isRecord(value.t) &&
      Object.values(value.t).every((token) => typeof token === "string")))

function decodeBlob(encoded: string): DecodeResult {
  let parsed: unknown
  try {
    parsed = unpack(encoded)
  } catch {
    return CORRUPT
  }
  if (!isRecord(parsed)) return INVALID

  const dropped: string[] = []
  let full: Record<string, unknown>
  let version: number
  let codeOptions: CodeOptions
  if (!("v" in parsed)) {
    if (!isLegacy(parsed)) return INVALID
    full = fromLegacy(parsed, dropped)
    version = 3
    codeOptions = LEGACY_CODE_OPTIONS
  } else {
    const { v, s = {} } = parsed
    const baseline = typeof v === "number" ? BASELINES[v] : undefined
    if (!baseline || !isRecord(s)) return INVALID
    full = { ...baseline.state, ...s }
    version = v as number
    codeOptions = baseline.codeOptions
  }
  const { state, dropped: invalid } = validateState(
    migrate(full, version, dropped),
    BASELINE,
  )
  dropped.push(...invalid)
  const options = readCodeOptions(parsed.o, codeOptions, "o", dropped)
  return {
    ok: true,
    base: latest(ORIGIN_ID),
    state,
    ...(options ? { codeOptions: options } : {}),
    dropped,
  }
}

/** The preset a `preset=` value names; the defaults when it fails to decode. */
export function decodePreset(value: string): StudioPreset {
  const result = decode({ preset: value })
  if (!result.ok) return DEFAULT_PRESET
  const { state, codeOptions } = result
  return codeOptions ? { state, codeOptions } : { state }
}

/** The blob today's encoder writes for `encoded`'s preset ("" for the default system). */
export function canonicalize(encoded: string | undefined): string {
  if (!encoded) return ""
  return encodePreset(decodePreset(encoded)) ?? ""
}

export function decodeState(encoded: string): StudioState {
  return decodePreset(encoded).state
}
