import "../styles.css"

import { Composition, registerRoot } from "remotion"

import { Film } from "../film"
import { FPS } from "../lib/timing"
import { Catalog, CATALOG_FRAMES } from "./catalog"
import { Agent, AGENT_FRAMES } from "./agent"
import { Demos, DEMOS_FRAMES } from "./demos"
import { Export, EXPORT_FRAMES } from "./export"
import { GRID_FRAMES, GridStep } from "./grid"
import { CardStep, RealCard, STEPS_FRAMES, STEPS_SIZE } from "./steps"
import { Story, STORY_FRAMES } from "./story"

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

const filmed = (Scene: () => React.ReactNode) => () => (
  <Film>
    <Scene />
  </Film>
)
const scenes = [
  ["Story", Story, STORY_FRAMES],
  ["Demos", Demos, DEMOS_FRAMES],
  ["Export", Export, EXPORT_FRAMES],
  ["Agent", Agent, AGENT_FRAMES],
] as const
const filmedScenes = scenes.map(
  ([id, Scene, frames]) => [id, filmed(Scene), frames] as const,
)

registerRoot(() => (
  <>
    {filmedScenes.map(([id, component, frames]) => (
      <Composition
        key={id}
        id={id}
        component={component}
        durationInFrames={frames}
        fps={FPS}
        width={STEPS_SIZE.width}
        height={STEPS_SIZE.height}
      />
    ))}
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
