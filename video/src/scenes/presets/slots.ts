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

/* One preset per beat. A mode flip opens as a circle (the theme toggle's
   reveal), a same-mode swap as a blade. Comfortable density (airbnb) only
   ever enters and leaves by circle, so no seam runs along a row of cards.
   The last beat is Origin, dark, from the centre — the look Axes opens on. */
export const SLOTS: Slot[] = [
  slot("claude", "light", { kind: "circle", x: 960, y: 540 }),
  slot("spotify", "light", { kind: "blade", angle: -28 }),
  slot("linear", "dark", { kind: "circle", x: 1480, y: 300 }),
  slot("supabase", "dark", { kind: "blade", angle: 28 }),
  slot("airbnb", "light", { kind: "circle", x: 420, y: 760 }),
  slot("github", "dark", { kind: "circle", x: 1500, y: 780 }),
  slot("claude", "dark", { kind: "blade", angle: -28 }),
  slot("notion", "light", { kind: "circle", x: 360, y: 280 }),
  slot("spotify", "dark", { kind: "circle", x: 1560, y: 520 }),
  slot("stripe", "dark", { kind: "blade", angle: 28 }),
  slot("vercel", "light", { kind: "circle", x: 400, y: 820 }),
  slot("origin", "dark", { kind: "circle", x: 960, y: 540 }),
]
