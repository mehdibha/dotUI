import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

import Questionnaire from "./demos/questionnaire"
import WithDescriptions from "./demos/with-descriptions"
import WithInput from "./demos/with-input"

export default function QuestionnaireExamples() {
  return (
    <Examples>
      <Example title="Questionnaire">
        <Questionnaire />
      </Example>
      <Example title="With input">
        <WithInput />
      </Example>
      <Example title="With descriptions">
        <WithDescriptions />
      </Example>
    </Examples>
  )
}
