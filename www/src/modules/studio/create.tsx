"use client"

/* The studio panel mounted in /studio's slot: the panel page over the current
   design system, its chrome wired to the workspace. The picker lists the
   shared link being viewed, the user's systems and the presets, and opens
   at ?gallery=. */

import { useMemo, useRef, useState } from "react"
import type { ReactNode, RefObject } from "react"
import { flushSync } from "react-dom"
import { getRouteApi } from "@tanstack/react-router"
import { Redo2Icon, Undo2Icon } from "lucide-react"

import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"
import { ORIGIN } from "@/modules/presets"
import { PresetPicker } from "@/modules/presets/preset-picker"

import { redo, remove, undo, useUndoRedo } from "./history"
import { NameDialog } from "./name-dialog"
import type { NameRequest } from "./name-dialog"
import { PanelPage } from "./page"
import type { PanelSystem } from "./panel"
import { pickerSections, rowSelection } from "./picker-sections"
import { SystemMenu } from "./row-menus"
import { keep, select, selectionKey, useCurrent } from "./selection"
import { CHAPTERS } from "./state"
import { useStudio } from "./use-studio"
import {
  copyName,
  create,
  duplicate,
  rename,
  uniqueName,
  useWorkspace,
} from "./workspace"
import type { DesignSystemDoc } from "./workspace"

const routeApi = getRouteApi("/_app/studio")

const open = (doc: DesignSystemDoc | undefined) =>
  doc && select({ kind: "system", id: doc.id })

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

function UndoRedo({ id }: { id: string | undefined }) {
  const { canUndo, canRedo } = useUndoRedo(id)
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

  const sections = useMemo(
    () => pickerSections(current, workspace),
    [current, workspace],
  )

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

  function onDelete(id: string) {
    remove(id, {
      // Back from the toast to the restored row, so Esc and arrows work;
      // to the picker's trigger once it closed.
      afterUndo: () =>
        requestAnimationFrame(() =>
          focusPicker.current
            ? focusPicker.current(selectionKey({ kind: "system", id }))
            : triggerRef.current?.focus(),
        ),
    })
  }

  function renderItemMenu(key: string, afterClose: (run: () => void) => void) {
    const sel = rowSelection(key, current)
    const doc: DesignSystemDoc | undefined =
      sel.kind === "system"
        ? workspace.systems.find((s) => s.id === sel.id)
        : undefined
    if (!doc) return null
    const others = workspace.systems.filter((s) => s.id !== doc.id)
    return (
      <SystemMenu
        doc={doc}
        onRename={() =>
          askName({
            title: "Rename design system",
            action: "Save",
            name: doc.name,
            taken: others.map((s) => s.name),
            onSubmit: (name) => {
              keep(doc.id)
              rename(doc.id, name)
            },
          })
        }
        onDuplicate={() =>
          askName({
            title: "Duplicate design system",
            action: "Create",
            name: copyName(doc.name),
            taken: workspace.systems.map((s) => s.name),
            onSubmit: (name) => {
              keep(doc.id)
              open(duplicate(doc.id, name))
            },
          })
        }
        onDelete={() => afterClose(() => onDelete(doc.id))}
      />
    )
  }

  const system: PanelSystem = {
    name: current.name,
    swatch: current.swatch,
    tag: current.tag,
    history: <UndoRedo id={current.doc?.id} />,
    triggerRef,
    renderSwitcher: (trigger) => (
      <PresetPicker
        isOpen={gallery === true}
        onOpenChange={setGalleryOpen}
        sections={sections}
        selectedId={current.key}
        onPick={(item) => select(rowSelection(item.id, current))}
        onCreate={() =>
          askName({
            title: "New design system",
            action: "Create",
            name: uniqueName("Untitled", workspace.systems),
            taken: workspace.systems.map((s) => s.name),
            onSubmit: (name) =>
              open(create({ name, from: ORIGIN.id, state: ORIGIN.state })),
          })
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
