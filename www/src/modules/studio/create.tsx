"use client"

/* The studio panel mounted in /studio's slot: the panel page over the current
   design system, its chrome wired to the workspace. The picker lists the
   user's systems and the presets, and opens at ?gallery=. */

import { useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"
import { getRouteApi } from "@tanstack/react-router"
import { CheckIcon, RotateCcwIcon, SaveIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { MenuContent, MenuItem } from "@/registry/ui/menu"
import { Separator } from "@/registry/ui/separator"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"
import { PresetPicker } from "@/modules/presets/preset-picker"

import { NameDialog } from "./name-dialog"
import type { NameRequest } from "./name-dialog"
import { PanelPage } from "./page"
import type { PanelSystem } from "./panel"
import { pickerSections } from "./picker-sections"
import { useSaveShortcut } from "./preset/iframe-sync"
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
  uniqueName,
  useWorkspace,
} from "./workspace"

const routeApi = getRouteApi("/_app/studio")

// Touch-sized rows on phones.
const MENU_ROW = "pointer-coarse:min-h-11"

function HeaderButton({
  label,
  tooltip = label,
  isDisabled,
  onPress,
  children,
}: {
  label: string
  tooltip?: string
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
      <TooltipContent>{tooltip}</TooltipContent>
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
  const focusPicker = useRef<((key: string) => void) | null>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const sections = useMemo(() => pickerSections(workspace), [workspace])

  function setGalleryOpen(isOpen: boolean) {
    navigate({
      search: (prev) => ({ ...prev, gallery: isOpen ? true : undefined }),
      replace: true,
    })
  }

  /** Closes the picker for the name dialog, which opens once focus is back
   *  on the picker's trigger, to return there. */
  function askName(request: NameRequest) {
    setGalleryOpen(false)
    requestAnimationFrame(() => setNaming(request))
  }

  function askNew(startFrom: string, name: string) {
    askName({
      title: "New design system",
      action: "Create",
      name,
      startFrom,
      onSubmit: createFrom,
    })
  }

  // Unreadable stored systems: nothing saves, so nothing reads "Saved".
  const canSave = !isUnreadable()
  const saved = !!current.doc && canSave

  /** Saves the slot as a system, also on ⌘S; never over an open dialog or
   *  menu. The user's systems save themselves. */
  function save() {
    const { unsaved } = current
    if (
      !unsaved ||
      !canSave ||
      naming ||
      document.activeElement?.closest("[role=dialog],[role=menu]")
    )
      return
    setNaming({
      title: "Save design system",
      action: "Save",
      name: saveName(unsaved.from),
      subject: { kind: "unsaved" },
      onSubmit: (name) => createFrom(name, { kind: "unsaved" }),
    })
  }
  useSaveShortcut(save)

  /** Back from a toast's Undo to the restored row, so Esc and arrows work;
   *  to the picker's trigger once it closed. */
  const focusRow = (key: string) => () =>
    requestAnimationFrame(() =>
      focusPicker.current
        ? focusPicker.current(key)
        : triggerRef.current?.focus(),
    )

  function renderItemMenu(key: string, afterClose: (run: () => void) => void) {
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
          onAction={() => afterClose(() => remove(doc.id, focusRow(key)))}
          className={MENU_ROW}
        >
          Delete
        </MenuItem>
      </MenuContent>
    )
  }

  const system: PanelSystem = {
    name: current.name,
    note: current.unsaved && UNSAVED_NOTE,
    swatch: current.swatch,
    // Both disable once pressed: focus moves to the trigger, where the name
    // dialog also returns it.
    buttons: (
      <>
        <HeaderButton
          label="Reset"
          isDisabled={!current.unsaved}
          onPress={() => {
            triggerRef.current?.focus()
            reset()
          }}
        >
          <RotateCcwIcon />
        </HeaderButton>
        <HeaderButton
          label={saved ? "Saved" : "Save"}
          tooltip="Save ⌘S"
          isDisabled={!current.unsaved || !canSave}
          onPress={() => {
            triggerRef.current?.focus()
            save()
          }}
        >
          {saved ? <CheckIcon /> : <SaveIcon />}
        </HeaderButton>
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
        onCreate={() =>
          askNew("current", uniqueName("Untitled", workspace.systems))
        }
        focusRef={focusPicker}
        withPreview
        renderItemMenu={(item, afterClose) =>
          renderItemMenu(item.id, afterClose)
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
      <NameDialog request={naming} onClose={() => setNaming(undefined)} />
    </div>
  )
}
