/* Alert: the inline notice's fill, edge and status ink. A solid status
   alert stays per instance, never a style. */

import { defineChapter } from "./core/types"
import type { Effective, Resolved } from "./index"
import { oneOf } from "./schema"
import type { ChapterSchema } from "./schema"

export const ALERT_DEFAULTS = {
  alertStyle: "neutral",
}

export const STYLE_OPTIONS = [
  { value: "neutral", label: "Neutral", description: "shadcn, HeroUI" },
  {
    value: "soft",
    label: "Soft",
    description: "Radix Themes, Atlassian, Mantine, Chakra, Polaris",
  },
  {
    value: "soft-outline",
    label: "Soft + outline",
    description: "Primer, Ant Design, Fluent 2, Supabase",
  },
  { value: "outline", label: "Outline", description: "Geist, Spectrum 2" },
  { value: "inverse", label: "Inverse", description: "Carbon" },
]

export const ALERT_SCHEMA: ChapterSchema<typeof ALERT_DEFAULTS> = {
  alertStyle: oneOf(STYLE_OPTIONS),
}

export function resolveAlert(state: Effective): Resolved {
  return { params: { alert: { style: state.alertStyle } } }
}

export const chapter = defineChapter({
  id: "alert",
  defaults: ALERT_DEFAULTS,
  schema: ALERT_SCHEMA,
  resolve: resolveAlert,
})
