import { createStyles } from "@/lib/styles"

import alertMeta from "./meta"

/* Each style is a system's recipe, copied whole: fill, edge and inks per
   status. The variant only names the status. */

const { useStyles, styles } = createStyles(alertMeta, {
  base: {
    slots: {
      root: [
        "relative grid w-full items-start px-4 py-3 text-sm",
        "rounded-(--studio-alert-radius)",
        "has-data-alert-action:grid-cols-[1fr_auto] has-data-alert-action:pr-3 has-data-alert-title:has-data-alert-description:gap-y-0.5 has-[>svg]:grid-cols-[--spacing(4)_1fr] has-[>svg]:gap-x-3 has-[>svg]:has-data-alert-action:grid-cols-[--spacing(4)_1fr_auto]",
        "*:[svg]:size-4 *:[svg]:translate-y-0.5",
      ],
      title: "font-medium tracking-tight [svg~&]:col-start-2",
      description: "text-fg-muted **:[p]:leading-relaxed [svg~&]:col-start-2",
      action:
        "flex gap-1 max-sm:col-start-2 max-sm:mt-2 sm:row-start-1 sm:row-end-3 sm:[[data-alert-title]~&]:col-start-2 sm:[svg~&]:col-start-2 sm:[svg~[data-alert-description]~&]:col-start-3 sm:[svg~[data-alert-title]~&]:col-start-3",
    },
    variants: {
      variant: {
        neutral: {},
        danger: {},
        warning: {},
        info: {},
        success: {},
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
    spacious: {},
    touch: {},
  },
  params: {
    style: {
      // shadcn, HeroUI: the card, its hairline, the status in the ink.
      neutral: {
        slots: { root: "border bg-card [--surface-bg:var(--color-card)]" },
        variants: {
          variant: {
            neutral: { root: "text-fg" },
            danger: {
              root: "text-fg-danger *:data-alert-description:text-fg-danger/90",
            },
            warning: {
              root: "text-fg-warning *:data-alert-description:text-fg-warning/90",
            },
            info: {
              root: "text-fg-info *:data-alert-description:text-fg-info/90",
            },
            success: {
              root: "text-fg-success *:data-alert-description:text-fg-success/90",
            },
          },
        },
      },
      // Radix Themes (Callout soft): the status wash, no edge, tinted ink.
      soft: {
        variants: {
          variant: {
            neutral: {
              root: "bg-muted text-fg [--surface-bg:var(--color-muted)]",
            },
            danger: {
              root: "bg-danger-muted text-fg-danger [--surface-bg:var(--color-danger-muted)] *:data-alert-description:text-fg-danger/90",
            },
            warning: {
              root: "bg-warning-muted text-fg-warning [--surface-bg:var(--color-warning-muted)] *:data-alert-description:text-fg-warning/90",
            },
            info: {
              root: "bg-info-muted text-fg-info [--surface-bg:var(--color-info-muted)] *:data-alert-description:text-fg-info/90",
            },
            success: {
              root: "bg-success-muted text-fg-success [--surface-bg:var(--color-success-muted)] *:data-alert-description:text-fg-success/90",
            },
          },
        },
      },
      // Primer (Banner), Ant Design, Fluent 2, Supabase: the wash inside a
      // status edge; the text stays default, the icon carries the status.
      "soft-outline": {
        slots: { root: "border text-fg" },
        variants: {
          variant: {
            neutral: {
              root: "border-border bg-muted [--surface-bg:var(--color-muted)]",
            },
            danger: {
              root: "border-border-danger bg-danger-muted [--surface-bg:var(--color-danger-muted)] *:[svg]:text-fg-danger",
            },
            warning: {
              root: "border-border-warning bg-warning-muted [--surface-bg:var(--color-warning-muted)] *:[svg]:text-fg-warning",
            },
            info: {
              root: "border-border-info bg-info-muted [--surface-bg:var(--color-info-muted)] *:[svg]:text-fg-info",
            },
            success: {
              root: "border-border-success bg-success-muted [--surface-bg:var(--color-success-muted)] *:[svg]:text-fg-success",
            },
          },
        },
      },
      // Geist (Note): no fill, the status edge
      // and ink.
      outline: {
        slots: { root: "border" },
        variants: {
          variant: {
            neutral: { root: "border-border text-fg" },
            danger: {
              root: "border-border-danger text-fg-danger *:data-alert-description:text-fg-danger/90",
            },
            warning: {
              root: "border-border-warning text-fg-warning *:data-alert-description:text-fg-warning/90",
            },
            info: {
              root: "border-border-info text-fg-info *:data-alert-description:text-fg-info/90",
            },
            success: {
              root: "border-border-success text-fg-success *:data-alert-description:text-fg-success/90",
            },
          },
        },
      },
      // Carbon (InlineNotification, high contrast): the inverse surface,
      // inverse text, the status in a solid icon.
      inverse: {
        slots: {
          root: "bg-inverse text-fg-inverse [--surface-bg:var(--color-inverse)] *:data-alert-description:text-fg-inverse",
        },
        variants: {
          variant: {
            danger: { root: "*:[svg]:text-danger" },
            warning: { root: "*:[svg]:text-warning" },
            info: { root: "*:[svg]:text-info" },
            success: { root: "*:[svg]:text-success" },
          },
        },
      },
    },
  },
})

export type AlertStyles = typeof styles

export { useStyles }
