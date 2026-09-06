import { createStyles } from "@/lib/styles"

import tagGroupMeta from "./meta"

/* The fill and its disabled recolor live in the `style` param so each value
   ships only its own classes. Soft is a half-strength wash: the neutral fill
   is already the wash tone, so a full `bg-muted` would equal solid.
   Synced with badge — change both together. */

const { useStyles, styles } = createStyles(tagGroupMeta, {
  base: {
    slots: {
      tagGroup: ["group/tag-group flex flex-col gap-2"],
      tagList: [
        "flex flex-wrap items-center outline-hidden",
        "empty:text-fg-muted",
        "gap-1",
      ],
      tag: [
        "group/tag relative inline-flex w-fit shrink-0 cursor-default items-center justify-center gap-1 rounded-(--tag-radius) font-medium whitespace-nowrap outline-hidden transition-colors select-ui data-react-aria-pressable:cursor-interactive",
        // svg
        "**:[svg]:pointer-events-none **:[svg]:shrink-0",
        // focus
        "focus-visible:focus-ring",
        // link variant (when href)
        "data-href:cursor-interactive",
        // disabled
        "data-selection-mode:disabled:cursor-disabled",

        "text-xs/relaxed **:[svg]:not-with-[size]:size-3",
        // remove button
        "has-[button[slot=remove]]:pr-0 **:[button[slot=remove]]:-ml-1 **:[button[slot=remove]]:size-5 **:[button[slot=remove]]:rounded-none **:[button[slot=remove]]:bg-transparent **:[button[slot=remove]]:text-fg-muted **:[button[slot=remove]]:hover:text-fg",
      ],
    },
  },

  density: {
    compact: {
      slots: {
        tag: [
          "group-data-[size=sm]/tag-group:h-4.25 group-data-[size=sm]/tag-group:px-1.25",
          "h-4.75 px-1.5",
          "group-data-[size=lg]/tag-group:h-5.75 group-data-[size=lg]/tag-group:px-2 group-data-[size=lg]/tag-group:text-sm",
        ],
      },
    },
    default: {
      slots: {
        tag: [
          "group-data-[size=sm]/tag-group:h-4.25",
          "h-5.25 px-1.5",
          "group-data-[size=lg]/tag-group:h-6.25 group-data-[size=lg]/tag-group:text-sm",
        ],
      },
    },
    comfortable: {
      slots: {
        tag: [
          "group-data-[size=sm]/tag-group:h-4.75",
          "h-5.5 px-1.5",
          "group-data-[size=lg]/tag-group:h-6.5 group-data-[size=lg]/tag-group:px-2 group-data-[size=lg]/tag-group:text-sm",
        ],
      },
    },
  },
  params: {
    style: {
      solid: {
        slots: {
          tag: "bg-neutral text-fg-on-neutral disabled:bg-(--disabled-bg,var(--color-neutral)) disabled:text-(--disabled-fg,var(--color-fg-on-neutral)) selected:bg-accent-muted selected:text-fg-accent",
        },
      },
      soft: {
        slots: {
          tag: "bg-muted/50 text-fg disabled:bg-(--disabled-bg,var(--color-muted)) disabled:text-(--disabled-fg,var(--color-fg)) selected:bg-accent-muted selected:text-fg-accent",
        },
      },
      outline: {
        slots: {
          tag: "border border-border text-fg disabled:border-(--disabled-border,var(--color-border)) disabled:text-(--disabled-fg,var(--color-fg)) selected:border-border-accent selected:text-fg-accent",
        },
      },
      "soft-outline": {
        slots: {
          tag: "border border-border bg-muted/50 text-fg disabled:border-(--disabled-border,var(--color-border)) disabled:bg-(--disabled-bg,var(--color-muted)) disabled:text-(--disabled-fg,var(--color-fg)) selected:border-border-accent selected:bg-accent-muted selected:text-fg-accent",
        },
      },
    },
  },
})

export type TagGroupStyles = typeof styles

export { useStyles }
