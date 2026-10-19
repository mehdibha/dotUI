import "../styles.css"

import { Composition, registerRoot } from "remotion"

import { Film } from "../film"
import { FPS } from "../lib/timing"
import { CardSurfaceStep, STEPS_FRAMES, STEPS_SIZE } from "./steps"

function Filmed() {
  return (
    <Film>
      <CardSurfaceStep />
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
