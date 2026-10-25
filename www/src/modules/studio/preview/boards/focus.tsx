"use client"

import { CheckIcon, PlusIcon, SearchIcon } from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { useStyles as useButtonStyles } from "@/registry/ui/button/styles"
import { useStyles as useCheckboxStyles } from "@/registry/ui/checkbox/styles"
import { Label } from "@/registry/ui/field"
import { useStyles as useInputStyles } from "@/registry/ui/input/styles"
import { useStyles as useLinkStyles } from "@/registry/ui/link/styles"
import { useStyles as useRadioStyles } from "@/registry/ui/radio-group/styles"
import { useStyles as useSwitchStyles } from "@/registry/ui/switch/styles"
import { useStyles as useTabsStyles } from "@/registry/ui/tabs/styles"

import { Board, stateProps, useBoardFocus } from "./board"

const CONTROL_KEYS = ["focusStyle", "focusWidth", "focusColor"]
const INPUT_KEYS = ["focusInputStyle", "focusColor"]

// Figma's selection blue.
const SELECTION = "#0D99FF"

// Keyboard focus: inputs style `focus:`, everything else `focus-visible:`.
const FOCUSED = { ...stateProps("focus"), "data-focused": "true" }
const FOCUSED_ON = { ...FOCUSED, "data-selected": "true" }

function Buttons() {
  const button = useButtonStyles()
  return (
    <>
      <span {...FOCUSED} className={button({ variant: "primary" })}>
        Publish
      </span>
      <span {...FOCUSED} className={button({ variant: "secondary" })}>
        Preview
      </span>
      <span {...FOCUSED} className={button({ variant: "quiet" })}>
        Cancel
      </span>
      <span
        {...FOCUSED}
        data-icon-only=""
        aria-label="Add"
        className={button({ variant: "secondary" })}
      >
        <PlusIcon />
      </span>
    </>
  )
}

function SelectionControls() {
  const checkbox = useCheckboxStyles()()
  const radio = useRadioStyles()()
  const toggle = useSwitchStyles()()
  return (
    <>
      <span className={checkbox.root()}>
        <span {...FOCUSED_ON} className={checkbox.control()}>
          <span {...FOCUSED_ON} className={checkbox.indicator()}>
            <CheckIcon />
          </span>
        </span>
        <Label elementType="span">Remember me</Label>
      </span>
      <span data-radio="" className={radio.root()}>
        <span {...FOCUSED_ON} className={radio.control()}>
          <span {...FOCUSED_ON} className={radio.indicator()}>
            <span />
          </span>
        </span>
        <Label elementType="span">Monthly</Label>
      </span>
      <span {...FOCUSED_ON} className={toggle.control()}>
        <span {...FOCUSED_ON} className={toggle.indicator()}>
          <span {...FOCUSED_ON} className={toggle.thumb()} />
        </span>
      </span>
    </>
  )
}

const TABS = ["Overview", "Activity", "Settings"]

function Navigation() {
  const tabs = useTabsStyles()()
  const link = useLinkStyles()
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
              // Arrow keys move selection with focus, so the focused tab is the selected one.
              {...(index === 0 && FOCUSED_ON)}
              className={tabs.item({ orientation: "horizontal" })}
            >
              {index === 0 && (
                <span
                  {...horizontal}
                  className={tabs.indicator({ orientation: "horizontal" })}
                />
              )}
              <span className="relative z-10 inline-flex items-center gap-[inherit]">
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
      <span {...FOCUSED} className={link({})}>
        View invoice
      </span>
    </>
  )
}

const FIELD = { ...FOCUSED, "data-input": "", readOnly: true, tabIndex: -1 }

function Inputs() {
  const { input, inputGroup, inputGroupAddon, textArea } = useInputStyles()()
  return (
    <>
      <input
        {...FIELD}
        data-input-control=""
        aria-label="Full name"
        defaultValue="Ada Lovelace"
        className={input({ className: "w-44" })}
      />
      <div data-input-group="" className={inputGroup({ className: "w-44" })}>
        <span data-input-group-addon="" className={inputGroupAddon()}>
          <SearchIcon />
        </span>
        <input
          {...FIELD}
          data-input-control=""
          aria-label="Search"
          placeholder="Search"
          className={input()}
        />
      </div>
      <textarea
        {...FIELD}
        data-textarea=""
        aria-label="Notes"
        rows={2}
        defaultValue="Ship on Friday"
        className={textArea({ className: "w-44 resize-none" })}
      />
    </>
  )
}

/** A component set, framed the way design tools frame one; selected while the panel edits it. */
function Frame({
  name,
  selected,
  children,
}: {
  name: string
  selected: boolean
  children: React.ReactNode
}) {
  const color = selected ? SELECTION : undefined
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <span
        className={cn(
          "text-[11px] leading-none font-medium",
          !selected && "text-fg-muted",
        )}
        style={{ color }}
      >
        {name}
      </span>
      <div
        className={cn(
          "relative flex flex-wrap items-center gap-x-6 gap-y-4 rounded-md border bg-bg p-6 transition-colors duration-150 max-sm:p-4",
          selected ? "border-solid" : "border-dashed border-fg-muted/40",
        )}
        style={{ borderColor: color }}
      >
        {selected && <Handles />}
        {children}
      </div>
    </div>
  )
}

/** Figma's selection corners. */
function Handles() {
  const corner = "absolute size-1.5 border bg-white"
  const style = { borderColor: SELECTION }
  return (
    <>
      <span
        className={cn(corner, "-top-[3.5px] -left-[3.5px]")}
        style={style}
      />
      <span
        className={cn(corner, "-top-[3.5px] -right-[3.5px]")}
        style={style}
      />
      <span
        className={cn(corner, "-bottom-[3.5px] -left-[3.5px]")}
        style={style}
      />
      <span
        className={cn(corner, "-right-[3.5px] -bottom-[3.5px]")}
        style={style}
      />
    </>
  )
}

function useEditing() {
  const { axis, holds } = useBoardFocus()
  const keys = [axis, ...(holds ?? [])]
  return {
    controls: keys.some((key) => !!key && CONTROL_KEYS.includes(key)),
    inputs: keys.some((key) => !!key && INPUT_KEYS.includes(key)),
  }
}

// A dot-grid canvas filling the preview; the bottom clears the toolbar.
const CANVAS =
  "min-h-dvh max-w-none cursor-default items-center justify-center bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-size-[16px_16px] px-6 pt-10 pb-20 sm:px-10"

export default function FocusBoard() {
  const editing = useEditing()
  return (
    <Board id="focus" untitled className={CANVAS}>
      <div
        inert
        className="grid w-full max-w-4xl grid-cols-2 gap-8 max-md:grid-cols-1"
      >
        <Frame name="Buttons" selected={editing.controls}>
          <Buttons />
        </Frame>
        <Frame name="Selection" selected={editing.controls}>
          <SelectionControls />
        </Frame>
        <Frame name="Navigation" selected={editing.controls}>
          <Navigation />
        </Frame>
        <Frame name="Inputs" selected={editing.inputs}>
          <Inputs />
        </Frame>
      </div>
    </Board>
  )
}
