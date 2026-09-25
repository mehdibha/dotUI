/* Motion — the studio's shared vocabulary; nothing here ships. Each animated
   component owns its motion: builder-only `--studio-<id>-*` vars declared in
   its styles.css `:root`, read by `duration-(…)` / `ease-(…)` classes that
   the publisher resolves to plain utilities (`duration-200`, `ease-out`,
   `ease-[cubic-bezier(…)]`, `ease-[linear(…)]`).

   A component axis keeps one `<name>Motion` state key — an Entrance (a
   floating layer: its pattern param plus in/out timing), a StateChange
   (hover, press, selection) or a Loop (a keyframe animation repeating while
   something loads) — and resolves it with `resolveEntrance` /
   `resolveStateChange` / `resolveLoop`, which write only the vars that
   leave the defaults.
   Curves follow DialKit's transition modes: a cubic bezier, a spring timed
   by its visual duration and bounce, or a spring by its physics. Springs
   ship as `linear()` over their settle time; exits never spring. */

import { pick } from "./pick"

export type Bezier = [number, number, number, number]

export type Curve =
  | { type: "easing"; ease: Bezier }
  /** Motion's time spring: settles around the duration it's given. */
  | { type: "spring"; bounce: number }
  /** A physical spring: its duration is however long it takes to settle. */
  | { type: "physics"; stiffness: number; damping: number; mass: number }

/** A floating layer's entrance: the pattern param, then in/out timing in ms.
 *  `exit` / `exitEase` are absent where the component has no exit leg. */
export interface Entrance {
  pattern: string
  enter: number
  curve: Curve
  exit?: number
  exitEase?: Bezier
}

/** A control's state change: hover, press, selection. */
export interface StateChange {
  duration: number
  ease: Bezier
}

/** A keyframe loop — a spinner's turn, a skeleton's pulse: one cycle's
 *  length in ms and its curve. */
export interface Loop {
  cycle: number
  ease: Bezier
}

export const DURATION_RANGE = { min: 0, max: 1000, step: 10 }
export const CYCLE_RANGE = { min: 200, max: 4000, step: 50 }

const easing = (ease: Bezier): Curve => ({ type: "easing", ease })

/* Named curves. `ease` is CSS's keyword (shadcn's tw-animate default);
   ease-out / ease-in / ease-in-out / linear are Tailwind's (the publisher
   ships them by name); emphasized is Material 3's; fluid is the iOS sheet. */
export const CURVES: { value: string; label: string; curve: Curve }[] = [
  { value: "ease", label: "Ease", curve: easing([0.25, 0.1, 0.25, 1]) },
  { value: "ease-out", label: "Ease out", curve: easing([0, 0, 0.2, 1]) },
  {
    value: "ease-in-out",
    label: "Ease in out",
    curve: easing([0.4, 0, 0.2, 1]),
  },
  { value: "ease-in", label: "Ease in", curve: easing([0.4, 0, 1, 1]) },
  { value: "linear", label: "Linear", curve: easing([0, 0, 1, 1]) },
  {
    value: "emphasized",
    label: "Emphasized",
    curve: easing([0.05, 0.7, 0.1, 1]),
  },
  { value: "snappy", label: "Snappy", curve: easing([0.23, 1, 0.32, 1]) },
  { value: "fluid", label: "Fluid", curve: easing([0.32, 0.72, 0, 1]) },
  { value: "spring", label: "Spring", curve: { type: "spring", bounce: 0.15 } },
  { value: "bouncy", label: "Bouncy", curve: { type: "spring", bounce: 0.35 } },
]

/** A named bezier's control points. */
export function ease(name: string): Bezier {
  const named = CURVES.find((c) => c.value === name)?.curve
  if (named?.type !== "easing") throw new Error(`No bezier named ${name}`)
  return named.ease
}

/** The named curve a value matches, or undefined for a custom one. */
export function curveName(value: Curve): string | undefined {
  const key = JSON.stringify(value)
  return CURVES.find((c) => JSON.stringify(c.curve) === key)?.value
}

/** Tailwind's own transition timing: ships no duration or ease class. */
export const TAILWIND_TIMING: StateChange = {
  duration: 150,
  ease: ease("ease-in-out"),
}

/* --------------------------------- Springs -------------------------------- */

export interface SpringParams {
  stiffness: number
  damping: number
  mass: number
}

/** A spring's physics; a time spring maps the way Motion's generator does. */
export function springParams(
  value: Exclude<Curve, { type: "easing" }>,
  visualMs: number,
): SpringParams {
  if (value.type === "physics") return value
  const root = (2 * Math.PI) / ((Math.max(50, visualMs) / 1000) * 1.2)
  const stiffness = root * root
  const damping =
    2 * Math.min(1, Math.max(0.05, 1 - value.bounce)) * Math.sqrt(stiffness)
  return { stiffness, damping, mass: 1 }
}

/** Normalized position `t` seconds from rest; overshoots when bouncy. */
export function springProgress(
  t: number,
  { stiffness, damping, mass }: SpringParams,
): number {
  if (t <= 0) return 0
  const w0 = Math.sqrt(stiffness / mass)
  const zeta = damping / (2 * Math.sqrt(stiffness * mass))
  if (zeta < 0.9999) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta)
    return (
      1 -
      Math.exp(-zeta * w0 * t) *
        (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t))
    )
  }
  if (zeta < 1.0001) return 1 - Math.exp(-w0 * t) * (1 + w0 * t)
  const wd = w0 * Math.sqrt(zeta * zeta - 1)
  const r1 = -zeta * w0 + wd
  const r2 = -zeta * w0 - wd
  return 1 + (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r1 - r2)
}

/** Milliseconds until the spring stays within 0.1% of rest, to 10ms. */
export function springSettleMs(params: SpringParams): number {
  let last = 0
  for (let ms = 0; ms <= 5000; ms += 5)
    if (Math.abs(1 - springProgress(ms / 1000, params)) > 0.001) last = ms
  return Math.ceil((last + 5) / 10) * 10
}

/** The samples between `from` and `to` a straight line between them
 *  wouldn't draw (Ramer–Douglas–Peucker). */
function keep(
  ys: number[],
  from: number,
  to: number,
  tolerance: number,
): number[] {
  const y0 = ys[from] ?? 0
  const y1 = ys[to] ?? 0
  let worst = 0
  let at = 0
  for (let i = from + 1; i < to; i++) {
    const line = y0 + ((y1 - y0) * (i - from)) / (to - from)
    const off = Math.abs((ys[i] ?? 0) - line)
    if (off > worst) [worst, at] = [off, i]
  }
  if (worst <= tolerance) return []
  return [...keep(ys, from, at, tolerance), at, ...keep(ys, at, to, tolerance)]
}

/** The spring over `ms` as CSS `linear()`, sampled at every percent. */
export function springLinear(params: SpringParams, ms: number): string {
  const ys = Array.from({ length: 101 }, (_, i) =>
    springProgress((i / 100) * (ms / 1000), params),
  )
  const stops = keep(ys, 0, 100, 0.005).map(
    (i) => `${Number((ys[i] ?? 0).toFixed(3))} ${i}%`,
  )
  return `linear(${["0", ...stops, "1"].join(", ")})`
}

/* ---------------------------------- CSS ----------------------------------- */

export function bezierCss([x1, y1, x2, y2]: Bezier): string {
  return x1 === 0 && y1 === 0 && x2 === 1 && y2 === 1
    ? "linear"
    : `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`
}

/** A curve over `ms` in CSS terms; a spring runs for its settle time. */
export function curveTiming(value: Curve, ms: number) {
  if (value.type === "easing") return { ease: bezierCss(value.ease), ms }
  const params = springParams(value, ms)
  const settle = springSettleMs(params)
  return { ease: springLinear(params, settle), ms: settle }
}

/** Every var an entrance writes, under `--studio-<id>-`. */
export function entranceVars(id: string, value: Entrance) {
  const enter = curveTiming(value.curve, value.enter)
  const vars: Record<string, string> = {
    [`--studio-${id}-enter-duration`]: `${enter.ms}ms`,
    [`--studio-${id}-ease`]: enter.ease,
  }
  if (value.exit !== undefined)
    vars[`--studio-${id}-exit-duration`] = `${value.exit}ms`
  if (value.exitEase)
    vars[`--studio-${id}-exit-ease`] = bezierCss(value.exitEase)
  return vars
}

export function stateChangeVars(id: string, value: StateChange) {
  return {
    [`--studio-${id}-state-duration`]: `${value.duration}ms`,
    [`--studio-${id}-state-ease`]: bezierCss(value.ease),
  }
}

export function loopVars(id: string, value: Loop) {
  return {
    [`--studio-${id}-loop-duration`]: `${value.cycle}ms`,
    [`--studio-${id}-loop-ease`]: bezierCss(value.ease),
  }
}

/* --------------------------------- Resolve -------------------------------- */

/** The vars that leave the defaults: an untouched system writes none. */
function changed(vars: Record<string, string>, base: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(vars).filter(([name, value]) => base[name] !== value),
  )
}

const isNumber = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v)
const isBezier = (v: unknown): v is Bezier =>
  Array.isArray(v) && v.length === 4 && v.every(isNumber)
function isCurve(v: unknown): v is Curve {
  const c = v as Record<string, unknown> | null
  if (c?.type === "easing") return isBezier(c.ease)
  if (c?.type === "spring") return isNumber(c.bounce)
  return (
    c?.type === "physics" &&
    [c.stiffness, c.damping, c.mass].every((n) => isNumber(n) && n > 0)
  )
}

/* The preset codec only checks a stored value's top-level type, so each
   field falls back to its default unless it has the default's shape. */
function sanitize<T extends object>(value: unknown, defaults: T): T {
  const stored = (value ?? {}) as Record<string, unknown>
  const out = { ...defaults } as Record<string, unknown>
  for (const [key, fallback] of Object.entries(defaults)) {
    const v = stored[key]
    const ok = isBezier(fallback)
      ? isBezier(v)
      : typeof fallback === "object"
        ? isCurve(v)
        : typeof fallback === "number"
          ? isNumber(v) && v >= 0
          : typeof v === typeof fallback
    if (ok) out[key] = v
  }
  return out as T
}

/** An entrance's `--studio-<id>-*` tokens and its pattern param. */
export function resolveEntrance(
  id: string,
  value: Entrance,
  defaults: Entrance,
  patterns: { value: string }[],
) {
  const entrance = sanitize(value, defaults)
  return {
    tokens: changed(entranceVars(id, entrance), entranceVars(id, defaults)),
    pattern: pick(patterns, entrance.pattern, defaults.pattern),
  }
}

/** A state change's `--studio-<id>-state-*` tokens. */
export function resolveStateChange(
  id: string,
  value: StateChange,
  defaults: StateChange,
) {
  return changed(
    stateChangeVars(id, sanitize(value, defaults)),
    stateChangeVars(id, defaults),
  )
}

/** A keyframe loop's `--studio-<id>-loop-*` tokens. */
export function resolveLoop(id: string, value: Loop, defaults: Loop) {
  return changed(
    loopVars(id, sanitize(value, defaults)),
    loopVars(id, defaults),
  )
}
