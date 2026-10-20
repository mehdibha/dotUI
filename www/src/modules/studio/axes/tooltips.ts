/* Tooltips: the one anchored layer that breaks rank with the popover
   material. Whether it points is Menus' Arrows row; how it enters, Motion's.

   Corners read the inline item rung, or the detail rung when square items would square it. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import { roleRung } from "./shape"

export const TOOLTIP_STYLE_VALUES = ["inverted", "surface"] as const

export const chapter = defineChapter({
  id: "tooltips",
  defaults: {
    tooltipStyle: "inverted",
  },
  schema: {
    tooltipStyle: oneOf(TOOLTIP_STYLE_VALUES),
  },
  resolve(state: Effective): Resolved {
    // A chip keeps its corners while controls are rounded (Material 3: square
    // menu rows, 4dp tooltips); it squares only with square controls.
    const tokens: Record<string, string> =
      roleRung(state, "roleItem") === "none" &&
      roleRung(state, "roleControl") !== "none"
        ? { "--studio-tooltip-radius": "var(--studio-radius-detail)" }
        : {}
    return { tokens, params: { tooltip: { style: state.tooltipStyle } } }
  },
})
