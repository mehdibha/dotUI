import { PRESET_META, resolvePreset } from "@/modules/presets"
import type { PresetPickerSection } from "@/modules/presets/preset-picker"

import { resolveDesignSystem } from "./resolve"
import { describe, selectionKey } from "./selection"
import type { Selection } from "./selection"
import { listed } from "./workspace"
import type { Workspace } from "./workspace"

/** What the studio and docs pickers list: the unsaved slot and the user's
 *  systems, then the presets, keyed by selection. */
export function pickerSections(workspace: Workspace): PresetPickerSection[] {
  const mine: Selection[] = listed(workspace).map((s) => ({
    kind: "system",
    id: s.id,
  }))
  if (workspace.unsaved) mine.unshift({ kind: "unsaved" })
  const presets: PresetPickerSection = {
    id: "presets",
    title: "Presets",
    items: PRESET_META.map((meta) => ({
      ...meta,
      id: selectionKey({ kind: "preset", id: meta.id }),
      resolve: () => resolvePreset(meta.id),
    })),
  }
  if (mine.length === 0) return [presets]
  const items = mine.map((sel) => {
    const shown = describe(sel, workspace)
    return {
      id: shown.key,
      name: shown.name,
      swatch: shown.swatch,
      hasMenu: true,
      resolve: () => resolveDesignSystem(shown.state),
    }
  })
  return [{ id: "mine", title: "My design systems", items }, presets]
}
