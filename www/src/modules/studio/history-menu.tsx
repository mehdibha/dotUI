"use client"

/* The panel header's history cluster: undo, redo, and the History menu —
   published versions and checkpoints, newest first, then Reset. Views have
   no history of their own. */

import type { ReactNode } from "react"
import { HistoryIcon, Redo2Icon, Undo2Icon } from "lucide-react"

import { Button } from "@/registry/ui/button"
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSection,
  MenuSectionHeader,
} from "@/registry/ui/menu"
import { Popover } from "@/registry/ui/popover"
import { toastManager } from "@/registry/ui/toast"
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"
import { getPreset } from "@/modules/presets"

import { sameState } from "./axes"
import { checkpoints, redo, reset, restore, undo, useUndoRedo } from "./history"
import type { Current } from "./selection"
import { ago } from "./time"
import { fetchSnapshot } from "./workspace"
import type { DesignSystemDoc } from "./workspace"

/** A design system's name in a toast title: quoted, cut at 32 characters. */
export function quoted(name: string): string {
  const chars = [...name]
  return `"${chars.length > 32 ? `${chars.slice(0, 31).join("")}…` : name}"`
}

export function undoToast(
  title: string,
  undo: () => void,
  description?: string,
) {
  const id = toastManager.add({
    title,
    description,
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
  if (doc.origin.kind === "copy") return "Reset to copy point"
  return `Reset to ${getPreset(doc.origin.id)?.name ?? "preset"}`
}

// The relative time rounds; the clock pins it.
function clock(at: number, now: number): string {
  const date = new Date(at)
  return date.toDateString() === new Date(now).toDateString()
    ? date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    : date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

function Entry({ at, now }: { at: number; now: number }) {
  return (
    <>
      <span>{ago(at, now)}</span>
      <span className="ml-auto pl-6 text-fg-muted tabular-nums">
        {clock(at, now)}
      </span>
    </>
  )
}

function IconButton({
  label,
  children,
  ...props
}: {
  label: string
  children: ReactNode
  isDisabled?: boolean
  onPress?: () => void
}) {
  return (
    <Tooltip delay={0}>
      <Button
        size="sm"
        variant="quiet"
        isIconOnly
        aria-label={label}
        // Chrome, not content: a disabled step stays unfilled.
        className="text-fg-muted disabled:bg-transparent pointer-coarse:data-icon-only:size-9"
        {...props}
      >
        {children}
      </Button>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}

function HistoryItems({ doc }: { doc: DesignSystemDoc }) {
  const now = Date.now()
  const published = [...doc.published].reverse()
  const saved = checkpoints(doc.id).reverse()
  const label = resetLabel(doc)

  function onAction(key: string) {
    if (key === "reset")
      return undoToast(`Reset ${quoted(doc.name)}`, reset(doc.id))
    const [kind, value] = key.split(":")
    if (kind === "checkpoint") {
      const entry = saved[Number(value)]
      if (entry) restore(doc.id, entry.state)
      return
    }
    const entry = published[Number(value)]
    if (!entry) return
    fetchSnapshot(entry.id).then(
      (snapshot) => restore(doc.id, snapshot.state),
      (error: unknown) => {
        console.error(error)
        toastManager.add({ title: "Couldn't open that version", type: "error" })
      },
    )
  }

  return (
    <MenuContent
      aria-label="History"
      onAction={(key) => onAction(String(key))}
      className="min-w-52"
    >
      {published.length > 0 && (
        <MenuSection>
          <MenuSectionHeader>Published</MenuSectionHeader>
          {/* Restoring then republishing repeats an id, so key by index. */}
          {published.map((entry, index) => (
            <MenuItem
              key={index}
              id={`published:${index}`}
              textValue={ago(entry.at, now)}
            >
              <Entry at={entry.at} now={now} />
            </MenuItem>
          ))}
        </MenuSection>
      )}
      {saved.length > 0 && (
        <MenuSection>
          <MenuSectionHeader>Autosaved</MenuSectionHeader>
          {saved.map((entry, index) => (
            <MenuItem
              key={index}
              id={`checkpoint:${index}`}
              textValue={ago(entry.at, now)}
            >
              <Entry at={entry.at} now={now} />
            </MenuItem>
          ))}
        </MenuSection>
      )}
      <MenuSection>
        <MenuItem id="reset" isDisabled={sameState(doc.state, doc.initial)}>
          {label}
        </MenuItem>
      </MenuSection>
    </MenuContent>
  )
}

export function HistoryControls({ current }: { current: Current }) {
  const { canUndo, canRedo } = useUndoRedo(current.key)
  return (
    <>
      <IconButton label="Undo" isDisabled={!canUndo} onPress={undo}>
        <Undo2Icon />
      </IconButton>
      <IconButton label="Redo" isDisabled={!canRedo} onPress={redo}>
        <Redo2Icon />
      </IconButton>
      <Menu>
        <IconButton label="History" isDisabled={!current.doc}>
          <HistoryIcon />
        </IconButton>
        <Popover placement="bottom end">
          {current.doc && <HistoryItems doc={current.doc} />}
        </Popover>
      </Menu>
    </>
  )
}
