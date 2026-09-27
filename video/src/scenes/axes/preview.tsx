import type { ReactNode } from "react"

import { Button } from "@/registry/ui/button"
import { Appearance } from "@/components/showcase/appearance"
import { Booking } from "@/components/showcase/booking"
import { CommandMenu } from "@/components/showcase/command-menu"
import { Controls } from "@/components/showcase/controls"
import { PricingPlans } from "@/components/showcase/pricing-plans"
import { TwoFactor } from "@/components/showcase/two-factor"

import { clamp01, ease } from "../../lib/motion"
import { Theme } from "../../lib/theme"
import {
  ChevronsUpDownIcon,
  ExternalLinkIcon,
  MaximizeIcon,
  MonitorIcon,
  MoonIcon,
  SquareDashedMousePointerIcon,
  SunIcon,
} from "./deps"
import { stateAt, WAVES } from "./timeline"

/* The preview: /studio's "cards" canvas — life-size 340px columns — where
   every card is its own themed tile. A change reaches each tile a few frames
   after the panel makes it, by distance from the panel, so it rolls across
   the canvas as a wave with a sheen riding its front. */

const COLUMN = 340
const GAP = 24

const COLUMNS: ReactNode[][] = [
  [<Controls key="controls" />, <CommandMenu key="command" />],
  [<Booking key="booking" />, <TwoFactor key="two-factor" />],
  [<PricingPlans key="pricing" />, <Appearance key="appearance" />],
]

/* The wave's speed across the canvas, and down it (px per frame). */
const SPEED_X = 42
const SPEED_Y = 120

/** Frames after the panel that a point of the canvas re-themes. */
const delayAt = (x: number, y: number) =>
  Math.round(2 + x / SPEED_X + y / SPEED_Y)

/** Wave progress for a tile at canvas (x, y): 0 at the moment the change
 *  reaches it, 1 once settled; undefined outside any wave. */
function pulseAt(frame: number, delay: number) {
  const local = frame - delay
  let since = Infinity
  for (const w of WAVES) if (local >= w) since = Math.min(since, local - w)
  return since < 26 ? since / 26 : undefined
}

function Tile({
  frame,
  x,
  y,
  mode,
  children,
}: {
  frame: number
  x: number
  y: number
  mode: "light" | "dark"
  children: ReactNode
}) {
  const delay = delayAt(x, y)
  const pulse = pulseAt(frame, delay)
  // A stadium wave: each card rises as the change reaches it, then settles,
  // with a glow in the brand it just took on.
  const state = stateAt(frame - delay)
  const lift = pulse === undefined ? 0 : Math.sin(Math.PI * pulse) * (1 - pulse)
  return (
    <div
      style={
        lift
          ? {
              transform: `translateY(${-6 * lift}px) scale(${1 + 0.014 * lift})`,
              filter: `drop-shadow(0 0 ${18 * lift}px ${alpha(state.brand ?? "#ffffff", 0.7 * lift)})`,
            }
          : undefined
      }
    >
      <Theme state={state} mode={mode}>
        {children}
      </Theme>
    </div>
  )
}

const alpha = (hex: string, a: number) =>
  `rgba(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(",")},${a.toFixed(3)})`

/** Card rows start where the column's cards stack; rough heights keep the
 *  wave's vertical term honest without measuring. */
const ROW_Y = [0, 380]

export function Canvas({
  frame,
  mode,
}: {
  frame: number
  mode: "light" | "dark"
}) {
  return (
    <Theme state={stateAt(frame - 10)} mode={mode}>
      <div className="absolute inset-0 bg-neutral dark:bg-bg">
        <div className="flex items-start" style={{ gap: GAP, padding: GAP }}>
          {COLUMNS.map((cards, c) => (
            <div
              key={c}
              className="flex shrink-0 flex-col"
              style={{ width: COLUMN, gap: GAP }}
            >
              {cards.map((card, r) => (
                <Tile
                  key={r}
                  frame={frame}
                  x={GAP + c * (COLUMN + GAP) + COLUMN / 2}
                  y={ROW_Y[r]!}
                  mode={mode}
                >
                  {card}
                </Tile>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Theme>
  )
}

/** The light band on each wave's front, blended over the canvas. */
export function Sheen({ frame, height }: { frame: number; height: number }) {
  const bands = WAVES.map((w) => frame - w)
    .filter((t) => t >= 0 && t < 40)
    .map((t) => {
      // Solve delayAt(x, mid) = t for x: the front's position now.
      const x = (t - 2 - height / 2 / SPEED_Y) * SPEED_X
      const fade = 1 - clamp01((t - 22) / 18)
      return { x, fade: fade * ease.out(clamp01(t / 4)) }
    })
  if (bands.length === 0) return null
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ mixBlendMode: "overlay" }}
    >
      {bands.map(({ x, fade }, i) => (
        <div
          key={i}
          className="absolute top-[-20%] h-[140%]"
          style={{
            left: x - 170,
            width: 340,
            opacity: fade,
            transform: "skewX(-14deg)",
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.22) 40%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.22) 60%, transparent)",
          }}
        />
      ))}
    </div>
  )
}

/** The floating tool pill: site-themed, over whatever the preview shows. */
export function Pill({ dark }: { dark: boolean }) {
  return (
    <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center">
      <div className="flex items-center gap-1 rounded-[20px] border border-border bg-neutral p-1 shadow-[0_8px_24px_-6px_rgb(0_0_0/0.3),0_2px_8px_-2px_rgb(0_0_0/0.18)]">
        <Button size="sm" variant="quiet" className="rounded-full">
          Cards
          <ChevronsUpDownIcon data-icon="inline-end" />
        </Button>
        <div className="h-4 w-px shrink-0 bg-border" />
        <Button size="sm" variant="quiet" isIconOnly className="rounded-full">
          <MonitorIcon />
        </Button>
        <Button size="sm" variant="quiet" className="rounded-full tabular-nums">
          100%
        </Button>
        <div className="h-4 w-px shrink-0 bg-border" />
        <Button size="sm" variant="quiet" isIconOnly className="rounded-full">
          <SquareDashedMousePointerIcon />
        </Button>
        <span data-mark="mode-toggle" className="flex">
          <Button size="sm" variant="quiet" isIconOnly className="rounded-full">
            {dark ? <SunIcon /> : <MoonIcon />}
          </Button>
        </span>
        <Button size="sm" variant="quiet" isIconOnly className="rounded-full">
          <ExternalLinkIcon />
        </Button>
        <Button size="sm" variant="quiet" isIconOnly className="rounded-full">
          <MaximizeIcon />
        </Button>
      </div>
    </div>
  )
}
