import { Example } from "@/modules/create/preview/example"
import { Examples } from "@/modules/create/preview/examples"

import Bubble from "./demos/bubble"
import Reactions from "./demos/reactions"
import Variants from "./demos/variants"

export default function BubbleExamples() {
  return (
    <Examples>
      <Example title="Bubble">
        <Bubble />
      </Example>
      <Example title="Variants">
        <Variants />
      </Example>
      <Example title="Reactions">
        <Reactions />
      </Example>
    </Examples>
  )
}
