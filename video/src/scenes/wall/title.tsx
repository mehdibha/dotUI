import { useCurrentFrame } from "remotion"

import { clamp01, lerp, springAt } from "../../lib/motion"
import { BlurWords, HEADLINE } from "../../lib/type"

/* The title card: the dotUI mark (www/public/brand/dotui-logo-white.svg — a
   rounded square, rx 12/100, its dot at 75,75 r 11) beside "dotUI Studio". */

export const INK_DOT = "#381e1e"

export function Mark({
  size,
  dot = 1,
  style,
}: {
  size: number
  /** Dot scale (0 = no dot). */
  dot?: number
  style?: React.CSSProperties
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{ display: "block", overflow: "visible", ...style }}
    >
      <rect width={100} height={100} rx={12} fill="#fff" />
      <circle cx={75} cy={75} r={11 * dot} fill={INK_DOT} />
    </svg>
  )
}

export function Title({ start }: { start: number }) {
  const frame = useCurrentFrame()
  const pop = springAt(frame, start, { damping: 15, stiffness: 140, mass: 0.8 })
  const dot = springAt(frame, start + 10, {
    damping: 10,
    stiffness: 220,
    mass: 0.5,
  })
  const size = 124
  const fade = clamp01(pop * 1.6)
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 40,
        pointerEvents: "none",
      }}
    >
      <Mark
        size={size}
        dot={dot}
        style={{
          opacity: fade,
          transform: `scale(${lerp(0.55, 1, pop)}) rotate(${lerp(-14, 0, pop)}deg)`,
          filter: pop < 0.98 ? `blur(${(1 - clamp01(pop)) * 10}px)` : undefined,
          boxShadow: "none",
        }}
      />
      <div style={{ ...HEADLINE, fontSize: 140, lineHeight: 1 }}>
        <BlurWords text="dotUI Studio" start={start + 8} stagger={6} />
      </div>
    </div>
  )
}
