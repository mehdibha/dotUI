/* Input groups — how a prefix/suffix sits in the field: floating inside the
   shell (shadcn, Geist, Linear, Polaris) or a tinted cell attached to the
   edge (Bootstrap input-group, Ant addonBefore/After). Bootstrap and Ant
   always divide the cell from the input; a few designs let the fill run into
   the field, so the hairline is a choice.

   Engine: one `input.addon` param — the divider only exists on a boxed cell,
   so the two rows fold into `inside | boxed | boxed-flush`. */

import type { Resolved, StudioState } from "./index"
import { pick } from "./inputs"

export const INPUT_GROUP_DEFAULTS = {
  addonLayout: "inside",
  addonDivider: "hairline",
}

export const ADDON_LAYOUT_OPTIONS = [
  { value: "inside", label: "Inside" },
  { value: "boxed", label: "Boxed" },
]

export const ADDON_DIVIDER_OPTIONS = [
  { value: "hairline", label: "Hairline" },
  { value: "none", label: "None" },
]

export const WIRED = true

export function resolveInputGroups(state: StudioState): Resolved {
  const layout = pick(ADDON_LAYOUT_OPTIONS, state.addonLayout, "inside")
  const divider = pick(ADDON_DIVIDER_OPTIONS, state.addonDivider, "hairline")
  const addon =
    layout === "boxed"
      ? divider === "none"
        ? "boxed-flush"
        : "boxed"
      : "inside"
  return { params: { input: { addon } } }
}
