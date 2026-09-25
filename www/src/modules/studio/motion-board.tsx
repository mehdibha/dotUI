"use client"

/* The motion board — every animated component on one timeline, after a
   DevTools animations panel. A row per component, grouped by family: a
   specimen acting out its real curve and duration, and its bar on a shared
   ms axis — the enter solid with the exit as a ghost under it, a state
   change as a tick, a keyframe loop as a run of cycles. Replay plays every
   specimen at once, in and then out, under a sweeping playhead: the whole
   system's rhythm in one go. A row drills into the control its family
   shows, on the same state.

   The chrome is instant — opening, drilling in, going back; only the
   specimens move, and under reduced motion they wait for Replay. */

import { Fragment, useEffect, useRef, useState } from "react"
import { ChevronLeftIcon, PlayIcon } from "lucide-react"
import { Button as RacButton } from "react-aria-components"

import { cn } from "@/registry/lib/utils"

import { DialGlyph, DialPopover } from "./dial"
import {
  familyRows,
  formatMs,
  isModified,
  MOTION,
  MotionHint,
  timingOf,
} from "./motion-controls"
import type { MotionRow, Specimen, Timing } from "./motion-controls"
import { GroupTitle, useMedia } from "./rows"
import { FAMILY_LABELS } from "./sections/components"
import type { Studio, StudioState } from "./state"

/** The pause between the in sweep and the out sweep, and after the out. */
const HOLD = 450
const REST = 350

/* Specimen, label, bar, value — shared by the axis, the rows and the
   playhead's lane so every bar starts at the same x. */
const COLUMNS =
  "grid grid-cols-[1.5rem_minmax(0,7rem)_minmax(0,1fr)_2.75rem] gap-2 px-2"

const REDUCED = "(prefers-reduced-motion: reduce)"

/* -------------------------------- Specimens ------------------------------- */

/** Where the specimen starts and where it lands. */
function poses(look: Specimen, pattern = ""): [Keyframe, Keyframe] {
  if (look === "knob")
    return [{ transform: "translateX(0)" }, { transform: "translateX(10px)" }]
  if (look === "grow")
    return [{ transform: "scaleY(0)" }, { transform: "none" }]
  if (look === "expand")
    return [
      { transform: "scaleY(0)", opacity: pattern === "fade" ? 0 : 1 },
      { transform: "none", opacity: 1 },
    ]
  const from =
    pattern === "scale"
      ? "scale(0.6)"
      : pattern === "slide"
        ? "translateY(5px)"
        : "none"
  return [
    { transform: from, opacity: 0 },
    { transform: "none", opacity: 1 },
  ]
}

/** One replay: in on the enter timing, a hold, out on the exit timing (or
 *  the enter's, where the component has no exit leg), then a rest. Bars
 *  only grow. At rest a specimen shows its settled pose. */
function replay(look: Specimen, t: Timing, out: number) {
  const [from, to] = poses(look, t.pattern)
  if (look === "grow")
    return {
      keyframes: [{ ...from, easing: t.ease }, to],
      duration: Math.max(t.enter, 1),
    }
  const exit = t.exit ?? t.enter
  const total = out + exit + REST
  return {
    keyframes: [
      { ...from, offset: 0, easing: t.ease },
      { ...to, offset: t.enter / total },
      { ...to, offset: out / total, easing: t.exitEase ?? t.ease },
      { ...from, offset: (out + exit) / total },
      { ...from, offset: 1 },
    ],
    duration: total,
  }
}

function loopFrames(look: Specimen, ease: string): Keyframe[] {
  return look === "spin"
    ? [
        { transform: "rotate(0deg)", easing: ease },
        { transform: "rotate(1turn)" },
      ]
    : [
        { opacity: 1, easing: ease },
        { opacity: 0.35, offset: 0.5, easing: ease },
        { opacity: 1 },
      ]
}

const SHAPES: Record<Specimen, string> = {
  layer: "size-3 rounded-[3px] bg-fg/75",
  expand: "h-2 w-3.5 origin-top rounded-[2px] bg-fg/75",
  knob: "absolute top-0.5 left-0.5 size-1.5 rounded-full bg-fg/85",
  spin: "size-3 rounded-full border-[1.5px] border-fg/15 border-t-fg/80",
  pulse: "h-2 w-4 rounded-sm bg-fg/60",
  grow: "flex h-3 origin-bottom items-end gap-px",
}

/** A 24×16 specimen playing the component's motion. `run` counts replays
 *  (0: at rest); `out` is when the out leg starts. Loops run on their own
 *  unless motion is reduced, where a replay plays two cycles. */
function SpecimenView({
  look,
  timing,
  run,
  out,
}: {
  look: Specimen
  timing: Timing
  run: number
  out: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = useMedia(REDUCED)
  const { off, enter, ease, exit, exitEase, pattern } = timing
  useEffect(() => {
    const el = ref.current
    if (!el || off) return
    const t = { off, enter, ease, exit, exitEase, pattern }
    let animation: Animation
    if (look === "spin" || look === "pulse") {
      if (reduced && run === 0) return
      animation = el.animate(loopFrames(look, ease), {
        duration: Math.max(enter, 1),
        iterations: reduced ? 2 : Infinity,
      })
    } else {
      if (run === 0) return
      const { keyframes, duration } = replay(look, t, out)
      animation = el.animate(keyframes, { duration })
    }
    return () => animation.cancel()
  }, [look, off, enter, ease, exit, exitEase, pattern, run, out, reduced])

  const shape = (
    <span
      ref={ref}
      className={cn(SHAPES[look], off && look !== "knob" && "opacity-30")}
    >
      {look === "grow" &&
        [6, 10, 8].map((h) => (
          <span
            key={h}
            className="w-1 rounded-t-[1px] bg-fg/75"
            style={{ height: h }}
          />
        ))}
    </span>
  )
  return (
    <span aria-hidden className="flex h-4 w-6 items-center justify-center">
      {look === "knob" ? (
        <span className="relative h-2.5 w-5 rounded-full bg-fg/12">
          {shape}
        </span>
      ) : look === "expand" ? (
        <span className="flex flex-col gap-px">
          <span className="h-1 w-3.5 rounded-[1px] bg-fg/40" />
          {shape}
        </span>
      ) : (
        shape
      )}
    </span>
  )
}

/* ---------------------------------- Bars ---------------------------------- */

function Bars({
  row,
  timing,
  scale,
}: {
  row: MotionRow
  timing: Timing
  scale: number
}) {
  const at = (ms: number) => `${Math.min(100, (ms / scale) * 100)}%`
  const { kind } = row.entry
  let bars: React.ReactNode
  if (timing.off) bars = <span className="h-px w-full bg-fg/10" />
  else if (kind === "loop") {
    // A cycle per dash, uncapped: a cycle past the axis is one long dash.
    const cycle = `${(timing.enter / scale) * 100}%`
    bars = (
      <span
        className="h-1.5 w-full rounded-full mask-r-from-40% text-fg/45"
        style={{
          backgroundImage: `repeating-linear-gradient(90deg, currentColor 0 calc(${cycle} - 2px), transparent calc(${cycle} - 2px) ${cycle})`,
        }}
      />
    )
  } else if (kind === "state")
    bars = (
      <span className="relative h-3 w-full">
        <span
          className="absolute top-1/2 left-0 h-px -translate-y-1/2 bg-fg/35"
          style={{ width: at(timing.enter) }}
        />
        <span
          className="absolute top-0 h-3 w-0.5 -translate-x-1/2 rounded-full bg-fg/80"
          style={{ left: at(timing.enter) }}
        />
      </span>
    )
  else
    bars = (
      <span className="flex w-full flex-col gap-0.5">
        <span
          className="h-1.5 min-w-1 rounded-full bg-fg/70"
          style={{ width: at(timing.enter) }}
        />
        {timing.exit !== undefined && (
          <span
            className="h-1.5 min-w-1 rounded-full border border-dashed border-fg/35"
            style={{ width: at(timing.exit) }}
          />
        )}
      </span>
    )
  return (
    <span
      className={cn("flex min-w-0 items-center", row.follower && "opacity-45")}
    >
      {bars}
    </span>
  )
}

/* -------------------------------- Timeline -------------------------------- */

const boardRows = () => FAMILY_LABELS.flatMap(familyRows)

/** The axis's end: the longest timed leg, rounded up to 100ms. Loops run
 *  past any axis and don't set it. */
function scaleOf(timings: Timing[]) {
  const legs = timings.flatMap((t) => (t.off ? [] : [t.enter, t.exit ?? 0]))
  return Math.max(300, Math.ceil(Math.max(0, ...legs) / 100) * 100)
}

/** The sweep across the bars' lane: in over the axis, a fading hold, then
 *  out again. */
function Playhead({
  run,
  scale,
  out,
}: {
  run: number
  scale: number
  out: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || run === 0) return
    const total = out + scale
    const animation = el.animate(
      [
        { transform: "translateX(0)", opacity: 1, offset: 0 },
        { transform: "translateX(100%)", opacity: 1, offset: scale / total },
        { transform: "translateX(100%)", opacity: 0.25, offset: out / total },
        { transform: "translateX(0)", opacity: 1, offset: out / total },
        { transform: "translateX(100%)", opacity: 1, offset: 1 },
      ],
      { duration: total },
    )
    return () => animation.cancel()
  }, [run, scale, out])
  return (
    <span
      ref={ref}
      className="absolute inset-y-0 left-0 w-full border-l border-accent opacity-0"
    />
  )
}

function Timeline({
  studio,
  run,
  onReplay,
  onOpen,
  focusId,
}: {
  studio: Studio
  run: number
  onReplay: () => void
  onOpen: (id: string) => void
  focusId: string | null
}) {
  const { state } = studio
  const scale = scaleOf(
    MOTION.filter((e) => e.kind !== "loop").map((e) => timingOf(e, state)),
  )
  const out = scale + HOLD
  return (
    <>
      <div className="sticky -top-2 z-10 -mx-2 -mt-2 border-b border-fg/6 bg-card px-2 py-1.5">
        <div className={cn(COLUMNS, "h-8 items-center")}>
          <RacButton
            onPress={onReplay}
            className="col-span-2 -ml-1 flex h-7 w-fit cursor-interactive items-center gap-1.5 rounded-md tint-5 px-2 text-[13px] font-medium text-fg/70 focus-reset transition-colors hover:tint-10 hover:text-fg focus-visible:focus-ring pressed:tint-15"
          >
            <PlayIcon className="size-3 fill-current" />
            Replay
          </RacButton>
          <span
            aria-hidden
            className="flex justify-between font-mono text-[10px] text-fg/40 tabular-nums"
          >
            <span>0</span>
            <span>{scale / 2}</span>
            <span>{scale}</span>
          </span>
          <span
            aria-hidden
            className="text-right font-mono text-[10px] text-fg/40"
          >
            ms
          </span>
        </div>
      </div>
      <div className="relative flex flex-col gap-0.5">
        {FAMILY_LABELS.map((family) => {
          const group = familyRows(family)
          if (group.length === 0) return null
          return (
            <Fragment key={family}>
              <GroupTitle>{family}</GroupTitle>
              {group.map((row) => (
                <BoardRow
                  key={row.id}
                  row={row}
                  state={state}
                  timing={timingOf(row.entry, state)}
                  scale={scale}
                  run={run}
                  out={out}
                  autoFocus={row.id === focusId}
                  onOpen={onOpen}
                />
              ))}
            </Fragment>
          )
        })}
        <div
          aria-hidden
          className={cn(
            COLUMNS,
            "pointer-events-none absolute inset-0 grid-rows-[1fr]",
          )}
        >
          <span className="relative col-start-3 overflow-hidden">
            {[25, 50, 75].map((left) => (
              <span
                key={left}
                className="absolute inset-y-0 w-px bg-fg/5"
                style={{ left: `${left}%` }}
              />
            ))}
            <Playhead run={run} scale={scale} out={out} />
          </span>
        </div>
      </div>
    </>
  )
}

function BoardRow({
  row,
  state,
  timing,
  scale,
  run,
  out,
  autoFocus,
  onOpen,
}: {
  row: MotionRow
  state: StudioState
  timing: Timing
  scale: number
  run: number
  out: number
  autoFocus: boolean
  onOpen: (id: string) => void
}) {
  const modified = isModified(row.entry, state)
  return (
    <RacButton
      autoFocus={autoFocus}
      onPress={() => onOpen(row.id)}
      className={cn(
        COLUMNS,
        "h-8 w-full cursor-interactive items-center rounded-md text-left focus-reset transition-colors hover:tint-5 focus-visible:focus-ring pointer-coarse:h-10 pressed:tint-10",
      )}
    >
      <SpecimenView
        look={row.entry.specimen}
        timing={timing}
        run={run}
        out={out}
      />
      <span className="flex min-w-0 items-center gap-1.5">
        <span className="truncate text-[13px] font-medium text-fg/70">
          {row.label}
        </span>
        {modified && (
          <span
            role="img"
            aria-label="Modified"
            className="size-1 shrink-0 rounded-full bg-accent"
          />
        )}
      </span>
      <Bars row={row} timing={timing} scale={scale} />
      <span className="truncate text-right font-mono text-[11px] text-fg/50 tabular-nums">
        {timing.off ? (
          <>
            <span aria-hidden>—</span>
            <span className="sr-only">None</span>
          </>
        ) : (
          formatMs(timing.enter)
        )}
      </span>
    </RacButton>
  )
}

/* --------------------------------- Detail --------------------------------- */

/** One component's control, as its family shows it, under a header that
 *  goes back and replays the specimen — on its own after every change. */
function Detail({
  row,
  studio,
  onBack,
}: {
  row: MotionRow
  studio: Studio
  onBack: () => void
}) {
  const reduced = useMedia(REDUCED)
  const timing = timingOf(row.entry, studio.state)
  const [run, setRun] = useState(0)
  const signature = JSON.stringify(timing)
  const last = useRef(signature)
  useEffect(() => {
    if (last.current === signature) return
    last.current = signature
    if (!reduced) setRun((n) => n + 1)
  }, [signature, reduced])
  return (
    <>
      <div className="flex h-9 shrink-0 items-center gap-1">
        <RacButton
          autoFocus
          aria-label="Back to every component"
          onPress={onBack}
          className="flex size-7 cursor-interactive items-center justify-center rounded-md text-fg/60 focus-reset transition-colors hover:tint-10 hover:text-fg focus-visible:focus-ring pointer-coarse:size-9"
        >
          <ChevronLeftIcon className="size-4" />
        </RacButton>
        <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-fg/70">
          {row.label}
        </span>
        <RacButton
          aria-label={`Replay ${row.label}`}
          onPress={() => setRun((n) => n + 1)}
          className="flex h-7 cursor-interactive items-center gap-1 rounded-md tint-5 pr-2 text-fg/60 focus-reset transition-colors hover:tint-10 hover:text-fg focus-visible:focus-ring"
        >
          <SpecimenView
            look={row.entry.specimen}
            timing={timing}
            run={run}
            out={Math.max(timing.enter, timing.exit ?? 0) + HOLD}
          />
          <PlayIcon className="size-3 fill-current" />
        </RacButton>
      </div>
      <MotionHint row={row} />
      <row.entry.Control studio={studio} />
    </>
  )
}

/* ---------------------------------- Board --------------------------------- */

/** The Motion chapter's popover: the timeline, or one row's control. */
export function MotionBoard({ studio }: { studio: Studio }) {
  const reduced = useMedia(REDUCED)
  const [run, setRun] = useState(0)
  const [openId, setOpenId] = useState<string | null>(null)
  const [focusId, setFocusId] = useState<string | null>(null)
  // Plays once on open; reduced motion waits for Replay.
  useEffect(() => {
    if (!reduced) setRun((n) => n || 1)
  }, [reduced])
  const open = openId ? boardRows().find((row) => row.id === openId) : null
  return (
    <DialPopover className="w-96">
      {open ? (
        <Detail
          row={open}
          studio={studio}
          onBack={() => {
            setFocusId(open.id)
            setOpenId(null)
            // Back on the board, the change plays in context.
            setRun((n) => (reduced ? 0 : n + 1))
          }}
        />
      ) : (
        <Timeline
          studio={studio}
          run={run}
          onReplay={() => setRun((n) => n + 1)}
          onOpen={setOpenId}
          focusId={focusId}
        />
      )}
    </DialPopover>
  )
}

/* --------------------------------- Summary -------------------------------- */

/** Three legs of different lengths under a playhead. */
function TimelineGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h11M4 12h6M4 17h15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M13 4v16"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity=".45"
      />
    </svg>
  )
}

/** The board's row value: the system's tempo, shortest leg to longest,
 *  marked once any component leaves its defaults. */
export function BoardSummary({ state }: { state: StudioState }) {
  const legs = MOTION.filter((e) => e.kind !== "loop").flatMap((entry) => {
    const t = timingOf(entry, state)
    return t.off ? [] : [t.enter, t.exit ?? t.enter]
  })
  const tuned = MOTION.some((entry) => isModified(entry, state))
  const tempo = legs.length
    ? `${Math.round(Math.min(...legs))}–${formatMs(Math.max(...legs))}`
    : "Still"
  return (
    <>
      {tuned && (
        <span
          role="img"
          aria-label="Modified"
          className="size-1 shrink-0 rounded-full bg-accent"
        />
      )}
      <span className="truncate">{tempo}</span>
      <DialGlyph>
        <TimelineGlyph />
      </DialGlyph>
    </>
  )
}
