import { Easing } from "remotion"

import { clamp01, ease, lerp, springAt } from "../../lib/motion"
import { CX, CY, T } from "./timeline"
import { LETTERS } from "./wordmark"

/* The dot becomes the logo: the white dot grows and squares off into the
   mark, the dark dot punches in at its lower right, then the wordmark slides
   out from behind it and the lockup settles into the end card. */

export const HERO = 232
export const FINAL = 172
export const RISE = 93
export const INK_DOT = "#381e1e"

const quint = Easing.bezier(0.22, 1, 0.36, 1)

/** A beat's heartbeat: 0 → 1 at `d` = 5 frames → back to ~0 by 24. */
export function pulse(d: number) {
  if (d < 0) return 0
  return (d / 5) * Math.exp(1 - d / 5)
}

export function markAt(frame: number) {
  let size: number
  // The core swells as the cast falls in, then draws in on itself before the hit.
  if (frame < T.impact - 8) size = lerp(6, 17, (frame / (T.impact - 8)) ** 2)
  else if (frame < T.impact)
    size = lerp(17, 9, ease.in((frame - T.impact + 8) / 8))
  else if (frame < T.grow) size = lerp(9, 28, springAt(frame, T.impact, "pop"))
  else
    size = lerp(
      28,
      HERO,
      springAt(frame, T.grow, { damping: 16, stiffness: 95, mass: 1 }),
    )
  const toFinal = ease.inOut(clamp01((frame - T.word) / 48))
  size *= lerp(1, FINAL / HERO, toFinal)
  // The punch knocks the square back a hair.
  const recoil = frame >= T.punch ? 0.045 * pulse((frame - T.punch) * 1.4) : 0
  size *= 1 - recoil

  const round = lerp(0.5, 0.12, ease.inOut(clamp01((frame - T.grow - 4) / 34)))
  const rotate =
    frame < T.grow
      ? 0
      : lerp(
          -24,
          0,
          springAt(frame, T.grow, { damping: 16, stiffness: 95, mass: 1 }),
        )
  const k = size / 100
  const x = CX - 115.5 * k * toFinal
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
  // Center of the whole lockup — where the light should sit once the word is out.
  const cx = x + 115.5 * k * toFinal
  return { x, y, cx, size, k, round, rotate, dot }
}

export type MarkPose = ReturnType<typeof markAt>

export function Mark({ pose }: { pose: MarkPose }) {
  const { x, y, size, round, rotate, dot, k } = pose
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        borderRadius: size * round,
        background: "#fff",
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        overflow: "hidden",
        boxShadow: `0 0 ${Math.max(10, size * 0.28)}px rgba(255,255,255,0.08)`,
      }}
    >
      {dot > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 75 * k,
            top: 75 * k,
            width: 22 * k,
            height: 22 * k,
            marginLeft: -11 * k,
            marginTop: -11 * k,
            borderRadius: "50%",
            background: INK_DOT,
            transform: `scale(${dot})`,
          }}
        />
      ) : null}
    </div>
  )
}

/** The wordmark, clipped at the mark's right edge so it slides out from behind it. */
export function Wordmark({ pose, frame }: { pose: MarkPose; frame: number }) {
  if (frame < T.word) return null
  const { x, y, k } = pose
  const OFF = 240
  return (
    <svg
      viewBox="0 0 331 100"
      width={331 * k}
      height={100 * k}
      style={{
        position: "absolute",
        left: x - 50 * k,
        top: y - 50 * k,
        overflow: "visible",
      }}
    >
      <defs>
        <linearGradient
          id="end-wordmark-edge"
          gradientUnits="userSpaceOnUse"
          x1={102}
          x2={113}
        >
          <stop offset="0" stopColor="#fff" stopOpacity={0} />
          <stop offset="1" stopColor="#fff" stopOpacity={1} />
        </linearGradient>
        <mask id="end-wordmark-mask" maskUnits="userSpaceOnUse">
          <rect
            x={102}
            y={-40}
            width={400}
            height={180}
            fill="url(#end-wordmark-edge)"
          />
        </mask>
      </defs>
      <g mask="url(#end-wordmark-mask)" fill="#fff">
        {LETTERS.map((letter, i) => {
          const e = quint(
            clamp01((frame - T.word - (LETTERS.length - 1 - i)) / 44),
          )
          return (
            <path
              key={letter.char}
              d={letter.d}
              fillRule="evenodd"
              transform={`translate(${(-OFF * (1 - e)).toFixed(3)} 0)`}
            />
          )
        })}
      </g>
    </svg>
  )
}
