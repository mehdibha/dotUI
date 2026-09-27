import type { CSSProperties, ReactNode } from "react"
import { AbsoluteFill } from "remotion"

/* The film's ground: near-black, a faint dot grid (the brand's dot), and a
   vignette that keeps the eye centered. Scenes sit on it; light scenes pass
   `tone="light"`. */

export const INK = "#08080a"
export const PAPER = "#fafafa"

export function Stage({
  children,
  tone = "dark",
  grid = true,
  gridOffset = [0, 0],
  gridScale = 1,
  gridOpacity = 1,
  vignette = true,
  style,
}: {
  children?: ReactNode
  tone?: "dark" | "light"
  grid?: boolean
  /** Pan the grid (px) — move it with the camera so the ground reads as space. */
  gridOffset?: [number, number]
  gridScale?: number
  gridOpacity?: number
  /** Off when a light product surface fills the frame (it would grey its corners). */
  vignette?: boolean
  style?: CSSProperties
}) {
  const dark = tone === "dark"
  const size = 28 * gridScale
  return (
    <AbsoluteFill
      style={{ background: dark ? INK : PAPER, overflow: "hidden", ...style }}
    >
      {grid ? (
        <AbsoluteFill
          style={{
            opacity: gridOpacity,
            backgroundImage: `radial-gradient(${dark ? "rgba(255,255,255,0.11)" : "rgba(0,0,0,0.13)"} ${1.1 * gridScale}px, transparent ${1.3 * gridScale}px)`,
            backgroundSize: `${size}px ${size}px`,
            // Phase-centred: a dot sits exactly on (960, 540).
            backgroundPosition: `calc(50% + ${gridOffset[0]}px) calc(50% + ${gridOffset[1]}px)`,
            maskImage:
              "radial-gradient(ellipse 75% 70% at 50% 50%, black 30%, transparent 100%)",
          }}
        />
      ) : null}
      {children}
      <AbsoluteFill
        style={{
          display: vignette ? undefined : "none",
          pointerEvents: "none",
          background: dark
            ? "radial-gradient(ellipse 90% 80% at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)"
            : "radial-gradient(ellipse 90% 80% at 50% 45%, transparent 60%, rgba(0,0,0,0.06) 100%)",
        }}
      />
    </AbsoluteFill>
  )
}

/**
 * A 3D camera: children live on a plane you can rotate and push through.
 * `x`/`y` pan the plane (px), `z` pushes it toward the viewer (px, positive =
 * closer), rotations in degrees. Perspective is long by default so tilts read
 * as graceful, not fish-eye.
 */
export function Camera({
  children,
  x = 0,
  y = 0,
  z = 0,
  scale = 1,
  rotateX = 0,
  rotateY = 0,
  rotateZ = 0,
  perspective = 2600,
  origin = "50% 50%",
  style,
}: {
  children: ReactNode
  x?: number
  y?: number
  z?: number
  scale?: number
  rotateX?: number
  rotateY?: number
  rotateZ?: number
  perspective?: number
  origin?: string
  style?: CSSProperties
}) {
  return (
    <AbsoluteFill
      style={{ perspective, perspectiveOrigin: "50% 50%", ...style }}
    >
      <AbsoluteFill
        style={{
          transformStyle: "preserve-3d",
          transformOrigin: origin,
          transform: `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

/** Absolutely placed, centered box — `x`/`y` are the box's center in px. */
export function Place({
  x,
  y,
  width,
  height,
  children,
  style,
}: {
  x: number
  y: number
  width?: number
  height?: number
  children: ReactNode
  style?: CSSProperties
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        transform: "translate(-50%, -50%)",
        ...style,
      }}
    >
      {children}
    </div>
  )
}
