import { Example } from "@/modules/create/preview/example"
import { Examples } from "@/modules/create/preview/examples"

import Basic from "./demos/basic"
import Chat from "./demos/chat"
import PromptInputDemo from "./demos/prompt-input"
import WithAvatars from "./demos/with-avatars"
import WithToolbar from "./demos/with-toolbar"

export default function ChatExamples() {
  return (
    <Examples>
      <Example title="Conversation">
        <Basic />
      </Example>
      <Example title="With avatars">
        <WithAvatars />
      </Example>
      <Example title="Prompt input">
        <PromptInputDemo />
      </Example>
      <Example title="With toolbar">
        <WithToolbar />
      </Example>
      <Example title="Chat">
        <Chat />
      </Example>
    </Examples>
  )
}
