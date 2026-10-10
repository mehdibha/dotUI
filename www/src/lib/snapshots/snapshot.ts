import { salvageState, validate } from "@/modules/studio/axes"
import type { StateIssue, StudioState } from "@/modules/studio/axes"
import { migrate, stamp } from "@/modules/studio/axes/migrate"

/** An immutable, content-addressed copy of a design system. */
export interface Snapshot {
  schema: 1
  name: string
  state: StudioState
}

export const SNAPSHOT_ID = /^[0-9A-Za-z]{10}$/
export const MAX_NAME_LENGTH = 64

// In UTF-16 units, as `length` counts, without splitting a character.
export function cutName(text: string, max: number): string {
  let out = ""
  for (const char of text) {
    if (out.length + char.length > max) break
    out += char
  }
  return out
}

/** Trimmed, control characters and invisible spaces stripped. Joiners and
 *  bidi marks stay: emoji and scripts need them. */
export const stripName = (name: string) =>
  name
    .normalize("NFC")
    .replace(/[\p{Cc}​⁠﻿]/gu, "")
    .trim()

/** Stripped, at most 64 characters. */
export const cleanName = (name: string) =>
  cutName(stripName(name), MAX_NAME_LENGTH).trim()

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

/** The snapshot as stored: its state stamped with its version. */
export const stored = ({ schema, name, state }: Snapshot) => ({
  schema,
  name,
  state: stamp(state),
})

/** 10 base62 chars of the stored content's SHA-256. */
export async function snapshotId(snapshot: Snapshot): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(canonicalJson(stored(snapshot))),
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

const INPUT_KEYS = ["name", "state"]

/** A `POST /api/snapshots` body: `{ name, state }`, name stripped, state
 *  migrated. Strict: an unknown key or a bad value is an issue. */
export function parseSnapshotInput(raw: unknown): Parsed<Snapshot> {
  if (!isRecord(raw))
    return { ok: false, issues: [{ key: "", problem: "expected an object" }] }
  const issues: StateIssue[] = Object.keys(raw)
    .filter((key) => !INPUT_KEYS.includes(key))
    .map((key) => ({ key, problem: "unknown key" }))
  for (const key of INPUT_KEYS)
    if (!Object.hasOwn(raw, key)) issues.push({ key, problem: "missing" })
  if (issues.length > 0) return { ok: false, issues }
  const name = typeof raw.name === "string" ? stripName(raw.name) : ""
  if (name.length === 0 || name.length > MAX_NAME_LENGTH)
    issues.push({
      key: "name",
      problem: `expected 1–${MAX_NAME_LENGTH} characters`,
    })
  const state = validate(migrate(raw.state))
  if (!state.ok)
    for (const { key, problem } of state.issues)
      issues.push({ key: key ? `state.${key}` : "state", problem })
  if (issues.length > 0 || !state.ok) return { ok: false, issues }
  return {
    ok: true,
    value: { schema: 1, name, state: state.state },
  }
}

/** A stored snapshot, read leniently so links outlive schema changes: the
 *  state is migrated, unknown keys are ignored and a bad field takes its
 *  default. Only an unknown format is unreadable. */
export function parseSnapshot(raw: unknown): Snapshot | undefined {
  if (!isRecord(raw) || raw.schema !== 1) return
  const { name } = raw
  return {
    schema: 1,
    name: (typeof name === "string" && cleanName(name)) || "Untitled",
    state: salvageState(migrate(raw.state)),
  }
}
