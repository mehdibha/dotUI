import { useCurrentFrame } from "remotion"

import { Stage } from "../lib/stage"
import { Headline } from "../lib/type"

export function Patterns() {
  useCurrentFrame()
  return (
    <Stage>
      <Headline lines={[{ text: "Patterns" }]} start={0} />
    </Stage>
  )
}
