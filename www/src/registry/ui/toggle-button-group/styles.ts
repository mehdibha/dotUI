import { createStyles } from "@/lib/styles"

import { SEAMS } from "../group/styles"
import toggleButtonGroupMeta from "./meta"

/* Group's seams, imported; segments attach or sit apart as on Group. */

const { useStyles, styles } = createStyles(toggleButtonGroupMeta, {
  base: {
    slots: {
      root: [
        "flex w-fit items-stretch",
        "*:data-button:min-w-0 *:data-button:shrink-0",
        "*:data-button:hover:z-10 *:data-button:focus-visible:z-20 *:data-button:selected:z-10 *:data-button:selected:focus-visible:z-20",
      ],
    },
    variants: {
      orientation: {
        horizontal: { root: "flex-row" },
        vertical: { root: "flex-col" },
      },
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
    segments: {
      attached: {
        slots: { root: "*:data-button:shadow-none" },
        variants: {
          orientation: {
            horizontal: {
              root: "has-data-[variant=secondary]:-space-x-(--studio-control-stroke) *:not-first:data-button:rounded-l-none *:not-last:data-button:rounded-r-none",
            },
            vertical: {
              root: "has-data-[variant=secondary]:-space-y-(--studio-control-stroke) *:not-first:data-button:rounded-t-none *:not-last:data-button:rounded-b-none",
            },
          },
        },
      },
      gapped: {
        slots: { root: "gap-2" },
      },
    },
    separator: SEAMS,
  },
})

export type ToggleButtonGroupStyles = typeof styles

export { useStyles }
