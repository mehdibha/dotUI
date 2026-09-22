/* Accordion — the container groups the items (hairline rows · one bordered
   surface · a card each), the marker says a trigger opens (chevron ·
   plus/minus) and sits trailing or leading.

   Engine: three enum params on `accordion`. Collapsible is a behavior
   primitive with no look of its own, so no axis reaches it. */

import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

export const ACCORDION_DEFAULTS = {
  accordionContainer: "divided",
  accordionMarker: "chevron",
  accordionMarkerPosition: "trailing",
}

export const CONTAINER_OPTIONS = [
  {
    value: "divided",
    label: "Divided",
    description:
      "Bare rows on the page with a hairline between items; no outer border.",
    seenIn: ["shadcn/ui", "Spectrum 2", "Mantine"],
  },
  {
    value: "boxed",
    label: "Boxed",
    description:
      "All items inside one bordered card surface, split by hairlines, " +
      "with the Panels radius.",
    seenIn: ["Ant Design", "Mantine"],
  },
  {
    value: "cards",
    label: "Cards",
    description:
      "Each item is its own bordered card with the Panels radius, stacked " +
      "with an 8px gap.",
    seenIn: ["Mantine"],
  },
]

export const MARKER_OPTIONS = [
  {
    value: "chevron",
    label: "Chevron",
    description: "A down chevron that turns 180° to point up when open.",
    seenIn: ["shadcn/ui", "Mantine"],
  },
  {
    value: "plus",
    label: "Plus",
    description: "A plus that swaps to a minus when open.",
  },
]

export const POSITION_OPTIONS = [
  {
    value: "leading",
    label: "Leading",
    description: "The marker sits before the title, at the row's start.",
    seenIn: ["Spectrum 2", "Ant Design"],
  },
  {
    value: "trailing",
    label: "Trailing",
    description: "The marker sits at the row's far end, after the title.",
    seenIn: ["shadcn/ui"],
  },
]

const pick = (options: { value: string }[], value: string, fallback: string) =>
  options.some((o) => o.value === value) ? value : fallback

export function resolveAccordion(state: StudioState): Resolved {
  return {
    params: {
      accordion: {
        container: pick(
          CONTAINER_OPTIONS,
          state.accordionContainer,
          ACCORDION_DEFAULTS.accordionContainer,
        ),
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

export const ACCORDION_SPEC = {
  label: "Accordion",
  description:
    "How an accordion groups its items and marks a trigger that expands.",
  axes: {
    accordionContainer: {
      label: "Container",
      description: "The surface around the items.",
      value: { type: "enum", options: CONTAINER_OPTIONS },
      guidance:
        "Divided is the default in shadcn, Spectrum 2 and Mantine; Ant " +
        "defaults to boxed; Mantine ships all three (default, contained, " +
        "separated). Divided suits FAQ-style prose on the page; boxed and " +
        "cards suit settings or dashboards where the accordion is an object.",
    },
    accordionMarker: {
      label: "Marker",
      description: "The glyph that shows a trigger opens and closes.",
      value: { type: "enum", options: MARKER_OPTIONS },
      guidance:
        "Every system checked (shadcn, Spectrum 2, Ant, Mantine) defaults " +
        "to a chevron; plus/minus is a content-site convention, and Mantine " +
        "documents swapping its chevron for one.",
    },
    accordionMarkerPosition: {
      label: "Position",
      description: "Which end of the trigger row the marker sits on.",
      value: { type: "enum", options: POSITION_OPTIONS },
      guidance:
        "shadcn trails the marker; Spectrum 2 and Ant lead with it, " +
        "tree-style. Leading reads as a disclosure list; trailing leaves " +
        "titles aligned with the body text.",
    },
  },
} satisfies ChapterSpec<typeof ACCORDION_DEFAULTS>
