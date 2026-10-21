import { useState } from "react"

import { Badge } from "@/registry/ui/badge"
import { Button } from "@/registry/ui/button"

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

const SHOWN = 8

// `roleControl` → "Role control".
const humanize = (key: string) => {
  const words = key.replaceAll(/([A-Z])/g, " $1").toLowerCase()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

export function CompareCard({
  product,
  label,
  current,
  proposed,
  changes,
}: ComparePayload) {
  const { app } = useCard()
  const before = useSystem(current)
  const after = useSystem(proposed)
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
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-fg-muted">Current</span>
          <Themed system={before}>
            <Specimen product={product} />
          </Themed>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-fg-accent">Proposed</span>
          <div className="rounded-lg ring-2 ring-primary">
            <Themed system={after}>
              <Specimen product={product} />
            </Themed>
          </div>
        </div>
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
