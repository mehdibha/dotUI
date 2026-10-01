import "./styles.css"

import { Composition } from "remotion"

import { Film } from "./film"
import { Launch, LAUNCH_FRAMES, SCENES } from "./launch"
import { bars, FPS, HEIGHT, WIDTH } from "./lib/timing"

const inFilm = (Component: React.ComponentType) =>
  function Filmed() {
    return (
      <Film>
        <Component />
      </Film>
    )
  }

const FilmedLaunch = inFilm(Launch)
const FILMED = SCENES.map((s) => ({ ...s, filmed: inFilm(s.component) }))

export function Root() {
  return (
    <>
      <Composition
        id="Launch"
        component={FilmedLaunch}
        durationInFrames={LAUNCH_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      {FILMED.map((s) => (
        <Composition
          key={s.id}
          id={s.id}
          component={s.filmed}
          durationInFrames={bars(s.bars)}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
        />
      ))}
    </>
  )
}
