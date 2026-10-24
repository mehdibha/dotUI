"use client"

import { useComponentParams } from "@/lib/styles"
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronsUpDownIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { useStyles as useButtonStyles } from "@/registry/ui/button/styles"
import { Checkbox } from "@/registry/ui/checkbox"
import { useStyles as useCheckboxStyles } from "@/registry/ui/checkbox/styles"
import { Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import { useStyles as useInputStyles } from "@/registry/ui/input/styles"
import { Kbd } from "@/registry/ui/kbd"
import { Link } from "@/registry/ui/link"
import { useStyles as useLinkStyles } from "@/registry/ui/link/styles"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/ui/select"
import { Switch } from "@/registry/ui/switch"
import { useStyles as useSwitchStyles } from "@/registry/ui/switch/styles"
import { Tab, TabList, Tabs } from "@/registry/ui/tabs"
import { useStyles as useTabsStyles } from "@/registry/ui/tabs/styles"
import { TextField } from "@/registry/ui/text-field"
import { useTweak } from "@/dev/tweaker"

import { Board, CAPTION, stateProps, StateRow } from "./board"

const GROUP = "Focus board"
const LOOKS = ["plain", "canvas", "component set", "canvas + set"] as const
type Look = (typeof LOOKS)[number]

const GRID =
  "grid grid-flow-col grid-rows-2 items-center justify-center justify-items-start gap-x-10 gap-y-5 max-sm:grid-flow-row max-sm:grid-cols-2 max-sm:grid-rows-none max-sm:gap-x-6"

// Figma's component-set purple.
const SET = "#9747FF"

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
    <div inert className={GRID}>
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

/** The real components: Tab through them. */
function Playground({ hint }: { hint: boolean }) {
  return (
    <div className="group relative flex justify-center rounded-(--studio-radius-panel) border bg-bg p-10 max-sm:p-4">
      {hint && (
        <Kbd className="absolute top-3 right-3 transition-opacity group-has-[[data-focus-visible],[data-focused]]:opacity-0">
          Tab ⇥
        </Kbd>
      )}
      <div className="flex flex-col items-center gap-8">
        <div className={GRID}>
          <Button variant="primary">Publish</Button>
          <Button>Preview</Button>
          <Checkbox defaultSelected>Remember me</Checkbox>
          <Switch aria-label="Auto-renew" defaultSelected />
          <Tabs defaultSelectedKey="overview" className="max-sm:col-span-2">
            <TabList aria-label="Project">
              <Tab id="overview">Overview</Tab>
              <Tab id="activity">Activity</Tab>
              <Tab id="settings">Settings</Tab>
            </TabList>
          </Tabs>
          <Link>View invoice</Link>
        </div>
        <div className="flex items-center gap-2.5">
          <TextField aria-label="Full name" defaultValue="Ada Lovelace">
            <Input className="w-32" />
          </TextField>
          <Select aria-label="Plan" defaultSelectedKey="team">
            <SelectTrigger className="w-32" />
            <SelectContent>
              <SelectItem id="free">Free plan</SelectItem>
              <SelectItem id="pro">Pro plan</SelectItem>
              <SelectItem id="team">Team plan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

const DOTS =
  "bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-size-[14px_14px]"

/** A frozen specimen group, framed the way design tools frame a component set. */
function Frame({
  look,
  name,
  children,
}: {
  look: Look
  name: string
  children: React.ReactNode
}) {
  if (look === "plain") return children
  const set = look !== "canvas"
  return (
    <div className="flex flex-col gap-1.5">
      <span
        className={cn(CAPTION, "flex items-center gap-1")}
        style={set ? { color: SET } : undefined}
      >
        {set && <span aria-hidden>❖</span>}
        {name}
      </span>
      <div
        className={cn(
          "rounded-md border border-dashed bg-bg p-6 max-sm:p-4",
          !set && "border-fg-muted/40",
        )}
        style={set ? { borderColor: SET } : undefined}
      >
        {children}
      </div>
    </div>
  )
}

/** Every specimen frozen in its focused state. */
function Specs({ look }: { look: Look }) {
  const canvas = look === "canvas" || look === "canvas + set"
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-center gap-x-10 gap-y-8 rounded-(--studio-radius-panel) border p-10 max-sm:p-4",
        canvas ? DOTS : look === "component set" ? "bg-muted" : "bg-bg",
        look !== "plain" && "cursor-default",
      )}
    >
      <Frame look={look} name="Focused">
        <Focus />
      </Frame>
      <Frame look={look} name="Field">
        <FieldFocus />
      </Frame>
    </div>
  )
}

export default function FocusBoard() {
  const look = useTweak("Frozen look", {
    type: "select",
    options: [...LOOKS],
    default: "canvas",
    group: GROUP,
  })
  const hint = useTweak("Tab keycap", {
    type: "boolean",
    default: true,
    group: GROUP,
  })
  const frozenFirst = useTweak("Frozen first", {
    type: "boolean",
    default: false,
    group: GROUP,
  })
  return (
    <Board id="focus" untitled>
      <div
        className={cn("flex flex-col gap-6", frozenFirst && "flex-col-reverse")}
      >
        <Playground hint={hint} />
        <Specs look={look} />
      </div>
    </Board>
  )
}
