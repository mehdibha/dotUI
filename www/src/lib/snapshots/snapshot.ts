import { getPreset } from "@/modules/presets"
import { validate } from "@/modules/studio/axes"
import type { StateIssue, StudioState } from "@/modules/studio/axes"

/** An immutable published version of a design system. */
export interface Snapshot {
  schema: 1
  name: string
  /** The built-in preset it started from. */
  base: string
  state: StudioState
  createdAt: number
}

export type SnapshotContent = Omit<Snapshot, "createdAt">

export const SNAPSHOT_ID = /^[0-9A-Za-z]{10}$/
export const MAX_NAME_LENGTH = 64
const PRESET_ID = /^[a-z0-9-]+$/

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

/** JSON with object keys sorted at every depth. */
export function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`
  if (typeof value === "object" && value !== null) {
    const record = value as Record<string, unknown>
    const entries = Object.keys(record)
      .filter((key) => record[key] !== undefined)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`)
    return `{${entries.join(",")}}`
  }
  return JSON.stringify(value)
}

/** 10 base62 chars of the content's SHA-256. */
export async function snapshotId(content: SnapshotContent): Promise<string> {
  const { schema, name, base, state } = content
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(canonicalJson({ schema, name, base, state })),
  )
  let n = 0n
  for (const byte of new Uint8Array(digest)) n = (n << 8n) | BigInt(byte)
  // Least-significant digits first: every char is uniform, unlike a leading one.
  let id = ""
  for (let i = 0; i < 10; i++) {
    id += BASE62[Number(n % 62n)]
    n /= 62n
  }
  return id
}

type Parsed<T> = { ok: true; value: T } | { ok: false; issues: StateIssue[] }

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value)

function parseFields(
  raw: unknown,
  keys: readonly string[],
): Parsed<Record<string, unknown>> {
  if (!isRecord(raw))
    return { ok: false, issues: [{ key: "", problem: "expected an object" }] }
  const issues = Object.keys(raw)
    .filter((key) => !keys.includes(key))
    .map((key) => ({ key, problem: "unknown key" }))
  for (const key of keys)
    if (!Object.hasOwn(raw, key)) issues.push({ key, problem: "missing" })
  return issues.length > 0 ? { ok: false, issues } : { ok: true, value: raw }
}

function checkContent(
  { name, base, state: rawState }: Record<string, unknown>,
  isBase: (base: string) => boolean,
): Parsed<SnapshotContent> {
  const issues: StateIssue[] = []
  if (
    typeof name !== "string" ||
    name.length === 0 ||
    name.length > MAX_NAME_LENGTH
  )
    issues.push({
      key: "name",
      problem: `expected 1–${MAX_NAME_LENGTH} characters`,
    })
  if (typeof base !== "string" || !isBase(base))
    issues.push({ key: "base", problem: "unknown preset" })
  const state = validate(rawState)
  if (!state.ok)
    for (const { key, problem } of state.issues)
      issues.push({ key: key ? `state.${key}` : "state", problem })
  if (issues.length > 0 || !state.ok) return { ok: false, issues }
  return {
    ok: true,
    value: {
      schema: 1,
      name: name as string,
      base: base as string,
      state: state.state,
    },
  }
}

/** A `POST /api/snapshots` body: `{ name, base, state }`, name trimmed. */
export function parseSnapshotInput(raw: unknown): Parsed<SnapshotContent> {
  const fields = parseFields(raw, ["name", "base", "state"])
  if (!fields.ok) return fields
  const { name } = fields.value
  return checkContent(
    { ...fields.value, name: typeof name === "string" ? name.trim() : name },
    (base) => getPreset(base) !== undefined,
  )
}

/** A stored snapshot, re-validated on every read. Its base may name a preset
 *  that has since been removed. */
export function parseSnapshot(raw: unknown): Parsed<Snapshot> {
  const fields = parseFields(raw, [
    "schema",
    "name",
    "base",
    "state",
    "createdAt",
  ])
  if (!fields.ok) return fields
  const { schema, createdAt } = fields.value
  if (schema !== 1)
    return { ok: false, issues: [{ key: "schema", problem: "expected 1" }] }
  if (typeof createdAt !== "number" || !Number.isFinite(createdAt))
    return {
      ok: false,
      issues: [{ key: "createdAt", problem: "expected a timestamp" }],
    }
  const content = checkContent(fields.value, (base) => PRESET_ID.test(base))
  return content.ok
    ? { ok: true, value: { ...content.value, createdAt } }
    : content
}
