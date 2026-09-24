import { useCallback, useEffect, useState } from "react"

import { MAX_NAME_LENGTH } from "@/lib/snapshots/snapshot"
import { codeFlags } from "@/publisher/code-options"
import { closestPreset } from "@/modules/presets"
import { useMyPresets } from "@/modules/studio/preset"
import {
  DEFAULT_DESIGN_SYSTEM_NAME,
  useDesignSystemName,
} from "@/modules/studio/preset/storage"
import { useStudio } from "@/modules/studio/use-studio"

import { useCodeOptions } from "./code-options-store"
import type { ExportUrl } from "./types"

export type ExportUrls =
  | { status: "publishing" }
  | { status: "failed"; retry: () => void }
  | { status: "ready"; url: ExportUrl }

// Snapshot ids by request body: reopening the dialog on an unchanged design
// system reuses the id. Failures are dropped so a retry posts again.
const published = new Map<string, Promise<string>>()

function publishSnapshot(body: string): Promise<string> {
  let id = published.get(body)
  if (!id) {
    id = fetch("/api/snapshots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    }).then(async (response) => {
      if (!response.ok)
        throw new Error(`POST /api/snapshots → ${response.status}`)
      return ((await response.json()) as { id: string }).id
    })
    id.catch(() => published.delete(body))
    published.set(body, id)
  }
  return id
}

/**
 * Publishes the current design system as a snapshot, then builds registry URLs
 * under it — e.g. `url("init")` → `https://dotui.org/r/s/<id>/init.json?code=arrays`.
 * The snapshot lives on the origin that stored it, so URLs point back at this
 * origin: exports from localhost only resolve on this machine.
 */
export function useExportUrl(): ExportUrls {
  const { state } = useStudio()
  const { presets, activeId } = useMyPresets()
  const storedName = useDesignSystemName()
  const name =
    (presets.find((p) => p.id === activeId)?.name ?? storedName)
      .trim()
      .slice(0, MAX_NAME_LENGTH) || DEFAULT_DESIGN_SYSTEM_NAME
  const flags = codeFlags(useCodeOptions())
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState<
    { id: string } | { failed: true } | undefined
  >()

  useEffect(() => {
    let cancelled = false
    setResult(undefined)
    publishSnapshot(
      JSON.stringify({ name, base: closestPreset(state).id, state }),
    ).then(
      (id) => !cancelled && setResult({ id }),
      (error: unknown) => {
        console.error(error)
        if (!cancelled) setResult({ failed: true })
      },
    )
    return () => {
      cancelled = true
    }
  }, [state, name, attempt])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  if (!result) return { status: "publishing" }
  if ("failed" in result) return { status: "failed", retry }
  const base = `${window.location.origin}/r/s/${result.id}`
  const query = flags ? `?code=${flags}` : ""
  return {
    status: "ready",
    url: (file) => `${base}/${file}.json${query}`,
  }
}
