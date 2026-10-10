"use client"

/* What Share and Export point at: a preset or a shared link as is, or the
   user's system or unsaved slot as a snapshot. The snapshot is posted when
   Share or Export opens, never on a press: the command shows its URL, Open
   in v0 is a plain link, and iOS share needs the press's activation. */

import { useEffect, useState } from "react"

import { parseSnapshot } from "@/lib/snapshots/parse"
import { canonicalJson, SNAPSHOT_ID } from "@/lib/snapshots/snapshot"
import type { Snapshot } from "@/lib/snapshots/snapshot"

import type { StudioState } from "./axes"
import { stamp } from "./axes/version"
import type { Current } from "./selection"

export type Source = { kind: "preset" | "snapshot"; id: string }

/** `p/<preset>` or `s/<snapshot>`, under `/r/`. */
export const registryPath = ({ kind, id }: Source) =>
  `${kind === "preset" ? "p" : "s"}/${id}`

export const studioLink = ({ kind, id }: Source) =>
  `${window.location.origin}/studio?${kind === "preset" ? "preset" : "s"}=${id}`

interface Content {
  name: string
  state: StudioState
}

async function postSnapshot({ name, state }: Content): Promise<string> {
  const response = await fetch("/api/snapshots", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, state: stamp(state) }),
  })
  if (!response.ok) throw new Error(`POST /api/snapshots → ${response.status}`)
  const { id } = (await response.json()) as { id: unknown }
  if (typeof id !== "string" || !SNAPSHOT_ID.test(id))
    throw new Error("POST /api/snapshots returned no id")
  return id
}

// By content: a repeat post costs the store a refused write and a read.
const ids = new Map<string, string>()
const requests = new Map<string, Promise<string>>()

const contentKey = ({ name, state }: Content) => canonicalJson({ name, state })

/** The snapshot id of a name and state, posted once per content. */
export function snapshotOf(content: Content): Promise<string> {
  const key = contentKey(content)
  const known = ids.get(key)
  if (known) return Promise.resolve(known)
  let request = requests.get(key)
  if (!request) {
    request = postSnapshot(content)
      .then((id) => {
        ids.set(key, id)
        return id
      })
      .finally(() => requests.delete(key))
    requests.set(key, request)
  }
  return request
}

/** A design system's source, resolved while mounted: the user's system or
 *  unsaved slot is snapshotted on mount and after each change. */
export function useSource({
  view,
  content,
}: Pick<Current, "view" | "content">): {
  source?: Source
  failed: boolean
  retry: () => void
} {
  const name = content?.name
  const state = content?.state
  const [attempt, setAttempt] = useState(0)
  const [failed, setFailed] = useState<string>()
  const [, setResolved] = useState<string>()
  useEffect(() => {
    if (name === undefined || !state) return
    let live = true
    snapshotOf({ name, state }).then(
      (id) => live && setResolved(id),
      (error: unknown) => {
        console.error(error)
        if (live) setFailed(contentKey({ name, state }))
      },
    )
    return () => {
      live = false
    }
  }, [name, state, attempt])
  const retry = () => {
    setFailed(undefined)
    setAttempt((n) => n + 1)
  }
  if (!content)
    return {
      source: view && {
        kind: view.kind === "preset" ? "preset" : "snapshot",
        id: view.id,
      },
      failed: false,
      retry,
    }
  const key = contentKey(content)
  const id = ids.get(key)
  return {
    source: id ? { kind: "snapshot", id } : undefined,
    failed: !id && failed === key,
    retry,
  }
}

/** A snapshot fetched by id, read like the server's own read; undefined
 *  when no snapshot has that id. */
export async function fetchSnapshot(id: string): Promise<Snapshot | undefined> {
  if (!SNAPSHOT_ID.test(id)) return
  const response = await fetch(`/api/snapshots/${id}`, {
    signal: AbortSignal.timeout(8000),
  })
  if (response.status === 404) return
  if (!response.ok)
    throw new Error(`GET /api/snapshots/${id} → ${response.status}`)
  const snapshot = parseSnapshot(await response.json())
  if (!snapshot) throw new Error(`Snapshot ${id} is unreadable`)
  return snapshot
}
