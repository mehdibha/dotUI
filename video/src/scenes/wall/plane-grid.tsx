import type { CSSProperties } from "react"

import { clamp01, ease, progress } from "../../lib/motion"
import { SPEED, T } from "./timeline"

const W = 6400
const H = 4400
const PITCH = 36

/**
 * The brand's dot grid on the wall's plane, so the ground tilts with the
 * camera; the ripple runs through it as a ring of lit dots. Lives in plane
 * px centered on the anchor; `zoom` is the wall's layout zoom, so every
 * length is wall px × zoom.
 */
export function PlaneGrid({ frame, zoom }: { frame: number; zoom: number }) {
  const o = progress(frame, T.click, 50, ease.out)
  if (o <= 0) return null
  const age = frame - T.click
  const r = (age * SPEED + 30) * zoom
  const wave = 1 - clamp01(age / 110)
  const pitch = PITCH * zoom
  const dots = (alpha: number, size: number) =>
    `radial-gradient(circle, rgba(255,255,255,${alpha}) ${size * zoom}px, transparent ${(size + 0.6) * zoom}px)`
  const layer: CSSProperties = {
    position: "absolute",
    left: 960 - W / 2,
    top: 540 - H / 2,
    width: W,
    height: H,
    backgroundSize: `${pitch}px ${pitch}px`,
    backgroundPosition: `${(W / 2 - pitch / 2) % pitch}px ${(H / 2 - pitch / 2) % pitch}px`,
    pointerEvents: "none",
  }
  return (
    <>
      <div
        style={{
          ...layer,
          opacity: o,
          backgroundImage: dots(0.11, 1.3),
          maskImage: `radial-gradient(circle at 50% 50%, black ${900 * zoom}px, transparent ${2300 * zoom}px)`,
        }}
      />
      {wave > 0 ? (
        <div
          style={{
            ...layer,
            opacity: wave,
            backgroundImage: dots(0.55, 1.6),
            maskImage: `radial-gradient(circle at 50% 50%, transparent ${Math.max(0, r - 150 * zoom)}px, black ${Math.max(0, r - 24 * zoom)}px, transparent ${r}px)`,
          }}
        />
      ) : null}
    </>
  )
}
