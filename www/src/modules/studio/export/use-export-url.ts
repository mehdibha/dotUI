import { codeFlags } from "@/publisher/code-options"

import { useCodeOptions } from "./code-options-store"
import type { ExportUrl } from "./types"

/**
 * Registry URLs under a published snapshot, in the user's code style — e.g.
 * `url("init")` → `https://dotui.org/r/s/<id>/init.json?code=arrays`. The
 * snapshot lives on the origin that stored it, so exports from localhost only
 * resolve on this machine.
 */
export function useExportUrl(snapshotId: string): ExportUrl {
  const flags = codeFlags(useCodeOptions())
  const query = flags ? `?code=${flags}` : ""
  return (file) =>
    `${window.location.origin}/r/s/${snapshotId}/${file}.json${query}`
}
