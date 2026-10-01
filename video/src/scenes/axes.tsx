import { useState } from "react"
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion"

import { clamp01, ease, keys, progress, punches } from "../lib/motion"
import { Stage } from "../lib/stage"
import { loadFonts, Theme, WarmIcons } from "../lib/theme"
import { at } from "../lib/timing"
import { BlurWords, HEADLINE, MUTED, TOP_ANCHOR, TYPE } from "../lib/type"
import { SET, shotAt, velocityAt } from "./axes/camera"
import type { CameraKey, Pose } from "./axes/camera"
import { Band, ButtonsInset, RadiusInset } from "./axes/insets"
import { FONT_GROUPS } from "./axes/popovers"
import { StudioSet } from "./axes/set"
import { AXES, MODE_FLIP, PUNCHES, stateAt, WIPE_FRAMES } from "./axes/timeline"

/* 4 · Axes — the heart. The real /studio, driven frame by frame from Origin:
   the panel on the left, the cards canvas on the right. It opens where
   Presets left the cards and pulls back to the studio. Then one axis per
   bar: a cut to the panel row on the downbeat, the pick on beat 1, a push
   into the card that proves it, where the change lands on beat 2 (and 3).
   Three bars break the pattern: Radius and Components cut straight to the
   macro with the control inset over it, and Light & dark pushes in on the
   preview's toggle, then rides the flip out and up to the light cards. */

const P = (
  f: readonly [number, number],
  s: number,
  extra: Partial<Pose> = {},
): Pose => ({ f, s, ...extra })

/** Leaves with velocity: no ease-in, a long settle. */
const leave = Easing.bezier(0.3, 0.45, 0.25, 1)

/* The panel shot: the row at (152, rowY) and its popover, the set's left
   edge a third of the way in, so the label sits on the ground beside it. */
const panel = (rowY: number, side: 1 | -1, y = 400, s = 1.9) =>
  P([152, rowY], s, { p: [929, y], rx: 6, ry: 9 * side, rz: -0.4 * side })
const drift = (pose: Pose, k: number): Pose => ({ ...pose, s: pose.s * k })

/** A bar: cut to the panel shot, drift, push into the macro, drift. */
function bar(start: number, from: Pose, push: [number, number], to: Pose) {
  return [
    [start, from],
    [push[0], drift(from, 1.03), ease.linear],
    [push[1], to],
    [start + 119, drift(to, 1.05), ease.linear],
  ] as const
}

/* Macros with an inset keep the proof right of it (`p`), clear of the
   label and the control on the left. */
const MACRO = {
  color: P([1012, 292], 2.2, { rx: 4, ry: -7, rz: 0.3 }),
  type: P([1336, 206], 3.1, { rx: 3, ry: 7, rz: -0.3 }),
  icons: P([548, 656], 3.4, { rx: 4, ry: -6, rz: 0.3 }),
  radius: P([918, 720], 2.5, { p: [1240, 590], rx: 3, ry: 7, rz: -0.3 }),
  density: P([690, 284], 2.4, { rx: 4, ry: -7, rz: 0.3 }),
  mode: P([1468, 330], 2.3, { rx: 3, ry: 7, rz: -0.3 }),
  components: P([1282, 700], 2.3, { p: [1330, 560], rx: 3, ry: -7, rz: 0.3 }),
  end: P([960, 540], 0.58, { p: [960, 762], rx: 22, ry: -2, rz: 0 }),
}

/** The whole preview, set low so the label keeps its ground above it. */
const WIDE = P([1100, 540], 0.7, { p: [1000, 630], rx: 12, ry: -7, rz: 0.3 })
/** In on the preview's tool pill, the light & dark toggle near centre. */
const TOGGLE = P([1150, 1022], 2.1, { p: [980, 790], rx: 8, ry: -4, rz: 0.2 })

const TRACK: CameraKey[] = [
  // Bar 0: tight on the cards, as Presets left them; pull back to the studio.
  [0, P([1112, 440], 1.45, { rx: 6 })],
  [86, P([960, 560], 0.84, { rx: 9, ry: -12, rz: 0.4 }), leave],
  [96, P([952, 560], 0.845, { rx: 9, ry: -12.4, rz: 0.4 }), ease.linear],
  [124, panel(172, 1)],
  // Color: the drag starts in the panel, the spectrum lands on the calendar.
  [158, drift(panel(172, 1), 1.02), ease.linear],
  [182, MACRO.color],
  [at(2) - 1, drift(MACRO.color, 1.05), ease.linear],
  ...bar(at(2), panel(172, -1), [at(2, 1) + 10, at(2, 2) + 2], MACRO.type),
  ...bar(at(3), panel(172, 1), [at(3, 1) + 10, at(3, 2) + 2], MACRO.icons),
  // Radius: straight to the card, the slider inset beside it.
  [at(4), MACRO.radius],
  [at(5) - 1, drift(MACRO.radius, 1.06), ease.linear],
  ...bar(at(5), panel(172, 1), [at(5, 1) + 10, at(5, 2) + 2], MACRO.density),
  // Light & dark: the whole studio, in on the toggle for the click, then the
  // flip carries the camera out and up to the light cards.
  [at(6), WIDE],
  [at(6) + 8, drift(WIDE, 1.015), ease.linear],
  [MODE_FLIP - 10, TOGGLE],
  [MODE_FLIP + 2, drift(TOGGLE, 1.015), ease.linear],
  [at(6, 3) - 4, { ...MACRO.mode, rho: 2.6 }],
  [at(7) - 1, drift(MACRO.mode, 1.04), ease.linear],
  // Components: straight to the buttons, the popover inset beside them.
  [at(7), MACRO.components],
  [at(7, 3.47), drift(MACRO.components, 1.05), ease.linear],
  // Pull back: the whole studio, tilted under the line.
  [at(8, 1.67), MACRO.end],
]

/* Stage's vignette, lifted off whenever light UI reaches the corners (it
   would grey them). */
const VIGNETTE = [
  [0, 1],
  [MODE_FLIP + 4, 1],
  [MODE_FLIP + 36, 0],
  [at(7, 3.47), 0],
  [at(8, 1.67), 1],
] as const

/* ±1–2 LSB of static grain over the vignette, so its near-black ramp
   dithers instead of banding in the encode. */
const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='7' stitchTiles='stitch'/><feColorMatrix values='1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 1'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>",
)}")`
const VIGNETTE_RAMP =
  "radial-gradient(ellipse 90% 80% at 50% 45%, transparent 55%, rgba(0,0,0,0.55) 100%)"

/** Bar 8 never settles: a slow dolly and orbit on top of the track. */
function alive(frame: number) {
  const t = Math.max(0, frame - at(8))
  return { s: 1 + 0.00055 * t, ry: 0.045 * t }
}

/* A frame of the set with the camera's CSS zoom: everything the camera
   scales past 1× is layout zoom, so it rasterizes crisp; the 3D transform
   only ever scales down. Fast moves take a motion blur along their path. */
function Rig({ frame }: { frame: number }) {
  const shot = shotAt(frame, TRACK)
  const life = alive(frame)
  const zoom = Math.max(1, shot.s * life.s * 1.12)
  const s = shot.s * life.s * (1 + punches(frame, PUNCHES))
  const [vx, vy] = velocityAt(frame, TRACK)
  const blur = [vx, vy].map((v) => Math.min(8, Math.abs(v) * 0.05))
  const blurred = blur[0]! > 0.6 || blur[1]! > 0.6
  const sweep = progress(frame, at(8, 1.6), 100, ease.inOut)
  return (
    <AbsoluteFill
      style={{
        perspective: 2600,
        filter: blurred ? "url(#axes-motion)" : undefined,
      }}
    >
      {blurred ? (
        <svg width={0} height={0} style={{ position: "absolute" }}>
          <filter id="axes-motion" x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur
              stdDeviation={`${blur[0]!.toFixed(2)} ${blur[1]!.toFixed(2)}`}
            />
          </filter>
        </svg>
      ) : null}
      <AbsoluteFill
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${shot.rx}deg) rotateY(${shot.ry + life.ry}deg) rotateZ(${shot.rz}deg) scale(${s / zoom})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 960 - shot.cx * zoom,
            top: 540 - shot.cy * zoom,
          }}
        >
          <div
            style={{
              position: "relative",
              width: SET.w,
              height: SET.h,
              zoom,
            }}
          >
            <Theme mode="dark">
              <StudioSet frame={frame} />
            </Theme>
            {sweep > 0 && sweep < 1 ? <Sweep t={sweep} /> : null}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

/** A soft band of light crossing the studio, on the set's own plane. */
function Sweep({ t }: { t: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[18px]"
      style={{ mixBlendMode: "screen", zIndex: 50 }}
    >
      <div
        className="absolute"
        style={{
          top: "-30%",
          height: "160%",
          left: `${-40 + t * 150}%`,
          width: "34%",
          transform: "skewX(-24deg)",
          opacity: Math.sin(Math.PI * t),
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.07) 35%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.07) 65%, transparent)",
        }}
      />
    </div>
  )
}

export function Axes() {
  const frame = useCurrentFrame()
  useFonts()
  const shot = shotAt(frame, TRACK)
  return (
    <Stage
      gridOffset={[-shot.cx * 0.3, -shot.cy * 0.3]}
      gridScale={0.8 + shot.s * 0.25}
      vignette={false}
    >
      <WarmIcons />
      <Rig frame={frame} />
      <Vignette opacity={keys(frame, VIGNETTE, ease.inOut)} />
      <Band frame={frame} />
      <Titles frame={frame} />
      <RadiusInset frame={frame} />
      <ButtonsInset frame={frame} />
    </Stage>
  )
}

function Vignette({ opacity }: { opacity: number }) {
  if (opacity < 0.005) return null
  return (
    <>
      <AbsoluteFill
        style={{ pointerEvents: "none", opacity, background: VIGNETTE_RAMP }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          opacity,
          backgroundImage: GRAIN,
          mixBlendMode: "overlay",
          maskImage:
            "radial-gradient(ellipse 90% 80% at 50% 45%, transparent 50%, black 80%)",
        }}
      />
    </>
  )
}

/** The label's scrim and ink: the film's own over dark, the look's over light. */
function Ink({
  light,
  frame,
  children,
}: {
  light: boolean
  frame: number
  children: React.ReactNode
}) {
  if (!light)
    return (
      <div
        style={
          {
            display: "contents",
            "--scrim": "rgba(8,8,10,0.84)",
            "--ink": HEADLINE.color,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    )
  return (
    <Theme state={stateAt(frame)} mode="light">
      <div
        style={
          {
            display: "contents",
            "--scrim": "color-mix(in oklab, var(--color-bg) 90%, transparent)",
            "--ink": "var(--color-fg)",
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </Theme>
  )
}

/** The faces the font list draws each family in. */
function useFonts() {
  useState(() => {
    loadFonts(
      FONT_GROUPS.flatMap(({ families }) => families),
      "axes font list",
    )
    return null
  })
}

/* Labels live in one clear zone, top-left on the ground beside the panel;
   each is gone before the push lands, so a macro never carries text. Over
   the light canvas a label takes the look's own page and ink, as Presets'
   line does. */
const LABEL_OUT = 34

function Titles({ frame }: { frame: number }) {
  const current = AXES.find(
    ({ bar }) => frame >= at(bar) && frame < at(bar + 1),
  )
  const labelEnd = current
    ? at(current.bar) + (current.labelOut ?? LABEL_OUT)
    : 0
  const labelFade = current
    ? clamp01((frame - at(current.bar)) / 10) *
      (1 - progress(frame, labelEnd, 12, ease.in))
    : 0
  return (
    <>
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          opacity:
            progress(frame, 4, 30) * (1 - progress(frame, 96, 16, ease.in)),
          background:
            "radial-gradient(ellipse 1000px 420px at 50% 48%, rgba(8,8,10,0.66), rgba(8,8,10,0.32) 55%, transparent 80%)",
        }}
      />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 24,
          pointerEvents: "none",
        }}
      >
        <div style={{ ...HEADLINE, fontSize: TYPE.statement }}>
          <BlurWords text="Make it yours." start={10} end={96} stagger={5} />
        </div>
      </AbsoluteFill>
      {current ? (
        <Ink light={frame >= MODE_FLIP + WIPE_FRAMES} frame={frame}>
          <AbsoluteFill
            style={{
              pointerEvents: "none",
              opacity: labelFade,
              background:
                "radial-gradient(ellipse 640px 220px at 330px 172px, var(--scrim) 0%, var(--scrim) 36%, color-mix(in oklab, var(--scrim) 50%, transparent) 64%, transparent 100%)",
            }}
          />
          <div
            key={current.id}
            style={{
              ...HEADLINE,
              position: "absolute",
              left: 112,
              top: TOP_ANCHOR - 22,
              fontSize: TYPE.label,
              letterSpacing: "-0.05em",
              color: "var(--ink)",
            }}
          >
            <BlurWords
              text={current.label}
              start={at(current.bar)}
              end={labelEnd}
              stagger={3}
              duration={18}
              exit={12}
            />
          </div>
        </Ink>
      ) : null}
      <div
        style={{
          ...HEADLINE,
          position: "absolute",
          insetInline: 0,
          top: TOP_ANCHOR - 22,
          fontSize: TYPE.statement,
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <BlurWords text="Every decision" start={at(8, 0.9)} stagger={5} />
        <br />
        <span style={{ color: MUTED }}>
          <BlurWords text="is yours." start={at(8, 1.4)} stagger={5} />
        </span>
      </div>
    </>
  )
}
