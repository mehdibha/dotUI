"use client"

/* The studio panel mounted in /studio's slot: the panel page over the current
   design system, its chrome wired to the workspace. The picker lists the
   shared link being viewed, the user's systems (the draft first) and the
   presets, each with a ⋯ menu, and opens at ?gallery=. */

import { useEffect, useMemo, useRef, useState } from "react"
import { getRouteApi } from "@tanstack/react-router"

import { cn } from "@/registry/lib/utils"
import { MenuContent, MenuItem } from "@/registry/ui/menu"
import { PresetPicker } from "@/modules/presets/preset-picker"

import { duplicate, newSystem, remove } from "./history"
import { renameKey } from "./history-keys"
import { HistoryControls } from "./history-menu"
import { leave, leaving } from "./keep-dialog"
import { PanelPage } from "./page"
import type { PanelSystem } from "./panel"
import { basedOn, pickerSections, rowSelection } from "./picker-sections"
import { RecentlyDeleted } from "./recently-deleted"
import { SystemMenu, ViewMenu } from "./row-menus"
import { getCurrent, select, selectionKey, useCurrent } from "./selection"
import type { Current, Selection } from "./selection"
import { CHAPTERS } from "./state"
import { useStudio } from "./use-studio"
import { purgeExpired, rename, useTrash, useWorkspace } from "./workspace"
import type { Workspace } from "./workspace"

const routeApi = getRouteApi("/_app/studio")

/** What the trigger's tooltip says after the name. */
function kindOf({ sel, doc }: Current, workspace: Workspace): string {
  if (sel.kind === "preset") return "preset, edits create a draft"
  if (sel.kind === "shared") return "shared link, edits create a draft"
  if (!doc) return ""
  const source = basedOn(doc, workspace)
  const lower = source.charAt(0).toLowerCase() + source.slice(1)
  return doc.draft ? `draft, ${lower}` : lower
}

export function StudioPanel({ className }: { className?: string }) {
  const studio = useStudio()
  const current = useCurrent()
  const workspace = useWorkspace()
  const trash = useTrash()
  const { gallery } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  // `closes`: Enter also closes the picker, which was opened for this rename.
  const [renaming, setRenaming] = useState<{ key: string; closes: boolean }>()
  const [trashOpen, setTrashOpen] = useState(false)
  const focusPicker = useRef<((key: string) => void) | null>(null)
  const lastNew = useRef({ at: 0, key: "" })

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
    setRenaming({ key, closes: gallery !== true })
    setGalleryOpen(true)
  }

  useEffect(() => purgeExpired(), [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!renameKey(e)) return
      e.preventDefault()
      renameCurrent()
    }
    // F2 pressed in the preview, handed up by its iframe.
    const onMessage = (e: MessageEvent) => {
      if (
        e.origin === window.location.origin &&
        e.data?.type === "preview-rename"
      )
        renameCurrent()
    }
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("message", onMessage)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("message", onMessage)
    }
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
      setRenaming({ key: selectionKey({ kind: "system", id }), closes: true })
      setGalleryOpen(true)
    }
    if (!leaves) return run()
    // The keep dialog can't sit over the picker.
    if (leaving()) setGalleryOpen(false)
    leave(run)
  }

  function onDelete(id: string) {
    remove(id, {
      // Back from the toast to the restored row, so Esc and arrows work.
      afterUndo: () => {
        setTrashOpen(false)
        requestAnimationFrame(() =>
          focusPicker.current?.(selectionKey({ kind: "system", id })),
        )
      },
    })
  }

  function renderItemMenu(key: string, afterClose: (run: () => void) => void) {
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
        isCurrent={key === current.key}
        onRename={() => setRenaming({ key, closes: false })}
        onDuplicate={onDuplicate}
        onDelete={() => afterClose(() => onDelete(doc.id))}
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
        onCreate={() => {
          // The second click of a double click is the same New: back to
          // renaming the row the first one made.
          const { at, key } = lastNew.current
          if (performance.now() - at < 500)
            return key && setRenaming({ key, closes: true })
          lastNew.current = { at: performance.now(), key: "" }
          created(() => {
            const id = newSystem()
            if (id) lastNew.current.key = selectionKey({ kind: "system", id })
            return id
          })
        }}
        renamingId={renaming?.key}
        onRenameEnd={(key, name, submit) => {
          setRenaming(undefined)
          const doc = workspace.systems.find(
            (s) => selectionKey({ kind: "system", id: s.id }) === key,
          )
          if (doc && name !== null) rename(doc.id, name)
          const closes = submit && renaming?.closes === true
          if (closes) setGalleryOpen(false)
          return closes
        }}
        onRenameKey={renameCurrent}
        focusRef={focusPicker}
        withPreview
        renderItemMenu={(item, afterClose) =>
          renderItemMenu(item.id, afterClose)
        }
        moreMenu={
          <MenuContent
            aria-label="More"
            onAction={(key) => key === "trash" && setTrashOpen(true)}
          >
            <MenuItem
              id="trash"
              isDisabled={trash.length === 0}
              className="pointer-coarse:min-h-11"
            >
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
