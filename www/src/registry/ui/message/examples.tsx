import { Example } from "@/modules/create/preview/example"
import { Examples } from "@/modules/create/preview/examples"

import Basic from "./demos/basic"
import Group from "./demos/group"
import Message from "./demos/message"

export default function MessageExamples() {
  return (
    <Examples>
      <Example title="Message">
        <Message />
      </Example>
      <Example title="Basic">
        <Basic />
      </Example>
      <Example title="Group">
        <Group />
      </Example>
    </Examples>
  )
}
