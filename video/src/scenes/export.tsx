import { useCurrentFrame } from "remotion"

import { Stage } from "../lib/stage"
import { Headline } from "../lib/type"

export function Export() {
  useCurrentFrame()
  return (
    <Stage>
      <Headline lines={[{ text: "Export" }]} start={0} />
    </Stage>
  )
}
