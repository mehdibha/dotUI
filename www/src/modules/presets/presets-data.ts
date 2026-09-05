import { toOklch } from "@dotui/colors"

import type { DesignSystem } from "@/modules/create/preset/types"
import { DEFAULTS } from "@/modules/studio/axes"
import type { StudioState } from "@/modules/studio/axes"
import { resolveDesignSystem } from "@/modules/studio/resolve"

/**
 * A built-in design system the gallery can browse and apply: studio state
 * overrides on the defaults, resolved once for the previews.
 *
 * EXPERIMENT: this hand-authored list stands in for a real preset source so we
 * can validate the gallery UI. Each entry varies only the high-impact, low-risk
 * axes off the builder defaults — enough to read as a distinct design system in
 * the scaled-down preview. Due to be replaced by fewer, high-fidelity presets.
 */
export type Preset = {
  id: string
  name: string
  description: string
  /**
   * Illustrative accent for picker dots — curated, not derived from the seeds,
   * so each reads clearly on UI surfaces in both modes (e.g. Vercel's
   * near-black accent would vanish; it shows as a monochrome light dot).
   */
  swatch: string
  state: StudioState
  designSystem: DesignSystem
}

/** OKLCH hue of a measured gray — the studio's neutral axis is a hue, not a seed. */
const grayHue = (hex: string) => Math.round(toOklch(hex).h ?? 0)

/** Mode overrides: background L* per polarity (0 on dark = OLED). */
function modes(bg: { light?: number; dark?: number }): StudioState["modes"] {
  return DEFAULTS.modes.map((mode) => {
    const next = bg[mode.polarity]
    return next === undefined ? mode : { ...mode, bg: next }
  })
}

function definePreset(
  preset: Omit<Preset, "state" | "designSystem"> & {
    state: Partial<StudioState>
  },
): Preset {
  const state = { ...DEFAULTS, ...preset.state }
  return { ...preset, state, designSystem: resolveDesignSystem(state) }
}

/** Geist's measured blue: Vercel's selection ramp, Origin's accent + selection. */
const SELECTION_BLUE = "#0072f5"

export const PRESETS: Preset[] = [
  // Kept first: ORIGIN below and the gallery's ordering both rely on it.
  definePreset({
    id: "origin",
    name: "Origin",
    description: "dotUI blue, the starting point.",
    swatch: SELECTION_BLUE,
    // Tracks the builder defaults on every axis but the brand blue, which
    // drives the accent ramp, the primary-action tokens, and the split
    // selection + focus ramp.
    state: {
      brand: SELECTION_BLUE,
      primary: "accent",
      selectionSeed: SELECTION_BLUE,
    },
  }),
  definePreset({
    id: "claude",
    name: "Claude",
    description: "Warm coral on sand.",
    swatch: "#e0916f",
    state: {
      brand: "#d97757",
      // Claude neutrals are yellow-warm beige (hue ~96), not orange (issue #484 audit).
      neutralHue: grayHue("#84806f"),
      primary: "accent",
      radiusPx: 12,
      // Anthropic Sans is a neutral grotesque (Inter is closest free); Anthropic
      // Serif is a calm book serif (Source Serif 4, not display-contrast Fraunces).
      headingFont: "Source Serif 4",
      bodyFont: "Inter",
      // Claude's signature cream page (#faf9f5 ≈ L* 98, warm hue from the seed).
      modes: modes({ light: 98 }),
    },
  }),
  definePreset({
    id: "supabase",
    name: "Supabase",
    description: "Emerald on cool gray.",
    swatch: "#3ecf8e",
    state: {
      brand: "#3ecf8e",
      // Supabase grays are near-neutral with a faint green cast (hue ~159), not
      // cool blue; measured on production docs CSS (issue #484 audit).
      neutralHue: grayHue("#6d726f"),
      primary: "accent",
      // Verified against live production CSS: Supabase ships Inter.
      bodyFont: "Inter",
    },
  }),
  definePreset({
    id: "stripe",
    name: "Stripe",
    description: "Blurple on cool slate.",
    swatch: "#7a73ff",
    state: {
      brand: "#635bff",
      neutralHue: grayHue("#687385"),
      primary: "accent",
      // Stripe controls measure ~8px radius (md = 0.75 × base).
      radiusPx: 10.64,
      // Stripe's UI font is Söhne (proprietary); Inter is the closest free grotesque.
      bodyFont: "Inter",
      // Stripe's "floating hairline": a 1px drop shadow riding on the control.
      buttonStyle: "outline",
    },
  }),
  definePreset({
    id: "linear",
    name: "Linear",
    description: "Indigo, crisp hairlines.",
    swatch: "#818cf8",
    state: {
      brand: "#5e6ad2",
      neutralHue: grayHue("#8a8f98"),
      primary: "accent",
      // Linear ships Inter (verified against live production CSS).
      bodyFont: "Inter",
      // Linear's dark-first page is near-black #08090a.
      modes: modes({ dark: 2 }),
      buttonHover: "lighten",
      surfaceStrategy: "outline",
    },
  }),
  definePreset({
    id: "vercel",
    name: "Vercel",
    description: "Monochrome, hairline borders.",
    swatch: "#cbd5e1",
    state: {
      brand: "#171717",
      neutralHue: null,
      neutralTint: 0,
      // Geist runs black CTAs but a blue selection: focus rings + checked
      // controls.
      selectionSeed: SELECTION_BLUE,
      // Vercel dark runs a true-black page with #0a0a0a panels.
      modes: modes({ dark: 0 }),
      badgeShape: "pill",
      surfaceCanvas: "tinted",
    },
  }),
  definePreset({
    id: "airbnb",
    name: "Airbnb",
    description: "Rausch accents, ink actions.",
    swatch: "#ff5c7c",
    state: {
      brand: "#ff385c",
      neutralHue: null,
      neutralTint: 0,
      // Airbnb's primary CTA and selection controls are near-black (#222); Rausch
      // stays the accent for badges, links, prices (issue #484 audit).
      // Controls measure 8px radius (md = 0.75 × base), not 12.
      radiusPx: 10.64,
      density: "comfortable",
      // Airbnb Cereal is proprietary; Plus Jakarta Sans is the closest free match.
      bodyFont: "Plus Jakarta Sans",
      badgeShape: "pill",
    },
  }),
  definePreset({
    id: "github",
    name: "GitHub",
    description: "Primer blue, sober gray.",
    swatch: "#54aeff",
    state: {
      brand: "#0969da",
      neutralHue: grayHue("#656d76"),
      primary: "accent",
      // GitHub's brand font, open-sourced and on Google Fonts.
      bodyFont: "Mona Sans",
      // GitHub dark sits on blue-black #0d1117.
      modes: modes({ dark: 4.5 }),
      // Labels/counters are pills.
      badgeShape: "pill",
    },
  }),
  definePreset({
    id: "notion",
    name: "Notion",
    description: "Warm ink, quiet blue.",
    swatch: "#d4cec2",
    state: {
      // The blue actually measured on Notion CTAs/links; #2383e2 rendered too light.
      brand: "#0075de",
      neutralHue: grayHue("#787774"),
      primary: "accent",
      radiusPx: 6,
      // Notion ships NotionInter, a customized Inter.
      bodyFont: "Inter",
    },
  }),
  definePreset({
    id: "spotify",
    name: "Spotify",
    description: "Vivid green, pill-shaped.",
    swatch: "#1ed760",
    state: {
      // Spotify's interactive green (buttons, Play) — brighter than the logo green.
      brand: "#1ed760",
      neutralHue: null,
      neutralTint: 0,
      primary: "accent",
      radiusPx: 16,
      buttonRadius: "pill",
      // Spotify Circular is proprietary; Figtree is the closest free geometric.
      bodyFont: "Figtree",
      badgeShape: "pill",
      inputStyle: "filled",
    },
  }),
]

/** The default preset — what /studio starts on for first-time users. */
export const ORIGIN = PRESETS[0]!
