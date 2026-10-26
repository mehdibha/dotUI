"use client"

import { useEffect, useRef, useState } from "react"
import type { ReactNode } from "react"

import {
  ChevronDownIcon,
  CopyIcon,
  CreditCardIcon,
  PencilIcon,
  ShareIcon,
  TrashIcon,
} from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Avatar, AvatarFallback } from "@/registry/ui/avatar"
import { Button } from "@/registry/ui/button"
import { useStyles as useButtonStyles } from "@/registry/ui/button/styles"
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/registry/ui/dialog"
import { useStyles as useDialogStyles } from "@/registry/ui/dialog/styles"
import { Label } from "@/registry/ui/field"
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
import { Switch, SwitchControl } from "@/registry/ui/switch"
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
import { Tip } from "./menus-parts"
import { EaseCurve } from "./motion-parts"
import { CANVAS, ComponentSet, SetGrid } from "./set-parts"

const STEP_MS = 800

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

/** A set's window: fixed layers resolve against it. */
const FRAME = "absolute inset-0 overflow-hidden text-left contain-paint"

/** The page an overlay opens over. */
function List({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium">{title}</p>
      {children}
    </div>
  )
}

function Item({
  lead,
  name,
  meta,
}: {
  lead: ReactNode
  name: string
  meta: string
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      {lead}
      <span className="flex-1 truncate">{name}</span>
      <span className="text-xs text-fg-muted">{meta}</span>
    </div>
  )
}

function Glyph({ children }: { children: ReactNode }) {
  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted text-fg-muted [&_svg]:size-3.5">
      {children}
    </span>
  )
}

const MEMBERS = [
  { name: "Maya Chen", initials: "MC", role: "Admin" },
  { name: "Jonas Ortiz", initials: "JO", role: "Member" },
  { name: "Priya Shah", initials: "PS", role: "Member" },
]

function Members() {
  return (
    <List title="Team members">
      {MEMBERS.map((member) => (
        <Item
          key={member.name}
          lead={
            <Avatar size="sm">
              <AvatarFallback>{member.initials}</AvatarFallback>
            </Avatar>
          }
          name={member.name}
          meta={member.role}
        />
      ))}
    </List>
  )
}

function Invoices() {
  return (
    <List title="Invoices">
      {["Oct 1", "Sep 1"].map((date, index) => (
        <Item
          key={date}
          lead={
            <Glyph>
              <CreditCardIcon />
            </Glyph>
          }
          name={`#${1042 - index} · ${date}`}
          meta="$240"
        />
      ))}
    </List>
  )
}

const RANGES = ["Day", "Week", "Month"]
const PROGRESS = [12, 38, 64, 87, 100]

// One beat: the button presses, and on its release everything else moves.
function Controls({ replay }: { replay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const tick = useSteps({ replay, running: useInView(ref) }, STEP_MS)
  const pressed = tick % 2 === 1
  const step = Math.floor(tick / 2)
  const button = useButtonStyles()
  return (
    <div
      ref={ref}
      inert
      className={cn(FRAME, "flex flex-col items-center justify-center gap-5")}
    >
      <div className="flex items-center gap-6">
        <span
          {...stateProps(...(pressed ? (["pressed"] as const) : []))}
          data-button=""
          className={button({ variant: "primary" })}
        >
          <span className="truncate">Publish</span>
        </span>
        <Switch isSelected={step % 2 === 1}>
          <SwitchControl />
          <Label>Auto-save</Label>
        </Switch>
      </div>
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
      {/* A fresh bar each cycle, so 100 → 12 restarts instead of sliding back. */}
      <ProgressBar
        key={Math.floor(step / PROGRESS.length)}
        value={PROGRESS[step % PROGRESS.length]}
        className="w-full max-w-52"
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

// One presence for both, so they open and close together and never meet.
function Popovers({ replay }: { replay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const phase = usePresence(
    ref,
    { replay, running: useInView(ref) },
    { open: 1800, closed: 1000 },
  )
  const menu = usePopoverStyles()()
  const tooltip = useTooltipStyles()()
  const open = phase !== "closed"
  return (
    <div
      ref={ref}
      inert
      className={cn(FRAME, "flex items-start justify-between px-8 pt-16")}
    >
      <div className="relative">
        <Button variant="secondary">
          Options
          <ChevronDownIcon />
        </Button>
        {open && (
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
      <div className="relative">
        <Button variant="secondary" isIconOnly aria-label="Copy link">
          <CopyIcon />
        </Button>
        {open && (
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

const OVERLAY = { open: 2000, closed: 1200 }

function Modal({ replay }: { replay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const phase = usePresence(ref, { replay, running: useInView(ref) }, OVERLAY)
  const { overlay, backdrop, viewport, modal } = useModalStyles()()
  const { content } = useDialogStyles()()
  return (
    <div ref={ref} inert className={FRAME}>
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
                  <DialogTitle>Remove Maya?</DialogTitle>
                  <DialogDescription>
                    She loses access to Acme.
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
  )
}

const TOASTS = [
  { title: "Invoice paid", type: "success" },
  { title: "Receipt sent", description: "Copied to billing@acme.com." },
]

const TOAST_MS = 2400

function Toasts({ replay }: { replay: number }) {
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
    <div ref={ref} inert className={FRAME}>
      <Invoices />
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

/** A member's shipped timing, as the preview resolves its vars. */
function Timing({ name, member }: { name: string; member: string }) {
  const ms = parseFloat(useRootToken(`--studio-${member}-duration`)) || 0
  const ease = useRootToken(`--studio-${member.replace(/-enter$/, "")}-ease`)
  return (
    <span className="flex items-center gap-2 text-[11px] leading-none text-fg-muted">
      <EaseCurve
        timing={{ ms, ease: ease || "linear" }}
        span={Math.max(ms, 450)}
        className="h-5 w-10"
      />
      {name}
      <span className="font-mono tabular-nums">{ms}ms</span>
    </span>
  )
}

/* Each set: what moves, and the timings it moves by. */
const SETS: {
  name: string
  Stage: (props: { replay: number }) => React.ReactNode
  timings: [name: string, member: string][]
}[] = [
  {
    name: "Controls",
    Stage: Controls,
    timings: [
      ["Button", "button-state"],
      ["Switch", "switch-state"],
    ],
  },
  {
    name: "Overlays",
    Stage: Popovers,
    timings: [
      ["Menu", "popover-enter"],
      ["Tooltip", "tooltip-enter"],
    ],
  },
  { name: "Dialog", Stage: Modal, timings: [["Dialog", "modal-enter"]] },
  { name: "Toast", Stage: Toasts, timings: [["Toast", "toast-enter"]] },
]

export default function MotionBoard() {
  const { axis, holds } = useBoardFocus()
  const { replay } = useReplay()
  // The tempo and Speed time every set.
  const selected = [axis, ...(holds ?? [])].some(
    (key) => key === "motion" || key === "motionSpeed",
  )
  return (
    <Board id="motion" untitled className={CANVAS}>
      <SetGrid>
        {SETS.map(({ name, Stage, timings }) => (
          <ComponentSet
            key={name}
            name={name}
            selected={selected}
            rows={[
              <div key="stage" className="relative h-52 w-full">
                <Stage replay={replay} />
              </div>,
              <div key="timings" className="flex flex-wrap gap-x-5 gap-y-2">
                {timings.map(([label, member]) => (
                  <Timing key={member} name={label} member={member} />
                ))}
              </div>,
            ]}
          />
        ))}
      </SetGrid>
    </Board>
  )
}
