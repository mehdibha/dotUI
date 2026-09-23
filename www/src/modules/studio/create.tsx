"use client"

/* The studio panel mounted in /studio's slot: the panel page over the
   studio document, with the chrome (switcher, save, reset, search) wired to
   presets. The switcher is the PresetPicker (saved systems + built-in
   presets, live previews, unsaved-changes guard), reachable at ?gallery=. */

import { useMemo, useRef, useState } from "react"
import { getRouteApi } from "@tanstack/react-router"

import { cn } from "@/registry/lib/utils"
import { toastManager } from "@/registry/ui/toast"
import { PRESETS } from "@/modules/presets/catalog"
import { PresetPicker } from "@/modules/presets/preset-picker"
import { CreatePresetDialog } from "@/modules/studio/create-preset-dialog"
import { ORIGIN_ID } from "@/modules/studio/preset/codec"
import {
  designOf,
  duplicateSystem,
  exportSystems,
  importSystems,
  removeSystem,
  renameSystem,
  saveSystem,
  updateSystem,
  useSavedSystems,
} from "@/modules/studio/preset/saved-systems"
import type { SavedSystem } from "@/modules/studio/preset/saved-systems"
import { SavePresetDialog } from "@/modules/studio/save-preset-dialog"
import {
  SavedSystemActions,
  SavedSystemsMenu,
} from "@/modules/studio/saved-system-actions"
import { UnsavedChangesDialog } from "@/modules/studio/unsaved-changes-dialog"

import { readDoc, resetSearch } from "./doc"
import { PanelPage } from "./page"
import type { PanelSystem } from "./panel"
import { resolveDesignSystem } from "./resolve"
import { CHAPTERS } from "./state"
import { useStudio } from "./use-studio"

const routeApi = getRouteApi("/_app/studio")

export function StudioPanel({ className }: { className?: string }) {
  const studio = useStudio()
  const { doc, search, saved, commit } = studio
  const { gallery } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const systems = useSavedSystems()
  const [saveOpen, setSaveOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  // An action held back by the unsaved-changes guard, awaiting save/discard.
  const [pending, setPending] = useState<(() => void) | null>(null)

  const pickerSections = useMemo(() => {
    const mine = {
      id: "mine",
      title: "My systems",
      items: systems.map((record) => {
        const { state } = readDoc(designOf(record) ?? {})
        return {
          id: record.id,
          name: record.name,
          swatch: state.brand,
          resolve: () => resolveDesignSystem(state),
        }
      }),
    }
    const featured = {
      id: "featured",
      title: "Featured",
      items: PRESETS.map((p) => ({ ...p, resolve: () => p.designSystem })),
    }
    return systems.length > 0 ? [mine, featured] : [featured]
  }, [systems])

  function setGalleryOpen(open: boolean) {
    navigate({
      search: (prev) => ({ ...prev, gallery: open ? true : undefined }),
      replace: true,
    })
  }

  function pick(id: string) {
    const record = systems.find((s) => s.id === id)
    if (record) {
      const design = designOf(record) ?? { preset: ORIGIN_ID }
      commit({ ...design, system: record.id }, { adopt: true })
    } else if (PRESETS.some((p) => p.id === id)) {
      commit({ preset: id }, { adopt: true })
    }
  }

  function saveNew(name: string) {
    commit(
      { ...search, name: undefined, system: saveSystem(name, search) },
      { adopt: true },
    )
  }

  function remove(record: SavedSystem) {
    const undo = removeSystem(record.id)
    if (!undo) return
    toastManager.add({
      title: `Deleted “${record.name}”`,
      actionProps: { children: "Undo", onClick: undo },
    })
  }

  const importInput = useRef<HTMLInputElement>(null)

  function exportAll() {
    const url = URL.createObjectURL(
      new Blob([exportSystems()], { type: "application/json" }),
    )
    const link = document.createElement("a")
    link.href = url
    link.download = "dotui-systems.json"
    link.click()
    URL.revokeObjectURL(url)
  }

  async function importFile(file: File) {
    const added = importSystems(await file.text())
    toastManager.add(
      added === undefined
        ? {
            title: "This file isn't a saved systems export",
            type: "warning",
          }
        : {
            title:
              added === 1
                ? "Imported 1 design system"
                : `Imported ${added} design systems`,
          },
    )
  }

  function reset() {
    const before = search
    commit(resetSearch(doc))
    toastManager.add({
      title: `Reset to ${doc.baseName}`,
      actionProps: { children: "Undo", onClick: () => commit(before) },
    })
  }

  // Replacing unsaved work asks first; over clean work it's instant.
  function guarded(action: () => void) {
    if (studio.dirty) setPending(() => action)
    else action()
  }

  const newName = doc.name ?? "Untitled"

  function resolvePending(saveFirst: boolean) {
    if (saveFirst) {
      if (saved) updateSystem(saved.id, search)
      else saveSystem(newName, search)
    }
    pending?.()
    setPending(null)
  }

  const system: PanelSystem = {
    name: studio.label,
    dirty: saved !== undefined && studio.dirty,
    unsaved: studio.dirty,
    modified: doc.modified,
    shared: studio.owned === false,
    onReset: () => guarded(reset),
    onSave: () => setSaveOpen(true),
    renderSwitcher: (trigger) => (
      <PresetPicker
        isOpen={gallery === true}
        onOpenChange={setGalleryOpen}
        sections={pickerSections}
        selectedId={saved?.id ?? doc.base.id}
        onPick={(item) => guarded(() => pick(item.id))}
        onCreate={() => setCreateOpen(true)}
        toolbar={
          <SavedSystemsMenu
            canExport={systems.length > 0}
            onExport={exportAll}
            onImport={() => importInput.current?.click()}
          />
        }
        withPreview
        renderItemActions={(item) => {
          const record = systems.find((s) => s.id === item.id)
          if (!record) return null
          return (
            <SavedSystemActions
              saved={record}
              onRename={(name) => renameSystem(record.id, name)}
              onDuplicate={() => duplicateSystem(record.id)}
              onDelete={() => remove(record)}
            />
          )
        }}
      >
        {trigger}
      </PresetPicker>
    ),
  }

  return (
    <div
      className={cn(
        "relative flex w-full flex-1 flex-col lg:w-64 lg:flex-none lg:shrink-0",
        className,
      )}
    >
      <PanelPage chapters={CHAPTERS} studio={studio} system={system} />
      <SavePresetDialog
        isOpen={saveOpen}
        onOpenChange={setSaveOpen}
        defaultName={newName}
        updateTarget={saved?.name}
        onSaveNew={saveNew}
        onUpdate={() => saved && updateSystem(saved.id, search)}
      />
      <CreatePresetDialog
        isOpen={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={(name) =>
          guarded(() =>
            commit(
              {
                preset: ORIGIN_ID,
                system: saveSystem(name, { preset: ORIGIN_ID }),
              },
              { adopt: true },
            ),
          )
        }
      />
      <input
        ref={importInput}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(e) => {
          const file = e.currentTarget.files?.[0]
          e.currentTarget.value = ""
          if (file) void importFile(file)
        }}
      />
      <UnsavedChangesDialog
        isOpen={pending !== null}
        onOpenChange={(open) => {
          if (!open) setPending(null)
        }}
        subject={saved?.name ?? studio.label}
        saveLabel={saved ? `Update “${saved.name}”` : `Save as “${newName}”`}
        onSave={() => resolvePending(true)}
        onDiscard={() => resolvePending(false)}
      />
    </div>
  )
}
