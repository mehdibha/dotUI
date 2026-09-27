"use client"

/* The studio panel mounted in /studio's slot: the panel page over the current
   design system, its chrome wired to the workspace. The picker lists the
   shared link being viewed, the user's systems and the presets, and opens
   at ?gallery=. */

import { useEffect, useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"
import { getRouteApi } from "@tanstack/react-router"
import { Redo2Icon, Undo2Icon } from "lucide-react"

import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { MenuContent, MenuItem } from "@/registry/ui/menu"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"
import { PresetPicker } from "@/modules/presets/preset-picker"

import {
  duplicate,
  newSystem,
  redo,
  remove,
  undo,
  useUndoRedo,
} from "./history"
import { renameKey } from "./history-keys"
import { PanelPage } from "./page"
import type { PanelSystem } from "./panel"
import { pickerSections, rowSelection } from "./picker-sections"
import { RecentlyDeleted } from "./recently-deleted"
import { SystemMenu } from "./row-menus"
import { getCurrent, select, selectionKey, useCurrent } from "./selection"
import type { Selection } from "./selection"
import { CHAPTERS } from "./state"
import { useStudio } from "./use-studio"
import { purgeExpired, rename, useTrash, useWorkspace } from "./workspace"

const routeApi = getRouteApi("/_app/studio")

function HistoryButton({
  label,
  isDisabled,
  onPress,
  children,
}: {
  label: string
  isDisabled: boolean
  onPress: () => void
  children: ReactNode
}) {
  return (
    <Tooltip delay={0}>
      <Button
        size="sm"
        variant="quiet"
        isIconOnly
        aria-label={label}
        isDisabled={isDisabled}
        onPress={onPress}
        className="text-fg-muted disabled:bg-transparent data-icon-only:size-6 pointer-coarse:data-icon-only:size-9"
      >
        {children}
      </Button>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

function UndoRedo({ selection }: { selection: string }) {
  const { canUndo, canRedo } = useUndoRedo(selection)
  return (
    <>
      <HistoryButton label="Undo" isDisabled={!canUndo} onPress={undo}>
        <Undo2Icon />
      </HistoryButton>
      <HistoryButton label="Redo" isDisabled={!canRedo} onPress={redo}>
        <Redo2Icon />
      </HistoryButton>
    </>
  )
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

  /** Renames the row of a system just created. */
  function created(id: string | undefined) {
    if (!id) return
    setRenaming({ key: selectionKey({ kind: "system", id }), closes: true })
    setGalleryOpen(true)
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
    if (sel.kind !== "system") return null
    const doc = workspace.systems.find((s) => s.id === sel.id)
    if (!doc) return null
    return (
      <SystemMenu
        doc={doc}
        isCurrent={key === current.key}
        onRename={() => setRenaming({ key, closes: false })}
        onDuplicate={() => created(duplicate(doc.id))}
        onDelete={() => afterClose(() => onDelete(doc.id))}
      />
    )
  }

  const system: PanelSystem = {
    name: current.name,
    swatch: current.swatch,
    tag: current.tag,
    history: <UndoRedo selection={current.key} />,
    renderSwitcher: (trigger) => (
      <PresetPicker
        isOpen={gallery === true}
        onOpenChange={setGalleryOpen}
        sections={sections}
        selectedId={current.key}
        onPick={(item) => select(rowSelection(item.id, current))}
        onCreate={() => {
          // The second click of a double click is the same New: back to
          // renaming the row the first one made. Timed by input, as the
          // first New can hold the second press back past the window.
          const now = window.event?.timeStamp ?? performance.now()
          const { at, key } = lastNew.current
          if (now - at < 500) return key && setRenaming({ key, closes: true })
          lastNew.current = { at: now, key: "" }
          const id = newSystem()
          if (id) lastNew.current.key = selectionKey({ kind: "system", id })
          created(id)
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
