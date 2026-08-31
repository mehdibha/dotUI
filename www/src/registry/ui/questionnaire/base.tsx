"use client"

import type * as React from "react"
import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire"

import { CheckIcon } from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { useStyles as useButtonStyles } from "@/registry/ui/button/styles"

import { useStyles } from "./styles"

// MARK: questionnaireStyles

// MARK: Separator

interface QuestionnaireProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Root
> {}

const Questionnaire = ({ className, ...props }: QuestionnaireProps) => {
  const { root } = useStyles()()
  return (
    <QuestionnairePrimitive.Root
      data-questionnaire=""
      className={root({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface QuestionnaireProgressProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Progress
> {}

const QuestionnaireProgress = ({
  className,
  ...props
}: QuestionnaireProgressProps) => {
  const { progress } = useStyles()()
  return (
    <QuestionnairePrimitive.Progress
      data-questionnaire-progress=""
      className={progress({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface QuestionnaireItemProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Item
> {}

const QuestionnaireItem = ({ className, ...props }: QuestionnaireItemProps) => {
  const { item } = useStyles()()
  return (
    <QuestionnairePrimitive.Item
      data-questionnaire-item=""
      className={item({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface QuestionnaireTitleProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Title
> {}

const QuestionnaireTitle = ({
  className,
  ...props
}: QuestionnaireTitleProps) => {
  const { title } = useStyles()()
  return (
    <QuestionnairePrimitive.Title
      data-questionnaire-title=""
      className={title({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface QuestionnaireDescriptionProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Description
> {}

const QuestionnaireDescription = ({
  className,
  ...props
}: QuestionnaireDescriptionProps) => {
  const { description } = useStyles()()
  return (
    <QuestionnairePrimitive.Description
      data-questionnaire-description=""
      className={description({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface QuestionnaireChoicesProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Choices
> {}

const QuestionnaireChoices = ({
  className,
  ...props
}: QuestionnaireChoicesProps) => {
  const { choices } = useStyles()()
  return (
    <QuestionnairePrimitive.Choices
      data-questionnaire-choices=""
      className={choices({ className })}
      {...props}
    />
  )
}

// MARK: Separator

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
  } = useStyles()()
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
  )
}

// MARK: Separator

interface QuestionnaireChoiceDescriptionProps extends React.ComponentProps<"span"> {}

const QuestionnaireChoiceDescription = ({
  className,
  ...props
}: QuestionnaireChoiceDescriptionProps) => {
  const { choiceDescription } = useStyles()()
  return (
    <span
      data-questionnaire-choice-description=""
      className={choiceDescription({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface QuestionnaireInputProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Input
> {}

const QuestionnaireInput = ({
  className,
  ...props
}: QuestionnaireInputProps) => {
  const { inputWrapper, input } = useStyles()()
  return (
    <div data-questionnaire-input-wrapper="" className={inputWrapper()}>
      <QuestionnairePrimitive.Input
        data-questionnaire-input=""
        className={input({ className })}
        {...props}
      />
    </div>
  )
}

// MARK: Separator

interface QuestionnaireErrorProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Error
> {}

const QuestionnaireError = ({
  className,
  ...props
}: QuestionnaireErrorProps) => {
  const { error } = useStyles()()
  return (
    <QuestionnairePrimitive.Error
      data-questionnaire-error=""
      className={error({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface QuestionnaireActionsProps extends React.ComponentProps<"div"> {}

const QuestionnaireActions = ({
  className,
  ...props
}: QuestionnaireActionsProps) => {
  const { actions } = useStyles()()
  return (
    <div
      data-questionnaire-actions=""
      className={actions({ className })}
      {...props}
    />
  )
}

// MARK: Separator

interface QuestionnairePreviousProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Previous
> {}

const QuestionnairePrevious = ({
  className,
  children,
  ...props
}: QuestionnairePreviousProps) => {
  const buttonStyles = useButtonStyles()
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
  )
}

// MARK: Separator

interface QuestionnaireSkipProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Skip
> {}

const QuestionnaireSkip = ({
  className,
  children,
  ...props
}: QuestionnaireSkipProps) => {
  const buttonStyles = useButtonStyles()
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
  )
}

// MARK: Separator

interface QuestionnaireNextProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Next
> {}

const QuestionnaireNext = ({
  className,
  children,
  ...props
}: QuestionnaireNextProps) => {
  const buttonStyles = useButtonStyles()
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
  )
}

// MARK: Separator

interface QuestionnaireSubmitProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Submit
> {}

const QuestionnaireSubmit = ({
  className,
  children,
  ...props
}: QuestionnaireSubmitProps) => {
  const buttonStyles = useButtonStyles()
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
  )
}

// MARK: Separator

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
}
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
}
