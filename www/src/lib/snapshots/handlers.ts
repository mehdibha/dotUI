import type { StateIssue } from "@/modules/studio/axes"

import {
  parseSnapshot,
  parseSnapshotInput,
  SNAPSHOT_ID,
  snapshotId,
} from "./snapshot"
import type { Snapshot } from "./snapshot"
import type { SnapshotStore } from "./store"

export const MAX_BODY_BYTES = 16 * 1024
const MAX_ISSUES = 20
const MAX_KEY_LENGTH = 64

const NO_STORE = { "Cache-Control": "no-store" }

const error = (status: number, message: string, extra?: object) =>
  Response.json({ error: message, ...extra }, { status, headers: NO_STORE })

// Issue keys come from the request: bound what is echoed back.
const invalid = (issues: StateIssue[]) =>
  error(400, "Invalid snapshot", {
    issues: issues.slice(0, MAX_ISSUES).map(({ key, problem }) => ({
      key:
        key.length > MAX_KEY_LENGTH ? `${key.slice(0, MAX_KEY_LENGTH)}…` : key,
      problem,
    })),
    ...(issues.length > MAX_ISSUES
      ? { omitted: issues.length - MAX_ISSUES }
      : {}),
  })

/** The body as text, or null once it passes `limit` bytes. */
async function readBody(
  request: Request,
  limit: number,
): Promise<string | null> {
  if (Number(request.headers.get("content-length")) > limit) return null
  if (!request.body) return ""
  const reader = request.body.getReader()
  const decoder = new TextDecoder()
  let size = 0
  let text = ""
  for (;;) {
    const { done, value } = await reader.read()
    if (done) return text + decoder.decode()
    size += value.byteLength
    if (size > limit) {
      await reader.cancel()
      return null
    }
    text += decoder.decode(value, { stream: true })
  }
}

/** A thrown error becomes a logged, uncached 500. */
async function guard(respond: () => Promise<Response>): Promise<Response> {
  try {
    return await respond()
  } catch (cause) {
    console.error(cause)
    return error(500, "Internal error")
  }
}

/** `POST /api/snapshots` → `{ id }`. */
export const createSnapshot = (request: Request, store: SnapshotStore) =>
  guard(async () => {
    const body = await readBody(request, MAX_BODY_BYTES)
    if (body === null) return error(413, "Body exceeds 16 KB")
    let raw: unknown
    try {
      raw = JSON.parse(body)
    } catch {
      return error(400, "Body is not JSON")
    }
    const input = parseSnapshotInput(raw)
    if (!input.ok) return invalid(input.issues)
    const id = await snapshotId(input.value)
    const snapshot: Snapshot = { ...input.value, createdAt: Date.now() }
    await store.put(id, JSON.stringify(snapshot))
    return Response.json({ id }, { headers: NO_STORE })
  })

/** `GET /api/snapshots/$id` → the `Snapshot`. */
export const readSnapshot = (id: string, store: SnapshotStore) =>
  guard(async () => {
    if (!SNAPSHOT_ID.test(id)) return error(400, "Invalid snapshot id")
    const json = await store.get(id)
    if (json === null) return error(404, "Snapshot not found")
    let raw: unknown
    try {
      raw = JSON.parse(json)
    } catch {
      raw = undefined
    }
    const snapshot = parseSnapshot(raw)
    if (!snapshot.ok) {
      console.error(`Stored snapshot ${id} is invalid`, snapshot.issues)
      return error(500, "Stored snapshot is invalid")
    }
    return Response.json(snapshot.value, {
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
    })
  })
