import { Example } from "@/modules/create/preview/example"
import { Examples } from "@/modules/create/preview/examples"

import Basic from "./demos/basic"
import MessageScroller from "./demos/message-scroller"

export default function MessageScrollerExamples() {
  return (
    <Examples>
      <Example title="Basic">
        <Basic />
      </Example>
      <Example title="Message scroller">
        <MessageScroller />
      </Example>
    </Examples>
  )
}
