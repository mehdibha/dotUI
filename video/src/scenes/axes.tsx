import { useCurrentFrame } from "remotion"

import { Stage } from "../lib/stage"
import { Headline } from "../lib/type"

export function Axes() {
  useCurrentFrame()
  return (
    <Stage>
      <Headline lines={[{ text: "Axes" }]} start={0} />
    </Stage>
  )
}
