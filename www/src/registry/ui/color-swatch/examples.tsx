import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

import Default from "./demos/default"

export default function ColorSwatchExamples() {
  return (
    <Examples>
      <Example title="default">
        <Default />
      </Example>
    </Examples>
  )
}
