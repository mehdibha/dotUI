"use client"

/* The studio panel mounted in /studio's slot: the panel page over the current
   design system, its chrome wired to the workspace. The picker lists the
   user's systems and the presets, and opens at ?gallery=. */

import { useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"
import { getRouteApi } from "@tanstack/react-router"
import { RotateCcwIcon, SaveIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { MenuContent, MenuItem } from "@/registry/ui/menu"
import { Separator } from "@/registry/ui/separator"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"
import { PresetPicker } from "@/modules/presets/preset-picker"

import { DeleteDialog } from "./delete-dialog"
import { NameDialog } from "./name-dialog"
import type { NameRequest } from "./name-dialog"
import { PanelPage } from "./page"
import type { PanelSystem } from "./panel"
import { pickerSections } from "./picker-sections"
import {
  createFrom,
  keySelection,
  remove,
  reset,
  select,
  UNSAVED_NOTE,
  useCurrent,
} from "./selection"
import { CHAPTERS } from "./state"
import { useStudio } from "./use-studio"
import {
  copyName,
  isUnreadable,
  rename,
  saveName,
  useWorkspace,
} from "./workspace"
import type { DesignSystemDoc } from "./workspace"

const routeApi = getRouteApi("/_app/studio")

// Touch-sized rows on phones.
const MENU_ROW = "pointer-coarse:min-h-11"

function HeaderButton({
  label,
  onPress,
  children,
}: {
  label: string
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
        onPress={onPress}
        className="text-fg-muted data-icon-only:size-6 pointer-coarse:data-icon-only:size-9"
      >
        {children}
      </Button>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

export function StudioPanel({ className }: { className?: string }) {
  const studio = useStudio()
  const current = useCurrent()
  const workspace = useWorkspace()
  const { gallery } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const [naming, setNaming] = useState<NameRequest>()
  const [deleting, setDeleting] = useState<DesignSystemDoc>()
  const triggerRef = useRef<HTMLButtonElement>(null)

  const sections = useMemo(() => pickerSections(workspace), [workspace])

  function setGalleryOpen(isOpen: boolean) {
    navigate({
      search: (prev) => ({ ...prev, gallery: isOpen ? true : undefined }),
      replace: true,
    })
  }

  /** Closes the picker for a dialog, which opens once focus is back on the
   *  picker's trigger, to return there. */
  function afterPicker(open: () => void) {
    setGalleryOpen(false)
    requestAnimationFrame(open)
  }

  const askName = (request: NameRequest) =>
    afterPicker(() => setNaming(request))

  function askNew(startFrom: string, name: string) {
    askName({
      title: "New design system",
      action: "Create",
      name,
      startFrom,
      onSubmit: createFrom,
    })
  }

  // Unreadable stored systems: nothing saves or is created.
  const canSave = !isUnreadable()
  // The unsaved slot, or a shared link as is; the user's systems save
  // themselves.
  const savable = current.unsaved
    ? current.view
    : current.view?.kind === "link" && current.view

  function save() {
    if (!savable) return
    const { sel } = current
    setNaming({
      title: "Save design system",
      action: "Save",
      name: saveName(savable),
      subject: sel,
      onSubmit: (name) => createFrom(name, sel),
    })
  }

  function renderItemMenu(key: string) {
    const sel = keySelection(key)
    const doc =
      sel.kind === "system" && workspace.systems.find((s) => s.id === sel.id)
    if (!doc) return null
    return (
      <MenuContent aria-label={`Actions for ${doc.name}`}>
        <MenuItem
          onAction={() =>
            askName({
              title: "Rename design system",
              action: "Save",
              name: doc.name,
              subject: sel,
              onSubmit: (name) => rename(doc.id, name),
            })
          }
          className={MENU_ROW}
        >
          Rename…
        </MenuItem>
        <MenuItem
          onAction={() => askNew(key, copyName(doc.name))}
          className={MENU_ROW}
        >
          Duplicate…
        </MenuItem>
        <Separator />
        <MenuItem
          variant="danger"
          onAction={() => afterPicker(() => setDeleting(doc))}
          className={MENU_ROW}
        >
          Delete…
        </MenuItem>
      </MenuContent>
    )
  }

  const system: PanelSystem = {
    name: current.name,
    note: current.unsaved && UNSAVED_NOTE,
    swatch: current.swatch,
    // Shown only when they apply. Both go once pressed: focus moves to the
    // trigger, where the name dialog also returns it.
    buttons: (
      <>
        {current.unsaved && (
          <HeaderButton
            label="Reset"
            onPress={() => {
              triggerRef.current?.focus()
              reset()
            }}
          >
            <RotateCcwIcon />
          </HeaderButton>
        )}
        {savable && canSave && (
          <HeaderButton
            label="Save"
            onPress={() => {
              triggerRef.current?.focus()
              save()
            }}
          >
            <SaveIcon />
          </HeaderButton>
        )}
      </>
    ),
    triggerRef,
    renderSwitcher: (trigger) => (
      <PresetPicker
        isOpen={gallery === true}
        onOpenChange={setGalleryOpen}
        sections={sections}
        selectedId={current.key}
        onPick={(item) => select(keySelection(item.id))}
        onCreate={canSave ? () => askNew("current", "") : undefined}
        withPreview
        renderItemMenu={(item) => renderItemMenu(item.id)}
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
      <NameDialog request={naming} onClose={() => setNaming(undefined)} />
      <DeleteDialog
        system={deleting}
        onDelete={remove}
        onClose={() => setDeleting(undefined)}
      />
    </div>
  )
}
