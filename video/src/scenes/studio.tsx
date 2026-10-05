import { AbsoluteFill, useCurrentFrame } from "remotion"

import { hold } from "../lib/motion"
import { StudioSet } from "../lib/set"
import { preset } from "../lib/theme"
import { at } from "../lib/timing"

/* The rig's proof shot: the real studio, switching preset on each bar. */
const LOOKS = [
  [at(0), "origin"],
  [at(1), "claude"],
  [at(2), "linear"],
  [at(3), "spotify"],
] as const

export function Studio() {
  const frame = useCurrentFrame()
  return (
    <AbsoluteFill>
      <StudioSet state={preset(hold(frame, LOOKS))} />
    </AbsoluteFill>
  )
}
