/* Accordion — one language for accordion and disclosure: the container
   groups the items (hairline rows · one bordered surface · a card each), the
   marker says a trigger opens (chevron · plus/minus) and sits trailing or
   leading.

   Engine: `container` is an enum param on `accordion` (the group), `marker`
   and `markerPosition` on `disclosure` (the item that renders the trigger) —
   a standalone disclosure follows the same decisions. */

import type { Resolved, StudioState } from "./index"

export const ACCORDION_DEFAULTS = {
  accordionContainer: "divided",
  accordionMarker: "chevron",
  accordionMarkerPosition: "trailing",
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

const pick = (options: { value: string }[], value: string, fallback: string) =>
  options.some((o) => o.value === value) ? value : fallback

export const WIRED = true

export function resolveAccordion(state: StudioState): Resolved {
  return {
    params: {
      accordion: {
        container: pick(
          CONTAINER_OPTIONS,
          state.accordionContainer,
          ACCORDION_DEFAULTS.accordionContainer,
        ),
      },
      disclosure: {
        marker: pick(
          MARKER_OPTIONS,
          state.accordionMarker,
          ACCORDION_DEFAULTS.accordionMarker,
        ),
        markerPosition: pick(
          POSITION_OPTIONS,
          state.accordionMarkerPosition,
          ACCORDION_DEFAULTS.accordionMarkerPosition,
        ),
      },
    },
  }
}
