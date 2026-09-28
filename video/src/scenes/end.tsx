import type { ReactNode } from "react"
import { AbsoluteFill, useCurrentFrame } from "remotion"

import { clamp01, ease, keys, lerp, progress, punches } from "../lib/motion"
import { Stage } from "../lib/stage"
import { WarmIcons } from "../lib/theme"
import { BlurWords, HEADLINE, TYPE } from "../lib/type"
import type { Ripple } from "./end/field"
import { Field, rippleFront } from "./end/field"
import type { Light } from "./end/light"
import { Lights } from "./end/light"
import { EndMark, EndWordmark, markAt } from "./end/logo"
import { CX, CY, T } from "./end/timeline"
import { burnLights, coreCharge, Vortex } from "./end/vortex"
import { cameraAt as exportCamera } from "./export/layout"

/* End — Export's last frame starts turning on the cut and the whole film
   pours into the dot; the dot becomes the mark, the wordmark slides out, the
   line and the address settle into the poster frame. */

const TAGLINE = "The Design System Studio for the Web"
const SITE = "dotui.org"
const TAG_Y = 598
const SITE_Y = 704
/** The end card's push grows from here. */
const PUSH_Y = CY - 20

function darkDot(frame: number) {
  const p = markAt(frame)
  return { x: p.x + 25 * p.k, y: p.y + 25 * p.k }
}

const IMPACT: Ripple = {
  at: T.impact,
  x: CX,
  y: CY,
  push: 20,
  glow: 4.5,
  speed: 40,
  reach: 1400,
  decay: 30,
  width: 70,
}

/** The last dust lands on f58–59: two quick flares, then the hit. */
function burstAt(frame: number) {
  if (frame >= T.impact) return 0
  return T.bursts.reduce(
    (sum, at, i) =>
      frame >= at ? sum + (0.6 + 0.4 * i) * Math.exp(-(frame - at) / 2.5) : sum,
    0,
  )
}

const RIPPLES: Ripple[] = [
  ...T.bursts.map((at) => ({
    at,
    x: CX,
    y: CY,
    push: 5,
    glow: 2.4,
    speed: 34,
    reach: 700,
    decay: 8,
  })),
  IMPACT,
  {
    at: T.punch,
    ...darkDot(T.punch),
    push: 7,
    glow: 2.2,
    speed: 26,
    reach: 900,
    decay: 20,
  },
  ...T.pulses.map((at) => ({
    at: at + 2,
    ...darkDot(at),
    push: 2.5,
    glow: 1.4,
    speed: 22,
    reach: 700,
    decay: 12,
  })),
]

/* Export's ground: its grid phase and drift on its last frame, carried
   across the cut and eased back to centre (a dot on the core) by impact. */
function exportGrid(n: number) {
  const f = 360 + n
  const cam = exportCamera(f)
  return [
    -f * 0.35 + cam.x * 0.25 - cam.rotateY * 8,
    -f * 0.1 + cam.y * 0.25,
  ] as const
}
const wrap = (v: number) => ((((v + 14) % 28) + 28) % 28) - 14
const GRID_0 = exportGrid(0).map(wrap)
const GRID_V = [0, 1].map((i) => exportGrid(1)[i]! - exportGrid(0)[i]!)

function gridOffset(frame: number) {
  const settle = 1 - ease.camera(clamp01(frame / 56))
  return [
    (GRID_0[0]! + GRID_V[0]! * frame) * settle,
    (GRID_0[1]! + GRID_V[1]! * frame) * settle,
  ] as const
}

export function End() {
  const frame = useCurrentFrame()
  const burst = burstAt(frame)
  const mark = markAt(frame)
  const pose = { ...mark, size: mark.size + 6 * burst }
  const since = frame - T.impact
  const flash = since >= 0 ? Math.exp(-since / 7) : 0
  let glow: number
  if (frame < T.impact) {
    const charge = coreCharge(frame)
    glow = 0.35 + 0.4 * charge.landed + 0.4 * charge.flare
  } else {
    glow = lerp(0.2, 1.2, flash)
  }
  // The collapse leans in on the cut and on the next beat.
  const pull =
    1 + punches(frame, [0, 30]) + 0.05 * ease.in(clamp01(frame / T.impact))
  // A slow push from the moment the mark forms, so the reveal never holds.
  const push = keys(
    frame,
    [
      [T.grow, 1],
      [359, 1.035],
    ],
    ease.soft,
  )

  const lights: Light[] = [
    // The pool on the lockup (pushed with it), and the core while it charges.
    {
      x: CX + (pose.cx - CX) * push,
      y: PUSH_Y + (pose.y - PUSH_Y) * push,
      radius: Math.max(220, pose.size * 3.4) * push,
      alpha: glow,
    },
    ...(burst > 0.01
      ? [{ x: CX, y: CY, radius: 170, alpha: 1.5 * burst }]
      : []),
    // Bodies burning into the core, pulled with the vortex.
    ...burnLights(frame).map((l) => ({
      ...l,
      x: CX + (l.x - CX) * pull,
      y: CY + (l.y - CY) * pull,
      radius: l.radius * pull,
    })),
    ...(flash > 0.01 ? [{ x: CX, y: CY, radius: 90, alpha: 2.2 * flash }] : []),
  ]
  return (
    <Stage grid={false}>
      <WarmIcons />
      <Field
        frame={frame}
        ripples={RIPPLES}
        offset={gridOffset(frame)}
        zoom={keys(
          frame,
          [
            [0, 1],
            [359, 1.03],
          ],
          ease.linear,
        )}
      />
      {frame < T.impact ? (
        <AbsoluteFill
          style={{
            transform: `scale(${pull.toFixed(4)})`,
            transformOrigin: `${CX}px ${CY}px`,
          }}
        >
          <Vortex frame={frame} />
        </AbsoluteFill>
      ) : null}
      <Lights lights={lights} />
      {since >= 0 && since < 70 ? <Shockwave since={since} /> : null}
      {flash > 0.01 ? <Flare flash={flash} since={since} /> : null}
      <AbsoluteFill
        style={{
          transform: `scale(${push.toFixed(4)})`,
          transformOrigin: `${CX}px ${PUSH_Y}px`,
        }}
      >
        <EndWordmark pose={pose} frame={frame} />
        <EndMark pose={pose} />
        <Line y={TAG_Y}>
          <BlurWords
            text={TAGLINE}
            start={T.tagline}
            stagger={4}
            style={{
              ...HEADLINE,
              fontSize: TYPE.tagline,
              letterSpacing: "-0.025em",
              color: "rgba(250,250,250,0.72)",
            }}
          />
        </Line>
        <Line y={SITE_Y}>
          <Site frame={frame} />
        </Line>
      </AbsoluteFill>
    </Stage>
  )
}

function Line({ y, children }: { y: number; children: ReactNode }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: y,
        transform: "translateY(-50%)",
        textAlign: "center",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  )
}

/** The address, in a hairline pill that draws in around it. */
function Site({ frame }: { frame: number }) {
  const t = progress(frame, T.url, 34)
  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        padding: "20px 44px 22px",
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 999,
          border: "1.5px solid rgba(255,255,255,0.2)",
          background: "rgba(255,255,255,0.05)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
          opacity: t,
          transform: `scale(${lerp(0.92, 1, t)})`,
        }}
      />
      <BlurWords
        text={SITE}
        start={T.url + 4}
        style={{
          ...HEADLINE,
          position: "relative",
          fontSize: TYPE.cta,
          fontWeight: 500,
          letterSpacing: "-0.02em",
          color: "rgba(250,250,250,0.94)",
        }}
      />
    </span>
  )
}

/** The impact: a hot core and an anamorphic streak through it. */
function Flare({ flash, since }: { flash: number; since: number }) {
  const width = lerp(300, 1900, ease.out(clamp01(since / 18)))
  const streak = flash ** 1.6
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: CX - width / 2,
          top: CY - 14,
          width,
          height: 28,
          opacity: streak,
          background:
            "radial-gradient(closest-side, rgba(255,255,255,0.55), rgba(255,255,255,0.12) 45%, transparent)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: CX - width * 0.4,
          top: CY - 1,
          width: width * 0.8,
          height: 2,
          opacity: streak,
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.9) 35%, #fff 50%, rgba(255,255,255,0.9) 65%, transparent)",
        }}
      />
    </>
  )
}

function Shockwave({ since }: { since: number }) {
  const radius = rippleFront(IMPACT, since)
  const fade = Math.exp(-since / 18) * clamp01(since / 3)
  return (
    <div
      style={{
        position: "absolute",
        left: CX - radius,
        top: CY - radius,
        width: radius * 2,
        height: radius * 2,
        borderRadius: "50%",
        border: `1.5px solid rgba(255,255,255,${(0.42 * fade).toFixed(3)})`,
        boxShadow: `0 0 18px rgba(255,255,255,${(0.18 * fade).toFixed(3)}), inset 0 0 18px rgba(255,255,255,${(0.1 * fade).toFixed(3)})`,
      }}
    />
  )
}
