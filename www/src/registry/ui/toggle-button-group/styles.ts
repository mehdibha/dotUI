import { createStyles } from "@/lib/styles"

import toggleButtonGroupMeta from "./meta"

/* Synced with group: same `separator` param — change both together. The
   divider hides next to the selected segment, the way iOS drops the hairlines
   around the raised chip. */

const { useStyles, styles } = createStyles(toggleButtonGroupMeta, {
  base: {
    slots: {
      root: [
        "flex w-fit items-stretch",
        "*:data-button:min-w-0 *:data-button:shrink-0 *:data-button:shadow-none",
        "*:data-button:hover:z-10 *:data-button:focus-visible:z-20 *:data-button:selected:z-10 *:data-button:selected:focus-visible:z-20",
      ],
    },
    variants: {
      orientation: {
        horizontal: {
          root: "flex-row *:not-first:data-button:rounded-l-none *:not-last:data-button:rounded-r-none",
        },
        vertical: {
          root: "flex-col *:not-first:data-button:rounded-t-none *:not-last:data-button:rounded-b-none",
        },
      },
    },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
  params: {
    separator: {
      auto: {
        variants: {
          orientation: {
            horizontal: { root: "has-data-[variant=secondary]:-space-x-px" },
            vertical: { root: "has-data-[variant=secondary]:-space-y-px" },
          },
        },
      },
      divider: {
        slots: {
          root: "*:data-button:selected:before:hidden *:data-button:[[data-selected]+&]:before:hidden",
        },
        variants: {
          orientation: {
            horizontal: {
              root: [
                "*:not-first:data-button:border-l-0 *:not-last:data-button:border-r-0",
                "*:not-first:data-button:before:absolute *:not-first:data-button:before:inset-y-1.5 *:not-first:data-button:before:left-0 *:not-first:data-button:before:w-px *:not-first:data-button:before:bg-current/20",
              ],
            },
            vertical: {
              root: [
                "*:not-first:data-button:border-t-0 *:not-last:data-button:border-b-0",
                "*:not-first:data-button:before:absolute *:not-first:data-button:before:inset-x-1.5 *:not-first:data-button:before:top-0 *:not-first:data-button:before:h-px *:not-first:data-button:before:bg-current/20",
              ],
            },
          },
        },
      },
      none: {
        variants: {
          orientation: {
            horizontal: {
              root: "*:not-first:data-button:border-l-0 *:not-last:data-button:border-r-0",
            },
            vertical: {
              root: "*:not-first:data-button:border-t-0 *:not-last:data-button:border-b-0",
            },
          },
        },
      },
    },
  },
})

export type ToggleButtonGroupStyles = typeof styles

export { useStyles }
