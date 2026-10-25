"use client"

import { CheckIcon, PlusIcon, SearchIcon } from "@/registry/icons"
import { useStyles as useButtonStyles } from "@/registry/ui/button/styles"
import { useStyles as useCheckboxStyles } from "@/registry/ui/checkbox/styles"
import { Label } from "@/registry/ui/field"
import { useStyles as useInputStyles } from "@/registry/ui/input/styles"
import { useStyles as useLinkStyles } from "@/registry/ui/link/styles"
import { useStyles as useRadioStyles } from "@/registry/ui/radio-group/styles"
import { useStyles as useSwitchStyles } from "@/registry/ui/switch/styles"
import { useStyles as useTabsStyles } from "@/registry/ui/tabs/styles"

import { Board, stateProps, useBoardFocus } from "./board"
import { CANVAS, ComponentSet, SetGrid } from "./set-parts"

const CONTROL_KEYS = ["focusStyle", "focusWidth", "focusRingGap", "focusColor"]
const INPUT_KEYS = ["focusInputStyle", "focusFieldWidth", "focusColor"]

// Keyboard focus: inputs style `focus:`, everything else `focus-visible:`.
const FOCUSED = { ...stateProps("focus"), "data-focused": "true" }
const FOCUSED_ON = { ...FOCUSED, "data-selected": "true" }
const ON = { "data-selected": "true" }

type Row = { focused: boolean }

function Buttons({ focused }: Row) {
  const button = useButtonStyles()
  const state = focused ? FOCUSED : {}
  return (
    <>
      <span {...state} className={button({ variant: "primary" })}>
        Publish
      </span>
      <span {...state} className={button({ variant: "secondary" })}>
        Preview
      </span>
      <span {...state} className={button({ variant: "quiet" })}>
        Cancel
      </span>
      <span
        {...state}
        data-icon-only=""
        aria-label="Add"
        className={button({ variant: "secondary" })}
      >
        <PlusIcon />
      </span>
    </>
  )
}

function SelectionControls({ focused }: Row) {
  const checkbox = useCheckboxStyles()()
  const radio = useRadioStyles()()
  const toggle = useSwitchStyles()()
  const state = focused ? FOCUSED_ON : ON
  return (
    <>
      <span className={checkbox.root()}>
        <span {...state} className={checkbox.control()}>
          <span {...state} className={checkbox.indicator()}>
            <CheckIcon />
          </span>
        </span>
        <Label elementType="span">Remember me</Label>
      </span>
      <span data-radio="" className={radio.root()}>
        <span {...state} className={radio.control()}>
          <span {...state} className={radio.indicator()}>
            <span />
          </span>
        </span>
        <Label elementType="span">Monthly</Label>
      </span>
      <span {...state} className={toggle.control()}>
        <span {...state} className={toggle.indicator()}>
          <span {...state} className={toggle.thumb()} />
        </span>
      </span>
    </>
  )
}

const TABS = ["Overview", "Activity", "Settings"]

function Navigation({ focused }: Row) {
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
              {...(index === 0 && (focused ? FOCUSED_ON : ON))}
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
      <span {...(focused && FOCUSED)} className={link({})}>
        View invoice
      </span>
    </>
  )
}

function Inputs({ focused }: Row) {
  const { input, inputGroup, inputGroupAddon } = useInputStyles()()
  const field = {
    ...(focused && FOCUSED),
    "data-input": "",
    readOnly: true,
    tabIndex: -1,
  }
  return (
    <>
      <input
        {...field}
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
          {...field}
          data-input-control=""
          aria-label="Search"
          placeholder="Search"
          className={input()}
        />
      </div>
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

export default function FocusBoard() {
  const editing = useEditing()
  const rows = (Set: React.ComponentType<Row>) =>
    [false, true].map((focused) => (
      <Set key={String(focused)} focused={focused} />
    ))
  return (
    <Board id="focus" untitled className={CANVAS}>
      <SetGrid>
        <ComponentSet
          name="Buttons"
          selected={editing.controls}
          rows={rows(Buttons)}
        />
        <ComponentSet
          name="Selection"
          selected={editing.controls}
          rows={rows(SelectionControls)}
        />
        <ComponentSet
          name="Navigation"
          selected={editing.controls}
          rows={rows(Navigation)}
        />
        <ComponentSet
          name="Inputs"
          selected={editing.inputs}
          rows={rows(Inputs)}
        />
      </SetGrid>
    </Board>
  )
}
