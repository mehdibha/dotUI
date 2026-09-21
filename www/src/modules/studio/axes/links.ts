/* Links — how an inline link announces itself. Underline: `always` is the
   prose-first camp (GOV.UK, Apple's HIG for web, most docs systems), `hover`
   the GitHub/MDN middle ground, `never` app UIs (Linear, Figma) where color
   or weight alone carries it. Color, a leaf of Color's Primary: `accent` is
   the classic blue/brand link, `neutral` the Vercel/Linear move — the text's
   own color, with weight and the underline axis doing the work.

   Engine: `underline` and `color` are enum params on `link`, shaping the
   default variant; quiet keeps its own underlined, neutral look. Defaults
   mirror the registry: accent, no underline. */

import { SOURCE_OPTIONS } from "./color"
import type { Resolved, StudioState } from "./index"

export const LINK_DEFAULTS = {
  linkUnderline: "never",
  linkColor: "accent",
}

export const UNDERLINE_OPTIONS = [
  { value: "always", label: "Always" },
  { value: "hover", label: "Hover" },
  { value: "never", label: "Never" },
]

const pick = (options: { value: string }[], value: string, fallback: string) =>
  options.some((o) => o.value === value) ? value : fallback

export function resolveLinks(state: StudioState): Resolved {
  return {
    params: {
      link: {
        underline: pick(
          UNDERLINE_OPTIONS,
          state.linkUnderline,
          LINK_DEFAULTS.linkUnderline,
        ),
        color: pick(SOURCE_OPTIONS, state.linkColor, LINK_DEFAULTS.linkColor),
      },
    },
  }
}
