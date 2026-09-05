import { createStyles } from "@/lib/styles"
import { fieldStyles } from "@/registry/ui/field"

import sliderMeta from "./meta"

const { useStyles, styles } = createStyles(sliderMeta, {
  base: {
    slots: {
      root: fieldStyles().field(),
      control:
        "relative flex grow cursor-(--slider-cursor) touch-none items-center select-none disabled:cursor-disabled",
      track:
        "pointer-events-none relative grow overflow-hidden rounded-(--slider-track-radius) bg-neutral disabled:bg-disabled",
      fill: "pointer-events-none bg-(--slider-fill-color) disabled:bg-selection-disabled",
      thumb: [
        "top-1/2 left-1/2 grid cursor-(--slider-cursor) place-items-center rounded-(--slider-thumb-radius) shadow-(--slider-thumb-shadow) focus-reset transition-shadow focus-visible:focus-ring disabled:cursor-disabled dragging:cursor-(--slider-dragging-cursor)",
      ],
      output: "text-fg-muted tabular-nums disabled:text-fg-disabled",
    },
    variants: {
      orientation: {
        horizontal: {
          control: "-my-2 w-full py-2",
          track: "h-(--slider-size) w-full",
        },
        vertical: {
          root: "items-center",
          control: "-mx-2 h-48 flex-col px-2",
          track: "h-full w-(--slider-size)",
        },
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  },
  density: {
    compact: {
      slots: {
        output: "text-xs",
      },
    },
    default: {
      slots: {
        output: "text-sm",
      },
    },
    comfortable: {
      slots: {
        output: "text-sm",
      },
    },
  },
  params: {
    thumb: {
      circle: {
        slots: {
          thumb: "size-(--slider-thumb-size) bg-fg",
        },
      },
      outline: {
        slots: {
          thumb:
            "size-(--slider-thumb-size) border-2 border-border-control bg-bg",
        },
      },
      bar: {
        slots: {
          thumb: "h-[calc(var(--slider-thumb-size)*2)] w-1 bg-fg",
        },
      },
    },
    track: {
      thin: {},
      // The track grows and the thumb with it: a level bar wants a knob
      // that still reads on top of the fill.
      thick: {
        slots: {
          control:
            "[--slider-size:calc(var(--spacing)*3)] [--slider-thumb-size:calc(var(--spacing)*5)]",
        },
      },
    },
  },
})

export type SliderStyles = typeof styles

export { useStyles }
