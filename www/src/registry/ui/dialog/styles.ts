import { createStyles } from "@/lib/styles"

import dialogMeta from "./meta"

/* Footer actions. End stacks full width below sm (shadcn); Spread stays a
   row (Geist); Stack is a column at every width, primary on top (Duolingo);
   Bleed makes the buttons the footer: square, 64px, labels top-left (Carbon). */
const end = "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
const spread = "flex flex-row justify-between gap-2"
const stack = "flex flex-col-reverse gap-2 *:w-full"
const bleed =
  "-mx-(--dialog-padding) -mb-(--dialog-padding) grid auto-cols-fr grid-flow-col overflow-hidden rounded-b-[calc(var(--surface-radius)-1px)] *:h-16 *:items-start *:justify-start *:rounded-none *:px-4 *:pt-3.5 *:pb-8"

/* The footer's edge: a full-bleed rule above it (Supabase, Polaris), or a
   tinted band (shadcn nova, Geist). */
const rule = "-mx-(--dialog-padding) border-t px-(--dialog-padding) pt-4"
const band =
  "-mx-(--dialog-padding) -mb-(--dialog-padding) rounded-b-[calc(var(--surface-radius)-1px)] border-t bg-muted/50 p-(--dialog-padding)"

const { useStyles, styles } = createStyles(dialogMeta, {
  base: {
    slots: {
      content:
        "relative flex max-h-[inherit] min-h-0 flex-col gap-4 p-(--dialog-padding) outline-none in-data-drawer:flex-1 has-data-command:p-0 [@container_(height<31.25rem)]:overflow-y-auto",
      header: "flex flex-col",
      title: "font-heading",
      description: "text-fg-muted",
      body: "-mx-(--dialog-padding) flex min-h-0 flex-1 flex-col gap-2 px-(--dialog-padding) in-data-modal:[@container_(height<31.25rem)]:mx-0 in-data-modal:[@container_(height<31.25rem)]:shrink-0 in-data-modal:[@container_(height<31.25rem)]:overflow-y-visible in-data-modal:[@container_(height<31.25rem)]:px-0",
      footer: "",
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
    spacious: {
      slots: {
        content:
          "text-sm [--dialog-padding:--spacing(6)] in-data-popover:[--dialog-padding:--spacing(4)]",
        header: "gap-2 in-data-popover:gap-1",
        description: "",
        closeButton: "top-4 right-4",
      },
    },
    touch: {
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
    /* Popover-hosted dialogs keep their own header. */
    sections: {
      open: {},
      // Material 3, Stripe: rules at the body's edges only while it scrolls
      // past them, drawn by background-attachment so nothing listens. Local
      // layers snap up to a device pixel inward, so the rules sit 1px in and
      // the covers overshoot them.
      "on-scroll": {
        slots: {
          body: "not-in-data-popover:overflow-y-auto not-in-data-popover:[background:linear-gradient(var(--surface-bg),var(--surface-bg))_top/100%_3px_no-repeat_local,linear-gradient(var(--surface-bg),var(--surface-bg))_bottom/100%_3px_no-repeat_local,linear-gradient(var(--color-border),var(--color-border))_0_1px/100%_1px_no-repeat,linear-gradient(var(--color-border),var(--color-border))_left_0_bottom_1px/100%_1px_no-repeat]",
        },
      },
      // Supabase: a full-bleed rule under the header.
      divided: {
        slots: {
          header:
            "not-in-data-popover:-mx-(--dialog-padding) not-in-data-popover:border-b not-in-data-popover:px-(--dialog-padding) not-in-data-popover:pb-4",
        },
      },
      // Polaris: a tinted header band over a rule.
      "header-band": {
        slots: {
          header:
            "not-in-data-popover:-mx-(--dialog-padding) not-in-data-popover:-mt-(--dialog-padding) not-in-data-popover:rounded-t-[calc(var(--surface-radius)-1px)] not-in-data-popover:border-b not-in-data-popover:bg-muted not-in-data-popover:px-(--dialog-padding) not-in-data-popover:py-4",
        },
      },
    },
    footer: {
      end: { slots: { footer: end } },
      spread: { slots: { footer: spread } },
      stack: { slots: { footer: stack } },
      bleed: { slots: { footer: bleed } },
      "end-rule": { slots: { footer: [end, rule] } },
      "spread-rule": { slots: { footer: [spread, rule] } },
      "stack-rule": { slots: { footer: [stack, rule] } },
      "end-band": { slots: { footer: [end, band] } },
      "spread-band": { slots: { footer: [spread, band] } },
      "stack-band": { slots: { footer: [stack, band] } },
    },
    close: {
      quiet: {},
      // shadcn luma, rhea, sera: the quiet button on the secondary fill.
      filled: {
        slots: {
          closeButton:
            "bg-neutral hover:bg-neutral-hover pressed:bg-neutral-active",
        },
      },
      // Supabase: faint until hovered or focused.
      faint: {
        slots: {
          closeButton: "opacity-20 hover:opacity-100 focus-visible:opacity-100",
        },
      },
    },
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
          spacious: {
            slots: {
              title:
                "text-lg font-semibold in-data-modal:leading-none in-data-popover:text-sm in-data-popover:font-medium",
            },
          },
          touch: {
            slots: {
              title:
                "text-lg font-semibold in-data-modal:leading-none in-data-popover:text-base in-data-popover:font-medium",
            },
          },
        },
      },
      compact: {
        density: {
          compact: {
            slots: {
              title: "text-sm font-semibold in-data-popover:font-medium",
            },
          },
          default: {
            slots: {
              title: "text-sm font-semibold in-data-popover:font-medium",
            },
          },
          comfortable: {
            slots: {
              title: "text-sm font-semibold in-data-popover:font-medium",
            },
          },
          spacious: {
            slots: {
              title: "text-sm font-semibold in-data-popover:font-medium",
            },
          },
          touch: {
            slots: {
              title: "text-base font-semibold in-data-popover:font-medium",
            },
          },
        },
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
          spacious: {
            slots: {
              title:
                "text-lg font-semibold tracking-tight in-data-modal:leading-none in-data-popover:text-sm in-data-popover:font-medium in-data-popover:tracking-normal",
            },
          },
          touch: {
            slots: {
              title:
                "text-lg font-semibold tracking-tight in-data-modal:leading-none in-data-popover:text-base in-data-popover:font-medium in-data-popover:tracking-normal",
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
          spacious: {
            slots: {
              title:
                "text-xl font-bold in-data-popover:text-sm in-data-popover:font-medium",
            },
          },
          touch: {
            slots: {
              title:
                "text-xl font-bold in-data-popover:text-base in-data-popover:font-medium",
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
          spacious: {
            slots: {
              title:
                "text-2xl font-normal in-data-popover:text-sm in-data-popover:font-medium",
            },
          },
          touch: {
            slots: {
              title:
                "text-2xl font-normal in-data-popover:text-base in-data-popover:font-medium",
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
          spacious: {
            slots: {
              title:
                "text-lg font-semibold tracking-wider uppercase in-data-modal:leading-none in-data-popover:text-sm in-data-popover:font-medium in-data-popover:tracking-normal in-data-popover:normal-case",
            },
          },
          touch: {
            slots: {
              title:
                "text-lg font-semibold tracking-wider uppercase in-data-modal:leading-none in-data-popover:text-base in-data-popover:font-medium in-data-popover:tracking-normal in-data-popover:normal-case",
            },
          },
        },
      },
    },
  },
})

export type DialogStyles = typeof styles

export { useStyles }
