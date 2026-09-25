import { createStyles } from "@/lib/styles"
import { fieldStyles } from "@/registry/ui/field"

import sliderMeta from "./meta"

const { useStyles, styles } = createStyles(sliderMeta, {
  base: {
    slots: {
      root: fieldStyles().field(),
      control:
        "relative flex grow cursor-(--studio-slider-cursor) touch-none items-center select-none disabled:cursor-disabled",
      track:
        "pointer-events-none relative grow overflow-hidden rounded-(--studio-slider-track-radius) bg-neutral disabled:bg-(--disabled-bg,var(--color-neutral))",
      fill: "pointer-events-none bg-(--studio-slider-fill-color) disabled:bg-(--disabled-selected-bg,var(--studio-slider-fill-color))",
      thumb: [
        "top-1/2 left-1/2 grid cursor-(--studio-slider-cursor) place-items-center rounded-(--studio-slider-thumb-radius) focus-reset transition-shadow duration-(--studio-slider-state-duration) ease-(--studio-slider-state-ease) focus-visible:focus-ring disabled:cursor-disabled dragging:cursor-(--studio-slider-dragging-cursor)",
      ],
      output:
        "text-fg-muted tabular-nums disabled:text-(--disabled-fg,var(--color-fg-muted))",
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
          thumb:
            "size-(--slider-thumb-size) bg-fg shadow-(--studio-slider-thumb-shadow)",
        },
      },
      outline: {
        slots: {
          thumb:
            "size-(--slider-thumb-size) border-2 border-border-control bg-bg shadow-(--studio-slider-thumb-shadow)",
        },
      },
      // M3's handle: the fill color, with the track cut away around it.
      bar: {
        slots: {
          thumb:
            "bg-(--studio-slider-fill-color) shadow-[0_0_0_3px_var(--color-bg)]",
        },
        variants: {
          orientation: {
            horizontal: {
              thumb: "h-[calc(var(--slider-thumb-size)*2)] w-1",
            },
            vertical: {
              thumb: "h-1 w-[calc(var(--slider-thumb-size)*2)]",
            },
          },
        },
      },
    },
    track: {
      thin: {
        slots: {
          control:
            "[--slider-size:--spacing(1)] [--slider-thumb-size:--spacing(3)]",
        },
      },
      thick: {
        slots: {
          control:
            "[--slider-size:--spacing(3)] [--slider-thumb-size:--spacing(5)]",
        },
      },
    },
  },
})

export type SliderStyles = typeof styles

export { useStyles }
