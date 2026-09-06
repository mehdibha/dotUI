import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

import Basic from "./demos/basic"

export default function LoaderExamples() {
  return (
    <Examples>
      <Example title="basic">
        <Basic />
      </Example>
    </Examples>
  )
}
