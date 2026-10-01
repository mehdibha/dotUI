import { Easing } from "remotion"

import { FileCodeIcon } from "@/registry/icons"

import { clamp01, ease, lerp, progress, random } from "../../lib/motion"
import {
  C,
  DEPART_AT,
  DESCEND,
  EDITOR,
  FILES,
  FLY_AT,
  RISE,
  SANS,
  SLOT,
  T,
  TERM,
  TREE,
} from "./data"
import {
  editorPose,
  landAt,
  onScreen,
  terminalFileAnchor,
  terminalPose,
  treeFileAnchor,
} from "./layout"

/* Each "Created" line lifts off the terminal as a card, rises into a column
   between the windows (in the tree's order) and holds there to be read, then
   files into its row in the editor's tree. Cards live in screen space, projected from both
   planes, and are drawn at their largest size so they only scale down. */

/** Label size at the hold: the size a card reads at. */
const LABEL = 40
const HEIGHT = 80
/** Left inset of the label inside the card: padding, icon, gap. */
const INSET = 82
/** The column the cards hold in (label left edge, centre row), and its pitch. */
const COLUMN = { x: 900, y: 532, pitch: 86 } as const

const riseCurve = Easing.bezier(0.3, 0.05, 0.15, 1)
const landCurve = Easing.bezier(0.55, 0, 0.25, 1)

type Point = { x: number; y: number }

function quad(a: Point, c: Point, b: Point, t: number): Point {
  const u = 1 - t
  return {
    x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
    y: u * u * a.y + 2 * u * t * c.y + t * t * b.y,
  }
}

/** Card `i`'s slot in the column; the whole column drifts. */
function slot(frame: number, i: number): Point {
  const d = frame - T.fly
  return {
    x: COLUMN.x + d * 0.35,
    y: COLUMN.y + (SLOT[i]! - (FILES.length - 1) / 2) * COLUMN.pitch - d * 0.25,
  }
}

/** Where card `i` is at `frame`, its scale, and how lifted it is (0–1). */
function cardAt(frame: number, i: number) {
  const d = frame - FLY_AT[i]!
  const m = slot(frame, i)
  if (frame < DEPART_AT[i]!) {
    // It follows its line for a few frames, then leaves it behind.
    const at = Math.min(frame, FLY_AT[i]! + 4)
    const a = onScreen(at, terminalPose(at), ...terminalFileAnchor(at, i))
    const t = riseCurve(clamp01(d / RISE))
    const c = { x: lerp(a.x, m.x, 0.3), y: lerp(a.y, m.y, 0.5) - 30 }
    return {
      ...quad(a, c, m, t),
      s: lerp((TERM.font * a.k) / LABEL, 1, t),
      up: t,
      moving: d < RISE,
    }
  }
  const b = onScreen(frame, editorPose(frame), ...treeFileAnchor(frame, i))
  const t = landCurve(clamp01((frame - DEPART_AT[i]!) / DESCEND))
  const c = { x: lerp(m.x, b.x, 0.7), y: lerp(m.y, b.y, 0.15) - 20 }
  return {
    ...quad(m, c, b, t),
    s: lerp(1, (EDITOR.tree * b.k) / LABEL, t),
    up: 1 - t,
    moving: true,
  }
}

export function Chips({ frame }: { frame: number }) {
  const cards = FILES.map((_, i) => i)
    .filter((i) => frame >= FLY_AT[i]! && frame < landAt(i))
    .map((i) => {
      const p = cardAt(frame, i)
      const next = cardAt(frame + 1, i)
      return { i, p, speed: Math.hypot(next.x - p.x, next.y - p.y) }
    })
    // Held cards sit under the ones in flight.
    .sort((a, b) => Number(a.p.moving) - Number(b.p.moving) || a.i - b.i)
  return (
    <>
      {cards.map(({ i, p, speed }) => {
        const d = frame - FLY_AT[i]!
        const down = DEPART_AT[i]!
        const card =
          progress(d, 0, 6, ease.out) *
          (1 - progress(frame, down + DESCEND * 0.45, DESCEND * 0.5, ease.soft))
        const intoFolder = !TREE.some((r) => r.file === i)
        const label =
          progress(d, 0, 4, ease.out) *
          (1 -
            (intoFolder
              ? progress(frame, down + DESCEND * 0.2, DESCEND * 0.35)
              : progress(frame, landAt(i) - 3, 3, ease.linear)))
        const blur = Math.min(1.4, Math.max(0, (speed - 24) / 16))
        const swing = Math.sin(Math.PI * (1 - p.up)) * (p.moving ? 1 : 0)
        const rz = swing * (random(i, 11) - 0.5) * 8
        const ry = d < RISE ? lerp(14, 0, p.up) : lerp(-10, 0, p.up)
        return (
          <div
            key={FILES[i]!.name}
            style={{
              position: "absolute",
              left: p.x,
              top: p.y,
              width: 0,
              height: 0,
              transformOrigin: "0 0",
              transform: `perspective(1600px) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) scale(${p.s.toFixed(4)})`,
              filter: blur > 0.15 ? `blur(${blur.toFixed(2)}px)` : undefined,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: -INSET,
                top: -HEIGHT / 2,
                height: HEIGHT,
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "0 32px 0 26px",
                borderRadius: 20,
                whiteSpace: "nowrap",
                background: `linear-gradient(180deg, rgba(46,47,58,${card}), rgba(30,31,39,${card}))`,
                boxShadow: [
                  `inset 0 0 0 1px rgba(255,255,255,${(0.17 * card).toFixed(3)})`,
                  `inset 0 1px 0 rgba(255,255,255,${(0.12 * card).toFixed(3)})`,
                  `0 ${8 + 18 * p.up}px ${20 + 34 * p.up}px rgba(0,0,0,${(0.55 * card).toFixed(3)})`,
                  `0 0 ${40 * p.up}px rgba(110,140,255,${(0.3 * p.up * card).toFixed(3)})`,
                ].join(", "),
              }}
            >
              <span style={{ display: "flex", color: C.blue, opacity: card }}>
                <FileCodeIcon size={40} strokeWidth={1.75} />
              </span>
              <span
                style={{
                  fontFamily: SANS,
                  fontSize: LABEL,
                  fontWeight: 500,
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                  color: "#f5f7fa",
                  opacity: label,
                }}
              >
                {FILES[i]!.name}
              </span>
            </div>
          </div>
        )
      })}
    </>
  )
}
