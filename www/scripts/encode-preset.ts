/**
 * Print the registry query for built-in presets, as JSON keyed by id — e.g.
 * `{"spotify":"preset=spotify@1"}`, rev-pinned like every export.
 *
 * Anything outside the app that needs a preset URL — the examples smoke —
 * goes through this so the grammar lives in one place (the codec).
 *
 * Usage:  tsx scripts/encode-preset.ts origin spotify
 */

import { PRESETS } from "@/modules/presets/catalog"
import { encodeQuery } from "@/modules/studio/preset/codec"

const ids = process.argv.slice(2)
if (ids.length === 0) {
  console.error("usage: tsx scripts/encode-preset.ts <preset-id> [...]")
  process.exit(2)
}

const out: Record<string, string> = {}
for (const id of ids) {
  const preset = PRESETS.find((p) => p.id === id)
  if (!preset) {
    console.error(
      `error: unknown preset "${id}" (known: ${PRESETS.map((p) => p.id).join(", ")})`,
    )
    process.exit(2)
  }
  out[id] = encodeQuery(preset, preset)
}
console.log(JSON.stringify(out))
