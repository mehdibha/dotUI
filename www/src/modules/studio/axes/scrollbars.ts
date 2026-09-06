/* Scrollbars — what the browser's scroll chrome becomes inside the product.
   Engine: base.css puts `scrollbar-width` / `scrollbar-color` on every
   element through the `--scrollbar-*` tokens, so each scroll container reads
   the pair where it sits (scoped demos included); the hover reveal swaps in
   `--scrollbar-color-hover` while the pointer is over the area. */

import type { Resolved, StudioState } from "./index"

export const SCROLLBAR_DEFAULTS = {
  scrollbarStyle: "native",
}

export const STYLE_OPTIONS = [
  { value: "native", label: "Native" },
  { value: "thin", label: "Thin" },
  { value: "overlay", label: "Hover reveal" },
]

const THUMB = "var(--color-border) transparent"

export function resolveScrollbars(state: StudioState): Resolved {
  switch (state.scrollbarStyle) {
    case "thin":
      return {
        tokens: { "--scrollbar-width": "thin", "--scrollbar-color": THUMB },
      }
    case "overlay":
      return {
        tokens: {
          "--scrollbar-width": "thin",
          "--scrollbar-color": "transparent transparent",
          "--scrollbar-color-hover": THUMB,
        },
      }
    default:
      return {}
  }
}
