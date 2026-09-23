/* Which design system the docs previews render: the studio's working system
   (the default), a built-in, or a saved system. One persisted key, spelled
   like the picker's item ids: absent = working, `<id>` = built-in,
   `saved:<id>` = saved. A pick that no longer exists reads as working. */

import { createPersistedStore } from "@/lib/persisted-store"
import { PRESETS } from "@/modules/presets/catalog"
import type { PresetPickerSection } from "@/modules/presets/preset-picker"
import { cleanSystem, readDoc } from "@/modules/studio/doc"
import type { StudioDoc } from "@/modules/studio/doc"
import { ORIGIN_ID } from "@/modules/studio/preset/codec"
import { designOf } from "@/modules/studio/preset/saved-systems"
import type { SavedSystem } from "@/modules/studio/preset/saved-systems"
import { readWorking } from "@/modules/studio/preset/storage"
import type { DesignSystem } from "@/modules/studio/preset/types"
import { resolveDesignSystem } from "@/modules/studio/resolve"

export type PreviewSelection =
  | { kind: "working" }
  | { kind: "builtin"; id: string }
  | { kind: "saved"; id: string }

const WORKING: PreviewSelection = { kind: "working" }
const WORKING_ID = "working"
const SAVED = "saved:"

/** A stored value or picker id back into a selection; `yours` (the old
 *  working pick) and anything unknown read as working. */
export function decodeSelection(raw: string): PreviewSelection {
  if (raw.startsWith(SAVED)) {
    const id = cleanSystem(raw.slice(SAVED.length))
    return id ? { kind: "saved", id } : WORKING
  }
  return PRESETS.some((p) => p.id === raw)
    ? { kind: "builtin", id: raw }
    : WORKING
}

/** The selection's picker id. */
export function selectionId(selection: PreviewSelection): string {
  if (selection.kind === "saved") return `${SAVED}${selection.id}`
  return selection.kind === "builtin" ? selection.id : WORKING_ID
}

export const selectionStore = createPersistedStore<PreviewSelection>(
  "dotui:preview-preset",
  WORKING,
  {
    decode: decodeSelection,
    encode: (s) => (s.kind === "working" ? null : selectionId(s)),
  },
)

const resolved = new WeakMap<StudioDoc, DesignSystem>()

/** Docs are cached by query (see readSearch), so each resolves once; a
 *  pristine built-in reuses the catalog's. */
function resolveDoc(doc: StudioDoc): DesignSystem {
  const builtIn = PRESETS.find(
    (p) => p.id === doc.base.id && p.rev === doc.base.rev,
  )
  if (builtIn && !doc.modified) return builtIn.designSystem
  let ds = resolved.get(doc)
  if (!ds) {
    ds = resolveDesignSystem(doc.state)
    resolved.set(doc, ds)
  }
  return ds
}

const docOf = (system: SavedSystem) =>
  readDoc(designOf(system) ?? { preset: ORIGIN_ID })

export interface PreviewView {
  /** The effective selection's picker id. */
  selectedId: string
  /** The trigger's label and dot. */
  name: string
  swatch: string
  designSystem: DesignSystem
  sections: PresetPickerSection[]
}

function buildView(
  selection: PreviewSelection,
  stored: string | undefined,
  systems: SavedSystem[],
): PreviewView {
  const working = readWorking(stored)
  const saved = systems.find((s) => s.id === working.system)
  const workingName =
    saved?.name ??
    `${working.name ?? working.baseName}${working.modified ? " (modified)" : ""}`
  const workingItem = {
    id: WORKING_ID,
    name: "Your studio system",
    description: `${workingName}, as edited in the studio.`,
    swatch: working.state.brand,
    resolve: () => resolveDoc(working),
  }
  const savedItems = systems.map((system) => {
    const doc = docOf(system)
    return {
      id: `${SAVED}${system.id}`,
      name: system.name,
      swatch: doc.state.brand,
      resolve: () => resolveDoc(doc),
    }
  })
  const builtIns = PRESETS.map((p) => ({ ...p, resolve: () => p.designSystem }))
  const sections: PresetPickerSection[] = [
    { id: "studio", title: "Studio", items: [workingItem] },
    ...(savedItems.length > 0
      ? [{ id: "saved", title: "My systems", items: savedItems }]
      : []),
    { id: "featured", title: "Featured", items: builtIns },
  ]

  const id = selectionId(selection)
  const picked =
    selection.kind === "working"
      ? undefined
      : [...savedItems, ...builtIns].find((item) => item.id === id)
  if (!picked)
    return {
      selectedId: WORKING_ID,
      name: workingName,
      swatch: workingItem.swatch,
      designSystem: resolveDoc(working),
      sections,
    }
  return {
    selectedId: id,
    name: picked.name,
    swatch: picked.swatch,
    designSystem: picked.resolve(),
    sections,
  }
}

let last:
  | {
      selection: PreviewSelection
      working: string | undefined
      systems: SavedSystem[]
      view: PreviewView
    }
  | undefined

/** Every preview on a page reads the same view: built once per change of
 *  its inputs, not once per preview. */
export function previewView(
  selection: PreviewSelection,
  working: string | undefined,
  systems: SavedSystem[],
): PreviewView {
  if (
    last?.selection !== selection ||
    last.working !== working ||
    last.systems !== systems
  )
    last = {
      selection,
      working,
      systems,
      view: buildView(selection, working, systems),
    }
  return last.view
}
