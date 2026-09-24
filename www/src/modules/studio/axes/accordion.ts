/* Accordion — the container groups the items (hairline rows · one bordered
   surface · a card each), the marker says a trigger opens (chevron ·
   plus/minus) and sits trailing or leading; motion is how a panel opens.

   Engine: four enum params on `accordion` plus its `--studio-accordion-*`
   timing vars. Collapsible has no look of its own but rides the accordion's
   motion: the same `motion` param and vars. */

import type { Resolved, StudioState } from "./index"
import { resolveEntrance } from "./motion"
import type { Entrance } from "./motion"
import { pick } from "./pick"

/* shadcn's (tw-animate's accordion-down/up): the height alone, 200ms on CSS
   `ease-out` both ways. */
const MOTION: Entrance = {
  pattern: "expand",
  enter: 200,
  curve: { type: "easing", ease: [0, 0, 0.58, 1] },
}

export const ACCORDION_DEFAULTS = {
  accordionContainer: "divided",
  accordionMarker: "chevron",
  accordionMarkerPosition: "trailing",
  accordionMotion: MOTION,
}

export const CONTAINER_OPTIONS = [
  { value: "divided", label: "Divided" },
  { value: "boxed", label: "Boxed" },
  { value: "cards", label: "Cards" },
]

export const MARKER_OPTIONS = [
  { value: "chevron", label: "Chevron" },
  { value: "plus", label: "Plus" },
]

export const POSITION_OPTIONS = [
  { value: "leading", label: "Leading" },
  { value: "trailing", label: "Trailing" },
]

export const MOTION_PATTERNS = [
  { value: "expand", label: "Expand" },
  { value: "fade", label: "Expand + fade" },
  { value: "none", label: "None" },
]

export function resolveAccordion(state: StudioState): Resolved {
  const motion = resolveEntrance(
    "accordion",
    state.accordionMotion,
    MOTION,
    MOTION_PATTERNS,
  )
  return {
    tokens: motion.tokens,
    params: {
      accordion: {
        container: pick(CONTAINER_OPTIONS, state.accordionContainer, "divided"),
        marker: pick(MARKER_OPTIONS, state.accordionMarker, "chevron"),
        markerPosition: pick(
          POSITION_OPTIONS,
          state.accordionMarkerPosition,
          "trailing",
        ),
        motion: motion.pattern,
      },
      collapsible: { motion: motion.pattern },
    },
  }
}
