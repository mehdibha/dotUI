"use client"

import {
  Questionnaire,
  QuestionnaireActions,
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
} from "@/registry/ui/questionnaire"

export default function Demo() {
  return (
    <Questionnaire
      className="w-full max-w-md"
      onSubmit={(event) => {
        event.preventDefault()
      }}
    >
      <QuestionnaireProgress />
      <QuestionnaireItem name="email" required>
        <QuestionnaireTitle>What's your work email?</QuestionnaireTitle>
        <QuestionnaireDescription>
          We'll send the invite there.
        </QuestionnaireDescription>
        <QuestionnaireInput type="email" placeholder="you@company.com" />
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="team">
        <QuestionnaireTitle>What's your team called?</QuestionnaireTitle>
        <QuestionnaireInput type="text" placeholder="Acme design systems" />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireSkip />
        <QuestionnaireNext />
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  )
}
