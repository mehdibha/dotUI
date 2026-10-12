"use client"

import { useEffect, useRef } from "react"

import { useComponentParams } from "@/lib/styles"
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
} from "@/registry/icons"
import { Button } from "@/registry/ui/button"
import { useStyles as useButtonStyles } from "@/registry/ui/button/styles"
import { Checkbox } from "@/registry/ui/checkbox"
import { useStyles as useCheckboxStyles } from "@/registry/ui/checkbox/styles"
import { FieldError, Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import { useStyles as useInputStyles } from "@/registry/ui/input/styles"
import { useStyles as useLinkStyles } from "@/registry/ui/link/styles"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/ui/select"
import { Switch } from "@/registry/ui/switch"
import { useStyles as useSwitchStyles } from "@/registry/ui/switch/styles"
import { useStyles as useTabsStyles } from "@/registry/ui/tabs/styles"
import { TextField } from "@/registry/ui/text-field"

import {
  ArrowCursor,
  HandCursor,
  NotAllowedCursor,
} from "../../sections/cursors"
import {
  Board,
  BoardSection,
  Specimen,
  stateProps,
  StateRow,
  useBoardFocus,
  useRootToken,
} from "./board"

// Keyboard focus: inputs style `focus:`, everything else `focus-visible:`.
const FOCUSED = { ...stateProps("focus"), "data-focused": "true" }

const CURSORS: Record<string, () => React.ReactNode> = {
  pointer: HandCursor,
  default: ArrowCursor,
  "not-allowed": NotAllowedCursor,
}

/** The system cursor the token names, resting on the control. */
function Cursor({ token }: { token: string }) {
  const Glyph = CURSORS[useRootToken(token)] ?? ArrowCursor
  return (
    <span className="pointer-events-none absolute top-1/2 left-[80%] size-6 *:size-full!">
      <Glyph />
    </span>
  )
}

/* ---------------------------------- Focus ---------------------------------- */

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

/* ------------------------------- Field focus ------------------------------- */

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

/* -------------------------------- Disabled --------------------------------- */

function Controls({ disabled }: { disabled?: boolean }) {
  return (
    <Specimen label={disabled ? "Disabled" : "Enabled"}>
      <div inert className="flex flex-col gap-2.5">
        <div className="flex gap-3">
          <Button variant="primary" isDisabled={disabled}>
            Publish
          </Button>
          <Button isDisabled={disabled}>Preview</Button>
        </div>
        <div className="flex items-center gap-4">
          <TextField
            aria-label="Workspace"
            defaultValue="acme-inc"
            isDisabled={disabled}
            className="w-24"
          >
            <Input />
          </TextField>
          <Checkbox
            aria-label="Email digest"
            defaultSelected
            isDisabled={disabled}
          />
          <Switch
            aria-label="Auto-renew"
            defaultSelected
            isDisabled={disabled}
          />
        </div>
      </div>
    </Specimen>
  )
}

/* --------------------------------- Cursor ---------------------------------- */

function Cursors() {
  const button = useButtonStyles()
  return (
    <div
      inert
      className="flex flex-wrap items-end justify-center gap-x-12 gap-y-6"
    >
      <Specimen label="Control">
        <span className="relative">
          <span
            {...stateProps("hover")}
            data-button=""
            className={button({ variant: "primary" })}
          >
            Publish
          </span>
          <Cursor token="--cursor-interactive" />
        </span>
      </Specimen>
      <Specimen label="Disabled">
        <span className="relative">
          <Button variant="primary" isDisabled>
            Publish
          </Button>
          <Cursor token="--cursor-disabled" />
        </span>
      </Specimen>
    </div>
  )
}

/* --------------------------------- Invalid --------------------------------- */

function Invalid() {
  return (
    <div className="grid w-full grid-cols-1 items-start gap-x-4 gap-y-5 sm:grid-cols-[1fr_1fr_auto]">
      <TextField defaultValue="ada@example" isInvalid>
        <Label>Email</Label>
        <Input />
        <FieldError>Enter a valid email.</FieldError>
      </TextField>
      <Select isInvalid placeholder="Choose a plan">
        <Label>Plan</Label>
        <SelectTrigger />
        <SelectContent>
          <SelectItem>Starter</SelectItem>
          <SelectItem>Team</SelectItem>
          <SelectItem>Enterprise</SelectItem>
        </SelectContent>
        <FieldError>Pick a plan.</FieldError>
      </Select>
      <Checkbox isInvalid className="sm:self-center">
        Accept terms
      </Checkbox>
    </div>
  )
}

/* -------------------------------- Selection -------------------------------- */

// A live selection from mid-sentence over the controls into the next line: their labels light up only when control text selects. A click that clears it puts it back.
function Selection() {
  const { axis } = useBoardFocus()
  const startRef = useRef<HTMLSpanElement>(null)
  const endRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const select = () => {
      const start = startRef.current?.firstChild
      const end = endRef.current
      const selection = window.getSelection()
      if (!start || !end || !selection) return
      const range = document.createRange()
      range.setStart(start, 0)
      range.setEnd(end, end.childNodes.length)
      selection.removeAllRanges()
      selection.addRange(range)
    }
    const restore = () =>
      setTimeout(() => {
        if (window.getSelection()?.isCollapsed) select()
      })
    select()
    document.addEventListener("pointerup", restore)
    return () => document.removeEventListener("pointerup", restore)
  }, [axis])

  return (
    <div className="flex flex-col gap-3 text-sm/relaxed text-fg">
      <p>
        Sync runs hourly. <span ref={startRef}>Failed runs retry.</span>
      </p>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <Button>Export</Button>
        <Checkbox defaultSelected>Notify me</Checkbox>
      </div>
      <p ref={endRef}>Receipts go to billing.</p>
    </div>
  )
}

export default function InteractionBoard() {
  return (
    <Board id="interaction">
      <div className="grid gap-x-8 gap-y-6 lg:grid-cols-[minmax(0,1fr)_22rem] [&>section>div]:flex-1">
        <BoardSection title="Focus">
          <Focus />
        </BoardSection>
        <BoardSection title="Field focus">
          <FieldFocus />
        </BoardSection>
        <BoardSection title="Disabled" className="gap-x-12 gap-y-6">
          <Controls />
          <Controls disabled />
        </BoardSection>
        <BoardSection title="Cursor">
          <Cursors />
        </BoardSection>
        <BoardSection title="Invalid">
          <Invalid />
        </BoardSection>
        <BoardSection title="Selection">
          <Selection />
        </BoardSection>
      </div>
    </Board>
  )
}
