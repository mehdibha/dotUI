import { useMemo, useState } from "react"

import { Button } from "@/registry/ui/button"
import { salvageState } from "@/modules/studio/axes"
import { designSystemOf } from "@/modules/studio/resolve"

import type { Diff, Pairing } from "../design"
import {
  CardActions,
  CardHeader,
  sendPick,
  Themed,
  Tile,
  Tiles,
  useCard,
} from "./shell"
import { TypeSpecimen } from "./specimen"

export interface TypePayload {
  card: "type"
  product: string
  sample?: string
  design: Diff
  pairings: Array<Pairing & { axes: Diff }>
}

const nameOf = ({ name, heading, body }: Pairing) =>
  name ?? (heading === body ? heading : `${heading} + ${body}`)

export function TypeCard({ product, sample, design, pairings }: TypePayload) {
  const { app } = useCard()
  const entries = useMemo(
    () =>
      pairings.map((pairing) => ({
        pairing,
        system: designSystemOf(salvageState({ ...design, ...pairing.axes })),
      })),
    [design, pairings],
  )
  const [picked, setPicked] = useState(0)
  const [sent, setSent] = useState<string>()
  const chosen = entries[picked] ?? entries[0]
  if (!chosen) return null

  async function confirm() {
    if (!chosen) return
    const name = nameOf(chosen.pairing)
    await sendPick(app, `Use ${name}.`, {
      picked: name,
      axes: chosen.pairing.axes,
    })
    setSent(name)
  }

  return (
    <div className="flex flex-col gap-4">
      <CardHeader title={`Type for ${product}`} />
      <Tiles
        label="Type pairings"
        value={picked}
        onChange={setPicked}
        isDisabled={!!sent}
      >
        {entries.map(({ pairing, system }, i) => (
          <Tile
            key={nameOf(pairing)}
            index={i}
            title={nameOf(pairing)}
            description={
              pairing.heading === pairing.body
                ? pairing.body
                : `${pairing.heading} / ${pairing.body}`
            }
          >
            <Themed system={system}>
              <TypeSpecimen product={product} sample={sample} />
            </Themed>
          </Tile>
        ))}
      </Tiles>
      <Themed system={chosen.system}>
        <TypeSpecimen product={product} sample={sample} large />
      </Themed>
      <CardActions>
        <Button variant="primary" isDisabled={!!sent} onPress={confirm}>
          {sent ? `Picked ${sent}` : `Continue with ${nameOf(chosen.pairing)}`}
        </Button>
      </CardActions>
    </div>
  )
}
