import { createStyles } from "@/lib/styles"

import {
  CHOICE_CARD,
  CHOICE_CARD_PRESS,
  CHOICE_CARD_SHELL,
} from "../checkbox/styles"
import switchMeta from "./meta"

const { useStyles, styles } = createStyles(switchMeta, {
  base: {
    slots: {
      root: "flex items-center has-data-description:items-start",
      control: [
        "relative flex items-center gap-2 focus-reset not-has-data-label:after:absolute not-has-data-label:after:-inset-x-3 not-has-data-label:after:-inset-y-2 read-only:cursor-default focus-visible:not-has-data-label:focus-ring-outside disabled:cursor-disabled has-data-description:items-start has-data-label:rounded-(--studio-switch-card-radius) focus-visible:has-data-label:focus-ring",
        "transition-colors duration-(--studio-switch-color-duration) ease-(--studio-switch-color-ease) has-data-label:justify-between",
        CHOICE_CARD_SHELL,
      ],
      indicator: [
        "inline-flex shrink-0 cursor-pointer items-center transition-[background-color,border-color,box-shadow] duration-(--studio-switch-color-duration) ease-(--studio-switch-color-ease)",
        "invalid:border-fg-danger invalid:invalid-ring read-only:cursor-default disabled:cursor-disabled",
      ],
      thumb:
        "pointer-events-none block duration-(--studio-switch-state-duration) ease-(--studio-switch-state-ease)",
    },
    variants: {
      size: {
        sm: {
          root: "has-data-description:**:data-label:mt-[calc((1.25rem-1lh)/2)]",
          indicator: "h-5 w-9",
        },
        md: {
          root: "has-data-description:**:data-label:mt-[calc((1.5rem-1lh)/2)]",
          indicator: "h-6 w-11",
        },
        lg: {
          root: "has-data-description:**:data-label:mt-[calc((1.75rem-1lh)/2)]",
          indicator: "h-7 w-13",
        },
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
  density: {
    compact: {
      slots: {
        root: "gap-2",
      },
    },
    default: {
      slots: {
        root: "gap-2",
      },
    },
    comfortable: {
      slots: {
        root: "gap-3",
      },
    },
    spacious: {
      slots: {
        root: "gap-3",
      },
    },
    touch: {
      slots: {
        root: "gap-3",
      },
    },
  },
  params: {
    style: {
      inset: {
        slots: {
          control: "not-has-data-label:rounded-(--studio-switch-radius)",
          indicator: [
            "rounded-(--studio-switch-radius) border border-transparent bg-neutral p-0.5 selected:bg-selection",
            "disabled:border-(--disabled-border,transparent) disabled:bg-(--disabled-unselected-bg,var(--color-neutral)) disabled:selected:border-transparent disabled:selected:bg-(--disabled-selected-bg,var(--color-selection))",
          ],
          thumb: [
            "rounded-(--studio-switch-radius) bg-thumb shadow-sm transition-[background-color,margin,width] dark:not-disabled:selected:bg-fg-on-selection",
            "disabled:bg-(--disabled-fg,var(--color-thumb)) disabled:selected:bg-(--disabled-selected-fg,var(--color-thumb))",
          ],
        },
        variants: {
          size: {
            sm: {
              thumb: "size-4 pressed:w-5 selected:ml-4 selected:pressed:ml-3",
            },
            md: {
              thumb: "size-5 pressed:w-6 selected:ml-5 selected:pressed:ml-4",
            },
            lg: {
              thumb: "size-6 pressed:w-7 selected:ml-6 selected:pressed:ml-5",
            },
          },
        },
      },
      outlined: {
        slots: {
          control: "not-has-data-label:rounded-(--studio-switch-radius)",
          indicator: [
            "rounded-(--studio-switch-radius) border-(length:--studio-control-stroke) border-border-control bg-transparent p-0.5 selected:border-transparent selected:bg-selection",
            "disabled:border-(--disabled-border,var(--color-border-control)) disabled:selected:border-transparent disabled:selected:bg-(--disabled-selected-bg,var(--color-selection))",
          ],
          thumb: [
            "scale-60 rounded-(--studio-switch-radius) bg-border-control transition-[background-color,margin,scale] pressed:scale-105 selected:scale-90 selected:bg-fg-on-selection selected:pressed:scale-105",
            "disabled:bg-(--disabled-fg,var(--color-border-control)) disabled:selected:bg-(--disabled-selected-fg,var(--color-fg-on-selection))",
          ],
        },
        variants: {
          size: {
            sm: { thumb: "size-4 selected:ml-4" },
            md: { thumb: "size-5 selected:ml-5" },
            lg: { thumb: "size-6 selected:ml-6" },
          },
        },
      },
      slab: {
        slots: {
          control: "not-has-data-label:rounded-(--studio-radius-control)",
          indicator: [
            "rounded-(--studio-radius-control) border-(length:--studio-control-stroke) border-border-control bg-neutral selected:border-selection selected:bg-selection",
            "disabled:border-(--disabled-border,var(--color-border-control)) disabled:bg-(--disabled-unselected-bg,var(--color-neutral)) disabled:selected:border-transparent disabled:selected:bg-(--disabled-selected-bg,var(--color-selection))",
          ],
          thumb: [
            "h-full w-1/2 rounded-(--studio-radius-control-sm) border-(length:--studio-control-stroke) border-border-control bg-bg transition-[background-color,border-color,margin] dark:not-disabled:bg-highlight selected:ml-[50%] selected:border-selection",
            "disabled:bg-(--disabled-fg,var(--color-bg)) disabled:selected:border-(--disabled-border,var(--color-border-control))",
          ],
        },
      },
    },
    "card-selected": CHOICE_CARD,
    "card-press": CHOICE_CARD_PRESS,
  },
})

export type SwitchStyles = typeof styles

export { useStyles }
