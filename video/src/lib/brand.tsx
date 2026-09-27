import type { CSSProperties } from "react"

import { HEADLINE } from "./type"
import { LETTERS, LOCKUP } from "./wordmark"

/* The brand, drawn once for the whole film: the mark (a rounded square, rx 12
   of 100, with its dot — r 11 at 75,75) and the real wordmark path. On the
   dark ground the square is white and the dot ink. Scenes animate these by
   passing props; they never redraw the logo. */

export const INK_DOT = "#381e1e"

export function Mark({
  size,
  dot = 1,
  round = 0.12,
  color = "#fff",
  style,
}: {
  /** Side in px. */
  size: number
  /** Dot scale (0 hides it). */
  dot?: number
  /** Corner radius as a fraction of the side (0.5 = the dot it grows from). */
  round?: number
  color?: string
  style?: CSSProperties
}) {
  const k = size / 100
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        borderRadius: size * round,
        background: color,
        overflow: "hidden",
        flexShrink: 0,
        ...style,
      }}
    >
      {dot > 0 ? (
        <div
          style={{
            position: "absolute",
            left: 64 * k,
            top: 64 * k,
            width: 22 * k,
            height: 22 * k,
            borderRadius: "50%",
            background: INK_DOT,
            transform: `scale(${dot})`,
          }}
        />
      ) : null}
    </div>
  )
}

/** The "dotUI" wordmark at `height` px (the mark's height in the lockup). */
export function Wordmark({
  height,
  color = "#fff",
  letterOffset,
}: {
  height: number
  color?: string
  /** Per-letter x offset in wordmark units (animate letters in/out). */
  letterOffset?: (index: number) => number
}) {
  const k = height / LOCKUP.height
  const x0 = LETTERS[0]!.x0
  const x1 = LETTERS[LETTERS.length - 1]!.x1
  return (
    <svg
      viewBox={`${x0} 0 ${x1 - x0} ${LOCKUP.height}`}
      width={(x1 - x0) * k}
      height={height}
      style={{ overflow: "visible", flexShrink: 0 }}
    >
      <g fill={color}>
        {LETTERS.map((letter, i) => (
          <path
            key={letter.char}
            d={letter.d}
            fillRule="evenodd"
            transform={
              letterOffset
                ? `translate(${letterOffset(i).toFixed(3)} 0)`
                : undefined
            }
          />
        ))}
      </g>
    </svg>
  )
}

/** Mark + wordmark (+ "Studio" in the headline voice), laid out like the
 *  brand file: the word starts 43 units after the mark. */
export function Lockup({
  height,
  studio = false,
  style,
}: {
  height: number
  studio?: boolean
  style?: CSSProperties
}) {
  const k = height / LOCKUP.height
  return (
    <div style={{ display: "flex", alignItems: "center", ...style }}>
      <Mark size={height} />
      <div style={{ width: 43 * k }} />
      <Wordmark height={height} />
      {studio ? (
        <span
          style={{
            ...HEADLINE,
            fontSize: height * 0.62,
            marginLeft: height * 0.22,
            transform: `translateY(${height * 0.08}px)`,
          }}
        >
          Studio
        </span>
      ) : null}
    </div>
  )
}
