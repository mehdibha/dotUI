"use client"

/* The panel header's history cluster: undo, redo, and the History menu —
   checkpoints, newest first, then Reset. Views have
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
import { Tooltip, TooltipContent } from "@/registry/ui/tooltip"
import { getPreset } from "@/modules/presets"

import { sameState } from "./axes"
import { DisabledButton } from "./disabled-button"
import { checkpoints, redo, reset, restore, undo, useUndoRedo } from "./history"
import type { Current } from "./selection"
import { ago, clock } from "./time"
import { quoted, undoToast } from "./toasts"
import type { DesignSystemDoc } from "./workspace"

function resetLabel(doc: DesignSystemDoc): string {
  if (doc.origin.kind === "snapshot") return "Reset to shared version"
  if (doc.origin.kind === "copy") return "Reset to copy point"
  return `Reset to ${getPreset(doc.origin.id)?.name ?? "preset"}`
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
  tip = label,
  disabledLabel,
  children,
  isDisabled,
  onPress,
}: {
  label: string
  tip?: string
  /** The tooltip while disabled: why there's nothing to do. */
  disabledLabel?: string
  children: ReactNode
  isDisabled?: boolean
  onPress?: () => void
}) {
  // Chrome, not content: a disabled step stays unfilled.
  const className =
    "text-fg-muted disabled:bg-transparent data-icon-only:size-6 pointer-coarse:data-icon-only:size-9"
  return (
    <Tooltip delay={0}>
      {isDisabled ? (
        <DisabledButton
          variant="quiet"
          size="sm"
          isIconOnly
          aria-label={label}
          className={className}
        >
          {children}
        </DisabledButton>
      ) : (
        <Button
          size="sm"
          variant="quiet"
          isIconOnly
          aria-label={label}
          onPress={onPress}
          className={className}
        >
          {children}
        </Button>
      )}
      <TooltipContent>{isDisabled ? disabledLabel : tip}</TooltipContent>
    </Tooltip>
  )
}

function HistoryItems({ doc }: { doc: DesignSystemDoc }) {
  const now = Date.now()
  const saved = checkpoints(doc.id).reverse()
  const label = resetLabel(doc)

  function onAction(key: string) {
    if (key === "reset")
      return undoToast(`Reset ${quoted(doc.name)}`, reset(doc.id))
    const entry = saved[Number(key.split(":")[1])]
    if (entry) restore(doc.id, entry.state)
  }

  return (
    <MenuContent
      aria-label="History"
      onAction={(key) => onAction(String(key))}
      className="min-w-52"
    >
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
  const { canUndo, canRedo, redoLabel } = useUndoRedo(current.key)
  return (
    <>
      <IconButton
        label="Undo"
        disabledLabel="Nothing to undo"
        isDisabled={!canUndo}
        onPress={undo}
      >
        <Undo2Icon />
      </IconButton>
      <IconButton
        label="Redo"
        tip={redoLabel}
        disabledLabel="Nothing to redo"
        isDisabled={!canRedo}
        onPress={redo}
      >
        <Redo2Icon />
      </IconButton>
      {current.doc ? (
        <Menu>
          <IconButton label="History">
            <HistoryIcon />
          </IconButton>
          <Popover placement="bottom end">
            <HistoryItems doc={current.doc} />
          </Popover>
        </Menu>
      ) : (
        <IconButton
          label="History"
          disabledLabel={
            current.sel.kind === "shared"
              ? "Shared links have no history"
              : "Presets have no history"
          }
          isDisabled
        >
          <HistoryIcon />
        </IconButton>
      )}
    </>
  )
}
