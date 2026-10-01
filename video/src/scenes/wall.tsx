import type { CSSProperties } from "react"
import { AbsoluteFill, useCurrentFrame } from "remotion"

import { ease, lerp, progress, springAt } from "../lib/motion"
import { Stage } from "../lib/stage"
import { Theme } from "../lib/theme"
import { BEAT } from "../lib/timing"
import { Headline, TYPE } from "../lib/type"
import { useAnchor } from "./wall/anchor"
import { ClickRing } from "./wall/fx"
import { HERO_CSS } from "./wall/hero"
import { TILES_LAYOUT, WALL_H, WALL_W } from "./wall/layout"
import type { Tile } from "./wall/layout"
import { PlaneGrid } from "./wall/plane-grid"
import { HeroBox, TileBox } from "./wall/tile-box"
import { LIVE } from "./wall/tiles"
import type { Cam } from "./wall/timeline"
import { cameraAt, layoutZoom, PERSPECTIVE, SPEED, T } from "./wall/timeline"
import { Title } from "./wall/title"

/* Scene 2 — the wall of someone else's components. The Open's dot is the
   inner dot of a radio; the radio is selected on the beat and a ripple of
   real registry tiles pops out from it while the camera pulls back and
   tilts the wall into space. "Most are built on someone else's." Then the
   wall falls back and the dotUI Studio lockup resolves over it. */

const HERO = TILES_LAYOUT.find((t) => t.kind === "radio")!

const POP = { damping: 14, stiffness: 150, mass: 0.8 }

/** A touch below the headline's second line, over the UI just under it. */
const LINE_2_Y = 630

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
  const zoom = layoutZoom(cam)

  return (
    <Stage grid={false}>
      <style>{HERO_CSS}</style>
      {probe}
      <AbsoluteFill
        style={{ perspective: PERSPECTIVE, filter: wallFilter(cam) }}
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
                  if (t === HERO)
                    return (
                      <HeroBox
                        key={t.id}
                        tile={t}
                        chrome={progress(frame, T.click + 6, 24, ease.out)}
                        vars={heroAt(frame, cam.scale)}
                      />
                    )
                  const far = Math.hypot(t.x + t.w / 2 - ox, t.y + t.h / 2 - oy)
                  return (
                    <TileBox
                      key={t.id}
                      tile={t}
                      pop={springAt(frame, tileStart(t, anchor), POP)}
                      edge={1 - 0.45 * smooth((far - 900) / 1200)}
                      tick={LIVE.has(t.kind) ? tick : 0}
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
        size={TYPE.statement}
        stagger={4}
      />
      <Title frame={frame} />
    </Stage>
  )
}

const smooth = (x: number) => {
  const t = Math.min(1, Math.max(0, x))
  return t * t * (3 - 2 * t)
}

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

function wallFilter(cam: Cam) {
  const parts: string[] = []
  if (cam.light < 0.999) parts.push(`brightness(${cam.light.toFixed(3)})`)
  if (cam.blur > 0.05) parts.push(`blur(${cam.blur.toFixed(2)}px)`)
  return parts.length ? parts.join(" ") : undefined
}

/** Soft pools behind the type: a frosted one hugging the line (the UI under
 *  the words goes soft and dark), deeper under the muted "someone else's."
 *  (its letters are translucent, so the tiles show through them), and a
 *  wider dark one under the lockup. */
function Scrim({ frame }: { frame: number }) {
  const line =
    progress(frame, T.line - 10, 30, ease.inOut) *
    (1 - progress(frame, T.lineOut, 20, ease.inOut))
  const lockup = progress(frame, T.recede, 26, ease.inOut)
  if (line <= 0 && lockup <= 0) return null
  const pool = (w: number, h: number, y = 540, core = 35) =>
    `radial-gradient(ellipse ${w}px ${h}px at 50% ${y}px, #000 ${core}%, transparent 100%)`
  return (
    <>
      {line > 0 ? (
        <>
          <AbsoluteFill
            style={{
              opacity: line,
              background: "rgba(8,8,10,0.74)",
              backdropFilter: "blur(5px)",
              maskImage: pool(760, 340),
              pointerEvents: "none",
            }}
          />
          <AbsoluteFill
            style={{
              opacity: line,
              background: "rgba(8,8,10,0.74)",
              backdropFilter: "blur(4px)",
              maskImage: pool(760, 190, LINE_2_Y, 45),
              pointerEvents: "none",
            }}
          />
        </>
      ) : null}
      {lockup > 0 ? (
        <AbsoluteFill
          style={{
            opacity: lockup,
            background:
              "radial-gradient(ellipse 820px 300px at 50% 50%, rgba(8,8,10,0.72), rgba(8,8,10,0.42) 55%, transparent 100%)",
            pointerEvents: "none",
          }}
        />
      ) : null}
    </>
  )
}
