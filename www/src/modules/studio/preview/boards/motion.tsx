"use client"

import { useContext, useEffect, useLayoutEffect, useRef, useState } from "react"

import { DesignSystemContext } from "@/lib/styles"
import {
  ChevronDownIcon,
  CopyIcon,
  PencilIcon,
  ShareIcon,
  StarIcon,
  TrashIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@/registry/ui/accordion"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Button } from "@/registry/ui/button"
import { BarChart } from "@/registry/ui/chart-bar"
import { Checkbox, CheckboxControl } from "@/registry/ui/checkbox"
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { useStyles as useDialogStyles } from "@/registry/ui/dialog/styles"
import { DrawerHandle } from "@/registry/ui/drawer"
import { useStyles as useDrawerStyles } from "@/registry/ui/drawer/styles"
import { Label } from "@/registry/ui/field"
import { Input } from "@/registry/ui/input"
import { useStyles as useInputStyles } from "@/registry/ui/input/styles"
import { ListBox, ListBoxItem } from "@/registry/ui/list-box"
import { Loader } from "@/registry/ui/loader"
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
import { SelectTrigger } from "@/registry/ui/select"
import { Skeleton } from "@/registry/ui/skeleton"
import { Switch, SwitchControl } from "@/registry/ui/switch"
import { Tab, TabList, Tabs } from "@/registry/ui/tabs"
import { useStyles as useTimePickerStyles } from "@/registry/ui/time-picker/styles"
import { ToastPrimitive, ToastProvider } from "@/registry/ui/toast"
import { ToggleButton } from "@/registry/ui/toggle-button"
import { useStyles as useTooltipStyles } from "@/registry/ui/tooltip/styles"

import { Board, BoardSection, CAPTION, useBoardFocus } from "./board"

/* ---------------------------------- Loops ---------------------------------- */

const STEP_MS = 1600

const AXES = {
  controls: [
    "motion",
    "buttonMotion",
    "selectionMotion",
    "navMotion",
    "inputMotion",
    "dateMotion",
  ],
  overlays: ["motionEntrance", "menuMotion", "mobilePickers"],
  dialogs: ["dialogEntrance", "dialogMotion"],
  toasts: ["feedbackMotion"],
  disclosure: ["displayMotion"],
  loading: ["skeletonAnimation", "spinnerStyle", "feedbackMotion"],
  charts: ["chartMotion"],
} as const

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

/** Bumps when the panel focuses one of `axes` (the global Motion counts for all), and on each design change while it does. */
function useReplay(axes: readonly string[]) {
  const { axis } = useBoardFocus()
  const { params } = useContext(DesignSystemContext)
  const focused = axis === "motion" || (!!axis && axes.includes(axis))
  const [replay, setReplay] = useState(0)
  useEffect(() => {
    if (focused) setReplay((count) => count + 1)
  }, [focused, axis, params])
  return replay
}

/** A step every `period` while on screen; a replay steps at once. */
function useSteps(
  ref: React.RefObject<HTMLElement | null>,
  replay: number,
  { period = STEP_MS, delay = 0 } = {},
) {
  const inView = useInView(ref)
  const [step, setStep] = useState(0)
  const replayed = useRef(replay)
  useEffect(() => {
    if (!inView) return
    const now = replayed.current !== replay
    replayed.current = replay
    const next = () => setStep((count) => count + 1)
    let interval: ReturnType<typeof setInterval> | undefined
    const start = setTimeout(
      () => {
        next()
        interval = setInterval(next, period)
      },
      now ? 0 : period + delay,
    )
    return () => {
      clearTimeout(start)
      clearInterval(interval)
    }
  }, [inView, replay, period, delay])
  return step
}

type Phase = "closed" | "entering" | "open" | "exiting"

/** An overlay opening and closing on a loop, its states the ones react-aria (or Base UI) sets. */
function usePresence(
  ref: React.RefObject<HTMLElement | null>,
  replay: number,
  { open = 1800, closed = 1000 } = {},
) {
  const inView = useInView(ref)
  const [phase, setPhase] = useState<Phase>("closed")
  const quick = useRef(false)

  useEffect(() => {
    if (!replay) return
    quick.current = true
    setPhase("closed")
  }, [replay])

  useLayoutEffect(() => {
    if (phase !== "entering") return
    // Commit the entering styles, so leaving them transitions.
    ref.current?.getBoundingClientRect()
    setPhase("open")
  }, [phase, ref])

  useEffect(() => {
    if (phase === "exiting") {
      const transitions =
        ref.current
          ?.getAnimations({ subtree: true })
          .filter((animation) => animation instanceof CSSTransition)
          .map((animation) => animation.finished) ?? []
      let live = true
      void Promise.allSettled(transitions).then(() => {
        if (live) setPhase("closed")
      })
      return () => {
        live = false
      }
    }
    if (!inView) return
    const [next, wait]: [Phase, number] | [] =
      phase === "closed"
        ? ["entering", quick.current ? 0 : closed]
        : phase === "open"
          ? ["exiting", open]
          : []
    if (!next) return
    const timer = setTimeout(() => {
      quick.current = false
      setPhase(next)
    }, wait)
    return () => clearTimeout(timer)
  }, [phase, inView, replay, open, closed, ref])

  return phase
}

const RAC_STATE: Partial<Record<Phase, Record<string, string>>> = {
  entering: { "data-entering": "" },
  exiting: { "data-exiting": "" },
}

const BASE_STATE: Partial<Record<Phase, Record<string, string>>> = {
  entering: { "data-starting-style": "" },
  exiting: { "data-ending-style": "" },
}

/* --------------------------------- Layout ---------------------------------- */

function Specimen({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-3">
      <div
        inert
        className={cn("flex w-full items-center justify-center", className)}
      >
        {children}
      </div>
      <span className={CAPTION}>{label}</span>
    </div>
  )
}

/** A small window the overlay plays in: fixed layers resolve against it. */
const FRAME =
  "relative w-full overflow-hidden rounded-(--studio-radius-panel) border bg-bg contain-paint"

const GRID = "grid w-full justify-stretch gap-x-6 gap-y-10"

/** The arrow react-aria's OverlayArrow draws, on the side facing the trigger. */
function Tip({
  className,
  placement,
  size,
}: {
  className: string
  placement: "top" | "bottom"
  size: number
}) {
  return (
    <div
      data-placement={placement}
      className={className}
      style={{
        position: "absolute",
        [placement]: "100%",
        left: "50%",
        translate: "-50% 0",
      }}
    >
      <svg aria-hidden width={size} height={size} viewBox="0 0 8 8">
        <path d="M0 0 L4 4 L8 0" />
      </svg>
    </div>
  )
}

/* -------------------------------- Controls --------------------------------- */

const RANGES = ["Day", "Week", "Month"]
const TABS = ["Files", "Issues", "Docs"]
const TIMES = ["09:00", "09:30", "10:00", "10:30"]

function Controls() {
  const ref = useRef<HTMLDivElement>(null)
  const step = useSteps(ref, useReplay(AXES.controls))
  const { input } = useInputStyles()()
  const { item } = useTimePickerStyles()()
  const on = step % 2 === 1

  return (
    <div
      ref={ref}
      className={cn(
        GRID,
        "grid-cols-1 @xl/section:grid-cols-2 @4xl/section:grid-cols-3",
      )}
    >
      <Specimen label="Switch">
        <Switch isSelected={on}>
          <SwitchControl />
          <Label>Auto-save</Label>
        </Switch>
      </Specimen>
      <Specimen label="Checkbox">
        <Checkbox isSelected={on}>
          <CheckboxControl />
          <Label>Email me updates</Label>
        </Checkbox>
      </Specimen>
      <Specimen label="Toggle button">
        <ToggleButton isSelected={!on}>
          <StarIcon />
          Star
        </ToggleButton>
      </Specimen>
      <Specimen label="Segmented control">
        <SegmentedControl
          aria-label="Range"
          selectedKeys={[RANGES[step % 3] ?? "Day"]}
        >
          {RANGES.map((range) => (
            <SegmentedControlItem key={range} id={range}>
              {range}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
      </Specimen>
      <Specimen label="Tabs">
        <Tabs selectedKey={TABS[step % 3]}>
          <TabList aria-label="Project">
            {TABS.map((tab) => (
              <Tab key={tab} id={tab}>
                {tab}
              </Tab>
            ))}
          </TabList>
        </Tabs>
      </Specimen>
      <Specimen label="Input and time" className="gap-4">
        <input
          aria-label="Email"
          readOnly
          tabIndex={-1}
          value="maya@acme.com"
          data-rac=""
          data-focused={on || undefined}
          className={input({ className: "w-40" })}
        />
        <div className="flex flex-col gap-0.5">
          {TIMES.slice(0, 3).map((time, index) => (
            <div
              key={time}
              data-rac=""
              data-selected={index === step % 3 || undefined}
              className={item({ className: "w-16" })}
            >
              {time}
            </div>
          ))}
        </div>
      </Specimen>
    </div>
  )
}

/* -------------------------------- Overlays --------------------------------- */

const STAGE = "relative flex h-72 w-full justify-center"

function MenuStage({ replay }: { replay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const phase = usePresence(ref, replay)
  const { popover, arrow } = usePopoverStyles()()
  return (
    <Specimen label="Menu">
      <div ref={ref} className={cn(STAGE, "pt-2")}>
        <div className="relative h-fit">
          <Button variant="secondary">
            Options
            <ChevronDownIcon />
          </Button>
          {phase !== "closed" && (
            <div className="absolute top-full left-1/2 mt-2 -translate-x-1/2">
              <div
                data-rac=""
                data-placement="bottom"
                {...RAC_STATE[phase]}
                className={popover({ className: "w-44" })}
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
                    <CopyIcon />
                    Duplicate
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
                <Tip className={arrow()} placement="bottom" size={12} />
              </div>
            </div>
          )}
        </div>
      </div>
    </Specimen>
  )
}

function TooltipStage({ replay }: { replay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const phase = usePresence(ref, replay, { open: 1400, closed: 1200 })
  const { content, arrow } = useTooltipStyles()()
  return (
    <Specimen label="Tooltip">
      <div
        ref={ref}
        className={cn(STAGE, "h-32 items-center @3xl/section:h-72")}
      >
        <div className="relative">
          <Button variant="secondary" isIconOnly aria-label="Copy link">
            <CopyIcon />
          </Button>
          {phase !== "closed" && (
            <div className="absolute bottom-full left-1/2 mb-2.5 -translate-x-1/2">
              <div
                data-rac=""
                data-placement="top"
                {...RAC_STATE[phase]}
                className={content({ className: "relative whitespace-nowrap" })}
                style={
                  {
                    "--trigger-anchor-point": "50% 100%",
                  } as React.CSSProperties
                }
              >
                Copy link
                <Tip className={arrow()} placement="top" size={8} />
              </div>
            </div>
          )}
        </div>
      </div>
    </Specimen>
  )
}

const ZONES = ["London", "Lisbon", "Madrid", "Paris"]

function ZoneList() {
  return (
    <ListBox
      aria-label="Time zone"
      selectionMode="single"
      selectedKeys={["Lisbon"]}
    >
      {ZONES.map((zone) => (
        <ListBoxItem key={zone} id={zone}>
          {zone}
        </ListBoxItem>
      ))}
    </ListBox>
  )
}

/** A select on a phone: the picker rises as a drawer or drops anchored, as the system says. */
function PickerStage({ replay }: { replay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const phase = usePresence(ref, replay, { open: 2000, closed: 1000 })
  const { params } = useContext(DesignSystemContext)
  const drawer = (params.popover?.mobile ?? "drawer") === "drawer"
  const { popover, arrow } = usePopoverStyles()()
  const drawerStyles = useDrawerStyles()()
  return (
    <Specimen label="Picker on mobile">
      <div
        ref={ref}
        className={cn(FRAME, "h-80 w-48 rounded-[1.75rem] text-left")}
      >
        <div className="flex flex-col gap-2 p-4 pt-8">
          <Label>Time zone</Label>
          <div className="relative">
            <SelectTrigger className="w-full">Lisbon</SelectTrigger>
            {!drawer && phase !== "closed" && (
              <div className="absolute inset-x-0 top-full mt-2">
                <div
                  data-rac=""
                  data-placement="bottom"
                  {...RAC_STATE[phase]}
                  className={popover({ className: "overflow-hidden" })}
                  style={
                    {
                      "--trigger-anchor-point": "50% 0",
                      "--trigger-width": "100%",
                    } as React.CSSProperties
                  }
                >
                  <ZoneList />
                  <Tip className={arrow()} placement="bottom" size={12} />
                </div>
              </div>
            )}
          </div>
        </div>
        {drawer && phase !== "closed" && (
          <div className={drawerStyles.overlay()}>
            <div className={drawerStyles.backdrop()} {...BASE_STATE[phase]} />
            <div className={drawerStyles.viewport({ placement: "bottom" })}>
              <div
                data-drawer=""
                {...BASE_STATE[phase]}
                className={drawerStyles.popup({ placement: "bottom" })}
              >
                <DrawerHandle />
                <ZoneList />
              </div>
            </div>
          </div>
        )}
      </div>
    </Specimen>
  )
}

function Overlays() {
  const replay = useReplay(AXES.overlays)
  return (
    <div className={cn(GRID, "grid-cols-1 @3xl/section:grid-cols-3")}>
      <MenuStage replay={replay} />
      <TooltipStage replay={replay} />
      <PickerStage replay={replay} />
    </div>
  )
}

/* --------------------------------- Dialogs --------------------------------- */

const MEMBERS = [
  { name: "Maya Chen", initials: "MC", role: "Admin" },
  { name: "Jonas Ortiz", initials: "JO", role: "Member" },
  { name: "Priya Shah", initials: "PS", role: "Member" },
]

function Members() {
  return (
    <div className="flex flex-col gap-3 p-5">
      <p className="text-sm font-medium">Team members</p>
      {MEMBERS.map((member) => (
        <div key={member.name} className="flex items-center gap-3 text-sm">
          <Avatar size="sm">
            <AvatarFallback>{member.initials}</AvatarFallback>
          </Avatar>
          <span className="flex-1 truncate">{member.name}</span>
          <span className="text-xs text-fg-muted">{member.role}</span>
        </div>
      ))}
    </div>
  )
}

function ModalStage({ replay }: { replay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const phase = usePresence(ref, replay, { open: 2000, closed: 1200 })
  const { overlay, backdrop, viewport, modal } = useModalStyles()()
  const { content } = useDialogStyles()()
  return (
    <Specimen label="Modal">
      <div ref={ref} className={cn(FRAME, "h-72")}>
        <Members />
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
                <div className={content()}>
                  <DialogHeader>
                    <DialogTitle>Remove Maya Chen?</DialogTitle>
                    <DialogDescription>
                      She loses access to Acme and its 12 projects.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="secondary">Cancel</Button>
                    <Button variant="danger">Remove</Button>
                  </DialogFooter>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Specimen>
  )
}

function DrawerStage({ replay }: { replay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const phase = usePresence(ref, replay, { open: 2000, closed: 1200 })
  const { overlay, backdrop, viewport, popup } = useDrawerStyles()()
  const { content } = useDialogStyles()()
  return (
    <Specimen label="Drawer">
      <div ref={ref} className={cn(FRAME, "h-72")}>
        <Members />
        {phase !== "closed" && (
          <div className={overlay()}>
            <div className={backdrop()} {...BASE_STATE[phase]} />
            <div className={viewport({ placement: "bottom" })}>
              <div
                data-drawer=""
                {...BASE_STATE[phase]}
                className={popup({ placement: "bottom" })}
              >
                <DrawerHandle />
                <div className={content()}>
                  <DialogHeader>
                    <DialogTitle>Invite to Acme</DialogTitle>
                    <DialogDescription>
                      Anyone with the link can join as a member.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex gap-2">
                    <Input
                      aria-label="Invite link"
                      readOnly
                      value="acme.com/join/k3f9"
                      className="min-w-0 flex-1"
                    />
                    <Button variant="primary">Copy</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Specimen>
  )
}

function Dialogs() {
  const replay = useReplay(AXES.dialogs)
  return (
    <div className={cn(GRID, "grid-cols-1 @2xl/section:grid-cols-2")}>
      <ModalStage replay={replay} />
      <DrawerStage replay={replay} />
    </div>
  )
}

/* --------------------------------- Toasts ---------------------------------- */

const TOASTS = [
  { title: "Changes saved", type: "success" },
  {
    title: "Invite sent",
    description: "maya@acme.com can now join Acme.",
  },
]

const TOAST_MS = 2400

function Toasts() {
  const [frame, setFrame] = useState<HTMLDivElement | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)
  const replay = useReplay(AXES.toasts)
  const [manager] = useState(() => ToastPrimitive.createToastManager())
  const replayed = useRef(replay)

  useEffect(() => {
    if (!inView || !frame) return
    const now = replayed.current !== replay
    replayed.current = replay
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
    let interval: ReturnType<typeof setInterval> | undefined
    const start = setTimeout(
      () => {
        add()
        interval = setInterval(add, TOAST_MS + 1200)
      },
      now ? 0 : 600,
    )
    return () => {
      clearTimeout(start)
      clearInterval(interval)
      for (const closer of closers) clearTimeout(closer)
      manager.close()
    }
  }, [inView, frame, replay, manager])

  return (
    <div ref={ref} className="w-full max-w-xl">
      <Specimen label="Toast">
        <div
          ref={setFrame}
          className={cn(
            FRAME,
            "h-40 [&_[data-slot=toast-viewport]]:w-[calc(100%-2*var(--toast-inset))]",
          )}
        >
          {frame && (
            <ToastProvider
              toastManager={manager}
              position="bottom-right"
              portalProps={{ container: frame }}
            />
          )}
        </div>
      </Specimen>
    </div>
  )
}

/* ------------------------------- Disclosure -------------------------------- */

const FAQ = [
  {
    id: "plan",
    question: "What's included in Pro?",
    answer: "Unlimited projects, custom domains and priority support.",
  },
  {
    id: "change",
    question: "Can I change plans later?",
    answer: "Upgrades apply at once; downgrades at the end of the cycle.",
  },
  {
    id: "refund",
    question: "Do you offer refunds?",
    answer: "Within 14 days of purchase, no questions asked.",
  },
]

function Disclosure() {
  const ref = useRef<HTMLDivElement>(null)
  const step = useSteps(ref, useReplay(AXES.disclosure), { period: 2200 })
  return (
    <div ref={ref} className="w-full max-w-md">
      <Specimen label="Accordion">
        <Accordion
          className="w-full"
          expandedKeys={new Set([FAQ[step % FAQ.length]?.id ?? "plan"])}
        >
          {FAQ.map((entry) => (
            <AccordionItem key={entry.id} id={entry.id}>
              <AccordionTrigger>{entry.question}</AccordionTrigger>
              <AccordionPanel>{entry.answer}</AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Specimen>
    </div>
  )
}

/* --------------------------------- Loading --------------------------------- */

const PEOPLE = [
  { name: "Maya Chen", email: "maya@acme.com" },
  { name: "Jonas Ortiz", email: "jonas@acme.com" },
  { name: "Priya Shah", email: "priya@acme.com" },
]

const PROGRESS = [12, 38, 64, 87, 100]

function Loading() {
  const ref = useRef<HTMLDivElement>(null)
  const step = useSteps(ref, useReplay(AXES.loading))
  const cycle = Math.floor(step / PROGRESS.length)
  return (
    <div
      ref={ref}
      className={cn(GRID, "grid-cols-1 items-center @2xl/section:grid-cols-3")}
    >
      <Specimen label="Skeleton">
        <Skeleton isLoading className="flex w-full max-w-56 flex-col gap-4">
          {PEOPLE.map((person) => (
            <div key={person.name} className="flex items-center gap-3">
              <div data-skeleton="circle" className="size-9 shrink-0" />
              <div className="flex min-w-0 flex-col gap-1.5">
                <p className="w-fit text-sm">{person.name}</p>
                <p className="w-fit text-xs">{person.email}</p>
              </div>
            </div>
          ))}
        </Skeleton>
      </Specimen>
      <Specimen label="Spinner" className="flex-col gap-5">
        <Loader aria-label="Loading" className="size-6" />
        <Button variant="secondary" isPending>
          Saving
        </Button>
      </Specimen>
      <Specimen label="Progress">
        <ProgressBar
          key={cycle}
          value={PROGRESS[step % PROGRESS.length]}
          className="w-full max-w-56"
        >
          <div className="flex items-center justify-between gap-2">
            <Label>Uploading 4 files</Label>
            <ProgressBarOutput />
          </div>
          <ProgressBarControl />
        </ProgressBar>
      </Specimen>
    </div>
  )
}

/* --------------------------------- Charts ---------------------------------- */

const VISITS = [
  [
    { month: "Jan", visits: 186 },
    { month: "Feb", visits: 305 },
    { month: "Mar", visits: 237 },
    { month: "Apr", visits: 173 },
    { month: "May", visits: 209 },
    { month: "Jun", visits: 264 },
  ],
  [
    { month: "Jan", visits: 142 },
    { month: "Feb", visits: 198 },
    { month: "Mar", visits: 286 },
    { month: "Apr", visits: 251 },
    { month: "May", visits: 318 },
    { month: "Jun", visits: 192 },
  ],
]

function Charts() {
  const ref = useRef<HTMLDivElement>(null)
  const replay = useReplay(AXES.charts)
  const step = useSteps(ref, replay, { period: 2800 })
  return (
    <div ref={ref} className="w-full max-w-xl">
      <Specimen label="Bar chart">
        <BarChart
          key={replay}
          data={VISITS[step % 2] ?? []}
          x="month"
          y="visits"
          labels={{ visits: "Visits" }}
          ariaLabel="Visits per month, January through June"
          className="w-full"
        />
      </Specimen>
    </div>
  )
}

/* ---------------------------------- Board ---------------------------------- */

export default function MotionBoard() {
  return (
    <Board id="motion">
      <BoardSection member="controls" title="Controls" axes={AXES.controls}>
        <Controls />
      </BoardSection>
      <BoardSection member="overlays" title="Overlays" axes={AXES.overlays}>
        <Overlays />
      </BoardSection>
      <BoardSection member="dialogs" title="Dialogs" axes={AXES.dialogs}>
        <Dialogs />
      </BoardSection>
      <BoardSection member="toasts" title="Toasts" axes={AXES.toasts}>
        <Toasts />
      </BoardSection>
      <BoardSection
        member="disclosure"
        title="Disclosure"
        axes={AXES.disclosure}
      >
        <Disclosure />
      </BoardSection>
      <BoardSection member="loading" title="Loading" axes={AXES.loading}>
        <Loading />
      </BoardSection>
      <BoardSection member="charts" title="Charts" axes={AXES.charts}>
        <Charts />
      </BoardSection>
    </Board>
  )
}
