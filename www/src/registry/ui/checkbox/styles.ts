import { createStyles } from "@/lib/styles"

import checkboxMeta from "./meta"

const { useStyles, styles } = createStyles(checkboxMeta, {
  base: {
    slots: {
      root: "flex items-center has-data-description:items-start",
      control: [
        "relative flex items-center gap-2 rounded-(--checkbox-radius) focus-reset not-has-data-label:after:absolute not-has-data-label:after:-inset-x-3 not-has-data-label:after:-inset-y-2 read-only:cursor-default focus-visible:focus-ring disabled:cursor-disabled has-data-description:items-start has-data-label:rounded-(--checkbox-card-radius)",
        "transition-colors duration-75 has-data-label:w-full has-data-label:border has-data-label:p-2.5",
      ],
      indicator: [
        "grid size-4 shrink-0 place-content-center rounded-(--checkbox-radius) border border-border-control bg-transparent text-transparent transition-[background-color,border-color,box-shadow,color] duration-75 *:[svg]:size-3",
        "selected:border-transparent selected:bg-selection selected:text-fg-on-selection",
        "disabled:border-(--disabled-border,var(--color-border-control)) disabled:indeterminate:bg-(--disabled-selected-bg,var(--color-selection)) disabled:selected:bg-(--disabled-selected-bg,var(--color-selection)) disabled:selected:text-(--disabled-selected-fg,var(--color-fg-on-selection))",
        "invalid:border-border-danger invalid:selected:bg-danger-muted invalid:selected:text-fg-danger",
        "indeterminate:border-transparent indeterminate:bg-selection indeterminate:text-fg-on-selection",
      ],
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
  },
  /* The card treatment — synced with radio-group and switch, change all three
     together. Tint ships the registry's default card; Outline marks the card
     with the selection tokens so it follows the family fill. Start keeps the
     control where the markup puts it. */
  params: {
    "card-selected": {
      outline: {
        slots: { control: "has-data-label:selected:border-selection" },
      },
      tint: {
        slots: {
          control:
            "has-data-label:selected:border-primary/25 has-data-label:selected:bg-primary-muted",
        },
      },
      "outline-tint": {
        slots: {
          control:
            "has-data-label:selected:border-selection has-data-label:selected:bg-primary-muted",
        },
      },
    },
    "card-control": {
      start: {},
      end: {
        slots: {
          control:
            "has-data-label:justify-between has-data-label:*:data-checkbox-indicator:order-last",
        },
      },
      hidden: {
        slots: {
          control: "has-data-label:*:data-checkbox-indicator:hidden",
        },
      },
    },
  },
})

export type CheckboxStyles = typeof styles

export { useStyles }
