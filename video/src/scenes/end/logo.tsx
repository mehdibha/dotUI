import { Easing } from "remotion"

import { Mark, Wordmark } from "../../lib/brand"
import { clamp01, ease, lerp, pulse, springAt } from "../../lib/motion"
import { LETTERS, LOCKUP } from "../../lib/wordmark"
import { CX, CY, T } from "./timeline"

/* The dot becomes the brand, drawn with lib/brand: the white dot swells and
   squares off into the mark, its ink dot punches in, then the wordmark
   slides out from behind it and the lockup rises into the end card. */

/** Mark side while it's alone, and in the settled lockup. */
export const HERO = 232
export const FINAL = 184
/** The settled lockup's centre sits this far above the frame's. */
export const RISE = 112

const quint = Easing.bezier(0.22, 1, 0.36, 1)
const grow = { damping: 16, stiffness: 95, mass: 1 }
/** Mark centre → lockup centre, in wordmark units. */
const SHIFT = LOCKUP.width / 2 - 50
const WORD_X0 = LETTERS[0].x0

export function markAt(frame: number) {
  let size: number
  // Pops in on the cut, swells as the cast falls in, draws in before the hit.
  if (frame < T.impact - 8)
    size = lerp(0, 8, springAt(frame, -3, "pop")) + 9 * (frame / T.impact) ** 2
  else if (frame < T.impact)
    size = lerp(
      8 + 9 * ((T.impact - 8) / T.impact) ** 2,
      9,
      ease.in((frame - T.impact + 8) / 8),
    )
  else if (frame < T.grow) size = lerp(9, 28, springAt(frame, T.impact, "pop"))
  else size = lerp(28, HERO, springAt(frame, T.grow, grow))
  const toFinal = ease.inOut(clamp01((frame - T.word) / 48))
  size *= lerp(1, FINAL / HERO, toFinal)
  // The ink dot's arrival knocks the square back a hair.
  if (frame >= T.punch) size *= 1 - 0.045 * pulse((frame - T.punch) * 1.4)

  const round = lerp(0.5, 0.12, ease.inOut(clamp01((frame - T.grow - 4) / 34)))
  const rotate =
    frame < T.grow ? 0 : lerp(-24, 0, springAt(frame, T.grow, grow))
  const k = size / 100
  const x = CX - SHIFT * k * toFinal
  const y = CY - RISE * ease.camera(clamp01((frame - T.rise) / 50))
  const dot =
    frame < T.punch
      ? 0
      : springAt(frame, T.punch, { damping: 11, stiffness: 210, mass: 0.6 }) *
        (1 +
          T.pulses.reduce(
            (a, p, i) => a + (0.22 - i * 0.05) * pulse(frame - p),
            0,
          ))
  // Centre of the whole lockup — where the light sits once the word is out.
  const cx = x + SHIFT * k * toFinal
  return { x, y, cx, size, k, round, rotate, dot }
}

export type MarkPose = ReturnType<typeof markAt>

export function EndMark({ pose }: { pose: MarkPose }) {
  const { x, y, size, round, rotate, dot } = pose
  return (
    <Mark
      size={size}
      dot={dot}
      round={round}
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        transform: rotate ? `rotate(${rotate.toFixed(3)}deg)` : undefined,
        boxShadow: `0 0 ${Math.max(10, size * 0.28).toFixed(1)}px rgba(255,255,255,0.08)`,
      }}
    />
  )
}

/** The wordmark, clipped at the mark's right edge so it slides out from behind it. */
export function EndWordmark({
  pose,
  frame,
}: {
  pose: MarkPose
  frame: number
}) {
  if (frame < T.word) return null
  const { x, y, k, size } = pose
  const OFF = 240
  const left = x - size / 2 + 102 * k
  return (
    <div
      style={{
        position: "absolute",
        left,
        top: y - size / 2 - 20 * k,
        width: 260 * k,
        height: 140 * k,
        overflow: "hidden",
        maskImage: `linear-gradient(90deg, transparent 0, #000 ${(11 * k).toFixed(2)}px)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: (WORD_X0 - 102) * k,
          top: 20 * k,
        }}
      >
        <Wordmark
          height={size}
          letterOffset={(i) =>
            -OFF *
            (1 -
              quint(clamp01((frame - T.word - (LETTERS.length - 1 - i)) / 44)))
          }
        />
      </div>
    </div>
  )
}
