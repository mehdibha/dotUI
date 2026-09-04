"use client";

import type * as React from "react";
import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire";

import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonStyles as useButtonStyles } from "@/components/ui/button";
import { tv, type VariantProps } from "tailwind-variants";
const questionnaireVariants = tv({
  slots: {
    root: [
      "flex w-full min-w-0 flex-col",
      "gap-4 [--questionnaire-title-gap:--spacing(4)]",
    ],
    progress: [
      "min-h-[1lh] w-fit min-w-[14ch] font-medium text-fg-muted tabular-nums",
      "text-xs",
    ],
    item: ["flex min-w-0 flex-col border-0 p-0 focus-reset", "gap-4"],
    title: [
      "font-medium text-pretty [&:not(:has(~[data-questionnaire-description]))]:mb-(--questionnaire-title-gap)",
      "text-base leading-snug",
    ],
    description: ["text-pretty text-fg-muted", "text-sm"],
    choices: ["group/questionnaire-choices grid min-w-0", "gap-2"],
    choice: [
      "group/questionnaire-choice relative flex min-h-11 cursor-interactive items-start rounded-md border border-border-control bg-transparent text-start transition-colors select-none",
      "hover:bg-muted/50",
      "data-checked:border-primary/40 data-checked:bg-muted",
      "data-invalid:border-border-danger",
      "has-[>input:focus-visible]:focus-ring",
      "data-disabled:pointer-events-none data-disabled:cursor-default data-disabled:opacity-50",
      "gap-2.5 px-3 py-2.5 text-sm",
    ],
    choiceInput: "absolute inset-0 z-10 size-full cursor-interactive opacity-0",
    choiceIndicator: [
      "pointer-events-none relative flex size-4 shrink-0 translate-y-[--spacing(0.45)] items-center justify-center rounded-sm border border-border-control",
      "group-has-[[data-questionnaire-choice-description]]/questionnaire-choice:translate-y-0.5",
      "group-data-[type=radio]/questionnaire-choice:rounded-full",
      "group-data-checked/questionnaire-choice:border-primary group-data-checked/questionnaire-choice:bg-primary group-data-checked/questionnaire-choice:text-fg-on-primary",
    ],
    choiceIndicatorDot:
      "hidden size-2 rounded-full bg-fg-on-primary group-data-[type=checkbox]/questionnaire-choice:hidden group-data-checked/questionnaire-choice:block",
    choiceIndicatorCheck:
      "hidden size-3.5 group-data-[type=radio]/questionnaire-choice:hidden group-data-checked/questionnaire-choice:block",
    choiceContent: ["flex min-w-0 flex-1 flex-col leading-snug", "gap-0.5"],
    choiceDescription: "text-fg-muted",
    shortcut: [
      "pointer-events-none ms-auto hidden shrink-0 translate-y-[--spacing(0.45)] items-center justify-center rounded-md border border-border-control bg-bg font-mono leading-none font-medium text-fg-muted group-has-[[data-questionnaire-choice-description]]/questionnaire-choice:translate-y-0.5 group-data-shortcut/questionnaire-choice:inline-flex",
      "size-5 text-[0.625rem]",
    ],
    inputWrapper: "group/questionnaire-input relative w-full min-w-0",
    input: [
      "w-full min-w-0 rounded-md border border-border-control bg-field transition-[box-shadow,border-color,color] outline-none",
      "placeholder:text-fg-muted",
      "focus:ring-2 focus:not-aria-invalid:border-border-focus focus:not-aria-invalid:ring-border-focus-muted",
      "aria-invalid:border-border-danger aria-invalid:ring-2 aria-invalid:ring-danger-muted",
      "disabled:pointer-events-none disabled:border-border disabled:bg-disabled disabled:text-fg-disabled",
      "h-8 px-2.5 py-1 text-base md:text-sm",
    ],
    error: ["mt-2 text-fg-danger", "text-sm"],
    actions: [
      "grid min-h-11 w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center",
      "gap-2 sm:min-h-8",
    ],
  },
});

interface QuestionnaireProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Root
> {}

const Questionnaire = ({ className, ...props }: QuestionnaireProps) => {
  const { root } = questionnaireVariants();
  return (
    <QuestionnairePrimitive.Root
      data-questionnaire=""
      className={root({ className })}
      {...props}
    />
  );
};

interface QuestionnaireProgressProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Progress
> {}

const QuestionnaireProgress = ({
  className,
  ...props
}: QuestionnaireProgressProps) => {
  const { progress } = questionnaireVariants();
  return (
    <QuestionnairePrimitive.Progress
      data-questionnaire-progress=""
      className={progress({ className })}
      {...props}
    />
  );
};

interface QuestionnaireItemProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Item
> {}

const QuestionnaireItem = ({ className, ...props }: QuestionnaireItemProps) => {
  const { item } = questionnaireVariants();
  return (
    <QuestionnairePrimitive.Item
      data-questionnaire-item=""
      className={item({ className })}
      {...props}
    />
  );
};

interface QuestionnaireTitleProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Title
> {}

const QuestionnaireTitle = ({
  className,
  ...props
}: QuestionnaireTitleProps) => {
  const { title } = questionnaireVariants();
  return (
    <QuestionnairePrimitive.Title
      data-questionnaire-title=""
      className={title({ className })}
      {...props}
    />
  );
};

interface QuestionnaireDescriptionProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Description
> {}

const QuestionnaireDescription = ({
  className,
  ...props
}: QuestionnaireDescriptionProps) => {
  const { description } = questionnaireVariants();
  return (
    <QuestionnairePrimitive.Description
      data-questionnaire-description=""
      className={description({ className })}
      {...props}
    />
  );
};

interface QuestionnaireChoicesProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Choices
> {}

const QuestionnaireChoices = ({
  className,
  ...props
}: QuestionnaireChoicesProps) => {
  const { choices } = questionnaireVariants();
  return (
    <QuestionnairePrimitive.Choices
      data-questionnaire-choices=""
      className={choices({ className })}
      {...props}
    />
  );
};

interface QuestionnaireChoiceProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Choice
> {}

const QuestionnaireChoice = ({
  className,
  children,
  ...props
}: QuestionnaireChoiceProps) => {
  const {
    choice,
    choiceInput,
    choiceIndicator,
    choiceIndicatorDot,
    choiceIndicatorCheck,
    choiceContent,
    shortcut,
  } = questionnaireVariants();
  return (
    <QuestionnairePrimitive.Choice
      data-questionnaire-choice=""
      className={choice({ className })}
      {...props}
    >
      <QuestionnairePrimitive.ChoiceInput
        data-questionnaire-choice-input=""
        className={choiceInput()}
      />
      <span
        aria-hidden="true"
        data-questionnaire-choice-indicator=""
        className={choiceIndicator()}
      >
        <span
          data-questionnaire-choice-indicator-dot=""
          className={choiceIndicatorDot()}
        />
        <CheckIcon
          data-questionnaire-choice-indicator-check=""
          className={choiceIndicatorCheck()}
        />
      </span>
      <QuestionnairePrimitive.ChoiceLabel
        data-questionnaire-choice-label=""
        className={choiceContent()}
      >
        {children}
      </QuestionnairePrimitive.ChoiceLabel>
      <QuestionnairePrimitive.ChoiceShortcut
        data-questionnaire-choice-shortcut=""
        className={shortcut()}
      />
    </QuestionnairePrimitive.Choice>
  );
};

interface QuestionnaireChoiceDescriptionProps extends React.ComponentProps<"span"> {}

const QuestionnaireChoiceDescription = ({
  className,
  ...props
}: QuestionnaireChoiceDescriptionProps) => {
  const { choiceDescription } = questionnaireVariants();
  return (
    <span
      data-questionnaire-choice-description=""
      className={choiceDescription({ className })}
      {...props}
    />
  );
};

interface QuestionnaireInputProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Input
> {}

const QuestionnaireInput = ({
  className,
  ...props
}: QuestionnaireInputProps) => {
  const { inputWrapper, input } = questionnaireVariants();
  return (
    <div data-questionnaire-input-wrapper="" className={inputWrapper()}>
      <QuestionnairePrimitive.Input
        data-questionnaire-input=""
        className={input({ className })}
        {...props}
      />
    </div>
  );
};

interface QuestionnaireErrorProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Error
> {}

const QuestionnaireError = ({
  className,
  ...props
}: QuestionnaireErrorProps) => {
  const { error } = questionnaireVariants();
  return (
    <QuestionnairePrimitive.Error
      data-questionnaire-error=""
      className={error({ className })}
      {...props}
    />
  );
};

interface QuestionnaireActionsProps extends React.ComponentProps<"div"> {}

const QuestionnaireActions = ({
  className,
  ...props
}: QuestionnaireActionsProps) => {
  const { actions } = questionnaireVariants();
  return (
    <div
      data-questionnaire-actions=""
      className={actions({ className })}
      {...props}
    />
  );
};

interface QuestionnairePreviousProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Previous
> {}

const QuestionnairePrevious = ({
  className,
  children,
  ...props
}: QuestionnairePreviousProps) => {
  const buttonStyles = useButtonStyles;
  return (
    <QuestionnairePrimitive.Previous
      data-questionnaire-previous=""
      data-button=""
      className={buttonStyles({
        variant: "secondary",
        size: "md",
        className: cn("col-start-1 row-start-1 justify-self-start", className),
      })}
      {...props}
    >
      {children ?? "Previous"}
    </QuestionnairePrimitive.Previous>
  );
};

interface QuestionnaireSkipProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Skip
> {}

const QuestionnaireSkip = ({
  className,
  children,
  ...props
}: QuestionnaireSkipProps) => {
  const buttonStyles = useButtonStyles;
  return (
    <QuestionnairePrimitive.Skip
      data-questionnaire-skip=""
      data-button=""
      className={buttonStyles({
        variant: "secondary",
        size: "md",
        className: cn("col-start-2 row-start-1 justify-self-end", className),
      })}
      {...props}
    >
      {children ?? "Skip"}
    </QuestionnairePrimitive.Skip>
  );
};

interface QuestionnaireNextProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Next
> {}

const QuestionnaireNext = ({
  className,
  children,
  ...props
}: QuestionnaireNextProps) => {
  const buttonStyles = useButtonStyles;
  return (
    <QuestionnairePrimitive.Next
      data-questionnaire-next=""
      data-button=""
      className={buttonStyles({
        variant: "primary",
        size: "md",
        className: cn("col-start-3 row-start-1 justify-self-end", className),
      })}
      {...props}
    >
      {children ?? "Next"}
    </QuestionnairePrimitive.Next>
  );
};

interface QuestionnaireSubmitProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Submit
> {}

const QuestionnaireSubmit = ({
  className,
  children,
  ...props
}: QuestionnaireSubmitProps) => {
  const buttonStyles = useButtonStyles;
  return (
    <QuestionnairePrimitive.Submit
      data-questionnaire-submit=""
      data-button=""
      className={buttonStyles({
        variant: "primary",
        size: "md",
        className: cn("col-start-3 row-start-1 justify-self-end", className),
      })}
      {...props}
    >
      {children ?? "Submit"}
    </QuestionnairePrimitive.Submit>
  );
};

export type {
  QuestionnaireActionsProps,
  QuestionnaireChoiceDescriptionProps,
  QuestionnaireChoiceProps,
  QuestionnaireChoicesProps,
  QuestionnaireDescriptionProps,
  QuestionnaireErrorProps,
  QuestionnaireInputProps,
  QuestionnaireItemProps,
  QuestionnaireNextProps,
  QuestionnairePreviousProps,
  QuestionnaireProgressProps,
  QuestionnaireProps,
  QuestionnaireSkipProps,
  QuestionnaireSubmitProps,
  QuestionnaireTitleProps,
};
export {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
};
