import { Suspense, useEffect, useRef, useState } from "react"
import { continueRender, delayRender } from "remotion"

import { ensureFontStylesheets, fontFamiliesFromTokens } from "@/lib/fonts"
import { DesignSystemProvider } from "@/lib/styles"
import { PRESETS } from "@/modules/presets/presets-data"
import { DEFAULTS } from "@/modules/studio/axes"
import type { StudioState } from "@/modules/studio/axes"
import type { DesignSystem } from "@/modules/studio/preset/types"
import { resolveDesignSystem } from "@/modules/studio/resolve"

/* The real engine, not a lookalike: studio state → resolveDesignSystem →
   DesignSystemProvider, exactly the path /studio's preview takes. */

export type State = Partial<StudioState>

export const PRESET_IDS = PRESETS.map((p) => p.id)

export function preset(id: string): StudioState {
  const found = PRESETS.find((p) => p.id === id)
  if (!found) throw new Error(`unknown preset ${id}`)
  return found.state
}

const cache = new Map<string, DesignSystem>()

/** Resolve (and memoize by content) a design system from partial studio state. */
export function designSystem(state: State = {}): DesignSystem {
  const key = JSON.stringify(state)
  let ds = cache.get(key)
  if (!ds) {
    ds = resolveDesignSystem({ ...DEFAULTS, ...state })
    cache.set(key, ds)
  }
  return ds
}

/**
 * Themes its subtree with a design system. Scoped, so several themes can share
 * a frame (a wave re-theming a wall tile by tile). Each distinct state adds a
 * stylesheet, so quantize anything interpolated per frame (hue in steps, radius
 * to 0.5px) instead of feeding raw floats.
 */
export function Theme({
  state = {},
  mode = "dark",
  children,
}: {
  state?: State
  mode?: "light" | "dark"
  children: React.ReactNode
}) {
  const ds = designSystem(state)
  useFonts(ds.tokens)
  return (
    <DesignSystemProvider
      scoped
      forcedMode={mode}
      params={ds.componentParams}
      tokens={ds.tokens}
      density={ds.density}
      color={ds.color}
      icons={ds.icons}
    >
      <Suspense fallback={<Hold label="theme suspense" />}>{children}</Suspense>
    </DesignSystemProvider>
  )
}

/** Holds the frame while mounted — a Suspense fallback that never gets filmed. */
export function Hold({ label }: { label: string }) {
  const [handle] = useState(() => delayRender(label))
  useEffect(() => () => continueRender(handle), [handle])
  return null
}

/* Font tokens name Google-hosted faces; the frame holds until each is loaded
   (the provider injects the same <link>s, idempotently). */
const ready = new Set<string>()
const pending = new Map<string, Promise<void>>()

function loadFamily(family: string) {
  let p = pending.get(family)
  if (!p) {
    ensureFontStylesheets(document, [family])
    const id = `dotui-font-${family.replaceAll(" ", "-").toLowerCase()}`
    const link = document.getElementById(id) as HTMLLinkElement | null
    p = new Promise<void>((resolve) => {
      if (!link || link.sheet) return resolve()
      link.addEventListener("load", () => resolve(), { once: true })
      link.addEventListener("error", () => resolve(), { once: true })
    })
      .then(() =>
        Promise.all(
          ["400", "500", "600", "700"].map((w) =>
            document.fonts.load(`${w} 16px "${family}"`),
          ),
        ),
      )
      .then(() => {
        ready.add(family)
      })
      .catch(() => {})
    pending.set(family, p)
  }
  return p
}

/** Load faces up front (and hold the frame until they're in). */
export function loadFonts(families: string[], label = "fonts") {
  const missing = families.filter((f) => !ready.has(f))
  if (missing.length === 0) return
  const handle = delayRender(`${label} ${missing.join(", ")}`, {
    timeoutInMilliseconds: 60_000,
  })
  void Promise.all(missing.map(loadFamily)).finally(() =>
    continueRender(handle),
  )
}

/** Every Google face any preset uses — preloaded once by <Root>. */
export const PRESET_FONTS = [
  ...new Set(
    PRESETS.flatMap((p) => fontFamiliesFromTokens(p.designSystem.tokens)),
  ),
]

function useFonts(tokens: Record<string, string>) {
  const key = fontFamiliesFromTokens(tokens)
    .filter((f) => !ready.has(f))
    .join("|")
  const seen = useRef("")
  if (key && seen.current !== key) {
    seen.current = key
    loadFonts(key.split("|"), "theme fonts")
  }
}
