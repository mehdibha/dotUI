import { AbsoluteFill, useCurrentFrame } from "remotion"

import { ease, progress } from "../lib/motion"
import { Camera, Stage } from "../lib/stage"
import { Theme } from "../lib/theme"
import { at, BEAT } from "../lib/timing"
import { BlurWords, HEADLINE, MUTED } from "../lib/type"
import type { CameraKey, Pose } from "./axes/camera"
import { cameraAt, FIT } from "./axes/camera"
import { FONT_GROUPS } from "./axes/popovers"
import { SET, StudioSet } from "./axes/set"
import { AXES, CLICKS } from "./axes/timeline"
import { Warm } from "./axes/warm"

/* 3 · Axes — the heart. The real /studio: the panel on the left driven frame
   by frame, the preview on the right re-theming as a wave. One axis per bar:
   the camera leans in on the panel row as the cursor acts, then glides out
   to where the change lands in the preview. */

const pose = (
  f: readonly [number, number],
  zoom: number,
  extra: Partial<Pose> = {},
): Pose => ({ f, p: [1060, 650], zoom, rx: 9, ry: 11, rz: -0.6, ...extra })

/** The working shot: the panel, and the whole preview beside it. */
const view = (dx = 0, zoom = 0.98) => pose([700 + dx, 360], zoom)

/** Leaning in on the panel's top rows and the popover beside them. */
const lean = (y = 300, zoom = 1.08) =>
  pose([460, y], zoom, { p: [1000, 650], rx: 8, ry: 13, rz: -0.8 })

const TRACK: CameraKey[] = [
  // Far back and out of focus while the line reads, then in.
  [
    0,
    {
      f: [720, 405],
      p: [960, 560],
      zoom: 0.9,
      z: -2600,
      rx: 26,
      ry: -18,
      rz: 5,
    },
  ],
  [
    at(0, 1.6),
    {
      f: [720, 405],
      p: [960, 560],
      zoom: 0.9,
      z: -2300,
      rx: 24,
      ry: -16,
      rz: 4.5,
    },
    ease.linear,
  ],
  [at(1) - 6, lean(300, 1.06), ease.inOut],
  // Color: the hue drag, then out as the colour rolls across.
  [at(1, 1.2), lean(320, 1.1)],
  [at(1, 2.8), view(40)],
  // Typography: the list, then toward the titles the serif lands on.
  [at(2) - 6, lean(300)],
  [at(2, 1.3), lean(320, 1.1)],
  [at(2, 3), pose([880, 300], 1.08, { p: [1060, 640] })],
  // Icons.
  [at(3) - 6, lean(300)],
  [at(3, 1.3), lean(320, 1.1)],
  [at(3, 2.9), view(-40, 1.02)],
  // Radius: the slider held, then in on the cards as the corners swing.
  [at(4) - 6, lean(290, 1.06)],
  [at(4, 1.8), pose([760, 320], 1.12, { rx: 8, ry: 9 })],
  [at(4, 3.2), view(0, 0.98)],
  // Density: the cards, then wide enough to watch the canvas reflow.
  [at(5) - 6, lean(320)],
  [at(5, 1.3), lean(340, 1.1)],
  // Light & dark: the whole preview, the pill in reach.
  [at(6) - 6, pose([864, 440], 0.86, { p: [1080, 640], rx: 9, ry: 9 })],
  [at(6, 1.4), pose([864, 430], 0.88, { p: [1080, 640], rx: 9, ry: 10 })],
  [at(6, 3.2), view(40, 0.96)],
  // Components: button styles, then onto the buttons themselves.
  [at(7) - 6, lean(330)],
  [at(7, 2.3), lean(350, 1.12)],
  [at(7, 3.6), pose([860, 330], 1.04)],
  // Pull back: the whole studio, tilted, under the line.
  [
    at(8, 2.6),
    { f: [720, 405], p: [960, 720], zoom: 0.55, rx: 24, ry: 0, rz: 0 },
  ],
  [
    at(9),
    { f: [720, 405], p: [960, 724], zoom: 0.53, rx: 25, ry: 0, rz: 0 },
    ease.linear,
  ],
]

/** A small push on every click, so the edit breathes on the beat. */
function punch(frame: number) {
  let s = 0
  for (const c of CLICKS) {
    const d = frame - c
    if (d >= 0 && d < BEAT) s += Math.sin((d / BEAT) * Math.PI) * (1 - d / BEAT)
  }
  return 1 + 0.008 * s
}

export function Axes() {
  const frame = useCurrentFrame()
  const cam = cameraAt(frame, TRACK)
  const focus = progress(frame, at(0, 2.3), at(1) - 6 - at(0, 2.3), ease.inOut)
  const dim =
    (1 - focus) * 0.62 + progress(frame, at(8, 0.6), 70, ease.inOut) * 0.12
  const blur = (1 - focus) * 9

  return (
    <Stage
      gridOffset={[cam.x * 0.4, cam.y * 0.4]}
      gridScale={0.8 + cam.scale * 0.3}
    >
      <Warm fonts={FONT_GROUPS.flatMap(({ families }) => families)} />
      <Camera
        {...cam}
        scale={cam.scale * punch(frame)}
        style={blur > 0.1 ? { filter: `blur(${blur}px)` } : undefined}
      >
        <div
          className="absolute"
          style={{
            left: (1920 - SET.w * FIT) / 2,
            top: (1080 - SET.h * FIT) / 2,
            width: SET.w,
            height: SET.h,
            transform: `scale(${FIT})`,
            transformOrigin: "0 0",
          }}
        >
          <Theme mode="dark">
            <StudioSet frame={frame} />
          </Theme>
          <div
            className="pointer-events-none absolute inset-0 rounded-[18px] bg-black"
            style={{ opacity: dim }}
          />
        </div>
      </Camera>
      <Titles frame={frame} />
    </Stage>
  )
}

function Titles({ frame }: { frame: number }) {
  const current = AXES.find(
    ({ bar }) => frame >= at(bar) - 8 && frame < at(bar + 1) - 8,
  )
  return (
    <>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 20,
          pointerEvents: "none",
        }}
      >
        <div style={{ ...HEADLINE, fontSize: 136 }}>
          <BlurWords
            text="Design your system."
            start={8}
            end={at(0, 2.4)}
            stagger={5}
          />
        </div>
      </AbsoluteFill>
      {current ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            opacity:
              progress(frame, at(current.bar) - 12, 20) *
              (1 - progress(frame, at(current.bar, 3.35), 16, ease.in)),
            background:
              "radial-gradient(ellipse 820px 360px at 0% 0%, rgba(8,8,10,0.78), rgba(8,8,10,0.45) 45%, transparent 100%)",
          }}
        />
      ) : null}
      {current ? (
        <div
          key={current.id}
          style={{
            ...HEADLINE,
            position: "absolute",
            left: 104,
            top: 52,
            fontSize: 80,
            letterSpacing: "-0.05em",
          }}
        >
          <BlurWords
            text={current.label}
            start={at(current.bar) - 6}
            end={at(current.bar, 3.35)}
            stagger={4}
          />
        </div>
      ) : null}
      <AbsoluteFill
        style={{
          alignItems: "center",
          paddingTop: 150,
          pointerEvents: "none",
        }}
      >
        <div style={{ ...HEADLINE, fontSize: 128, textAlign: "center" }}>
          <BlurWords text="Every decision" start={at(8, 1)} stagger={5} />
          <br />
          <span style={{ color: MUTED }}>
            <BlurWords text="is yours." start={at(8, 1.5)} stagger={5} />
          </span>
        </div>
      </AbsoluteFill>
    </>
  )
}
