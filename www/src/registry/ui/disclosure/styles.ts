import { createStyles } from "@/lib/styles"

import disclosureMeta from "./meta"

const { useStyles, styles } = createStyles(disclosureMeta, {
  base: {
    slots: {
      root: "group/disclosure w-full disabled:text-fg-disabled disabled:**:[svg]:text-fg-disabled **:data-button:[&[slot=trigger]]:w-full **:data-button:[&[slot=trigger]]:justify-between **:data-button:[&[slot=trigger]]:text-left",
      heading: "flex",
      button: [
        "focus-reset focus-visible:focus-ring",
        "flex flex-1 cursor-interactive items-start gap-4 rounded-md py-3 text-left text-sm font-medium transition-shadow disabled:pointer-events-none",
      ],
      marker:
        "pointer-events-none shrink-0 translate-y-0.5 text-fg-muted transition-transform duration-200 **:[svg]:size-4",
      panel:
        "h-(--disclosure-panel-height) overflow-clip text-sm text-fg-muted opacity-0 duration-300 ease-fluid-out group-expanded/disclosure:opacity-100 motion-safe:transition-[height,opacity]",
    },
  },
  density: {
    compact: {},
    default: {},
    comfortable: {},
  },
  params: {
    marker: {
      chevron: {
        slots: {
          marker: "group-expanded/disclosure:rotate-180",
        },
      },
      plus: {},
    },
    markerPosition: {
      trailing: {
        slots: {
          button: "justify-between",
        },
      },
      leading: {
        slots: {
          button: "flex-row-reverse justify-end",
        },
      },
    },
  },
})

export type DisclosureStyles = typeof styles

export { useStyles }
