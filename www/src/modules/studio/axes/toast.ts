/* Toast: its surface, independent of alert and tooltip, and how a status
   toast shows its status. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const TOAST_DEFAULTS = {
  toastStyle: "surface",
  toastStatus: "icon",
}

export const STYLE_OPTIONS = [
  {
    value: "surface",
    label: "Surface",
    description: "Sonner, Atlassian, Fluent 2, Ant Design, HeroUI, Chakra",
  },
  {
    value: "inverse",
    label: "Inverse",
    description: "Material 3, Polaris, Spectrum 2, Carbon",
  },
]

export const STATUS_OPTIONS = [
  {
    value: "icon",
    label: "Icon",
    description: "Sonner, Fluent 2, Ant Design, HeroUI, Mantine, Carbon",
  },
  {
    value: "bold",
    label: "Bold",
    description: "Spectrum 2, Polaris, Chakra, Atlassian",
  },
  { value: "soft", label: "Soft", description: "Sonner (rich), Carbon (low)" },
]

export const TOAST_SCHEMA: ChapterSchema<typeof TOAST_DEFAULTS> = {
  toastStyle: oneOf(STYLE_OPTIONS),
  toastStatus: oneOf(STATUS_OPTIONS),
}

export function resolveToast(state: Effective): Resolved {
  // On Inverse, the status icon takes the solid color to read.
  const status =
    state.toastStatus === "icon" && state.toastStyle === "inverse"
      ? "solid-icon"
      : state.toastStatus
  return {
    params: { toast: { surface: state.toastStyle, status } },
  }
}

export const chapter = defineChapter({
  id: "toast",
  defaults: TOAST_DEFAULTS,
  schema: TOAST_SCHEMA,
  resolve: resolveToast,
})
