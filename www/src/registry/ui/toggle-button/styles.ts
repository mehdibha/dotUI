import { createStyles } from "@/lib/styles"

import toggleButtonMeta from "./meta"

/* Synced with button: same base shape, same `style` / `hover` / `press`
   params — change both together. `selected` is the toggle's own look, with
   its own hover/press feedback. */

const { useStyles, styles } = createStyles(toggleButtonMeta, {
  base: {
    base: [
      "group/toggle-button relative inline-flex shrink-0 cursor-interactive items-center justify-center rounded-(--btn-radius) bg-clip-padding font-(--btn-font-weight) whitespace-nowrap shadow-[var(--shadow-control,0_0_#0000)] transition-[background-color,border-color,color,box-shadow,filter,scale,translate] select-ui",
      "focus-reset focus-visible:focus-ring",
      "**:[svg]:pointer-events-none **:[svg]:shrink-0",
      "disabled:cursor-disabled disabled:selected:bg-(--disabled-selected-bg,var(--color-selected)) disabled:selected:text-(--disabled-selected-fg,var(--color-fg-on-selected))",
    ],
    variants: {
      variant: {
        primary:
          "bg-primary text-fg-on-primary disabled:bg-(--color-primary-disabled,var(--color-primary)) disabled:text-(--disabled-fg,var(--color-fg-on-primary)) disabled:selected:bg-(--color-primary-disabled,var(--color-selected))",
        secondary:
          "border border-border-control bg-neutral text-fg-on-neutral disabled:border-(--disabled-border,var(--color-border-control)) disabled:bg-(--disabled-bg,var(--color-neutral)) disabled:text-(--disabled-fg,var(--color-fg-on-neutral))",
        quiet:
          "bg-transparent text-fg disabled:bg-(--disabled-bg,transparent) disabled:text-(--disabled-fg,var(--color-fg))",
      },
      size: {
        xs: "",
        sm: "",
        md: "",
        lg: "",
      },
      isIconOnly: {
        true: "p-0",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  },
  density: {
    compact: {
      base: "gap-1 text-xs/relaxed",
      variants: {
        size: {
          xs: "h-5 rounded-sm px-2 text-[0.625rem] has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-5 **:[svg]:not-with-[size]:size-2.5",
          sm: "h-6 px-2 has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-6 **:[svg]:not-with-[size]:size-3",
          md: "h-7 px-2 has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-7 **:[svg]:not-with-[size]:size-3.5",
          lg: "h-8 px-2.5 has-data-icon-end:pr-2 has-data-icon-start:pl-2 data-icon-only:size-8 **:[svg]:not-with-[size]:size-4",
        },
      },
    },
    default: {
      base: "text-sm *:[svg]:not-with-[size]:size-4",
      variants: {
        size: {
          xs: "h-6 gap-1 px-2 text-xs has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-6 **:[svg]:not-with-[size]:size-3",
          sm: "h-7 gap-1 px-2.5 text-[0.8125rem] has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-7 **:[svg]:not-with-[size]:size-3.5",
          md: "h-8 gap-1.5 px-2.5 has-data-icon-end:pr-2 has-data-icon-start:pl-2 data-icon-only:size-8 **:[svg]:not-with-[size]:size-3.5",
          lg: "h-9 gap-1.5 px-2.5 has-data-icon-end:pr-2 has-data-icon-start:pl-2 data-icon-only:size-9 **:[svg]:not-with-[size]:size-4",
        },
      },
    },
    comfortable: {
      base: "text-sm *:[svg]:not-with-[size]:size-4",
      variants: {
        size: {
          xs: "h-7 gap-1 px-2.5 text-[0.8125rem] has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-7 **:[svg]:not-with-[size]:size-3.5",
          sm: "h-8 gap-1 px-2.5 has-data-icon-end:pr-1.5 has-data-icon-start:pl-1.5 data-icon-only:size-8",
          md: "h-9 gap-1.5 px-2.5 has-data-icon-end:pr-2 has-data-icon-start:pl-2 data-icon-only:size-9",
          lg: "h-10 gap-1.5 px-3 has-data-icon-end:pr-2 has-data-icon-start:pl-2 data-icon-only:size-10",
        },
      },
    },
  },
  params: {
    style: {
      flat: {},
      outline: {
        variants: {
          variant: {
            primary:
              "shadow-[inset_0_0_0_1px_rgb(0_0_0/0.25),0_1px_0_rgb(0_0_0/0.1)]",
            secondary: "shadow-[0_1px_0_rgb(0_0_0/0.08)]",
          },
        },
      },
      raised: {
        variants: {
          variant: {
            primary:
              "bg-linear-to-b from-white/15 to-black/15 shadow-[inset_0_1px_0_rgb(255_255_255/0.25),inset_0_-2px_1px_rgb(0_0_0/0.2),0_1px_2px_rgb(0_0_0/0.15)]",
            secondary:
              "bg-linear-to-b from-white/8 to-black/8 shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_1px_2px_rgb(0_0_0/0.12)]",
          },
        },
      },
      elevated: {
        variants: {
          variant: {
            primary:
              "shadow-[0_2px_6px_rgb(0_0_0/0.3),0_1px_2px_rgb(0_0_0/0.2)]",
            secondary:
              "border-transparent shadow-[0_2px_6px_rgb(0_0_0/0.25),0_1px_2px_rgb(0_0_0/0.15)]",
          },
        },
      },
    },
    hover: {
      dim: {
        variants: {
          variant: {
            primary: "hover:bg-primary-hover",
            secondary: "hover:bg-neutral-hover",
            quiet: "hover:bg-inverse/10",
          },
        },
      },
      lighten: {
        variants: {
          variant: {
            primary: "hover:brightness-110",
            secondary: "hover:brightness-105",
            quiet: "hover:bg-inverse/10",
          },
        },
      },
      none: {
        variants: {
          variant: {
            quiet: "hover:bg-inverse/10",
          },
        },
      },
    },
    press: {
      dim: {
        variants: {
          variant: {
            primary: "pressed:bg-primary-active",
            secondary: "pressed:bg-neutral-active",
            quiet: "pressed:bg-inverse/20",
          },
        },
      },
      scale: {
        base: "pressed:scale-[0.97]",
      },
      push: {
        base: "pressed:translate-y-px",
      },
      none: {},
    },
    selected: {
      fill: {
        base: "selected:bg-selected selected:text-fg-on-selected selected:hover:bg-selected-hover selected:pressed:bg-selected-active",
      },
      // Chip: a page-colored chip lifted on shadow; borderless variants gain a
      // hairline ring so it survives dark wells (secondary keeps its border).
      chip: {
        base: "selected:bg-bg selected:text-fg selected:shadow-sm selected:hover:bg-muted selected:pressed:bg-highlight",
        variants: {
          variant: {
            primary: "selected:ring-1 selected:ring-border-control",
            quiet: "selected:ring-1 selected:ring-border-control",
          },
        },
      },
      // Inverse: snaps to full contrast. Primary already wears the inverse
      // color, so it flips the other way: a page chip inside an inverse
      // hairline (shadow-none keeps the ring composite valid on flat styles).
      inverse: {
        variants: {
          variant: {
            primary:
              "selected:bg-bg selected:text-fg selected:shadow-none selected:inset-ring selected:inset-ring-inverse selected:hover:bg-muted selected:pressed:bg-highlight",
            secondary:
              "selected:border-inverse selected:bg-inverse selected:text-fg-inverse selected:hover:bg-inverse/90 selected:pressed:bg-inverse/80",
            quiet:
              "selected:bg-inverse selected:text-fg-inverse selected:hover:bg-inverse/90 selected:pressed:bg-inverse/80",
          },
        },
      },
    },
  },
})

export type ToggleButtonStyles = typeof styles

export { styles as toggleButtonStyles, useStyles }
