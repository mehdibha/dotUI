import { createStyles } from "@/lib/styles"

import {
  CHIP_DOT,
  CHIP_NEUTRAL,
  CHIP_OUTLINE,
  CHIP_SOFT,
  CHIP_SOFT_OUTLINE,
  CHIP_SOLID,
  CHIPS,
} from "../badge/styles"
import tagGroupMeta from "./meta"

/* Badge's chips recipe, imported: a tag is a neutral chip that can also be
   selected, disabled and removed. */

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
        "group/tag relative inline-flex w-fit shrink-0 cursor-default items-center justify-center gap-1 rounded-(--studio-tag-radius) font-medium whitespace-nowrap outline-hidden transition-colors duration-(--studio-tag-state-duration) ease-(--studio-tag-state-ease) select-ui data-react-aria-pressable:cursor-interactive",
        // svg
        "**:[svg]:pointer-events-none **:[svg]:shrink-0",
        // focus
        "focus-visible:focus-ring",
        // link variant (when href)
        "data-href:cursor-interactive",
        // disabled
        "data-selection-mode:disabled:cursor-disabled",
        // palette, selected and disabled
        CHIP_NEUTRAL,
        "selected:bg-selected selected:text-fg-on-selected",
        "disabled:[--chip-border:var(--disabled-border,var(--color-border))] disabled:[--chip-fg-tint:var(--disabled-fg,var(--color-fg))] disabled:[--chip-fg:var(--disabled-fg,var(--color-fg-on-neutral))] disabled:[--chip-fill:var(--disabled-bg,var(--color-neutral))] disabled:[--chip-tint:var(--disabled-bg,var(--color-muted))]",

        "text-xs/relaxed **:[svg]:not-with-[size]:size-3",
        // remove button
        "has-[button[slot=remove]]:pr-0 **:[button[slot=remove]]:-ml-1 **:[button[slot=remove]]:size-5 **:[button[slot=remove]]:rounded-none **:[button[slot=remove]]:bg-transparent **:[button[slot=remove]]:text-fg-muted **:[button[slot=remove]]:hover:text-fg",
      ],
    },
    variants: {
      appearance: {
        solid: { tag: CHIP_SOLID },
        soft: { tag: CHIP_SOFT },
        outline: { tag: CHIP_OUTLINE },
        "soft-outline": { tag: CHIP_SOFT_OUTLINE },
        dot: { tag: CHIP_DOT },
      },
    },
    defaultVariants: {
      appearance: "solid",
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
    spacious: {
      slots: {
        tag: [
          "group-data-[size=sm]/tag-group:h-4.75",
          "h-5.5 px-1.5",
          "group-data-[size=lg]/tag-group:h-6.5 group-data-[size=lg]/tag-group:px-2 group-data-[size=lg]/tag-group:text-sm",
        ],
      },
    },
    touch: {
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
    style: CHIPS,
  },
})

export type TagGroupStyles = typeof styles

export { useStyles }
