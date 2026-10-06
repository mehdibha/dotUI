import { createStyles } from "@/lib/styles"

import { CHOICE_CARD } from "../checkbox/styles"
import radioGroupMeta from "./meta"

const { useStyles, styles } = createStyles(radioGroupMeta, {
  base: {
    slots: {
      group: ["flex flex-col gap-3"],
      root: ["flex items-center has-data-description:items-start"],
      control: [
        "relative flex items-center gap-2 focus-reset not-has-data-label:rounded-(--studio-radio-radius) not-has-data-label:after:absolute not-has-data-label:after:-inset-x-3 not-has-data-label:after:-inset-y-2 read-only:cursor-default focus-visible:focus-ring disabled:cursor-disabled has-data-description:items-start has-data-label:rounded-(--studio-radio-card-radius)",
        "transition-colors duration-(--studio-checkbox-state-duration) ease-(--studio-checkbox-state-ease) has-data-label:w-full has-data-label:border has-data-label:p-2.5",
      ],
      indicator: [
        "grid size-4 shrink-0 place-content-center rounded-full border-(length:--studio-control-stroke) border-border-control bg-transparent text-transparent before:rounded-full before:bg-current before:content-['']",
        "transition-[background-color,border-color,box-shadow,color] duration-(--studio-checkbox-state-duration) ease-(--studio-checkbox-state-ease)",
        "disabled:border-(--disabled-border,var(--color-border-control))",
        "invalid:border-border-danger",
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
        root: "gap-2 has-data-description:**:data-radio-indicator:mt-0.5",
      },
    },
    comfortable: {
      slots: {
        root: "gap-3 has-data-description:**:data-radio-indicator:mt-0.5",
      },
    },
  },
  params: {
    mark: {
      dot: {
        slots: {
          indicator: [
            "before:size-1.5 selected:border-transparent selected:bg-selection selected:text-fg-on-selection",
            "disabled:selected:bg-(--disabled-selected-bg,var(--color-selection)) disabled:selected:text-(--disabled-selected-fg,var(--color-fg-on-selection))",
            "invalid:selected:bg-danger-muted invalid:selected:text-fg-danger",
          ],
        },
      },
      ring: {
        slots: {
          indicator: [
            "before:size-2 selected:border-selection selected:text-selection",
            "disabled:selected:border-(--disabled-selected-bg,var(--color-selection)) disabled:selected:text-(--disabled-selected-bg,var(--color-selection))",
            "invalid:selected:border-border-danger invalid:selected:text-fg-danger",
          ],
        },
      },
    },
    "card-selected": CHOICE_CARD,
  },
})

export type RadioGroupStyles = typeof styles

export { useStyles }
