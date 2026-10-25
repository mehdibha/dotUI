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
import { useTweak } from "@/dev/tweaker"

import { Board, stateProps, useBoardFocus } from "./board"

const GROUP = "Focus board"
const LAYOUTS = ["sets", "matrix", "spotlight"] as const
const CANVASES = ["dots", "grid", "plain"] as const
const FRAMES = ["figma", "neutral"] as const
type Layout = (typeof LAYOUTS)[number]
type Canvas = (typeof CANVASES)[number]
type FrameStyle = (typeof FRAMES)[number]

const CONTROL_KEYS = ["focusStyle", "focusWidth", "focusColor"]
const INPUT_KEYS = ["focusInputStyle", "focusColor"]

// Figma's component-set purple and selection blue.
const SET = "#9747FF"
const SELECTION = "#0D99FF"

// Keyboard focus: inputs style `focus:`, everything else `focus-visible:`.
const FOCUSED = { ...stateProps("focus"), "data-focused": "true" }

type State = "rest" | "focus"
const attrs = (state: State) => (state === "focus" ? FOCUSED : stateProps())

/* ------------------------------- specimens -------------------------------- */

function ButtonSpecimen({
  state,
  variant,
  children,
}: {
  state: State
  variant: "primary" | "secondary" | "quiet"
  children: React.ReactNode
}) {
  const button = useButtonStyles()
  return (
    <span {...attrs(state)} className={button({ variant })}>
      {children}
    </span>
  )
}

function IconButtonSpecimen({ state }: { state: State }) {
  const button = useButtonStyles()
  return (
    <span
      {...attrs(state)}
      data-icon-only=""
      aria-label="Add"
      className={button({ variant: "secondary" })}
    >
      <PlusIcon />
    </span>
  )
}

function CheckboxSpecimen({ state }: { state: State }) {
  const checkbox = useCheckboxStyles()()
  const props = { ...attrs(state), "data-selected": "true" }
  return (
    <span className={checkbox.root()}>
      <span {...props} className={checkbox.control()}>
        <span {...props} className={checkbox.indicator()}>
          <CheckIcon />
        </span>
      </span>
      <Label elementType="span">Remember me</Label>
    </span>
  )
}

function RadioSpecimen({ state }: { state: State }) {
  const radio = useRadioStyles()()
  const props = { ...attrs(state), "data-selected": "true" }
  return (
    <span data-radio="" className={radio.root()}>
      <span {...props} className={radio.control()}>
        <span {...props} className={radio.indicator()}>
          <span />
        </span>
      </span>
      <Label elementType="span">Monthly</Label>
    </span>
  )
}

function SwitchSpecimen({ state }: { state: State }) {
  const toggle = useSwitchStyles()()
  const props = { ...attrs(state), "data-selected": "true" }
  return (
    <span {...props} className={toggle.control()}>
      <span {...props} className={toggle.indicator()}>
        <span {...props} className={toggle.thumb()} />
      </span>
    </span>
  )
}

const TABS = ["Overview", "Activity", "Settings"]

function TabsSpecimen({ state }: { state: State }) {
  const tabs = useTabsStyles()()
  const horizontal = { "data-rac": "", "data-orientation": "horizontal" }
  return (
    <div className={tabs.root({ orientation: "horizontal" })}>
      <div {...horizontal} className={tabs.list({ orientation: "horizontal" })}>
        {TABS.map((name, index) => (
          <div
            key={name}
            {...horizontal}
            // Arrow keys move selection with focus, so the focused tab is the selected one.
            {...(index === 0 && { ...attrs(state), "data-selected": "true" })}
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

function LinkSpecimen({ state }: { state: State }) {
  const link = useLinkStyles()
  return (
    <span {...attrs(state)} className={link({})}>
      View invoice
    </span>
  )
}

function InputSpecimen({ state }: { state: State }) {
  const { input } = useInputStyles()()
  return (
    <input
      {...attrs(state)}
      data-input=""
      data-input-control=""
      aria-label="Full name"
      className={input({ className: "w-44" })}
      defaultValue="Ada Lovelace"
      readOnly
      tabIndex={-1}
    />
  )
}

function SearchSpecimen({ state }: { state: State }) {
  const { inputGroup, inputGroupAddon, input } = useInputStyles()()
  return (
    <div data-input-group="" className={inputGroup({ className: "w-44" })}>
      <span data-input-group-addon="" className={inputGroupAddon()}>
        <SearchIcon />
      </span>
      <input
        {...attrs(state)}
        data-input=""
        data-input-control=""
        aria-label="Search"
        className={input()}
        placeholder="Search"
        readOnly
        tabIndex={-1}
      />
    </div>
  )
}

function TextAreaSpecimen({ state }: { state: State }) {
  const { textArea } = useInputStyles()()
  return (
    <textarea
      {...attrs(state)}
      data-textarea=""
      aria-label="Notes"
      rows={2}
      className={textArea({ className: "w-44 resize-none" })}
      defaultValue="Ship on Friday"
      readOnly
      tabIndex={-1}
    />
  )
}

interface Specimen {
  name: string
  render: (state: State) => React.ReactNode
}

const BUTTONS: Specimen[] = [
  {
    name: "Primary",
    render: (s) => (
      <ButtonSpecimen state={s} variant="primary">
        Publish
      </ButtonSpecimen>
    ),
  },
  {
    name: "Secondary",
    render: (s) => (
      <ButtonSpecimen state={s} variant="secondary">
        Preview
      </ButtonSpecimen>
    ),
  },
  {
    name: "Quiet",
    render: (s) => (
      <ButtonSpecimen state={s} variant="quiet">
        Cancel
      </ButtonSpecimen>
    ),
  },
  { name: "Icon", render: (s) => <IconButtonSpecimen state={s} /> },
]

const SELECTION_CONTROLS: Specimen[] = [
  { name: "Checkbox", render: (s) => <CheckboxSpecimen state={s} /> },
  { name: "Radio", render: (s) => <RadioSpecimen state={s} /> },
  { name: "Switch", render: (s) => <SwitchSpecimen state={s} /> },
]

const NAVIGATION: Specimen[] = [
  { name: "Tabs", render: (s) => <TabsSpecimen state={s} /> },
  { name: "Link", render: (s) => <LinkSpecimen state={s} /> },
]

const INPUTS: Specimen[] = [
  { name: "Input", render: (s) => <InputSpecimen state={s} /> },
  { name: "With icon", render: (s) => <SearchSpecimen state={s} /> },
  { name: "Text area", render: (s) => <TextAreaSpecimen state={s} /> },
]

/* --------------------------------- chrome --------------------------------- */

interface Chrome {
  frame: FrameStyle
  names: boolean
}

const TAG = "text-[11px] leading-none font-medium"

/** A component set, framed the way design tools frame one; blue when the panel edits it. */
function Frame({
  chrome,
  name,
  selected,
  className,
  children,
}: {
  chrome: Chrome
  name: string
  selected?: boolean
  className?: string
  children: React.ReactNode
}) {
  const figma = chrome.frame === "figma"
  const color = selected ? SELECTION : figma ? SET : undefined
  return (
    <div className="flex min-w-0 flex-col gap-2">
      {chrome.names && (
        <span
          className={cn(
            TAG,
            "flex items-center gap-1",
            !color && "text-fg-muted",
          )}
          style={{ color }}
        >
          {figma && <span aria-hidden>❖</span>}
          {name}
        </span>
      )}
      <div
        className={cn(
          "relative rounded-md border bg-bg p-6 transition-colors duration-150 max-sm:p-4",
          selected ? "border-solid" : "border-dashed",
          !color && "border-fg-muted/40",
          className,
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

const CAPTION = "text-[11px] leading-none text-fg-muted"

/** Every specimen of a set in one state, wrapped. */
function Row({
  specimens,
  state = "focus",
  className,
}: {
  specimens: Specimen[]
  state?: State
  className?: string
}) {
  return (
    <div
      className={cn("flex flex-wrap items-center gap-x-6 gap-y-4", className)}
    >
      {specimens.map((specimen) => (
        <span key={specimen.name} className="contents">
          {specimen.render(state)}
        </span>
      ))}
    </div>
  )
}

/** A variant table: a row per specimen, a column per state. */
function Matrix({ specimens }: { specimens: Specimen[] }) {
  return (
    <div className="grid grid-cols-[auto_auto_auto] items-center gap-x-8 gap-y-4">
      <span />
      <span className={CAPTION}>Rest</span>
      <span className={CAPTION}>Focus</span>
      {specimens.map((specimen) => (
        <div key={specimen.name} className="contents">
          <span className={cn(CAPTION, "pr-2")}>{specimen.name}</span>
          <div className="justify-self-start">{specimen.render("rest")}</div>
          <div className="justify-self-start">{specimen.render("focus")}</div>
        </div>
      ))}
    </div>
  )
}

/* -------------------------------- layouts --------------------------------- */

function useEditing() {
  const { axis, holds } = useBoardFocus()
  const keys = [axis, ...(holds ?? [])]
  return {
    controls: keys.some((key) => !!key && CONTROL_KEYS.includes(key)),
    inputs: keys.some((key) => !!key && INPUT_KEYS.includes(key)),
  }
}

function Sets({ chrome }: { chrome: Chrome }) {
  const editing = useEditing()
  return (
    <div className="grid w-full max-w-4xl grid-cols-2 gap-8 max-md:grid-cols-1">
      <Frame chrome={chrome} name="Buttons" selected={editing.controls}>
        <Row specimens={BUTTONS} />
      </Frame>
      <Frame chrome={chrome} name="Selection" selected={editing.controls}>
        <Row specimens={SELECTION_CONTROLS} />
      </Frame>
      <Frame chrome={chrome} name="Navigation" selected={editing.controls}>
        <Row specimens={NAVIGATION} />
      </Frame>
      <Frame chrome={chrome} name="Inputs" selected={editing.inputs}>
        <Row specimens={INPUTS} />
      </Frame>
    </div>
  )
}

function Matrices({ chrome }: { chrome: Chrome }) {
  const editing = useEditing()
  return (
    <div className="flex flex-wrap items-start justify-center gap-8">
      <Frame chrome={chrome} name="Controls" selected={editing.controls}>
        <Matrix
          specimens={[...BUTTONS, ...SELECTION_CONTROLS, ...NAVIGATION]}
        />
      </Frame>
      <Frame chrome={chrome} name="Inputs" selected={editing.inputs}>
        <Matrix specimens={INPUTS} />
      </Frame>
    </div>
  )
}

/** One control and one input up close, the full sets underneath. */
function Spotlight({ chrome }: { chrome: Chrome }) {
  const editing = useEditing()
  return (
    <div className="flex w-full max-w-4xl flex-col items-center gap-8">
      <div className="grid w-full grid-cols-2 gap-8 max-md:grid-cols-1">
        <Frame
          chrome={chrome}
          name="Control"
          selected={editing.controls}
          className="flex h-56 items-center justify-center overflow-hidden"
        >
          <div style={{ zoom: 2.5 }}>{BUTTONS[0]?.render("focus")}</div>
        </Frame>
        <Frame
          chrome={chrome}
          name="Input"
          selected={editing.inputs}
          className="flex h-56 items-center justify-center overflow-hidden"
        >
          <div style={{ zoom: 2 }}>{INPUTS[0]?.render("focus")}</div>
        </Frame>
      </div>
      <Frame chrome={chrome} name="All controls" selected={editing.controls}>
        <Row
          specimens={[...BUTTONS, ...SELECTION_CONTROLS, ...NAVIGATION]}
          className="justify-center"
        />
      </Frame>
    </div>
  )
}

const CANVAS: Record<Canvas, string> = {
  dots: "bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-size-[16px_16px]",
  grid: "bg-[linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] bg-size-[24px_24px] [background-position:-1px_-1px]",
  plain: "bg-muted",
}

export default function FocusBoard() {
  const layout = useTweak("Layout", {
    type: "select",
    options: [...LAYOUTS],
    default: "sets",
    group: GROUP,
  }) as Layout
  const canvas = useTweak("Canvas", {
    type: "select",
    options: [...CANVASES],
    default: "dots",
    group: GROUP,
  }) as Canvas
  const frame = useTweak("Frame", {
    type: "select",
    options: [...FRAMES],
    default: "figma",
    group: GROUP,
  }) as FrameStyle
  const names = useTweak("Set names", {
    type: "boolean",
    default: true,
    group: GROUP,
  })
  const chrome = { frame, names }
  return (
    <Board
      id="focus"
      untitled
      // Full bleed: the canvas is the whole preview; the bottom clears the toolbar.
      className={cn(
        "min-h-dvh max-w-none cursor-default items-center justify-center px-6 pt-10 pb-20 sm:px-10",
        CANVAS[canvas],
      )}
    >
      <div inert className="flex w-full justify-center">
        {layout === "sets" && <Sets chrome={chrome} />}
        {layout === "matrix" && <Matrices chrome={chrome} />}
        {layout === "spotlight" && <Spotlight chrome={chrome} />}
      </div>
    </Board>
  )
}
