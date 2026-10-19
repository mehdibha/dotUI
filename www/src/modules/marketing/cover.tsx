"use client"

import { useEffect } from "react"

import { DesignSystemProvider } from "@/lib/styles"
import { CardsCanvas } from "@/components/showcase/cards-grid"
import { resolvePreset } from "@/modules/presets"

// Four equal windows pinwheel around the logo's 2 × HALF_W by 2 × HALF_H clear
// area, GUTTER apart; each reaches one edge of the 1280×640 canvas and runs
// BLEED past it.
const HALF_W = 180
const HALF_H = 88
const GUTTER = 56
const WIDTH = 640 - HALF_W
const HEIGHT = 320 - HALF_H
const BLEED = 40
const ZOOM = 0.7

const fromCenter = (px: number) => `calc(50% + ${px}px)`

const SLOTS: {
  preset: string
  /** The window's top-left, from the canvas center. */
  x: number
  y: number
  bleed: "left" | "top" | "right" | "bottom"
  /** Where the window sits in the cards canvas, in canvas pixels. */
  view: [number, number]
}[] = [
  {
    preset: "origin",
    x: -HALF_W - WIDTH,
    y: HALF_H - GUTTER - HEIGHT,
    bleed: "left",
    view: [12, 220],
  },
  {
    preset: "linear",
    x: GUTTER - HALF_W,
    y: -HALF_H - HEIGHT,
    bleed: "top",
    view: [740, 130],
  },
  {
    preset: "spotify",
    x: HALF_W,
    y: GUTTER - HALF_H,
    bleed: "right",
    view: [900, 470],
  },
  {
    preset: "airbnb",
    x: HALF_W - GUTTER - WIDTH,
    y: HALF_H,
    bleed: "bottom",
    view: [416, 1000],
  },
]

function PresetContainer({
  preset,
  x,
  y,
  bleed,
  view,
}: (typeof SLOTS)[number]) {
  const designSystem = resolvePreset(preset)
  const horizontal = bleed === "left" || bleed === "right"
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
      <div
        style={{
          left: fromCenter(bleed === "left" ? x - BLEED : x),
          top: fromCenter(bleed === "top" ? y - BLEED : y),
          width: horizontal ? WIDTH + BLEED : WIDTH,
          height: horizontal ? HEIGHT : HEIGHT + BLEED,
          paddingLeft: bleed === "left" ? BLEED : 0,
          paddingTop: bleed === "top" ? BLEED : 0,
        }}
        className="absolute overflow-hidden rounded-2xl border border-white/15 bg-bg"
      >
        <div style={{ zoom: ZOOM, marginLeft: -view[0], marginTop: -view[1] }}>
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
