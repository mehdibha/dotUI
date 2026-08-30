import type { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire"

/**
 * A multi-step survey — one question at a time, with progress, keyboard
 * shortcuts, and navigation. Renders a form.
 */
export interface QuestionnaireProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Root
> {}

/**
 * Where the reader is in the flow — "1 of 4"-style progress.
 */
export interface QuestionnaireProgressProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Progress
> {}

/**
 * One question. Only the active item is shown.
 */
export interface QuestionnaireItemProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Item
> {}

/**
 * The question itself.
 */
export interface QuestionnaireTitleProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Title
> {}

/**
 * Supporting copy under the title.
 */
export interface QuestionnaireDescriptionProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Description
> {}

/**
 * The list of choices for a question.
 */
export interface QuestionnaireChoicesProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Choices
> {}

/**
 * One selectable choice — radio for single-answer questions, checkbox when
 * the item allows multiple. Shows its keyboard shortcut when the
 * questionnaire enables them.
 */
export interface QuestionnaireChoiceProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Choice
> {}

/**
 * Supporting copy under a choice's label.
 */
export interface QuestionnaireChoiceDescriptionProps extends React.ComponentProps<"span"> {}

/**
 * A free-text answer field for the active question.
 */
export interface QuestionnaireInputProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Input
> {}

/**
 * The validation message for the active question.
 */
export interface QuestionnaireErrorProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Error
> {}

/**
 * The navigation row — previous, skip, and next or submit.
 */
export interface QuestionnaireActionsProps extends React.ComponentProps<"div"> {}

/**
 * Goes back one question. Hidden on the first.
 */
export interface QuestionnairePreviousProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Previous
> {}

/**
 * Skips the active question. Only rendered for optional questions.
 */
export interface QuestionnaireSkipProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Skip
> {}

/**
 * Advances to the next question. Hidden on the last.
 */
export interface QuestionnaireNextProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Next
> {}

/**
 * Submits the form. Only rendered on the last question.
 */
export interface QuestionnaireSubmitProps extends React.ComponentProps<
  typeof QuestionnairePrimitive.Submit
> {}
