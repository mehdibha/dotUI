import { useLayoutEffect, useRef, useState } from "react"

import { Button } from "@/registry/ui/button"
import { Separator } from "@/registry/ui/separator"
import { PanelPage } from "@/modules/studio/page"
import { CHAPTERS } from "@/modules/studio/state"
import type { StudioState } from "@/modules/studio/state"

import { Mark } from "../../lib/brand"
import { Cursor, cursorAt } from "../../lib/cursor"
import type { CursorKey } from "../../lib/cursor"
import { clamp01, ease, hold } from "../../lib/motion"
import { studioAt } from "../../lib/studio"
import { at } from "../../lib/timing"
import { SET } from "./camera"
import { SearchIcon, SunIcon } from "./deps"
import { PANEL, POPOVER_X, PREVIEW } from "./layout"
import type { Box } from "./measure"
import { boxWithin, findRow, ZERO } from "./measure"
import { PANEL_CSS } from "./panel-css"
import {
  ButtonsBody,
  ColorBody,
  DensityBody,
  FontBody,
  IconBody,
  PopoverSurface,
} from "./popovers"
import { Canvas, Pill } from "./preview"
import {
  CLICKS,
  COLOR_CLOSE,
  COLOR_OPEN,
  COMPONENT_PICKS,
  COMPONENTS_CLOSE,
  COMPONENTS_OPEN,
  DENSITY_CLOSE,
  DENSITY_OPEN,
  DENSITY_PICKS,
  HUE_PRESS,
  HUE_RELEASE,
  hueAt,
  ICON_CLOSE,
  ICON_OPEN,
  ICON_PICK,
  MODE_FLIP,
  RADIUS_PRESS,
  RADIUS_RANGE,
  RADIUS_RELEASE,
  radiusAt,
  stateAt,
  TYPE_CLOSE,
  TYPE_OPEN,
  TYPE_PICKS,
  WIPE_FRAMES,
} from "./timeline"

/* The studio set: the site header, the real panel driven by the frame's
   state, the preview, the panel's popovers (inline), and the cursor.
   Everything the cursor aims at is measured from the DOM each frame, so the
   film follows the panel as it evolves. */

const ROWS = {
  brand: ["color", "Brand"],
  heading: ["typography", "Heading"],
  library: ["icons", "Library"],
  radius: ["shape", "Radius"],
  density: ["space", "Density"],
  buttons: ["components", "Buttons"],
} as const
type RowKey = keyof typeof ROWS

/* Which chapter sits at the top of the panel. It changes while the camera
   is in the preview, so each cut back to the panel finds its row ready. */
const SCROLL: Array<readonly [number, string]> = [
  [0, "color"],
  [at(2) - 8, "typography"],
  [at(3) - 8, "icons"],
  [at(4) - 8, "shape"],
  [at(5) - 8, "space"],
  [at(7) - 8, "components"],
]

interface Layout {
  scroller: Box
  scrollMax: number
  chapters: Record<string, number>
  rows: Partial<Record<RowKey, Box>>
  marks: Record<string, Box>
}

function scrollAt(frame: number, layout: Layout | null) {
  if (!layout) return 0
  const id = hold(frame, SCROLL)
  return Math.round(
    Math.min(
      layout.scrollMax,
      Math.max(0, (layout.chapters[id] ?? 0) - (layout.chapters.color ?? 0)),
    ),
  )
}

/* The panel's popovers: which row opens each, when, and its body. Mounted a
   little before and after they show, so the cursor path can always measure
   them — every frame lays out the same whatever rendered before it. */
const POPOVERS: Array<{
  mark: string
  row: RowKey
  open: number
  close: number
  width?: number
  body: (state: StudioState) => React.ReactNode
}> = [
  {
    mark: "pop-color",
    row: "brand",
    open: COLOR_OPEN,
    close: COLOR_CLOSE,
    width: 256,
    body: (state) => <ColorBody value={state.brand} />,
  },
  {
    mark: "pop-font",
    row: "heading",
    open: TYPE_OPEN,
    close: TYPE_CLOSE,
    body: (state) => <FontBody value={state.headingFont} />,
  },
  {
    mark: "pop-icons",
    row: "library",
    open: ICON_OPEN,
    close: ICON_CLOSE,
    width: 256,
    body: (state) => <IconBody value={state.iconLibrary} />,
  },
  {
    mark: "pop-density",
    row: "density",
    open: DENSITY_OPEN,
    close: DENSITY_CLOSE,
    width: 320,
    body: (state) => <DensityBody state={state} />,
  },
  {
    mark: "pop-buttons",
    row: "buttons",
    open: COMPONENTS_OPEN,
    close: COMPONENTS_CLOSE,
    width: 320,
    body: (state) => <ButtonsBody state={state} />,
  },
]

export function StudioSet({ frame }: { frame: number }) {
  const root = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const [layout, setLayout] = useState<Layout | null>(null)

  const studio = studioAt(stateAt(frame))
  const scrollTop = scrollAt(frame, layout)

  /** A row's box in set px, at the scroll of `atFrame`. */
  const row = (key: RowKey, atFrame = frame): Box => {
    const box = layout?.rows[key]
    if (!layout || !box) return ZERO
    return {
      ...box,
      x: layout.scroller.x + box.x,
      y: layout.scroller.y + box.y - scrollAt(atFrame, layout),
    }
  }
  const mark = (name: string): Box => layout?.marks[name] ?? ZERO

  const path = cursorPath(row, mark)
  const pointer =
    frame >= CURSOR_FROM && frame <= CURSOR_TO ? cursorAt(frame, path) : null
  const pressing = PRESSES.some(([a, b]) => frame >= a - 2 && frame <= b + 2)

  // Every render: layout feeds the cursor and popovers, and settles in a
  // second pass (the state only updates when a reading changed).
  // oxlint-disable-next-line react-hooks/exhaustive-deps -- measures after every render
  useLayoutEffect(() => {
    const scroller = panel.current?.firstElementChild
      ?.firstElementChild as HTMLElement | null
    const set = root.current
    if (!scroller || !set) return
    // Under the camera's CSS zoom, offsets may read in zoomed px.
    const k = set.offsetWidth / SET.w || 1
    const within = (el: HTMLElement, base: HTMLElement) => {
      const b = boxWithin(el, base)
      return { x: b.x / k, y: b.y / k, w: b.w / k, h: b.h / k }
    }
    // Scrolled by transform, not scrollTop: a Suspense reveal inside the
    // theme resets scroll offsets after this effect has run.
    for (const child of [...scroller.children].slice(1))
      (child as HTMLElement).style.transform = `translateY(${-scrollTop}px)`
    const chapters: Layout["chapters"] = {}
    const rows: Layout["rows"] = {}
    for (const section of scroller.querySelectorAll<HTMLElement>(
      "[data-chapter]",
    )) {
      chapters[section.dataset.chapter!] = within(section, scroller).y
    }
    for (const [key, [chapter, label]] of Object.entries(ROWS)) {
      const section = scroller.querySelector(`[data-chapter="${chapter}"]`)
      const found = section && findRow(section, label)
      if (found) rows[key as RowKey] = within(found, scroller)
    }
    const marks: Layout["marks"] = {}
    for (const el of set.querySelectorAll<HTMLElement>("[data-mark]")) {
      marks[el.dataset.mark!] = within(el, set)
    }
    const clicked = CLICKS.some((c) => frame >= c && frame < c + 7)
    hover(set, scroller, scrollTop, pressing ? null : pointer, clicked, within)
    for (const track of scroller.querySelectorAll<HTMLElement>(
      '[role="slider"][aria-label="Radius"]',
    )) {
      if (frame >= RADIUS_PRESS - 4 && frame <= RADIUS_RELEASE + 8)
        track.setAttribute("data-active", "true")
      else track.removeAttribute("data-active")
    }
    const next: Layout = {
      scroller: within(scroller, set),
      scrollMax: (scroller.scrollHeight - scroller.clientHeight) / k,
      chapters,
      rows,
      marks,
    }
    if (JSON.stringify(next) !== JSON.stringify(layout)) setLayout(next)
  })

  // Popover placement: beside the row, kept inside the panel's height. Once
  // closed it stays mounted, hidden and still, so the cursor can still read
  // where its controls were.
  const popover = (key: RowKey, name: string, close: number) => {
    const anchor = row(key, Math.min(frame, close - 1))
    const height = mark(name).h
    const bottom = PANEL.y + PANEL.h
    const y = height ? Math.min(anchor.y - 4, bottom - height) : anchor.y - 4
    return { x: POPOVER_X, y, arrowY: anchor.y + anchor.h / 2 - y }
  }

  const toggle = mark("mode-toggle")
  const origin = [
    toggle.x + toggle.w / 2 - PREVIEW.x,
    toggle.y + toggle.h / 2 - PREVIEW.y,
  ] as const
  // Far enough to reach the pane's farthest corner.
  const reach = Math.hypot(
    Math.max(origin[0], PREVIEW.w - origin[0]),
    Math.max(origin[1], PREVIEW.h - origin[1]),
  )
  const wipe = clamp01((frame - MODE_FLIP) / WIPE_FRAMES)
  const radius = ease.inOut(wipe) * reach
  const dark = frame < MODE_FLIP

  return (
    <div
      ref={root}
      className="absolute top-0 left-0 overflow-hidden rounded-[18px] border border-white/10 bg-bg text-fg"
      style={{ width: SET.w, height: SET.h }}
    >
      <style>{PANEL_CSS}</style>
      <Header />
      <div
        ref={panel}
        className="absolute flex flex-col"
        style={{ left: PANEL.x, top: PANEL.y, width: PANEL.w, height: PANEL.h }}
      >
        <PanelPage chapters={CHAPTERS} studio={studio} />
      </div>
      <div
        className="absolute isolate overflow-hidden rounded-xl border border-border/45 bg-bg shadow-xs"
        style={{
          left: PREVIEW.x,
          top: PREVIEW.y,
          width: PREVIEW.w,
          height: PREVIEW.h,
        }}
      >
        {wipe < 1 && <Canvas frame={frame} mode="dark" />}
        {!dark && (
          <div
            className="absolute inset-0"
            style={{
              clipPath:
                wipe < 1
                  ? `circle(${radius}px at ${origin[0]}px ${origin[1]}px)`
                  : undefined,
            }}
          >
            <Canvas frame={frame} mode="light" />
          </div>
        )}
        {!dark && wipe < 1 && (
          <div
            className="pointer-events-none absolute rounded-full"
            style={{
              left: origin[0] - radius,
              top: origin[1] - radius,
              width: 2 * radius,
              height: 2 * radius,
              boxShadow: `0 0 0 1.5px rgba(255,255,255,${0.7 * (1 - wipe)}), 0 0 32px 2px rgba(255,255,255,${0.14 * (1 - wipe)})`,
            }}
          />
        )}
        <Pill dark={dark} />
      </div>

      {POPOVERS.filter((p) => frame >= p.open - 30 && frame < p.close + 50).map(
        (p) => (
          <PopoverSurface
            key={p.mark}
            mark={p.mark}
            hidden={frame < p.open || frame >= p.close}
            width={p.width ?? row(p.row).w}
            className={p.width ? undefined : "p-0"}
            {...popover(p.row, p.mark, p.close)}
          >
            {p.body(studio.state)}
          </PopoverSurface>
        ),
      )}

      <div className="pointer-events-none absolute inset-0 z-40">
        <RadiusHandle frame={frame} row={row("radius")} />
        <Cursor
          path={path}
          from={CURSOR_FROM}
          to={CURSOR_TO}
          // Larger in the light & dark wide, where the set is small.
          size={frame >= at(6) && frame < at(7) ? 1.5 : 0.82}
          clicks={CLICKS}
          presses={PRESSES}
        />
      </div>
    </div>
  )
}

const CURSOR_FROM = at(0, 3)
const CURSOR_TO = at(7, 3.3)

const PRESSES = [
  [HUE_PRESS, HUE_RELEASE],
  [RADIUS_PRESS, RADIUS_RELEASE],
] as const

/** Marks the control under the synthetic cursor hovered, as a pointer would. */
function hover(
  set: HTMLElement,
  scroller: HTMLElement,
  scroll: number,
  point: readonly [number, number] | null,
  pressed: boolean,
  within: (el: HTMLElement, base: HTMLElement) => Box,
) {
  for (const el of set.querySelectorAll("[data-film-hover]")) {
    el.removeAttribute("data-film-hover")
    el.removeAttribute("data-hovered")
    el.removeAttribute("data-pressed")
  }
  if (!point) return
  const [px, py] = point
  const scrollerBox = within(scroller, set)
  const candidates: Array<{ el: Element; box: Box }> = []
  for (const el of set.querySelectorAll<HTMLElement>(
    '[data-mark^="pop-"]:not([data-hidden]) [data-rac], [data-mark="mode-toggle"] [data-rac]',
  )) {
    candidates.push({ el, box: within(el, set) })
  }
  for (const el of scroller.querySelectorAll<HTMLElement>(
    "[data-chapter] button[data-rac]",
  )) {
    const box = within(el, scroller)
    candidates.push({
      el,
      box: {
        ...box,
        x: box.x + scrollerBox.x,
        y: box.y + scrollerBox.y - scroll,
      },
    })
  }
  const hit = candidates
    .filter(
      ({ box }) =>
        px >= box.x &&
        px <= box.x + box.w &&
        py >= box.y &&
        py <= box.y + box.h,
    )
    .sort((a, b) => a.box.w * a.box.h - b.box.w * b.box.h)[0]
  hit?.el.setAttribute("data-hovered", "true")
  hit?.el.setAttribute("data-film-hover", "")
  if (pressed) hit?.el.setAttribute("data-pressed", "true")
}

/** The slider's 3×20 handle, shown while the Radius row is held. */
function RadiusHandle({ frame, row }: { frame: number; row: Box }) {
  if (frame < RADIUS_PRESS - 4 || frame > RADIUS_RELEASE + 10 || !row.w)
    return null
  const t =
    (radiusAt(frame) - RADIUS_RANGE.min) / (RADIUS_RANGE.max - RADIUS_RANGE.min)
  const x = row.x + Math.max(5, t * row.w - 9)
  const show =
    clamp01((frame - (RADIUS_PRESS - 4)) / 6) *
    (1 - clamp01((frame - RADIUS_RELEASE) / 10))
  return (
    <div
      className="absolute rounded-full bg-fg/90"
      style={{
        left: x,
        top: row.y + row.h / 2 - 10,
        width: 3,
        height: 20,
        opacity: 0.9 * show,
      }}
    />
  )
}

function Header() {
  return (
    <div className="absolute inset-x-0 top-0 flex h-14 items-center justify-between pr-4 pl-6">
      <div className="flex items-center gap-6">
        <Mark size={20} />
        <nav className="flex items-center gap-3 text-sm">
          <span className="px-0.5 text-fg-muted">Docs</span>
          <span className="px-0.5 text-fg-muted">Components</span>
          <span className="px-0.5 text-fg">Studio</span>
        </nav>
      </div>
      <div className="flex items-center gap-0.5">
        <Button variant="quiet" isIconOnly aria-label="Search">
          <SearchIcon />
        </Button>
        <Button variant="quiet" isIconOnly aria-label="Theme">
          <SunIcon />
        </Button>
        <Separator orientation="vertical" className="mx-1.5 h-4" />
        <Button variant="primary" size="sm">
          Export
        </Button>
      </div>
    </div>
  )
}

/* ------------------------------ Cursor path ------------------------------ */

type Point = readonly [number, number]

function cursorPath(
  row: (key: RowKey, atFrame?: number) => Box,
  mark: (name: string) => Box,
): CursorKey[] {
  // Rows are aimed at their value side, where a hand would go.
  const onRow = (key: RowKey, f: number, inset = 56): Point => {
    const b = row(key, f)
    return [b.x + b.w - inset, b.y + b.h / 2]
  }
  const onMark = (name: string, dx = 0.5, dy = 0.5): Point => {
    const b = mark(name)
    return [b.x + b.w * dx, b.y + b.h * dy]
  }
  const hueThumb = (f: number): Point => {
    const b = mark("hue")
    const h = ((hueAt(f) % 360) + 360) % 360
    return [b.x + (h / 360) * b.w, b.y + b.h / 2]
  }
  const radiusThumb = (f: number): Point => {
    const b = row("radius", f)
    const t =
      (radiusAt(f) - RADIUS_RANGE.min) / (RADIUS_RANGE.max - RADIUS_RANGE.min)
    return [b.x + t * b.w, b.y + b.h / 2]
  }
  const key = (f: number, [x, y]: Point): CursorKey => [f, x, y]
  const follow = (from: number, to: number, fn: (f: number) => Point) =>
    Array.from({ length: to - from + 1 }, (_, i) => key(from + i, fn(from + i)))
  /** Arrive on `p` a little before `f`, and stay through the click. */
  const clickOn = (f: number, p: Point, lead = 8): CursorKey[] => [
    key(f - lead, p),
    key(f + 3, p),
  ]

  const [TYPE_A, TYPE_B] = TYPE_PICKS
  const [DENSITY_A, DENSITY_B] = DENSITY_PICKS
  const [STYLE_PICK, RADIUS_PICK] = COMPONENT_PICKS
  const toggle = onMark("mode-toggle")
  return [
    key(CURSOR_FROM, [PANEL.x + PANEL.w + 180, PANEL.y + 360]),
    ...clickOn(COLOR_OPEN, onRow("brand", COLOR_OPEN), 12),
    key(HUE_PRESS - 4, hueThumb(HUE_PRESS)),
    ...follow(HUE_PRESS, HUE_RELEASE, hueThumb),
    ...clickOn(TYPE_OPEN, onRow("heading", TYPE_OPEN), 4),
    ...clickOn(TYPE_A[0], onMark(`font:${TYPE_A[1]}`, 0.35), 12),
    ...clickOn(TYPE_B[0], onMark(`font:${TYPE_B[1]}`, 0.35), 12),
    ...clickOn(ICON_OPEN, onRow("library", ICON_OPEN), 4),
    ...clickOn(ICON_PICK, onMark("icon:phosphor", 0.3), 12),
    key(RADIUS_PRESS - 4, radiusThumb(RADIUS_PRESS)),
    ...follow(RADIUS_PRESS, RADIUS_RELEASE, radiusThumb),
    ...clickOn(DENSITY_OPEN, onRow("density", DENSITY_OPEN), 4),
    ...clickOn(DENSITY_A[0], onMark(`density:${DENSITY_A[1]}`), 12),
    // Back to the row: the second pick lands while the camera is away.
    key(DENSITY_A[0] + 20, onRow("density", DENSITY_B[0], 90)),
    key(at(6) - 2, [toggle[0] - 150, toggle[1] - 110]),
    ...clickOn(MODE_FLIP, toggle, 10),
    key(at(6, 2.6), [toggle[0] + 40, toggle[1] - 70]),
    ...clickOn(COMPONENTS_OPEN, onRow("buttons", COMPONENTS_OPEN), 4),
    ...clickOn(STYLE_PICK[0], onMark(`button:${STYLE_PICK[2]}`), 12),
    ...clickOn(RADIUS_PICK[0], onMark("button-radius", 0.86, 0.72), 12),
    key(CURSOR_TO, [PANEL.x + PANEL.w + 300, PANEL.y + 420]),
  ]
}
