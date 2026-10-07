import { createStyles } from "@/lib/styles"

import cardMeta from "./meta"

/** The container surface: cards, accordion boxes, attachments. Each reader
 *  keeps its own corner rung. */
export const CONTAINER_SURFACE =
  "border-(length:--studio-card-stroke) border-(--card-border) bg-card shadow-(--shadow-card,0_0_#0000) [--surface-bg:var(--color-card)]"

const { useStyles, styles } = createStyles(cardMeta, {
  base: {
    slots: {
      root: [
        "group/card flex flex-col rounded-(--studio-card-radius)",
        CONTAINER_SURFACE,
        "[--surface-radius:var(--studio-card-radius)] has-[>img:first-child]:pt-0 *:[img]:first:rounded-t-(--studio-card-radius) *:[img]:last:rounded-b-(--studio-card-radius)",
      ],
      header:
        "group/card-header @container/card-header grid auto-rows-min items-start rounded-t-(--studio-card-radius) has-data-card-action:grid-cols-[1fr_auto] has-data-card-description:grid-rows-[auto_auto]",
      title: "font-heading",
      description: "text-fg-muted",
      action: "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
      content: "",
      footer: "flex items-center rounded-b-(--studio-card-radius)",
    },
  },
  density: {
    compact: {
      slots: {
        root: "gap-4 py-4 text-xs/relaxed has-data-card-footer:pb-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-card-footer:pb-0",
        header:
          "gap-1 px-4 group-data-[size=sm]/card:px-3 [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
        description: "text-xs/relaxed",
        content: "px-4 group-data-[size=sm]/card:px-3",
        footer:
          "px-4 pb-4 group-data-[size=sm]/card:px-3 group-data-[size=sm]/card:pb-3 [.border-t]:pt-4 group-data-[size=sm]/card:[.border-t]:pt-3",
      },
    },
    default: {
      slots: {
        root: "gap-4 py-4 text-xs/relaxed has-data-card-footer:pb-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-card-footer:pb-0",
        header:
          "gap-1 px-4 group-data-[size=sm]/card:px-3 [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
        description: "text-sm",
        content: "px-4 group-data-[size=sm]/card:px-3",
        footer:
          "px-4 pb-4 group-data-[size=sm]/card:px-3 group-data-[size=sm]/card:pb-3 [.border-t]:pt-4 group-data-[size=sm]/card:[.border-t]:pt-3",
      },
    },
    comfortable: {
      slots: {
        root: "gap-6 py-6 text-sm has-data-card-footer:pb-0 data-[size=sm]:gap-4 data-[size=sm]:py-4 data-[size=sm]:has-data-card-footer:pb-0",
        header:
          "gap-1 px-6 group-data-[size=sm]/card:px-4 [.border-b]:pb-6 group-data-[size=sm]/card:[.border-b]:pb-4",
        description: "text-sm",
        content: "px-6 group-data-[size=sm]/card:px-4",
        footer:
          "px-6 pb-6 group-data-[size=sm]/card:px-4 group-data-[size=sm]/card:pb-4 [.border-t]:pt-6 group-data-[size=sm]/card:[.border-t]:pt-4",
      },
    },
    spacious: {
      slots: {
        root: "gap-6 py-6 text-sm has-data-card-footer:pb-0 data-[size=sm]:gap-4 data-[size=sm]:py-4 data-[size=sm]:has-data-card-footer:pb-0",
        header:
          "gap-1 px-6 group-data-[size=sm]/card:px-4 [.border-b]:pb-6 group-data-[size=sm]/card:[.border-b]:pb-4",
        description: "text-sm",
        content: "px-6 group-data-[size=sm]/card:px-4",
        footer:
          "px-6 pb-6 group-data-[size=sm]/card:px-4 group-data-[size=sm]/card:pb-4 [.border-t]:pt-6 group-data-[size=sm]/card:[.border-t]:pt-4",
      },
    },
    touch: {
      slots: {
        root: "gap-6 py-6 text-sm has-data-card-footer:pb-0 data-[size=sm]:gap-4 data-[size=sm]:py-4 data-[size=sm]:has-data-card-footer:pb-0",
        header:
          "gap-1 px-6 group-data-[size=sm]/card:px-4 [.border-b]:pb-6 group-data-[size=sm]/card:[.border-b]:pb-4",
        description: "text-sm",
        content: "px-6 group-data-[size=sm]/card:px-4",
        footer:
          "px-6 pb-6 group-data-[size=sm]/card:px-4 group-data-[size=sm]/card:pb-4 [.border-t]:pt-6 group-data-[size=sm]/card:[.border-t]:pt-4",
      },
    },
  },
  params: {
    // The band runs to the card's top edge, so the card drops its top inset
    // and the header carries it.
    header: {
      none: {},
      rule: { slots: { header: "border-b" } },
      band: {
        slots: {
          root: "has-data-card-header:pt-0 data-[size=sm]:has-data-card-header:pt-0",
          header: "border-b bg-inverse/5",
        },
        density: {
          compact: {
            slots: { header: "pt-4 group-data-[size=sm]/card:pt-3" },
          },
          default: {
            slots: { header: "pt-4 group-data-[size=sm]/card:pt-3" },
          },
          comfortable: {
            slots: { header: "pt-6 group-data-[size=sm]/card:pt-4" },
          },
          spacious: {
            slots: { header: "pt-6 group-data-[size=sm]/card:pt-4" },
          },
          touch: {
            slots: { header: "pt-6 group-data-[size=sm]/card:pt-4" },
          },
        },
      },
    },
    footer: {
      none: {},
      rule: { slots: { footer: "border-t" } },
      band: { slots: { footer: "border-t bg-inverse/5" } },
    },
    titles: {
      quiet: {
        density: {
          compact: { slots: { title: "text-sm font-medium" } },
          default: { slots: { title: "text-base leading-snug font-medium" } },
          comfortable: {
            slots: {
              title:
                "text-base leading-normal font-medium group-data-[size=sm]/card:text-sm",
            },
          },
          spacious: {
            slots: {
              title:
                "text-base leading-normal font-medium group-data-[size=sm]/card:text-sm",
            },
          },
          touch: {
            slots: {
              title:
                "text-lg leading-normal font-medium group-data-[size=sm]/card:text-base",
            },
          },
        },
      },
      compact: {
        density: {
          compact: { slots: { title: "text-xs/relaxed font-semibold" } },
          default: { slots: { title: "text-sm font-semibold" } },
          comfortable: { slots: { title: "text-sm font-semibold" } },
          spacious: { slots: { title: "text-sm font-semibold" } },
          touch: { slots: { title: "text-base font-semibold" } },
        },
      },
      tight: {
        density: {
          compact: { slots: { title: "text-sm font-semibold tracking-tight" } },
          default: {
            slots: {
              title: "text-base leading-snug font-semibold tracking-tight",
            },
          },
          comfortable: {
            slots: {
              title:
                "text-base leading-normal font-semibold tracking-tight group-data-[size=sm]/card:text-sm",
            },
          },
          spacious: {
            slots: {
              title:
                "text-base leading-normal font-semibold tracking-tight group-data-[size=sm]/card:text-sm",
            },
          },
          touch: {
            slots: {
              title:
                "text-lg leading-normal font-semibold tracking-tight group-data-[size=sm]/card:text-base",
            },
          },
        },
      },
      bold: {
        density: {
          compact: { slots: { title: "text-base font-bold" } },
          default: { slots: { title: "text-lg font-bold" } },
          comfortable: { slots: { title: "text-xl font-bold" } },
          spacious: { slots: { title: "text-xl font-bold" } },
          touch: { slots: { title: "text-xl font-bold" } },
        },
      },
      display: {
        density: {
          compact: { slots: { title: "text-lg font-normal" } },
          default: { slots: { title: "text-xl font-normal" } },
          comfortable: { slots: { title: "text-2xl font-normal" } },
          spacious: { slots: { title: "text-2xl font-normal" } },
          touch: { slots: { title: "text-2xl font-normal" } },
        },
      },
      caps: {
        density: {
          compact: {
            slots: { title: "text-sm font-semibold tracking-wider uppercase" },
          },
          default: {
            slots: { title: "text-lg font-semibold tracking-wider uppercase" },
          },
          comfortable: {
            slots: { title: "text-lg font-semibold tracking-wider uppercase" },
          },
          spacious: {
            slots: { title: "text-lg font-semibold tracking-wider uppercase" },
          },
          touch: {
            slots: { title: "text-lg font-semibold tracking-wider uppercase" },
          },
        },
      },
    },
  },
})

export type CardStyles = typeof styles

export { useStyles }
