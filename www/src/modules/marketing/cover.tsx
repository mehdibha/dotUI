"use client"

import { useEffect } from "react"

import { siteConfig } from "@/config/site"
import { DesignSystemProvider } from "@/lib/styles"
import { CardsGrid } from "@/components/showcase/cards-grid"
import { resolvePreset } from "@/modules/presets"

const PRESETS: { preset: string; mode: "light" | "dark" }[] = [
  { preset: "origin", mode: "light" },
  { preset: "linear", mode: "dark" },
  { preset: "claude", mode: "light" },
  { preset: "spotify", mode: "dark" },
]

const [lead, rest] = siteConfig.tagline.split(/ (?=for )/)

function PresetContainer({ preset, mode }: (typeof PRESETS)[number]) {
  const designSystem = resolvePreset(preset)
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
      <div className="h-[480px] flex-1 overflow-hidden rounded-2xl border border-border bg-bg p-5 shadow-[0_24px_64px_-24px_rgb(56_30_30/0.4)]">
        <CardsGrid side={false} className="w-[960px] zoom-[0.6]" />
      </div>
    </DesignSystemProvider>
  )
}

/* The social cover: the GitHub social preview and the site's share image.
   `scripts/capture-cover.mts` screenshots it at each size it ships in. */
export function Cover() {
  return (
    <div className="relative flex h-svh w-svw flex-col items-center overflow-hidden bg-[#f2efec] pt-12 font-sans text-[#231613]">
      <img src="/brand/dotui-wordmark.svg" alt="dotUI" className="h-9" />
      <h1 className="mt-6 font-features-['calt'_0,'rlig','ss11'] text-[44px] leading-none font-normal tracking-[-0.06em] antialiased">
        {lead} <span className="text-[#8c7a72]">{rest}</span>
      </h1>
      <div className="mt-10 flex w-full gap-3 px-12">
        {PRESETS.map((p) => (
          <PresetContainer key={p.preset} {...p} />
        ))}
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
