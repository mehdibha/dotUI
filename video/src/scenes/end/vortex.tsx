import { memo, useLayoutEffect, useRef } from "react"

import { clamp01, ease, progress, random } from "../../lib/motion"
import { EXPORT_LAST, exportRects, ExportPiece } from "../export/handoff"
import type { ExportPieceId } from "../export/handoff"
import { CAST } from "./cast"
import type { CastId } from "./cast"
import type { Light } from "./light"
import { CX, CY, T } from "./timeline"

/* Everything collapses into the dot. Export's last frame is the first ring:
   its editor, line and pill start turning on the cut, exactly where Export
   left them. The rest of the film pours in from beyond the frame — Wall's
   components, Presets' cards, the studio panel, the Compose card, a Patterns
   product — each on its own inward spiral. The disk leans back as it turns;
   bodies stay facing the lens (billboards), swell on the near side and
   burn into light in the last stretch. Dust arms feed the core until the
   last specks land on f58–59, a frame before the hit. */

type Orbit = {
  /** Where the spiral starts, screen px at frame 0 (the disk starts in the
   *  screen plane). */
  x: number
  y: number
  /** Frame it reaches the core. */
  land: number
  size: number
  /** Extra radius it swoops in from (px), decaying over the first frames. */
  entry?: number
  /** Share of the fall that is linear (pull on frame 0); the rest accelerates. */
  pull?: number
}

type Piece = Orbit & { kind: "piece"; piece: ExportPieceId }
type Billboard = Orbit & { kind: "cast"; cast: CastId }
type Body = Piece | Billboard

const SPIN = 0.014
const SWIRL = 1.7
/** The fall has some pull on frame 0, then accelerates. */
const PULL = 0.16
const TILT_MAX = (52 * Math.PI) / 180
const DISTANCE = 3000
/** Frames for an entering body's swoop to settle onto the disk. */
const ENTRY_TAU = 9
/** An entering body starts this far above the disk (toward the lens). */
const ENTRY_LIFT = 420

const tiltAt = (frame: number) =>
  TILT_MAX * ease.camera(clamp01((frame + 6) / 48))

/** A body on its inward spiral at `frame`, projected. */
function orbit(body: Orbit, frame: number) {
  const dx = body.x - CX
  const dy = body.y - CY
  const r0 = Math.hypot(dx, dy)
  const a0 = Math.atan2(dy, dx)
  const u = clamp01(frame / body.land)
  const pull = body.pull ?? PULL
  const fall = 1 - (pull * u + (1 - pull) * u ** 3)
  // Inner bodies wind up faster: the swirl grows as the radius closes.
  const turn = SPIN * frame + SWIRL * u ** 3
  const theta = a0 + turn
  const swoop = body.entry ? Math.exp(-Math.max(frame, -20) / ENTRY_TAU) : 0
  const r = r0 * fall + (body.entry ?? 0) * swoop
  const a = Math.cos(theta) * r
  const b = Math.sin(theta) * r
  const tilt = tiltAt(frame)
  const depth = DISTANCE / (DISTANCE - b * Math.sin(tilt) - ENTRY_LIFT * swoop)
  return {
    x: CX + a * depth,
    y: CY + b * Math.cos(tilt) * depth,
    depth,
    fall,
    turn,
    u,
  }
}

function look(body: Orbit, frame: number) {
  const o = orbit(body, frame)
  const burn = clamp01((1 - o.fall) ** 6 * 2)
  return {
    ...o,
    spin: o.turn * 0.4 * (180 / Math.PI),
    burn,
    // A burning body contracts into its light faster than it falls.
    scale: body.size * o.depth * o.fall ** 0.85 * (1 - 0.45 * burn),
    shade: clamp01((1 - o.depth) * 1.6),
    fade: 1 - clamp01((o.u - 0.9) / 0.1),
  }
}

/* --- The cast ---------------------------------------------------------- */

const RECTS = exportRects(EXPORT_LAST)

/* Export's pieces sit nearest the core, so they feel the pull at once. */
const piece = (p: ExportPieceId, land: number): Piece => ({
  kind: "piece",
  piece: p,
  x: RECTS[p].cx,
  y: RECTS[p].cy,
  land,
  size: 1,
  pull: 0.5,
})

const cast = (
  id: CastId,
  [x, y]: readonly [number, number],
  land: number,
  size: number,
  entry = 0,
): Billboard => ({ kind: "cast", cast: id, x, y, land, size, entry })

/* The film rewinds into the dot: Export's pieces go first, then Patterns'
   product, the Compose card, the studio panel, Presets' cards, and Wall's
   components last, with the dust. Starts are solved so each body crosses
   the frame at a readable size in the window noted beside it. */
const BODIES: Body[] = [
  piece("editor", 38),
  piece("line", 30),
  piece("pill", 34),
  // Down the right edge, f8–32.
  cast("product", [1476, -97], 46, 1, 500),
  // Across the top third over the fading line, f8–40.
  cast("panel", [292, 434], 52, 1, 1000),
  // Up the left side, f12–36.
  cast("compose", [617, 1159], 50, 0.8, 500),
  // Along the bottom, near the lens, f8–44.
  cast("appearance", [1803, 569], 54, 0.95, 600),
  cast("switch", [1951, 644], 56, 0.85, 20),
  // Up the left edge, then over the top, f20–48.
  cast("pricing", [49, 1252], 54, 0.95, 20),
  // Over the top right, f18–50.
  cast("twoFactor", [884, -333], 55, 0.95),
  // The late ring: in from far out, f12–58.
  cast("slider", [1481, -204], 58, 0.85),
  cast("tabs", [1537, 1429], 56, 0.85),
  cast("primary", [-613, 961], 57, 0.85),
  cast("badges", [767, 1914], 58, 0.8),
  cast("checkbox", [321, -966], 59, 0.8),
]

/* Dust between the bodies, plus five arms that feed the core right up to
   the beat's last two frames: the gathering before the hit. */
type Speck = Orbit & { glow: number; arm?: boolean }

const DUST: Speck[] = [
  ...Array.from({ length: 110 }, (_, i) => {
    const a = random(i, 2) * Math.PI * 2
    const r = 260 + random(i, 1) ** 0.7 * 1150
    return {
      x: CX + Math.cos(a) * r,
      y: CY + Math.sin(a) * r,
      land: Math.round(24 + random(i, 3) ** 0.5 * 30),
      size: 0.8 + random(i, 4) * 1.4,
      glow: 0.35 + random(i, 5) * 0.65,
    }
  }),
  // Each arm feeds the core from f44; its tail lands on f58–59.
  ...[0.3, 1.55, 2.8, 4.0, 5.2].flatMap((angle, s) =>
    Array.from({ length: 30 }, (_, i) => {
      const r = 620 + i * 24 + random(s, i, 1) * 50
      const a = angle - i * 0.035 + (random(s, i, 2) - 0.5) * 0.12
      return {
        x: CX + Math.cos(a) * r,
        y: CY + Math.sin(a) * r,
        land: i >= 22 ? T.bursts[i % 2]! : 44 + Math.round(i * 0.62),
        size: 0.9 + random(s, i, 3) * 1.5,
        glow: 0.7 + random(s, i, 4) * 0.3,
        arm: true,
      }
    }),
  ),
]

/* --- Rendering --------------------------------------------------------- */

const onFrame = (x: number, y: number, radius: number) =>
  x + radius > 0 && x - radius < 1920 && y + radius > 0 && y - radius < 1080

/** Depth shade and burn. `scale` converts the melt's blur (screen px, up
 *  to 2.5) into the layer's own space. */
function filterOf(shade: number, burn: number, scale: number) {
  const k = (1 - 0.2 * shade) * (1 + 0.6 * burn)
  const blur = (2.5 * burn) / Math.max(scale, 0.05)
  return (
    [
      Math.abs(k - 1) > 0.005 ? `brightness(${k.toFixed(3)})` : "",
      burn > 0.01 ? `blur(${blur.toFixed(2)}px)` : "",
    ]
      .filter(Boolean)
      .join(" ") || undefined
  )
}

/** A burning body melts from its edges into a soft core: an elliptical mask
 *  (`shape` is the ellipse through the body's corners) that closes as it
 *  burns, so it never fades as a flat slab. */
function meltOf(burn: number, shape: string) {
  if (burn < 0.005) return undefined
  const inner = 100 * (1 - burn) ** 1.3
  const outer = inner + 1 + 45 * burn
  return `radial-gradient(${shape}, #000 ${inner.toFixed(2)}%, transparent ${outer.toFixed(2)}%)`
}

export function Vortex({ frame }: { frame: number }) {
  if (frame >= T.impact) return null
  const live = BODIES.map((body, i) => ({ body, i, p: look(body, frame) }))
    .filter(({ p }) => p.u < 1)
    // Export's pieces keep their order on top while depths still tie.
    .sort(
      (a, b) =>
        a.p.depth - b.p.depth ||
        Number(a.body.kind === "piece") - Number(b.body.kind === "piece") ||
        a.i - b.i,
    )
  return (
    <>
      <Streaks frame={frame} />
      {live.map(({ body, i, p }) =>
        body.kind === "piece" ? (
          <PieceLayer key={i} body={body} p={p} frame={frame} />
        ) : (
          <BillboardLayer key={i} body={body} p={p} />
        ),
      )}
    </>
  )
}

type Look = ReturnType<typeof look>

function PieceLayer({
  body,
  p,
  frame,
}: {
  body: Piece
  p: Look
  frame: number
}) {
  // The line leaves the way every line in the film does: blur out, cubic-in.
  const out = body.piece === "line" ? progress(frame, 0, 18, ease.in) : 0
  const filters = [
    filterOf(p.shade, p.burn, p.scale),
    out > 0.01 ? `blur(${(out * 14).toFixed(2)}px)` : undefined,
  ].filter(Boolean)
  const rect = RECTS[body.piece]
  const mask = meltOf(
    p.burn,
    `${(rect.width / Math.SQRT2).toFixed(1)}px ${(rect.height / Math.SQRT2).toFixed(1)}px at ${rect.cx.toFixed(1)}px ${rect.cy.toFixed(1)}px`,
  )
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        maskImage: mask,
        transformOrigin: `${body.x}px ${body.y}px`,
        transform: `translate(${(p.x - body.x).toFixed(2)}px, ${(p.y - body.y).toFixed(2)}px) rotate(${p.spin.toFixed(3)}deg) scale(${p.scale.toFixed(4)})`,
        opacity: p.fade * (1 - out),
        filter: filters.length ? filters.join(" ") : undefined,
      }}
    >
      {body.piece === "editor" ? (
        <KeyLight x={body.x} y={body.y} u={p.u} />
      ) : null}
      <ExportPiece piece={body.piece} frame={EXPORT_LAST + 1 + frame} />
    </div>
  )
}

/** Export's blue key light on the editor, carried in with it. */
function KeyLight({ x, y, u }: { x: number; y: number; u: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x - 1000,
        top: y - 640,
        width: 2000,
        height: 1280,
        opacity: 1 - clamp01(u * 1.6),
        background:
          "radial-gradient(closest-side, rgba(110,140,255,0.15), rgba(110,140,255,0.05) 55%, transparent)",
      }}
    />
  )
}

function BillboardLayer({ body, p }: { body: Billboard; p: Look }) {
  const actor = CAST[body.cast]
  const w = actor.w * actor.zoom
  const h = actor.h * actor.zoom
  if (!onFrame(p.x, p.y, (Math.hypot(w, h) / 2) * p.scale)) return null
  return (
    <div
      style={{
        position: "absolute",
        left: p.x - w / 2,
        top: p.y - h / 2,
        width: w,
        height: h,
        transform: `rotate(${p.spin.toFixed(3)}deg) scale(${p.scale.toFixed(4)})`,
        opacity: p.fade,
        filter: filterOf(p.shade, p.burn, p.scale),
        maskImage: meltOf(p.burn, "ellipse farthest-corner at 50% 50%"),
      }}
    >
      <div style={{ zoom: actor.zoom, width: actor.w, height: actor.h }}>
        <Actor id={body.cast} />
      </div>
    </div>
  )
}

/** An actor's content never changes, so camera frames skip re-rendering it. */
const Actor = memo(function Actor({ id }: { id: CastId }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {CAST[id].render()}
    </div>
  )
})

/** Light trails behind the bodies and the dust, drawn on one canvas. */
function Streaks({ frame }: { frame: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useLayoutEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return
    const dpr = window.devicePixelRatio || 1
    if (canvas.width !== 1920 * dpr) {
      canvas.width = 1920 * dpr
      canvas.height = 1080 * dpr
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, 1920, 1080)
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    /** A tapered streak along the body's path over the last `lag` frames,
     *  ending at `head` (the frame it has reached). */
    const trail = (
      body: Orbit,
      head: number,
      lag: number,
      width: number,
      alpha: number,
    ) => {
      const steps = 8
      const now = orbit(body, head)
      const tail = orbit(body, frame - lag)
      const gradient = ctx.createLinearGradient(tail.x, tail.y, now.x, now.y)
      gradient.addColorStop(0, "rgba(255,255,255,0)")
      gradient.addColorStop(1, `rgba(255,255,255,${alpha.toFixed(3)})`)
      ctx.strokeStyle = gradient
      ctx.lineWidth = width
      ctx.beginPath()
      for (let k = 0; k <= steps; k++) {
        const q = orbit(body, frame - lag + (k * (head - frame + lag)) / steps)
        if (k === 0) ctx.moveTo(q.x, q.y)
        else ctx.lineTo(q.x, q.y)
      }
      ctx.stroke()
      return now
    }

    for (const body of BODIES) {
      if (body.kind === "piece") continue
      const now = orbit(body, frame)
      if (now.u >= 1) continue
      const before = orbit(body, frame - 1)
      const speed = Math.hypot(now.x - before.x, now.y - before.y)
      const strength = clamp01((speed - 4) / 30)
      trail(body, frame, 7, 1.4 + 3 * strength, 0.2 + 0.5 * strength)
    }
    ctx.fillStyle = "#fff"
    for (const d of DUST) {
      // An arm's streak keeps draining into the core a few frames after its
      // head lands, so the arms feed the hit right up to it.
      const drain = d.arm ? clamp01((frame - d.land) / 3) : 0
      if (frame >= d.land && (!d.arm || drain >= 1)) continue
      const head = Math.min(frame, d.land)
      const probe = orbit(d, head)
      const speed = clamp01((1 - probe.fall) * 1.8)
      const fade = d.arm ? 1 - drain : 1 - clamp01((probe.u - 0.9) / 0.1)
      const alpha = d.glow * (0.3 + 0.7 * speed) * fade
      const width = d.size * probe.depth * (d.arm ? 1 + speed : 1)
      const now = trail(d, head, d.arm ? 6 : 5, width, alpha * 0.85)
      if (frame >= d.land) continue
      ctx.globalAlpha = alpha
      ctx.beginPath()
      ctx.arc(
        now.x,
        now.y,
        d.size * now.depth * (0.55 + 0.45 * now.fall),
        0,
        Math.PI * 2,
      )
      ctx.fill()
      ctx.globalAlpha = 1
    }
  })
  return (
    <canvas
      ref={ref}
      style={{ position: "absolute", inset: 0, width: 1920, height: 1080 }}
    />
  )
}

/** Each burning body's light, drawn over the bodies (see Lights). */
export function burnLights(frame: number): Light[] {
  if (frame >= T.impact) return []
  return BODIES.flatMap((body) => {
    // The line has already blurred out; it leaves no light.
    if (body.kind === "piece" && body.piece === "line") return []
    const p = look(body, frame)
    if (p.u >= 1 || p.burn < 0.01) return []
    const [w, h] =
      body.kind === "piece"
        ? [RECTS[body.piece].width, RECTS[body.piece].height]
        : [
            CAST[body.cast].w * CAST[body.cast].zoom,
            CAST[body.cast].h * CAST[body.cast].zoom,
          ]
    // Its heart ignites: a hot core with a long tail, over the melting body.
    const reach = (Math.hypot(w, h) / 2) * p.scale
    const k = p.burn * (0.4 + 0.6 * p.fade)
    return [{ x: p.x, y: p.y, radius: 40 + reach * 2.2, alpha: 2.4 * k }]
  })
}

/** Brightness of the core from arrivals so far: a running total plus a flare per landing. */
export function coreCharge(frame: number) {
  let landed = 0
  let flare = 0
  for (const body of BODIES) {
    if (frame < body.land) continue
    landed += 1
    flare += Math.exp(-(frame - body.land) / 5)
  }
  // The arms' last specks flicker the core up to the hit.
  for (const d of DUST) {
    if (frame < d.land || d.land < 48) continue
    const k = d.land >= T.bursts[0] ? 0.08 : 0.035
    flare += k * Math.exp(-(frame - d.land) / 4)
  }
  return { landed: landed / BODIES.length, flare: Math.min(1.6, flare) }
}
