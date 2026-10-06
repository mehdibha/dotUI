/* Dialogs: backdrop (`modal` + `drawer` params), position and entrance (`modal` params). */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const DIALOG_DEFAULTS = {
  dialogBackdrop: "dim",
  dialogPosition: "center",
  dialogEntrance: "scale",
}

// Dim: shadcn, Radix, Vaul; Blur: Apple sheets, Arc; None: Linear.
export const BACKDROP_OPTIONS = [
  { value: "dim", label: "Dim" },
  { value: "blur", label: "Blur" },
  { value: "none", label: "None" },
]

// Top: Linear, Raycast.
export const POSITION_OPTIONS = [
  { value: "center", label: "Center" },
  { value: "top", label: "Top" },
]

// Scale: shadcn, Geist, Primer, Fluent 2; Rise: Spectrum 2, Polaris, Atlassian; Drop: Carbon, Mantine.
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
