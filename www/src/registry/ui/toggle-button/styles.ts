import { createStyles } from "@/lib/styles"

import toggleButtonMeta from "./meta"

/* Synced with button: same base shape, same `style` / `hover` / `press`
   params — change both together. The selected state keeps its own feedback. */

const { useStyles, styles } = createStyles(toggleButtonMeta, {
  base: {
    base: [
      "group/toggle-button relative inline-flex shrink-0 cursor-interactive items-center justify-center rounded-(--btn-radius) bg-clip-padding font-(--btn-font-weight) whitespace-nowrap shadow-[var(--shadow-control,0_0_#0000)] transition-[background-color,border-color,color,box-shadow,filter,scale,translate] select-none",
      "focus-reset focus-visible:focus-ring",
      "**:[svg]:pointer-events-none **:[svg]:shrink-0",
      "selected:bg-selected selected:text-fg-on-selected selected:hover:bg-selected-hover selected:pressed:bg-selected-active",
      "disabled:cursor-disabled",
    ],
    variants: {
      variant: {
        primary:
          "bg-primary text-fg-on-primary disabled:bg-primary-disabled disabled:text-fg-primary-disabled disabled:selected:bg-disabled disabled:selected:text-fg-disabled",
        secondary:
          "border border-border-control bg-neutral text-fg-on-neutral disabled:border-border disabled:bg-disabled disabled:text-fg-disabled",
        quiet:
          "bg-transparent text-fg disabled:bg-disabled disabled:text-fg-disabled",
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
  },
})

export type ToggleButtonStyles = typeof styles

export { styles as toggleButtonStyles, useStyles }
