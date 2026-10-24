import { BEAT } from "../lib/timing"
import { STEPS_SIZE } from "./steps"

/* What the scenes after Create share: the look the viewer made (Create's
   hard stop lands on the first preset), the 1200×675 frame, and the line on
   screen, its words cutting in like the end screens'. */

export const YOURS = "origin"

export const { width: W, height: H } = STEPS_SIZE

/** Words cut in one by one, on every half beat. */
const WORD_EVERY = BEAT / 2

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
      {text.split(" ").map((word, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            marginRight: "0.25em",
            opacity: frame >= i * WORD_EVERY ? 1 : 0,
          }}
        >
          {word}
        </span>
      ))}
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
          opacity: frame >= first ? 1 : 0,
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
