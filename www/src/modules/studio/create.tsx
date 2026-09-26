"use client"

/* The studio panel mounted in /studio's slot: the panel page over the current
   design system, its chrome wired to the workspace. The picker lists the
   shared link being viewed, the user's systems (the draft first) and the
   presets, each with a ⋯ menu, and opens at ?gallery=. */

import { useEffect, useMemo, useState } from "react"
import { getRouteApi } from "@tanstack/react-router"

import { cn } from "@/registry/lib/utils"
import { MenuContent, MenuItem } from "@/registry/ui/menu"
import { getPreset } from "@/modules/presets"
import { PresetPicker } from "@/modules/presets/preset-picker"

import { duplicate, newSystem, remove } from "./history"
import { HistoryControls, quoted, undoToast } from "./history-menu"
import { leave, leaving } from "./keep-dialog"
import { PanelPage } from "./page"
import type { PanelSystem } from "./panel"
import { pickerSections, rowSelection } from "./picker-sections"
import { RecentlyDeleted } from "./recently-deleted"
import { SystemMenu, ViewMenu } from "./row-menus"
import { getCurrent, select, selectionKey, useCurrent } from "./selection"
import type { Current, Selection } from "./selection"
import { CHAPTERS } from "./state"
import { useStudio } from "./use-studio"
import { purgeExpired, rename, useTrash, useWorkspace } from "./workspace"
import type { Workspace } from "./workspace"

const routeApi = getRouteApi("/_app/studio")

const TEXT_ENTRY =
  "textarea, [contenteditable]:not([contenteditable='false']), input:not([type='range'], [type='checkbox'], [type='radio'], [type='button'], [type='color'])"

/** What the trigger's tooltip says after the name. */
function kindOf({ sel, doc }: Current, workspace: Workspace): string {
  if (sel.kind === "preset") return "preset, edits create a draft"
  if (sel.kind === "shared") return "shared link, edits create a draft"
  if (!doc) return ""
  const { origin } = doc
  const source =
    origin.kind === "preset"
      ? `based on ${getPreset(origin.id)?.name ?? "a preset"}`
      : origin.kind === "snapshot"
        ? "from a shared link"
        : `copy of ${workspace.systems.find((s) => s.id === origin.of)?.name ?? "a deleted system"}`
  return doc.draft ? `draft, ${source}` : source
}

export function StudioPanel({ className }: { className?: string }) {
  const studio = useStudio()
  const current = useCurrent()
  const workspace = useWorkspace()
  const trash = useTrash()
  const { gallery } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const [renaming, setRenaming] = useState<string>()
  const [trashOpen, setTrashOpen] = useState(false)

  const sections = useMemo(
    () => pickerSections(current, workspace),
    [current, workspace],
  )

  function setGalleryOpen(isOpen: boolean) {
    if (!isOpen) {
      setRenaming(undefined)
      setTrashOpen(false)
    }
    navigate({
      search: (prev) => ({ ...prev, gallery: isOpen ? true : undefined }),
      replace: true,
    })
  }

  /** Opens the picker with the current system's row in rename mode. */
  function renameCurrent() {
    const { doc, key } = getCurrent()
    if (!doc) return
    setTrashOpen(false)
    setRenaming(key)
    setGalleryOpen(true)
  }

  useEffect(() => purgeExpired(), [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "F2" || e.metaKey || e.ctrlKey || e.altKey) return
      if (e.target instanceof Element && e.target.closest(TEXT_ENTRY)) return
      e.preventDefault()
      renameCurrent()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  })

  function onPick(key: string) {
    if (key !== current.key) leave(() => select(rowSelection(key, current)))
  }

  /** Runs `create` (which opens a new system) past the keep dialog, then
   *  renames the new row. */
  function created(create: () => string | undefined, leaves = true) {
    const run = () => {
      const id = create()
      if (!id) return
      setRenaming(selectionKey({ kind: "system", id }))
      setGalleryOpen(true)
    }
    if (!leaves) return run()
    // The keep dialog can't sit over the picker.
    if (leaving()) setGalleryOpen(false)
    leave(run)
  }

  function onDelete(id: string) {
    const doc = workspace.systems.find((s) => s.id === id)
    if (!doc) return
    undoToast(
      `Deleted ${quoted(doc.name)}`,
      remove(id),
      doc.published.length ? "Its published links keep working." : undefined,
    )
  }

  function renderItemMenu(key: string) {
    const sel: Selection = rowSelection(key, current)
    const onDuplicate = () =>
      // Duplicating the draft on screen doesn't leave it.
      created(() => duplicate(sel), key !== current.key)
    if (sel.kind !== "system")
      return <ViewMenu sel={sel} onDuplicate={onDuplicate} />
    const doc = workspace.systems.find((s) => s.id === sel.id)
    if (!doc) return null
    return (
      <SystemMenu
        doc={doc}
        onRename={() => setRenaming(key)}
        onDuplicate={onDuplicate}
        onDelete={() => onDelete(doc.id)}
      />
    )
  }

  const kind = kindOf(current, workspace)
  const system: PanelSystem = {
    name: current.name,
    swatch: current.swatch,
    tag: current.tag,
    description: kind ? `${current.name} · ${kind}` : current.name,
    history: <HistoryControls current={current} />,
    renderSwitcher: (trigger) => (
      <PresetPicker
        isOpen={gallery === true}
        onOpenChange={setGalleryOpen}
        sections={sections}
        selectedId={current.key}
        onPick={(item) => onPick(item.id)}
        onCreate={() => created(newSystem)}
        renamingId={renaming}
        onRenameEnd={(key, name, submit) => {
          setRenaming(undefined)
          const doc = workspace.systems.find(
            (s) => selectionKey({ kind: "system", id: s.id }) === key,
          )
          if (doc && name !== null) rename(doc.id, name)
          if (submit) setGalleryOpen(false)
        }}
        onRenameKey={renameCurrent}
        withPreview
        renderItemMenu={(item) => renderItemMenu(item.id)}
        moreMenu={
          <MenuContent
            aria-label="More"
            onAction={(key) => key === "trash" && setTrashOpen(true)}
          >
            <MenuItem id="trash" isDisabled={trash.length === 0}>
              {`Recently deleted (${trash.length})`}
            </MenuItem>
          </MenuContent>
        }
        pane={
          trashOpen ? (
            <RecentlyDeleted onBack={() => setTrashOpen(false)} />
          ) : undefined
        }
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
    </div>
  )
}
