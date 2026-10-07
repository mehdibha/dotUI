import { createStyles } from "@/lib/styles"
import { fieldStyles } from "@/registry/ui/field"

import sliderMeta from "./meta"

const { useStyles, styles } = createStyles(sliderMeta, {
  base: {
    slots: {
      root: fieldStyles().field(),
      control:
        "relative flex grow cursor-drag touch-none items-center select-none disabled:cursor-disabled",
      track:
        "pointer-events-none relative grow overflow-hidden rounded-(--studio-slider-track-radius) bg-neutral disabled:bg-(--disabled-bg,var(--color-neutral)) dark:not-disabled:bg-neutral-active",
      fill: "pointer-events-none bg-selection disabled:bg-(--disabled-selected-bg,var(--color-selection))",
      thumb:
        "top-1/2 left-1/2 grid cursor-drag place-items-center focus-reset duration-(--studio-slider-state-duration) ease-(--studio-slider-state-ease) disabled:cursor-disabled dragging:cursor-dragging",
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
    spacious: {
      slots: {
        output: "text-sm",
      },
    },
    touch: {
      slots: {
        output: "text-sm",
      },
    },
  },
  params: {
    thumb: {
      knob: {
        slots: {
          thumb:
            "size-(--slider-thumb-size) rounded-(--studio-slider-thumb-radius) border-(length:--studio-control-stroke) border-fg-muted bg-thumb ring-fg-muted/50 transition-shadow hover:ring-3 focus-visible:focus-ring-outside disabled:border-(--disabled-border,var(--color-border-control)) dragging:ring-3",
        },
      },
      ring: {
        slots: {
          thumb:
            "size-(--slider-thumb-size) rounded-(--studio-slider-thumb-radius) border-2 border-selection bg-thumb shadow-sm ring-border-control/50 transition-shadow hover:ring-4 focus-visible:focus-ring-outside disabled:border-(--disabled-selected-bg,var(--color-selection)) dragging:ring-4",
        },
      },
      solid: {
        slots: {
          thumb:
            "size-(--slider-thumb-size) rounded-(--studio-slider-thumb-radius) bg-selection ring-border-control/30 transition-shadow hover:ring-2 focus-visible:focus-ring-outside disabled:bg-(--disabled-selected-bg,var(--color-selection)) dragging:ring-2",
        },
      },
      // A bar in the fill color, a gap cut from the track, a stop dot; the
      // control reserves the bar's 44px reach (Material 3's container).
      handle: {
        slots: {
          thumb: [
            "bg-(--surface-bg,var(--color-bg)) before:absolute before:rounded-(--studio-slider-thumb-radius) before:bg-selection before:transition-[width,height] before:content-[''] focus-visible:before:focus-ring-outside",
            "disabled:before:bg-(--disabled-selected-bg,var(--color-selection))",
          ],
          track:
            "after:absolute after:size-1 after:rounded-full after:bg-selection after:content-[''] disabled:after:bg-(--disabled-selected-bg,var(--color-selection))",
        },
        variants: {
          orientation: {
            horizontal: {
              control: "min-h-[calc(var(--slider-size)+44px)]",
              thumb:
                "h-(--slider-size) w-4 before:inset-y-[-14px] before:left-1/2 before:w-1 before:-translate-x-1/2 focus-visible:before:w-0.5 dragging:before:w-0.5",
              track:
                "after:end-[calc(var(--slider-size)/2-2px)] after:top-1/2 after:-translate-y-1/2",
            },
            vertical: {
              control: "min-w-[calc(var(--slider-size)+44px)]",
              thumb:
                "h-4 w-(--slider-size) before:inset-x-[-14px] before:top-1/2 before:h-1 before:-translate-y-1/2 focus-visible:before:h-0.5 dragging:before:h-0.5",
              track:
                "after:start-1/2 after:top-[calc(var(--slider-size)/2-2px)] after:-translate-x-1/2",
            },
          },
        },
      },
    },
    track: {
      hairline: {
        slots: {
          control:
            "[--slider-size:--spacing(0.5)] [--slider-thumb-size:--spacing(3)]",
        },
      },
      thin: {
        slots: {
          control:
            "[--slider-size:--spacing(1)] [--slider-thumb-size:--spacing(3)]",
        },
      },
      medium: {
        slots: {
          control:
            "[--slider-size:--spacing(2)] [--slider-thumb-size:--spacing(4)]",
        },
      },
      thick: {
        slots: {
          control:
            "[--slider-size:--spacing(4)] [--slider-thumb-size:--spacing(5)]",
        },
      },
    },
  },
})

export type SliderStyles = typeof styles

export { useStyles }
