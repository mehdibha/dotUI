import { Theme } from "../lib/theme"
import { LogoOption, OPTION_FRAMES, OPTIONS } from "./logo-options"
import { Words } from "./shared"

/* The end: three screens cut in hard after the presets stop, each one's
   words cutting in one after another, the last one the logo
   (logo-options.tsx). */

/** Where each screen starts, from the outro's first frame. */
const SCREENS = [0, 120, 230] as const
export const OUTRO_FRAMES = SCREENS[2] + OPTION_FRAMES

/** The logo screen Mehdi picked: the dot growing into the mark. */
const DOT = OPTIONS.findIndex(([name]) => name === "dot")

/** The screen at `frame` frames into the outro. */
export function Outro({ frame }: { frame: number }) {
  const screen = SCREENS.filter((at) => frame >= at).length - 1
  const local = frame - SCREENS[screen]!
  return (
    <Theme mode="dark">
      <div className="absolute inset-0 flex items-center justify-center bg-bg">
        {screen === 0 && (
          <Words text="Build your design system." frame={local} size={64} />
        )}
        {screen === 1 && (
          <Words text="Free and open source." frame={local} size={64} />
        )}
        {screen === 2 && <LogoOption index={DOT} frame={local} />}
      </div>
    </Theme>
  )
}
