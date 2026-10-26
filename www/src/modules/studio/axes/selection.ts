/* Selection — what selected text looks like. `::selection` reads the
   `text-selection` semantic pair, re-pointed at the neutral ramp, the OS
   highlight, or a color of its own. Whether control text selects is
   States'. */

import { toOklch } from "@dotui/colors"

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { auto, COLOR, oneOf } from "./schema"

export const HIGHLIGHT_VALUES = [
  "accent",
  "neutral",
  "browser",
  "custom",
] as const

/* The ramp's ends: dark ink in either mode, and light ink. */
const DARK_INK = "light-dark(var(--neutral-950), var(--neutral-25))"
const LIGHT_INK = "light-dark(var(--neutral-25), var(--neutral-950))"

export const chapter = defineChapter({
  id: "selection",
  defaults: {
    selectionHighlight: "accent",
    selectionCustomColor: "",
  },
  schema: {
    selectionHighlight: oneOf(HIGHLIGHT_VALUES),
    selectionCustomColor: auto(COLOR),
  },
  resolve(state: Effective): Resolved {
    switch (state.selectionHighlight) {
      case "neutral":
        return {
          color: {
            overrides: {
              // Stronger in dark, where 300 sinks into the page.
              "color-text-selection": {
                light: { palette: "neutral", job: "ui-active" },
                dark: { palette: "neutral", job: "border-interactive" },
              },
            },
          },
        }
      case "browser":
        return {
          tokens: {
            "--color-text-selection": "Highlight",
            "--color-fg-on-text-selection": "HighlightText",
          },
        }
      case "custom": {
        // Unset, it stays the accent highlight; the text takes whichever ink
        // reads.
        const color = state.selectionCustomColor
        if (!color) return {}
        const light = toOklch(color).l > 0.6
        return {
          tokens: {
            "--color-text-selection": color,
            "--color-fg-on-text-selection": light ? DARK_INK : LIGHT_INK,
          },
        }
      }
      default:
        return {}
    }
  },
})
