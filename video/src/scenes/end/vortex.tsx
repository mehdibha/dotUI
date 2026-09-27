import { clamp01, random } from "../../lib/motion"
import { preset, Theme } from "../../lib/theme"
import type { State } from "../../lib/theme"
import { LARGE, SMALL } from "./tiles"
import { CX, CY, T } from "./timeline"

/* Everything collapses into the dot: the cast orbits on a tilted disk and
   spirals inward, faster as it falls, burning white in the last stretch.
   Cards are billboards (always facing camera) placed in true perspective, so
   they swell as they swing near and shrink as they swing away. Inner rings
   land first; the last card lands on the impact beat. */

type Look = { state: State; mode: "light" | "dark" }

const LOOKS: Look[] = [
  { state: {}, mode: "dark" },
  { state: preset("claude"), mode: "dark" },
  { state: preset("stripe"), mode: "light" },
  { state: preset("linear"), mode: "dark" },
  { state: {}, mode: "light" },
  { state: preset("supabase"), mode: "dark" },
  { state: preset("vercel"), mode: "light" },
  { state: preset("spotify"), mode: "dark" },
  { state: preset("notion"), mode: "light" },
  { state: preset("github"), mode: "dark" },
]

type Body = { r: number; angle: number; land: number }
type Tile = Body & { render: () => React.ReactNode; size: number; look: number }

const RINGS = [
  {
    r: 360,
    kinds: ["switch", "badges", "kbd", "checkbox", "toggles", "radio"],
    size: 0.95,
    land: [38, 46],
  },
  {
    r: 700,
    kinds: [
      "buttons",
      "segmented",
      "slider",
      "tabs",
      "avatars",
      "email",
      "progress",
      "tags",
    ],
    size: 1,
    land: [46, 56],
  },
  {
    r: 1080,
    kinds: [
      "team",
      "twoFactor",
      "login",
      "cookies",
      "domain",
      "empty",
      "approval",
    ],
    size: 0.95,
    land: [53, 59],
  },
] as const

export const TILES: Tile[] = RINGS.flatMap((ring, ri) =>
  ring.kinds.map((kind, i) => {
    const n = ring.kinds.length
    const jitter = random(ri, i, 7) - 0.5
    const last = ri === RINGS.length - 1 && i === n - 1
    return {
      render: (SMALL[kind] ?? LARGE[kind])!,
      r: ring.r * (1 + jitter * 0.14),
      angle: ((i + 0.5 * ri + jitter * 0.35) / n) * Math.PI * 2 - Math.PI / 2,
      size: ring.size * (1 + (random(ri, i, 3) - 0.5) * 0.16),
      land: last
        ? T.impact
        : Math.round(
            ring.land[0] + random(ri, i, 11) * (ring.land[1] - ring.land[0]),
          ),
      look: (i * 3 + ri * 5) % LOOKS.length,
    }
  }),
)

/* Dust between the cards: specks that pour in with them and keep the rush
   dense after the last card has shrunk to a point. */
const DUST: Array<Body & { size: number; glow: number }> = Array.from(
  { length: 110 },
  (_, i) => ({
    r: 240 + random(i, 1) ** 0.7 * 1100,
    angle: random(i, 2) * Math.PI * 2,
    land: Math.round(36 + random(i, 3) ** 0.45 * (T.impact - 36)),
    size: 0.8 + random(i, 4) * 1.4,
    glow: 0.35 + random(i, 5) * 0.65,
  }),
)

const SPIN = 0.0055
const SWIRL = 1.8
// The disk leans back this far from the screen plane; the lens sits DISTANCE away.
const TILT = (58 * Math.PI) / 180
const DISTANCE = 3000

/** A body on the inward spiral at `frame`, projected: screen center, depth scale, fall 1→0. */
function orbit(body: Body, frame: number) {
  const u = clamp01(frame / body.land)
  const fall = 1 - u ** 2.4
  const turn = SPIN * frame + SWIRL * u ** 3
  const theta = body.angle + turn
  const a = Math.cos(theta) * body.r * fall
  const b = Math.sin(theta) * body.r * fall
  const depth = DISTANCE / (DISTANCE - b * Math.sin(TILT))
  return {
    x: CX + a * depth,
    y: CY + b * Math.cos(TILT) * depth,
    depth,
    fall,
    turn: turn * (180 / Math.PI),
    u,
  }
}

/** Where a tile is at `frame`: center (px), scale, spin (deg), burn 0→1, shade 0→1. */
export function tileAt(tile: Tile, frame: number) {
  const o = orbit(tile, frame)
  return {
    ...o,
    scale: tile.size * o.depth * o.fall ** 1.15,
    spin: o.turn * 0.4,
    burn: clamp01((1 - o.fall) ** 5 * 1.6),
    shade: clamp01((1 - o.depth) * 1.3),
  }
}

export function Vortex({ frame }: { frame: number }) {
  if (frame >= T.impact) return null
  const live = TILES.map((tile, i) => ({ tile, i, p: tileAt(tile, frame) }))
    .filter(({ p }) => p.u < 1)
    .sort((a, b) => a.p.depth - b.p.depth)
  return (
    <>
      <Streaks frame={frame} />
      {live.map(({ tile, i, p }, order) => {
        const look = LOOKS[tile.look]!
        const fade = 1 - clamp01((p.u - 0.9) / 0.1)
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              transform: `translate(-50%, -50%) rotate(${p.spin}deg) scale(${p.scale})`,
              opacity: fade,
              zIndex: order + 1,
            }}
          >
            <div style={{ position: "relative" }}>
              <Theme state={look.state} mode={look.mode}>
                {tile.render()}
              </Theme>
              <Veil color="#000" alpha={p.shade} />
              <Veil color="#fff" alpha={p.burn} />
            </div>
          </div>
        )
      })}
    </>
  )
}

function Veil({ color, alpha }: { color: string; alpha: number }) {
  if (alpha < 0.005) return null
  return (
    <div
      style={{
        position: "absolute",
        inset: -1,
        borderRadius: 16,
        background: color,
        opacity: alpha,
        boxShadow:
          color === "#fff"
            ? `0 0 ${48 * alpha}px rgba(255,255,255,${0.7 * alpha})`
            : undefined,
      }}
    />
  )
}

/** Light trails: each falling body leaves a tapered streak along its path. */
function Streaks({ frame }: { frame: number }) {
  const trails: React.ReactNode[] = []
  const trail = (
    key: string,
    body: Body,
    lag: number,
    width: number,
    alpha: number,
  ) => {
    // History may reach before frame 0: the orbit was already turning.
    const now = orbit(body, frame)
    const tail = orbit(body, frame - lag)
    const pts: string[] = []
    for (let k = 0; k <= 4; k++) {
      const p = orbit(body, frame - lag + (k * lag) / 4)
      pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    }
    trails.push(
      <g key={key}>
        <linearGradient
          id={`end-trail-${key}`}
          gradientUnits="userSpaceOnUse"
          x1={tail.x}
          y1={tail.y}
          x2={now.x}
          y2={now.y}
        >
          <stop offset="0" stopColor="#fff" stopOpacity={0} />
          <stop offset="1" stopColor="#fff" stopOpacity={alpha} />
        </linearGradient>
        <polyline
          points={pts.join(" ")}
          fill="none"
          stroke={`url(#end-trail-${key})`}
          strokeWidth={width}
          strokeLinecap="round"
        />
      </g>,
    )
    return now
  }

  TILES.forEach((tile, i) => {
    const now = orbit(tile, frame)
    if (now.u >= 1) return
    const before = orbit(tile, frame - 1)
    const speed = Math.hypot(now.x - before.x, now.y - before.y)
    const strength = clamp01((speed - 2) / 30)
    trail(`t${i}`, tile, 6, 1.2 + 2.8 * strength, 0.25 + 0.55 * strength)
  })
  const heads: React.ReactNode[] = []
  DUST.forEach((d, i) => {
    const probe = orbit(d, frame)
    if (probe.u >= 1) return
    const speed = clamp01((1 - probe.fall) * 1.8)
    const alpha =
      d.glow * (0.3 + 0.7 * speed) * (1 - clamp01((probe.u - 0.9) / 0.1))
    const now = trail(`d${i}`, d, 4, d.size * probe.depth, alpha * 0.8)
    heads.push(
      <circle
        key={`h${i}`}
        cx={now.x.toFixed(1)}
        cy={now.y.toFixed(1)}
        r={(d.size * now.depth * (0.55 + 0.45 * now.fall)).toFixed(2)}
        fillOpacity={alpha.toFixed(3)}
      />,
    )
  })

  return (
    <svg
      width={1920}
      height={1080}
      style={{ position: "absolute", inset: 0, overflow: "visible", zIndex: 0 }}
    >
      {trails}
      <g fill="#fff">{heads}</g>
    </svg>
  )
}

/** Brightness of the core from arrivals so far: a running total plus a flare per landing. */
export function coreCharge(frame: number) {
  let landed = 0
  let flare = 0
  for (const tile of TILES) {
    if (frame < tile.land) continue
    landed += 1
    flare += Math.exp(-(frame - tile.land) / 5)
  }
  return { landed: landed / TILES.length, flare: Math.min(1.5, flare) }
}
