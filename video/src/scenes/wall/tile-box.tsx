import type { CSSProperties } from "react"

import { clamp01, lerp } from "../../lib/motion"
import type { Glint } from "./fx"
import { GlintLayer } from "./fx"
import type { Tile } from "./layout"
import { BARE, TileContent } from "./tiles"

const CHROME = "rounded-xl border bg-card"

/** One cell of the wall at `pop` (a spring, 0→1 with overshoot). */
export function TileBox({
  tile: t,
  pop,
  edge,
  tick,
  glint,
}: {
  tile: Tile
  pop: number
  /** Distance falloff (1 = full brightness). */
  edge: number
  tick: number
  glint: Glint | null
}) {
  if (pop <= 0.001) return null
  const settled = clamp01(pop)
  const blur = (1 - settled) * 8
  // The wave lights each tile as it lands.
  const flash = 0.5 * Math.sin(settled * Math.PI)
  const filters: string[] = []
  if (blur > 0.2) filters.push(`blur(${blur.toFixed(2)}px)`)
  if (flash > 0.01) filters.push(`brightness(${(1 + flash).toFixed(3)})`)
  return (
    <div
      className={
        BARE.has(t.kind)
          ? "flex items-stretch"
          : `${CHROME} flex items-center justify-center`
      }
      style={{
        position: "absolute",
        left: t.x,
        top: t.y,
        width: t.w,
        height: t.h,
        opacity: clamp01(pop * 1.5) * edge,
        transform: `scale(${lerp(0.6, 1, pop)})`,
        filter: filters.length ? filters.join(" ") : undefined,
      }}
    >
      <TileContent kind={t.kind} tick={tick} />
      {glint ? <GlintLayer glint={glint} x={t.x} y={t.y} /> : null}
    </div>
  )
}

/** The hero cell: its content never moves (its dot is the anchor); only the
    cell pops in behind it. `vars` drive HERO_CSS. */
export function HeroBox({
  tile: t,
  pop,
  vars,
  glint,
}: {
  tile: Tile
  pop: number
  vars: CSSProperties
  glint: Glint | null
}) {
  return (
    <div
      className="wall-r"
      style={{
        position: "absolute",
        left: t.x,
        top: t.y,
        width: t.w,
        height: t.h,
        ...vars,
      }}
    >
      {pop > 0.001 ? (
        <div
          className={CHROME}
          style={{
            position: "absolute",
            inset: 0,
            opacity: clamp01(pop * 1.5),
            transform: `scale(${lerp(0.8, 1, pop)})`,
          }}
        />
      ) : null}
      <div className="relative flex size-full items-center justify-center">
        <TileContent kind={t.kind} tick={0} />
      </div>
      {glint ? <GlintLayer glint={glint} x={t.x} y={t.y} /> : null}
    </div>
  )
}
