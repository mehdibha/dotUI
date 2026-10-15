import { Suspense, useEffect, useRef, useState } from "react"
import { continueRender, delayRender } from "remotion"

import { ensureFontStylesheets, fontFamiliesFromTokens } from "@/lib/fonts"
import { DesignSystemProvider } from "@/lib/styles"
import { SearchIcon } from "@/registry/icons"
import { IconLibraryContext } from "@/registry/icons/create-icon"
import type { IconLibraryName } from "@/registry/icons/icon-map"
import { getPreset, PRESETS } from "@/modules/presets"
import { parseState } from "@/modules/studio/axes"
import type { StudioState, StudioStateInput } from "@/modules/studio/axes"
import type { DesignSystem } from "@/modules/studio/preset/types"
import { designSystemOf } from "@/modules/studio/resolve"

/* The real engine, not a lookalike: studio state → designSystemOf →
   DesignSystemProvider, exactly the path /studio's preview takes. */

export type State = Partial<StudioStateInput>

export function preset(id: string): StudioState {
  const found = getPreset(id)
  if (!found) throw new Error(`unknown preset ${id}`)
  return found.state
}

const cache = new Map<string, DesignSystem>()

/** Resolve (and memoize by content) a design system from partial studio state. */
export function designSystem(state: State = {}): DesignSystem {
  const key = JSON.stringify(state)
  let ds = cache.get(key)
  if (!ds) {
    ds = designSystemOf(parseState(state))
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
   (the provider injects the same <link>s, idempotently), and never longer
   than FONT_TIMEOUT — a missing face beats a render hung on the network. */
const FONT_TIMEOUT = 20_000
const ready = new Set<string>()
const pending = new Map<string, Promise<void>>()

function loadFamily(family: string) {
  let p = pending.get(family)
  if (!p) {
    const stylesheet = new Promise<void>((resolve) => {
      ensureFontStylesheets(document, [family])
      const id = `dotui-font-${family.replaceAll(" ", "-").toLowerCase()}`
      const link = document.getElementById(id) as HTMLLinkElement | null
      if (!link || link.sheet) return resolve()
      link.addEventListener("load", () => resolve(), { once: true })
      link.addEventListener("error", () => resolve(), { once: true })
    })
    const loaded = stylesheet
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
    p = Promise.race([
      loaded,
      new Promise<void>((resolve) => setTimeout(resolve, FONT_TIMEOUT)),
    ])
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

/** Resolves once every face `state` draws with is usable — for scenes that
 *  measure text layout (a measurement taken earlier won't match the frame). */
export async function facesReady(state: State | string[]) {
  const google = Array.isArray(state)
    ? state
    : fontFamiliesFromTokens(designSystem(state).tokens)
  await Promise.all(google.map(loadFamily))
  await Promise.all(
    ["Geist Variable", "Geist Mono", ...google].flatMap((family) =>
      ["400", "500", "600", "700"].map((w) =>
        document.fonts.load(`${w} 16px "${family}"`),
      ),
    ),
  )
  await document.fonts.ready
}

/* Registry icons in other libraries lazy-load behind their own Suspense and
   show lucide meanwhile — which a still would catch. Mount <WarmIcons /> once
   in a scene that shows other libraries: it starts every loader and holds the
   first frame until the chunks are in. */
const LAZY_LIBRARIES: IconLibraryName[] = [
  "phosphor",
  "hugeicons",
  "tabler",
  "remix",
]

export function WarmIcons() {
  useState(() => {
    const handle = delayRender("icon libraries", {
      timeoutInMilliseconds: 60_000,
    })
    void Promise.all([
      import("@/registry/__generated__/__phosphor__"),
      import("@/registry/__generated__/__hugeicons__"),
      import("@/registry/__generated__/__tabler__"),
      import("@/registry/__generated__/__remix__"),
    ]).then(() => setTimeout(() => continueRender(handle), 120))
    return null
  })
  return (
    <div
      aria-hidden
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      {LAZY_LIBRARIES.map((library) => (
        <IconLibraryContext.Provider key={library} value={library}>
          <SearchIcon />
        </IconLibraryContext.Provider>
      ))}
    </div>
  )
}

/** Every Google face any preset uses — preloaded once by <Root>. */
export const PRESET_FONTS = [
  ...new Set(
    PRESETS.flatMap((p) =>
      fontFamiliesFromTokens(designSystem(p.state).tokens),
    ),
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
