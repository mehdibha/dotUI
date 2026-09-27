import { getPreset } from "@/modules/presets"
import { salvageState, validate } from "@/modules/studio/axes"
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

const INPUT_KEYS = ["name", "base", "state"]

/** A `POST /api/snapshots` body: `{ name, base, state }`, name trimmed.
 *  Strict: an unknown key or a bad value is an issue. */
export function parseSnapshotInput(raw: unknown): Parsed<SnapshotContent> {
  if (!isRecord(raw))
    return { ok: false, issues: [{ key: "", problem: "expected an object" }] }
  const issues: StateIssue[] = Object.keys(raw)
    .filter((key) => !INPUT_KEYS.includes(key))
    .map((key) => ({ key, problem: "unknown key" }))
  for (const key of INPUT_KEYS)
    if (!Object.hasOwn(raw, key)) issues.push({ key, problem: "missing" })
  if (issues.length > 0) return { ok: false, issues }
  const name = typeof raw.name === "string" ? raw.name.trim() : ""
  if (name.length === 0 || name.length > MAX_NAME_LENGTH)
    issues.push({
      key: "name",
      problem: `expected 1–${MAX_NAME_LENGTH} characters`,
    })
  const { base } = raw
  if (typeof base !== "string" || !getPreset(base))
    issues.push({ key: "base", problem: "unknown preset" })
  const state = validate(raw.state)
  if (!state.ok)
    for (const { key, problem } of state.issues)
      issues.push({ key: key ? `state.${key}` : "state", problem })
  if (issues.length > 0 || !state.ok) return { ok: false, issues }
  return {
    ok: true,
    value: { schema: 1, name, base: base as string, state: state.state },
  }
}

/** A stored snapshot, read leniently so links outlive schema changes:
 *  unknown keys are ignored and a bad field takes its default. Only an
 *  unknown format is unreadable. */
export function parseSnapshot(raw: unknown): Snapshot | undefined {
  if (!isRecord(raw) || raw.schema !== 1) return
  const { name, base, createdAt } = raw
  return {
    schema: 1,
    name: typeof name === "string" && name.trim() ? name : "Untitled",
    base: typeof base === "string" ? base : "origin",
    state: salvageState(raw.state),
    createdAt: typeof createdAt === "number" ? createdAt : 0,
  }
}
