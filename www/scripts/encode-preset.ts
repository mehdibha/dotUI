/**
 * Print the `?preset=` value for built-in presets, as JSON keyed by id.
 *
 * The registry identifies a preset only by its encoded design system (the
 * compressed base64url the create page bakes into `components.json`), never
 * by name. Anything outside the app that needs a preset URL — the examples
 * smoke — goes through this so the encoding lives in one place.
 *
 * Usage:  tsx scripts/encode-preset.ts origin spotify
 */

import { encodePreset } from "@/modules/create/preset/codec"
import { PRESETS } from "@/modules/presets/presets-data"

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
  const encoded = encodePreset(preset.designSystem)
  if (!encoded) {
    console.error(`error: preset "${id}" encodes to nothing`)
    process.exit(2)
  }
  out[id] = encoded
}
console.log(JSON.stringify(out))
