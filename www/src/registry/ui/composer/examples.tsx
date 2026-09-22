import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

import Basic from "./demos/basic"
import Streaming from "./demos/streaming"

export default function ComposerExamples() {
  return (
    <Examples className="md:grid-cols-2">
      <Example title="basic">
        <Basic />
      </Example>
      <Example title="streaming">
        <Streaming />
      </Example>
    </Examples>
  )
}
