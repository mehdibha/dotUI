import type { CSSProperties } from "react"
import { AbsoluteFill, useCurrentFrame } from "remotion"

import { clamp01, ease, lerp, progress, springAt } from "../lib/motion"
import { Stage } from "../lib/stage"
import { Theme } from "../lib/theme"
import { BEAT } from "../lib/timing"
import { Headline } from "../lib/type"
import { useAnchor } from "./wall/anchor"
import { ClickRing, glintAt } from "./wall/fx"
import { HERO_CSS } from "./wall/hero"
import { TILES_LAYOUT, WALL_H, WALL_W } from "./wall/layout"
import type { Tile } from "./wall/layout"
import { PlaneGrid } from "./wall/plane-grid"
import { HeroBox, TileBox } from "./wall/tile-box"
import { LIVE } from "./wall/tiles"
import { cameraAt, SPEED, T } from "./wall/timeline"
import { Title } from "./wall/title"

/* Scene 2 — the wall of someone else's components. The Open's dot is the
   inner dot of a radio; the radio is selected on the beat and a ripple of
   real registry tiles pops out from it while the camera pulls back and
   tilts the wall into space. "Most are built on someone else's." Then the
   wall recedes and the title resolves over it. */

const HERO = TILES_LAYOUT.find((t) => t.kind === "radio")!

const PERSPECTIVE = 1600

const POP = { damping: 14, stiffness: 150, mass: 0.8 }

function tileStart(t: Tile, [ox, oy]: [number, number]) {
  const dx = Math.max(t.x - ox, 0, ox - (t.x + t.w))
  const dy = Math.max(t.y - oy, 0, oy - (t.y + t.h))
  return T.click + 2 + Math.hypot(dx, dy) / SPEED
}

export function Wall() {
  const frame = useCurrentFrame()
  const { anchor, probe } = useAnchor(HERO)
  const [ox, oy] = anchor
  const cam = cameraAt(frame)
  const tick = Math.floor(frame / BEAT)
  /* Chrome rasterizes content under a perspective transform at 1×, so a
     transform zoom above 1 goes soft; the part of the zoom above 1 is layout
     zoom instead, and the transform only ever scales down. */
  const zoom = Math.max(1, cam.scale)
  const glint = glintAt(frame)

  return (
    <Stage grid={false}>
      <style>{HERO_CSS}</style>
      {probe}
      <AbsoluteFill
        style={{
          perspective: PERSPECTIVE,
          filter: wallFilter(frame, cam.light),
        }}
      >
        <AbsoluteFill
          style={{
            transformStyle: "preserve-3d",
            transform: `translate3d(${cam.x}px, ${cam.y}px, ${cam.z}px) rotateX(${cam.rotateX}deg) rotateY(${cam.rotateY}deg) rotateZ(${cam.rotateZ}deg) scale(${cam.scale / zoom})`,
          }}
        >
          <PlaneGrid frame={frame} zoom={zoom} />
          <div
            style={{
              position: "absolute",
              left: 960 - ox * zoom,
              top: 540 - oy * zoom,
            }}
          >
            <div
              style={{
                position: "relative",
                width: WALL_W,
                height: WALL_H,
                zoom,
              }}
            >
              <Theme mode="dark">
                {TILES_LAYOUT.map((t) => {
                  const pop = springAt(frame, tileStart(t, anchor), POP)
                  if (t === HERO)
                    return (
                      <HeroBox
                        key={t.id}
                        tile={t}
                        pop={pop}
                        vars={heroAt(frame, cam.scale)}
                        glint={glint}
                      />
                    )
                  const far = Math.hypot(t.x + t.w / 2 - ox, t.y + t.h / 2 - oy)
                  return (
                    <TileBox
                      key={t.id}
                      tile={t}
                      pop={pop}
                      edge={1 - 0.6 * smooth(clamp01((far - 700) / 1300))}
                      tick={LIVE.has(t.kind) ? tick : 0}
                      glint={glint}
                    />
                  )
                })}
              </Theme>
              <ClickRing frame={frame} anchor={anchor} />
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
      <Scrim frame={frame} />
      <Headline
        lines={[
          { text: "Most are built on" },
          { text: "someone else's.", muted: true },
        ]}
        start={T.line}
        end={T.lineOut}
        size={116}
        stagger={5}
      />
      {frame >= T.mark ? <Title start={T.mark} /> : null}
    </Stage>
  )
}

const smooth = (t: number) => t * t * (3 - 2 * t)

/** The hero radio: the Open's dot → a ring around it → the selection. */
function heroAt(frame: number, scale: number): CSSProperties {
  // The inner dot is 6 px at 1×; hold it at the Open's 10 px on frame 0.
  const base = 10 / (6 * scale)
  const grow = progress(frame, 2, 22, ease.out)
  const press = progress(frame, T.click - 3, 3, ease.in)
  const release = springAt(frame, T.click, {
    damping: 11,
    stiffness: 230,
    mass: 0.5,
  })
  const dot =
    frame < T.click
      ? lerp(base, 1, grow) * (1 - 0.3 * press)
      : lerp(0.7, 1, release)
  return {
    "--rest": progress(frame, 12, 26, ease.out),
    "--label": progress(frame, 6, 24, ease.out),
    "--ring": progress(frame, 3, 18, ease.out),
    "--fill": progress(frame, T.click, 9, ease.out),
    "--dark": progress(frame, T.click + 1, 5, ease.out),
    "--dot": dot,
  } as CSSProperties
}

function wallFilter(frame: number, light: number) {
  const blur = 2.2 * progress(frame, T.recede + 10, 80, ease.inOut)
  const parts: string[] = []
  if (light < 0.999) parts.push(`brightness(${light.toFixed(3)})`)
  if (blur > 0.05) parts.push(`blur(${blur.toFixed(2)}px)`)
  return parts.length ? parts.join(" ") : undefined
}

/** A soft pool of dark behind the line, so the type reads over the wall. */
function Scrim({ frame }: { frame: number }) {
  const o =
    progress(frame, T.line - 10, 30, ease.inOut) *
    (1 - 0.35 * progress(frame, T.lineOut, 30, ease.inOut))
  if (o <= 0) return null
  return (
    <AbsoluteFill
      style={{
        opacity: o,
        background:
          "radial-gradient(ellipse 48% 38% at 50% 50%, rgba(8,8,10,0.82), rgba(8,8,10,0.4) 60%, transparent 100%)",
        pointerEvents: "none",
      }}
    />
  )
}
