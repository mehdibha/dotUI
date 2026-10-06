import { createStyles } from "@/lib/styles"

import dialogMeta from "./meta"

const { useStyles, styles } = createStyles(dialogMeta, {
  base: {
    slots: {
      content:
        "relative flex max-h-[inherit] min-h-0 flex-col gap-4 p-(--dialog-padding) outline-none has-data-command:p-0 [@container_(height<31.25rem)]:overflow-y-auto",
      header: "flex flex-col",
      title: "font-heading",
      description: "text-fg-muted",
      body: "-mx-(--dialog-padding) flex min-h-0 flex-1 flex-col gap-2 px-(--dialog-padding) in-data-modal:[@container_(height<31.25rem)]:mx-0 in-data-modal:[@container_(height<31.25rem)]:shrink-0 in-data-modal:[@container_(height<31.25rem)]:overflow-y-visible in-data-modal:[@container_(height<31.25rem)]:px-0",
      footer: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
      closeButton: "absolute",
    },
  },
  density: {
    compact: {
      slots: {
        content:
          "text-xs/relaxed [--dialog-padding:--spacing(4)] in-data-popover:[--dialog-padding:--spacing(2.5)]",
        description: "",
        closeButton: "top-2 right-2",
      },
    },
    default: {
      slots: {
        content:
          "text-sm [--dialog-padding:--spacing(4)] in-data-popover:[--dialog-padding:--spacing(2.5)]",
        header: "gap-2 in-data-popover:gap-0.5",
        description: "",
        closeButton: "top-2 right-2",
      },
    },
    comfortable: {
      slots: {
        content:
          "text-sm [--dialog-padding:--spacing(6)] in-data-popover:[--dialog-padding:--spacing(4)]",
        header: "gap-2 in-data-popover:gap-1",
        description: "",
        closeButton: "top-4 right-4",
      },
    },
  },
  params: {
    titles: {
      quiet: {
        density: {
          compact: { slots: { title: "text-sm font-medium" } },
          default: {
            slots: {
              title:
                "font-medium in-data-modal:text-base in-data-modal:leading-none",
            },
          },
          comfortable: {
            slots: {
              title:
                "text-lg font-semibold in-data-modal:leading-none in-data-popover:text-sm in-data-popover:font-medium",
            },
          },
        },
      },
      compact: {
        slots: { title: "text-sm font-semibold in-data-popover:font-medium" },
      },
      tight: {
        density: {
          compact: {
            slots: {
              title:
                "text-sm font-semibold tracking-tight in-data-popover:text-sm in-data-popover:font-medium in-data-popover:tracking-normal",
            },
          },
          default: {
            slots: {
              title:
                "font-semibold tracking-tight in-data-modal:text-base in-data-modal:leading-none in-data-popover:text-sm in-data-popover:font-medium in-data-popover:tracking-normal",
            },
          },
          comfortable: {
            slots: {
              title:
                "text-lg font-semibold tracking-tight in-data-modal:leading-none in-data-popover:text-sm in-data-popover:font-medium in-data-popover:tracking-normal",
            },
          },
        },
      },
      bold: {
        density: {
          compact: {
            slots: {
              title:
                "text-base font-bold in-data-popover:text-sm in-data-popover:font-medium",
            },
          },
          default: {
            slots: {
              title:
                "text-lg font-bold in-data-popover:text-sm in-data-popover:font-medium",
            },
          },
          comfortable: {
            slots: {
              title:
                "text-xl font-bold in-data-popover:text-sm in-data-popover:font-medium",
            },
          },
        },
      },
      display: {
        density: {
          compact: {
            slots: {
              title:
                "text-lg font-normal in-data-popover:text-sm in-data-popover:font-medium",
            },
          },
          default: {
            slots: {
              title:
                "text-xl font-normal in-data-popover:text-sm in-data-popover:font-medium",
            },
          },
          comfortable: {
            slots: {
              title:
                "text-2xl font-normal in-data-popover:text-sm in-data-popover:font-medium",
            },
          },
        },
      },
      caps: {
        density: {
          compact: {
            slots: {
              title:
                "text-sm font-semibold tracking-wider uppercase in-data-popover:text-sm in-data-popover:font-medium in-data-popover:tracking-normal in-data-popover:normal-case",
            },
          },
          default: {
            slots: {
              title:
                "text-lg font-semibold tracking-wider uppercase in-data-modal:leading-none in-data-popover:text-sm in-data-popover:font-medium in-data-popover:tracking-normal in-data-popover:normal-case",
            },
          },
          comfortable: {
            slots: {
              title:
                "text-lg font-semibold tracking-wider uppercase in-data-modal:leading-none in-data-popover:text-sm in-data-popover:font-medium in-data-popover:tracking-normal in-data-popover:normal-case",
            },
          },
        },
      },
    },
  },
})

export type DialogStyles = typeof styles

export { useStyles }
