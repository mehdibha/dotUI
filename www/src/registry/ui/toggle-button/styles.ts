import { createStyles } from "@/lib/styles"

import toggleButtonMeta from "./meta"

/* Synced with button: same base shape, same `style` recipes — change both
   together. `selected` is the toggle's own look, with its own hover/press
   feedback. */

const { useStyles, styles } = createStyles(toggleButtonMeta, {
  base: {
    base: [
      "group/toggle-button relative inline-flex shrink-0 cursor-interactive items-center justify-center rounded-(--studio-btn-radius) bg-clip-padding font-(--studio-font-weight-label) whitespace-nowrap transition-[background-color,border-color,color,box-shadow,filter,scale,translate] duration-(--studio-button-state-duration) ease-(--studio-button-state-ease) select-ui",
      "focus-reset focus-visible:focus-ring",
      "**:[svg]:pointer-events-none **:[svg]:shrink-0",
      "disabled:cursor-disabled disabled:selected:bg-(--disabled-selected-bg,var(--color-selected)) disabled:selected:text-(--disabled-selected-fg,var(--color-fg-on-selected))",
    ],
    variants: {
      variant: {
        primary:
          "text-fg-on-primary disabled:bg-(--color-primary-disabled,var(--color-primary)) disabled:text-(--disabled-fg,var(--color-fg-on-primary)) disabled:selected:bg-(--color-primary-disabled,var(--color-selected))",
        secondary:
          "text-fg-on-neutral disabled:border-(--disabled-border,var(--color-border-control)) disabled:bg-(--disabled-bg,var(--color-neutral)) disabled:text-(--disabled-fg,var(--color-fg-on-neutral))",
        quiet:
          "bg-transparent text-fg hover:bg-inverse/10 disabled:bg-(--disabled-bg,transparent) disabled:text-(--disabled-fg,var(--color-fg)) pressed:bg-inverse/20",
      },
      size: {
        xs: "rounded-(--studio-btn-xs-radius)",
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
          xs: "h-5 px-2 text-[0.625rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 data-icon-only:size-5 **:[svg]:not-with-[size]:size-2.5",
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
    style: {
      // dotUI's own: solid fills, a bordered neutral.
      flat: {
        variants: {
          variant: {
            primary:
              "bg-primary hover:bg-primary-hover pressed:bg-primary-active",
            secondary:
              "border border-border-control bg-neutral hover:bg-neutral-hover pressed:bg-neutral-active",
          },
        },
      },
      // GitHub Primer: a translucent rim on every fill, a 1px resting drop,
      // an inset top line on press. The rim lightens in dark.
      hairline: {
        variants: {
          variant: {
            primary:
              "border border-black/15 bg-primary shadow-[0_1px_1px_0_rgb(31_35_40/0.04),0_1px_2px_0_rgb(31_35_40/0.03)] hover:bg-primary-hover disabled:border-transparent disabled:shadow-none dark:border-white/15 dark:shadow-[0_1px_1px_0_rgb(1_4_9/0.6),0_1px_3px_0_rgb(1_4_9/0.6)] pressed:bg-primary-active pressed:shadow-[inset_0_1px_0_0_rgb(0_0_0/0.3)] dark:pressed:shadow-none",
            secondary:
              "border border-border-control bg-neutral shadow-[0_1px_0_0_rgb(31_35_40/0.04)] hover:bg-neutral-hover disabled:shadow-none dark:shadow-none pressed:bg-neutral-active",
          },
        },
      },
      // Untitled UI: an inner dark ring, a white top rim fading downward, an
      // xs drop. No press.
      "rim-light": {
        variants: {
          variant: {
            primary:
              "bg-primary shadow-[inset_0_0_0_1px_rgb(0_0_0/0.18),inset_0_-2px_0_0_rgb(0_0_0/0.05),0_1px_2px_0_rgb(0_0_0/0.05)] after:pointer-events-none after:absolute after:inset-px after:rounded-[inherit] after:border after:border-white/12 after:mask-b-from-0% hover:bg-primary-hover disabled:shadow-none disabled:after:hidden",
            secondary:
              "border border-border-control bg-bg shadow-[inset_0_-2px_0_0_rgb(0_0_0/0.05),0_1px_2px_0_rgb(0_0_0/0.05)] hover:bg-neutral disabled:shadow-none",
          },
        },
      },
      // Clerk: a same-color ring, two tight drops, a top sheen that fades on
      // hover (the fill lightens) and returns on press.
      gloss: {
        variants: {
          variant: {
            primary:
              "isolate bg-primary shadow-[0_0_0_1px_var(--color-primary),inset_0_1px_1px_0_rgb(255_255_255/0.07),0_2px_3px_0_rgb(34_42_53/0.2),0_1px_1px_0_rgb(0_0_0/0.24)] after:pointer-events-none after:absolute after:inset-0 after:-z-1 after:rounded-[inherit] after:bg-linear-to-b after:from-white/11 after:to-transparent after:transition-opacity hover:bg-[color-mix(in_srgb,var(--color-primary),white_20%)] hover:after:opacity-0 disabled:shadow-none pressed:after:opacity-100",
            secondary:
              "border border-[color-mix(in_oklab,var(--color-fg)_11%,transparent)] bg-bg shadow-[0_2px_3px_-1px_rgb(0_0_0/0.08),0_1px_0_0_rgb(0_0_0/0.02)] hover:bg-[color-mix(in_oklab,var(--color-fg)_3%,var(--color-bg))] disabled:shadow-none",
          },
        },
      },
      // Shopify Polaris: a deep inset rim and a bottom sheen; press inverts
      // the bevel and drops the label 1px.
      bevel: {
        variants: {
          variant: {
            primary:
              "bg-primary bg-linear-to-b from-transparent from-63% to-white/15 shadow-[inset_0_-1px_0_1px_rgb(0_0_0/0.8),inset_0_0_0_1px_var(--color-primary),inset_0_0.5px_0_1.5px_rgb(255_255_255/0.25)] hover:bg-primary-hover disabled:bg-none disabled:shadow-none pressed:bg-primary-hover pressed:pt-0.5 pressed:shadow-[inset_-1px_0_1px_0_rgb(0_0_0/0.2),inset_1px_0_1px_0_rgb(0_0_0/0.2),inset_0_2px_0_0_rgb(0_0_0/0.6)]",
            secondary:
              "border border-black/10 bg-bg shadow-[inset_0_-1px_0_0_rgb(0_0_0/0.2),inset_0_0.5px_0_1px_rgb(255_255_255)] hover:bg-card disabled:shadow-none dark:border-white/8 dark:bg-neutral dark:shadow-[inset_0_-1px_0_0_rgb(0_0_0/0.6),inset_0_0.5px_0_1px_rgb(255_255_255/0.06)] dark:hover:bg-neutral-hover pressed:bg-neutral pressed:pt-0.5 pressed:shadow-[inset_-1px_0_1px_0_rgb(26_26_26/0.12),inset_1px_0_1px_0_rgb(26_26_26/0.12),inset_0_2px_1px_0_rgb(26_26_26/0.2)]",
          },
        },
      },
      // Duolingo: a slab under the button in a darker shade of its fill;
      // press sinks the face by the whole slab.
      ledge: {
        variants: {
          variant: {
            primary:
              "bg-primary shadow-[0_3px_0_0_color-mix(in_srgb,var(--color-primary),black_13%)] hover:brightness-110 disabled:shadow-none disabled:brightness-100 pressed:translate-y-[3px] pressed:shadow-none",
            secondary:
              "border border-border-control bg-bg shadow-[0_2px_0_0_var(--color-border-control)] hover:brightness-90 disabled:shadow-none disabled:brightness-100 pressed:translate-y-0.5 pressed:shadow-none",
          },
        },
      },
    },
    selected: {
      fill: {
        base: "selected:bg-selected selected:text-fg-on-selected selected:hover:bg-selected-hover selected:pressed:bg-selected-active",
      },
      // Chip: a page-colored chip lifted on shadow; borderless variants gain a
      // hairline ring so it survives dark wells (secondary keeps its border).
      chip: {
        base: "selected:bg-(--surface-bg,var(--color-bg)) selected:text-fg selected:shadow-sm selected:hover:bg-muted selected:pressed:bg-highlight",
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
              "selected:bg-(--surface-bg,var(--color-bg)) selected:text-fg selected:shadow-none selected:inset-ring selected:inset-ring-inverse selected:hover:bg-muted selected:pressed:bg-highlight",
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
