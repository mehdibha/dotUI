import { useState } from "react"

import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import { Controls } from "@/components/showcase/controls"

import type { Change, Diff } from "../design"
import {
  CardActions,
  CardHeader,
  sendPick,
  Themed,
  useCard,
  useSystem,
} from "./shell"
import { Specimen } from "./specimen"

export interface ComparePayload {
  card: "compare"
  product: string
  label: string
  current: Diff
  proposed: Diff
  changes: Change[]
}

type Side = "current" | "proposed"

const SHOWN = 8

// `roleControl` → "Role control".
const humanize = (key: string) => {
  const words = key.replaceAll(/([A-Z])/g, " $1").toLowerCase()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

/** One preview flipped between the two designs in place: a 4px radius or a
 *  tint step is invisible side by side and obvious when it flips. */
export function CompareCard({
  product,
  label,
  current,
  proposed,
  changes,
}: ComparePayload) {
  const { app } = useCard()
  const systems = { current: useSystem(current), proposed: useSystem(proposed) }
  const [side, setSide] = useState<Side>("proposed")
  const [answer, setAnswer] = useState<"kept" | "accepted">()

  async function answerWith(accepted: boolean) {
    await sendPick(
      app,
      accepted ? `Accept "${label}".` : `Keep the current design.`,
      { refine: label, accepted },
    )
    setAnswer(accepted ? "accepted" : "kept")
  }

  return (
    <div className="flex flex-col gap-4">
      <CardHeader title={label} />
      <SegmentedControl
        aria-label="Design shown"
        selectedKeys={[side]}
        onSelectionChange={(keys) => {
          const next = [...keys][0]
          if (next === "current" || next === "proposed") setSide(next)
        }}
        className="self-start"
      >
        <SegmentedControlItem id="current">Current</SegmentedControlItem>
        <SegmentedControlItem id="proposed">Proposed</SegmentedControlItem>
      </SegmentedControl>
      {/* Both stay mounted in one cell, so a flip swaps pixels, not layout. */}
      <div className="grid">
        {(["current", "proposed"] as const).map((each) => (
          <div
            key={each}
            inert
            className="col-start-1 row-start-1"
            style={{ visibility: each === side ? "visible" : "hidden" }}
          >
            <Themed system={systems[each]}>
              <div className="grid gap-3 rounded-xl bg-bg p-3 sm:grid-cols-[1fr_1.35fr]">
                <Specimen product={product} />
                <Controls />
              </div>
            </Themed>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {changes.length === 0 && (
          <span className="text-xs text-fg-muted">Nothing changes.</span>
        )}
        {changes.slice(0, SHOWN).map(({ key, from, to }) => (
          <Badge key={key} variant="neutral">
            {humanize(key)}: {from} → {to}
          </Badge>
        ))}
        {changes.length > SHOWN && (
          <Badge variant="neutral">+{changes.length - SHOWN} more</Badge>
        )}
      </div>
      <CardActions>
        <Button isDisabled={!!answer} onPress={() => answerWith(false)}>
          {answer === "kept" ? "Kept current" : "Keep current"}
        </Button>
        <Button
          variant="primary"
          isDisabled={!!answer}
          onPress={() => answerWith(true)}
        >
          {answer === "accepted" ? "Accepted" : "Accept"}
        </Button>
      </CardActions>
    </div>
  )
}
