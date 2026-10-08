"use client"

import { Fragment, useEffect, useLayoutEffect, useRef, useState } from "react"

import {
  ArrowRightIcon,
  BoldIcon,
  ChevronDownIcon,
  CopyIcon,
  DownloadIcon,
  ExternalLinkIcon,
  FlipHorizontalIcon,
  FlipVerticalIcon,
  ItalicIcon,
  LayoutGridIcon,
  ListIcon,
  MoreHorizontalIcon,
  PinIcon,
  PlusIcon,
  RotateCwIcon,
  SettingsIcon,
  StarIcon,
  TableIcon,
  TrashIcon,
  UnderlineIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"
import { useStyles as useButtonStyles } from "@/registry/ui/button/styles"
import { Group } from "@/registry/ui/group"
import {
  Pagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@/registry/ui/pagination"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import { ToggleButton } from "@/registry/ui/toggle-button"
import { ToggleButtonGroup } from "@/registry/ui/toggle-button-group"
import { useStyles as useToggleStyles } from "@/registry/ui/toggle-button/styles"

import { Board, BoardSection, stateProps, useBoardFocus } from "./board"
import type { StateName } from "./board"

type Frozen = ReturnType<typeof stateProps>

interface Column {
  id: string
  label: string
  states: StateName[]
}

const MATRIX_GAP = 12

/** True when the matrix's columns fit the container: specimens and labels
 *  keep their natural width in either layout, so measure them directly. */
function useMatrixFits(columns: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [fits, setFits] = useState(false)
  useLayoutEffect(() => {
    const container = ref.current
    if (!container) return
    const measure = () => {
      const widths = Array.from({ length: columns + 1 }, () => 0)
      for (const el of container.querySelectorAll<HTMLElement>(
        "[data-column]",
      )) {
        const i = Number(el.dataset.column)
        widths[i] = Math.max(widths[i] ?? 0, el.offsetWidth)
      }
      const needed = widths.reduce((a, b) => a + b, 0) + MATRIX_GAP * columns
      setFits(needed <= container.clientWidth)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(container)
    for (const el of container.querySelectorAll("[data-column]"))
      observer.observe(el)
    return () => observer.disconnect()
  }, [columns])
  return [ref, fits] as const
}

/** Rows of frozen specimens under shared state columns; when the columns
 *  don't fit, each row wraps with every specimen under its own label. */
function StateGrid({
  columns,
  rows,
  emphasis,
}: {
  columns: readonly Column[]
  rows: readonly {
    id: string
    label: string
    render: (props: Frozen, column: string) => React.ReactNode
  }[]
  /** A row or column id the panel is editing. */
  emphasis?: string
}) {
  const [ref, matrix] = useMatrixFits(columns.length)
  const label = (id: string) =>
    cn(
      "text-[11px] text-fg-muted transition-colors",
      emphasis === id && "font-medium text-fg",
    )
  return (
    <div ref={ref} className="w-full">
      <div
        inert
        className={cn(
          "flex flex-col gap-y-5",
          matrix && "grid items-center gap-x-3",
        )}
        style={{
          gridTemplateColumns: matrix
            ? `auto repeat(${columns.length}, minmax(max-content, 1fr))`
            : undefined,
        }}
      >
        {matrix && <span />}
        {columns.map((column, i) => (
          <span
            key={column.id}
            data-column={i + 1}
            className={cn(
              label(column.id),
              "justify-self-center",
              !matrix && "hidden",
            )}
          >
            {column.label}
          </span>
        ))}
        {rows.map((row) => (
          <Fragment key={row.id}>
            <span
              data-column={0}
              className={cn(
                label(row.id),
                matrix ? "justify-self-start" : "self-center",
              )}
            >
              {row.label}
            </span>
            <div
              className={
                matrix ? "contents" : "flex flex-wrap justify-center gap-4"
              }
            >
              {columns.map((column, i) => (
                <div
                  key={column.id}
                  className={cn(
                    "flex flex-col items-center gap-2",
                    !matrix && "min-w-22",
                  )}
                >
                  <div data-column={i + 1} className="flex">
                    {row.render(stateProps(...column.states), column.id)}
                  </div>
                  <span
                    data-column={i + 1}
                    className={cn(label(column.id), matrix && "hidden")}
                  >
                    {column.label}
                  </span>
                </div>
              ))}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}

/** A labelled line of live specimens. */
function Line({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={cn(
          "flex flex-wrap items-center justify-center gap-x-3 gap-y-4",
          className,
        )}
      >
        {children}
      </div>
      <span className="text-[11px] text-fg-muted">{label}</span>
    </div>
  )
}

/* --------------------------------- Button --------------------------------- */

const BUTTON_COLUMNS: Column[] = [
  { id: "rest", label: "Rest", states: [] },
  { id: "hover", label: "Hover", states: ["hover"] },
  { id: "pressed", label: "Pressed", states: ["pressed"] },
  { id: "focus", label: "Focus", states: ["focus"] },
  { id: "disabled", label: "Disabled", states: ["disabled"] },
  { id: "pending", label: "Pending", states: [] },
]

const VARIANTS = [
  { id: "primary", label: "Primary", text: "Save" },
  { id: "secondary", label: "Secondary", text: "Cancel" },
  { id: "quiet", label: "Quiet", text: "Edit" },
  { id: "link", label: "Link", text: "Docs" },
  { id: "danger", label: "Danger", text: "Delete" },
] as const

/** The row or column the focused key styles most. */
const BUTTON_EMPHASIS: Record<string, string> = {
  buttonColor: "primary",
  buttonSecondary: "secondary",
  buttonPress: "pressed",
}

/** Flips every `ms` while `active`; false otherwise. */
function useBlink(active: boolean, ms = 600) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (!active) return
    const timer = setInterval(() => setOn((on) => !on), ms)
    return () => {
      clearInterval(timer)
      setOn(false)
    }
  }, [active, ms])
  return on
}

function ButtonStates() {
  const styles = useButtonStyles()
  const { axis } = useBoardFocus()
  // A frozen press barely reads; while the panel edits it, press and release.
  const released = useBlink(axis === "buttonPress")
  return (
    <StateGrid
      columns={BUTTON_COLUMNS.map((column) =>
        column.id === "pressed" && released
          ? { ...column, states: ["hover"] }
          : column,
      )}
      emphasis={axis && BUTTON_EMPHASIS[axis]}
      rows={VARIANTS.map(({ id, label, text }) => ({
        id,
        label,
        render: (props, column) =>
          column === "pending" ? (
            <Button variant={id} isPending>
              {text}
            </Button>
          ) : (
            <span {...props} data-button="" className={styles({ variant: id })}>
              <span className="truncate">{text}</span>
            </span>
          ),
      }))}
    />
  )
}

const SIZES = ["xs", "sm", "md", "lg"] as const

function ButtonAnatomy() {
  return (
    <div className="flex w-full flex-col items-center gap-10">
      <div className="@container w-full">
        <div className="mx-auto grid w-fit grid-cols-2 items-center justify-items-center gap-x-6 gap-y-3 @xl:grid-cols-4">
          {SIZES.map((size) => (
            <div
              key={size}
              className="row-span-4 grid grid-rows-subgrid items-center justify-items-center"
            >
              <Button size={size} variant="primary">
                Publish
              </Button>
              <Button size={size}>Cancel</Button>
              <Button size={size} isIconOnly aria-label="Copy">
                <CopyIcon />
              </Button>
              <span className="pb-4 text-[11px] text-fg-muted @xl:pb-0">
                {size}
              </span>
            </div>
          ))}
        </div>
      </div>
      <Line label="Icon only">
        <Button variant="primary" isIconOnly aria-label="New">
          <PlusIcon />
        </Button>
        <Button isIconOnly aria-label="Settings">
          <SettingsIcon />
        </Button>
        <Button variant="quiet" isIconOnly aria-label="More">
          <MoreHorizontalIcon />
        </Button>
        <Button variant="danger" isIconOnly aria-label="Delete">
          <TrashIcon />
        </Button>
      </Line>
      <Line label="With icons">
        <Button variant="primary">
          <PlusIcon data-icon="inline-start" />
          New project
        </Button>
        <Button>
          <DownloadIcon data-icon="inline-start" />
          Export
        </Button>
        <Button variant="quiet">
          Continue
          <ArrowRightIcon data-icon="inline-end" />
        </Button>
        <Button variant="link">
          Changelog
          <ExternalLinkIcon data-icon="inline-end" />
        </Button>
      </Line>
    </div>
  )
}

/* --------------------------------- Motion --------------------------------- */

const LOOP: StateName[][] = [[], ["hover"], ["pressed"], ["hover"]]
const RANGES = ["day", "week", "month"] as const

/** True while `active`, and for `ms` after. */
function useLinger(active: boolean, ms = 6000) {
  const [lingering, setLingering] = useState(false)
  useEffect(() => {
    if (active) {
      setLingering(true)
      return
    }
    const timer = setTimeout(() => setLingering(false), ms)
    return () => clearTimeout(timer)
  }, [active, ms])
  return active || lingering
}

/** Steps hover, press and selection while the panel edits motion or the
 *  pointer rests on it. */
function MotionLoop() {
  const button = useButtonStyles()
  const toggle = useToggleStyles()
  const { axis } = useBoardFocus()
  const [hovered, setHovered] = useState(false)
  const playing = useLinger(
    hovered || axis === "buttonMotion" || axis === "motion",
  )
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!playing) return
    const timer = setInterval(() => setStep((step) => step + 1), 700)
    return () => {
      clearInterval(timer)
      setStep(0)
    }
  }, [playing])

  const frozen = stateProps(...(LOOP[step % LOOP.length] ?? []))
  const on = Math.floor(step / LOOP.length) % 2 === 1
  return (
    <div
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className="flex flex-wrap items-center justify-center gap-x-6 gap-y-5"
    >
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
      <SegmentedControl
        aria-label="Range"
        selectedKeys={[RANGES[Math.floor(step / 2) % RANGES.length] ?? "day"]}
        className="pointer-events-none"
      >
        <SegmentedControlItem id="day">Day</SegmentedControlItem>
        <SegmentedControlItem id="week">Week</SegmentedControlItem>
        <SegmentedControlItem id="month">Month</SegmentedControlItem>
      </SegmentedControl>
    </div>
  )
}

/* --------------------------------- Toggles -------------------------------- */

const TOGGLE_COLUMNS: Column[] = [
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
  const icon = { "data-button": "", "data-icon-only": "" }
  return (
    <StateGrid
      columns={TOGGLE_COLUMNS}
      rows={[
        {
          id: "secondary",
          label: "Secondary",
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

function FormatGroup({ variant }: { variant?: "quiet" }) {
  return (
    <ToggleButtonGroup
      aria-label="Text formatting"
      selectionMode="multiple"
      variant={variant}
      defaultSelectedKeys={["bold", "underline"]}
    >
      <ToggleButton id="bold" isIconOnly aria-label="Bold">
        <BoldIcon />
      </ToggleButton>
      <ToggleButton id="italic" isIconOnly aria-label="Italic">
        <ItalicIcon />
      </ToggleButton>
      <ToggleButton id="underline" isIconOnly aria-label="Underline">
        <UnderlineIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

/* ------------------------------- Pagination ------------------------------- */

const PAGES = 12

function pagesAround(current: number) {
  const shown = [1, current - 1, current, current + 1, PAGES].filter(
    (page, i, all) => page >= 1 && page <= PAGES && all.indexOf(page) === i,
  )
  return shown.flatMap((page, i) =>
    i > 0 && page - (shown[i - 1] ?? page) > 1
      ? (["gap", page] as const)
      : [page],
  )
}

function Pages() {
  const [page, setPage] = useState(5)
  return (
    <Pagination className="@container">
      <PaginationList>
        {[false, true].map((narrow) => (
          <PaginationItem
            key={String(narrow)}
            className={narrow ? "@md:hidden" : "@max-md:hidden"}
          >
            <PaginationPrevious
              isIconOnly={narrow}
              isDisabled={page === 1}
              onPress={() => setPage(page - 1)}
            />
          </PaginationItem>
        ))}
        {pagesAround(page).map((item, i) =>
          item === "gap" ? (
            <PaginationItem key={`gap-${i}`} className="@max-md:hidden">
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem
              key={item}
              // A narrow section keeps the current page and its neighbours.
              className={cn(Math.abs(item - page) > 1 && "@max-md:hidden")}
            >
              <PaginationLink
                isActive={item === page}
                aria-label={`Page ${item}`}
                onPress={() => setPage(item)}
              >
                {item}
              </PaginationLink>
            </PaginationItem>
          ),
        )}
        {[false, true].map((narrow) => (
          <PaginationItem
            key={String(narrow)}
            className={narrow ? "@md:hidden" : "@max-md:hidden"}
          >
            <PaginationNext
              isIconOnly={narrow}
              isDisabled={page === PAGES}
              onPress={() => setPage(page + 1)}
            />
          </PaginationItem>
        ))}
      </PaginationList>
    </Pagination>
  )
}

/* ---------------------------------- Board --------------------------------- */

export default function ButtonsBoard() {
  return (
    <Board id="buttons">
      <BoardSection
        member="button"
        title="Button"
        axes={["buttonStyle", "buttonSecondary", "buttonColor", "buttonPress"]}
      >
        <ButtonStates />
      </BoardSection>
      <BoardSection
        member="button"
        title="Sizes and icons"
        axes={["buttonRadius", "buttonCase", "labelWeight"]}
      >
        <ButtonAnatomy />
      </BoardSection>
      <BoardSection member="button" title="Motion" axes={["buttonMotion"]}>
        <MotionLoop />
      </BoardSection>
      <BoardSection
        member="toggle"
        title="Toggles"
        axes={["toggleSelected"]}
        className="flex-col gap-10"
      >
        <ToggleStates />
        <Line label="Toggle group" className="gap-x-6">
          <FormatGroup />
          <FormatGroup variant="quiet" />
        </Line>
      </BoardSection>
      <BoardSection
        member="group"
        title="Groups"
        axes={["groupSeparator"]}
        className="gap-x-10 gap-y-8"
      >
        <Line label="Attached">
          <Group aria-label="Clipboard">
            <Button>Cut</Button>
            <Button>Copy</Button>
            <Button>Paste</Button>
          </Group>
        </Line>
        <Line label="Split">
          <Group aria-label="Merge">
            <Button variant="primary">Merge</Button>
            <Button variant="primary" isIconOnly aria-label="Merge options">
              <ChevronDownIcon />
            </Button>
          </Group>
        </Line>
        <Line label="Icons">
          <Group aria-label="Transform">
            <Button isIconOnly aria-label="Flip horizontal">
              <FlipHorizontalIcon />
            </Button>
            <Button isIconOnly aria-label="Flip vertical">
              <FlipVerticalIcon />
            </Button>
            <Button isIconOnly aria-label="Rotate">
              <RotateCwIcon />
            </Button>
          </Group>
        </Line>
        <Line label="Toolbar">
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
        </Line>
      </BoardSection>
      <BoardSection
        member="segmented"
        title="Segmented"
        axes={["segmentedSelected", "segmentedTrack"]}
        className="gap-x-10 gap-y-8"
      >
        <SegmentedControl defaultSelectedKeys={["week"]} aria-label="Range">
          <SegmentedControlItem id="day">Day</SegmentedControlItem>
          <SegmentedControlItem id="week">Week</SegmentedControlItem>
          <SegmentedControlItem id="month">Month</SegmentedControlItem>
          <SegmentedControlItem id="year">Year</SegmentedControlItem>
        </SegmentedControl>
        <SegmentedControl defaultSelectedKeys={["grid"]} aria-label="Layout">
          <SegmentedControlItem id="grid">
            <LayoutGridIcon />
            Grid
          </SegmentedControlItem>
          <SegmentedControlItem id="list">
            <ListIcon />
            List
          </SegmentedControlItem>
          <SegmentedControlItem id="table">
            <TableIcon />
            Table
          </SegmentedControlItem>
        </SegmentedControl>
      </BoardSection>
      <BoardSection
        member="pagination"
        title="Pagination"
        axes={["paginationCurrent"]}
      >
        <Pages />
      </BoardSection>
    </Board>
  )
}
