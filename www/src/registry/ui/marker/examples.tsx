import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

import Basic from "./demos/basic"
import Border from "./demos/border"
import Marker from "./demos/marker"
import Separator from "./demos/separator"

export default function MarkerExamples() {
  return (
    <Examples>
      <Example title="Basic">
        <Basic />
      </Example>
      <Example title="Separator">
        <Separator />
      </Example>
      <Example title="Border">
        <Border />
      </Example>
      <Example title="Marker">
        <Marker />
      </Example>
    </Examples>
  )
}
