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
import type { ChapterSpec } from "./spec"

export const LINK_DEFAULTS = {
  linkUnderline: "never",
  linkColor: "accent",
}

export const UNDERLINE_OPTIONS = [
  {
    value: "always",
    label: "Always",
    description: "Underlined at rest, 2px below the baseline.",
    seenIn: ["Atlassian", "Spectrum 2"],
  },
  {
    value: "hover",
    label: "Hover",
    description: "No underline at rest; it appears on hover.",
    seenIn: ["Radix Themes", "Carbon", "Fluent 2"],
  },
  {
    value: "never",
    label: "Never",
    description:
      "No underline at rest or on hover; color (or weight, when neutral) " +
      "carries the link.",
    seenIn: ["HeroUI"],
  },
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

const LINK_INKS: Record<string, { description: string; seenIn: string[] }> = {
  neutral: {
    description:
      "The body text color at medium weight — the link reads by weight " +
      "and underline, not hue.",
    seenIn: ["Spectrum 2", "Fluent 2", "Primer"],
  },
  accent: {
    description: "The accent text color — the classic colored link.",
    seenIn: ["Carbon", "Fluent 2", "Spectrum 2", "HeroUI"],
  },
}

export const LINK_SPEC = {
  label: "Links",
  description:
    "How an inline text link announces itself: its underline policy and its " +
    "color. Shapes the default link variant; the quiet variant always stays " +
    "underlined in the text color.",
  axes: {
    linkUnderline: {
      label: "Links",
      description: "When the default link shows an underline.",
      value: { type: "enum", options: UNDERLINE_OPTIONS },
      guidance:
        "Of 6 systems checked, Atlassian and Spectrum 2 underline at rest, " +
        "Radix Themes, Carbon and Fluent 2 on hover, HeroUI never. Carbon, " +
        "Fluent 2, Spectrum 2 and Primer all still underline links inside " +
        "running text, so pick hover or never only when links rarely sit " +
        "in prose — an unmarked link in a paragraph relies on color alone.",
    },
    linkColor: {
      label: "Color",
      description:
        "What paints the default link's text. A leaf of Color's Primary.",
      value: {
        type: "enum",
        options: SOURCE_OPTIONS.map((option) => ({
          ...option,
          ...LINK_INKS[option.value],
        })),
      },
      guidance:
        "All 4 systems checked (Carbon, Fluent 2, Spectrum 2, HeroUI) " +
        "default to an accent link; neutral ships as a secondary style " +
        "(Spectrum 2 secondary, Fluent 2 subtle, Primer muted). Neutral " +
        "fits monochrome systems where the accent is rare; pair it with an " +
        "underline so links stay findable.",
    },
  },
} satisfies ChapterSpec<typeof LINK_DEFAULTS>
