import "../styles.css"

import { Composition, registerRoot } from "remotion"

import { Film } from "../film"
import { FPS } from "../lib/timing"
import { BackgroundStep, STEPS_FRAMES, STEPS_SIZE } from "./steps"

function Filmed() {
  return (
    <Film>
      <BackgroundStep />
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
