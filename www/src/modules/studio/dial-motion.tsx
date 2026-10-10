"use client"

/* Motion controls, after DialKit's TransitionControl (dialkit.dev, MIT, Josh
   Puckett). Everything edits inline: one component's panel never opens
   another. */

import { useId, useRef, useState } from "react"
import { mergeProps, useFocusRing, useMove } from "react-aria"
import { Input as RacInput } from "react-aria-components"

import { cn } from "@/registry/lib/utils"

import {
  CURVES,
  curveName,
  curveTiming,
  CYCLE_RANGE,
  DURATION_RANGE,
  formatMs,
  springParams,
  springProgress,
} from "./axes/motion"
import type { Bezier, Curve, Entrance, Loop, StateChange } from "./axes/motion"
import {
  DIAL_LABEL,
  DIAL_ROW,
  DIAL_VALUE,
  DialChips,
  DialRow,
  DialSegmented,
  DialSlider,
} from "./dial"
import type { DialOption } from "./dial"
import { previewNow } from "./live"
import { useDraft } from "./rows"

/* -------------------------------- Geometry -------------------------------- */

/* The graph's own units; the SVG scales to the popover's width. */
const W = 256
const H = 180
const clampY = (y: number) => Math.max(-1, Math.min(2, y))
const round2 = (n: number) => Number(n.toFixed(2))

/** Both axes share one scale so the 0→1 diagonal stays at 45°, overshoot
 *  included. */
function fitGraph(ease: Bezier) {
  const padding = 12
  const radiusY = Math.max(
    0.5,
    Math.abs(ease[1] - 0.5),
    Math.abs(ease[3] - 0.5),
  )
  const unit = Math.min(W - padding * 2, (H / 2 - padding) / radiusY)
  const at = (x: number, y: number) => ({
    x: W / 2 + (x - 0.5) * unit,
    y: H / 2 - (y - 0.5) * unit,
  })
  return {
    unit,
    start: at(0, 0),
    end: at(1, 1),
    handles: [at(ease[0], ease[1]), at(ease[2], ease[3])] as const,
  }
}

/** A handle moved by (dx, dy) in value units: x stays in 0–1, y in -1–2. */
function moveHandle(
  ease: Bezier,
  handle: 0 | 1,
  dx: number,
  dy: number,
): Bezier {
  const [x1, y1, x2, y2] = ease
  const [x, y] = handle ? [x2, y2] : [x1, y1]
  const nx = dx ? round2(Math.max(0, Math.min(1, x + dx))) : x
  const ny = dy ? round2(clampY(y + dy)) : y
  return handle ? [x1, y1, nx, ny] : [nx, ny, x2, y2]
}

function parseBezier(text: string): Bezier | null {
  const parts = text.split(",").map((part) => Number(part.trim()))
  if (parts.length !== 4 || !parts.every(Number.isFinite)) return null
  const [x1, y1, x2, y2] = parts as Bezier
  if (x1 < 0 || x1 > 1 || x2 < 0 || x2 > 1) return null
  return [x1, clampY(y1), x2, clampY(y2)]
}

/* --------------------------------- Graphs --------------------------------- */

const GRAPH =
  "relative aspect-256/180 w-full shrink-0 overflow-hidden rounded-lg tint-5"

/** One draggable control point: pointer drags from where it was grabbed,
 *  the arrow keys nudge. */
function BezierHandle({
  ease,
  handle,
  onDraft,
  onChange,
  graphRef,
  helpId,
}: {
  ease: Bezier
  handle: 0 | 1
  onDraft: (ease: Bezier) => void
  onChange: (ease: Bezier) => void
  graphRef: React.RefObject<HTMLDivElement | null>
  helpId: string
}) {
  const drag = useRef({
    start: ease,
    last: ease,
    x: 0,
    y: 0,
    ratio: 1,
    unit: 1,
  })
  const { moveProps } = useMove({
    onMoveStart() {
      const width = graphRef.current?.getBoundingClientRect().width || W
      drag.current = {
        start: ease,
        last: ease,
        x: 0,
        y: 0,
        ratio: W / width,
        unit: fitGraph(ease).unit,
      }
    },
    onMove(e) {
      if (e.pointerType === "keyboard") {
        const step = e.shiftKey ? 0.1 : 0.01
        onChange(moveHandle(ease, handle, e.deltaX * step, -e.deltaY * step))
        return
      }
      const d = drag.current
      d.x += e.deltaX
      d.y += e.deltaY
      d.last = moveHandle(
        d.start,
        handle,
        (d.x * d.ratio) / d.unit,
        (-d.y * d.ratio) / d.unit,
      )
      onDraft(d.last)
    },
    onMoveEnd(e) {
      if (e.pointerType !== "keyboard") onChange(drag.current.last)
    },
  })
  const { focusProps, isFocusVisible } = useFocusRing()
  const point = fitGraph(ease).handles[handle]
  return (
    <button
      type="button"
      aria-label={`Handle ${handle + 1}: x ${ease[handle * 2]}, y ${ease[handle * 2 + 1]}`}
      aria-describedby={helpId}
      {...mergeProps(moveProps, focusProps)}
      style={{
        left: `${(point.x / W) * 100}%`,
        top: `${(point.y / H) * 100}%`,
      }}
      className={cn(
        "group absolute grid size-6 -translate-1/2 cursor-grab touch-none place-items-center rounded-full outline-none select-none active:cursor-grabbing",
        isFocusVisible && "focus-ring",
      )}
    >
      <span className="size-2.5 rounded-full border-[1.5px] border-fg/60 bg-card transition-colors group-hover:border-fg group-hover:bg-fg group-active:border-fg group-active:bg-fg" />
    </button>
  )
}

/** DialKit's easing graph: the curve, its tangents to both handles, and the
 *  linear reference. Drags preview; release commits. */
function BezierEditor({
  ease,
  onChange,
}: {
  ease: Bezier
  onChange: (ease: Bezier) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const helpId = useId()
  const [draft, setDraft] = useDraft(ease)
  const { start, end, handles } = fitGraph(draft)
  const [a, b] = handles
  return (
    <div ref={ref} role="group" aria-label="Bézier curve" className={GRAPH}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
      >
        <line
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          className="stroke-fg/25"
          strokeDasharray="3 4"
        />
        <line
          x1={start.x}
          y1={start.y}
          x2={a.x}
          y2={a.y}
          className="stroke-fg/35"
        />
        <line
          x1={end.x}
          y1={end.y}
          x2={b.x}
          y2={b.y}
          className="stroke-fg/35"
        />
        <path
          d={`M ${start.x} ${start.y} C ${a.x} ${a.y}, ${b.x} ${b.y}, ${end.x} ${end.y}`}
          className="fill-none stroke-fg"
          strokeWidth={2}
          strokeLinecap="round"
        />
        <circle cx={start.x} cy={start.y} r={2.5} className="fill-fg/60" />
        <circle cx={end.x} cy={end.y} r={2.5} className="fill-fg/60" />
      </svg>
      <span id={helpId} className="sr-only">
        Drag to set x from 0 to 1 and y from -1 to 2. Arrow keys move by 0.01,
        with Shift by 0.1.
      </span>
      {([0, 1] as const).map((handle) => (
        <BezierHandle
          key={handle}
          ease={draft}
          handle={handle}
          onDraft={(next) => {
            setDraft(next)
            previewNow(() => onChange(next))
          }}
          onChange={onChange}
          graphRef={ref}
          helpId={helpId}
        />
      ))}
    </div>
  )
}

/** Progress over the spring's whole run: the overshoot, then the settle. */
function springPath(curve: Exclude<Curve, { type: "easing" }>, ms: number) {
  const params = springParams(curve, ms)
  const { ms: settle } = curveTiming(curve, ms)
  const values = Array.from({ length: 101 }, (_, i) =>
    springProgress((i / 100) * (settle / 1000), params),
  )
  const low = Math.min(0, ...values)
  const high = Math.max(1, ...values)
  const y = (v: number) => H * 0.85 - ((v - low) / (high - low)) * H * 0.7
  return {
    d: values
      .map((v, i) => `${i ? "L" : "M"} ${(i / 100) * W} ${y(v)}`)
      .join(" "),
    target: y(1),
  }
}

function SpringGraph({
  curve,
  ms,
}: {
  curve: Exclude<Curve, { type: "easing" }>
  ms: number
}) {
  const { d, target } = springPath(curve, ms)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} aria-hidden className={GRAPH}>
      <line
        x1={0}
        y1={target}
        x2={W}
        y2={target}
        className="stroke-fg/25"
        strokeDasharray="4 4"
      />
      <path
        d={d}
        className="fill-none stroke-fg/80"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** A 16px specimen of a curve, for the row that opens it. */
export function CurveGlyph({ curve }: { curve: Curve }) {
  let d: string
  if (curve.type === "easing") {
    const [x1, y1, x2, y2] = curve.ease
    const p = (x: number, y: number) => `${2 + x * 12} ${14 - y * 12}`
    d = `M${p(0, 0)} C${p(x1, y1)} ${p(x2, y2)} ${p(1, 1)}`
  } else {
    const params = springParams(curve, 300)
    const { ms } = curveTiming(curve, 300)
    d = Array.from({ length: 25 }, (_, i) => {
      const v = springProgress(((i / 24) * ms) / 1000, params)
      return `${i ? "L" : "M"}${2 + (i / 24) * 12} ${14 - v * 12}`
    }).join(" ")
  }
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

/* --------------------------------- Curve ---------------------------------- */

type Mode = Curve["type"]

const MODES = [
  { value: "easing", label: "Easing" },
  { value: "spring", label: "Time" },
  { value: "physics", label: "Physics" },
]

/** The first curve each mode switches to; later switches restore the last
 *  edit in that mode, like DialKit. */
const MODE_DEFAULTS: Record<Mode, Curve> = {
  easing: { type: "easing", ease: [0, 0, 0.2, 1] },
  spring: { type: "spring", bounce: 0.15 },
  physics: { type: "physics", stiffness: 400, damping: 30, mass: 1 },
}

/** DialKit's Ease field: the four control points, committed on blur or Enter. */
function BezierInput({
  ease,
  onChange,
}: {
  ease: Bezier
  onChange: (ease: Bezier) => void
}) {
  const text = ease.join(", ")
  const [draft, setDraft] = useDraft(text)
  const commit = () => {
    const parsed = parseBezier(draft)
    if (parsed) onChange(parsed)
    else setDraft(text)
  }
  return (
    <div className={cn(DIAL_ROW, "pr-1.5")}>
      <span className={DIAL_LABEL}>Bézier</span>
      <RacInput
        aria-label="Bézier control points"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Enter" && commit()}
        spellCheck={false}
        className={cn(
          DIAL_VALUE,
          "h-7 min-w-0 flex-1 rounded-md bg-transparent px-1.5 text-right focus-reset focus-visible:tint-10 focus-visible:text-fg",
        )}
      />
    </div>
  )
}

/** The named curves as chips, then Custom, which reveals the editor in place.
 *  `ms` sizes a time spring's graph; without `springs` it edits a bezier. */
export function CurveField({
  value,
  onChange,
  ms,
  springs,
}: {
  value: Curve
  onChange: (curve: Curve) => void
  ms: number
  springs: boolean
}) {
  const last = useRef<Record<Mode, Curve>>({ ...MODE_DEFAULTS })
  last.current[value.type] = value
  const name = curveName(value)
  const [editing, setEditing] = useState(false)
  const custom = editing || !name
  const presets = CURVES.filter((c) => springs || c.curve.type === "easing")
  return (
    <>
      <DialChips
        label="Curve"
        value={custom ? "custom" : name}
        onChange={(next) => {
          setEditing(next === "custom")
          const named = presets.find((c) => c.value === next)
          if (named) onChange(named.curve)
        }}
        options={[
          ...presets.map((c) => ({ value: c.value, label: c.label })),
          { value: "custom", label: "Custom" },
        ]}
      />
      {custom && (
        <>
          {springs && (
            <DialSegmented
              label="Type"
              value={value.type}
              onChange={(mode) => onChange(last.current[mode as Mode])}
              options={MODES}
            />
          )}
          {value.type === "easing" ? (
            <>
              <BezierEditor
                ease={value.ease}
                onChange={(ease) => onChange({ type: "easing", ease })}
              />
              <BezierInput
                ease={value.ease}
                onChange={(ease) => onChange({ type: "easing", ease })}
              />
            </>
          ) : (
            <SpringGraph curve={value} ms={ms} />
          )}
          {value.type === "spring" && (
            <DialSlider
              label="Bounce"
              value={value.bounce}
              onChange={(bounce) => onChange({ ...value, bounce })}
              minValue={0}
              maxValue={1}
              step={0.05}
              format={(v) => v.toFixed(2)}
            />
          )}
          {value.type === "physics" && (
            <>
              <DialSlider
                label="Stiffness"
                value={value.stiffness}
                onChange={(stiffness) => onChange({ ...value, stiffness })}
                minValue={10}
                maxValue={1000}
                step={10}
                format={String}
              />
              <DialSlider
                label="Damping"
                value={value.damping}
                onChange={(damping) => onChange({ ...value, damping })}
                minValue={1}
                maxValue={100}
                step={1}
                format={String}
              />
              <DialSlider
                label="Mass"
                value={value.mass}
                onChange={(mass) => onChange({ ...value, mass })}
                minValue={0.1}
                maxValue={10}
                step={0.1}
                format={(v) => v.toFixed(1)}
              />
            </>
          )}
        </>
      )}
    </>
  )
}

/** A bezier-only curve field. */
function EaseField({
  value,
  onChange,
  ms,
}: {
  value: Bezier
  onChange: (ease: Bezier) => void
  ms: number
}) {
  return (
    <CurveField
      value={{ type: "easing", ease: value }}
      onChange={(curve) => curve.type === "easing" && onChange(curve.ease)}
      ms={ms}
      springs={false}
    />
  )
}

/* -------------------------------- Composites ------------------------------ */

function DialDuration({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <DialSlider
      label={label}
      value={value}
      onChange={onChange}
      minValue={DURATION_RANGE.min}
      maxValue={DURATION_RANGE.max}
      step={DURATION_RANGE.step}
      format={formatMs}
    />
  )
}

/** One component's entrance: its pattern, then one leg at a time — enter,
 *  exit, and a swipe's release where the component has one. */
export function DialMotion({
  value,
  onChange,
  patterns,
  swipe,
}: {
  value: Entrance
  onChange: (value: Entrance) => void
  patterns: DialOption[]
  swipe?: { value: StateChange; onChange: (value: StateChange) => void }
}) {
  const [phase, setPhase] = useState("enter")
  const set =
    <K extends keyof Entrance>(key: K) =>
    (next: Entrance[K]) =>
      onChange({ ...value, [key]: next })
  const enter = curveTiming(value.curve, value.enter).ms
  const phases: DialOption[] = [
    { value: "enter", label: "In" },
    ...(value.exit !== undefined ? [{ value: "exit", label: "Out" }] : []),
    ...(swipe ? [{ value: "swipe", label: "Swipe" }] : []),
  ]
  const leg = phases.some((p) => p.value === phase) ? phase : "enter"
  return (
    <>
      {patterns.length > 1 && (
        <DialSegmented
          label="Entrance"
          value={value.pattern}
          onChange={set("pattern")}
          options={patterns}
        />
      )}
      {value.pattern !== "none" && (
        <>
          {phases.length > 1 && (
            <DialSegmented
              label="Phase"
              value={leg}
              onChange={setPhase}
              options={phases}
            />
          )}
          {leg === "enter" && (
            <>
              {value.curve.type === "physics" ? (
                <DialRow label="Duration">
                  <span className={DIAL_VALUE}>{formatMs(enter)}</span>
                </DialRow>
              ) : (
                <DialDuration
                  label="Duration"
                  value={value.enter}
                  onChange={set("enter")}
                />
              )}
              <CurveField
                key="enter"
                value={value.curve}
                onChange={set("curve")}
                ms={value.enter}
                springs
              />
            </>
          )}
          {leg === "exit" && value.exit !== undefined && (
            <>
              <DialDuration
                label="Duration"
                value={value.exit}
                onChange={set("exit")}
              />
              {value.exitEase && (
                <EaseField
                  key="exit"
                  value={value.exitEase}
                  onChange={set("exitEase")}
                  ms={value.exit}
                />
              )}
            </>
          )}
          {leg === "swipe" && swipe && (
            <DialStateMotion
              key="swipe"
              label="Duration"
              value={swipe.value}
              onChange={swipe.onChange}
            />
          )}
        </>
      )}
    </>
  )
}

/** A control's state change: how long hover, press and selection take to
 *  settle, and on what curve. */
export function DialStateMotion({
  label,
  value,
  onChange,
}: {
  label: string
  value: StateChange
  onChange: (value: StateChange) => void
}) {
  return (
    <>
      <DialDuration
        label={label}
        value={value.duration}
        onChange={(duration) => onChange({ ...value, duration })}
      />
      <EaseField
        value={value.ease}
        onChange={(ease) => onChange({ ...value, ease })}
        ms={value.duration}
      />
    </>
  )
}

/** A keyframe loop: one cycle's length, and its curve where it has one. */
export function DialLoop({
  label,
  value,
  onChange,
  curve = true,
}: {
  label: string
  value: Loop
  onChange: (value: Loop) => void
  curve?: boolean
}) {
  return (
    <>
      <DialSlider
        label={label}
        value={value.cycle}
        onChange={(cycle) => onChange({ ...value, cycle })}
        minValue={CYCLE_RANGE.min}
        maxValue={CYCLE_RANGE.max}
        step={CYCLE_RANGE.step}
        format={formatMs}
      />
      {curve && (
        <EaseField
          value={value.ease}
          onChange={(ease) => onChange({ ...value, ease })}
          ms={value.cycle}
        />
      )}
    </>
  )
}
