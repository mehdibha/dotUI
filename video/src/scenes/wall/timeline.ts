import { Easing } from "remotion"

import { clamp01, ease, lerp, progress } from "../../lib/motion"

/* The pull-back: picks up over a few frames after the click, then a long glide. */
const whoosh = Easing.bezier(0.25, 0.1, 0.1, 1)

/* Wall's beat map (scene-local frames; a beat is 30, a bar 120). */
export const T = {
  /** The radio is selected; the ripple leaves from its dot. */
  click: 30,
  /** "Most are built on someone else's." */
  line: 120,
  lineOut: 240,
  /** The wall recedes, the title resolves. */
  recede: 240,
  mark: 270,
} as const

/** Ripple front speed, wall px per frame. */
export const SPEED = 13

/** Camera zoom at frame 0: the radio's 6 px inner dot is 24 px on screen. */
export const ZOOM_IN = 4

/* Zoom interpolates in log space so the pull-back reads at a constant rate. */
function logLerp(a: number, b: number, t: number) {
  return Math.exp(lerp(Math.log(a), Math.log(b), t))
}

export function cameraAt(frame: number) {
  // A slow breath before the click, a whoosh out on it…
  const pre = progress(frame, 0, T.click, ease.soft)
  const out = progress(frame, T.click, 140, whoosh)
  const scale = logLerp(logLerp(ZOOM_IN, ZOOM_IN * 0.93, pre), 0.95, out)
  // …a slow push in on the line, then the wall recedes on bar 3.
  const push = 120 * progress(frame, T.line - 10, 140, ease.soft)
  const back = progress(frame, T.recede, 110, ease.camera)
  const tilt = progress(frame, T.click + 10, 200, ease.camera)
  const drift = frame / 360
  return {
    scale,
    z: push + lerp(0, -1500, back),
    rotateX: lerp(0, 30, tilt) + back * 4,
    rotateY: lerp(0, -16, tilt) - drift * 5,
    rotateZ: lerp(0, -5, tilt) - drift * 1.5,
    // A constant truck left, plus the recentre as the wall recedes.
    x:
      -0.45 * Math.max(0, frame - T.click) -
      280 * progress(frame, 230, 129, ease.camera),
    y: 50 * progress(frame, T.click, 329, ease.soft),
    /** Wall brightness (0–1) — dips behind the line, sinks under the title. */
    light:
      1 -
      0.25 * progress(frame, T.line - 16, 30, ease.inOut) +
      0.1 * progress(frame, T.lineOut, 20, ease.inOut) -
      0.36 * clamp01(back * 1.2),
  }
}
