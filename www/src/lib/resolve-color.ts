// resolveColorConfig runs the full color kernel (schema parse + ramp
// generation, ~100ms). Configs are stable references (module constants, store
// snapshots) shared by every consumer in a render pass — the panel, contrast
// readout, chart section, preview and style provider — so memoize by reference
// to run the engine once per config change instead of once per call site.
import { resolveColorConfig } from '@/registry/theme'
import type { ColorConfig } from '@/registry/theme'

const cache = new WeakMap<ColorConfig, ReturnType<typeof resolveColorConfig>>()

export function resolveColorConfigCached(color: ColorConfig) {
  let resolved = cache.get(color)
  if (!resolved) {
    resolved = resolveColorConfig(color)
    cache.set(color, resolved)
  }
  return resolved
}
