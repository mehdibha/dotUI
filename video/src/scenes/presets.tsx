import { useCurrentFrame } from "remotion"

import { Stage } from "../lib/stage"
import { Headline } from "../lib/type"

export function Presets() {
  useCurrentFrame()
  return (
    <Stage>
      <Headline lines={[{ text: "Presets" }]} start={0} />
    </Stage>
  )
}
