import { AbsoluteFill, useCurrentFrame } from "remotion"

import { clamp01, ease, keys, lerp, progress } from "../lib/motion"
import { Stage } from "../lib/stage"
import { BlurWords, HEADLINE, MUTED } from "../lib/type"
import type { Ripple } from "./end/field"
import { Field, rippleFront } from "./end/field"
import { Mark, markAt, Wordmark } from "./end/logo"
import { CX, CY, T } from "./end/timeline"
import { coreCharge, Vortex } from "./end/vortex"

/* End — everything collapses into the dot, the dot becomes the mark, the
   lockup and the line settle into the poster frame. */

const TAGLINE = "The Design System Studio for the Web"
const SITE = "dotui.org"
const TAG_Y = 613
const SITE_Y = 690

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

const RIPPLES: Ripple[] = [
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

export function End() {
  const frame = useCurrentFrame()
  const pose = markAt(frame)
  const since = frame - T.impact
  const flash = since >= 0 ? Math.exp(-since / 7) : 0
  let glow: number
  if (frame < T.impact) {
    const charge = coreCharge(frame)
    glow = 0.25 + 0.4 * charge.landed + 0.35 * charge.flare
  } else {
    glow = lerp(0.2, 1.2, flash)
  }
  const push = keys(
    frame,
    [
      [T.word, 1],
      [359, 1.025],
    ],
    ease.soft,
  )

  return (
    <Stage grid={false}>
      <Field
        frame={frame}
        ripples={RIPPLES}
        zoom={keys(
          frame,
          [
            [0, 1],
            [359, 1.03],
          ],
          ease.linear,
        )}
      />
      <Glow
        x={pose.cx}
        y={pose.y}
        radius={Math.max(220, pose.size * 3.4)}
        alpha={glow}
      />
      <AbsoluteFill>
        <Vortex frame={frame} />
      </AbsoluteFill>
      {since >= 0 && since < 70 ? <Shockwave since={since} /> : null}
      {flash > 0.01 ? <Flare flash={flash} since={since} /> : null}
      <AbsoluteFill
        style={{
          transform: `scale(${push})`,
          transformOrigin: `${CX}px 520px`,
        }}
      >
        <Wordmark pose={pose} frame={frame} />
        <Mark pose={pose} />
        <Line y={TAG_Y}>
          <BlurWords
            text={TAGLINE}
            start={T.tagline}
            stagger={4}
            style={{
              ...HEADLINE,
              fontSize: 40,
              letterSpacing: "-0.025em",
              color: MUTED,
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

function Line({ y, children }: { y: number; children: React.ReactNode }) {
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
        padding: "11px 24px 12px",
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.16)",
          background: "rgba(255,255,255,0.035)",
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
          fontSize: 26,
          fontWeight: 500,
          letterSpacing: "-0.01em",
          color: "rgba(250,250,250,0.92)",
        }}
      />
    </span>
  )
}

/** A soft, roughly Gaussian pool of light. */
function Glow({
  x,
  y,
  radius,
  alpha,
}: {
  x: number
  y: number
  radius: number
  alpha: number
}) {
  const a = (k: number) => `rgba(255,255,255,${(alpha * k).toFixed(4)})`
  return (
    <div
      style={{
        position: "absolute",
        left: x - radius,
        top: y - radius,
        width: radius * 2,
        height: radius * 2,
        background: `radial-gradient(circle closest-side, ${a(0.42)} 0%, ${a(0.24)} 7%, ${a(0.11)} 18%, ${a(0.045)} 34%, ${a(0.015)} 56%, ${a(0.004)} 78%, transparent 100%)`,
      }}
    />
  )
}

/** The impact: a hot core and an anamorphic streak through it. */
function Flare({ flash, since }: { flash: number; since: number }) {
  const width = lerp(300, 1900, ease.out(clamp01(since / 18)))
  const streak = flash ** 1.6
  return (
    <>
      <Glow x={CX} y={CY} radius={90} alpha={2.2 * flash} />
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
