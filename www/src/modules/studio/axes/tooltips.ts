/* Tooltips — a surface decision of its own: shadcn, Radix and GitHub invert to
   a near-black chip; MUI and Linear keep the tooltip on a bordered surface.
   Motion: how the chip enters and leaves, apart from the popover's.

   Engine: `style` and `motion` are enum params on `tooltip`; motion's timing
   is its `--studio-tooltip-*` vars. */

import type { Resolved, StudioState } from "./index"
import { ease, resolveEntrance } from "./motion"
import type { Entrance } from "./motion"
import { pick } from "./pick"

/* shadcn's (style-nova + tw-animate): fade, zoom from 95% and an 8px slide
   in, fade and zoom out, tw-animate's 150ms both ways on CSS `ease`. */
const MOTION: Entrance = {
  pattern: "scale",
  enter: 150,
  curve: { type: "easing", ease: ease("ease") },
  exit: 150,
  exitEase: ease("ease"),
}

export const TOOLTIP_DEFAULTS = {
  tooltipStyle: "inverted",
  tooltipMotion: MOTION,
}

export const TOOLTIP_STYLE_OPTIONS = [
  { value: "inverted", label: "Inverted" },
  { value: "surface", label: "Surface" },
]

export const MOTION_PATTERNS = [
  { value: "scale", label: "Scale" },
  { value: "fade", label: "Fade" },
  { value: "slide", label: "Slide" },
  { value: "none", label: "None" },
]

export function resolveTooltips(state: StudioState): Resolved {
  const motion = resolveEntrance(
    "tooltip",
    state.tooltipMotion,
    MOTION,
    MOTION_PATTERNS,
  )
  return {
    tokens: motion.tokens,
    params: {
      tooltip: {
        style: pick(TOOLTIP_STYLE_OPTIONS, state.tooltipStyle, "inverted"),
        motion: motion.pattern,
      },
    },
  }
}
