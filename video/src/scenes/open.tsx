import { useCurrentFrame } from "remotion"

import { Stage } from "../lib/stage"
import { Headline } from "../lib/type"

export function Open() {
  useCurrentFrame()
  return (
    <Stage>
      <Headline lines={[{ text: "Open" }]} start={0} />
    </Stage>
  )
}
