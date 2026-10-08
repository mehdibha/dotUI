/* Accordion — how the items are grouped (hairline rows, one container, a
   container each, nothing) and what marks a trigger. The collapsible and
   the timing ride on Motion.

   Engine: two enum params on `accordion`; the boxes wear the container
   surface (card/styles.ts). */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const ACCORDION_DEFAULTS = {
  accordionContainer: "divided",
  accordionMarker: "trailing-chevron",
}

export const CONTAINER_VALUES = [
  "divided",
  "contained",
  "separated",
  "plain",
] as const

export const MARKER_VALUES = ["trailing-chevron", "leading-caret"] as const

export const ACCORDION_SCHEMA: ChapterSchema<typeof ACCORDION_DEFAULTS> = {
  accordionContainer: oneOf(CONTAINER_VALUES),
  accordionMarker: oneOf(MARKER_VALUES),
}

export function resolveAccordion(state: Effective): Resolved {
  return {
    params: {
      accordion: {
        layout: state.accordionContainer,
        marker: state.accordionMarker,
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
