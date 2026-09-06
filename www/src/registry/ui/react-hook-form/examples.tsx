import { Example } from "@/modules/studio/preview/example"
import { Examples } from "@/modules/studio/preview/examples"

import Register from "./demos/register"

export default function ReactHookFormExamples() {
  return (
    <Examples>
      <Example title="register">
        <Register />
      </Example>
    </Examples>
  )
}
