import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

import Basic from "./demos/basic"
import ReactAria from "./demos/react-aria"

export default function FormExamples() {
  return (
    <Examples>
      <Example title="basic">
        <Basic />
      </Example>
      <Example title="react aria">
        <ReactAria />
      </Example>
    </Examples>
  )
}
