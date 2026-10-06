import { createStyles } from "@/lib/styles"

import buttonMeta from "./meta"

/* The recipe tables below are the single source for Button and
   ToggleButton: toggle-button imports them, so a change here lands on both. */

export const BUTTON_VARIANTS = {
  primary:
    "text-fg-on-primary disabled:bg-(--color-primary-disabled,var(--color-primary)) disabled:text-(--disabled-fg,var(--color-fg-on-primary))",
  secondary:
    "disabled:border-(--disabled-border,var(--color-border-control)) disabled:bg-(--disabled-bg,var(--color-neutral)) disabled:text-(--disabled-fg,var(--color-fg-on-neutral)) pending:border-border",
  quiet:
    "bg-transparent text-fg hover:bg-inverse/10 disabled:bg-(--disabled-bg,transparent) disabled:text-(--disabled-fg,var(--color-fg)) pressed:bg-inverse/20",
  link: "text-fg underline-offset-4 hover:underline disabled:bg-(--disabled-bg,transparent) disabled:text-(--disabled-fg,var(--color-fg))",
  warning:
    "text-fg-on-warning disabled:bg-(--disabled-bg,var(--color-warning)) disabled:text-(--disabled-fg,var(--color-fg-on-warning))",
  danger:
    "text-fg-on-danger disabled:bg-(--disabled-bg,var(--color-danger)) disabled:text-(--disabled-fg,var(--color-fg-on-danger))",
}

/* Each style is a real system's recipe, copied whole: its fills, edges,
   hover and press. Its secondary lives in BUTTON_SECONDARY under the same
   name. */
export const BUTTON_STYLES = {
  // dotUI's own: solid fills.
  flat: {
    variants: {
      variant: {
        primary: "bg-primary hover:bg-primary-hover pressed:bg-primary-active",
        warning: "bg-warning hover:bg-warning-hover pressed:bg-warning-active",
        danger: "bg-danger hover:bg-danger-hover pressed:bg-danger-active",
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
        warning:
          "border border-black/15 bg-warning shadow-[0_1px_1px_0_rgb(31_35_40/0.04),0_1px_2px_0_rgb(31_35_40/0.03)] hover:bg-warning-hover disabled:border-transparent disabled:shadow-none dark:border-white/15 dark:shadow-[0_1px_1px_0_rgb(1_4_9/0.6),0_1px_3px_0_rgb(1_4_9/0.6)] pressed:bg-warning-active pressed:shadow-[inset_0_1px_0_0_rgb(0_0_0/0.3)] dark:pressed:shadow-none",
        danger:
          "border border-black/15 bg-danger shadow-[0_1px_1px_0_rgb(31_35_40/0.04),0_1px_2px_0_rgb(31_35_40/0.03)] hover:bg-danger-hover disabled:border-transparent disabled:shadow-none dark:border-white/15 dark:shadow-[0_1px_1px_0_rgb(1_4_9/0.6),0_1px_3px_0_rgb(1_4_9/0.6)] pressed:bg-danger-active pressed:shadow-[inset_0_1px_0_0_rgb(0_0_0/0.3)] dark:pressed:shadow-none",
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
        warning:
          "bg-warning shadow-[inset_0_0_0_1px_rgb(0_0_0/0.18),inset_0_-2px_0_0_rgb(0_0_0/0.05),0_1px_2px_0_rgb(0_0_0/0.05)] after:pointer-events-none after:absolute after:inset-px after:rounded-[inherit] after:border after:border-white/12 after:mask-b-from-0% hover:bg-warning-hover disabled:shadow-none disabled:after:hidden",
        danger:
          "bg-danger shadow-[inset_0_0_0_1px_rgb(0_0_0/0.18),inset_0_-2px_0_0_rgb(0_0_0/0.05),0_1px_2px_0_rgb(0_0_0/0.05)] after:pointer-events-none after:absolute after:inset-px after:rounded-[inherit] after:border after:border-white/12 after:mask-b-from-0% hover:bg-danger-hover disabled:shadow-none disabled:after:hidden",
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
        warning:
          "isolate bg-warning shadow-[0_0_0_1px_var(--color-warning),inset_0_1px_1px_0_rgb(255_255_255/0.07),0_2px_3px_0_rgb(34_42_53/0.2),0_1px_1px_0_rgb(0_0_0/0.24)] after:pointer-events-none after:absolute after:inset-0 after:-z-1 after:rounded-[inherit] after:bg-linear-to-b after:from-white/11 after:to-transparent after:transition-opacity hover:bg-[color-mix(in_srgb,var(--color-warning),white_20%)] hover:after:opacity-0 disabled:shadow-none pressed:after:opacity-100",
        danger:
          "isolate bg-danger shadow-[0_0_0_1px_var(--color-danger),inset_0_1px_1px_0_rgb(255_255_255/0.07),0_2px_3px_0_rgb(34_42_53/0.2),0_1px_1px_0_rgb(0_0_0/0.24)] after:pointer-events-none after:absolute after:inset-0 after:-z-1 after:rounded-[inherit] after:bg-linear-to-b after:from-white/11 after:to-transparent after:transition-opacity hover:bg-[color-mix(in_srgb,var(--color-danger),white_20%)] hover:after:opacity-0 disabled:shadow-none pressed:after:opacity-100",
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
        warning:
          "bg-warning bg-linear-to-b from-transparent from-63% to-white/15 shadow-[inset_0_-1px_0_1px_rgb(0_0_0/0.8),inset_0_0_0_1px_var(--color-warning),inset_0_0.5px_0_1.5px_rgb(255_255_255/0.25)] hover:bg-warning-hover disabled:bg-none disabled:shadow-none pressed:bg-warning-hover pressed:pt-0.5 pressed:shadow-[inset_-1px_0_1px_0_rgb(0_0_0/0.2),inset_1px_0_1px_0_rgb(0_0_0/0.2),inset_0_2px_0_0_rgb(0_0_0/0.6)]",
        danger:
          "bg-danger bg-linear-to-b from-transparent from-63% to-white/15 shadow-[inset_0_-1px_0_1px_rgb(0_0_0/0.8),inset_0_0_0_1px_var(--color-danger),inset_0_0.5px_0_1.5px_rgb(255_255_255/0.25)] hover:bg-danger-hover disabled:bg-none disabled:shadow-none pressed:bg-danger-hover pressed:pt-0.5 pressed:shadow-[inset_-1px_0_1px_0_rgb(0_0_0/0.2),inset_1px_0_1px_0_rgb(0_0_0/0.2),inset_0_2px_0_0_rgb(0_0_0/0.6)]",
      },
    },
  },
  // Duolingo: a 4px lip under the button, the fill ramp's pressed step;
  // press and disabled sink the face into it.
  ledge: {
    variants: {
      variant: {
        primary:
          "bg-primary shadow-[0_4px_0_0_var(--color-primary-active)] hover:brightness-110 disabled:translate-y-1 disabled:shadow-none disabled:brightness-100 pressed:translate-y-1 pressed:shadow-none",
        warning:
          "bg-warning shadow-[0_4px_0_0_var(--color-warning-active)] hover:brightness-110 disabled:translate-y-1 disabled:shadow-none disabled:brightness-100 pressed:translate-y-1 pressed:shadow-none",
        danger:
          "bg-danger shadow-[0_4px_0_0_var(--color-danger-active)] hover:brightness-110 disabled:translate-y-1 disabled:shadow-none disabled:brightness-100 pressed:translate-y-1 pressed:shadow-none",
      },
    },
  },
}

/* The secondary button: each style's own, then the ones an open style can
   swap in. */
export const BUTTON_SECONDARY = {
  flat: {
    variants: {
      variant: {
        secondary:
          "border-(length:--studio-control-stroke) border-border-control bg-neutral text-fg-on-neutral hover:bg-neutral-hover pressed:bg-neutral-active",
      },
    },
  },
  hairline: {
    variants: {
      variant: {
        secondary:
          "border-(length:--studio-control-stroke) border-border-control bg-neutral text-fg-on-neutral shadow-[0_1px_0_0_rgb(31_35_40/0.04)] hover:bg-neutral-hover disabled:shadow-none dark:shadow-none pressed:bg-neutral-active",
      },
    },
  },
  "rim-light": {
    variants: {
      variant: {
        secondary:
          "border-(length:--studio-control-stroke) border-border-control bg-bg text-fg-on-neutral shadow-[inset_0_-2px_0_0_rgb(0_0_0/0.05),0_1px_2px_0_rgb(0_0_0/0.05)] hover:bg-neutral disabled:shadow-none",
      },
    },
  },
  gloss: {
    variants: {
      variant: {
        secondary:
          "border border-[color-mix(in_oklab,var(--color-fg)_11%,transparent)] bg-bg text-fg-on-neutral shadow-[0_2px_3px_-1px_rgb(0_0_0/0.08),0_1px_0_0_rgb(0_0_0/0.02)] hover:bg-[color-mix(in_oklab,var(--color-fg)_3%,var(--color-bg))] disabled:shadow-none",
      },
    },
  },
  bevel: {
    variants: {
      variant: {
        secondary:
          "border border-black/10 bg-bg text-fg-on-neutral shadow-[inset_0_-1px_0_0_rgb(0_0_0/0.2),inset_0_0.5px_0_1px_rgb(255_255_255)] hover:bg-card disabled:shadow-none dark:border-white/8 dark:bg-neutral dark:shadow-[inset_0_-1px_0_0_rgb(0_0_0/0.6),inset_0_0.5px_0_1px_rgb(255_255_255/0.06)] dark:hover:bg-neutral-hover pressed:bg-neutral pressed:pt-0.5 pressed:shadow-[inset_-1px_0_1px_0_rgb(26_26_26/0.12),inset_1px_0_1px_0_rgb(26_26_26/0.12),inset_0_2px_1px_0_rgb(26_26_26/0.2)]",
      },
    },
  },
  // Duolingo's stroke button: a 2px lip in the edge color under eel ink.
  ledge: {
    variants: {
      variant: {
        secondary:
          "border-(length:--studio-control-stroke) border-border-control bg-bg text-fg-muted shadow-[0_2px_0_0_var(--color-border-control)] hover:brightness-90 disabled:translate-y-0.5 disabled:shadow-none disabled:brightness-100 pressed:translate-y-0.5 pressed:shadow-none",
      },
    },
  },
  // shadcn, Geist, Notion, Stripe: an edge on no fill.
  outline: {
    variants: {
      variant: {
        secondary:
          "border-(length:--studio-control-stroke) border-border-control bg-transparent text-fg-on-neutral hover:bg-neutral pressed:bg-neutral-hover",
      },
    },
  },
  // Supabase, Claude, shadcn vega: a card plate on an edge and an xs drop;
  // dark lifts the plate instead.
  raised: {
    variants: {
      variant: {
        secondary:
          "border-(length:--studio-control-stroke) border-border-control bg-card text-fg-on-neutral shadow-xs hover:bg-neutral disabled:shadow-none dark:bg-neutral dark:hover:bg-neutral-hover pressed:bg-neutral-hover dark:pressed:bg-neutral-active",
      },
    },
  },
  // Radix (soft gray), Airbnb, Spectrum 2: a gray fill, no edge.
  soft: {
    variants: {
      variant: {
        secondary:
          "bg-neutral text-fg-on-neutral hover:bg-neutral-hover pressed:bg-neutral-active",
      },
    },
  },
  // Material 3's filled tonal: the brand's muted tint under its ink.
  tonal: {
    variants: {
      variant: {
        secondary:
          "bg-accent-muted text-fg-accent hover:bg-accent-muted-hover pressed:bg-accent-muted-hover",
      },
    },
  },
}

/* Press on the open styles; the closed ones draw their own. Menu triggers
   stay put, as in shadcn and Supabase. */
export const BUTTON_PRESS = {
  // shadcn, Mantine: down a pixel.
  nudge: { base: "pressed:not-aria-[haspopup]:translate-y-px" },
  // Supabase: shrinks to 97%.
  scale: { base: "motion-safe:pressed:not-aria-[haspopup]:scale-[0.97]" },
}

export const BUTTON_CASE = {
  // Duolingo: 0.8px tracking on 15px labels.
  uppercase: { base: "uppercase tracking-[0.05em]" },
}

/* A selected toggle's look; a current pagination page can wear it too. */
export const SELECTED_LOOKS = {
  // One neutral step down (shadcn, Fluent, Polaris, Untitled UI).
  tone: {
    base: "selected:bg-selected selected:text-fg-on-selected selected:hover:bg-selected-hover selected:pressed:bg-selected-active",
  },
  // M3, Spectrum 2: the selection fill. A primary toggle already wears a
  // fill, so it keeps the tone.
  solid: {
    variants: {
      variant: {
        primary:
          "selected:bg-selected selected:text-fg-on-selected selected:hover:bg-selected-hover selected:pressed:bg-selected-active",
        secondary:
          "selected:border-selection selected:bg-selection selected:text-fg-on-selection selected:hover:bg-selection-hover selected:pressed:bg-selection-hover",
        quiet:
          "selected:bg-selection selected:text-fg-on-selection selected:hover:bg-selection-hover selected:pressed:bg-selection-hover",
      },
    },
  },
  // Atlassian, Ant, Duolingo, Claude: the selection's muted wash, as on a
  // choice card.
  tint: {
    variants: {
      variant: {
        primary: "selected:bg-selection-muted selected:text-fg",
        secondary:
          "selected:border-selection/25 selected:bg-selection-muted selected:text-fg",
        quiet: "selected:bg-selection-muted selected:text-fg",
      },
    },
  },
  // Snaps to full contrast. Primary already wears the inverse color, so it
  // flips the other way: a page chip inside an inverse hairline (shadow-none
  // keeps the ring composite valid on flat styles).
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
}

export const BUTTON_DENSITY = {
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
}

const { useStyles, styles } = createStyles(buttonMeta, {
  base: {
    base: [
      "group/button relative inline-flex shrink-0 cursor-interactive items-center justify-center rounded-(--studio-btn-radius) bg-clip-padding font-(--studio-font-weight-label) whitespace-nowrap transition-[background-color,border-color,color,box-shadow,filter,scale,translate] duration-(--studio-button-state-duration) ease-(--studio-button-state-ease) select-ui",
      "focus-reset focus-visible:focus-ring",
      "**:[svg]:pointer-events-none **:[svg]:shrink-0",
      "pending:cursor-pending pending:bg-disabled pending:text-transparent pending:**:not-data-[slot=spinner]:not-in-data-[slot=spinner]:opacity-0 pending:**:data-[slot=spinner]:text-fg-muted",
      "disabled:cursor-disabled",
    ],
    variants: {
      variant: BUTTON_VARIANTS,
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
  density: BUTTON_DENSITY,
  params: {
    style: BUTTON_STYLES,
    secondary: BUTTON_SECONDARY,
    press: BUTTON_PRESS,
    case: BUTTON_CASE,
    current: SELECTED_LOOKS,
  },
})

export type ButtonStyles = typeof styles

export { styles as buttonStyles, useStyles }
