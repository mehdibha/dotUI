import { AbsoluteFill, Easing, useCurrentFrame } from "remotion"

import { cn } from "@/registry/lib/utils"
import { componentDemos } from "@/modules/docs/components-list/demos"
import { componentsData } from "@/modules/docs/components-list/components-data"

import { ease, keys, lerp, progress } from "../lib/motion"
import { preset, Theme, WarmIcons } from "../lib/theme"
import { BAR, BEAT } from "../lib/timing"
import { Caption, H, W, YOURS } from "./shared"

/* Every component: the docs components page (www docs/components-list), its
   cards wearing the design system just made while the docs chrome keeps the
   site theme. The camera starts at the foot of the page, glides up the whole
   of it, faster then slower, lands on Button at the top and pushes into it.
   Laid out by hand at the page's own sizes so only the rows in view mount. */

export const CATALOG_FRAMES = BAR * 2

/** No charts: their colors are being rewritten. */
const CATEGORIES = componentsData.filter((c) => c.slug !== "charts")

const PAGE_X = 50
const PAGE_W = W - 2 * PAGE_X
const COLS = 3
const GAP_X = 24
const GAP_Y = 32
const CARD_W = (PAGE_W - GAP_X * (COLS - 1)) / COLS
const STAGE_H = 192
const ITEM_H = STAGE_H + 12 + 24
const TITLE_H = 150
/** An h2 (mt-12, text-2xl) and the grid's mt-6. */
const HEADING_H = 48 + 32 + 24

type Placed =
  | { kind: "heading"; y: number; title: string }
  | {
      kind: "card"
      x: number
      y: number
      info: (typeof CATEGORIES)[number]["components"][number]
    }

const PLACED: Placed[] = []
let PAGE_H = TITLE_H
for (const category of CATEGORIES) {
  PLACED.push({ kind: "heading", y: PAGE_H + 48, title: category.title })
  PAGE_H += HEADING_H
  category.components.forEach((info, i) => {
    const row = Math.floor(i / COLS)
    PLACED.push({
      kind: "card",
      x: PAGE_X + (i % COLS) * (CARD_W + GAP_X),
      y: PAGE_H + row * (ITEM_H + GAP_Y),
      info,
    })
  })
  const rows = Math.ceil(category.components.length / COLS)
  PAGE_H += rows * ITEM_H + (rows - 1) * GAP_Y
}
PAGE_H += 64

/** The card the camera lands on, and where its center settles in frame
    (above the line). */
const TARGET = PLACED.find(
  (p): p is Extract<Placed, { kind: "card" }> =>
    p.kind === "card" && p.info.slug === "button",
)!
const LAND_AT = H * 0.4

/** The camera's top edge on the page and its zoom, at `frame`. */
function camera(frame: number) {
  const land = TARGET.y + STAGE_H / 2 - LAND_AT
  const glide = progress(frame, BEAT, BEAT * 5.5, GLIDE)
  const y = lerp(PAGE_H - H, land, glide)
  const zoom = keys(
    frame,
    [
      [BEAT * 6, 1],
      [CATALOG_FRAMES, 1.35],
    ],
    ease.out,
  )
  return { y, zoom }
}

/** The glide: a slow start, a fast middle, a long settle. */
const GLIDE = Easing.bezier(0.7, 0, 0.12, 1)

function Card({ info }: { info: Extract<Placed, { kind: "card" }>["info"] }) {
  const Demo = componentDemos[info.slug]
  const content = Demo ? (
    <Demo />
  ) : (
    <span className="text-sm text-fg-muted">{info.name}</span>
  )
  return (
    <div className="flex flex-col items-center gap-3">
      <Theme state={preset(YOURS)}>
        <div className="relative h-48 w-full overflow-hidden rounded-lg border bg-bg">
          {info.fill ? (
            <div inert className="absolute inset-0">
              {content}
            </div>
          ) : (
            <div className="absolute inset-4 flex items-center justify-center overflow-hidden">
              <div
                inert
                className={cn(
                  "flex items-center justify-center",
                  info.stretch && "w-full",
                )}
                style={
                  info.stretch
                    ? undefined
                    : { transform: `scale(${info.scale ?? 1})` }
                }
              >
                {content}
              </div>
            </div>
          )}
        </div>
      </Theme>
      <span className="text-base font-medium text-fg">{info.name}</span>
    </div>
  )
}

export function Catalog() {
  const frame = useCurrentFrame()
  const { y, zoom } = camera(frame)
  // Zoom about the target card's center, where the glide lands it.
  const ox = TARGET.x + CARD_W / 2
  const oy = y + LAND_AT
  const top = y - H / 2
  const bottom = y + H + H / 2
  return (
    <AbsoluteFill>
      <WarmIcons />
      <Theme mode="dark">
        <AbsoluteFill className="bg-bg" style={{ overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: W,
              height: PAGE_H,
              transformOrigin: `${ox}px ${oy}px`,
              transform: `translateY(${-y}px) scale(${zoom})`,
            }}
          >
            {y < TITLE_H + H && (
              <div style={{ position: "absolute", left: PAGE_X, top: 48 }}>
                <h1 className="text-3xl font-semibold text-fg">Components</h1>
                <p className="mt-2 text-lg text-fg-muted">
                  Browse every component in the library, styled to match your
                  design system.
                </p>
              </div>
            )}
            {PLACED.map((p) => {
              const h = p.kind === "card" ? ITEM_H : 32
              if (p.y + h < top || p.y > bottom) return null
              return p.kind === "heading" ? (
                <h2
                  key={p.title}
                  className="text-2xl font-semibold text-fg"
                  style={{ position: "absolute", left: PAGE_X, top: p.y }}
                >
                  {p.title}
                </h2>
              ) : (
                <div
                  key={p.info.slug}
                  style={{
                    position: "absolute",
                    left: p.x,
                    top: p.y,
                    width: CARD_W,
                  }}
                >
                  <Card info={p.info} />
                </div>
              )
            })}
          </div>
          <Caption frame={frame} lines={[[BEAT * 2, "Every component."]]} />
        </AbsoluteFill>
      </Theme>
    </AbsoluteFill>
  )
}
