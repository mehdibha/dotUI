/* Dialogs — how modal layers meet the page. Backdrop: a plain scrim
   (shadcn/Radix, Vaul), a lighter scrim that frosts the page behind (Apple
   sheets, Arc), or nothing but the panel's shadow (Linear). Position: the
   classic centered modal, or docked in the upper third (Linear, Raycast) so the
   top edge stays put as content grows. Entrance: how the panel arrives —
   Motion times it, and under Motion None nothing moves.

   Engine: `backdrop` is an enum param on both `modal` and `drawer` (a synced
   group — one axis writes both); `position` and `motion` are `modal` params. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const DIALOG_DEFAULTS = {
  dialogBackdrop: "dim",
  dialogPosition: "center",
  dialogEntrance: "scale",
}

export const BACKDROP_OPTIONS = [
  { value: "dim", label: "Dim" },
  { value: "blur", label: "Blur" },
  { value: "none", label: "None" },
]

export const POSITION_OPTIONS = [
  { value: "center", label: "Center" },
  { value: "top", label: "Top" },
]

/* Scale: fade and zoom from 95% (shadcn, Geist, Primer, Fluent 2); Rise: up
   from below (Spectrum 2, Polaris, Atlassian, Radix Themes' nearest); Drop:
   down from above (Carbon, Mantine). */
export const ENTRANCE_OPTIONS = [
  { value: "scale", label: "Scale", description: "shadcn" },
  { value: "rise", label: "Rise", description: "Polaris" },
  { value: "drop", label: "Drop", description: "Carbon" },
]

export const DIALOG_SCHEMA: ChapterSchema<typeof DIALOG_DEFAULTS> = {
  dialogBackdrop: oneOf(BACKDROP_OPTIONS),
  dialogPosition: oneOf(POSITION_OPTIONS),
  dialogEntrance: oneOf(ENTRANCE_OPTIONS),
}

export function resolveDialogs(state: Effective): Resolved {
  const backdrop = state.dialogBackdrop
  return {
    params: {
      modal: {
        backdrop,
        position: state.dialogPosition,
        motion: state.motion === "none" ? "none" : state.dialogEntrance,
      },
      drawer: { backdrop },
    },
  }
}

export const chapter = defineChapter({
  id: "dialogs",
  defaults: DIALOG_DEFAULTS,
  schema: DIALOG_SCHEMA,
  resolve: resolveDialogs,
})
