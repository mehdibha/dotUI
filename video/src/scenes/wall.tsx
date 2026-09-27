import { useCurrentFrame } from "remotion"

import { Stage } from "../lib/stage"
import { Headline } from "../lib/type"

export function Wall() {
  useCurrentFrame()
  return (
    <Stage>
      <Headline lines={[{ text: "Wall" }]} start={0} />
    </Stage>
  )
}
