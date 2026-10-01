import type { CSSProperties } from "react"
import { useCurrentFrame } from "remotion"

import { ease, lerp, progress } from "../../lib/motion"
import { BlurWords, HEADLINE, MUTED, TYPE } from "../../lib/type"
import { T } from "./timeline"

export const LINE_1 = "Every product is built on"
export const LINE_2 = ["a", "design", "system"]

const marker: CSSProperties = { display: "inline-block", width: 0, height: 0 }

/** The two lines, laid out as one sentence ending in a real (invisible)
 *  period — the dot takes its place. Line 2's words resolve where the dot has
 *  just passed (`starts`, frames). `probe` renders the same layout, unseen. */
export function Sentence({
  top,
  starts,
  wipe = null,
  probe = false,
}: {
  top: number
  starts?: readonly number[]
  /** Line 2 shows left of this x (layout px), with a soft edge. */
  wipe?: number | null
  probe?: boolean
}) {
  const mask =
    wipe === null
      ? undefined
      : `linear-gradient(90deg, #000 ${(wipe - 44).toFixed(1)}px, transparent ${wipe.toFixed(1)}px)`
  return (
    <div
      style={{
        ...HEADLINE,
        position: "absolute",
        left: 0,
        right: 0,
        top,
        fontSize: TYPE.statement,
        textAlign: "center",
        whiteSpace: "nowrap",
      }}
    >
      <div>
        <span data-base1 style={marker} />
        <BlurWords
          text={LINE_1}
          start={probe ? Number.MAX_SAFE_INTEGER : T.line1}
          end={probe ? undefined : T.out}
          stagger={4}
        />
      </div>
      <div style={{ color: MUTED, maskImage: mask }}>
        {LINE_2.map((word, i) => (
          <Word key={word} start={probe ? null : (starts?.[i] ?? T.sweep)}>
            {i < LINE_2.length - 1 ? `${word} ` : word}
          </Word>
        ))}
        <span style={{ color: "transparent" }}>
          <span data-pen style={marker} />.
        </span>
      </div>
    </div>
  )
}

/** BlurWords' look, one word at a time on its own start (the wipe reveals,
 *  the blur resolves). */
function Word({ start, children }: { start: number | null; children: string }) {
  const frame = useCurrentFrame()
  const t = start === null ? 0 : progress(frame, start, 24, ease.out)
  const out = progress(frame, T.out, 14, ease.in)
  const blur = lerp(10, 0, t) + out * 14
  return (
    <span
      data-word
      style={{
        display: "inline-block",
        whiteSpace: "pre",
        opacity: t * (1 - out),
        filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined,
      }}
    >
      {children}
    </span>
  )
}
