import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

import Basic from "./demos/basic"
import Sections from "./demos/sections"
import Selection from "./demos/selection"

export default function ListExamples() {
  return (
    <Examples className="md:grid-cols-2">
      <Example title="basic">
        <Basic />
      </Example>
      <Example title="sections">
        <Sections />
      </Example>
      <Example title="selection">
        <Selection />
      </Example>
    </Examples>
  )
}
