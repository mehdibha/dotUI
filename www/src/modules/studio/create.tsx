"use client"

/* The studio panel mounted in /studio's slot: the panel page over the
   studio document, with the chrome (switcher, save, reset, search) wired to
   presets. The switcher is the PresetPicker (saved systems + built-in
   presets, live previews, unsaved-changes guard), reachable at ?gallery=. */

import { useMemo, useState } from "react"
import { getRouteApi } from "@tanstack/react-router"

import { cn } from "@/registry/lib/utils"
import { toastManager } from "@/registry/ui/toast"
import { PRESETS } from "@/modules/presets/catalog"
import { PresetPicker } from "@/modules/presets/preset-picker"
import { CreatePresetDialog } from "@/modules/studio/create-preset-dialog"
import { useMyPresets } from "@/modules/studio/preset"
import { ORIGIN_ID } from "@/modules/studio/preset/codec"
import { SavePresetDialog } from "@/modules/studio/save-preset-dialog"
import { SavedPresetActions } from "@/modules/studio/saved-preset-actions"
import { UnsavedChangesDialog } from "@/modules/studio/unsaved-changes-dialog"

import { designQuery, readDoc, resetSearch, storedDesign } from "./doc"
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
  const { presets, save, update, rename, duplicate, remove } = useMyPresets()
  const [saveOpen, setSaveOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  // An action held back by the unsaved-changes guard, awaiting save/discard.
  const [pending, setPending] = useState<(() => void) | null>(null)

  const pickerSections = useMemo(() => {
    const mine = {
      id: "mine",
      title: "My systems",
      items: presets.map((record) => {
        const { state } = readDoc(storedDesign(record.state) ?? {})
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
    return presets.length > 0 ? [mine, featured] : [featured]
  }, [presets])

  function setGalleryOpen(open: boolean) {
    navigate({
      search: (prev) => ({ ...prev, gallery: open ? true : undefined }),
      replace: true,
    })
  }

  function pick(id: string) {
    const record = presets.find((p) => p.id === id)
    if (record) {
      const design = storedDesign(record.state) ?? { preset: ORIGIN_ID }
      commit({ ...design, system: record.id }, { adopt: true })
    } else if (PRESETS.some((p) => p.id === id)) {
      commit({ preset: id }, { adopt: true })
    }
  }

  function saveNew(name: string) {
    const design = designQuery(search)
    commit(
      { ...search, name: undefined, system: save(name, design) },
      {
        adopt: true,
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
      if (saved) update(saved.id, designQuery(search))
      else save(newName, designQuery(search))
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
        withPreview
        renderItemActions={(item) => {
          const record = presets.find((p) => p.id === item.id)
          if (!record) return null
          return (
            <SavedPresetActions
              saved={record}
              onRename={(name) => rename(record.id, name)}
              onDuplicate={() => duplicate(record.id)}
              onDelete={() => remove(record.id)}
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
        defaultName={saved?.name ?? doc.name ?? ""}
        updateTarget={saved?.name}
        onSaveNew={saveNew}
        onUpdate={() => saved && update(saved.id, designQuery(search))}
      />
      <CreatePresetDialog
        isOpen={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={(name) =>
          guarded(() =>
            commit(
              { preset: ORIGIN_ID, system: save(name, `preset=${ORIGIN_ID}`) },
              { adopt: true },
            ),
          )
        }
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
