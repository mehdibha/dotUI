import { AbsoluteFill, Easing, useCurrentFrame } from "remotion"

import { clamp01, ease, progress } from "../lib/motion"
import { INK } from "../lib/stage"
import { Theme } from "../lib/theme"
import { BEAT } from "../lib/timing"
import { BlurWords, HEADLINE, TYPE } from "../lib/type"
import { Board, BOARD_WIDTH, useCardHeights } from "./presets/board"
import type { Cam } from "./presets/camera"
import { cameraAt, PERSPECTIVE, viewOf } from "./presets/camera"
import { LookMode } from "./presets/cards"
import { SLOTS } from "./presets/slots"
import type { Wipe } from "./presets/slots"
import { clipFor, WipeLine, WipeShadow } from "./presets/wipe"

/* 3 · Presets — one board of real cards, a new preset on every beat. Bar 1
   glides over the board under "Start from a preset."; bars 2–3 push in
   until three or four cards fill the frame, and the last beat lands on
   Origin, dark, on the canvas Axes opens on. */

const WIPE = 12
const wipeCurve = Easing.bezier(0.25, 1, 0.5, 1)

/* Chrome rasterizes a 3D layer at 1× and upscales it, so the zoom is layout
   (CSS zoom) and the transform only scales down — with headroom for the
   perspective, which enlarges the near edge of the tilted board. */
const HEADROOM = 1.08

function Plane({ cam, heights }: { cam: Cam; heights: readonly number[] }) {
  const zoom = cam.scale * HEADROOM
  return (
    <AbsoluteFill style={{ perspective: PERSPECTIVE }}>
      <AbsoluteFill
        style={{
          transform: `rotateX(${cam.rx}deg) rotateY(${cam.ry}deg) rotateZ(${cam.rz}deg) scale(${1 / HEADROOM})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 960 - cam.fx * zoom,
            top: 540 - cam.fy * zoom,
          }}
        >
          <div style={{ position: "relative", width: BOARD_WIDTH, zoom }}>
            <Board heights={heights} view={viewOf(cam)} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

/** "Start from a preset." on a clean band of the look's own page, in its
 *  own ink — so each wipe re-inks the line with the board. */
function Title({ frame }: { frame: number }) {
  const open =
    progress(frame, 0, 20, ease.out) * (1 - progress(frame, 98, 16, ease.in))
  if (open <= 0) return null
  return (
    <>
      <AbsoluteFill
        style={{
          top: 540 - 260,
          height: 520,
          transform: `scaleY(${open})`,
          background:
            "linear-gradient(to bottom, transparent, color-mix(in oklab, var(--color-bg) 75%, transparent) 16%, var(--color-bg) 30%, var(--color-bg) 70%, color-mix(in oklab, var(--color-bg) 75%, transparent) 84%, transparent)",
        }}
      />
      <AbsoluteFill className="items-center justify-center text-fg">
        <div
          style={{
            ...HEADLINE,
            color: undefined,
            fontSize: TYPE.statement,
            paddingBottom: 12,
          }}
        >
          <BlurWords
            text="Start from a preset."
            start={3}
            end={98}
            stagger={4}
            wordStyle={(i) =>
              i >= 2 ? { color: "var(--color-fg-muted)" } : undefined
            }
          />
        </div>
      </AbsoluteFill>
    </>
  )
}

function Look({
  slot,
  cam,
  frame,
  wipe,
  over,
}: {
  slot: number
  cam: Cam
  frame: number
  wipe?: { wipe: Wipe; t: number }
  over?: "light" | "dark"
}) {
  const { state, mode } = SLOTS[slot]!
  const [heights, measure] = useCardHeights(state)
  if (!heights) return measure
  return (
    <>
      {wipe ? <WipeShadow {...wipe} /> : null}
      <AbsoluteFill
        className="bg-bg"
        style={{ clipPath: wipe ? clipFor(wipe.wipe, wipe.t) : undefined }}
      >
        <LookMode value={mode}>
          <Plane cam={cam} heights={heights} />
        </LookMode>
        {/* Atmosphere: the far edge of the tilted board sinks into the page. */}
        <AbsoluteFill
          className="bg-linear-to-b from-bg via-transparent via-22% to-transparent"
          style={{ opacity: clamp01((cam.rx - 6) / 12) }}
        />
        {mode === "dark" ? (
          <AbsoluteFill
            style={{
              background:
                "radial-gradient(ellipse 90% 80% at 50% 45%, transparent 55%, rgba(0,0,0,0.5) 100%)",
            }}
          />
        ) : null}
        <Title frame={frame} />
      </AbsoluteFill>
      {wipe && over ? <WipeLine {...wipe} over={over} /> : null}
    </>
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
        <Theme key={slot} state={SLOTS[slot]!.state} mode={SLOTS[slot]!.mode}>
          <Look
            slot={slot}
            cam={cam}
            frame={frame}
            wipe={i === 1 ? { wipe: SLOTS[slot]!.wipe, t } : undefined}
            over={i === 1 ? SLOTS[slot - 1]!.mode : undefined}
          />
        </Theme>
      ))}
    </AbsoluteFill>
  )
}
