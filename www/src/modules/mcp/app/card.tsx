/* The one card bundle: the tool result says which card it is. */

import { DesignSystemProvider } from "@/lib/styles"
import { Loader } from "@/registry/ui/loader"
import { DEFAULT_STATE } from "@/modules/studio/axes"
import { designSystemOf } from "@/modules/studio/resolve"

import { ColorCard } from "./color-card"
import type { ColorPayload } from "./color-card"
import { CompareCard } from "./compare-card"
import type { ComparePayload } from "./compare-card"
import { DirectionsCard } from "./directions-card"
import type { DirectionsPayload } from "./directions-card"
import { ReadyCard } from "./ready-card"
import type { ReadyPayload } from "./ready-card"
import { CardProvider, useHost } from "./shell"
import { TypeCard } from "./type-card"
import type { TypePayload } from "./type-card"

type Payload =
  | DirectionsPayload
  | ColorPayload
  | TypePayload
  | ComparePayload
  | ReadyPayload

const CARDS = new Set(["directions", "color", "type", "compare", "ready"])

const isPayload = (value: unknown): value is Payload =>
  typeof value === "object" &&
  value !== null &&
  CARDS.has((value as { card?: string }).card ?? "")

const CHROME = designSystemOf(DEFAULT_STATE)

function Body({ payload }: { payload: Payload }) {
  switch (payload.card) {
    case "directions":
      return <DirectionsCard {...payload} />
    case "color":
      return <ColorCard {...payload} />
    case "type":
      return <TypeCard {...payload} />
    case "compare":
      return <CompareCard {...payload} />
    case "ready":
      return <ReadyCard {...payload} />
  }
}

export function Card() {
  const { app, error, payload, host, hostMode } = useHost(isPayload)
  let body: React.ReactNode
  if (error) body = <p className="text-sm text-fg-muted">{error.message}</p>
  else if (!app || !payload)
    body = (
      <div className="flex items-center gap-2 py-10 text-sm text-fg-muted">
        <Loader className="size-4" />
        Preparing…
      </div>
    )
  else
    body = (
      <CardProvider app={app} host={host} hostMode={hostMode}>
        <Body payload={payload} />
      </CardProvider>
    )
  return (
    <DesignSystemProvider
      params={CHROME.componentParams}
      tokens={CHROME.tokens}
      density={CHROME.density}
      color={CHROME.color}
      icons={CHROME.icons}
    >
      <div className="p-1 text-fg">{body}</div>
    </DesignSystemProvider>
  )
}
