import { createStyles } from "@/lib/styles"

import alertMeta from "./meta"

const { useStyles, styles } = createStyles(alertMeta, {
  base: {
    slots: {
      root: [
        "relative grid w-full items-start px-4 py-3 text-sm",
        "rounded-(--alert-radius)",
        "has-data-alert-action:grid-cols-[1fr_auto] has-data-alert-action:pr-3 has-data-alert-title:has-data-alert-description:gap-y-0.5 has-[>svg]:grid-cols-[--spacing(4)_1fr] has-[>svg]:gap-x-3 has-[>svg]:has-data-alert-action:grid-cols-[--spacing(4)_1fr_auto]",
        "*:[svg]:size-4 *:[svg]:translate-y-0.5 *:[svg]:text-current",
      ],
      title: "font-medium tracking-tight [svg~&]:col-start-2",
      description: "text-fg-muted **:[p]:leading-relaxed [svg~&]:col-start-2",
      action:
        "flex gap-1 max-sm:col-start-2 max-sm:mt-2 sm:row-start-1 sm:row-end-3 sm:[[data-alert-title]~&]:col-start-2 sm:[svg~&]:col-start-2 sm:[svg~[data-alert-description]~&]:col-start-3 sm:[svg~[data-alert-title]~&]:col-start-3",
    },
    variants: {
      variant: {
        neutral: {
          root: "text-fg",
        },
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
    defaultVariants: {
      variant: "neutral",
    },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
  params: {
    style: {
      neutral: {
        slots: {
          root: "border bg-card",
        },
      },
      tinted: {
        variants: {
          variant: {
            neutral: { root: "bg-muted" },
            danger: { root: "bg-danger-muted" },
            warning: { root: "bg-warning-muted" },
            info: { root: "bg-info-muted" },
            success: { root: "bg-success-muted" },
          },
        },
      },
      "tinted-border": {
        slots: {
          root: "border",
        },
        variants: {
          variant: {
            neutral: { root: "bg-muted" },
            danger: { root: "border-border-danger bg-danger-muted" },
            warning: { root: "border-border-warning bg-warning-muted" },
            info: { root: "border-border-info bg-info-muted" },
            success: { root: "border-border-success bg-success-muted" },
          },
        },
      },
      "accent-bar": {
        slots: {
          root: "rounded-l-none border-l-[3px]",
        },
        variants: {
          variant: {
            neutral: { root: "border-l-fg-muted bg-muted/60" },
            danger: { root: "border-l-danger bg-danger-muted/60" },
            warning: { root: "border-l-warning bg-warning-muted/60" },
            info: { root: "border-l-info bg-info-muted/60" },
            success: { root: "border-l-success bg-success-muted/60" },
          },
        },
      },
    },
  },
})

export type AlertStyles = typeof styles

export { useStyles }
