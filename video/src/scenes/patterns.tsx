import type { CSSProperties } from "react"
import { AbsoluteFill, useCurrentFrame } from "remotion"

import { clamp01, ease, keys, progress, random, springAt } from "../lib/motion"
import { INK, Stage } from "../lib/stage"
import type { State } from "../lib/theme"
import { preset } from "../lib/theme"
import { BAR, HEIGHT, WIDTH } from "../lib/timing"
import { BlurWords, HEADLINE, MUTED, TOP_ANCHOR, TYPE } from "../lib/type"
import { HANDOFF_SCALE, HandoffCard } from "./compose/steps"
import { camAt, project } from "./patterns/camera"
import { Canvas } from "./patterns/canvas"
import { SCREEN_CSS, Surface } from "./patterns/screen"
import type { Placement, Tile } from "./patterns/tiles"
import { placement, TILE_H, TILE_W, TILES, visible } from "./patterns/tiles"
import { crossing, glint, waveFront, waveLift } from "./patterns/wave"

/* 6 · Patterns — 4 bars. Out of Compose's card: its canvas of patterns grows
   back around it, the camera pulls back and leans the plane, and a field of
   complete products rises out of the dark. A low fly-past over two screens;
   on bar 3 one theme wave lights every screen in a new look; the camera
   drifts onto one product, still gliding at the cut. */

const BEFORE: State = {}
const AFTER: State = preset("claude")

/** The screen bar 4 settles on. */
const HERO = { c: 3, r: -1 }
const MAX_SCREENS = 14
const RADIUS = 22
/** Light falling on the glass from above, so dark screens read as lit panels. */
const SHEEN =
  "linear-gradient(172deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.015) 38%, rgba(255,255,255,0) 60%)"

const RISE = { damping: 15, stiffness: 110, mass: 1 }

/** Screens surface out of the depth ring by ring as the camera pulls back. */
function riseAt(frame: number, tile: Tile) {
  if (tile.content === "canvas") return { z: 0, fade: 1 }
  const start = 24 + Math.hypot(tile.c, tile.r * 1.3) * 12
  return {
    z: -900 * (1 - springAt(frame, start, RISE)),
    fade: progress(frame, start, 20, ease.out),
  }
}

/** A slow swell across the field, so no screen sits dead still. */
function floatAt(frame: number, tile: Tile) {
  const phase = random(tile.c, tile.r, 3) * Math.PI * 2
  return 6 * Math.sin((frame / (2 * BAR)) * Math.PI * 2 + phase)
}

export function Patterns() {
  const frame = useCurrentFrame()
  const cam = camAt(frame)
  const front = waveFront(frame)
  const lean = clamp01(cam.tiltX / 26)

  // The ground's dots ride the pull-back at half its rate (as in Compose),
  // then hand the floor to the field.
  const origin = project(cam, 0, 0)
  const gridFade = 1 - progress(frame, 6, 40, ease.inOut)
  const grid = {
    grid: gridFade > 0,
    gridOpacity: gridFade,
    gridScale: 1 + (cam.scale / HANDOFF_SCALE - 1) * 0.5,
    gridOffset: [
      (origin.x - WIDTH / 2) * 0.3,
      (origin.y - HEIGHT / 2) * 0.3,
    ] as [number, number],
  }

  // The cut: Compose's last frame, verbatim.
  if (frame === 0) {
    return (
      <Stage vignette={false} {...grid}>
        <HandoffCard />
        <Lens frame={frame} lean={0} />
      </Stage>
    )
  }

  // Bar 4 puts one product in the light and lets the rest fall back.
  const spotlight = progress(frame, 372, 90, ease.inOut)

  const shots: Array<{ tile: Tile; at: Placement; fade: number; dim: number }> =
    []
  for (const tile of TILES) {
    const rise = riseAt(frame, tile)
    if (rise.fade <= 0) continue
    const z =
      rise.z +
      floatAt(frame, tile) * clamp01((frame - 60) / 90) +
      waveLift(tile, front)
    const at = placement(cam, tile, z)
    if (!at || !visible(at)) continue
    // A screen sinking under the fog goes to ink with it, so it never pops.
    const haze = lean * (1 - clamp01((at.bounds.bottom - 20) / 140))
    const hero = tile.c === HERO.c && tile.r === HERO.r
    shots.push({
      tile,
      at,
      fade: rise.fade,
      dim: (1 - rise.fade) * 0.6 + haze + (hero ? 0 : spotlight * 0.42),
    })
  }
  // Only what the camera really sees, painted far to near.
  const shown = shots
    .sort((p, q) => q.at.area - p.at.area)
    .slice(0, MAX_SCREENS)
    .sort((p, q) => p.at.depth - q.at.depth)

  return (
    <Stage
      vignette={false}
      {...grid}
      style={{ "--video-time": 0 } as CSSProperties}
    >
      <style>{SCREEN_CSS}</style>
      {shown.map(({ tile, at, fade, dim }) => (
        <Screen
          key={tile.id}
          tile={tile}
          at={at}
          fade={fade}
          dim={dim}
          frame={frame}
          front={front}
        />
      ))}
      <Lens frame={frame} lean={lean} />
      <Scrim frame={frame} />
      <Title frame={frame} />
    </Stage>
  )
}

/* One overlay for the whole lens, so it costs one layer: the far field sinks
   into the ground's ink as the plane leans; the Stage's vignette, eased per
   shot (full on the cut, where it matches Compose; light while bright screens
   fill the frame); and the near edge held down once the wave lights the field. */
function Lens({ frame, lean }: { frame: number; lean: number }) {
  const vignette = keys(frame, [
    [0, 1],
    [30, 0.35],
    [100, 0.85],
    [250, 0.85],
    [320, 0.5],
    [479, 0.4],
  ])
  const near = progress(frame, 262, 60, ease.inOut)
  const ink = (a: number) => `rgba(8,8,10,${a.toFixed(3)})`
  const layers = [
    `radial-gradient(ellipse 90% 80% at 50% 45%, transparent 55%, rgba(0,0,0,${(0.55 * vignette).toFixed(3)}) 100%)`,
  ]
  if (lean > 0.01)
    layers.push(
      `linear-gradient(to bottom, ${ink(lean)} 0%, ${ink(0.86 * lean)} 9%, ${ink(0.45 * lean)} 24%, ${ink(0)} 44%)`,
    )
  if (near > 0)
    layers.push(
      `linear-gradient(to top, ${ink(0.34 * near)} 0%, ${ink(0)} 30%)`,
    )
  return (
    <AbsoluteFill
      style={{ pointerEvents: "none", background: layers.join(", ") }}
    />
  )
}

const LINE_1 = 60
const LINE_2 = 90
const TITLE_OUT = 164

/** A pool of dark behind the words, so they sit on the fogged horizon. */
function Scrim({ frame }: { frame: number }) {
  const o =
    progress(frame, LINE_1 - 16, 36) *
    (1 - progress(frame, TITLE_OUT + 4, 22, ease.in))
  if (o <= 0) return null
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity: o,
        background:
          "radial-gradient(ellipse 50% 30% at 50% 24%, rgba(8,8,10,0.92) 0%, rgba(8,8,10,0.66) 50%, rgba(8,8,10,0) 100%)",
      }}
    />
  )
}

/** Cap line of the first line on TOP_ANCHOR. */
const CAP_OFFSET = 0.165

function Title({ frame }: { frame: number }) {
  if (frame < LINE_1 - 2 || frame > TITLE_OUT + 20) return null
  return (
    <div
      style={{
        ...HEADLINE,
        position: "absolute",
        left: 0,
        right: 0,
        top: TOP_ANCHOR - TYPE.statement * CAP_OFFSET,
        fontSize: TYPE.statement,
        textAlign: "center",
        pointerEvents: "none",
      }}
    >
      <div>
        <BlurWords text="From components" start={LINE_1} end={TITLE_OUT} />
      </div>
      <div style={{ color: MUTED }}>
        <BlurWords
          text="to complete products."
          start={LINE_2}
          end={TITLE_OUT}
        />
      </div>
    </div>
  )
}

function Screen({
  tile,
  at,
  fade,
  dim,
  frame,
  front,
}: {
  tile: Tile
  at: Placement
  fade: number
  dim: number
  frame: number
  front: number
}) {
  const isCanvas = tile.content === "canvas"
  const wave = crossing(tile, front)
  const mode = isCanvas ? "light" : "dark"
  const content = isCanvas ? <Canvas frame={frame} /> : null
  const light = glint(tile, front)
  // The canvas draws its own edge while it grows out of the card.
  const rim = isCanvas ? 0 : 0.14

  const zoom = at.density
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: TILE_W * zoom,
        height: TILE_H * zoom,
        transformOrigin: "0 0",
        transform: at.matrix,
        opacity: fade,
      }}
    >
      {/* The corners clip here, in paint: on the projected layer itself they'd
          cost a mask layer as large as the screen. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: TILE_W,
          height: TILE_H,
          zoom,
          borderRadius: RADIUS,
          overflow: "hidden",
          boxShadow: rim ? `0 0 0 1.5px rgba(255,255,255,${rim})` : undefined,
        }}
      >
        {wave.state !== "after" ? (
          <Surface
            key="before"
            content={tile.content}
            state={BEFORE}
            mode={mode}
          >
            {content}
          </Surface>
        ) : null}
        {wave.state !== "before" ? (
          <div
            key="after"
            style={{
              position: "absolute",
              inset: 0,
              maskImage: wave.state === "crossing" ? wave.mask : undefined,
            }}
          >
            <Surface content={tile.content} state={AFTER} mode="light">
              {content}
            </Surface>
          </div>
        ) : null}
        {isCanvas || wave.state === "after" ? null : (
          <div style={{ position: "absolute", inset: 0, background: SHEEN }} />
        )}
        {light ? (
          <div style={{ position: "absolute", inset: 0, background: light }} />
        ) : null}
        {dim > 0.005 ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: INK,
              opacity: clamp01(dim),
            }}
          />
        ) : null}
      </div>
    </div>
  )
}
