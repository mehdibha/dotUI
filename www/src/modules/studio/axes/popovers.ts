/* Popovers — the anchored panel's own decisions, past what Surfaces, Menus
   and Motion own: the arrow pointing at the trigger, and how a title sits.

   Engine: `tip` is an enum param on `popover` (None hides the arrow slot);
   `header` is a `dialog` param whose band slice styles the title inside a
   popover. */

import type { Resolved, StudioState } from "./index"
import { pick } from "./pick"
import type { ChapterSpec } from "./spec"

export const POPOVER_DEFAULTS = {
  popoverTip: "none",
  popoverHeader: "title",
}

export const TIP_OPTIONS = [
  {
    value: "none",
    label: "None",
    description: "The panel floats beside its trigger with no pointer.",
    seenIn: ["shadcn/ui", "Radix Themes", "Fluent 2", "Mantine", "Carbon"],
  },
  {
    value: "tip",
    label: "Tip",
    description:
      "A 10px triangle in the panel's fill and border color points at the " +
      "trigger from whichever side the panel opens on.",
    seenIn: ["Ant Design", "Spectrum 2", "Cloudscape", "Primer", "Base UI"],
  },
]

export const HEADER_OPTIONS = [
  {
    value: "title",
    label: "Title",
    description:
      "A popover's title is plain medium-weight text above the body.",
    seenIn: ["shadcn/ui", "Ant Design"],
  },
  {
    value: "band",
    label: "Band",
    description:
      "The title sits in a muted band across the top of the popover, " +
      "divided from the body by a hairline; the arrow takes the band's " +
      "fill when it points up.",
  },
]

export function resolvePopovers(state: StudioState): Resolved {
  return {
    params: {
      popover: { tip: pick(TIP_OPTIONS, state.popoverTip, "none") },
      dialog: { header: pick(HEADER_OPTIONS, state.popoverHeader, "title") },
    },
  }
}

export const POPOVER_SPEC = {
  label: "Popovers",
  description:
    "Anchored panels' own decisions — the arrow and the title — past what " +
    "Surfaces (fill, border, shadow), Menus and Motion already own.",
  axes: {
    popoverTip: {
      label: "Arrow",
      description:
        "Whether every Popover, including the Select list, points at its " +
        "trigger with an arrow.",
      value: { type: "enum", options: TIP_OPTIONS },
      guidance:
        "Arrowless is the modern web default (shadcn/ui, Radix Themes, " +
        "Mantine and Fluent 2 default off, and Carbon v12 removes its " +
        "caret). The arrow is on by default in Ant Design, Spectrum 2, " +
        "Cloudscape and Primer's Popover — pick it for dense enterprise " +
        "UIs where it matters which control opened the panel.",
    },
    popoverHeader: {
      label: "Header",
      description: "How a titled popover presents its heading.",
      value: { type: "enum", options: HEADER_OPTIONS },
      guidance:
        "shadcn/ui's PopoverHeader and Ant Design's title are plain text. " +
        "Ant's wireframe theme divides the title with a hairline; a tinted " +
        "band is Bootstrap's popover-header, outside the checked systems. " +
        "Band reads as a small window; Title keeps popovers light.",
    },
  },
} satisfies ChapterSpec<typeof POPOVER_DEFAULTS>
