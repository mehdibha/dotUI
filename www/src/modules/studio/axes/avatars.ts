/* Avatars — two axes. Shape: circle is the people-first default (GitHub,
   Slack DMs, Material), the rounded square marks entities (Slack workspaces,
   GitHub orgs, Notion, Linear). Fallback: what initials sit on when no
   image loads — one uniform gray (Geist, shadcn — dotUI's current look) or
   a per-entity tinted wash (Radix Themes, Ant, Atlassian) that tells
   stacked strangers apart.

   Engine: shape rides on the `--avatar-radius` surface var, resolved to a
   plain `rounded-*` on export; `fallback` is an enum param on `avatar`,
   painting by the `data-tint` index the fallback hashes from its text. */

import type { Resolved, StudioState } from "./index"

export const AVATAR_DEFAULTS = {
  avatarShape: "circle",
  avatarFallback: "neutral",
}

export const SHAPE_OPTIONS = [
  { value: "circle", label: "Circle" },
  { value: "rounded", label: "Rounded" },
]

export const FALLBACK_OPTIONS = [
  { value: "neutral", label: "Neutral" },
  { value: "tinted", label: "Tinted" },
]

const SHAPE_TOKENS: Record<string, string> = {
  rounded: "var(--radius-lg)",
}

const pick = (options: { value: string }[], value: string, fallback: string) =>
  options.some((o) => o.value === value) ? value : fallback

export function resolveAvatars(state: StudioState): Resolved {
  const tokens: Record<string, string> = {}
  const radius = SHAPE_TOKENS[state.avatarShape]
  if (radius) tokens["--avatar-radius"] = radius
  return {
    tokens,
    params: {
      avatar: {
        fallback: pick(FALLBACK_OPTIONS, state.avatarFallback, "neutral"),
      },
    },
  }
}
