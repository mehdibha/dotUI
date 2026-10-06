/* Accordion — the container groups the items (hairline rows · one bordered
   surface · a card each), the marker says a trigger opens (chevron ·
   plus/minus) and sits trailing or leading. How a panel opens is Motion's.

   Engine: three enum params on `accordion`. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

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

export const ACCORDION_SCHEMA: ChapterSchema<typeof ACCORDION_DEFAULTS> = {
  accordionContainer: oneOf(CONTAINER_OPTIONS),
  accordionMarker: oneOf(MARKER_OPTIONS),
  accordionMarkerPosition: oneOf(POSITION_OPTIONS),
}

export function resolveAccordion(state: Effective): Resolved {
  return {
    params: {
      accordion: {
        container: state.accordionContainer,
        marker: state.accordionMarker,
        markerPosition: state.accordionMarkerPosition,
      },
    },
  }
}

export const chapter = defineChapter({
  id: "accordion",
  defaults: ACCORDION_DEFAULTS,
  schema: ACCORDION_SCHEMA,
  resolve: resolveAccordion,
})
