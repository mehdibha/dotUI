"use client"

/* The studio panel mounted in /studio's slot: the panel page over the current
   design system, its chrome wired to the workspace. The picker lists the
   unsaved slot, the user's systems and the presets, and opens at
   ?gallery=. */

import { useMemo, useRef, useState } from "react"
import type { ReactNode, RefObject } from "react"
import { flushSync } from "react-dom"
import { getRouteApi } from "@tanstack/react-router"
import { Redo2Icon, Undo2Icon } from "lucide-react"

import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"
import { PresetPicker } from "@/modules/presets/preset-picker"

import { createFrom, discard, redo, remove, undo, useUndoRedo } from "./history"
import { NameDialog, saveRequest } from "./name-dialog"
import type { NameRequest } from "./name-dialog"
import { PanelPage } from "./page"
import type { PanelSystem } from "./panel"
import { pickerSections } from "./picker-sections"
import { RowMenu } from "./row-menus"
import {
  keySelection,
  select,
  UNSAVED_NAME,
  UNSAVED_NOTE,
  useCurrent,
} from "./selection"
import { CHAPTERS } from "./state"
import { useStudio } from "./use-studio"
import { copyName, rename, uniqueName, useWorkspace } from "./workspace"

const routeApi = getRouteApi("/_app/studio")

function HistoryButton({
  label,
  isDisabled,
  onPress,
  buttonRef,
  otherRef,
  children,
}: {
  label: string
  isDisabled: boolean
  onPress: () => void
  buttonRef: RefObject<HTMLButtonElement | null>
  /** Takes focus when this one disables under it. */
  otherRef: RefObject<HTMLButtonElement | null>
  children: ReactNode
}) {
  return (
    <Tooltip delay={0}>
      <Button
        ref={buttonRef}
        size="sm"
        variant="quiet"
        isIconOnly
        aria-label={label}
        isDisabled={isDisabled}
        onPress={() => {
          const button = buttonRef.current
          const focused = !!button && document.activeElement === button
          flushSync(onPress)
          // A disabled button drops focus to the page.
          if (focused && button.disabled) otherRef.current?.focus()
        }}
        className="text-fg-muted disabled:bg-transparent data-icon-only:size-6 pointer-coarse:data-icon-only:size-9"
      >
        {children}
      </Button>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

function UndoRedo() {
  const { canUndo, canRedo } = useUndoRedo()
  const undoRef = useRef<HTMLButtonElement>(null)
  const redoRef = useRef<HTMLButtonElement>(null)
  return (
    <>
      <HistoryButton
        label="Undo"
        isDisabled={!canUndo}
        onPress={undo}
        buttonRef={undoRef}
        otherRef={redoRef}
      >
        <Undo2Icon />
      </HistoryButton>
      <HistoryButton
        label="Redo"
        isDisabled={!canRedo}
        onPress={redo}
        buttonRef={redoRef}
        otherRef={undoRef}
      >
        <Redo2Icon />
      </HistoryButton>
    </>
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
    if (sel.kind === "unsaved") {
      const save = saveRequest(workspace)
      return (
        <RowMenu
          name={UNSAVED_NAME}
          actions={[
            { label: "Save…", run: () => save && askName(save) },
            {
              label: "Discard",
              danger: true,
              run: () =>
                afterClose(() => discard({ afterUndo: focusRow(key) })),
            },
          ]}
        />
      )
    }
    const doc =
      sel.kind === "system" && workspace.systems.find((s) => s.id === sel.id)
    if (!doc) return null
    return (
      <RowMenu
        name={doc.name}
        actions={[
          {
            label: "Rename…",
            run: () =>
              askName({
                title: "Rename design system",
                action: "Save",
                name: doc.name,
                subject: sel,
                onSubmit: (name) => rename(doc.id, name),
              }),
          },
          { label: "Duplicate…", run: () => askNew(key, copyName(doc.name)) },
          {
            label: "Delete",
            danger: true,
            run: () =>
              afterClose(() => remove(doc.id, { afterUndo: focusRow(key) })),
          },
        ]}
      />
    )
  }

  const system: PanelSystem = {
    name: current.name,
    note: current.unsaved && UNSAVED_NOTE,
    swatch: current.swatch,
    history: <UndoRedo />,
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
