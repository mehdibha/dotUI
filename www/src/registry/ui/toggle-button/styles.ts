import { createStyles } from "@/lib/styles"

import toggleButtonMeta from "./meta"

/* Synced with button: same base shape, same `style` / `hover` / `press`
   params — change both together. `selected` is the toggle's own look, with
   its own hover/press feedback. */

/* Raised: the Radix classic 3D bevel. Glossy: iOS 26 buttons, fit against a
   device capture — a translucent fill, a hairline specular ring lit top and
   bottom, a faint glow pooled at both edges. */
const RAISED =
  "bg-linear-to-b from-white/15 to-black/15 shadow-[inset_0_1px_0_rgb(255_255_255/0.25),inset_0_-2px_1px_rgb(0_0_0/0.2),0_1px_2px_rgb(0_0_0/0.15)]"
const RAISED_SECONDARY =
  "bg-linear-to-b from-white/8 to-black/8 shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_1px_2px_rgb(0_0_0/0.12)]"
const GLOSSY =
  "isolate shadow-sm before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(to_bottom,rgb(255_255_255/0.2),transparent_30%,rgb(255_255_255/0.2))] before:mask-[linear-gradient(#000_0_0),linear-gradient(#000_0_0)] before:mask-exclude before:[mask-clip:content-box,border-box] before:p-[0.75px] after:absolute after:inset-0 after:-z-10 after:rounded-[inherit] after:bg-[radial-gradient(65%_35%_at_50%_0%,rgb(255_255_255/0.05),transparent_70%),radial-gradient(65%_35%_at_50%_100%,rgb(255_255_255/0.05),transparent_70%)]"

const { useStyles, styles } = createStyles(toggleButtonMeta, {
  base: {
    base: [
      "group/toggle-button relative inline-flex shrink-0 cursor-interactive items-center justify-center rounded-(--studio-btn-radius) bg-clip-padding font-(--studio-btn-font-weight) whitespace-nowrap shadow-(--shadow-control,0_0_#0000) transition-[background-color,border-color,color,box-shadow,filter,scale,translate] select-ui",
      "focus-reset focus-visible:focus-ring",
      "**:[svg]:pointer-events-none **:[svg]:shrink-0",
      "disabled:cursor-disabled disabled:selected:bg-(--disabled-selected-bg,var(--color-selected)) disabled:selected:text-(--disabled-selected-fg,var(--color-fg-on-selected))",
    ],
    variants: {
      variant: {
        primary:
          "text-fg-on-primary disabled:bg-(--color-primary-disabled,var(--color-primary)) disabled:text-(--disabled-fg,var(--color-fg-on-primary)) disabled:selected:bg-(--color-primary-disabled,var(--color-selected))",
        secondary:
          "border text-fg-on-neutral disabled:border-(--disabled-border,var(--color-border-control)) disabled:bg-(--disabled-bg,var(--color-neutral)) disabled:text-(--disabled-fg,var(--color-fg-on-neutral))",
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
          xs: "h-5 rounded-sm px-2 text-[0.625rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 data-icon-only:size-5 **:[svg]:not-with-[size]:size-2.5",
          sm: "h-6 px-2 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 data-icon-only:size-6 **:[svg]:not-with-[size]:size-3",
          md: "h-7 px-2 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 data-icon-only:size-7 **:[svg]:not-with-[size]:size-3.5",
          lg: "h-8 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 data-icon-only:size-8 **:[svg]:not-with-[size]:size-4",
        },
      },
    },
    default: {
      base: "text-sm *:[svg]:not-with-[size]:size-4",
      variants: {
        size: {
          xs: "h-6 gap-1 px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 data-icon-only:size-6 **:[svg]:not-with-[size]:size-3",
          sm: "h-7 gap-1 px-2.5 text-[0.8125rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 data-icon-only:size-7 **:[svg]:not-with-[size]:size-3.5",
          md: "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 data-icon-only:size-8 **:[svg]:not-with-[size]:size-3.5",
          lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 data-icon-only:size-9 **:[svg]:not-with-[size]:size-4",
        },
      },
    },
    comfortable: {
      base: "text-sm *:[svg]:not-with-[size]:size-4",
      variants: {
        size: {
          xs: "h-7 gap-1 px-2.5 text-[0.8125rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 data-icon-only:size-7 **:[svg]:not-with-[size]:size-3.5",
          sm: "h-8 gap-1 px-2.5 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 data-icon-only:size-8",
          md: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 data-icon-only:size-9",
          lg: "h-10 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 data-icon-only:size-10",
        },
      },
    },
  },
  params: {
    /* Each family owns the fill it reshapes (quiet and link stay flat, as in
       every system with an aesthetic axis: Radix classic, Untitled UI, Primer,
       Geist), so a variant ships exactly one background. */
    style: {
      flat: {
        variants: {
          variant: {
            primary: "bg-primary",
            secondary: "border-border-control bg-neutral",
          },
        },
      },
      raised: {
        variants: {
          variant: {
            primary: ["bg-primary", RAISED],
            secondary: ["border-border-control bg-neutral", RAISED_SECONDARY],
          },
        },
      },
      glossy: {
        variants: {
          variant: {
            primary: ["bg-primary/90", GLOSSY],
            secondary: ["border-transparent bg-neutral/85", GLOSSY],
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
