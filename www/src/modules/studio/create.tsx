"use client"

/* The studio panel mounted in /studio's slot: the panel page over the current
   design system, its chrome wired to the workspace. The picker lists the
   shared link being viewed, the user's systems (the draft first) and the
   presets, and opens at ?gallery=. */

import { useMemo, useState } from "react"
import { getRouteApi } from "@tanstack/react-router"
import { MoreHorizontalIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
import { PresetPicker } from "@/modules/presets/preset-picker"
import { share } from "@/modules/studio/export"

import { duplicate, newSystem, remove } from "./history"
import { HistoryControls, undoToast } from "./history-menu"
import { leave, leaving } from "./keep-dialog"
import { PanelPage } from "./page"
import type { PanelSystem } from "./panel"
import { pickerSections, rowSelection } from "./picker-sections"
import { select, selectionKey, useCurrent } from "./selection"
import { CHAPTERS } from "./state"
import { useStudio } from "./use-studio"
import { rename, useWorkspace } from "./workspace"
import type { DesignSystemDoc } from "./workspace"

const routeApi = getRouteApi("/_app/studio")

function SystemActions({
  doc,
  onRename,
}: {
  doc: DesignSystemDoc
  onRename: () => void
}) {
  return (
    <Menu>
      <Button
        variant="quiet"
        size="sm"
        isIconOnly
        aria-label={`Actions for ${doc.name}`}
        className="shrink-0 text-fg-muted"
      >
        <MoreHorizontalIcon />
      </Button>
      <Popover placement="bottom end">
        <MenuContent
          onAction={(key) => {
            if (key === "rename") onRename()
            if (key === "share") share(doc)
            if (key === "duplicate") duplicate(doc.id)
            if (key === "delete")
              undoToast(`Deleted "${doc.name}"`, remove(doc.id))
          }}
        >
          <MenuItem id="rename">Rename</MenuItem>
          <MenuItem id="share">Copy link</MenuItem>
          <MenuItem id="duplicate">Duplicate</MenuItem>
          <MenuItem id="delete" variant="danger">
            Delete
          </MenuItem>
        </MenuContent>
      </Popover>
    </Menu>
  )
}

export function StudioPanel({ className }: { className?: string }) {
  const studio = useStudio()
  const current = useCurrent()
  const workspace = useWorkspace()
  const { gallery } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const [renaming, setRenaming] = useState<string>()

  const sections = useMemo(
    () => pickerSections(current, workspace),
    [current, workspace],
  )

  function setGalleryOpen(isOpen: boolean) {
    if (!isOpen) setRenaming(undefined)
    navigate({
      search: (prev) => ({ ...prev, gallery: isOpen ? true : undefined }),
      replace: true,
    })
  }

  function systemOf(key: string) {
    return workspace.systems.find(
      (s) => selectionKey({ kind: "system", id: s.id }) === key,
    )
  }

  function onPick(key: string) {
    if (key !== current.key) leave(() => select(rowSelection(key, current)))
  }

  function onCreate() {
    // The keep dialog can't sit over the picker.
    if (leaving()) setGalleryOpen(false)
    leave(() => {
      const id = newSystem()
      if (!id) return
      setRenaming(selectionKey({ kind: "system", id }))
      setGalleryOpen(true)
    })
  }

  const system: PanelSystem = {
    name: current.name,
    swatch: current.swatch,
    tag: current.tag,
    history: <HistoryControls current={current} />,
    renderSwitcher: (trigger) => (
      <PresetPicker
        isOpen={gallery === true}
        onOpenChange={setGalleryOpen}
        sections={sections}
        selectedId={current.key}
        onPick={(item) => onPick(item.id)}
        onCreate={onCreate}
        renamingId={renaming}
        onRenameEnd={(key, name, submit) => {
          setRenaming(undefined)
          const doc = systemOf(key)
          if (doc && name !== null) rename(doc.id, name)
          if (submit) setGalleryOpen(false)
        }}
        withPreview
        renderItemActions={(item) => {
          const doc = systemOf(item.id)
          return doc ? (
            <SystemActions doc={doc} onRename={() => setRenaming(item.id)} />
          ) : null
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
    </div>
  )
}
