import { useCurrentFrame } from "remotion"

import { Stage } from "../lib/stage"
import { Headline } from "../lib/type"

export function Compose() {
  useCurrentFrame()
  return (
    <Stage>
      <Headline lines={[{ text: "Compose" }]} start={0} />
    </Stage>
  )
}
