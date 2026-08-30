import { createStyles } from "@/lib/styles"

import questionnaireMeta from "./meta"

const { useStyles, styles } = createStyles(questionnaireMeta, {
  base: {
    slots: {
      root: "flex w-full min-w-0 flex-col",
      progress:
        "min-h-[1lh] w-fit min-w-[14ch] font-medium text-fg-muted tabular-nums",
      item: "flex min-w-0 flex-col border-0 p-0 focus-reset",
      title:
        "font-medium text-pretty [&:not(:has(~[data-questionnaire-description]))]:mb-(--questionnaire-title-gap)",
      description: "text-pretty text-fg-muted",
      choices: "group/questionnaire-choices grid min-w-0",
      choice: [
        "group/questionnaire-choice relative flex min-h-11 cursor-interactive items-start rounded-(--questionnaire-choice-radius) border border-border-field bg-transparent text-start transition-colors select-none",
        "hover:bg-muted/50",
        "data-checked:border-primary/40 data-checked:bg-muted",
        "data-invalid:border-border-danger",
        "has-[>input:focus-visible]:focus-ring",
        "data-disabled:pointer-events-none data-disabled:cursor-default data-disabled:opacity-50",
      ],
      choiceInput:
        "absolute inset-0 z-10 size-full cursor-interactive opacity-0",
      choiceIndicator: [
        "pointer-events-none relative flex size-4 shrink-0 translate-y-[--spacing(0.45)] items-center justify-center rounded-(--questionnaire-indicator-radius) border border-border-field",
        "group-has-[[data-questionnaire-choice-description]]/questionnaire-choice:translate-y-0.5",
        "group-data-[type=radio]/questionnaire-choice:rounded-full",
        "group-data-checked/questionnaire-choice:border-primary group-data-checked/questionnaire-choice:bg-primary group-data-checked/questionnaire-choice:text-fg-on-primary",
      ],
      choiceIndicatorDot:
        "hidden size-2 rounded-full bg-fg-on-primary group-data-[type=checkbox]/questionnaire-choice:hidden group-data-checked/questionnaire-choice:block",
      choiceIndicatorCheck:
        "hidden size-3.5 group-data-[type=radio]/questionnaire-choice:hidden group-data-checked/questionnaire-choice:block",
      choiceContent: "flex min-w-0 flex-1 flex-col leading-snug",
      choiceDescription: "text-fg-muted",
      shortcut:
        "pointer-events-none ms-auto hidden shrink-0 translate-y-[--spacing(0.45)] items-center justify-center rounded-(--radius-item) border border-border-field bg-bg font-mono leading-none font-medium text-fg-muted group-has-[[data-questionnaire-choice-description]]/questionnaire-choice:translate-y-0.5 group-data-shortcut/questionnaire-choice:inline-flex",
      inputWrapper: "group/questionnaire-input relative w-full min-w-0",
      input: [
        "w-full min-w-0 rounded-(--questionnaire-input-radius) border border-border-field bg-field transition-[box-shadow,border-color,color] outline-none",
        "placeholder:text-fg-muted",
        "focus:ring-2 focus:not-aria-invalid:border-border-focus focus:not-aria-invalid:ring-border-focus-muted",
        "aria-invalid:border-border-danger aria-invalid:ring-2 aria-invalid:ring-danger-muted",
        "disabled:pointer-events-none disabled:border-border-disabled disabled:bg-disabled disabled:text-fg-disabled",
      ],
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
        title: "text-sm font-semibold",
        description: "text-xs/relaxed",
        choices: "gap-1.5",
        choice: "gap-2.5 px-3 py-2.5 text-xs/relaxed",
        choiceContent: "gap-0.5",
        shortcut: "size-4 text-[0.5625rem]",
        input: "h-7 px-2 py-0.5 text-sm md:text-xs/relaxed",
        error: "text-xs/relaxed",
        actions: "gap-1.5 sm:min-h-7",
      },
    },
    default: {
      slots: {
        root: "gap-4 [--questionnaire-title-gap:--spacing(4)]",
        progress: "text-xs",
        item: "gap-4",
        title: "text-base leading-snug",
        description: "text-sm",
        choices: "gap-2",
        choice: "gap-2.5 px-3 py-2.5 text-sm",
        choiceContent: "gap-0.5",
        shortcut: "size-5 text-[0.625rem]",
        input: "h-8 px-2.5 py-1 text-base md:text-sm",
        error: "text-sm",
        actions: "gap-2 sm:min-h-8",
      },
    },
    comfortable: {
      slots: {
        root: "gap-6 [--questionnaire-title-gap:--spacing(5)]",
        progress: "text-xs",
        item: "gap-5",
        title: "text-base leading-snug",
        description: "text-sm",
        choices: "gap-3",
        choice: "gap-3 px-4 py-3.5 text-sm",
        choiceContent: "gap-1",
        shortcut: "size-5 text-[0.625rem]",
        input: "h-9 px-2.5 py-1 text-base md:text-sm",
        error: "text-sm",
        actions: "gap-2 sm:min-h-9",
      },
    },
  },
})

export type QuestionnaireStyles = typeof styles

export { useStyles }
