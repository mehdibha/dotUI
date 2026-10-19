import "../styles.css"

import { Composition, registerRoot } from "remotion"

import { Film } from "../film"
import { FPS } from "../lib/timing"
import { CardStep, STEPS_FRAMES, STEPS_SIZE } from "./steps"

function Filmed() {
  return (
    <Film>
      <CardStep />
    </Film>
  )
}

registerRoot(() => (
  <Composition
    id="Steps"
    component={Filmed}
    durationInFrames={STEPS_FRAMES}
    fps={FPS}
    width={STEPS_SIZE.width}
    height={STEPS_SIZE.height}
  />
))
