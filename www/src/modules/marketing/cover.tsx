"use client"

import { useEffect } from "react"

import { DesignSystemProvider } from "@/lib/styles"
import { CardsCanvas } from "@/components/showcase/cards-grid"
import { resolvePreset } from "@/modules/presets"

type Side = "top" | "right" | "bottom" | "left"

// The clear area around the logo is 2 × HALF_W by 2 × HALF_H; containers run
// BLEED past the canvas edge.
const BLEED = -40
const HALF_W = 220
const HALF_H = 112
const GUTTER = 56

const fromCenter = (px: number) => `calc(50% + ${px}px)`

const SLOTS: {
  preset: string
  inset: Record<Side, number | string>
  /** The cards canvas point at the window's top-left, in canvas pixels. */
  scroll?: [number, number]
}[] = [
  {
    preset: "origin",
    inset: {
      top: BLEED,
      left: BLEED,
      right: fromCenter(HALF_W),
      bottom: fromCenter(GUTTER - HALF_H),
    },
    scroll: [622, 212],
  },
  {
    preset: "linear",
    inset: {
      top: BLEED,
      right: BLEED,
      left: fromCenter(GUTTER - HALF_W),
      bottom: fromCenter(HALF_H),
    },
    scroll: [0, 182],
  },
  {
    preset: "spotify",
    inset: {
      bottom: BLEED,
      right: BLEED,
      left: fromCenter(HALF_W),
      top: fromCenter(GUTTER - HALF_H),
    },
  },
  {
    preset: "airbnb",
    inset: {
      bottom: BLEED,
      left: BLEED,
      right: fromCenter(GUTTER - HALF_W),
      top: fromCenter(HALF_H),
    },
    scroll: [60, 0],
  },
]

function PresetContainer({
  preset,
  inset,
  scroll = [0, 0],
}: (typeof SLOTS)[number]) {
  const designSystem = resolvePreset(preset)
  // Bleeding sides pad back to the visible edge; the canvas pads itself.
  const pad = (side: Side) => (inset[side] === BLEED ? -BLEED : 0)
  return (
    <DesignSystemProvider
      scoped
      forcedMode="dark"
      params={designSystem.componentParams}
      tokens={designSystem.tokens}
      density={designSystem.density}
      color={designSystem.color}
      icons={designSystem.icons}
    >
      {/* content-visibility: auto would leave a scrolled canvas's cards unrendered. */}
      <div
        style={{
          ...inset,
          paddingTop: pad("top"),
          paddingRight: pad("right"),
          paddingBottom: pad("bottom"),
          paddingLeft: pad("left"),
        }}
        className="absolute overflow-hidden rounded-2xl border border-white/15 bg-bg [&_*]:[content-visibility:visible]!"
      >
        <div
          style={{ zoom: 0.7, marginLeft: -scroll[0], marginTop: -scroll[1] }}
        >
          <CardsCanvas />
        </div>
      </div>
    </DesignSystemProvider>
  )
}

/* The social cover: the GitHub social preview and the site's share image.
   `scripts/capture-cover.mts` screenshots it at each size it ships in. */
export function Cover() {
  return (
    <div className="relative h-svh w-svw overflow-hidden bg-[#1a100f]">
      {SLOTS.map((slot) => (
        <PresetContainer key={slot.preset} {...slot} />
      ))}
      <img
        src="/brand/dotui-wordmark-white.svg"
        alt="dotUI"
        className="absolute top-1/2 left-1/2 h-20 -translate-1/2"
      />
      <ReadySignal />
    </div>
  )
}

function ReadySignal() {
  useEffect(() => {
    let cancelled = false
    void document.fonts.ready
      .then(() => new Promise((r) => setTimeout(r, 1000)))
      .then(() => document.fonts.ready)
      .then(() => {
        if (!cancelled) document.documentElement.dataset.coverReady = ""
      })
    return () => {
      cancelled = true
      delete document.documentElement.dataset.coverReady
    }
  }, [])
  return null
}
