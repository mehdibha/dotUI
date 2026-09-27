import type { ReactNode } from "react"

import { Button } from "@/registry/ui/button"
import { Booking } from "@/components/showcase/booking"
import { CommandMenu } from "@/components/showcase/command-menu"
import { Controls } from "@/components/showcase/controls"
import { CookiePreferences } from "@/components/showcase/cookie-preferences"
import { DisplaySettings } from "@/components/showcase/display-settings"
import { PricingPlans } from "@/components/showcase/pricing-plans"
import { Storage } from "@/components/showcase/storage"
import { TwoFactor } from "@/components/showcase/two-factor"

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
import { COLUMN, COLUMNS, GAP, GRID_X } from "./layout"
import type { TileId } from "./layout"
import { liftAt, stateAt } from "./timeline"

/* The preview: /studio's cards canvas — life-size 340px columns — where
   every card is its own themed tile, so a change reaches each one a few
   frames after the panel makes it and rolls across the canvas as a wave.
   As it lands, a tile lifts and brightens for a moment. */

const CARDS: Record<TileId, ReactNode> = {
  controls: <Controls />,
  command: <CommandMenu />,
  booking: <Booking />,
  storage: <Storage />,
  pricing: <PricingPlans />,
  cookies: <CookiePreferences />,
  "two-factor": <TwoFactor />,
  display: <DisplaySettings />,
}

function Tile({
  frame,
  id,
  mode,
}: {
  frame: number
  id: TileId
  mode: "light" | "dark"
}) {
  const lift = liftAt(frame, id)
  return (
    <div
      data-tile={id}
      style={
        lift > 0.001
          ? {
              transform: `translateY(${(-4 * lift).toFixed(2)}px) scale(${(1 + 0.012 * lift).toFixed(4)})`,
              filter: `brightness(${(1 + (mode === "dark" ? 0.22 : 0.05) * lift).toFixed(3)})`,
            }
          : undefined
      }
    >
      <Theme state={stateAt(frame, id)} mode={mode}>
        {CARDS[id]}
      </Theme>
    </div>
  )
}

export function Canvas({
  frame,
  mode,
}: {
  frame: number
  mode: "light" | "dark"
}) {
  return (
    <Theme state={stateAt(frame, "storage")} mode={mode}>
      <div className="absolute inset-0 bg-neutral dark:bg-bg">
        <div
          className="flex items-start"
          style={{ gap: GAP, paddingTop: GAP, paddingLeft: GRID_X }}
        >
          {COLUMNS.map((cards, c) => (
            <div
              key={c}
              className="flex shrink-0 flex-col"
              style={{ width: COLUMN, gap: GAP }}
            >
              {cards.map(([id]) => (
                <Tile key={id} frame={frame} id={id} mode={mode} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Theme>
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
