"use client"

/* Motion: a spec sheet, one set per component in the panel's order, each
   moving on a loop above the duration and curve it ships. */

import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"

import {
  ChevronDownIcon,
  CopyIcon,
  FileTextIcon,
  HomeIcon,
  InboxIcon,
  PencilIcon,
  ShareIcon,
  TrashIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/registry/ui/accordion"
import { Button } from "@/registry/ui/button"
import { useStyles as useButtonStyles } from "@/registry/ui/button/styles"
import { useStyles as useCalendarStyles } from "@/registry/ui/calendar/styles"
import { BarChart } from "@/registry/ui/chart-bar"
import { Checkbox } from "@/registry/ui/checkbox"
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { useStyles as useDialogStyles } from "@/registry/ui/dialog/styles"
import { Label } from "@/registry/ui/field"
import { useStyles as useLinkStyles } from "@/registry/ui/link/styles"
import { MenuContent, MenuItem } from "@/registry/ui/menu"
import { useStyles as useModalStyles } from "@/registry/ui/modal/styles"
import { useStyles as usePopoverStyles } from "@/registry/ui/popover/styles"
import {
  ProgressBar,
  ProgressBarControl,
  ProgressBarOutput,
} from "@/registry/ui/progress-bar"
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/registry/ui/segmented-control"
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/registry/ui/sidebar"
import { Switch, SwitchControl } from "@/registry/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/registry/ui/table"
import { Tab, TabList, Tabs } from "@/registry/ui/tabs"
import { ToastPrimitive, ToastProvider } from "@/registry/ui/toast"
import { useStyles as useTooltipStyles } from "@/registry/ui/tooltip/styles"

import {
  Board,
  RAC_STATE,
  stateProps,
  useBoardFocus,
  usePresence,
  useReplay,
  useRootToken,
  useSteps,
} from "./board"
import { useChartMotion } from "./chart"
import { FrozenInput } from "./field"
import { Tip } from "./menus-parts"
import { EaseCurve, easeName } from "./motion-parts"
import { CANVAS, ComponentSet } from "./set-parts"
import { DRAGGING, FrozenSlider } from "./slider"

/** True until an observer says the element left the screen. */
function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(true)
  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === "undefined") return
    const observer = new IntersectionObserver(([entry]) =>
      setInView(entry?.isIntersecting ?? true),
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])
  return inView
}

/** A stage's loop: running while on screen, restarted by a replay. */
function useLoopStep(replay: number, ms: number) {
  const ref = useRef<HTMLDivElement>(null)
  const step = useSteps({ replay, running: useInView(ref) }, ms)
  return [ref, step] as const
}

/** A stage: its window, fixed layers resolve against it. */
const FRAME =
  "absolute inset-0 flex items-center justify-center overflow-hidden text-left contain-paint"

interface StageProps {
  replay: number
}

function ButtonStage({ replay }: StageProps) {
  const [ref, step] = useLoopStep(replay, 700)
  const button = useButtonStyles()
  return (
    <div ref={ref} className={cn(FRAME, "gap-3")}>
      {(["primary", "secondary"] as const).map((variant, index) => (
        <span
          key={variant}
          {...stateProps(...(step % 2 === index ? (["pressed"] as const) : []))}
          data-button=""
          className={button({ variant })}
        >
          {variant === "primary" ? "Publish" : "Cancel"}
        </span>
      ))}
    </div>
  )
}

const FAQ = [
  { id: "plan", question: "What's in Pro?", answer: "Unlimited projects." },
  { id: "refund", question: "Refunds?", answer: "Within 14 days." },
]

function AccordionStage({ replay }: StageProps) {
  const [ref, step] = useLoopStep(replay, 1400)
  return (
    <div ref={ref} className={cn(FRAME, "items-start px-6 pt-4")}>
      <Accordion
        expandedKeys={[FAQ[step % 2]?.id ?? "plan"]}
        className="w-full"
      >
        {FAQ.map(({ id, question, answer }) => (
          <AccordionItem key={id} id={id}>
            <AccordionTrigger>{question}</AccordionTrigger>
            <AccordionPanel>{answer}</AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

const WEEK = [12, 13, 14, 15, 16]

function CalendarStage({ replay }: StageProps) {
  const [ref, step] = useLoopStep(replay, 900)
  const { root, cell } = useCalendarStyles()()
  return (
    <div ref={ref} className={FRAME}>
      <div data-calendar="" className={root({ className: "flex-row gap-0" })}>
        {WEEK.map((day, index) => (
          <div key={day} className="size-(--cell-size)">
            <div
              {...stateProps(
                index === step % WEEK.length ? "selected" : "rest",
              )}
              className={cell()}
            >
              {day}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const SIGNUPS = [
  [
    { month: "Jan", signups: 40 },
    { month: "Feb", signups: 64 },
    { month: "Mar", signups: 52 },
    { month: "Apr", signups: 80 },
    { month: "May", signups: 72 },
  ],
  [
    { month: "Jan", signups: 58 },
    { month: "Feb", signups: 44 },
    { month: "Mar", signups: 76 },
    { month: "Apr", signups: 50 },
    { month: "May", signups: 88 },
  ],
]

function ChartStage({ replay }: StageProps) {
  const [ref, step] = useLoopStep(replay, 1600)
  return (
    <div ref={ref} className={cn(FRAME, "px-6 py-4")}>
      <div className="w-full">
        <BarChart
          data={SIGNUPS[step % 2] ?? []}
          x="month"
          y={["signups"]}
          height={128}
          ariaLabel="Signups"
        />
      </div>
    </div>
  )
}

function CheckboxStage({ replay }: StageProps) {
  const [ref, step] = useLoopStep(replay, 900)
  return (
    <div ref={ref} className={cn(FRAME, "flex-col items-start gap-3 px-10")}>
      <Checkbox isSelected={step % 2 === 1}>Email me updates</Checkbox>
      <Checkbox isSelected={step % 2 === 0}>Weekly digest</Checkbox>
    </div>
  )
}

const OVERLAY = { open: 2000, closed: 1200 }

function DialogStage({ replay }: StageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const phase = usePresence(ref, { replay, running: useInView(ref) }, OVERLAY)
  const { overlay, backdrop, viewport, modal } = useModalStyles()()
  const { content } = useDialogStyles()()
  return (
    <div ref={ref} className={FRAME}>
      {phase !== "closed" && (
        <div
          className={overlay({
            className: "[--page-height:100%] [--visual-viewport-height:100%]",
          })}
          {...RAC_STATE[phase]}
        >
          <div className={backdrop()} />
          <div className={viewport({ className: "px-4" })}>
            <div
              data-rac=""
              data-modal=""
              {...RAC_STATE[phase]}
              className={modal()}
            >
              <div className={content({ className: "gap-3 p-4" })}>
                <DialogHeader>
                  <DialogTitle>Remove Maya?</DialogTitle>
                  <DialogDescription>She loses access.</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button size="sm" variant="secondary">
                    Cancel
                  </Button>
                  <Button size="sm" variant="danger">
                    Remove
                  </Button>
                </DialogFooter>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const FIELD_LOOP = ["rest", "hover", "focus", "rest"] as const

function FieldStage({ replay }: StageProps) {
  const [ref, step] = useLoopStep(replay, 900)
  return (
    <div ref={ref} className={cn(FRAME, "px-8")}>
      <div className="w-full max-w-56">
        <FrozenInput state={FIELD_LOOP[step % FIELD_LOOP.length] ?? "rest"} />
      </div>
    </div>
  )
}

function LinkStage({ replay }: StageProps) {
  const [ref, step] = useLoopStep(replay, 900)
  const link = useLinkStyles()
  return (
    <div ref={ref} className={FRAME}>
      <span
        {...stateProps(...(step % 2 === 1 ? (["hover"] as const) : []))}
        className={link({ className: "text-sm" })}
      >
        View invoice
      </span>
    </div>
  )
}

function PopoverStage({ replay }: StageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const phase = usePresence(
    ref,
    { replay, running: useInView(ref) },
    { open: 1800, closed: 1000 },
  )
  const menu = usePopoverStyles()()
  return (
    <div ref={ref} className={cn(FRAME, "items-start pt-5")}>
      <div className="relative">
        <Button size="sm" variant="secondary">
          Options
          <ChevronDownIcon />
        </Button>
        {phase !== "closed" && (
          <div className="absolute top-full left-1/2 mt-2 -translate-x-1/2">
            <div
              data-rac=""
              data-placement="bottom"
              {...RAC_STATE[phase]}
              className={menu.popover({ className: "w-36" })}
              style={
                {
                  "--trigger-anchor-point": "50% 0",
                  "--trigger-width": "0px",
                } as React.CSSProperties
              }
            >
              <MenuContent aria-label="Options">
                <MenuItem>
                  <PencilIcon />
                  Rename
                </MenuItem>
                <MenuItem>
                  <ShareIcon />
                  Share
                </MenuItem>
                <MenuItem variant="danger">
                  <TrashIcon />
                  Delete
                </MenuItem>
              </MenuContent>
              <Tip className={menu.arrow()} placement="bottom" size={12} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const PROGRESS = [12, 38, 64, 87, 100]

function ProgressStage({ replay }: StageProps) {
  const [ref, step] = useLoopStep(replay, 900)
  return (
    <div ref={ref} className={cn(FRAME, "px-10")}>
      {/* A fresh bar each cycle, so 100 → 12 restarts instead of sliding back. */}
      <ProgressBar
        key={Math.floor(step / PROGRESS.length)}
        value={PROGRESS[step % PROGRESS.length]}
        className="w-full"
      >
        <div className="flex items-center justify-between gap-2">
          <Label>Uploading</Label>
          <ProgressBarOutput />
        </div>
        <ProgressBarControl />
      </ProgressBar>
    </div>
  )
}

const RANGES = ["Day", "Week", "Month"]

function SegmentedStage({ replay }: StageProps) {
  const [ref, step] = useLoopStep(replay, 900)
  return (
    <div ref={ref} className={FRAME}>
      <SegmentedControl
        aria-label="Range"
        selectedKeys={[RANGES[step % RANGES.length] ?? "Day"]}
      >
        {RANGES.map((range) => (
          <SegmentedControlItem key={range} id={range}>
            {range}
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
    </div>
  )
}

const PAGES = [
  { title: "Home", icon: HomeIcon },
  { title: "Inbox", icon: InboxIcon },
  { title: "Docs", icon: FileTextIcon },
]

function SidebarStage({ replay }: StageProps) {
  const [ref, step] = useLoopStep(replay, 1400)
  return (
    <div ref={ref} className={cn(FRAME, "items-stretch justify-start")}>
      <SidebarProvider isOpen={step % 2 === 0} className="min-h-0 w-full">
        <Sidebar collapsible="icon" className="h-full">
          <SidebarContent className="pt-2">
            <SidebarMenu className="px-2">
              {PAGES.map(({ title, icon: Icon }, index) => (
                <SidebarMenuItem key={title}>
                  <SidebarMenuButton isActive={index === 0}>
                    <Icon />
                    <span>{title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="min-w-0 gap-2 p-4">
          <span className="h-2 w-2/3 rounded-full bg-muted" />
          <span className="h-2 w-1/2 rounded-full bg-muted" />
          <span className="h-2 w-3/5 rounded-full bg-muted" />
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

const SLIDER_LOOP = [
  stateProps(),
  stateProps("hover"),
  DRAGGING,
  stateProps("hover"),
]

function SliderStage({ replay }: StageProps) {
  const [ref, step] = useLoopStep(replay, 700)
  return (
    <div ref={ref} className={cn(FRAME, "px-10")}>
      <FrozenSlider {...(SLIDER_LOOP[step % SLIDER_LOOP.length] ?? {})} />
    </div>
  )
}

function SwitchStage({ replay }: StageProps) {
  const [ref, step] = useLoopStep(replay, 900)
  return (
    <div ref={ref} className={FRAME}>
      <Switch isSelected={step % 2 === 1}>
        <SwitchControl />
        <Label>Auto-save</Label>
      </Switch>
    </div>
  )
}

const ISSUES = [
  { id: "412", title: "Stripe migration" },
  { id: "398", title: "Dark mode" },
  { id: "405", title: "Safari test" },
]

function TableStage({ replay }: StageProps) {
  const [ref, step] = useLoopStep(replay, 1000)
  return (
    <div ref={ref} className={cn(FRAME, "px-6")}>
      <Table
        aria-label="Issues"
        selectionMode="multiple"
        selectedKeys={[ISSUES[step % ISSUES.length]?.id ?? "412"]}
        className="w-full"
      >
        <TableHeader>
          <TableColumn isRowHeader>Title</TableColumn>
          <TableColumn className="text-right">Issue</TableColumn>
        </TableHeader>
        <TableBody>
          {ISSUES.map(({ id, title }) => (
            <TableRow key={id} id={id}>
              <TableCell>{title}</TableCell>
              <TableCell className="text-right text-fg-muted tabular-nums">
                #{id}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

const TABS = ["Overview", "Activity", "Settings"]

function TabsStage({ replay }: StageProps) {
  const [ref, step] = useLoopStep(replay, 1000)
  return (
    <div ref={ref} className={FRAME}>
      <Tabs selectedKey={TABS[step % TABS.length] ?? "Overview"}>
        <TabList aria-label="Project">
          {TABS.map((tab) => (
            <Tab key={tab} id={tab}>
              {tab}
            </Tab>
          ))}
        </TabList>
      </Tabs>
    </div>
  )
}

const TOASTS = [
  { title: "Invoice paid", type: "success" },
  { title: "Receipt sent", description: "Copied to billing." },
]

const TOAST_MS = 2400

function ToastStage({ replay }: StageProps) {
  const [frame, setFrame] = useState<HTMLDivElement | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const [manager] = useState(() => ToastPrimitive.createToastManager())

  useEffect(() => {
    if (!inView || !frame) return
    let index = 0
    const closers = new Set<ReturnType<typeof setTimeout>>()
    // Its own dismissal: Base UI pauses timeouts while the iframe is blurred.
    const add = () => {
      const id = manager.add({ ...TOASTS[index++ % TOASTS.length], timeout: 0 })
      const closer = setTimeout(() => {
        manager.close(id)
        closers.delete(closer)
      }, TOAST_MS)
      closers.add(closer)
    }
    add()
    const interval = setInterval(add, TOAST_MS + 600)
    return () => {
      clearInterval(interval)
      for (const closer of closers) clearTimeout(closer)
      manager.close()
    }
  }, [inView, frame, replay, manager])

  return (
    <div ref={ref} className={FRAME}>
      <div
        ref={setFrame}
        className="absolute inset-0 **:data-toast-viewport:w-[calc(100%-2*var(--toast-inset))]"
      >
        {frame && (
          <ToastProvider
            toastManager={manager}
            position="bottom-right"
            portalProps={{ container: frame }}
          />
        )}
      </div>
    </div>
  )
}

function TooltipStage({ replay }: StageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const phase = usePresence(
    ref,
    { replay, running: useInView(ref) },
    { open: 1800, closed: 1000 },
  )
  const tooltip = useTooltipStyles()()
  return (
    <div ref={ref} className={cn(FRAME, "pt-8")}>
      <div className="relative">
        <Button size="sm" variant="secondary" isIconOnly aria-label="Copy">
          <CopyIcon />
        </Button>
        {phase !== "closed" && (
          <div className="absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2">
            <div
              data-rac=""
              data-placement="top"
              {...RAC_STATE[phase]}
              className={tooltip.content({
                className: "relative whitespace-nowrap",
              })}
              style={
                { "--trigger-anchor-point": "50% 100%" } as React.CSSProperties
              }
            >
              Copy link
              <Tip className={tooltip.arrow()} placement="top" size={8} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/** A member's shipped timing as the preview resolves its vars: the curve,
 *  how long, and its name. */
function Spec({ member }: { member: string }) {
  const ms = parseFloat(useRootToken(`--studio-${member}-duration`)) || 0
  const ease =
    useRootToken(`--studio-${member.replace(/-enter$/, "")}-ease`) || "linear"
  return (
    <SpecLine
      curve={
        <EaseCurve
          timing={{ ms, ease }}
          span={Math.max(ms, 450)}
          className="h-5 w-10"
        />
      }
      duration={`${ms}ms`}
      easing={easeName({ ms, ease })}
    />
  )
}

const CHART_EASING: Record<string, string> = {
  spring: "Spring",
  ease: "Ease out",
  none: "Instant",
}

/** Charts time themselves: their own transition, no shared vars. */
function ChartSpec() {
  const motion = useChartMotion()
  return <SpecLine duration="—" easing={CHART_EASING[motion] ?? motion} />
}

function SpecLine({
  curve,
  duration,
  easing,
}: {
  curve?: ReactNode
  duration: string
  easing: string
}) {
  return (
    <div className="flex w-full items-center gap-3 border-t border-dashed border-fg-muted/30 pt-3 text-[11px] leading-none text-fg-muted">
      {curve}
      <span>
        Duration{" "}
        <span className="font-mono text-fg tabular-nums">{duration}</span>
      </span>
      <span>
        Easing <span className="text-fg">{easing}</span>
      </span>
    </div>
  )
}

/* Each component, in the panel's order: what it moves, the key that times
   it, and the vars it ships. */
const SETS: {
  name: string
  Stage: (props: StageProps) => ReactNode
  keys: string[]
  member?: string
}[] = [
  {
    name: "Accordion",
    Stage: AccordionStage,
    keys: ["accordionMotion"],
    member: "accordion-enter",
  },
  {
    name: "Button",
    Stage: ButtonStage,
    keys: ["buttonMotion"],
    member: "button-state",
  },
  {
    name: "Calendar",
    Stage: CalendarStage,
    keys: ["calendarMotion"],
    member: "calendar-state",
  },
  { name: "Chart", Stage: ChartStage, keys: ["chartMotion"] },
  {
    name: "Checkbox",
    Stage: CheckboxStage,
    keys: ["checkboxMotion"],
    member: "checkbox-state",
  },
  {
    name: "Dialog",
    Stage: DialogStage,
    keys: ["dialogMotion", "dialogEntrance"],
    member: "modal-enter",
  },
  {
    name: "Field",
    Stage: FieldStage,
    keys: ["fieldMotion"],
    member: "input-state",
  },
  {
    name: "Link",
    Stage: LinkStage,
    keys: ["linkMotion"],
    member: "link-state",
  },
  {
    name: "Popover",
    Stage: PopoverStage,
    keys: ["popoverMotion", "popoverEntrance"],
    member: "popover-enter",
  },
  {
    name: "Progress",
    Stage: ProgressStage,
    keys: ["progressMotion"],
    member: "progress-state",
  },
  {
    name: "Segmented control",
    Stage: SegmentedStage,
    keys: ["segmentedMotion"],
    member: "segmented-control-state",
  },
  {
    name: "Sidebar",
    Stage: SidebarStage,
    keys: ["sidebarMotion"],
    member: "sidebar-state",
  },
  {
    name: "Slider",
    Stage: SliderStage,
    keys: ["sliderMotion"],
    member: "slider-state",
  },
  {
    name: "Switch",
    Stage: SwitchStage,
    keys: ["switchMotion"],
    member: "switch-state",
  },
  {
    name: "Table",
    Stage: TableStage,
    keys: ["tableMotion"],
    member: "table-state",
  },
  {
    name: "Tabs",
    Stage: TabsStage,
    keys: ["tabsMotion"],
    member: "tabs-state",
  },
  {
    name: "Toast",
    Stage: ToastStage,
    keys: ["toastMotion"],
    member: "toast-enter",
  },
  {
    name: "Tooltip",
    Stage: TooltipStage,
    keys: ["tooltipMotion", "tooltipEntrance"],
    member: "tooltip-enter",
  },
]

export default function MotionBoard() {
  const { axis, holds } = useBoardFocus()
  const { replay } = useReplay()
  const edited = [axis, ...(holds ?? [])]
  // The tempo and Duration time every set; a component's own, its set.
  const all = edited.some((key) => key === "motion" || key === "motionDuration")
  const grid = useRef<HTMLDivElement>(null)

  // Bring the set being edited into view.
  useEffect(() => {
    const index = SETS.findIndex(({ keys }) => !!axis && keys.includes(axis))
    grid.current?.children[index]?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    })
  }, [axis])

  return (
    <Board id="motion" untitled className={cn(CANVAS, "max-w-none")}>
      <div
        ref={grid}
        inert
        className="grid w-full max-w-6xl grid-cols-3 gap-8 max-lg:grid-cols-2 max-md:grid-cols-1"
      >
        {SETS.map(({ name, Stage, keys, member }) => (
          <ComponentSet
            key={name}
            name={name}
            selected={all || edited.some((key) => !!key && keys.includes(key))}
            rows={[
              <div key="stage" className="relative h-40 w-full">
                <Stage replay={replay} />
              </div>,
              member ? (
                <Spec key="spec" member={member} />
              ) : (
                <ChartSpec key="spec" />
              ),
            ]}
          />
        ))}
      </div>
    </Board>
  )
}
