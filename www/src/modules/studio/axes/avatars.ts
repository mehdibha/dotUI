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

export const SHAPE_VALUES = ["circle", "rounded"] as const

export const FALLBACK_VALUES = ["neutral", "accent"] as const

export const AVATAR_SCHEMA: ChapterSchema<typeof AVATAR_DEFAULTS> = {
  avatarShape: oneOf(SHAPE_VALUES),
  avatarFallback: oneOf(FALLBACK_VALUES),
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
