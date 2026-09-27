import { preset } from "../../lib/theme"
import type { State } from "../../lib/theme"

export type Wipe =
  | { kind: "diagonal"; angle: number }
  | { kind: "radial"; x: number; y: number }

export type Slot = { state: State; mode: "light" | "dark"; wipe: Wipe }

/* One look per beat. Modes flip every other beat, and a flip opens as a
   circle (the theme toggle's reveal); a same-mode swap is a diagonal blade.
   The last two are no preset at all: someone's own system, for "Make it
   yours." */
export const SLOTS: Slot[] = [
  {
    state: preset("origin"),
    mode: "light",
    wipe: { kind: "radial", x: 960, y: 540 },
  },
  {
    state: preset("claude"),
    mode: "light",
    wipe: { kind: "diagonal", angle: -28 },
  },
  {
    state: preset("linear"),
    mode: "dark",
    wipe: { kind: "radial", x: 960, y: 510 },
  },
  {
    state: preset("supabase"),
    mode: "dark",
    wipe: { kind: "diagonal", angle: 28 },
  },
  {
    state: preset("stripe"),
    mode: "light",
    wipe: { kind: "radial", x: 1500, y: 760 },
  },
  {
    state: preset("airbnb"),
    mode: "light",
    wipe: { kind: "diagonal", angle: -28 },
  },
  {
    state: preset("github"),
    mode: "dark",
    wipe: { kind: "radial", x: 420, y: 700 },
  },
  {
    state: preset("vercel"),
    mode: "dark",
    wipe: { kind: "diagonal", angle: 28 },
  },
  {
    state: preset("notion"),
    mode: "light",
    wipe: { kind: "radial", x: 960, y: 750 },
  },
  {
    state: {
      ...preset("claude"),
      brand: "#7c5cff",
      neutralHue: 285,
      radiusPx: 18,
      buttonRadius: "pill",
      badgeShape: "pill",
      headingFont: "Source Serif 4",
      bodyFont: "Figtree",
      modes: preset("origin").modes,
    },
    mode: "light",
    wipe: { kind: "diagonal", angle: -28 },
  },
  {
    state: preset("spotify"),
    mode: "dark",
    wipe: { kind: "radial", x: 960, y: 570 },
  },
  {
    state: {
      ...preset("github"),
      brand: "#ff6a3d",
      neutralHue: 40,
      radiusPx: 4,
      bodyFont: "Mona Sans",
      headingFont: "",
      iconLibrary: "phosphor",
    },
    mode: "dark",
    wipe: { kind: "diagonal", angle: 28 },
  },
]
