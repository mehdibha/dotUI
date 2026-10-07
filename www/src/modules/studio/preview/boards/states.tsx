import { useEffect, useRef, useSyncExternalStore } from "react"

import { CheckIcon, ChevronDownIcon } from "@/registry/icons"
import { Button } from "@/registry/ui/button"
import { useStyles as useButtonStyles } from "@/registry/ui/button/styles"
import { Checkbox } from "@/registry/ui/checkbox"
import { useStyles as useCheckboxStyles } from "@/registry/ui/checkbox/styles"
import { FieldError, Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import { useStyles as useInputStyles } from "@/registry/ui/input/styles"
import { useStyles as useLinkStyles } from "@/registry/ui/link/styles"
import { useStyles as useListStyles } from "@/registry/ui/list-box/styles"
import { MenuContent, MenuItem } from "@/registry/ui/menu"
import { useStyles as useMenuStyles } from "@/registry/ui/menu/styles"
import { useStyles as usePopoverStyles } from "@/registry/ui/popover/styles"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/ui/select"
import { Slider, SliderControl } from "@/registry/ui/slider"
import { Switch } from "@/registry/ui/switch"
import { useStyles as useSwitchStyles } from "@/registry/ui/switch/styles"
import { Tab, TabList, Tabs } from "@/registry/ui/tabs"
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
  StateRow,
  stateProps,
  useBoardFocus,
} from "./board"

const LABEL = "text-[11px] text-fg-muted"

const STACK = "flex-col flex-nowrap items-stretch justify-start gap-8"

// Keyboard focus: inputs style `focus:`, everything else `focus-visible:`.
const FOCUSED = { ...stateProps("focus"), "data-focused": "true" }

/** A frozen specimen with its name under it, like StateRow's labels. */
function Specimen({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      {children}
      <span className={LABEL}>{label}</span>
    </div>
  )
}

// The provider writes tokens onto <html>'s style.
const subscribeRoot = (onChange: () => void) => {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["style"],
  })
  return () => observer.disconnect()
}

/** A root token as the preview resolves it. */
const useRootToken = (name: string) =>
  useSyncExternalStore(
    subscribeRoot,
    () =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim(),
    () => "",
  )

const CURSORS: Record<string, () => React.ReactNode> = {
  pointer: HandCursor,
  default: ArrowCursor,
  "not-allowed": NotAllowedCursor,
}

/** The system cursor the token names, drawn where a pointer would rest. */
function Cursor({ token }: { token: string }) {
  const Glyph = CURSORS[useRootToken(token)] ?? ArrowCursor
  return (
    <span className="pointer-events-none absolute top-[55%] left-[85%] size-6 *:size-full">
      <Glyph />
    </span>
  )
}

/* ---------------------------------- Focus ---------------------------------- */

function FocusSpecimens() {
  const button = useButtonStyles()
  const link = useLinkStyles()
  const checkbox = useCheckboxStyles()()
  const toggle = useSwitchStyles()()
  const tabs = useTabsStyles()()
  const selected = { ...FOCUSED, "data-selected": "true" }
  const horizontal = { "data-orientation": "horizontal" }
  return (
    <div
      inert
      className="flex flex-wrap items-end justify-center gap-x-10 gap-y-8"
    >
      <Specimen label="Button">
        <button
          type="button"
          {...FOCUSED}
          className={button({ variant: "primary" })}
        >
          Publish
        </button>
      </Specimen>
      <Specimen label="Secondary">
        <button
          type="button"
          {...FOCUSED}
          className={button({ variant: "secondary" })}
        >
          Preview
        </button>
      </Specimen>
      <Specimen label="Link">
        <span {...FOCUSED} className={link({})}>
          View invoice
        </span>
      </Specimen>
      <Specimen label="Checkbox">
        <span className={checkbox.root()}>
          <span {...selected} className={checkbox.control()}>
            <span {...selected} className={checkbox.indicator()}>
              <CheckIcon />
            </span>
          </span>
          <Label elementType="span">Remember me</Label>
        </span>
      </Specimen>
      <Specimen label="Switch">
        <span {...selected} className={toggle.control()}>
          <span {...selected} className={toggle.indicator()}>
            <span {...selected} className={toggle.thumb()} />
          </span>
        </span>
      </Specimen>
      <Specimen label="Tabs">
        <div className={tabs.root({ orientation: "horizontal" })}>
          <div
            data-rac=""
            {...horizontal}
            className={tabs.list({ orientation: "horizontal" })}
          >
            {["Overview", "Activity", "Settings"].map((name, index) => (
              <div
                key={name}
                data-rac=""
                {...horizontal}
                {...(index === 0 && { "data-selected": "true" })}
                {...(index === 1 && FOCUSED)}
                className={tabs.item({ orientation: "horizontal" })}
              >
                {index === 0 && (
                  <span
                    data-rac=""
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
      </Specimen>
    </div>
  )
}

/* ------------------------------- Field focus ------------------------------- */

function FieldFocusSpecimens() {
  const button = useButtonStyles()
  const field = useInputStyles()()
  return (
    <>
      <StateRow states={["rest", "hover", "focus"]}>
        {(props, state) => (
          <input
            {...props}
            {...(state === "focus" && FOCUSED)}
            aria-label="Full name"
            className={field.input({ className: "w-44" })}
            defaultValue="Ada Lovelace"
            readOnly
          />
        )}
      </StateRow>
      <div
        inert
        className="flex flex-wrap items-start justify-center gap-x-6 gap-y-6"
      >
        <Specimen label="Select">
          <span
            {...FOCUSED}
            className={button({ className: [field.buttonTrigger(), "w-56"] })}
          >
            <span className="flex-1 truncate text-left font-normal">
              Annual billing
            </span>
            <ChevronDownIcon className="ml-auto" />
          </span>
        </Specimen>
        <Specimen label="Text area">
          <textarea
            {...FOCUSED}
            aria-label="Notes"
            rows={3}
            className={field.textArea({ className: "w-64" })}
            defaultValue="Ship the onboarding checklist before Friday's review."
            readOnly
          />
        </Specimen>
      </div>
    </>
  )
}

/* ------------------------------ Hover & press ------------------------------ */

function Surface({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  const { popover } = usePopoverStyles()()
  return (
    <Specimen label={label}>
      <div className={popover({ className: "w-52 shrink-0" })}>{children}</div>
    </Specimen>
  )
}

function HoverPressSpecimens() {
  const button = useButtonStyles()
  const menu = useMenuStyles()()
  const list = useListStyles()()
  return (
    <>
      <StateRow states={["rest", "hover", "pressed"]}>
        {(props, state) => (
          <div className="flex flex-col items-center gap-3">
            <span className="relative">
              <button
                type="button"
                {...props}
                className={button({ variant: "primary" })}
              >
                Publish
              </button>
              {state !== "rest" && <Cursor token="--cursor-interactive" />}
            </span>
            <button
              type="button"
              {...props}
              className={button({ variant: "secondary" })}
            >
              Preview
            </button>
            <button
              type="button"
              {...props}
              className={button({ variant: "quiet" })}
            >
              Cancel
            </button>
          </div>
        )}
      </StateRow>
      <div
        inert
        className="flex flex-wrap items-start justify-center gap-x-10 gap-y-8"
      >
        <Surface label="Menu row">
          <div role="menu" className={menu.root()}>
            {["Rename", "Duplicate", "Move to…"].map((name) => (
              <div
                key={name}
                role="menuitem"
                data-rac=""
                {...(name === "Duplicate" && { "data-focused": "true" })}
                className={menu.item({ className: "relative" })}
              >
                {name}
                {name === "Duplicate" && (
                  <Cursor token="--cursor-interactive" />
                )}
              </div>
            ))}
          </div>
        </Surface>
        <Surface label="List row">
          <div role="listbox" className={list.root()}>
            {["Inbox", "Drafts", "Archive"].map((name) => (
              <div
                key={name}
                role="option"
                data-rac=""
                {...(name === "Inbox" && { "data-selected": "true" })}
                {...(name === "Drafts" && { "data-hovered": "true" })}
                className={list.item({ className: "relative" })}
              >
                {name}
                {name === "Drafts" && <Cursor token="--cursor-interactive" />}
              </div>
            ))}
          </div>
        </Surface>
      </div>
    </>
  )
}

/* -------------------------------- Disabled -------------------------------- */

function Controls({ disabled }: { disabled?: boolean }) {
  return (
    <div className="flex min-w-0 flex-col gap-5">
      <span className={LABEL}>{disabled ? "Disabled" : "Enabled"}</span>
      <div className="flex flex-wrap gap-2">
        <span className="relative">
          <Button variant="primary" isDisabled={disabled}>
            Publish
          </Button>
          {disabled && <Cursor token="--cursor-disabled" />}
        </span>
        <Button isDisabled={disabled}>Preview</Button>
      </div>
      <TextField defaultValue="acme-inc" isDisabled={disabled}>
        <Label>Workspace</Label>
        <Input />
      </TextField>
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <Checkbox defaultSelected isDisabled={disabled}>
          Email digest
        </Checkbox>
        <Switch defaultSelected isDisabled={disabled}>
          Auto-renew
        </Switch>
      </div>
      <Slider defaultValue={60} isDisabled={disabled}>
        <Label>Volume</Label>
        <SliderControl />
      </Slider>
    </div>
  )
}

function DisabledMenu() {
  const { popover } = usePopoverStyles()()
  return (
    <div className="flex min-w-0 flex-col gap-5">
      <span className={LABEL}>Menu</span>
      <div className={popover({ className: "w-52" })}>
        <MenuContent aria-label="Workspace actions">
          <MenuItem>Invite people</MenuItem>
          <MenuItem isDisabled>Create team</MenuItem>
          <MenuItem>Settings</MenuItem>
        </MenuContent>
      </div>
    </div>
  )
}

/* -------------------------------- Selection -------------------------------- */

// One range from mid-sentence through the control row: control labels light
// up only when control text selects.
function SelectionSpecimen() {
  const { axis } = useBoardFocus()
  const startRef = useRef<HTMLSpanElement>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const start = startRef.current?.firstChild
    const end = endRef.current
    const selection = window.getSelection()
    if (!start || !end || !selection) return
    const range = document.createRange()
    range.setStart(start, 0)
    range.setEnd(end, end.childNodes.length)
    selection.removeAllRanges()
    selection.addRange(range)
  }, [axis])

  return (
    <div className="flex w-full max-w-lg flex-col gap-6 self-center">
      <p className="text-sm/relaxed text-fg">
        Invoices now sync every five minutes.{" "}
        <span ref={startRef}>
          A failed payment is retried twice before the customer gets an email.
        </span>
      </p>
      <div ref={endRef} className="flex flex-wrap items-center gap-x-6 gap-y-4">
        <Tabs defaultSelectedKey="overview">
          <TabList aria-label="Invoice">
            <Tab id="overview">Overview</Tab>
            <Tab id="activity">Activity</Tab>
          </TabList>
        </Tabs>
        <Button>Export</Button>
        <Checkbox defaultSelected>Notify me</Checkbox>
      </div>
    </div>
  )
}

/* ---------------------------------- Board ---------------------------------- */

export default function StatesBoard() {
  return (
    <Board id="states">
      <BoardSection
        member="focus"
        title="Focus"
        axes={["focusStyle", "focusColor", "focusStrength", "focusWidth"]}
      >
        <FocusSpecimens />
      </BoardSection>
      <BoardSection
        member="field-focus"
        title="Field focus"
        axes={[
          "focusInputStyle",
          "focusInputWeight",
          "focusInputColor",
          "inputStyle",
        ]}
        className={STACK}
      >
        <FieldFocusSpecimens />
      </BoardSection>
      <BoardSection
        member="hover-press"
        title="Hover & press"
        axes={["cursorControls"]}
        className={STACK}
      >
        <HoverPressSpecimens />
      </BoardSection>
      <BoardSection
        member="disabled"
        title="Disabled"
        axes={["disabledTreatment", "cursorDisabled"]}
        className="grid grid-cols-1 items-start gap-10 sm:grid-cols-2 lg:grid-cols-3"
      >
        <Controls />
        <Controls disabled />
        <DisabledMenu />
      </BoardSection>
      <BoardSection
        member="invalid"
        title="Invalid"
        axes={["invalidStyle"]}
        className="grid grid-cols-1 items-start gap-8 sm:grid-cols-2 lg:grid-cols-3"
      >
        <TextField defaultValue="ada@example" isInvalid>
          <Label>Email</Label>
          <Input />
          <FieldError>Enter a valid email address.</FieldError>
        </TextField>
        <Select isInvalid placeholder="Choose a plan">
          <Label>Plan</Label>
          <SelectTrigger />
          <SelectContent>
            <SelectItem>Starter</SelectItem>
            <SelectItem>Team</SelectItem>
            <SelectItem>Enterprise</SelectItem>
          </SelectContent>
          <FieldError>Pick a plan to continue.</FieldError>
        </Select>
        <Checkbox isInvalid className="self-center">
          I accept the terms
        </Checkbox>
      </BoardSection>
      <BoardSection
        member="selection"
        title="Selection"
        axes={["selectionHighlight", "selectionUiText"]}
        className={STACK}
      >
        <SelectionSpecimen />
      </BoardSection>
    </Board>
  )
}
