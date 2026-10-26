"use client"

import { CheckIcon, SearchIcon } from "@/registry/icons"
import { useStyles as useButtonStyles } from "@/registry/ui/button/styles"
import { useStyles as useCheckboxStyles } from "@/registry/ui/checkbox/styles"
import { Label } from "@/registry/ui/field"
import { useStyles as useInputStyles } from "@/registry/ui/input/styles"
import { useStyles as useLinkStyles } from "@/registry/ui/link/styles"
import { useStyles as useTabsStyles } from "@/registry/ui/tabs/styles"

import { Board, useBoardFocus, useRootToken } from "./board"
import { CANVAS, ComponentSet, SetGrid } from "./set-parts"

const HIGHLIGHT_KEYS = ["selectionHighlight"]
const CONTROL_KEYS = ["selectionUiText"]

/* Painted as `::selection` paints it, so every set can hold a selection at
   once. */
const HIGHLIGHT = "bg-text-selection text-fg-on-text-selection **:text-inherit"

type Row = { selected: boolean }

/** `text`, highlighted on the selected row. */
function Mark({ on, children }: { on: boolean; children: React.ReactNode }) {
  return on ? <span className={HIGHLIGHT}>{children}</span> : children
}

/** A control's label: it highlights only when control text selects. */
function useControlMark(selected: boolean) {
  const selectable = useRootToken("--user-select-ui") === "auto"
  return selected && selectable
}

function Text({ selected }: Row) {
  const link = useLinkStyles()
  return (
    <p className="max-w-sm text-sm/relaxed text-fg">
      Sync now runs every hour, and{" "}
      <Mark on={selected}>
        failed runs retry on their own. Read the{" "}
        <span className={link({})}>changelog</span>
      </Mark>{" "}
      for details.
    </p>
  )
}

function Inputs({ selected }: Row) {
  const { input, inputGroup, inputGroupAddon } = useInputStyles()()
  return (
    <>
      <span
        data-input=""
        data-input-control=""
        className={input({ className: "flex w-44 items-center" })}
      >
        <span>
          Ada <Mark on={selected}>Lovelace</Mark>
        </span>
      </span>
      <div data-input-group="" className={inputGroup({ className: "w-44" })}>
        <span data-input-group-addon="" className={inputGroupAddon()}>
          <SearchIcon />
        </span>
        <span
          data-input=""
          data-input-control=""
          className={input({ className: "flex items-center" })}
        >
          <span>
            <Mark on={selected}>Invoices</Mark> 2026
          </span>
        </span>
      </div>
    </>
  )
}

function Buttons({ selected }: Row) {
  const button = useButtonStyles()
  const on = useControlMark(selected)
  return (
    <>
      <span className={button({ variant: "primary" })}>
        <Mark on={on}>Publish</Mark>
      </span>
      <span className={button({ variant: "secondary" })}>
        <Mark on={on}>Preview</Mark>
      </span>
      <span className={button({ variant: "quiet" })}>
        <Mark on={on}>Cancel</Mark>
      </span>
    </>
  )
}

const TABS = ["Overview", "Activity", "Settings"]
const ON = { "data-selected": "true" }

function Labels({ selected }: Row) {
  const tabs = useTabsStyles()()
  const checkbox = useCheckboxStyles()()
  const on = useControlMark(selected)
  const horizontal = { "data-rac": "", "data-orientation": "horizontal" }
  return (
    <>
      <div className={tabs.root({ orientation: "horizontal" })}>
        <div
          {...horizontal}
          className={tabs.list({ orientation: "horizontal" })}
        >
          {TABS.map((name, index) => (
            <div
              key={name}
              {...horizontal}
              {...(index === 0 && ON)}
              className={tabs.item({ orientation: "horizontal" })}
            >
              {index === 0 && (
                <span
                  {...horizontal}
                  className={tabs.indicator({ orientation: "horizontal" })}
                />
              )}
              <span className="relative z-10 inline-flex items-center gap-[inherit]">
                <Mark on={on}>{name}</Mark>
              </span>
            </div>
          ))}
        </div>
      </div>
      <span className={checkbox.root()}>
        <span {...ON} className={checkbox.control()}>
          <span {...ON} className={checkbox.indicator()}>
            <CheckIcon />
          </span>
        </span>
        <Label elementType="span">
          <Mark on={on}>Remember me</Mark>
        </Label>
      </span>
    </>
  )
}

function useEditing() {
  const { axis, holds } = useBoardFocus()
  const keys = [axis, ...(holds ?? [])]
  const editing = (list: string[]) =>
    keys.some((key) => !!key && list.includes(key))
  return { highlight: editing(HIGHLIGHT_KEYS), controls: editing(CONTROL_KEYS) }
}

export default function TextSelectionBoard() {
  const editing = useEditing()
  const rows = (Set: React.ComponentType<Row>) =>
    [false, true].map((selected) => (
      <Set key={String(selected)} selected={selected} />
    ))
  return (
    <Board id="text-selection" untitled className={CANVAS}>
      <SetGrid>
        <ComponentSet
          name="Text"
          selected={editing.highlight}
          rows={rows(Text)}
        />
        <ComponentSet
          name="Inputs"
          selected={editing.highlight}
          rows={rows(Inputs)}
        />
        <ComponentSet
          name="Buttons"
          selected={editing.controls}
          rows={rows(Buttons)}
        />
        <ComponentSet
          name="Labels"
          selected={editing.controls}
          rows={rows(Labels)}
        />
      </SetGrid>
    </Board>
  )
}
