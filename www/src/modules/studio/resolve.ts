/* From studio state to the design system the engine consumes. The registry's
   param defaults are the floor; every chapter's resolution lands on top. Pure
   and React-free — shared by the panel, the preview iframe, the docs demos and
   the /r/* registry routes. */

import { DEFAULTS as REGISTRY_DEFAULTS } from "@/modules/create/preset/defaults"
import type { DesignSystem } from "@/modules/create/preset/types"

import { resolveAll } from "./axes"
import type { StudioState } from "./axes"

export function resolveDesignSystem(state: StudioState): DesignSystem {
  const resolved = resolveAll(state)
  const componentParams: Record<string, Record<string, string>> = {}
  for (const [component, defaults] of Object.entries(
    REGISTRY_DEFAULTS.componentParams,
  )) {
    componentParams[component] = { ...defaults, ...resolved.params[component] }
  }
  // Params for components without registry defaults still ride through.
  for (const [component, selections] of Object.entries(resolved.params)) {
    componentParams[component] ??= selections
  }
  return {
    componentParams,
    tokens: resolved.tokens,
    density: resolved.density ?? "default",
    color: resolved.color,
    icons: resolved.icons,
  }
}
