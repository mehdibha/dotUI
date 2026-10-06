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

export const CONTAINER_OPTIONS = [
  {
    value: "divided",
    label: "Divided",
    credits: [
      "shadcn nova, vega, lyra, sera",
      "Geist",
      "Carbon",
      "Chakra (outline)",
      "Mantine",
      "Spectrum 2",
    ],
  },
  {
    value: "contained",
    label: "Contained",
    credits: [
      "shadcn mira, rhea, luma, maia",
      "Ant Design",
      "Chakra (enclosed)",
      "Mantine (contained)",
    ],
  },
  {
    value: "separated",
    label: "Separated",
    credits: ["Mantine (separated)", "HeroUI (splitted)"],
  },
  {
    value: "plain",
    label: "Plain",
    credits: ["Notion", "Fluent 2", "Chakra (plain)"],
  },
]

export const MARKER_OPTIONS = [
  {
    value: "trailing-chevron",
    label: "Trailing chevron",
    credits: ["shadcn", "Mantine", "Chakra", "MUI", "Carbon"],
  },
  {
    value: "leading-caret",
    label: "Leading caret",
    credits: [
      "Notion",
      "Linear",
      "Stripe",
      "Fluent 2",
      "Spectrum 2",
      "Ant Design",
      "Apple HIG",
    ],
  },
]

export const ACCORDION_SCHEMA: ChapterSchema<typeof ACCORDION_DEFAULTS> = {
  accordionContainer: oneOf(CONTAINER_OPTIONS),
  accordionMarker: oneOf(MARKER_OPTIONS),
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
