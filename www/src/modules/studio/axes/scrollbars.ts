/* Scrollbars — what the browser's scroll chrome becomes inside the product.
   Engine: base.css puts `scrollbar-width` / `scrollbar-color` on every
   element through the `--scrollbar-*` tokens, so each scroll container reads
   the pair where it sits (scoped demos included); the hover reveal swaps in
   `--scrollbar-color-hover` while the pointer is over the area. */

import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

export const SCROLLBAR_DEFAULTS = {
  scrollbarStyle: "native",
}

export const STYLE_OPTIONS = [
  {
    value: "native",
    label: "Native",
    description:
      "The browser's own scrollbars — full width with a track on Windows, " +
      "overlay bars on macOS by default.",
    seenIn: ["Geist"],
  },
  {
    value: "thin",
    label: "Thin",
    description:
      "Always-visible thin scrollbars: a border-colored thumb on a " +
      "transparent track.",
    seenIn: ["HeroUI"],
  },
  {
    value: "overlay",
    label: "Hover reveal",
    description:
      "Thin scrollbars that stay invisible until the pointer is over the " +
      "scroll area, then show a border-colored thumb.",
    seenIn: ["Radix Themes", "shadcn/ui", "coss ui"],
  },
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

export const SCROLLBAR_SPEC = {
  label: "Scrollbars",
  description:
    "The look of every scroll container's scrollbars, through the standard " +
    "scrollbar-width and scrollbar-color properties.",
  axes: {
    scrollbarStyle: {
      label: "Scrollbars",
      description:
        "Whether scrollbars stay the browser's, turn thin and quiet, or hide " +
        "until the pointer is over the scrolling area.",
      value: { type: "enum", options: STYLE_OPTIONS },
      guidance:
        "Geist leaves page scrollbars native and only thins or hides them " +
        "in specific components; HeroUI gives scroll containers such as " +
        "modal bodies thin themed bars; Radix Themes, shadcn/ui and coss " +
        "ui ship a ScrollArea whose bars appear on hover, leaving the page " +
        "native. Thin and Hover reveal read app-like; Native is the safest " +
        "for long documents and for users who rely on a visible track.",
    },
  },
} satisfies ChapterSpec<typeof SCROLLBAR_DEFAULTS>
