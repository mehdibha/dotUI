import { Sequence } from "remotion"

import { bars } from "./lib/timing"
import { Axes } from "./scenes/axes"
import { Compose } from "./scenes/compose"
import { End } from "./scenes/end"
import { Export } from "./scenes/export"
import { Open } from "./scenes/open"
import { Patterns } from "./scenes/patterns"
import { Presets } from "./scenes/presets"
import { Wall } from "./scenes/wall"

/* The edit. Lengths are in bars (2 s at 120 BPM); every cut lands on a
   downbeat. Each scene also registers as its own composition for iteration. */
export const SCENES = [
  { id: "Open", component: Open, bars: 2 },
  { id: "Wall", component: Wall, bars: 3 },
  { id: "Axes", component: Axes, bars: 9 },
  { id: "Presets", component: Presets, bars: 3 },
  { id: "Compose", component: Compose, bars: 4 },
  { id: "Patterns", component: Patterns, bars: 4 },
  { id: "Export", component: Export, bars: 3 },
  { id: "End", component: End, bars: 3 },
] as const

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
