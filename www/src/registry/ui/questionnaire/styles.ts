import { createStyles } from "@/lib/styles"

import questionnaireMeta from "./meta"

const { useStyles, styles } = createStyles(questionnaireMeta, {
  base: {
    slots: {
      root: "flex w-full min-w-0 flex-col",
      progress:
        "min-h-lh w-fit min-w-[14ch] font-medium text-fg-muted tabular-nums",
      item: "flex min-w-0 flex-col border-0 p-0 focus-reset",
      title:
        "text-pretty [&:not(:has(~[data-questionnaire-description]))]:mb-(--questionnaire-title-gap)",
      description: "text-pretty text-fg-muted",
      choices: "group/questionnaire-choices grid min-w-0",
      choice: [
        "group/questionnaire-choice relative flex min-h-11 cursor-interactive items-start rounded-(--studio-questionnaire-choice-radius) border border-border-control bg-transparent text-start transition-colors duration-(--studio-questionnaire-state-duration) ease-(--studio-questionnaire-state-ease) select-ui",
        "hover:bg-muted/50",
        "data-checked:border-selection/40 data-checked:bg-muted",
        "data-invalid:border-fg-danger",
        "has-[>input:focus-visible]:focus-ring",
        "data-disabled:cursor-disabled data-disabled:text-(--disabled-fg,currentColor) data-disabled:hover:bg-transparent",
      ],
      choiceInput:
        "absolute inset-0 z-10 size-full cursor-interactive opacity-0 disabled:cursor-disabled",
      choiceIndicator: [
        "pointer-events-none relative flex size-4 shrink-0 translate-y-[--spacing(0.45)] items-center justify-center rounded-(--studio-questionnaire-indicator-radius) border-(length:--studio-control-stroke) border-border-control",
        "group-has-data-questionnaire-choice-description/questionnaire-choice:translate-y-0.5",
        "group-data-[type=radio]/questionnaire-choice:rounded-full",
        "group-data-checked/questionnaire-choice:border-selection group-data-checked/questionnaire-choice:bg-selection group-data-checked/questionnaire-choice:text-fg-on-selection",
      ],
      choiceIndicatorDot:
        "hidden size-2 rounded-full bg-fg-on-selection group-data-[type=checkbox]/questionnaire-choice:hidden group-data-checked/questionnaire-choice:block",
      choiceIndicatorCheck:
        "hidden size-3.5 group-data-[type=radio]/questionnaire-choice:hidden group-data-checked/questionnaire-choice:block",
      choiceContent: "flex min-w-0 flex-1 flex-col leading-snug",
      choiceDescription: "text-fg-muted",
      shortcut:
        "pointer-events-none ms-auto hidden shrink-0 translate-y-[--spacing(0.45)] items-center justify-center rounded-(--studio-radius-control-sm) border border-border-control bg-(--surface-bg,var(--color-bg)) font-mono leading-none font-medium text-fg-muted group-has-data-questionnaire-choice-description/questionnaire-choice:translate-y-0.5 group-data-shortcut/questionnaire-choice:inline-flex",
      inputWrapper: "group/questionnaire-input relative w-full min-w-0",
      // The shell is input's; this adds the questionnaire's own invalid
      // state, which it marks with aria-invalid.
      input:
        "aria-invalid:border-fg-danger aria-invalid:invalid-fill aria-invalid:ring-(color:--focus-invalid-color) aria-invalid:not-focus:invalid-ring aria-invalid:focus:border-fg-danger",
      error: "mt-2 text-fg-danger",
      actions:
        "grid min-h-11 w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center",
    },
  },
  density: {
    compact: {
      slots: {
        root: "gap-4 [--questionnaire-title-gap:--spacing(3)]",
        progress: "text-[0.625rem]",
        item: "gap-3",
        description: "text-xs/relaxed",
        choices: "gap-1.5",
        choice: "gap-2.5 px-3 py-2.5 text-xs/relaxed",
        choiceContent: "gap-0.5",
        shortcut: "size-4 text-[0.5625rem]",
        error: "text-xs/relaxed",
        actions: "gap-1.5 sm:min-h-7",
      },
    },
    default: {
      slots: {
        root: "gap-4 [--questionnaire-title-gap:--spacing(4)]",
        progress: "text-xs",
        item: "gap-4",
        description: "text-sm",
        choices: "gap-2",
        choice: "gap-2.5 px-3 py-2.5 text-sm",
        choiceContent: "gap-0.5",
        shortcut: "size-5 text-[0.625rem]",
        error: "text-sm",
        actions: "gap-2 sm:min-h-8",
      },
    },
    comfortable: {
      slots: {
        root: "gap-6 [--questionnaire-title-gap:--spacing(5)]",
        progress: "text-xs",
        item: "gap-5",
        description: "text-sm",
        choices: "gap-3",
        choice: "gap-3 px-4 py-3.5 text-sm",
        choiceContent: "gap-1",
        shortcut: "size-5 text-[0.625rem]",
        error: "text-sm",
        actions: "gap-2 sm:min-h-9",
      },
    },
    spacious: {
      slots: {
        root: "gap-6 [--questionnaire-title-gap:--spacing(5)]",
        progress: "text-xs",
        item: "gap-5",
        description: "text-sm",
        choices: "gap-3",
        choice: "gap-3 px-4 py-3.5 text-sm",
        choiceContent: "gap-1",
        shortcut: "size-5 text-[0.625rem]",
        error: "text-sm",
        actions: "gap-2 sm:min-h-10",
      },
    },
    touch: {
      slots: {
        root: "gap-6 [--questionnaire-title-gap:--spacing(5)]",
        progress: "text-xs",
        item: "gap-5",
        description: "text-sm",
        choices: "gap-3",
        choice: "gap-3 px-4 py-3.5 text-sm",
        choiceContent: "gap-1",
        shortcut: "size-5 text-[0.625rem]",
        error: "text-sm",
        actions: "gap-2 sm:min-h-12",
      },
    },
  },
  params: {
    titles: {
      quiet: {
        density: {
          compact: { slots: { title: "text-sm font-semibold" } },
          default: { slots: { title: "text-base leading-snug font-medium" } },
          comfortable: {
            slots: { title: "text-base leading-snug font-medium" },
          },
          spacious: {
            slots: { title: "text-base leading-snug font-medium" },
          },
          touch: {
            slots: { title: "text-lg leading-snug font-medium" },
          },
        },
      },
      compact: {
        density: {
          compact: { slots: { title: "text-xs font-semibold" } },
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
              title: "text-base leading-snug font-semibold tracking-tight",
            },
          },
          spacious: {
            slots: {
              title: "text-base leading-snug font-semibold tracking-tight",
            },
          },
          touch: {
            slots: {
              title: "text-lg leading-snug font-semibold tracking-tight",
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
            slots: { title: "text-xs font-semibold tracking-wide uppercase" },
          },
          default: {
            slots: { title: "text-xs font-semibold tracking-wide uppercase" },
          },
          comfortable: {
            slots: { title: "text-xs font-semibold tracking-wide uppercase" },
          },
          spacious: {
            slots: { title: "text-xs font-semibold tracking-wide uppercase" },
          },
          touch: {
            slots: { title: "text-xs font-semibold tracking-wide uppercase" },
          },
        },
      },
    },
  },
})

export type QuestionnaireStyles = typeof styles

export { useStyles }
