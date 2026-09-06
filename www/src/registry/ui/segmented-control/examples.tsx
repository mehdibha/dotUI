import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

import Default from "./demos/default"
import WithIcons from "./demos/with-icons"

export default function SegmentedControlExamples() {
  return (
    <Examples className="grid-cols-1">
      <Example title="default">
        <Default />
      </Example>
      <Example title="with icons">
        <WithIcons />
      </Example>
    </Examples>
  )
}
