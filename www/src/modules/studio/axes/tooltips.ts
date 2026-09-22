/* Tooltips — a surface decision of its own, never synced to the popover's:
   an inverted chip or the bordered popover surface.

   Engine: `style` is an enum param on `tooltip`. */

import type { Resolved, StudioState } from "./index"
import { pick } from "./pick"
import type { ChapterSpec } from "./spec"

export const TOOLTIP_DEFAULTS = {
  tooltipStyle: "inverted",
}

export const TOOLTIP_STYLE_OPTIONS = [
  {
    value: "inverted",
    label: "Inverted",
    description:
      "A near-black chip with light text in light mode, flipped in dark " +
      "mode; no border or shadow.",
    seenIn: [
      "shadcn/ui",
      "Radix Themes",
      "Material 3",
      "Carbon",
      "Mantine",
      "Chakra UI",
      "Spectrum 2",
      "Primer",
      "Geist",
      "React Aria",
    ],
  },
  {
    value: "surface",
    label: "Surface",
    description:
      "The popover surface: popover fill, 1px border, popover shadow and " +
      "regular text color.",
    seenIn: ["Fluent 2", "Polaris", "HeroUI", "coss ui", "Base UI"],
  },
]

export function resolveTooltips(state: StudioState): Resolved {
  return {
    params: {
      tooltip: {
        style: pick(TOOLTIP_STYLE_OPTIONS, state.tooltipStyle, "inverted"),
      },
    },
  }
}

export const TOOLTIP_SPEC = {
  label: "Tooltips",
  description: "The tooltip's own surface, independent of popovers.",
  axes: {
    tooltipStyle: {
      label: "Tooltip",
      description:
        "Whether tooltips invert to a high-contrast chip or reuse the " +
        "popover surface. The arrow follows the chosen fill.",
      value: { type: "enum", options: TOOLTIP_STYLE_OPTIONS },
      guidance:
        "Inverted is the default in 10 of 15 checked systems. Surface is " +
        "Fluent 2's default (inverted is its opt-in), Polaris', HeroUI's, " +
        "coss ui's and Base UI's, and Material 3's rich tooltip. Surface " +
        "suits tooltips that carry more than a few words; Inverted stays " +
        "legible over any content.",
    },
  },
} satisfies ChapterSpec<typeof TOOLTIP_DEFAULTS>
