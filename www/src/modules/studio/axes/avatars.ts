/* Avatars — two axes. Shape: circle for people, a rounded square for
   entities. Fallback: what initials sit on when no image loads, either one
   uniform gray or a name-hashed tinted wash that tells stacked avatars apart.

   Engine: shape rides on the `--studio-avatar-radius` surface var, resolved to a
   plain `rounded-*` on export; `fallback` is an enum param on `avatar`,
   painting by the `data-tint` index the fallback hashes from its text. */

import type { Resolved, StudioState } from "./index"
import type { ChapterSpec } from "./spec"

export const AVATAR_DEFAULTS = {
  avatarShape: "circle",
  avatarFallback: "neutral",
}

export const SHAPE_OPTIONS = [
  {
    value: "circle",
    label: "Circle",
    description: "Round avatars, group-overflow counters included.",
    seenIn: ["shadcn/ui", "Fluent 2", "Chakra UI", "Primer"],
  },
  {
    value: "rounded",
    label: "Rounded",
    description:
      "Squares with the lg rung — the base radius, 10px at the default.",
    seenIn: ["Radix Themes", "Primer", "Fluent 2"],
  },
]

export const FALLBACK_OPTIONS = [
  {
    value: "neutral",
    label: "Neutral",
    description: "Initials on the same gray wash for everyone.",
    seenIn: ["shadcn/ui", "Fluent 2"],
  },
  {
    value: "tinted",
    label: "Tinted",
    description:
      "Initials on one of four washes (accent, success, warning, info), " +
      "picked by a hash of the fallback text so a person keeps their color.",
    seenIn: ["Fluent 2", "Mantine"],
  },
]

const SHAPE_TOKENS: Record<string, string> = {
  rounded: "var(--radius-lg)",
}

const pick = (options: { value: string }[], value: string, fallback: string) =>
  options.some((o) => o.value === value) ? value : fallback

export function resolveAvatars(state: StudioState): Resolved {
  const tokens: Record<string, string> = {}
  const radius = SHAPE_TOKENS[state.avatarShape]
  if (radius) tokens["--studio-avatar-radius"] = radius
  return {
    tokens,
    params: {
      avatar: {
        fallback: pick(FALLBACK_OPTIONS, state.avatarFallback, "neutral"),
      },
    },
  }
}

export const AVATAR_SPEC = {
  label: "Avatars",
  description:
    "The avatar's silhouette and what its initials sit on when no image " +
    "loads.",
  axes: {
    avatarShape: {
      label: "Shape",
      description: "The corner shape of every avatar and avatar-group count.",
      value: { type: "enum", options: SHAPE_OPTIONS },
      guidance:
        "Circle is the default in shadcn, Fluent 2 and Chakra; Radix " +
        "Themes defaults to theme-rounded squares. Primer and Fluent 2 ship " +
        "both, keeping squares for organizations, bots and teams — pick " +
        "rounded when most avatars are workspaces or products, not people.",
    },
    avatarFallback: {
      label: "Fallback",
      description: "The fill behind initials when the image is missing.",
      value: { type: "enum", options: FALLBACK_OPTIONS },
      guidance:
        "shadcn and Fluent 2 default to one neutral gray; Fluent 2 " +
        "(`colorful`) and Mantine (`initials`) ship name-hashed colors as " +
        "an option. Tinted tells people apart in stacked groups and " +
        "comment threads; neutral keeps the brand palette out of identity.",
    },
  },
} satisfies ChapterSpec<typeof AVATAR_DEFAULTS>
