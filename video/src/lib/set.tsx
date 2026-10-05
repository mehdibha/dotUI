import type { ReactNode } from "react"

import { Booking } from "@/components/showcase/booking"
import { CommandMenu } from "@/components/showcase/command-menu"
import { Controls } from "@/components/showcase/controls"
import { CookiePreferences } from "@/components/showcase/cookie-preferences"
import { DisplaySettings } from "@/components/showcase/display-settings"
import { PricingPlans } from "@/components/showcase/pricing-plans"
import { Storage } from "@/components/showcase/storage"
import { TwoFactor } from "@/components/showcase/two-factor"
import { PanelPage } from "@/modules/studio/page"
import { CHAPTERS } from "@/modules/studio/state"

import { panelSystem, studioAt } from "./studio"
import { Theme } from "./theme"
import type { State } from "./theme"

/* The studio as /studio lays it out at 1920×1080: the real panel at its true
   width in the site's dark chrome, beside a preview of real showcase cards
   themed by the same state. Scenes frame it with a Camera. */

const COLUMNS: ReactNode[][] = [
  [<Controls key="controls" />, <CommandMenu key="command" />],
  [<Booking key="booking" />, <TwoFactor key="two-factor" />],
  [<Storage key="storage" />, <PricingPlans key="pricing" />],
  [<CookiePreferences key="cookies" />, <DisplaySettings key="display" />],
]

export function StudioSet({
  state,
  name = "My design system",
  swatch = state.brand ?? "#888",
  mode = "dark",
}: {
  state: State
  /** The panel header; never a preset's name (they're named after brands). */
  name?: string
  swatch?: string
  /** The preview's mode; the site chrome stays dark. */
  mode?: "light" | "dark"
}) {
  return (
    <div className="absolute inset-0 flex gap-6 bg-bg p-6 text-fg">
      <Theme mode="dark">
        <div className="flex w-64 shrink-0 flex-col">
          <PanelPage
            chapters={CHAPTERS}
            studio={studioAt(state)}
            system={panelSystem(name, swatch)}
          />
        </div>
      </Theme>
      <div className="relative flex-1 overflow-hidden rounded-xl border border-border/45">
        <Theme state={state} mode={mode}>
          <div className="absolute inset-0 flex justify-center gap-6 bg-neutral pt-6 dark:bg-bg">
            {COLUMNS.map((cards, i) => (
              <div key={i} className="flex w-[340px] shrink-0 flex-col gap-6">
                {cards}
              </div>
            ))}
          </div>
        </Theme>
      </div>
    </div>
  )
}
