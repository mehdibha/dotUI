import { useMemo, useState } from "react"

import { Button } from "@/registry/ui/button"
import { Controls } from "@/components/showcase/controls"
import { salvageState } from "@/modules/studio/axes"
import { designSystemOf } from "@/modules/studio/resolve"

import type { Direction, MintedDesignSystem } from "../design"
import { Customize } from "./customize"
import { ReadyCard } from "./ready-card"
import {
  CardActions,
  CardHeader,
  saveDesign,
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

/** Pick a direction, customize it, save it — all in this one card, so the
 *  chat stays for what needs words. */
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
  const [view, setView] = useState<"pick" | "customize">("pick")
  const [saved, setSaved] = useState<MintedDesignSystem>()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string>()
  const chosen = entries[picked] ?? entries[0]
  if (!chosen) return null

  const canFullscreen = host.availableDisplayModes?.includes("fullscreen")
  const display = (mode: "inline" | "fullscreen") => {
    if (canFullscreen) void app.requestDisplayMode({ mode })
  }

  function finish(next: MintedDesignSystem) {
    setSaved(next)
    setView("pick")
    display("inline")
  }

  async function save() {
    if (!chosen) return
    setSaving(true)
    setError(undefined)
    try {
      finish(await saveDesign(app, product, chosen.direction.diff))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause))
    }
    setSaving(false)
  }

  if (saved) return <ReadyCard card="ready" {...saved} />

  if (view === "customize")
    return (
      <Customize
        product={product}
        directions={directions}
        start={picked}
        onBack={() => {
          setView("pick")
          display("inline")
        }}
        onSaved={finish}
      />
    )

  return (
    <div className="flex flex-col gap-4">
      <CardHeader title={`${directions.length} directions for ${product}`} />
      <Tiles label="Directions" value={picked} onChange={setPicked}>
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
        {error && <span className="text-xs text-fg-danger">{error}</span>}
        <Button
          isDisabled={saving}
          onPress={() => {
            setView("customize")
            display("fullscreen")
          }}
        >
          Customize
        </Button>
        <Button variant="primary" onPress={save} isPending={saving}>
          Save {chosen.direction.name}
        </Button>
      </CardActions>
    </div>
  )
}
