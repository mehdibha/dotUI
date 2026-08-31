"use client"

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireItem,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/registry/ui/questionnaire"

export default function Demo() {
  return (
    <Questionnaire
      className="w-full max-w-md"
      onSubmit={(event) => {
        event.preventDefault()
      }}
    >
      <QuestionnaireItem name="plan" required>
        <QuestionnaireTitle>Pick a plan</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="free">
            Free
            <QuestionnaireChoiceDescription>
              One design system, community support.
            </QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="pro">
            Pro
            <QuestionnaireChoiceDescription>
              Unlimited systems, custom presets, priority support.
            </QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  )
}
