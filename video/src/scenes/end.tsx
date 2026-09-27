import { useCurrentFrame } from "remotion"

import { Stage } from "../lib/stage"
import { Headline } from "../lib/type"

export function End() {
  useCurrentFrame()
  return (
    <Stage>
      <Headline lines={[{ text: "End" }]} start={0} />
    </Stage>
  )
}
