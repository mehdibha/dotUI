import "../styles.css"

import { Composition, registerRoot } from "remotion"

import { Film } from "../film"
import { FPS } from "../lib/timing"
import { Catalog, CATALOG_FRAMES } from "./catalog"
import { GRID_FRAMES, GridStep } from "./grid"
import { CardStep, RealCard, STEPS_FRAMES, STEPS_SIZE } from "./steps"

function Filmed() {
  return (
    <Film>
      <CardStep />
    </Film>
  )
}

function Grid() {
  return (
    <Film>
      <GridStep />
    </Film>
  )
}

function Real() {
  return (
    <Film>
      <RealCard />
    </Film>
  )
}

function Components() {
  return (
    <Film>
      <Catalog />
    </Film>
  )
}

registerRoot(() => (
  <>
    <Composition
      id="Catalog"
      component={Components}
      durationInFrames={CATALOG_FRAMES}
      fps={FPS}
      width={STEPS_SIZE.width}
      height={STEPS_SIZE.height}
    />
    <Composition
      id="Grid"
      component={Grid}
      durationInFrames={GRID_FRAMES}
      fps={FPS}
      width={STEPS_SIZE.width}
      height={STEPS_SIZE.height}
    />
    <Composition
      id="Steps"
      component={Filmed}
      durationInFrames={STEPS_FRAMES}
      fps={FPS}
      width={STEPS_SIZE.width}
      height={STEPS_SIZE.height}
    />
    {/* The real card at rest, to check the drawing against. */}
    <Composition
      id="Real"
      component={Real}
      durationInFrames={STEPS_FRAMES}
      fps={FPS}
      width={STEPS_SIZE.width}
      height={STEPS_SIZE.height}
    />
  </>
))
