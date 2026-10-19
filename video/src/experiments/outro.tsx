import { ease, lerp, progress } from "../lib/motion"
import { Theme } from "../lib/theme"
import { LogoOption, OPTION_FRAMES, OPTIONS } from "./logo-options"

/* The end: three screens cut in hard after the presets stop, each one's
   words arriving one after another, the last one the logo (logo-options.tsx). */

const WORD_EVERY = 6
const WORD_FOR = 18

/** Where each screen starts, from the outro's first frame. */
const SCREENS = [0, 120, 230] as const
export const OUTRO_FRAMES = SCREENS[2] + OPTION_FRAMES

/** The logo screen Mehdi picked: the dot growing into the mark. */
const DOT = OPTIONS.findIndex(([name]) => name === "dot")

function Words({ text, frame }: { text: string; frame: number }) {
  return (
    <div
      className="font-semibold text-fg"
      style={{ fontSize: 64, letterSpacing: "-0.035em", lineHeight: 1.1 }}
    >
      {text.split(" ").map((word, i) => {
        const p = progress(frame, i * WORD_EVERY, WORD_FOR, ease.out)
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              marginRight: "0.25em",
              opacity: p,
              transform: `translateY(${lerp(0.3, 0, p)}em)`,
              filter: `blur(${lerp(12, 0, p)}px)`,
            }}
          >
            {word}
          </span>
        )
      })}
    </div>
  )
}

/** The screen at `frame` frames into the outro. */
export function Outro({ frame }: { frame: number }) {
  const screen = SCREENS.filter((at) => frame >= at).length - 1
  const local = frame - SCREENS[screen]!
  return (
    <Theme mode="dark">
      <div className="absolute inset-0 flex items-center justify-center bg-bg">
        {screen === 0 && (
          <Words text="Build your design system." frame={local} />
        )}
        {screen === 1 && <Words text="Free and open source." frame={local} />}
        {screen === 2 && <LogoOption index={DOT} frame={local} />}
      </div>
    </Theme>
  )
}
