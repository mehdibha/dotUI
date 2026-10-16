"use client"

import { useEffect } from "react"

import { siteConfig } from "@/config/site"
import { DesignSystemProvider } from "@/lib/styles"
import { CardsGrid } from "@/components/showcase/cards-grid"
import { resolvePreset } from "@/modules/presets"

/* Left to right: the same cards grid under each preset, cut into diagonal bands. */
const BANDS: { preset: string; mode: "light" | "dark" }[] = [
  { preset: "origin", mode: "light" },
  { preset: "linear", mode: "dark" },
  { preset: "claude", mode: "light" },
]
const SKEW = 8 // % of the grid's width each band edge leans by, top to bottom.

function bandClip(index: number) {
  const width = 100 / BANDS.length
  const from = index === 0 ? -100 : index * width
  const to = index === BANDS.length - 1 ? 200 : (index + 1) * width
  return `polygon(${from + SKEW}% 0, ${to + SKEW}% 0, ${to - SKEW}% 100%, ${from - SKEW}% 100%)`
}

const [lead, rest] = siteConfig.tagline.split(/ (?=for )/)

/* The social cover: the GitHub social preview and the site's share image.
   `scripts/capture-cover.mts` screenshots it at each size it ships in. */
export function Cover() {
  return (
    <div className="relative h-svh w-svw overflow-hidden bg-[#f2efec] font-sans text-[#231613]">
      <div className="absolute inset-y-0 left-16 z-10 flex w-[28rem] flex-col justify-center">
        <img
          src="/brand/dotui-wordmark.svg"
          alt="dotUI"
          className="h-10 w-fit"
        />
        <h1 className="mt-10 font-features-['calt'_0,'rlig','ss11'] text-[58px] leading-[1.06] font-normal tracking-[-0.06em] text-balance antialiased">
          {lead} <span className="text-[#8c7a72]">{rest}</span>
        </h1>
        <p className="mt-8 font-mono text-[22px] text-[#8c7a72]">dotui.org</p>
      </div>
      <div className="absolute top-12 left-[47%] w-[1000px] zoom-[0.7]">
        {BANDS.map(({ preset, mode }, index) => {
          const designSystem = resolvePreset(preset)
          return (
            <div
              key={preset}
              className="absolute inset-x-0 top-0"
              style={{ clipPath: bandClip(index) }}
            >
              <DesignSystemProvider
                scoped
                forcedMode={mode}
                params={designSystem.componentParams}
                tokens={designSystem.tokens}
                density={designSystem.density}
                color={designSystem.color}
                icons={designSystem.icons}
              >
                <CardsGrid side={false} />
              </DesignSystemProvider>
            </div>
          )
        })}
      </div>
      <div className="absolute inset-x-0 bottom-0 z-10 h-4 bg-[#381e1e]" />
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
