import { createStyles } from "@/lib/styles"

import buttonMeta from "./meta"

/* Interaction lives in the `hover` / `press` params, family looks in `style`:
   the base variants are fills only, so each param value ships exactly its
   own classes. Synced with toggle-button — change both together. */

const { useStyles, styles } = createStyles(buttonMeta, {
  base: {
    base: [
      "group/button relative inline-flex shrink-0 cursor-interactive items-center justify-center rounded-(--btn-radius) bg-clip-padding font-(--btn-font-weight) whitespace-nowrap shadow-[var(--shadow-control,0_0_#0000)] transition-[background-color,border-color,color,box-shadow,filter,scale,translate] select-none",
      "focus-reset focus-visible:focus-ring",
      "**:[svg]:pointer-events-none **:[svg]:shrink-0",
      "pending:cursor-pending pending:bg-disabled pending:text-transparent pending:**:not-data-[slot=spinner]:not-in-data-[slot=spinner]:opacity-0 pending:**:data-[slot=spinner]:text-fg-muted",
      "disabled:cursor-disabled disabled:bg-disabled disabled:text-fg-disabled",
    ],
    variants: {
      variant: {
        primary:
          "bg-primary text-fg-on-primary [--color-disabled:var(--neutral-300)]",
        secondary:
          "border border-border-control bg-neutral text-fg-on-neutral disabled:border-border pending:border-border",
        quiet: "bg-transparent text-fg",
        link: "text-fg underline-offset-4 hover:underline",
        warning: "bg-warning text-fg-on-warning",
        danger: "bg-danger text-fg-on-danger",
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
    /* Each family reshapes every fill variant at once; quiet and link stay
       flat, as in every system with an aesthetic axis (Radix classic,
       Untitled UI, Primer, Geist). */
    style: {
      flat: {},
      outline: {
        variants: {
          variant: {
            primary:
              "shadow-[inset_0_0_0_1px_rgb(0_0_0/0.25),0_1px_0_rgb(0_0_0/0.1)]",
            secondary: "shadow-[0_1px_0_rgb(0_0_0/0.08)]",
            warning:
              "shadow-[inset_0_0_0_1px_rgb(0_0_0/0.25),0_1px_0_rgb(0_0_0/0.1)]",
            danger:
              "shadow-[inset_0_0_0_1px_rgb(0_0_0/0.25),0_1px_0_rgb(0_0_0/0.1)]",
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
            warning:
              "bg-linear-to-b from-white/15 to-black/15 shadow-[inset_0_1px_0_rgb(255_255_255/0.25),inset_0_-2px_1px_rgb(0_0_0/0.2),0_1px_2px_rgb(0_0_0/0.15)]",
            danger:
              "bg-linear-to-b from-white/15 to-black/15 shadow-[inset_0_1px_0_rgb(255_255_255/0.25),inset_0_-2px_1px_rgb(0_0_0/0.2),0_1px_2px_rgb(0_0_0/0.15)]",
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
            warning:
              "shadow-[0_2px_6px_rgb(0_0_0/0.3),0_1px_2px_rgb(0_0_0/0.2)]",
            danger:
              "shadow-[0_2px_6px_rgb(0_0_0/0.3),0_1px_2px_rgb(0_0_0/0.2)]",
          },
        },
      },
    },
    /* Quiet gains a background on hover in every surveyed system, whatever
       the fill variants do. */
    hover: {
      dim: {
        variants: {
          variant: {
            primary: "hover:bg-primary-hover",
            secondary: "hover:bg-neutral-hover",
            quiet: "hover:bg-inverse/10",
            warning: "hover:bg-warning-hover",
            danger: "hover:bg-danger-hover",
          },
        },
      },
      lighten: {
        variants: {
          variant: {
            primary: "hover:brightness-110",
            secondary: "hover:brightness-105",
            quiet: "hover:bg-inverse/10",
            warning: "hover:brightness-110",
            danger: "hover:brightness-110",
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
    /* Press is uniform across variants (the Linear precedent). */
    press: {
      dim: {
        variants: {
          variant: {
            primary: "pressed:bg-primary-active",
            secondary: "pressed:bg-neutral-active",
            quiet: "pressed:bg-inverse/20",
            warning: "pressed:bg-warning-active",
            danger: "pressed:bg-danger-active",
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

export type ButtonStyles = typeof styles

export { styles as buttonStyles, useStyles }
