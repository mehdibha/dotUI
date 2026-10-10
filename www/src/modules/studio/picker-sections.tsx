import { PRESET_META, resolvePreset } from "@/modules/presets"
import type { PresetPickerSection } from "@/modules/presets/preset-picker"

import { designSystemOf } from "./resolve"
import { describe, selectionKey } from "./selection"
import { listed } from "./workspace"
import type { Workspace } from "./workspace"

/** What the studio and docs pickers list: the user's systems, then the
 *  presets, keyed by selection. The unsaved slot is no row. */
export function pickerSections(workspace: Workspace): PresetPickerSection[] {
  const presets: PresetPickerSection = {
    id: "presets",
    title: "Presets",
    items: PRESET_META.map((meta) => ({
      ...meta,
      id: selectionKey({ kind: "preset", id: meta.id }),
      resolve: () => resolvePreset(meta.id),
    })),
  }
  const systems = listed(workspace)
  if (systems.length === 0) return [presets]
  const items = systems.map(({ id }) => {
    const shown = describe({ kind: "system", id }, workspace)
    return {
      id: shown.key,
      name: shown.name,
      swatch: shown.swatch,
      hasMenu: true,
      resolve: () => designSystemOf(shown.state),
    }
  })
  return [{ id: "mine", title: "My design systems", items }, presets]
}
