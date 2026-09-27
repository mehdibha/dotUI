import type { CSSProperties } from "react"
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion"

import { ease, keys, progress } from "../lib/motion"
import { INK } from "../lib/stage"
import { Theme } from "../lib/theme"
import { BEAT } from "../lib/timing"
import { BlurWords, HEADLINE } from "../lib/type"
import { Board, BOARD_WIDTH } from "./presets/board"
import type { View } from "./presets/board"
import { SLOTS } from "./presets/slots"
import type { Wipe } from "./presets/slots"
import { clipFor, WipeLine, WipeShadow } from "./presets/wipe"

/* 4 · Presets — one board of real cards, a new look on every beat. The
   camera glides down the board from one headline band to the next; each
   swap is a blade or a circle revealing the next theme over the last. */

const WIPE = 12
const wipeCurve = Easing.bezier(0.25, 1, 0.5, 1)

// Plane space (px): headline A at y 0, headline B at BAND_B.
const BAND_B = 1200
const BAND_H = 560
const HEADLINE_SIZE = 118

type Cam = {
  focus: number
  x: number
  scale: number
  rotateX: number
  rotateZ: number
}

function cameraAt(frame: number): Cam {
  const drift = 0.12 * BAND_B * (frame / 359)
  const glide = 0.88 * BAND_B * progress(frame, 60, 250, ease.camera)
  // Camera punch: lands two frames after the beat, then settles.
  const d = (frame % BEAT) + 1
  const punch = 0.042 * (1 - Math.exp(-d / 1.2)) * Math.exp(-d / 9)
  return {
    focus: drift + glide,
    x: keys(
      frame,
      [
        [0, 70],
        [359, -70],
      ],
      ease.linear,
    ),
    scale: 1.18 * (1 + punch),
    rotateX: keys(
      frame,
      [
        [0, 16],
        [180, 9],
        [359, 14],
      ],
      ease.inOut,
    ),
    rotateZ: keys(
      frame,
      [
        [0, 0],
        [60, 0],
        [170, -1.8],
        [280, 0],
      ],
      ease.inOut,
    ),
  }
}

/* What the camera sees, in plane px: at the steepest tilt the frame's top
   edge lands near −510 and its bottom near +450; padded. */
function viewOf(cam: Cam): View {
  const cx = BOARD_WIDTH / 2 - cam.x
  return {
    x0: cx - 920,
    x1: cx + 920,
    y0: cam.focus - 660,
    y1: cam.focus + 600,
  }
}

/* A clean strip across the board — the page's own background, feathered
   into the cards — so the line reads on any theme, in the theme's ink. It
   opens before its line arrives and closes after it leaves. */
function Band({
  x,
  y,
  open,
  text,
  start,
  end,
  wordStyle,
}: {
  x: number
  y: number
  open: number
  text: string
  start: number
  end?: number
  wordStyle?: (index: number) => CSSProperties | undefined
}) {
  if (open <= 0) return null
  return (
    <>
      <div
        className="absolute"
        style={{
          zIndex: 1,
          left: -600,
          width: BOARD_WIDTH + 1200,
          top: y - BAND_H / 2,
          height: BAND_H,
          transform: `scaleY(${open})`,
          background:
            "linear-gradient(to bottom, transparent, color-mix(in oklab, var(--color-bg) 70%, transparent) 12%, var(--color-bg) 22%, var(--color-bg) 78%, color-mix(in oklab, var(--color-bg) 70%, transparent) 88%, transparent)",
        }}
      />
      <div
        className="absolute flex items-center justify-center text-fg"
        style={{
          zIndex: 1,
          left: x,
          width: BOARD_WIDTH,
          top: y - 100,
          height: 200,
        }}
      >
        <div style={{ ...HEADLINE, color: undefined, fontSize: HEADLINE_SIZE }}>
          <BlurWords
            text={text}
            start={start}
            end={end}
            stagger={4}
            duration={24}
            wordStyle={wordStyle}
          />
        </div>
      </div>
    </>
  )
}

function Plane({
  slot,
  cam,
  frame,
}: {
  slot: number
  cam: Cam
  frame: number
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: 960 - BOARD_WIDTH / 2 + cam.x,
        top: 540,
        width: BOARD_WIDTH,
        transform: `translateY(${-cam.focus}px)`,
      }}
    >
      <Board state={SLOTS[slot]!.state} view={viewOf(cam)} />
      <Band
        y={0}
        x={-cam.x}
        open={
          progress(frame, 0, 22, ease.out) *
          (1 - progress(frame, 94, 28, ease.inOut))
        }
        text="Start from a preset."
        start={5}
        end={88}
        wordStyle={(i) =>
          i >= 2 ? { color: "var(--color-fg-muted)" } : undefined
        }
      />
      <Band
        y={BAND_B}
        x={-cam.x}
        open={progress(frame, 214, 36, ease.inOut)}
        text="Make it yours."
        start={244}
        wordStyle={(i) =>
          i === 2 ? { color: "var(--color-fg-accent)" } : undefined
        }
      />
    </div>
  )
}

/** One look of the board. The incoming look of a wipe also carries the
 *  front: its shadow under it, its brand hairline over it. */
function Layer({
  slot,
  cam,
  frame,
  wipe,
}: {
  slot: number
  cam: Cam
  frame: number
  wipe?: { wipe: Wipe; t: number }
}) {
  const { state, mode } = SLOTS[slot]!
  return (
    <Theme state={state} mode={mode}>
      {wipe ? <WipeShadow {...wipe} /> : null}
      <AbsoluteFill
        className="bg-bg"
        style={{ clipPath: wipe ? clipFor(wipe.wipe, wipe.t) : undefined }}
      >
        <AbsoluteFill style={{ perspective: 2600 }}>
          <AbsoluteFill
            style={{
              transform: `rotateX(${cam.rotateX}deg) rotateZ(${cam.rotateZ}deg) scale(${cam.scale})`,
            }}
          >
            <Plane slot={slot} cam={cam} frame={frame} />
          </AbsoluteFill>
        </AbsoluteFill>
        {/* Atmosphere: the far edge of the tilted board sinks into the page. */}
        <AbsoluteFill className="bg-linear-to-b from-bg via-transparent via-22% to-transparent" />
      </AbsoluteFill>
      {wipe ? <WipeLine {...wipe} /> : null}
    </Theme>
  )
}

export function Presets() {
  const frame = useCurrentFrame()
  const k = Math.min(SLOTS.length - 1, Math.floor(frame / BEAT))
  const local = frame - k * BEAT
  const wiping = k > 0 && local < WIPE
  // One frame of lead so the beat frame itself already shows the swap.
  const t = wipeCurve((local + 1) / (WIPE + 1))
  const cam = cameraAt(frame)
  const layers = wiping ? [k - 1, k] : [k]
  return (
    <AbsoluteFill style={{ background: INK }}>
      {layers.map((slot, i) => (
        <Layer
          key={slot}
          slot={slot}
          cam={cam}
          frame={frame}
          wipe={i === 1 ? { wipe: SLOTS[slot]!.wipe, t } : undefined}
        />
      ))}
    </AbsoluteFill>
  )
}
