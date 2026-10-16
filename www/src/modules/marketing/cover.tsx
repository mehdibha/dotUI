"use client"

import { useEffect } from "react"

import { siteConfig } from "@/config/site"
import { DesignSystemProvider } from "@/lib/styles"
import { LoginForm } from "@/components/showcase/login-form"
import { resolvePreset } from "@/modules/presets"

/* Back to front: each layer is the same card under another preset. */
const LAYERS: { preset: string; mode: "light" | "dark" }[] = [
  { preset: "vercel", mode: "dark" },
  { preset: "airbnb", mode: "light" },
  { preset: "spotify", mode: "dark" },
  { preset: "claude", mode: "light" },
  { preset: "origin", mode: "light" },
]

/* The social cover: README/GitHub preview and the site's share image.
   `scripts/capture-cover.mts` screenshots it at each size it ships in. */
export function Cover() {
  return (
    <div className="relative flex h-svh w-svw overflow-hidden bg-[#f2efec] font-sans text-[#231613]">
      <div className="relative z-10 flex w-[44%] shrink-0 flex-col justify-between py-16 pl-16">
        <img
          src="/brand/dotui-wordmark.svg"
          alt="dotUI"
          className="h-11 w-fit"
        />
        <div>
          <h1 className="text-[64px] leading-[1.04] font-semibold tracking-[-0.045em] text-balance">
            {siteConfig.tagline}
          </h1>
          <p className="mt-8 font-mono text-[22px] text-[#8c7a72]">dotui.org</p>
        </div>
      </div>
      <div className="relative flex-1">
        {LAYERS.map(({ preset, mode }, index) => {
          const designSystem = resolvePreset(preset)
          // Fanned up and to the right from the front card, pinned to the right edge.
          const step = LAYERS.length - 1 - index
          return (
            <div
              key={preset}
              className="absolute"
              style={{ right: 48 + index * 72, top: 196 - step * 36 }}
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
                <LoginForm className="w-[360px] shadow-[0_24px_64px_-16px_rgb(56_30_30/0.35)]" />
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
      .then(() => new Promise((r) => setTimeout(r, 500)))
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
