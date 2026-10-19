import { AbsoluteFill, Series, useCurrentFrame } from "remotion"

import { Agent, AGENT_FRAMES } from "./agent"
import { Catalog, CATALOG_FRAMES } from "./catalog"
import { Demos, DEMOS_FRAMES } from "./demos"
import { Export, EXPORT_FRAMES } from "./export"
import { GRID_FRAMES, GridStep } from "./grid"
import { Outro, OUTRO_FRAMES } from "./outro"

/* The whole film, storyboard v2: Create (the Grid step, up to its end
   screens), Every component, Your demos, Export, Agent ready, then the end
   screens. Create and the end screens are the morph thread's, used as they
   are. */

const CREATE_FRAMES = GRID_FRAMES - OUTRO_FRAMES

export const SCENES = [
  { id: "Create", frames: CREATE_FRAMES, Scene: GridStep },
  { id: "Catalog", frames: CATALOG_FRAMES, Scene: Catalog },
  { id: "Demos", frames: DEMOS_FRAMES, Scene: Demos },
  { id: "Export", frames: EXPORT_FRAMES, Scene: Export },
  { id: "Agent", frames: AGENT_FRAMES, Scene: Agent },
  { id: "End", frames: OUTRO_FRAMES, Scene: End },
] as const

export const STORY_FRAMES = SCENES.reduce((sum, s) => sum + s.frames, 0)

function End() {
  return <Outro frame={useCurrentFrame()} />
}

export function Story() {
  return (
    <AbsoluteFill>
      <Series>
        {SCENES.map(({ id, frames, Scene }) => (
          <Series.Sequence key={id} durationInFrames={frames} name={id}>
            <Scene />
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  )
}
