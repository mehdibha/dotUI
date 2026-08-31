"use client"

import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/registry/ui/questionnaire"

export default function Demo() {
  return (
    <Questionnaire
      shortcuts="letters"
      className="w-full max-w-md"
      onSubmit={(event) => {
        event.preventDefault()
      }}
    >
      <QuestionnaireProgress />
      <QuestionnaireItem name="role" required>
        <QuestionnaireTitle>What best describes your role?</QuestionnaireTitle>
        <QuestionnaireDescription>
          This helps us tailor the onboarding.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="designer">Designer</QuestionnaireChoice>
          <QuestionnaireChoice value="engineer">Engineer</QuestionnaireChoice>
          <QuestionnaireChoice value="founder">Founder</QuestionnaireChoice>
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireItem name="tools" multiple>
        <QuestionnaireTitle>Which tools do you use today?</QuestionnaireTitle>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="figma">Figma</QuestionnaireChoice>
          <QuestionnaireChoice value="storybook">Storybook</QuestionnaireChoice>
          <QuestionnaireChoice value="tailwind">
            Tailwind CSS
          </QuestionnaireChoice>
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireNext />
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  )
}
