/* From studio state to the design system the engine consumes. The registry's
   param defaults are the floor; every chapter's resolution lands on top, and
   the CSS vars an enum param value carries fold into the global tokens — one
   path for the provider, the exported theme and the class rewriter alike.
   Pure and React-free — shared by the panel, the preview iframe, the docs
   demos and the /r/* registry routes. */

import { DEFAULT_COLOR_CONFIG } from "@/registry/theme"
import { registryUi } from "@/registry/ui/registry"
import { DEFAULTS as REGISTRY_DEFAULTS } from "@/modules/create/preset/defaults"
import type { DesignSystem } from "@/modules/create/preset/types"

import { resolveAll } from "./axes"
import type { StudioState } from "./axes"

const enumVars = new Map<
  string,
  Record<string, Record<string, Record<string, string>>>
>()
for (const item of registryUi) {
  for (const [paramName, def] of Object.entries(item.params ?? {})) {
    if (def.kind !== "enum" || !def.vars) continue
    const byParam = enumVars.get(item.name) ?? {}
    byParam[paramName] = def.vars
    enumVars.set(item.name, byParam)
  }
}

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
  // Only non-default values fold in: an untouched system stays token-free, so
  // scoped providers (docs demos) skip the closure clone entirely.
  const tokens = { ...resolved.tokens }
  for (const [component, selections] of Object.entries(componentParams)) {
    const byParam = enumVars.get(component)
    if (!byParam) continue
    for (const [paramName, value] of Object.entries(selections)) {
      if (value === REGISTRY_DEFAULTS.componentParams[component]?.[paramName])
        continue
      Object.assign(tokens, byParam[paramName]?.[value])
    }
  }
  return {
    componentParams,
    tokens,
    density: resolved.density ?? "default",
    // The default recipe is the floor under a partial slice (overrides only).
    color: resolved.color && { ...DEFAULT_COLOR_CONFIG, ...resolved.color },
    icons: resolved.icons,
  }
}
