/* Snapshots read back: a POST body, or one stored by any build. Apart from
   `snapshot.ts` so the docs never load the upgrade tables. */

import { salvageState, validate } from "@/modules/studio/axes"
import type { StateIssue } from "@/modules/studio/axes"
import { migrate } from "@/modules/studio/axes/migrate"

import { cleanName, MAX_NAME_LENGTH, stripName } from "./snapshot"
import type { Snapshot } from "./snapshot"

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
