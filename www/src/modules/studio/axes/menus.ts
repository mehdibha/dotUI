/* Menus — one language for every floating list: Menu, Select and ComboBox
   listboxes, and the Command palette are one synced family, so one axis
   writes all of them.

   Engine: `indicator`, `highlight`, `inset` and `labels` are enum params on
   `menu` and `list-box` (highlight re-points the `--color-highlight` pair
   through the param's vars); `search` and `scale` are enum params on
   `command`, the search-led surface, which also takes `inset` so its list
   gutter follows the rows. */

import type { Resolved, StudioState } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const MENU_DEFAULTS = {
  menuIndicator: "check-end",
  menuHighlight: "neutral",
  menuInset: "inset",
  menuLabels: "sentence",
  menuSearch: "field",
  menuScale: "default",
}

/* Leading check with a reserved gutter on every item (Radix, shadcn,
   Material) or trailing on the selected item only (macOS, Arc). */
export const INDICATOR_OPTIONS = [
  { value: "check-start", label: "Leading check" },
  { value: "check-end", label: "Trailing check" },
]

/* A neutral wash (Linear, Geist, Vercel) or the solid accent with inverted
   text (macOS, Windows, Chakra). */
export const HIGHLIGHT_OPTIONS = [
  { value: "neutral", label: "Neutral" },
  { value: "accent", label: "Accent" },
]

export const INSET_OPTIONS = [
  { value: "inset", label: "Inset" },
  { value: "full-bleed", label: "Full bleed" },
]

export const LABEL_OPTIONS = [
  { value: "sentence", label: "Sentence" },
  { value: "caps", label: "Caps" },
]

/* A boxed field floating in the padding (shadcn/cmdk, Spotlight), a
   full-bleed bar keeping the magnifier over a hairline, or a bare prompt
   (Linear, Raycast). */
export const SEARCH_OPTIONS = [
  { value: "field", label: "Field" },
  { value: "bar", label: "Bar" },
  { value: "prompt", label: "Prompt" },
]

export const SCALE_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "large", label: "Large" },
]

export const MENU_SCHEMA: ChapterSchema<typeof MENU_DEFAULTS> = {
  menuIndicator: oneOf(INDICATOR_OPTIONS),
  menuHighlight: oneOf(HIGHLIGHT_OPTIONS),
  menuInset: oneOf(INSET_OPTIONS),
  menuLabels: oneOf(LABEL_OPTIONS),
  menuSearch: oneOf(SEARCH_OPTIONS),
  menuScale: oneOf(SCALE_OPTIONS),
}

export function resolveMenus(state: StudioState): Resolved {
  const list = {
    indicator: state.menuIndicator,
    highlight: state.menuHighlight,
    inset: state.menuInset,
    labels: state.menuLabels,
  }
  return {
    params: {
      menu: list,
      "list-box": list,
      command: {
        search: state.menuSearch,
        inset: list.inset,
        scale: state.menuScale,
      },
    },
  }
}
