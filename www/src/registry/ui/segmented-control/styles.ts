import { createStyles } from "@/lib/styles"

import segmentedControlMeta from "./meta"

const { useStyles, styles } = createStyles(segmentedControlMeta, {
  base: {
    slots: {
      root: "inline-flex w-fit items-center justify-center rounded-(--studio-segmented-control-radius) text-fg-muted",
      item: [
        "relative isolate inline-flex cursor-default items-center justify-center rounded-(--studio-segmented-control-item-radius) border border-transparent font-medium whitespace-nowrap focus-reset transition-[color] duration-(--studio-segmented-control-color-duration) ease-(--studio-segmented-control-color-ease) select-ui focus-visible:focus-ring",
        "text-fg-muted hover:text-fg",
        "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
        "**:[svg]:pointer-events-none **:[svg]:shrink-0",
      ],
      // The sliding pill. SelectionIndicator positions/sizes it over the selected
      // item; the transition makes it glide. `inset-0` + `isolate` on the item sit
      // it behind the content (which is `z-10`).
      indicator:
        "pointer-events-none absolute inset-0 rounded-(--studio-segmented-control-item-radius) transition-[translate,width,height] duration-(--studio-segmented-control-state-duration) ease-(--studio-segmented-control-state-ease) motion-reduce:transition-none",
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
  },
  params: {
    // How the chip reads against the track: tone fills one neutral step
    // down (Geist, Linear), raised lifts a page-colored chip on shadow
    // (shadcn, iOS), ring draws the page chip on an edge alone (Radix
    // surface, Primer, Stripe), inverse snaps to full contrast (Carbon).
    selected: {
      tone: {
        slots: {
          item: "selected:text-fg-on-selected",
          indicator: "bg-selected shadow-sm",
        },
      },
      raised: {
        slots: {
          item: "selected:text-fg",
          indicator:
            "bg-(--surface-bg,var(--color-bg)) shadow-sm ring-(length:--studio-control-stroke) ring-border-control",
        },
      },
      ring: {
        slots: {
          item: "selected:text-fg",
          indicator:
            "bg-(--surface-bg,var(--color-bg)) ring-(length:--studio-control-stroke) ring-border-control",
        },
      },
      inverse: {
        slots: {
          item: "selected:text-fg-inverse",
          indicator: "bg-inverse",
        },
      },
    },
    // Outline trades a padding pixel for the hairline so the box stays put.
    track: {
      filled: {
        slots: { root: "bg-muted p-[3px]" },
      },
      outline: {
        slots: {
          root: "border-(length:--studio-control-stroke) border-border p-[calc(3px-var(--studio-control-stroke))]",
        },
      },
    },
  },
})

export type SegmentedControlStyles = typeof styles

export { useStyles }
