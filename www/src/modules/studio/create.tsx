"use client"

/* The studio panel mounted in /studio's slot: the drill-in panel over the
   studio state, with the chrome (switcher, reset, search, save, export) wired
   to presets and export. The switcher is the PresetPicker (saved systems +
   built-in presets, live previews, unsaved-changes guard), reachable at
   ?gallery= like before. */

import { useMemo, useState } from "react"
import { getRouteApi } from "@tanstack/react-router"

import { cn } from "@/registry/lib/utils"
import { PresetPicker } from "@/modules/presets/preset-picker"
import { ORIGIN, PRESETS } from "@/modules/presets/presets-data"
import { CreatePresetDialog } from "@/modules/studio/create-preset-dialog"
import { ExportDialog } from "@/modules/studio/export"
import {
  decodePreset,
  encodePreset,
  encodeState,
  useMyPresets,
} from "@/modules/studio/preset"
import {
  saveDesignSystemName,
  useDesignSystemName,
} from "@/modules/studio/preset/storage"
import { SavePresetDialog } from "@/modules/studio/save-preset-dialog"
import { SavedPresetActions } from "@/modules/studio/saved-preset-actions"
import { UnsavedChangesDialog } from "@/modules/studio/unsaved-changes-dialog"

import { DrillInPanel } from "./drill-in"
import type { PanelSystem } from "./panel"
import { resolveDesignSystem } from "./resolve"
import { INSTANT_POPOVER } from "./rows"
import { CHAPTERS } from "./state"
import { useStudio } from "./use-studio"

const routeApi = getRouteApi("/_app/studio")

/* The codec is canonical (encode∘decode = identity), but states from storage
   may predate it — one roundtrip normalizes those. */
function canon(state: string): string {
  if (!state) return ""
  return encodePreset(decodePreset(state)) ?? ""
}

/* Origin is the panel's baseline: what first-time users start on, what the
   global reset returns to, and what the modified dot diffs against. */
const ORIGIN_CANON = encodeState(ORIGIN.state) ?? ""

export function StudioPanel({ className }: { className?: string }) {
  const studio = useStudio()
  const { gallery } = routeApi.useSearch()
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
  const [createOpen, setCreateOpen] = useState(false)
  // A pick or create held back by the unsaved-changes guard, awaiting save/discard.
  const [pending, setPending] = useState<(() => void) | null>(null)

  // The header names what's being edited: the active saved system (dotted when
  // edited past its snapshot), else the standalone design-system name.
  const activeSaved = presets.find((p) => p.id === activeId)
  const displayName = activeSaved?.name ?? storedName

  // Built-in presets are re-loadable from the gallery, so a freshly applied one
  // isn't unsaved work — only edits past it (or past a saved snapshot) are.
  const builtInStates = useMemo(
    () => new Set(PRESETS.map((p) => encodeState(p.state) ?? "")),
    [],
  )
  const currentState = studio.encoded ?? ""
  const isDirty = activeSaved
    ? canon(activeSaved.state) !== currentState
    : currentState !== "" && !builtInStates.has(currentState)

  // Saved systems decode to full design systems for the picker's mini previews.
  const pickerSections = useMemo(() => {
    const mine = {
      id: "mine",
      title: "My systems",
      items: presets.map((saved) => ({
        id: saved.id,
        name: saved.name,
        designSystem: resolveDesignSystem(decodePreset(saved.state).state),
      })),
    }
    const featured = {
      id: "featured",
      title: "Featured",
      items: PRESETS.map((p) => ({
        id: p.id,
        name: p.name,
        designSystem: p.designSystem,
      })),
    }
    return presets.length > 0 ? [mine, featured] : [featured]
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
    applyState(encodeState(builtIn.state))
  }

  function createPreset(name: string, state: string) {
    save(name, state)
    saveDesignSystemName(name)
    applyState(state)
  }

  // Replacing the state over unsaved work asks first; over clean state it's instant.
  function guarded(action: () => void) {
    if (isDirty) setPending(() => action)
    else action()
  }

  function resolvePending(saveFirst: boolean) {
    if (saveFirst) {
      if (activeSaved) update(activeSaved.id, currentState)
      else save(displayName, currentState)
    }
    pending?.()
    setPending(null)
  }

  const system: PanelSystem = {
    name: displayName,
    dirty: isDirty,
    modified: currentState !== ORIGIN_CANON,
    onReset: () => pickPreset(ORIGIN.id),
    onSave: () => setSaveOpen(true),
    renderSwitcher: (trigger) => (
      <PresetPicker
        isOpen={gallery === true}
        onOpenChange={setGalleryOpen}
        popoverClassName={INSTANT_POPOVER}
        sections={pickerSections}
        selectedId={activeSaved && !isDirty ? activeSaved.id : undefined}
        onPick={(item) => guarded(() => pickPreset(item.id))}
        onCreate={() => setCreateOpen(true)}
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
      <DrillInPanel chapters={CHAPTERS} studio={studio} system={system} />
      <SavePresetDialog isOpen={saveOpen} onOpenChange={setSaveOpen} />
      <CreatePresetDialog
        isOpen={createOpen}
        onOpenChange={setCreateOpen}
        presets={presets}
        activeId={activeSaved?.id}
        currentState={currentState}
        onCreate={(name, state) => guarded(() => createPreset(name, state))}
      />
      <UnsavedChangesDialog
        isOpen={pending !== null}
        onOpenChange={(open) => {
          if (!open) setPending(null)
        }}
        onSave={() => resolvePending(true)}
        onDiscard={() => resolvePending(false)}
      />
    </div>
  )
}
