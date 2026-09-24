"use client"

/* The studio panel mounted in /studio's slot: the panel page over the open
   design system, its chrome wired to the workspace. The switcher lists the
   user's systems over the built-in presets and opens at ?gallery=. */

import { useMemo } from "react"
import { getRouteApi } from "@tanstack/react-router"
import { MoreHorizontalIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { Menu, MenuContent, MenuItem } from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
import { toastManager } from "@/registry/ui/toast"
import {
  getPreset,
  ORIGIN,
  PRESET_META,
  resolvePreset,
} from "@/modules/presets"
import { PresetPicker } from "@/modules/presets/preset-picker"
import { share } from "@/modules/studio/export"

import { sameState } from "./axes"
import { PanelPage } from "./page"
import type { PanelSystem } from "./panel"
import { resolveDesignSystem } from "./resolve"
import { CHAPTERS } from "./state"
import { useStudio } from "./use-studio"
import {
  createFromPreset,
  duplicate,
  open,
  openDoc,
  remove,
  rename,
  reset,
  useWorkspace,
} from "./workspace"
import type { DesignSystemDoc } from "./workspace"

const routeApi = getRouteApi("/_app/studio")

export function undoToast(title: string, undo: () => void) {
  const id = toastManager.add({
    title,
    actionProps: {
      children: "Undo",
      onClick: () => {
        undo()
        toastManager.close(id)
      },
    },
  })
}

function resetLabel(doc: DesignSystemDoc): string {
  if (doc.origin.kind === "snapshot") return "Reset to shared version"
  if (doc.origin.kind === "copy") return "Reset to copy"
  return `Reset to ${getPreset(doc.origin.id)?.name ?? "preset"}`
}

function SystemActions({ doc }: { doc: DesignSystemDoc }) {
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
            if (key === "share") share(doc.id)
            if (key === "duplicate") duplicate(doc.id)
            if (key === "delete")
              undoToast(`Deleted ${doc.name}`, remove(doc.id))
          }}
        >
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
  const workspace = useWorkspace()
  const doc = openDoc(workspace)
  const { gallery } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  const sections = useMemo(
    () => [
      {
        id: "mine",
        title: "My design systems",
        items: [...workspace.systems].reverse().map((system) => ({
          id: system.id,
          name: system.name,
          swatch: system.state.brand,
          resolve: () => resolveDesignSystem(system.state),
        })),
      },
      {
        id: "presets",
        title: "Presets",
        items: PRESET_META.map((meta) => ({
          ...meta,
          resolve: () => resolvePreset(meta.id),
        })),
      },
    ],
    [workspace.systems],
  )

  function setGalleryOpen(isOpen: boolean) {
    navigate({
      search: (prev) => ({ ...prev, gallery: isOpen ? true : undefined }),
      replace: true,
    })
  }

  const label = resetLabel(doc)
  const system: PanelSystem = {
    name: doc.name,
    onRename: (name) => rename(doc.id, name),
    reset: sameState(doc.state, doc.initial)
      ? undefined
      : { label, onReset: () => undoToast(label, reset(doc.id)) },
    renderSwitcher: (trigger) => (
      <PresetPicker
        isOpen={gallery === true}
        onOpenChange={setGalleryOpen}
        sections={sections}
        selectedId={doc.id}
        onPick={(item) => {
          if (workspace.systems.some((s) => s.id === item.id)) open(item.id)
          else createFromPreset(item.id)
        }}
        onCreate={() => createFromPreset(ORIGIN.id)}
        withPreview
        renderItemActions={(item) => {
          const system = workspace.systems.find((s) => s.id === item.id)
          return system ? <SystemActions doc={system} /> : null
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
