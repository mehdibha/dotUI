"use client"

import { useEffect } from "react"

import { DesignSystemProvider } from "@/lib/styles"
import { cn } from "@/registry/lib/utils"
import { CardsGrid } from "@/components/showcase/cards-grid"
import { resolvePreset } from "@/modules/presets"

type Side = "top" | "right" | "bottom" | "left"

// The clear area around the logo is 2 × HALF_W by 2 × HALF_H; containers run
// BLEED past the canvas edge.
const BLEED = -40
const HALF_W = 220
const HALF_H = 112
const GUTTER = 56
// Where the top and bottom rows split in two, from the center.
const SPLIT = 360

const fromCenter = (px: number) => `calc(50% + ${px}px)`

const SLOTS: {
  preset: string
  mode: "light" | "dark"
  inset: Record<Side, number | string>
}[] = [
  {
    preset: "origin",
    mode: "light",
    inset: {
      top: BLEED,
      left: BLEED,
      right: fromCenter(HALF_W),
      bottom: fromCenter(GUTTER - HALF_H),
    },
  },
  {
    preset: "linear",
    mode: "dark",
    inset: {
      top: BLEED,
      left: fromCenter(GUTTER - HALF_W),
      right: fromCenter(GUTTER - SPLIT),
      bottom: fromCenter(HALF_H),
    },
  },
  {
    preset: "airbnb",
    mode: "light",
    inset: {
      top: BLEED,
      right: BLEED,
      left: fromCenter(SPLIT),
      bottom: fromCenter(HALF_H),
    },
  },
  {
    preset: "spotify",
    mode: "dark",
    inset: {
      bottom: BLEED,
      right: BLEED,
      left: fromCenter(HALF_W),
      top: fromCenter(GUTTER - HALF_H),
    },
  },
  {
    preset: "claude",
    mode: "light",
    inset: {
      bottom: BLEED,
      left: fromCenter(GUTTER - SPLIT),
      right: fromCenter(GUTTER - HALF_W),
      top: fromCenter(HALF_H),
    },
  },
  {
    preset: "carbon",
    mode: "dark",
    inset: {
      bottom: BLEED,
      left: BLEED,
      right: fromCenter(SPLIT),
      top: fromCenter(HALF_H),
    },
  },
]

function PresetContainer({ preset, mode, inset }: (typeof SLOTS)[number]) {
  const designSystem = resolvePreset(preset)
  const pad = (side: Side) => (inset[side] === BLEED ? 20 - BLEED : 20)
  return (
    <DesignSystemProvider
      scoped
      forcedMode={mode}
      params={designSystem.componentParams}
      tokens={designSystem.tokens}
      density={designSystem.density}
      color={designSystem.color}
      icons={designSystem.icons}
    >
      <div
        style={{
          ...inset,
          paddingTop: pad("top"),
          paddingRight: pad("right"),
          paddingBottom: pad("bottom"),
          paddingLeft: pad("left"),
        }}
        className={cn(
          "absolute overflow-hidden rounded-2xl border bg-bg",
          mode === "dark" ? "border-white/15" : "border-border",
        )}
      >
        <CardsGrid side={false} className="w-[1120px] zoom-[0.7]" />
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
