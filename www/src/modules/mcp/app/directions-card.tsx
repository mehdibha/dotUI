import { useMemo, useState } from "react"

import { Button } from "@/registry/ui/button"
import { Controls } from "@/components/showcase/controls"
import { salvageState } from "@/modules/studio/axes"
import { designSystemOf } from "@/modules/studio/resolve"

import type { Direction } from "../design"
import {
  CardActions,
  CardHeader,
  sendPick,
  Themed,
  Tile,
  Tiles,
  useCard,
} from "./shell"
import { Specimen } from "./specimen"

export interface DirectionsPayload {
  card: "directions"
  product: string
  directions: Direction[]
}

export function DirectionsCard({ product, directions }: DirectionsPayload) {
  const { app, host } = useCard()
  const entries = useMemo(
    () =>
      directions.map((direction) => ({
        direction,
        system: designSystemOf(salvageState(direction.diff)),
      })),
    [directions],
  )
  const [picked, setPicked] = useState(0)
  const [sent, setSent] = useState<string>()
  const chosen = entries[picked] ?? entries[0]
  if (!chosen) return null

  const fullscreen = host.displayMode === "fullscreen"
  const canFullscreen = host.availableDisplayModes?.includes("fullscreen")

  async function confirm() {
    if (!chosen) return
    const { name, diff } = chosen.direction
    await sendPick(app, `Let's go with "${name}".`, {
      picked: name,
      axes: diff,
    })
    setSent(name)
  }

  return (
    <div className="flex flex-col gap-4">
      <CardHeader title={`${directions.length} directions for ${product}`} />
      <Tiles
        label="Directions"
        value={picked}
        onChange={setPicked}
        isDisabled={!!sent}
      >
        {entries.map(({ direction, system }, i) => (
          <Tile
            key={direction.name}
            index={i}
            title={direction.name}
            description={direction.summary}
          >
            <Themed system={system}>
              <Specimen product={product} />
            </Themed>
          </Tile>
        ))}
      </Tiles>
      <div className="flex flex-col gap-2">
        <p className="text-xs text-fg-muted">
          {chosen.direction.name}, live: every control works
        </p>
        <Themed system={chosen.system}>
          <div className="rounded-xl bg-bg p-3">
            <Controls className="mx-auto max-w-sm" />
          </div>
        </Themed>
      </div>
      <CardActions>
        {canFullscreen && (
          <Button
            variant="quiet"
            onPress={() =>
              app.requestDisplayMode({
                mode: fullscreen ? "inline" : "fullscreen",
              })
            }
          >
            {fullscreen ? "Exit full screen" : "Full screen"}
          </Button>
        )}
        <Button variant="primary" isDisabled={!!sent} onPress={confirm}>
          {sent ? `Picked ${sent}` : `Continue with ${chosen.direction.name}`}
        </Button>
      </CardActions>
    </div>
  )
}
