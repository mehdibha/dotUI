import { preset } from "../../lib/theme"
import type { State } from "../../lib/theme"

export type Wipe =
  | { kind: "blade"; angle: number }
  | { kind: "circle"; x: number; y: number }

export type Slot = { state: State; mode: "light" | "dark"; wipe: Wipe }

const slot = (id: string, mode: Slot["mode"], wipe: Wipe): Slot => ({
  state: preset(id),
  mode,
  wipe,
})

/* One preset per beat, and every beat changes more than the accent: the
   mode flips on all but one (Claude → Spotify, serif to pill), and the
   macro beats (f180–330) trade sharp, serif, dense, pill and mono in turn.
   It opens dark out of Wall's title card and lands on Origin, dark, from
   the centre — the look Axes opens on. Comfortable density (airbnb) enters
   and leaves by circle, so no seam runs along a row of cards. */
export const SLOTS: Slot[] = [
  slot("linear", "dark", { kind: "circle", x: 960, y: 540 }),
  slot("claude", "light", { kind: "circle", x: 1500, y: 260 }),
  slot("spotify", "light", { kind: "blade", angle: -28 }),
  slot("github", "dark", { kind: "circle", x: 380, y: 800 }),
  slot("stripe", "light", { kind: "blade", angle: 28 }),
  slot("supabase", "dark", { kind: "circle", x: 1540, y: 820 }),
  slot("notion", "light", { kind: "blade", angle: -28 }),
  slot("claude", "dark", { kind: "circle", x: 360, y: 260 }),
  slot("airbnb", "light", { kind: "circle", x: 1580, y: 540 }),
  slot("spotify", "dark", { kind: "circle", x: 340, y: 840 }),
  slot("vercel", "light", { kind: "blade", angle: 28 }),
  slot("origin", "dark", { kind: "circle", x: 960, y: 540 }),
]
