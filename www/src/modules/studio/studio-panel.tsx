"use client"

/* The studio panel mounted in /studio's slot: the panel page over the current
   design system, its chrome wired to the workspace. The picker lists the
   user's systems and the presets. */

import { useMemo, useRef, useState } from "react"
import type { ReactNode } from "react"
import { ChevronsUpDownIcon, RotateCcwIcon, SaveIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { MenuContent, MenuItem } from "@/registry/ui/menu"
import { Separator } from "@/registry/ui/separator"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"
import { HeaderActions } from "@/components/layout/header-slot"
import { PresetPicker } from "@/modules/presets/preset-picker"

import { ALL_ROWS, CHAPTERS } from "./chapters"
import { DeleteDialog } from "./delete-dialog"
import { NameDialog } from "./name-dialog"
import type { NameRequest } from "./name-dialog"
import { PanelPage } from "./page"
import type { PanelSystem } from "./panel"
import { pickerSections } from "./picker-sections"
import { RowsContext } from "./row-host"
import { useDockStacked } from "./rows"
import {
  createFrom,
  keySelection,
  previewSelection,
  remove,
  reset,
  select,
  UNSAVED_NOTE,
  useCurrent,
} from "./selection"
import { useStudio } from "./use-studio"
import {
  copyName,
  isUnreadable,
  rename,
  saveName,
  useWorkspace,
} from "./workspace"
import type { DesignSystemDoc } from "./workspace"

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

/** Reset and Save on phones, floating over the preview's bottom edge while
 *  there's something to reset or save. */
function ActionBar({
  onReset,
  onSave,
}: {
  onReset?: () => void
  onSave?: () => void
}) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-full z-20 mb-3 flex justify-center">
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-fg/8 bg-card p-1 shadow-[0_8px_24px_-6px_rgb(0_0_0/0.3),0_2px_8px_-2px_rgb(0_0_0/0.18)]">
        {onReset && (
          <Button
            variant="quiet"
            onPress={onReset}
            className="h-10 gap-2 rounded-full px-4 text-[15px]"
          >
            <RotateCcwIcon className="size-4" />
            Reset
          </Button>
        )}
        {onSave && (
          <Button
            variant="primary"
            onPress={onSave}
            className="h-10 gap-2 rounded-full px-4 text-[15px]"
          >
            <SaveIcon className="size-4" />
            Save
          </Button>
        )}
      </div>
    </div>
  )
}

export function StudioPanel({ className }: { className?: string }) {
  const studio = useStudio()
  const current = useCurrent()
  const workspace = useWorkspace()
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [naming, setNaming] = useState<NameRequest>()
  const [deleting, setDeleting] = useState<DesignSystemDoc>()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const stacked = useDockStacked()

  const sections = useMemo(() => pickerSections(workspace), [workspace])

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
        isOpen={galleryOpen}
        onOpenChange={setGalleryOpen}
        sections={sections}
        selectedId={current.key}
        onPick={(item) => select(keySelection(item.id))}
        onCreate={canSave ? () => askNew("current", "") : undefined}
        onPreview={previewSelection}
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
      {stacked && (
        <>
          {/* The header holds the picker and Export, nothing else. */}
          <HeaderActions>
            <div className="order-first mr-auto flex min-w-0">
              {system.renderSwitcher(
                <Button
                  ref={triggerRef}
                  variant="quiet"
                  aria-label={`Design system: ${current.name}. Change design system`}
                  className="h-10 min-w-0 shrink justify-start gap-2 pr-2 pl-2.5 text-[15px] font-medium"
                >
                  <span
                    aria-hidden
                    className="size-2.5 shrink-0 rounded-full ring-1 ring-fg/10 ring-inset"
                    style={{ background: current.swatch }}
                  />
                  <span dir="auto" className="min-w-0 truncate">
                    {current.name}
                  </span>
                  <ChevronsUpDownIcon className="size-4 shrink-0 text-fg-muted" />
                </Button>,
              )}
            </div>
          </HeaderActions>
          {(current.unsaved || (savable && canSave)) && (
            <ActionBar
              onReset={
                current.unsaved
                  ? () => {
                      triggerRef.current?.focus()
                      reset()
                    }
                  : undefined
              }
              onSave={
                savable && canSave
                  ? () => {
                      triggerRef.current?.focus()
                      save()
                    }
                  : undefined
              }
            />
          )}
        </>
      )}
      <RowsContext.Provider value={ALL_ROWS}>
        <PanelPage chapters={CHAPTERS} studio={studio} system={system} />
      </RowsContext.Provider>
      <NameDialog request={naming} onClose={() => setNaming(undefined)} />
      <DeleteDialog
        system={deleting}
        onDelete={remove}
        onClose={() => setDeleting(undefined)}
      />
    </div>
  )
}
