/* Accordion — how the items are grouped (hairline rows, one container, a
   container each, nothing) and what marks a trigger. The collapsible and
   the timing ride on Motion. The boxes wear the container surface
   (card/styles.ts). */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"

export const CONTAINER_VALUES = [
  "divided",
  "contained",
  "separated",
  "plain",
] as const

export const MARKER_VALUES = ["trailing-chevron", "leading-caret"] as const

export const chapter = defineChapter({
  id: "accordion",
  defaults: {
    accordionContainer: "divided",
    accordionMarker: "trailing-chevron",
  },
  schema: {
    accordionContainer: oneOf(CONTAINER_VALUES),
    accordionMarker: oneOf(MARKER_VALUES),
  },
  resolve(state: Effective): Resolved {
    return {
      params: {
        accordion: {
          layout: state.accordionContainer,
          marker: state.accordionMarker,
        },
      },
    }
  },
})
