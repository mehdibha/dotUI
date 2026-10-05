import { Sequence } from "remotion"

import { bars } from "./lib/timing"
import { SCENE_LIST } from "./scene-list"
import type { SceneId } from "./scene-list"
import { End } from "./scenes/end"
import { Open } from "./scenes/open"
import { Studio } from "./scenes/studio"

const COMPONENTS: Record<SceneId, React.ComponentType> = {
  Open,
  Studio,
  End,
}

/* The edit. Every cut lands on a downbeat; each scene also registers as its
   own composition for iteration. */
export const SCENES = SCENE_LIST.map((s) => ({
  ...s,
  component: COMPONENTS[s.id],
}))

export const LAUNCH_FRAMES = SCENES.reduce((n, s) => n + bars(s.bars), 0)

export function Launch() {
  let from = 0
  return (
    <>
      {SCENES.map(({ id, component: Scene, bars: length }) => {
        const start = from
        from += bars(length)
        return (
          <Sequence
            key={id}
            name={id}
            from={start}
            durationInFrames={bars(length)}
          >
            <Scene />
          </Sequence>
        )
      })}
    </>
  )
}
