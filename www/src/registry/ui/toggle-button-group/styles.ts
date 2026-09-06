import { createStyles } from "@/lib/styles"

import toggleButtonGroupMeta from "./meta"

/* Synced with group: same `separator` param — change both together. Divider
   and none act between two adjacent buttons; the divider hides next to the
   selected segment, the way iOS drops the hairlines around the raised chip. */

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
          root: "flex-row has-data-[variant=secondary]:-space-x-px *:not-first:data-button:rounded-l-none *:not-last:data-button:rounded-r-none",
        },
        vertical: {
          root: "flex-col has-data-[variant=secondary]:-space-y-px *:not-first:data-button:rounded-t-none *:not-last:data-button:rounded-b-none",
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
      auto: {},
      divider: {
        slots: {
          root: "*:data-button:selected:before:hidden *:data-button:[[data-selected]+&]:before:hidden",
        },
        variants: {
          orientation: {
            horizontal: {
              root: [
                "*:data-button:[&:has(+[data-button])]:me-0 *:data-button:[&:has(+[data-button])]:border-r-0 *:data-button:[[data-button]+&]:border-l-0",
                "*:data-button:[[data-button]+&]:before:absolute *:data-button:[[data-button]+&]:before:inset-y-1.5 *:data-button:[[data-button]+&]:before:left-0 *:data-button:[[data-button]+&]:before:w-px *:data-button:[[data-button]+&]:before:bg-current/20",
              ],
            },
            vertical: {
              root: [
                "*:data-button:[&:has(+[data-button])]:mb-0 *:data-button:[&:has(+[data-button])]:border-b-0 *:data-button:[[data-button]+&]:border-t-0",
                "*:data-button:[[data-button]+&]:before:absolute *:data-button:[[data-button]+&]:before:inset-x-1.5 *:data-button:[[data-button]+&]:before:top-0 *:data-button:[[data-button]+&]:before:h-px *:data-button:[[data-button]+&]:before:bg-current/20",
              ],
            },
          },
        },
      },
      none: {
        variants: {
          orientation: {
            horizontal: {
              root: "*:data-button:[&:has(+[data-button])]:border-r-0 *:data-button:[[data-button]+&]:border-l-0",
            },
            vertical: {
              root: "*:data-button:[&:has(+[data-button])]:border-b-0 *:data-button:[[data-button]+&]:border-t-0",
            },
          },
        },
      },
    },
  },
})

export type ToggleButtonGroupStyles = typeof styles

export { useStyles }
