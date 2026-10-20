import { ease, lerp, progress } from "../lib/motion"
import { STEPS_SIZE } from "./steps"

/* What the scenes after Create share: the look the viewer made (Create's
   hard stop lands on the first preset), the 1200×675 frame, and the line on
   screen, its words arriving like the end screens'. */

export const YOURS = "origin"

export const { width: W, height: H } = STEPS_SIZE

const WORD_EVERY = 6
const WORD_FOR = 18

/** One line, word by word from `frame` 0. */
export function Words({
  text,
  frame,
  size = 56,
}: {
  text: string
  frame: number
  size?: number
}) {
  return (
    <div
      className="font-semibold whitespace-nowrap text-fg"
      style={{ fontSize: size, letterSpacing: "-0.035em", lineHeight: 1.1 }}
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

/** A lower-third line over footage, on a fade to the page's ground. Each
    line in `lines` replaces the last from its frame on. */
export function Caption({
  frame,
  lines,
}: {
  frame: number
  lines: ReadonlyArray<readonly [at: number, text: string]>
}) {
  const current = lines.filter(([at]) => frame >= at).at(-1)
  if (!current) return null
  const [first] = lines[0]!
  return (
    <>
      <div
        className="absolute inset-x-0 bottom-0"
        style={{
          height: 300,
          opacity: progress(frame, first, WORD_FOR, ease.out),
          background:
            "linear-gradient(to bottom, transparent, var(--color-bg) 62%)",
        }}
      />
      <div className="absolute" style={{ left: 50, bottom: 48 }}>
        <Words key={current[0]} text={current[1]} frame={frame - current[0]} />
      </div>
    </>
  )
}
