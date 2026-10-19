"use client"

import { useEffect, useRef, useState } from "react"

import { useComponentParams } from "@/lib/styles"
import {
  BellIcon,
  BoldIcon,
  ChevronDownIcon,
  LayoutGridIcon,
  ListIcon,
  MaximizeIcon,
  PinIcon,
  PlusIcon,
  StarIcon,
  TableIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { useStyles as useButtonStyles } from "@/registry/ui/button/styles"
import { useStyles as useCalendarStyles } from "@/registry/ui/calendar/styles"
import { Group } from "@/registry/ui/group"
import { Input } from "@/registry/ui/input"
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  PaginationList,
} from "@/registry/ui/pagination"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/registry/ui/select"
import { TextField } from "@/registry/ui/text-field"
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
          id: "primary",
          label: "Primary",
          render: (props) => (
            <span
              {...props}
              {...icon}
              className={styles({ variant: "primary", isIconOnly: true })}
            >
              <BellIcon />
            </span>
          ),
        },
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

const SIZES = ["xs", "sm", "md", "lg"] as const

function Sizes() {
  return (
    <div className="flex flex-wrap items-end justify-center gap-x-8 gap-y-6">
      {SIZES.map((size) => (
        <Specimen key={size} label={size}>
          <div className="flex items-center gap-1.5">
            <Button variant="primary" size={size}>
              Save
            </Button>
            <Button size={size}>Cancel</Button>
            <Button size={size} isIconOnly aria-label="Add">
              <PlusIcon />
            </Button>
          </div>
        </Specimen>
      ))}
    </div>
  )
}

/** The specimens each key reaches beyond buttons. */
const SHARED_LIT: Record<string, string[]> = {
  buttonStyle: ["field", "select", "segmented"],
  buttonSecondary: ["select"],
  buttonCase: ["segmented"],
  buttonRadius: ["calendar", "pagination"],
}

/** Components drawn with the button recipe, or following its keys. */
function Shared() {
  const { axis } = useBoardFocus()
  const { root, cell } = useCalendarStyles()()
  const lit = axis ? SHARED_LIT[axis] : undefined
  const dim = (id: string) =>
    cn(
      "transition-opacity duration-300",
      lit && !lit.includes(id) && "opacity-35",
    )
  return (
    <div className="flex flex-wrap items-end justify-center gap-x-10 gap-y-8">
      <Specimen label="Field" className={dim("field")}>
        <TextField aria-label="Name" defaultValue="Acme Inc." className="w-40">
          <Input />
        </TextField>
      </Specimen>
      <Specimen label="Select" className={dim("select")}>
        <Select aria-label="Region" defaultSelectedKey="eu" className="w-36">
          <SelectTrigger />
          <SelectContent>
            <SelectItem id="eu">Europe</SelectItem>
            <SelectItem id="us">Americas</SelectItem>
          </SelectContent>
        </Select>
      </Specimen>
      <Specimen label="Segmented control" className={dim("segmented")}>
        <SegmentedControl defaultSelectedKeys={["week"]} aria-label="Range">
          <SegmentedControlItem id="day">Day</SegmentedControlItem>
          <SegmentedControlItem id="week">Week</SegmentedControlItem>
          <SegmentedControlItem id="month">Month</SegmentedControlItem>
        </SegmentedControl>
      </Specimen>
      <Specimen label="Calendar days" className={dim("calendar")}>
        <div
          inert
          data-calendar=""
          className={root({ className: "flex-row gap-0" })}
        >
          {[11, 12, 13].map((day) => (
            <div key={day} className="size-(--cell-size)">
              <div
                {...stateProps(...(day === 12 ? (["selected"] as const) : []))}
                className={cell()}
              >
                {day}
              </div>
            </div>
          ))}
        </div>
      </Specimen>
      <Specimen label="Pagination" className={dim("pagination")}>
        <Pagination className="w-auto">
          <PaginationList>
            {[1, 2, 3].map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === 2}
                  aria-label={`Page ${page}`}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationList>
        </Pagination>
      </Specimen>
    </div>
  )
}

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
      <BoardSection title="Sizes">
        <Sizes />
      </BoardSection>
      <BoardSection title="Follows buttons">
        <Shared />
      </BoardSection>
    </Board>
  )
}
