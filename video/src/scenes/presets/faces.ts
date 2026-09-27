import { ensureFontStylesheets, fontFamiliesFromTokens } from "@/lib/fonts"

import { designSystem } from "../../lib/theme"
import type { State } from "../../lib/theme"

/* Resolves once every face a theme draws with is usable, so a measurement
   taken after it matches the frame that gets filmed. `document.fonts.ready`
   alone can resolve before a Google stylesheet has even registered its
   faces. */

const SELF_HOSTED = ["Geist Variable", "Geist Mono"]
const WEIGHTS = ["400", "500", "600", "700"]

function stylesheetLoaded(family: string) {
  ensureFontStylesheets(document, [family])
  const id = `dotui-font-${family.replaceAll(" ", "-").toLowerCase()}`
  const link = document.getElementById(id) as HTMLLinkElement | null
  if (!link || link.sheet) return Promise.resolve()
  return new Promise<void>((resolve) => {
    link.addEventListener("load", () => resolve(), { once: true })
    link.addEventListener("error", () => resolve(), { once: true })
  })
}

export async function facesReady(state: State) {
  const google = fontFamiliesFromTokens(designSystem(state).tokens)
  await Promise.all(google.map(stylesheetLoaded))
  await Promise.all(
    [...SELF_HOSTED, ...google].flatMap((family) =>
      WEIGHTS.map((w) => document.fonts.load(`${w} 16px "${family}"`)),
    ),
  )
  await document.fonts.ready
}
