"use client"

import { useComponentParams } from "@/lib/styles"
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
} from "@/registry/icons"
import { useStyles as useButtonStyles } from "@/registry/ui/button/styles"
import { useStyles as useCheckboxStyles } from "@/registry/ui/checkbox/styles"
import { Label } from "@/registry/ui/field"
import { useStyles as useInputStyles } from "@/registry/ui/input/styles"
import { useStyles as useLinkStyles } from "@/registry/ui/link/styles"
import { useStyles as useSwitchStyles } from "@/registry/ui/switch/styles"
import { useStyles as useTabsStyles } from "@/registry/ui/tabs/styles"

import { Board, BoardSection, stateProps, StateRow } from "./board"

// Keyboard focus: inputs style `focus:`, everything else `focus-visible:`.
const FOCUSED = { ...stateProps("focus"), "data-focused": "true" }

const TABS = ["Overview", "Activity", "Settings"]

function FocusedTabs() {
  const tabs = useTabsStyles()()
  const horizontal = { "data-rac": "", "data-orientation": "horizontal" }
  return (
    <div
      className={tabs.root({
        orientation: "horizontal",
        className: "max-sm:col-span-2",
      })}
    >
      <div {...horizontal} className={tabs.list({ orientation: "horizontal" })}>
        {TABS.map((name, index) => (
          <div
            key={name}
            {...horizontal}
            // Arrow keys move selection with focus, so the focused tab is the selected one.
            {...(index === 0 && { ...FOCUSED, "data-selected": "true" })}
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
  )
}

// One column per kind (actions, choices, navigation), so the specimens share edges.
function Focus() {
  const button = useButtonStyles()
  const link = useLinkStyles()
  const checkbox = useCheckboxStyles()()
  const toggle = useSwitchStyles()()
  const selected = { ...FOCUSED, "data-selected": "true" }
  return (
    <div
      inert
      className="grid grid-flow-col grid-rows-2 items-center justify-center justify-items-start gap-x-10 gap-y-5 max-sm:grid-flow-row max-sm:grid-cols-2 max-sm:grid-rows-none max-sm:gap-x-6"
    >
      <button
        type="button"
        {...FOCUSED}
        className={button({ variant: "primary" })}
      >
        Publish
      </button>
      <button
        type="button"
        {...FOCUSED}
        className={button({ variant: "secondary" })}
      >
        Preview
      </button>
      <span className={checkbox.root()}>
        <span {...selected} className={checkbox.control()}>
          <span {...selected} className={checkbox.indicator()}>
            <CheckIcon />
          </span>
        </span>
        <Label elementType="span">Remember me</Label>
      </span>
      <span {...selected} className={toggle.control()}>
        <span {...selected} className={toggle.indicator()}>
          <span {...selected} className={toggle.thumb()} />
        </span>
      </span>
      <FocusedTabs />
      <span {...FOCUSED} className={link({})}>
        View invoice
      </span>
    </div>
  )
}

/** The select trigger the design system ships: the field shell, or a button that takes the focus ring. */
function FrozenTrigger(props: Record<string, string>) {
  const { trigger, caret } = useComponentParams("select")
  const input = useInputStyles()()
  const button = useButtonStyles()
  const Caret = caret === "double" ? ChevronsUpDownIcon : ChevronDownIcon
  const className =
    trigger === "field"
      ? input.trigger({ className: "w-32" })
      : button({ className: input.buttonTrigger({ className: "w-32" }) })
  return (
    <span
      {...props}
      {...(trigger === "field"
        ? { "data-select-trigger": "" }
        : { "data-button": "" })}
      className={className}
    >
      <span className="truncate">Team plan</span>
      <Caret className="ml-auto" />
    </span>
  )
}

function FieldFocus() {
  const field = useInputStyles()()
  return (
    <StateRow states={["rest", "focus"]}>
      {(props, state) => {
        const frozen = state === "focus" ? FOCUSED : props
        return (
          <div className="flex flex-col gap-2.5">
            <input
              {...frozen}
              aria-label="Full name"
              className={field.input({ className: "w-32" })}
              defaultValue="Ada Lovelace"
              readOnly
            />
            <FrozenTrigger {...frozen} />
          </div>
        )
      }}
    </StateRow>
  )
}

export default function FocusBoard() {
  return (
    <Board id="focus">
      <BoardSection title="Focus ring">
        <Focus />
      </BoardSection>
      <BoardSection title="Field focus">
        <FieldFocus />
      </BoardSection>
    </Board>
  )
}
