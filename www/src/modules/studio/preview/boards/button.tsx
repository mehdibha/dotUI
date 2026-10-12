"use client"

import { useEffect, useRef, useState } from "react"

import { useComponentParams } from "@/lib/styles"
import {
  BoldIcon,
  ChevronDownIcon,
  LayoutGridIcon,
  ListIcon,
  MaximizeIcon,
  PinIcon,
  StarIcon,
  TableIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "@/registry/icons"
import { Button } from "@/registry/ui/button"
import { useStyles as useButtonStyles } from "@/registry/ui/button/styles"
import { Group } from "@/registry/ui/group"
import { ToggleButton } from "@/registry/ui/toggle-button"
import { ToggleButtonGroup } from "@/registry/ui/toggle-button-group"
import { useStyles as useToggleStyles } from "@/registry/ui/toggle-button/styles"

import {
  Board,
  BoardSection,
  Specimen,
  stateProps,
  useBoardFocus,
  useLoop,
  useReplay,
  useSteps,
} from "./board"
import type { StateName } from "./board"
import { StateGrid } from "./buttons-parts"
import type { GridColumn } from "./buttons-parts"

/* --------------------------------- States --------------------------------- */

const BUTTON_COLUMNS: GridColumn[] = [
  { id: "rest", label: "Rest", states: [] },
  { id: "hover", label: "Hover", states: ["hover"] },
  { id: "pressed", label: "Pressed", states: ["pressed"] },
  { id: "focus", label: "Focus", states: ["focus"] },
  { id: "disabled", label: "Disabled", states: ["disabled"] },
]

const VARIANTS = [
  { id: "primary", label: "Primary", text: "Save" },
  { id: "secondary", label: "Secondary", text: "Cancel" },
  { id: "quiet", label: "Quiet", text: "Edit" },
  { id: "link", label: "Link", text: "Docs" },
  { id: "danger", label: "Danger", text: "Delete" },
] as const

/** The row or column the edited key styles most. */
const BUTTON_EMPHASIS: Record<string, string> = {
  buttonColor: "primary",
  buttonSecondary: "secondary",
  buttonPress: "pressed",
}

/** True for `ms` after `value` changes. */
function useChanged(value: unknown, ms: number) {
  const [changed, setChanged] = useState(false)
  const first = useRef(value)
  useEffect(() => {
    if (Object.is(value, first.current)) return
    first.current = value
    setChanged(true)
    const timer = setTimeout(() => setChanged(false), ms)
    return () => clearTimeout(timer)
  }, [value, ms])
  return changed
}

function ButtonStates() {
  const styles = useButtonStyles()
  const { axis } = useBoardFocus()
  // A frozen press barely reads; after Press changes, press and release.
  const pressing = useChanged(useComponentParams("button").press, 3000)
  const released = useLoop(pressing, 600)
  return (
    <StateGrid
      columns={BUTTON_COLUMNS.map((column) =>
        column.id === "pressed" && released
          ? { ...column, states: ["hover"] }
          : column,
      )}
      emphasis={pressing ? "pressed" : axis && BUTTON_EMPHASIS[axis]}
      rows={VARIANTS.map(({ id, label, text }) => ({
        id,
        label,
        render: (props) => (
          <span {...props} data-button="" className={styles({ variant: id })}>
            <span className="truncate">{text}</span>
          </span>
        ),
      }))}
    />
  )
}

/* --------------------------------- Motion --------------------------------- */

const LOOP: StateName[][] = [[], ["hover"], ["pressed"], ["hover"]]

/** Live while idle; steps hover, press and selection while Motion is edited. */
function MotionLoop() {
  const button = useButtonStyles()
  const toggle = useToggleStyles()
  const motion = useReplay("buttonMotion")
  const step = useSteps(motion, 700)
  if (!motion.running)
    return (
      <div className="flex items-center gap-3">
        <Button variant="primary">Publish</Button>
        <Button>Cancel</Button>
        <ToggleButton isIconOnly aria-label="Star">
          <StarIcon />
        </ToggleButton>
      </div>
    )
  const frozen = stateProps(...(LOOP[step % LOOP.length] ?? []))
  const on = Math.floor(step / LOOP.length) % 2 === 1
  return (
    <div inert className="flex items-center gap-3">
      <span
        {...frozen}
        data-button=""
        className={button({ variant: "primary" })}
      >
        <span className="truncate">Publish</span>
      </span>
      <span {...frozen} data-button="" className={button()}>
        <span className="truncate">Cancel</span>
      </span>
      <span
        {...stateProps(...(on ? (["selected"] as const) : []))}
        data-button=""
        data-icon-only=""
        className={toggle({ isIconOnly: true })}
      >
        <StarIcon />
      </span>
    </div>
  )
}

/* --------------------------------- Toggle --------------------------------- */

const TOGGLE_COLUMNS: GridColumn[] = [
  { id: "off", label: "Off", states: [] },
  { id: "hover", label: "Hover", states: ["hover"] },
  { id: "on", label: "On", states: ["selected"] },
  { id: "on-hover", label: "On, hover", states: ["selected", "hover"] },
  {
    id: "on-disabled",
    label: "On, disabled",
    states: ["selected", "disabled"],
  },
]

function ToggleStates() {
  const styles = useToggleStyles()
  const { axis } = useBoardFocus()
  const icon = { "data-button": "", "data-icon-only": "" }
  return (
    <StateGrid
      columns={TOGGLE_COLUMNS}
      emphasis={axis === "toggleSelected" ? "on" : undefined}
      rows={[
        {
          id: "text",
          label: "Text",
          render: (props) => (
            <span {...props} data-button="" className={styles()}>
              <PinIcon data-icon="inline-start" className="rotate-45" />
              Pin
            </span>
          ),
        },
        {
          id: "icon",
          label: "Icon",
          render: (props) => (
            <span {...props} {...icon} className={styles({ isIconOnly: true })}>
              <BoldIcon />
            </span>
          ),
        },
        {
          id: "quiet",
          label: "Quiet",
          render: (props) => (
            <span
              {...props}
              {...icon}
              className={styles({ variant: "quiet", isIconOnly: true })}
            >
              <StarIcon />
            </span>
          ),
        },
      ]}
    />
  )
}

/* ---------------------------------- Group --------------------------------- */

function Groups() {
  return (
    <div className="grid grid-cols-[auto_auto] items-end justify-items-center gap-x-6 gap-y-8">
      <Specimen label="Attached">
        <Group aria-label="Clipboard">
          <Button>Cut</Button>
          <Button>Copy</Button>
          <Button>Paste</Button>
        </Group>
      </Specimen>
      <Specimen label="Split">
        <Group aria-label="Merge">
          <Button variant="primary">Merge</Button>
          <Button variant="primary" isIconOnly aria-label="Merge options">
            <ChevronDownIcon />
          </Button>
        </Group>
      </Specimen>
      <Specimen label="Icons">
        <Group aria-label="Zoom">
          <Button isIconOnly aria-label="Zoom out">
            <ZoomOutIcon />
          </Button>
          <Button isIconOnly aria-label="Zoom in">
            <ZoomInIcon />
          </Button>
          <Button isIconOnly aria-label="Fit">
            <MaximizeIcon />
          </Button>
        </Group>
      </Specimen>
      <Specimen label="Toolbar">
        <ToggleButtonGroup
          aria-label="View"
          selectionMode="single"
          disallowEmptySelection
          defaultSelectedKeys={["grid"]}
        >
          <ToggleButton id="grid" isIconOnly aria-label="Grid">
            <LayoutGridIcon />
          </ToggleButton>
          <ToggleButton id="list" isIconOnly aria-label="List">
            <ListIcon />
          </ToggleButton>
          <ToggleButton id="table" isIconOnly aria-label="Table">
            <TableIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Specimen>
    </div>
  )
}

/* ---------------------------------- Board --------------------------------- */

export default function ButtonBoard() {
  return (
    <Board id="button">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_23rem] [&>section>div]:flex-1">
        <BoardSection title="States" className="lg:p-6">
          <ButtonStates />
        </BoardSection>
        <BoardSection title="Group" className="lg:p-6">
          <Groups />
        </BoardSection>
        <BoardSection title="Toggle" className="lg:p-6">
          <ToggleStates />
        </BoardSection>
        <BoardSection title="Motion">
          <MotionLoop />
        </BoardSection>
      </div>
    </Board>
  )
}
