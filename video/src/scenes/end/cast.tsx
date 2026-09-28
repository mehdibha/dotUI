import type { ReactNode } from "react"

import { Appearance } from "@/components/showcase/appearance"
import { PricingPlans } from "@/components/showcase/pricing-plans"
import { TwoFactor } from "@/components/showcase/two-factor"
import { PanelPage } from "@/modules/studio/page"
import { CHAPTERS } from "@/modules/studio/state"

import { studioAt } from "../../lib/studio"
import { preset, Theme } from "../../lib/theme"
import type { State } from "../../lib/theme"
import { PANEL_CSS } from "../axes/panel-css"
import { BUILT } from "../axes/timeline"
import { IconsReady, LOOK, LOOK_MODE, Newsletter } from "../compose/steps"
import { SCREEN_CSS, Surface } from "../patterns/screen"
import { TILE_H, TILE_W } from "../patterns/tiles"
import { TileContent } from "../wall/tiles"

/* The film's cast, one last time, in the looks each scene showed them in:
   Wall's components, Presets' cards, the studio panel as Axes left it, the
   Compose card in the system built there, a Patterns product. Each renders at its largest on-screen
   size (`zoom`), so the vortex only ever scales it down. */

export type Actor = {
  /** Layout size before zoom, px. */
  w: number
  h: number
  zoom: number
  render: () => ReactNode
}

function Chip({ kind }: { kind: string }) {
  return (
    <Theme mode="dark">
      <div
        className="flex items-center justify-center rounded-xl border bg-card text-fg shadow-lg"
        style={{ width: 232, height: 144 }}
      >
        <TileContent kind={kind} tick={0} />
      </div>
    </Theme>
  )
}

function Look({
  state,
  mode,
  width,
  children,
}: {
  state: State
  mode: "light" | "dark"
  width: number
  children: ReactNode
}) {
  return (
    <Theme state={state} mode={mode}>
      <div style={{ width }} className="text-fg">
        {children}
      </div>
    </Theme>
  )
}

const chip = (kind: string): Actor => ({
  w: 232,
  h: 144,
  zoom: 1.3,
  render: () => <Chip kind={kind} />,
})

export const CAST = {
  switch: chip("switch"),
  primary: chip("primary"),
  slider: chip("slider"),
  tabs: chip("tabs"),
  checkbox: chip("checkbox"),
  badges: chip("badges"),
  pricing: {
    w: 340,
    h: 360,
    zoom: 1.3,
    render: () => (
      <Look state={preset("claude")} mode="light" width={340}>
        <PricingPlans />
      </Look>
    ),
  },
  appearance: {
    w: 340,
    h: 235,
    zoom: 1.3,
    render: () => (
      <Look state={preset("supabase")} mode="dark" width={340}>
        <Appearance />
      </Look>
    ),
  },
  twoFactor: {
    w: 340,
    h: 250,
    zoom: 1.3,
    render: () => (
      <Look state={preset("notion")} mode="light" width={340}>
        <TwoFactor />
      </Look>
    ),
  },
  panel: {
    w: 256,
    h: 480,
    zoom: 1.35,
    render: () => (
      <Theme mode="dark">
        <style>{PANEL_CSS}</style>
        <div
          className="flex flex-col overflow-hidden rounded-[18px] border border-white/10 bg-bg p-2 text-fg shadow-2xl"
          style={{ width: 256, height: 480 }}
        >
          <PanelPage chapters={CHAPTERS.slice(0, 2)} studio={studioAt(BUILT)} />
        </div>
      </Theme>
    ),
  },
  compose: {
    w: 420,
    h: 260,
    zoom: 2,
    render: () => (
      <Theme state={LOOK} mode={LOOK_MODE}>
        <IconsReady />
        <div style={{ width: 400 }}>
          <Newsletter />
        </div>
      </Theme>
    ),
  },
  product: {
    w: TILE_W,
    h: TILE_H,
    zoom: 0.46,
    // Patterns' own surface: it also stops the player's wall-clock timer.
    render: () => (
      <div
        className="relative overflow-hidden rounded-[28px]"
        style={{ width: TILE_W, height: TILE_H }}
      >
        <style>{SCREEN_CSS}</style>
        <Surface content="music-player" state={{}} mode="light" />
      </div>
    ),
  },
} satisfies Record<string, Actor>

export type CastId = keyof typeof CAST
