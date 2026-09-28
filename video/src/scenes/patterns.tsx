import { useRef } from "react"
import { AbsoluteFill, getInputProps, useCurrentFrame } from "remotion"
const DBG = getInputProps() as Record<string, boolean>

import { clamp01, ease, keys, progress, random, springAt } from "../lib/motion"
import { INK, Stage } from "../lib/stage"
import type { State } from "../lib/theme"
import { Theme } from "../lib/theme"
import { BAR, HEIGHT, WIDTH } from "../lib/timing"
import { BlurWords, HEADLINE, MUTED, TOP_ANCHOR, TYPE } from "../lib/type"
import { BUILT, BUILT_MODE } from "./axes/timeline"
import {
  HANDOFF_SCALE,
  HandoffCard,
  IconsReady,
  LOOK,
  LOOK_MODE,
} from "./compose/steps"
import { camAt, project } from "./patterns/camera"
import { Canvas } from "./patterns/canvas"
import { PlayerDriver, useFrozenClock } from "./patterns/player"
import { SCREEN_CSS, Surface } from "./patterns/screen"
import type { Placement, Tile } from "./patterns/tiles"
import { placement, TILE_H, TILE_W, TILES } from "./patterns/tiles"
import { crossing, glint, waveFront, waveLift } from "./patterns/wave"

/* 6 · Patterns — 4 bars. Out of Compose's card: its canvas of patterns grows
   back around it in the system the viewer built, the camera pulls back and
   leans the plane, and a field of complete products — still in the default
   look — rises out of the dark. A low fly-past over two screens; on bar 3 one
   theme wave carries the built system across every screen; bar 4 lands on
   one product and plays it, a step on every beat, still gliding at the cut. */

const BEFORE: State = {}

/** The screen bar 4 settles on. */
const isHero = (tile: Tile) => tile.c === 3 && tile.r === -1
/** A safety cap: the camera is framed to keep fewer in shot. */
const MAX_SCREENS = 9
const RADIUS = 22
/** Light falling on the glass from above, so dark screens read as lit panels. */
const SHEEN =
  "linear-gradient(172deg, rgba(255,255,255,0.075) 0%, rgba(255,255,255,0.02) 38%, rgba(255,255,255,0) 60%)"

/* Film scrubs CSS animations by setting --video-time on <html> every frame,
   which restyles the whole document (~0.5 s a frame with this many apps).
   Nothing here animates by CSS, so the scene pins it. */
const PINNED = "html{--video-time:0!important}"

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

/** A screen sliding out of frame fades with the vignette, so the field only
    mounts what reads. 0 below 2 % of the frame, whole from 7 %. */
function edgeFade(shown: number) {
  const t = clamp01((shown - 0.02) / 0.05)
  return t * t * (3 - 2 * t)
}

type Shot = { tile: Tile; at: Placement; opacity: number; dim: number }

export function Patterns() {
  const frame = useCurrentFrame()
  useFrozenClock()
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
  const spotlight = DBG.ns ? 0 : progress(frame, 336, 100, ease.inOut)

  const shots: Shot[] = []
  for (const tile of TILES) {
    const rise = riseAt(frame, tile)
    if (rise.fade <= 0) continue
    const z =
      rise.z +
      floatAt(frame, tile) * clamp01((frame - 60) / 90) +
      waveLift(tile, front)
    const at = placement(cam, tile, z)
    if (!at) continue
    const opacity = rise.fade * edgeFade(at.shown)
    // A screen sinking under the fog goes to ink with it, so it never pops.
    const haze = lean * (1 - clamp01((at.bounds.bottom - 20) / 140))
    const dim =
      (1 - rise.fade) * 0.6 + haze + (isHero(tile) ? 0 : spotlight * 0.42)
    if (opacity < 0.01 || dim > 0.92) continue
    shots.push({ tile, at, opacity, dim })
  }
  // What reads most wins the cap; painted far to near.
  const shown = shots
    .sort((p, q) => q.at.shown * (1 - q.dim) - p.at.shown * (1 - p.dim))
    .slice(0, MAX_SCREENS)
    .sort((p, q) => p.at.depth - q.at.depth)

  return (
    <Stage vignette={false} {...grid}>
      <style>{PINNED + SCREEN_CSS}</style>
      <Theme state={BUILT} mode={BUILT_MODE}>
        <IconsReady />
      </Theme>
      {shown.map(({ tile, at, opacity, dim }) => (
        <Screen
          key={tile.id}
          tile={tile}
          at={at}
          opacity={opacity}
          dim={dim}
          frame={frame}
          front={front}
          hero={isHero(tile)}
        />
      ))}
      <Lens frame={frame} lean={lean} />
      <Scrim frame={frame} />
      <Title frame={frame} />
    </Stage>
  )
}

/* Static grain at 1.2 % over everything: ±1–2 LSB, so the near-black ramps
   dither instead of banding in the encode. Plain alpha, not a blend mode —
   an overlay blend of noise shifts the look's colors. */
const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n' color-interpolation-filters='sRGB'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' seed='11' stitchTiles='stitch'/><feColorMatrix values='1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 0 0 0 1'/></filter><rect width='160' height='160' filter='url(%23n)'/></svg>",
)}")`

/* One overlay for the whole lens: the far field sinking into the ground's
   ink as the plane leans (a short ramp, so a light screen near the top isn't
   washed grey); the Stage's vignette, eased per shot (full on the cut, where
   it matches Compose); the near edge held down once the wave lights the
   field; and the grain. */
function Lens({ frame, lean }: { frame: number; lean: number }) {
  const vignette = keys(frame, [
    [0, 1],
    [30, 0.35],
    [100, 0.85],
    [250, 0.85],
    [320, 0.5],
    [479, 0.4],
  ])
  // Held while the lit field fills the frame; lifted off the landing product.
  const near =
    progress(frame, 262, 60, ease.inOut) *
    (1 - progress(frame, 370, 70, ease.inOut))
  const fog = lean * lean
  const ink = (a: number) => `rgba(8,8,10,${a.toFixed(3)})`
  const layers = [
    `radial-gradient(ellipse 90% 80% at 50% 45%, transparent 55%, rgba(0,0,0,${(0.55 * vignette).toFixed(3)}) 100%)`,
  ]
  if (fog > 0.01)
    layers.push(
      `linear-gradient(to bottom, ${ink(fog)} 0%, ${ink(0.78 * fog)} 6%, ${ink(0.3 * fog)} 15%, ${ink(0)} 27%)`,
    )
  if (near > 0)
    layers.push(
      `linear-gradient(to top, ${ink(0.34 * near)} 0%, ${ink(0)} 30%)`,
    )
  return (
    <>
      <AbsoluteFill
        style={{ pointerEvents: "none", background: layers.join(", ") }}
      />
      {frame > 0 && !DBG.nr ? (
        <AbsoluteFill
          style={{
            pointerEvents: "none",
            backgroundImage: GRAIN,
            opacity: 0.012,
          }}
        />
      ) : null}
    </>
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
          "radial-gradient(ellipse 48% 24% at 50% 23%, rgba(8,8,10,0.92) 0%, rgba(8,8,10,0.66) 50%, rgba(8,8,10,0) 100%)",
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
  opacity,
  dim,
  frame,
  front,
  hero,
}: {
  tile: Tile
  at: Placement
  opacity: number
  dim: number
  frame: number
  front: number
  hero: boolean
}) {
  const root = useRef<HTMLDivElement>(null)
  const isCanvas = tile.content === "canvas"
  // The canvas is already in the built system; only products change.
  const wave = isCanvas ? { state: "before" as const } : crossing(tile, front)
  const light = isCanvas || DBG.ng ? null : glint(tile, front)
  const zoom = at.density
  return (
    <div
      ref={root}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: TILE_W * zoom,
        height: TILE_H * zoom,
        transformOrigin: "0 0",
        transform: at.matrix,
        opacity,
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
          // The canvas draws its own edge while it grows out of the card.
          boxShadow: isCanvas
            ? undefined
            : "0 0 0 1.5px rgba(255,255,255,0.17)",
        }}
      >
        {isCanvas ? (
          <Surface content="canvas" state={LOOK} mode={LOOK_MODE}>
            <Canvas frame={frame} />
          </Surface>
        ) : (
          <>
            {wave.state !== "after" ? (
              <Surface
                key="before"
                content={tile.content}
                state={BEFORE}
                mode="dark"
              />
            ) : null}
            {wave.state !== "before" ? (
              <div
                key="after"
                style={{
                  position: "absolute",
                  inset: 0,
                  maskImage:
                    wave.state === "crossing" && !DBG.nm
                      ? wave.mask
                      : undefined,
                }}
              >
                <Surface
                  content={tile.content}
                  state={BUILT}
                  mode={BUILT_MODE}
                />
              </div>
            ) : null}
            {wave.state === "after" ? null : (
              <div
                style={{ position: "absolute", inset: 0, background: SHEEN }}
              />
            )}
          </>
        )}
        {light ? (
          <div style={{ position: "absolute", inset: 0, background: light }} />
        ) : null}
        {dim > 0.005 && !DBG.nD ? (
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
      {hero && !DBG.nd ? <PlayerDriver frame={frame} root={root} /> : null}
    </div>
  )
}
