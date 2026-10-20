/* Avatars — a circle or a rounded square (each size on a corner rung, so a
   square character squares them), and what initials sit on. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"

export const SHAPE_VALUES = ["circle", "rounded"] as const

export const FALLBACK_VALUES = ["neutral", "accent"] as const

export const chapter = defineChapter({
  id: "avatars",
  defaults: {
    avatarShape: "circle",
    avatarFallback: "neutral",
  },
  schema: {
    avatarShape: oneOf(SHAPE_VALUES),
    avatarFallback: oneOf(FALLBACK_VALUES),
  },
  resolve(state: Effective): Resolved {
    return {
      params: {
        avatar: { shape: state.avatarShape, fallback: state.avatarFallback },
      },
    }
  },
})
