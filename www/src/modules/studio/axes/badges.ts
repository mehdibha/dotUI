/* Badges — and Tags, one synced chip language: a tag is a badge that can be
   removed, so both wear the same style and shape. Style is how much intent
   color the chip carries; shape is pills vs ~4px corners, the only two
   shapes shipped systems use.

   Engine: `style` is an enum param on both `badge` and `tag-group` (a synced
   group — one axis writes both). On the badge it sets the default of the
   `appearance` prop, which stays API for the products that mix chips; on the
   tag it is the fill. Shape rides on the `--badge-radius` / `--tag-radius`
   surface vars (token-field tokens sit on `--tag-radius` too), resolved to
   plain `rounded-*` on export. Pill is the registry default and emits
   nothing: badges are full-round, tags keep their `radius-control` corners. */

import type { Resolved, StudioState } from "./index"

export const BADGE_DEFAULTS = {
  badgeStyle: "solid",
  badgeShape: "pill",
}

/* Solid is the Bootstrap/Material filled chip; soft the Linear/Radix Themes
   tinted wash; outline the Geist/shadcn badge; soft-outline the Ant tag. */
export const STYLE_OPTIONS = [
  { value: "solid", label: "Solid" },
  { value: "soft", label: "Soft" },
  { value: "outline", label: "Outline" },
  { value: "soft-outline", label: "Soft outline" },
]

export const SHAPE_OPTIONS = [
  { value: "pill", label: "Pill" },
  { value: "rounded", label: "Rounded" },
]

const SHAPE_TOKENS: Record<string, string> = {
  rounded: "var(--radius-sm)",
}

const pick = (options: { value: string }[], value: string, fallback: string) =>
  options.some((o) => o.value === value) ? value : fallback

export const WIRED = true

export function resolveBadges(state: StudioState): Resolved {
  const style = pick(STYLE_OPTIONS, state.badgeStyle, "solid")
  const tokens: Record<string, string> = {}
  const radius = SHAPE_TOKENS[state.badgeShape]
  if (radius) {
    tokens["--badge-radius"] = radius
    tokens["--tag-radius"] = radius
  }
  return {
    tokens,
    params: { badge: { style }, "tag-group": { style } },
  }
}
