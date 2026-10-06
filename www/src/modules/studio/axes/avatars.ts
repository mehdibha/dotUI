/* Avatars — a circle or a rounded square (each size on a corner rung, so a
   square character squares them), and what initials sit on.

   Engine: two enum params on `avatar`. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const AVATAR_DEFAULTS = {
  avatarShape: "circle",
  avatarFallback: "neutral",
}

export const SHAPE_OPTIONS = [
  {
    value: "circle",
    label: "Circle",
    credits: [
      "shadcn",
      "Geist",
      "Primer",
      "Fluent 2",
      "Chakra",
      "Mantine",
      "HeroUI",
      "Spectrum 2",
      "Ant Design",
      "Atlassian",
      "Untitled UI",
      "Material 3",
    ],
  },
  {
    value: "rounded",
    label: "Rounded",
    credits: ["Polaris", "Radix Themes", "Stripe"],
  },
]

export const FALLBACK_OPTIONS = [
  {
    value: "neutral",
    label: "Neutral",
    credits: ["shadcn", "Primer", "Atlassian", "Untitled UI", "Fluent 2"],
  },
  {
    value: "accent",
    label: "Accent",
    credits: ["Radix Themes (soft)", "Material 3 (list)"],
  },
]

export const AVATAR_SCHEMA: ChapterSchema<typeof AVATAR_DEFAULTS> = {
  avatarShape: oneOf(SHAPE_OPTIONS),
  avatarFallback: oneOf(FALLBACK_OPTIONS),
}

export function resolveAvatars(state: Effective): Resolved {
  return {
    params: {
      avatar: { shape: state.avatarShape, fallback: state.avatarFallback },
    },
  }
}

export const chapter = defineChapter({
  id: "avatars",
  defaults: AVATAR_DEFAULTS,
  schema: AVATAR_SCHEMA,
  resolve: resolveAvatars,
})
