import type { CSSProperties } from "react"

import { clamp01, lerp } from "../../lib/motion"
import type { Tile } from "./layout"
import { BARE, TileContent } from "./tiles"

const CHROME = "rounded-xl border bg-card"

/** One cell of the wall at `pop` (a spring, 0→1 with overshoot). */
export function TileBox({
  tile: t,
  pop,
  edge,
  tick,
}: {
  tile: Tile
  pop: number
  /** Distance falloff (1 = full brightness). */
  edge: number
  tick: number
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
    </div>
  )
}

/** The hero cell: its content never moves (its dot is the anchor); the cell
    fades in behind it with the first ring of tiles. `vars` drive HERO_CSS. */
export function HeroBox({
  tile: t,
  chrome,
  vars,
}: {
  tile: Tile
  chrome: number
  vars: CSSProperties
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
      {chrome > 0.001 ? (
        <div
          className={CHROME}
          style={{
            position: "absolute",
            inset: 0,
            opacity: chrome,
            transform: `scale(${lerp(0.97, 1, chrome)})`,
          }}
        />
      ) : null}
      <div className="relative flex size-full items-center justify-center">
        <TileContent kind={t.kind} tick={0} />
      </div>
    </div>
  )
}
