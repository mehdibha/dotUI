import { createStyles } from "@/lib/styles"

import { UPPERCASE } from "../button/styles"
import segmentedControlMeta from "./meta"

/* The selection bar, shared with tabs' segmented variant (tabs imports
   these). The chip reads against its track: tone fills one neutral step
   down (Geist, Linear), raised lifts a page-colored chip on shadow (shadcn,
   iOS), ring draws the page chip on an edge alone (Radix surface, Primer,
   Stripe), inverse snaps to full contrast (Carbon). */
export const CHIP_TONE = {
  item: "selected:text-fg-on-selected",
  indicator: "bg-selected shadow-sm",
}
export const CHIP_RAISED = {
  item: "selected:text-fg",
  indicator:
    "bg-(--surface-bg,var(--color-bg)) shadow-sm ring-(length:--studio-control-stroke) ring-border-control",
}
export const CHIP_RING = {
  item: "selected:text-fg",
  indicator:
    "bg-(--surface-bg,var(--color-bg)) ring-(length:--studio-control-stroke) ring-border-control",
}
export const CHIP_INVERSE = {
  item: "selected:text-fg-inverse",
  indicator: "bg-inverse",
}

export const TRACK_FILLED = "bg-muted p-[3px]"
// Outline trades a padding pixel for the hairline so the box stays put.
export const TRACK_OUTLINE =
  "border-(length:--studio-control-stroke) border-border p-[calc(3px-var(--studio-control-stroke))]"

/* Item weight at rest, then selected. */
export const WEIGHT_REGULAR = { item: "font-normal" }
export const WEIGHT_REGULAR_MEDIUM = {
  item: "font-normal selected:font-medium",
}
export const WEIGHT_REGULAR_SEMIBOLD = {
  item: "font-normal selected:font-semibold",
}
export const WEIGHT_MEDIUM = { item: "font-medium" }
export const WEIGHT_MEDIUM_SEMIBOLD = {
  item: "font-medium selected:font-semibold",
}
export const WEIGHT_SEMIBOLD = { item: "font-semibold" }
export const WEIGHT_BOLD = { item: "font-bold" }

const { useStyles, styles } = createStyles(segmentedControlMeta, {
  base: {
    slots: {
      root: "inline-flex w-fit items-center justify-center rounded-(--studio-segmented-control-radius) text-fg-muted",
      item: [
        "relative isolate inline-flex cursor-default items-center justify-center rounded-[calc(var(--studio-segmented-control-radius)-3px)] border border-transparent whitespace-nowrap focus-reset transition-[color] duration-(--studio-segmented-control-color-duration) ease-(--studio-segmented-control-color-ease) select-ui focus-visible:focus-ring-outside",
        "text-fg-muted hover:text-fg",
        "disabled:cursor-disabled disabled:text-(--disabled-fg,currentColor) aria-disabled:cursor-disabled aria-disabled:text-(--disabled-fg,currentColor)",
        "**:[svg]:pointer-events-none **:[svg]:shrink-0",
      ],
      // The sliding pill, concentric with the track's 3px inset.
      // SelectionIndicator positions/sizes it over the selected item; `inset-0`
      // + `isolate` on the item sit it behind the content (which is `z-10`).
      indicator:
        "pointer-events-none absolute inset-0 rounded-[calc(var(--studio-segmented-control-radius)-3px)] transition-[translate,width,height] duration-(--studio-segmented-control-state-duration) ease-(--studio-segmented-control-state-ease) motion-reduce:transition-none",
      itemContent: "relative z-10 inline-flex items-center gap-[inherit]",
    },
  },
  density: {
    compact: {
      slots: {
        item: "gap-1.5 px-2 py-1 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 **:[svg]:not-with-[size]:size-3.5",
      },
    },
    default: {
      slots: {
        item: "gap-1.5 px-2.5 py-1 text-sm has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 **:[svg]:not-with-[size]:size-4",
      },
    },
    comfortable: {
      slots: {
        item: "gap-2 px-3 py-1.5 text-sm has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 **:[svg]:not-with-[size]:size-4",
      },
    },
    spacious: {
      slots: {
        item: "gap-2 px-3.5 py-2 text-sm has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3 **:[svg]:not-with-[size]:size-4",
      },
    },
    touch: {
      slots: {
        item: "gap-2 px-4 py-2.5 text-base has-data-[icon=inline-end]:pr-3.5 has-data-[icon=inline-start]:pl-3.5 **:[svg]:not-with-[size]:size-5",
      },
    },
  },
  params: {
    selected: {
      tone: { slots: CHIP_TONE },
      raised: { slots: CHIP_RAISED },
      ring: { slots: CHIP_RING },
      inverse: { slots: CHIP_INVERSE },
    },
    track: {
      filled: { slots: { root: TRACK_FILLED } },
      outline: { slots: { root: TRACK_OUTLINE } },
    },
    weight: {
      regular: { slots: WEIGHT_REGULAR },
      "regular-medium": { slots: WEIGHT_REGULAR_MEDIUM },
      "regular-semibold": { slots: WEIGHT_REGULAR_SEMIBOLD },
      medium: { slots: WEIGHT_MEDIUM },
      "medium-semibold": { slots: WEIGHT_MEDIUM_SEMIBOLD },
      semibold: { slots: WEIGHT_SEMIBOLD },
      bold: { slots: WEIGHT_BOLD },
    },
    case: {
      uppercase: { slots: { item: UPPERCASE } },
    },
  },
})

export type SegmentedControlStyles = typeof styles

export { useStyles }
