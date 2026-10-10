/* From effective studio state to the design system the engine consumes. The registry's
   param defaults are the floor; every chapter's resolution lands on top, and
   the CSS vars an enum param value carries fold into the global tokens — one
   path for the provider, the exported theme and the class rewriter alike.
   Pure and React-free — shared by the panel, the preview iframe, the docs
   demos and the /r/* registry routes. */

import type { ColorConfig } from "@/registry/theme"
import { registryUi } from "@/registry/ui/registry"
import { DEFAULTS as REGISTRY_DEFAULTS } from "@/modules/studio/preset/defaults"
import type { DesignSystem } from "@/modules/studio/preset/types"

import { effective, resolveAll } from "./axes"
import type { Effective, StudioState } from "./axes"

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

/* Equal selections are one frozen object, so `useStyles`' compose cache
   (keyed by object identity) hits across edits and renders. Enum-only
   params keep the set finite. */
const interned = new Map<string, Readonly<Record<string, string>>>()

export function intern(
  component: string,
  selections: Record<string, string>,
): Readonly<Record<string, string>> {
  const id = `${component}|${Object.keys(selections)
    .sort()
    .map((name) => `${name}=${selections[name]}`)
    .join("&")}`
  let hit = interned.get(id)
  if (!hit) interned.set(id, (hit = Object.freeze({ ...selections })))
  return hit
}

/** A design system that crossed a boundary (postMessage) with its
 *  selections interned again. */
export const internDesignSystem = (ds: DesignSystem): DesignSystem => ({
  ...ds,
  componentParams: Object.fromEntries(
    Object.entries(ds.componentParams).map(([component, selections]) => [
      component,
      intern(component, selections),
    ]),
  ),
})

export function resolveDesignSystem(state: Effective): DesignSystem {
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
  for (const [component, selections] of Object.entries(componentParams))
    componentParams[component] = intern(component, selections)
  return {
    componentParams,
    tokens,
    density: resolved.density ?? "default",
    // Always explicit: the page's `base/colors.css` is the site chrome's
    // palette, not Origin's.
    color: resolved.color as ColorConfig,
    icons: resolved.icons,
  }
}

/** Saved state → design system: the one path every consumer takes. */
export const designSystemOf = (state: StudioState) =>
  resolveDesignSystem(effective(state).values)
