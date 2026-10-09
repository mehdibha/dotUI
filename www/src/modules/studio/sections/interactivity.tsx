"use client"

/* Interactivity — how the product answers the pointer and text selection: the
   cursor over each kind of control, whether UI text selects, the selection
   highlight. Links keep `pointer` everywhere, so they are not a cursor row. */

import { MousePointer2Icon, PointerIcon } from "lucide-react"

import { cn } from "@/registry/lib/utils"
import { DialogContent } from "@/registry/ui/dialog"
import {
  MenuContent,
  MenuItem,
  MenuItemLabel,
  MenuSection,
  MenuSectionHeader,
} from "@/registry/ui/menu"

import { CURSOR_DEFAULTS, CURSOR_OPTIONS } from "../axes/cursor"
import { HIGHLIGHT_OPTIONS } from "../axes/selection"
import { DialPopover, DialSegmented, DialToggle, DialTrigger } from "../dial"
import { PanelPopover } from "../rows"
import type { Studio, StudioState } from "../state"
import {
  ArrowCursor,
  HandCursor,
  NotAllowedCursor,
  OpenHandCursor,
  ProgressCursor,
  WaitCursor,
} from "./cursors"

const CURSOR_GLYPHS: Record<string, React.ReactNode> = {
  default: <ArrowCursor />,
  pointer: <HandCursor />,
  progress: <ProgressCursor />,
  wait: <WaitCursor />,
  grab: <OpenHandCursor />,
  "not-allowed": <NotAllowedCursor />,
}

const CURSOR_SECTIONS = [
  { key: "cursorControls", label: "Controls" },
  { key: "cursorPending", label: "Pending" },
  { key: "cursorDragging", label: "Dragging" },
  { key: "cursorDisabled", label: "Disabled" },
] as const

/* One section per state, each its own single pick. Item ids carry the
   section key: a collection's keys are unique across sections. A menu in a
   DialogTrigger closes it on pick by default. */
function CursorMenu({ studio }: { studio: Studio }) {
  const { state, set } = studio
  return (
    <MenuContent aria-label="Cursor" shouldCloseOnSelect={false}>
      {CURSOR_SECTIONS.map(({ key, label }) => (
        <MenuSection
          key={key}
          id={key}
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[`${key}:${state[key]}`]}
          onSelectionChange={(keys) => {
            if (keys === "all") return
            const next = keys.values().next().value
            if (next) set(key)(String(next).slice(key.length + 1))
          }}
        >
          <MenuSectionHeader>{label}</MenuSectionHeader>
          {CURSOR_OPTIONS[key].map(({ value }) => {
            const css = value === "inherit" ? state.cursorControls : value
            return (
              <MenuItem key={value} id={`${key}:${value}`} textValue={css}>
                {CURSOR_GLYPHS[css]}
                <MenuItemLabel>{css}</MenuItemLabel>
              </MenuItem>
            )
          })}
        </MenuSection>
      ))}
    </MenuContent>
  )
}

/* ----------------------------- Text selection ----------------------------- */

/* Painted words, not cursors: the option is the highlight itself. The blue
   depicts the OS default, which is literal like the cursor drawings. */
const HIGHLIGHT_CHIPS: Record<string, string> = {
  accent: "bg-text-selection text-fg-on-text-selection",
  browser: "bg-[#B3D7FF] text-[#1B1B1F]",
}

function HighlightChip({ value }: { value: string }) {
  return (
    <span className={cn("rounded-xs px-1 text-[11px]", HIGHLIGHT_CHIPS[value])}>
      Aa
    </span>
  )
}

const optionLabel = (
  options: { value: string; label: string }[],
  value: string,
) => options.find((option) => option.value === value)?.label ?? value

/* --------------------------------- Section --------------------------------- */

export function InteractivityPreview({ state }: { state: StudioState }) {
  const Icon =
    state.cursorControls === "pointer" ? PointerIcon : MousePointer2Icon
  return <Icon aria-hidden className="size-4" />
}

export function InteractivitySection({ studio }: { studio: Studio }) {
  const { state, set } = studio
  const others = CURSOR_SECTIONS.filter(
    ({ key }) =>
      key !== "cursorControls" && state[key] !== CURSOR_DEFAULTS[key],
  ).length
  return (
    <>
      <DialTrigger
        label="Cursor"
        value={
          <span className="truncate">
            {state.cursorControls}
            {others > 0 && ` · +${others}`}
          </span>
        }
      >
        <PanelPopover className="w-56 min-w-0">
          <DialogContent className="flex min-h-0 flex-col overflow-y-auto overscroll-contain p-0">
            <CursorMenu studio={studio} />
          </DialogContent>
        </PanelPopover>
      </DialTrigger>
      <DialTrigger
        label="Text selection"
        value={
          <>
            <span className="truncate">
              {optionLabel(HIGHLIGHT_OPTIONS, state.selectionHighlight)}
              {state.selectionUiText === "selectable" && " · Selectable"}
            </span>
            <HighlightChip value={state.selectionHighlight} />
          </>
        }
      >
        <DialPopover className="w-80">
          <DialSegmented
            label="Highlight"
            value={state.selectionHighlight}
            onChange={set("selectionHighlight")}
            options={HIGHLIGHT_OPTIONS.map((option) => ({
              value: option.value,
              label: (
                <>
                  <HighlightChip value={option.value} />
                  {option.label}
                </>
              ),
            }))}
          />
          <DialToggle
            label="Selectable UI text"
            value={state.selectionUiText === "selectable"}
            onChange={(on) =>
              set("selectionUiText")(on ? "selectable" : "none")
            }
          />
        </DialPopover>
      </DialTrigger>
    </>
  )
}
