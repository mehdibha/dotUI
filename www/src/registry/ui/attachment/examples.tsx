import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

import Attachment from "./demos/attachment"
import Group from "./demos/group"
import Sizes from "./demos/sizes"
import States from "./demos/states"
import Vertical from "./demos/vertical"

export default function AttachmentExamples() {
  return (
    <Examples>
      <Example title="Attachment">
        <Attachment />
      </Example>
      <Example title="States">
        <States />
      </Example>
      <Example title="Sizes">
        <Sizes />
      </Example>
      <Example title="Vertical">
        <Vertical />
      </Example>
      <Example title="Group">
        <Group />
      </Example>
    </Examples>
  )
}
