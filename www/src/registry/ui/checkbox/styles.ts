import { createStyles } from "@/lib/styles"

import checkboxMeta from "./meta"

/* The choice card's shell (its edge is Surfaces' tile stroke) and its
   selected look — one source for checkbox, radio-group and switch cards.
   Every selected value paints with the selection tokens. */
export const CHOICE_CARD_SHELL =
  "has-data-label:w-full has-data-label:border-(length:--studio-tile-stroke) has-data-label:p-2.5"

export const CHOICE_CARD = {
  tint: {
    slots: {
      control:
        "has-data-label:selected:border-selection/25 has-data-label:selected:bg-selection-muted",
    },
  },
  "outline-tint": {
    slots: {
      control:
        "has-data-label:selected:border-selection has-data-label:selected:bg-selection-muted",
    },
  },
  outline: {
    slots: {
      control:
        "has-data-label:selected:border-selection has-data-label:selected:inset-ring-1 has-data-label:selected:inset-ring-selection",
    },
  },
}

/* Duolingo's ledge: a pressed or disabled card sinks into its lip. */
export const CHOICE_CARD_PRESS = {
  none: {},
  sink: {
    slots: {
      control:
        "has-data-label:pressed:mt-(--studio-tile-lip) has-data-label:pressed:border-b-(length:--studio-control-stroke) has-data-label:disabled:mt-(--studio-tile-lip) has-data-label:disabled:border-b-(length:--studio-control-stroke)",
    },
  },
}

const { useStyles, styles } = createStyles(checkboxMeta, {
  base: {
    slots: {
      root: "flex items-center has-data-description:items-start",
      control: [
        "relative flex items-center gap-2 focus-reset not-has-data-label:rounded-(--studio-checkbox-radius) not-has-data-label:after:absolute not-has-data-label:after:-inset-x-3 not-has-data-label:after:-inset-y-2 read-only:cursor-default focus-visible:not-has-data-label:focus-ring-outside disabled:cursor-disabled has-data-description:items-start has-data-label:rounded-(--studio-checkbox-card-radius) focus-visible:has-data-label:focus-ring",
        "transition-colors duration-(--studio-checkbox-state-duration) ease-(--studio-checkbox-state-ease)",
        CHOICE_CARD_SHELL,
      ],
      indicator: [
        "grid size-4 shrink-0 place-content-center rounded-(--studio-checkbox-radius) border-(length:--studio-control-stroke) border-(--studio-check-edge) bg-transparent text-transparent transition-[background-color,border-color,box-shadow,color] duration-(--studio-checkbox-state-duration) ease-(--studio-checkbox-state-ease) *:[svg]:size-3",
        "selected:border-transparent selected:bg-selection selected:text-fg-on-selection",
        "disabled:border-(--disabled-border,var(--color-border-control)) disabled:indeterminate:bg-(--disabled-selected-bg,var(--color-selection)) disabled:selected:bg-(--disabled-selected-bg,var(--color-selection)) disabled:selected:text-(--disabled-selected-fg,var(--color-fg-on-selection))",
        "invalid:border-fg-danger invalid:invalid-ring invalid:selected:bg-danger-muted invalid:selected:text-fg-danger",
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
        root: "gap-2 has-data-description:**:data-checkbox-indicator:mt-0.5",
      },
    },
    comfortable: {
      slots: {
        root: "gap-3 has-data-description:**:data-checkbox-indicator:mt-0.5",
      },
    },
    spacious: {
      slots: {
        root: "gap-3 has-data-description:**:data-checkbox-indicator:mt-0.5",
      },
    },
    touch: {
      slots: {
        root: "gap-3 has-data-description:**:data-checkbox-indicator:mt-0.5",
      },
    },
  },
  params: {
    "card-selected": CHOICE_CARD,
    "card-press": CHOICE_CARD_PRESS,
  },
})

export type CheckboxStyles = typeof styles

export { useStyles }
