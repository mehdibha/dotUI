"use client"

/* The lab panel mounted in /create's slot. The chrome (switcher, reset,
   search, save, export) is wired to the real create engine here — the
   switcher is the existing PresetPicker (saved systems + built-in presets,
   live previews, unsaved-changes guard), reachable at ?gallery= like before.
   Chapter axes stay lab-local until each chapter is wired in turn. */

import { useMemo, useState } from "react"
import { getRouteApi } from "@tanstack/react-router"

import { cn } from "@/registry/lib/utils"
import { ExportDialog } from "@/modules/create/export"
import {
  decodePreset,
  encodePreset,
  useMyPresets,
} from "@/modules/create/preset"
import {
  saveDesignSystemName,
  useDesignSystemName,
} from "@/modules/create/preset/storage"
import { SavePresetDialog } from "@/modules/create/save-preset-dialog"
import { SavedPresetActions } from "@/modules/create/saved-preset-actions"
import { UnsavedChangesDialog } from "@/modules/create/unsaved-changes-dialog"
import { PresetPicker } from "@/modules/presets/preset-picker"
import { ORIGIN, PRESETS } from "@/modules/presets/presets-data"

import type { PanelSystem } from "./panel"
import { CHAPTERS } from "./state"
import { useLab } from "./use-lab"
import { PanelB } from "./variants/panel-b"

const routeApi = getRouteApi("/_app/create")

function canon(state: string): string {
  if (!state) return ""
  return encodePreset(decodePreset(state)) ?? ""
}

/* Origin is the panel's baseline: what first-time users start on, what the
   global reset returns to, and what the modified dot diffs against. */
const ORIGIN_CANON = canon(encodePreset(ORIGIN.designSystem) ?? "")

export function LabCreatePanel({ className }: { className?: string }) {
  const lab = useLab()
  const { preset, gallery } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const {
    presets,
    activeId,
    setActive,
    save,
    update,
    rename,
    duplicate,
    remove,
  } = useMyPresets()
  const storedName = useDesignSystemName()
  const [saveOpen, setSaveOpen] = useState(false)
  // Preset pick held back by the unsaved-changes guard, awaiting save/discard.
  const [pendingPick, setPendingPick] = useState<string | null>(null)

  // The header names what's being edited: the active saved system (dotted when
  // edited past its snapshot), else the standalone design-system name.
  const activeSaved = presets.find((p) => p.id === activeId)
  const displayName = activeSaved?.name ?? storedName

  // Built-in presets are re-loadable from the gallery, so a freshly applied one
  // isn't unsaved work — only edits past it (or past a saved snapshot) are.
  // encode∘decode isn't byte-identical (a reload's seeded state re-encodes
  // slightly differently), so states compare in canonical form — one roundtrip
  // reaches a fixed point.
  const builtInStates = useMemo(
    () =>
      new Set(PRESETS.map((p) => canon(encodePreset(p.designSystem) ?? ""))),
    [],
  )
  const currentState = preset ?? ""
  const currentCanon = canon(currentState)
  const isDirty = activeSaved
    ? canon(activeSaved.state) !== currentCanon
    : currentCanon !== "" && !builtInStates.has(currentCanon)

  // Saved systems decode to full design systems for the picker's mini previews.
  const pickerSections = useMemo(() => {
    const mine = {
      id: "mine",
      title: "My systems",
      items: presets.map((saved) => ({
        id: saved.id,
        name: saved.name,
        designSystem: decodePreset(saved.state),
      })),
    }
    const builtIn = {
      id: "built-in",
      title: "Presets",
      items: PRESETS.map((p) => ({
        id: p.id,
        name: p.name,
        designSystem: p.designSystem,
      })),
    }
    return presets.length > 0 ? [mine, builtIn] : [builtIn]
  }, [presets])

  // Apply a state and close the gallery in one navigation — two separate
  // navigates would race each other's search updates.
  function applyState(encoded: string | undefined) {
    navigate({
      search: (prev) => ({
        ...prev,
        preset: encoded || undefined,
        gallery: undefined,
      }),
      replace: true,
    })
  }

  function setGalleryOpen(open: boolean) {
    navigate({
      search: (prev) => ({ ...prev, gallery: open ? true : undefined }),
      replace: true,
    })
  }

  function pickPreset(itemId: string) {
    const saved = presets.find((p) => p.id === itemId)
    if (saved) {
      setActive(saved.id)
      saveDesignSystemName(saved.name)
      applyState(saved.state)
      return
    }
    const builtIn = PRESETS.find((p) => p.id === itemId)
    if (!builtIn) return
    setActive(undefined)
    saveDesignSystemName(builtIn.name)
    applyState(encodePreset(builtIn.designSystem))
  }

  // Applying a preset over unsaved work asks first; over clean state it's instant.
  function requestPick(itemId: string) {
    if (isDirty) setPendingPick(itemId)
    else pickPreset(itemId)
  }

  function resolvePendingPick(saveFirst: boolean) {
    if (saveFirst) {
      if (activeSaved) update(activeSaved.id, currentState)
      else save(displayName, currentState)
    }
    if (pendingPick) pickPreset(pendingPick)
    setPendingPick(null)
  }

  const system: PanelSystem = {
    name: displayName,
    dirty: isDirty,
    modified: currentCanon !== ORIGIN_CANON,
    onReset: () => pickPreset(ORIGIN.id),
    onSave: () => setSaveOpen(true),
    renderSwitcher: (trigger) => (
      <PresetPicker
        isOpen={gallery === true}
        onOpenChange={setGalleryOpen}
        sections={pickerSections}
        selectedId={activeSaved && !isDirty ? activeSaved.id : undefined}
        onPick={(item) => requestPick(item.id)}
        withPreview
        renderItemActions={(item) => {
          const saved = presets.find((p) => p.id === item.id)
          if (!saved) return null
          return (
            <SavedPresetActions
              saved={saved}
              onRename={(name) => rename(saved.id, name)}
              onDuplicate={() => duplicate(saved.id)}
              onDelete={() => remove(saved.id)}
            />
          )
        }}
      >
        {trigger}
      </PresetPicker>
    ),
    renderExport: (trigger) => <ExportDialog>{trigger}</ExportDialog>,
  }

  return (
    <div
      className={cn(
        "relative flex w-full flex-1 flex-col lg:w-76 lg:flex-none lg:shrink-0",
        className,
      )}
    >
      <PanelB chapters={CHAPTERS} lab={lab} system={system} />
      <SavePresetDialog isOpen={saveOpen} onOpenChange={setSaveOpen} />
      <UnsavedChangesDialog
        isOpen={pendingPick !== null}
        onOpenChange={(open) => {
          if (!open) setPendingPick(null)
        }}
        onSave={() => resolvePendingPick(true)}
        onDiscard={() => resolvePendingPick(false)}
      />
    </div>
  )
}
