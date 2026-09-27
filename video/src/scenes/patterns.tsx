import type { CSSProperties } from "react"
import { AbsoluteFill, useCurrentFrame } from "remotion"

import { clamp01, ease, progress, random, springAt } from "../lib/motion"
import { INK, Stage } from "../lib/stage"
import type { State } from "../lib/theme"
import { preset } from "../lib/theme"
import { BAR, HEIGHT, WIDTH } from "../lib/timing"
import { Headline } from "../lib/type"
import { camAt, HERO } from "./patterns/camera"
import { Canvas, expandAt } from "./patterns/canvas"
import { SCREEN_CSS, Surface } from "./patterns/screen"
import type { Placement, Tile } from "./patterns/tiles"
import { onScreen, placement, TILE_H, TILE_W, TILES } from "./patterns/tiles"
import {
  crossing,
  glint,
  WAVE_END,
  WAVE_START,
  waveFront,
  waveLift,
} from "./patterns/wave"

/* Patterns — from the Compose card to a vast tilted field of complete
   products. The camera pulls back out of the card; the pattern canvas it lives
   in grows back out of it; product screens rise out of the dark as the plane
   tilts isometric; the camera glides; one theme wave re-skins every screen. */

const BEFORE: State = {}
const AFTER: State = preset("claude")

const RADIUS = 22
/** Screens whose near edge is above this line sit wholly in the fog. */
const FOG_LINE = 250

const RISE = { damping: 15, stiffness: 110, mass: 1 }

/** Screens surface from below the plane ring by ring as the camera pulls back, overshooting a touch. */
function riseAt(frame: number, tile: Tile) {
  if (tile.content === "canvas") return { lift: 0, fade: 1 }
  const start = 30 + Math.hypot(tile.c, tile.r * 1.3) * 14
  return {
    lift: -700 * (1 - springAt(frame, start, RISE)),
    fade: progress(frame, start, 22, ease.out),
  }
}

/** A slow swell across the field, so the plane never sits dead still. */
function floatAt(frame: number, tile: Tile) {
  const phase = random(tile.c, tile.r, 3) * Math.PI * 2
  return 10 * Math.sin((frame / (2 * BAR)) * Math.PI * 2 + phase)
}

export function Patterns() {
  const frame = useCurrentFrame()
  const cam = camAt(frame)
  const front = waveFront(frame)
  const waving = frame >= WAVE_START && frame <= WAVE_END + 20

  // The ground's dots ride the pull-back, then hand the floor to the plane.
  const zoom = cam.scale / camAt(0).scale
  const gridFade = 1 - progress(frame, 16, 40, ease.inOut)

  // The landing puts one product in the light and lets the rest fall back.
  const spotlight = progress(frame, 380, 90, ease.inOut)

  const placed: Array<{
    tile: Tile
    at: Placement
    rise: number
    dim: number
  }> = []
  for (const tile of TILES) {
    const { lift, fade: rise } = riseAt(frame, tile)
    if (rise <= 0) continue
    const z =
      lift +
      floatAt(frame, tile) * clamp01(frame / 90) +
      (waving ? waveLift(tile, front) : 0)
    const at = placement(cam, tile, z)
    if (!at || !onScreen(at)) continue
    // Screens deep in the fog are faded out, so they cost nothing.
    const haze = clamp01((at.bounds.bottom - FOG_LINE) / 160)
    if (haze <= 0) continue
    placed.push({
      tile,
      at,
      rise: rise * haze,
      dim:
        clamp01(-lift / 700) * 0.5 +
        (tile.c === HERO.c && tile.r === HERO.r ? 0 : spotlight * 0.5),
    })
  }
  placed.sort((p, q) => p.at.depth - q.at.depth)

  const tilt = clamp01(cam.tiltX / 45)

  return (
    <Stage
      gridOpacity={gridFade}
      gridScale={zoom}
      gridOffset={[(WIDTH / 2) * (1 - zoom), (HEIGHT / 2) * (1 - zoom)]}
      style={{ "--video-time": 0 } as CSSProperties}
    >
      <style>{SCREEN_CSS}</style>
      {placed.map(({ tile, at, rise, dim }) => (
        <TileView
          key={tile.id}
          tile={tile}
          at={at}
          rise={rise}
          dim={dim}
          frame={frame}
          front={front}
        />
      ))}
      <Focus amount={tilt} />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          opacity: tilt,
          background: `linear-gradient(to bottom, ${INK} 0%, rgba(8,8,10,0.92) 12%, rgba(8,8,10,0.55) 30%, rgba(8,8,10,0) 52%, rgba(8,8,10,0) 82%, rgba(8,8,10,0.5) 100%)`,
        }}
      />
      <Scrim frame={frame} />
      <Headline
        lines={[
          { text: "From components", at: 90 },
          { text: "to complete products.", muted: true, at: 120 },
        ]}
        start={90}
        end={210}
        size={120}
        y={-262}
      />
    </Stage>
  )
}

/** Tilt-shift: the far and near edges of the field fall out of focus. */
function Focus({ amount }: { amount: number }) {
  if (amount <= 0.01) return null
  const band = (mask: string, blur: number): CSSProperties => ({
    pointerEvents: "none",
    opacity: amount,
    backdropFilter: `blur(${blur}px)`,
    maskImage: mask,
  })
  return (
    <>
      <AbsoluteFill
        style={band(
          "linear-gradient(to bottom, black 0%, black 10%, transparent 36%)",
          5,
        )}
      />
      <AbsoluteFill
        style={band("linear-gradient(to top, black 0%, transparent 16%)", 2)}
      />
    </>
  )
}

/** A pool of dark behind the words, so they sit on the fogged horizon. */
function Scrim({ frame }: { frame: number }) {
  const o = progress(frame, 70, 40) * (1 - progress(frame, 206, 24, ease.in))
  if (o <= 0) return null
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity: o,
        background:
          "radial-gradient(ellipse 52% 30% at 50% 26%, rgba(8,8,10,0.9) 0%, rgba(8,8,10,0.6) 50%, rgba(8,8,10,0) 100%)",
      }}
    />
  )
}

function TileView({
  tile,
  at,
  rise,
  dim,
  frame,
  front,
}: {
  tile: Tile
  at: Placement
  rise: number
  dim: number
  frame: number
  front: number
}) {
  const isCenter = tile.content === "canvas"
  const shade = clamp01((1 - at.depth) * 1.1) + dim

  const wave = crossing(tile, front)
  const mode = tile.light ? "light" : "dark"
  const flipped = tile.light ? "dark" : "light"
  const canvas = isCenter ? <Canvas frame={frame} /> : null
  // The canvas draws its own edge while it grows; the rim joins once it's a screen.
  const rim = isCenter ? 0.12 * expandAt(frame) : 0.12
  const light = glint(tile, front)

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: TILE_W,
        height: TILE_H,
        transformOrigin: "0 0",
        transform: at.matrix,
        opacity: rise,
        borderRadius: RADIUS,
        overflow: "hidden",
        boxShadow: `0 0 0 1.5px rgba(255,255,255,${rim})`,
      }}
    >
      {wave.state !== "after" ? (
        <Surface
          content={tile.content}
          state={BEFORE}
          mode={mode}
          bare={isCenter}
        >
          {canvas}
        </Surface>
      ) : null}
      {wave.state !== "before" ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            maskImage: wave.mask,
          }}
        >
          <Surface
            content={tile.content}
            state={AFTER}
            mode={flipped}
            bare={isCenter}
          >
            {canvas}
          </Surface>
        </div>
      ) : null}
      {light ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: light,
            mixBlendMode: "screen",
          }}
        />
      ) : null}
      {shade > 0.01 ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: INK,
            opacity: clamp01(shade),
          }}
        />
      ) : null}
    </div>
  )
}
