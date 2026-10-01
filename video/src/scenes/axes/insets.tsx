import { useLayoutEffect, useRef, useState } from "react"
import type { ReactNode } from "react"

import { DialSlider } from "@/modules/studio/dial"

import { Cursor, cursorAt } from "../../lib/cursor"
import type { CursorKey } from "../../lib/cursor"
import { ease, progress, springAt } from "../../lib/motion"
import { Theme } from "../../lib/theme"
import type { Box } from "./measure"
import { boxWithin, ZERO } from "./measure"
import { PANEL_CSS } from "./panel-css"
import { ButtonsBody, PopoverSurface } from "./popovers"
import {
  COMPONENT_PICKS,
  COMPONENTS_CLOSE,
  COMPONENTS_OPEN,
  RADIUS_PRESS,
  RADIUS_RANGE,
  RADIUS_RELEASE,
  radiusAt,
  stateAt,
} from "./timeline"

/* Panel controls composited over a macro, in screen space under the label:
   the bars that skip the panel shot still show the hand that made the
   change. Each is the real control at `zoom`, with its own cursor. */

const LEFT = 112
const TOP = 262
const EXIT = 9

const ROW_W = 256
const RADIUS_OUT = RADIUS_RELEASE + 16
const POP_W = 320

/* The Radius inset's ground: a clean band of ink down the left of the
   macro, so the label and the row sit clear of the cards under them. */
export function Band({ frame }: { frame: number }) {
  if (frame < RADIUS_PRESS || frame >= RADIUS_OUT + 14) return null
  // Already down on the cut; it lifts as the inset leaves.
  const opacity = 1 - progress(frame, RADIUS_OUT, 14, ease.inOut)
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        background:
          "linear-gradient(90deg, rgba(8,8,10,0.97) 0%, rgba(8,8,10,0.97) 27%, rgba(8,8,10,0.6) 34%, rgba(8,8,10,0.18) 39%, transparent 42%)",
      }}
    />
  )
}

const noop = () => {}
const px = (value: number) => `${Math.round(value * 10) / 10}px`

function Inset({
  frame,
  open,
  close,
  zoom,
  width,
  children,
}: {
  frame: number
  open: number
  close: number
  zoom: number
  width: number
  children: ReactNode
}) {
  if (frame < open || frame >= close + EXIT) return null
  // On screen from the cut, settling into place; out fast, as a popover
  // closes, so it never hangs half-transparent over the cards.
  const enter = springAt(frame, open, "snappy")
  const exit = progress(frame, close, EXIT, ease.in)
  return (
    <div
      style={{
        position: "absolute",
        left: LEFT,
        top: TOP,
        opacity: 1 - exit,
        transform: `translateY(${(1 - enter) * 12}px) scale(${0.97 + 0.03 * enter - 0.04 * exit})`,
        transformOrigin: "0 0",
      }}
    >
      {/* Zoom on an inner box: on the positioned one it would scale left/top. */}
      <div style={{ width, zoom }}>
        <Theme mode="dark">
          <style>{PANEL_CSS}</style>
          {children}
        </Theme>
      </div>
    </div>
  )
}

/** `[data-mark]` boxes under `root`, in its own (unzoomed) px. */
function useMarks(width: number) {
  const root = useRef<HTMLDivElement>(null)
  const [marks, setMarks] = useState<Record<string, Box>>({})
  // oxlint-disable-next-line react-hooks/exhaustive-deps -- measures after every render
  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const k = el.offsetWidth / width || 1
    const next: Record<string, Box> = {}
    for (const m of el.querySelectorAll<HTMLElement>("[data-mark]")) {
      const b = boxWithin(m, el)
      next[m.dataset.mark!] = { x: b.x / k, y: b.y / k, w: b.w / k, h: b.h / k }
    }
    if (JSON.stringify(next) !== JSON.stringify(marks)) setMarks(next)
  })
  return [root, (name: string) => marks[name] ?? ZERO] as const
}

/* ------------------------------ Radius ------------------------------ */

/** The Radius row, held and dragged: the real DialSlider at the frame's
 *  value, its handle and ticks shown as they are under a pressed pointer. */
export function RadiusInset({ frame }: { frame: number }) {
  const slider = useRef<HTMLDivElement>(null)
  // oxlint-disable-next-line react-hooks/exhaustive-deps -- every render
  useLayoutEffect(() => {
    slider.current
      ?.querySelector('[role="slider"]')
      ?.setAttribute("data-active", "true")
  })
  const thumb = (f: number): CursorKey => {
    const t =
      (radiusAt(f) - RADIUS_RANGE.min) / (RADIUS_RANGE.max - RADIUS_RANGE.min)
    return [f, 8 + Math.max(5, t * ROW_W - 9) + 1.5, 8 + 18]
  }
  const path: CursorKey[] = [
    ...Array.from({ length: RADIUS_RELEASE - RADIUS_PRESS + 1 }, (_, i) =>
      thumb(RADIUS_PRESS + i),
    ),
    [RADIUS_OUT, thumb(RADIUS_RELEASE)[1] + 26, 40],
  ]
  return (
    <Inset
      frame={frame}
      open={RADIUS_PRESS}
      close={RADIUS_OUT}
      zoom={2.3}
      width={ROW_W + 16}
    >
      <div
        ref={slider}
        className="film-radius relative rounded-[14px] border border-fg/12 bg-card p-2 text-fg shadow-2xl"
      >
        <style>{`.film-radius [role="slider"] > div:nth-of-type(3) { opacity: 0.9 !important; scale: 1 !important; }`}</style>
        <DialSlider
          label="Radius"
          value={radiusAt(frame)}
          onChange={noop}
          minValue={RADIUS_RANGE.min}
          maxValue={RADIUS_RANGE.max}
          step={RADIUS_RANGE.step}
          format={px}
        />
        <div className="pointer-events-none absolute inset-0">
          <Cursor
            path={path}
            from={RADIUS_PRESS}
            to={RADIUS_OUT}
            size={0.72}
            presses={[[RADIUS_PRESS, RADIUS_RELEASE]]}
          />
        </div>
      </div>
    </Inset>
  )
}

/* ----------------------------- Components ----------------------------- */

/** The Buttons popover — Style cards and the Radius segments — picked
 *  Raised on beat 1 and Pill on beat 2. */
export function ButtonsInset({ frame }: { frame: number }) {
  const [root, mark] = useMarks(POP_W)
  const [STYLE_PICK, RADIUS_PICK] = COMPONENT_PICKS
  const on = (name: string, dx = 0.5, dy = 0.5) => {
    const b = mark(name)
    return [b.x + b.w * dx, b.y + b.h * dy] as const
  }
  // The option's label row, just above its specimen.
  const raised = on(`button:${STYLE_PICK[2]}`, 0.36, -0.55)
  const pill = on("button-radius", 0.86, 0.72)
  const path: CursorKey[] = [
    [COMPONENTS_OPEN, raised[0] + 120, raised[1] - 150],
    [STYLE_PICK[0] - 12, ...raised],
    [STYLE_PICK[0] + 3, ...raised],
    [RADIUS_PICK[0] - 12, ...pill],
    [RADIUS_PICK[0] + 3, ...pill],
    [COMPONENTS_CLOSE, pill[0] + 30, pill[1] + 40],
  ]
  const clicked = [STYLE_PICK[0], RADIUS_PICK[0]].some(
    (c) => frame >= c && frame < c + 7,
  )
  // Hover (and press) the option under the pointer, as a real one would.
  // oxlint-disable-next-line react-hooks/exhaustive-deps -- every render
  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const k = el.offsetWidth / POP_W || 1
    for (const item of el.querySelectorAll("[data-film-hover]")) {
      item.removeAttribute("data-film-hover")
      item.removeAttribute("data-hovered")
      item.removeAttribute("data-pressed")
    }
    const [x, y] = cursorAt(frame, path)
    const hit = [...el.querySelectorAll<HTMLElement>("[data-rac]")]
      .map((item) => {
        const b = boxWithin(item, el)
        return { item, x: b.x / k, y: b.y / k, w: b.w / k, h: b.h / k }
      })
      .filter((b) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h)
      .sort((a, b) => a.w * a.h - b.w * b.h)[0]?.item
    hit?.setAttribute("data-film-hover", "")
    hit?.setAttribute("data-hovered", "true")
    if (clicked) hit?.setAttribute("data-pressed", "true")
  })
  return (
    <Inset
      frame={frame}
      open={COMPONENTS_OPEN}
      close={COMPONENTS_CLOSE}
      zoom={1.9}
      width={POP_W}
    >
      <div ref={root} className="relative" style={{ width: POP_W }}>
        <PopoverSurface
          mark="pop-buttons"
          x={0}
          y={0}
          width={POP_W}
          className="shadow-2xl"
        >
          <ButtonsBody state={stateAt(frame)} />
        </PopoverSurface>
        <div className="pointer-events-none absolute inset-0 z-40">
          <Cursor
            path={path}
            from={COMPONENTS_OPEN}
            to={COMPONENTS_CLOSE}
            size={0.72}
            clicks={[STYLE_PICK[0], RADIUS_PICK[0]]}
          />
        </div>
      </div>
    </Inset>
  )
}
