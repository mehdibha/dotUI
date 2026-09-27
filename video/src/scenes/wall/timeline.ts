import { Easing } from "remotion"

import { ease, lerp, progress, punches } from "../../lib/motion"

/* Wall's beat map (scene-local frames; a beat is 30, a bar 120). */
export const T = {
  /** The radio is selected; the ripple leaves from its dot. */
  click: 30,
  /** "Most are built on someone else's." */
  line: 120,
  lineOut: 240,
  /** The wall falls back and dims; the lockup resolves over it… */
  recede: 240,
  lockup: 252,
  /** …and lands on the beat. */
  land: 270,
  end: 359,
} as const

/** Ripple front speed, wall px per frame. */
export const SPEED = 13

/** Camera zoom at frame 0: the radio's 6 px inner dot is 24 px on screen. */
export const ZOOM_IN = 4
/** Where the pull-back settles: tiles large enough to read as UI. */
const SETTLE = 1.22

export const PERSPECTIVE = 1600

/* The pull-back: picks up over a few frames after the click, then a long glide. */
const whoosh = Easing.bezier(0.25, 0.1, 0.1, 1)

/* Zoom interpolates in log space so the pull-back reads at a constant rate. */
function logLerp(a: number, b: number, t: number) {
  return Math.exp(lerp(Math.log(a), Math.log(b), t))
}

export function cameraAt(frame: number) {
  // A slow breath before the click, a whoosh out on it.
  const pre = progress(frame, 0, T.click, ease.soft)
  const out = progress(frame, T.click, 150, whoosh)
  const kick = 1 + punches(frame, [T.click, T.line, T.recede])
  const scale = logLerp(logLerp(ZOOM_IN, ZOOM_IN * 0.93, pre), SETTLE, out)
  const tilt = progress(frame, T.click + 4, 190, ease.camera)
  const back = recedeAt(frame)
  const push = 110 * progress(frame, T.line - 20, 140, ease.soft)
  return {
    scale: scale * kick,
    /** The scale without the beat punches (the layout zoom ignores them). */
    rest: scale,
    z: push - 1250 * back,
    tilt,
    rotateX: 28 * tilt + 7 * back,
    rotateY: -14 * tilt - frame / 90,
    rotateZ: -4.5 * tilt - frame / 300,
    // A constant truck left; the wall rides up as it falls back — the way
    // Presets' board is already moving on its first frame.
    x: -0.5 * Math.max(0, frame - T.click) - 60 * back,
    y: 40 * progress(frame, T.click, 200, ease.soft) - 260 * back,
    /** Wall brightness (0–1): a touch down under the line, sunk under the lockup. */
    light:
      1 -
      0.1 * progress(frame, T.line - 16, 30, ease.inOut) -
      0.44 * progress(frame, T.recede, 26, ease.inOut),
    blur: 1.6 * progress(frame, T.recede + 6, 48, ease.inOut),
  }
}

export type Cam = ReturnType<typeof cameraAt>

/** Bar 3: the wall eases off on the downbeat, falls back fast, and is still
 *  sliding away at the cut (0 → ~0.82 by the last frame, never settling). */
function recedeAt(frame: number) {
  const u = frame - T.recede
  if (u <= 0) return 0
  return (1 - Math.exp(-u / 66)) * ease.camera(Math.min(1, u / 36))
}

/* Chrome rasterizes a layer under perspective at 1× and upscales it, so the
   part of the zoom above 1 is CSS layout zoom and the 3D transform only ever
   scales down. The layout zoom steps on a ladder rather than following the
   camera: a rung holds for many frames, so text never re-lays out (and
   crawls) while the camera glides; a step lands mid-whoosh, where it can't
   be seen, with headroom for what the tilt and the push bring closer.
   Whole-number rungs keep 1 px borders whole, so line weights never jump
   at a step. */
const RUNGS = [1, 2, 3, 4]

export function layoutZoom(cam: Cam) {
  const nearest = PERSPECTIVE / (PERSPECTIVE - Math.max(0, cam.z))
  const want = cam.rest * (1 + 0.25 * cam.tilt) * nearest
  return RUNGS.find((z) => z >= want - 1e-6) ?? RUNGS[RUNGS.length - 1]!
}
