import { loadSnapshot } from "@/lib/snapshots/handlers"
import { SNAPSHOT_ID } from "@/lib/snapshots/snapshot"
import type { SnapshotStore } from "@/lib/snapshots/store"
import {
  CODE_FLAGS,
  codeFlags,
  DEFAULT_CODE_OPTIONS,
  parseCodeFlags,
} from "@/publisher/code-options"
import type { CodeOptions } from "@/publisher/code-options"
import { getPreset, ORIGIN, resolvePreset } from "@/modules/presets"
import type { DesignSystem } from "@/modules/studio/preset/types"
import { designSystemOf } from "@/modules/studio/resolve"

import { notFound, registryError } from "./response"

export type RegistrySource =
  | { kind: "preset"; id: string }
  | { kind: "snapshot"; id: string }

export interface RegistryRequest {
  /** The file without `.json`: `button`, `init`, `registry`, `all`, `v0`, `font-inter`. */
  name: string
  source: RegistrySource
  codeOptions: CodeOptions
  /** Where a sibling item is served: same design system, same code style. */
  itemUrl: (name: string) => string
  /** Where /studio opens the design system. */
  studioUrl: string
}

export type Result<T> =
  | { ok: true; value: T }
  | { ok: false; response: Response }

// `/r/<name>.json` (Origin), `/r/p/<preset>/<name>.json`, `/r/s/<id>/<name>.json`.
const PATH = /^\/r\/(?:([ps])\/([^/]+)\/)?([^/]+)\.json$/

export function parseRegistryRequest(url: URL): Result<RegistryRequest> {
  const match = PATH.exec(url.pathname)
  if (!match)
    return { ok: false, response: notFound("No registry file at this path.") }
  const [, prefix, id = "", name = ""] = match

  let source: RegistrySource = { kind: "preset", id: ORIGIN.id }
  if (prefix === "p") {
    if (!getPreset(id))
      return { ok: false, response: notFound("No built-in preset by this id.") }
    source = { kind: "preset", id }
  } else if (prefix === "s") {
    if (!SNAPSHOT_ID.test(id))
      return { ok: false, response: notFound("No design system by this id.") }
    source = { kind: "snapshot", id }
  }

  const code = url.searchParams.getAll("code")
  const codeOptions =
    code.length === 0
      ? DEFAULT_CODE_OPTIONS
      : code.length === 1
        ? parseCodeFlags(code[0]!)
        : undefined
  if (!codeOptions)
    return {
      ok: false,
      response: registryError(
        400,
        "Invalid code style",
        `?code= takes a comma-separated list of: ${CODE_FLAGS.join(", ")}.`,
      ),
    }

  const base = `${url.origin}/r${prefix ? `/${prefix}/${id}` : ""}`
  const flags = codeFlags(codeOptions)
  const query = flags ? `?code=${flags}` : ""
  return {
    ok: true,
    value: {
      name,
      source,
      codeOptions,
      itemUrl: (item) => `${base}/${item}.json${query}`,
      studioUrl: `${url.origin}/studio?${source.kind === "preset" ? "preset" : "s"}=${source.id}`,
    },
  }
}

/** The design system a source names; `undefined` for a missing snapshot. */
export async function resolveSource(
  source: RegistrySource,
  store: SnapshotStore,
): Promise<{ name: string; designSystem: DesignSystem } | undefined> {
  if (source.kind === "preset") {
    const preset = getPreset(source.id)
    return (
      preset && { name: preset.name, designSystem: resolvePreset(preset.id) }
    )
  }
  const snapshot = await loadSnapshot(source.id, store)
  return snapshot
    ? { name: snapshot.name, designSystem: designSystemOf(snapshot.state) }
    : undefined
}
