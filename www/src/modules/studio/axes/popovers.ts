/* Popovers — the anchored panel's own decisions, past what Surfaces and Menus
   own. Tip: the arrow pointing at the trigger (Cloudscape, Ant, Bootstrap,
   Apple) vs the arrowless modern default (shadcn, Radix Themes, Linear).
   Header: a plain title (shadcn v4 PopoverHeader, Base UI) or a tinted
   divided band (Bootstrap popover-header, Ant title). Motion: how the panel
   enters and leaves — menus, selects and pickers ride on it.

   Engine: `tip` is a files-enum on `popover` (which base file ships — the
   `showArrow` default flips); `header` is a `dialog` param whose band slice
   styles the title inside a popover; motion is the `motion` param on
   `popover` plus its `--studio-popover-*` timing vars. */

import type { Resolved, StudioState } from "./index"
import { ease, resolveEntrance } from "./motion"
import type { Entrance } from "./motion"
import { pick } from "./pick"

/* shadcn's (style-nova + tw-animate): fade, zoom from 95% and an 8px slide
   in, fade and zoom out, 100ms both ways on CSS `ease`. */
const MOTION: Entrance = {
  pattern: "scale",
  enter: 100,
  curve: { type: "easing", ease: ease("ease") },
  exit: 100,
  exitEase: ease("ease"),
}

export const POPOVER_DEFAULTS = {
  popoverTip: "none",
  popoverHeader: "title",
  popoverMotion: MOTION,
}

export const TIP_OPTIONS = [
  { value: "none", label: "None" },
  { value: "tip", label: "Tip" },
]

export const HEADER_OPTIONS = [
  { value: "title", label: "Title" },
  { value: "band", label: "Band" },
]

export const MOTION_PATTERNS = [
  { value: "scale", label: "Scale" },
  { value: "fade", label: "Fade" },
  { value: "slide", label: "Slide" },
  { value: "none", label: "None" },
]

export function resolvePopovers(state: StudioState): Resolved {
  const motion = resolveEntrance(
    "popover",
    state.popoverMotion,
    MOTION,
    MOTION_PATTERNS,
  )
  return {
    tokens: motion.tokens,
    params: {
      popover: {
        tip: pick(TIP_OPTIONS, state.popoverTip, "none"),
        motion: motion.pattern,
      },
      dialog: { header: pick(HEADER_OPTIONS, state.popoverHeader, "title") },
    },
  }
}
