import { PRESET_META, resolvePreset } from "@/modules/presets"
import type { PresetPickerSection } from "@/modules/presets/preset-picker"

import { resolveDesignSystem } from "./resolve"
import { selectionKey } from "./selection"
import type { Current, Selection } from "./selection"
import { listed } from "./workspace"
import type { Workspace } from "./workspace"

/** What the studio and docs pickers list: the shared link on screen, the
 *  user's systems (the draft first) and the presets, keyed by selection. */
export function pickerSections(
  current: Current,
  workspace: Workspace,
): PresetPickerSection[] {
  const sections: PresetPickerSection[] = []
  const { sel } = current
  if (sel.kind === "shared")
    sections.push({
      id: "shared",
      title: "Shared link",
      items: [
        {
          id: current.key,
          name: current.name,
          swatch: current.swatch,
          resolve: () => resolveDesignSystem(sel.state),
        },
      ],
    })
  const mine = listed(workspace)
  if (mine.length > 0)
    sections.push({
      id: "mine",
      title: "My design systems",
      items: mine.map((system) => ({
        id: selectionKey({ kind: "system", id: system.id }),
        name: system.name,
        swatch: system.state.brand,
        badge: system.draft ? "Draft" : undefined,
        resolve: () => resolveDesignSystem(system.state),
      })),
    })
  sections.push({
    id: "presets",
    title: "Presets",
    items: PRESET_META.map((meta) => ({
      ...meta,
      id: selectionKey({ kind: "preset", id: meta.id }),
      resolve: () => resolvePreset(meta.id),
    })),
  })
  return sections
}

/** The selection a picker row stands for; the shared row is the current
 *  selection. */
export function rowSelection(key: string, current: Current): Selection {
  const at = key.indexOf(":")
  const kind = key.slice(0, at)
  const id = key.slice(at + 1)
  if (kind === "preset") return { kind: "preset", id }
  if (kind === "system") return { kind: "system", id }
  return current.sel
}
