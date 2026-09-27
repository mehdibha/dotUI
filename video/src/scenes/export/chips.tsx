import { FileCodeIcon } from "@/registry/icons"

import {
  clamp01,
  ease,
  lerp,
  progress,
  random,
  springAt,
} from "../../lib/motion"
import { C, EDITOR, FILES, FLIGHT, FLY_AT, SANS, TERM, TREE } from "./data"
import {
  editorPose,
  flight,
  onScreen,
  terminalFileAnchor,
  terminalPose,
  treeFileAnchor,
} from "./layout"

/* Each "Created" line lifts off the terminal as a card, arcs over the output
   toward the lens, and settles into its row in the editor's tree. Cards live
   in screen space, projected from both planes, and are drawn at their largest
   size so they only ever scale down (crisp). */

/** Native label size: the size a card reads at the top of its arc. */
const LABEL = 40

type Point = { x: number; y: number }

function path(frame: number, i: number, t: number) {
  // The card leaves its line, then stops following the (departing) terminal.
  const lift = Math.min(frame, FLY_AT[i]! + 8)
  const a = onScreen(lift, terminalPose(lift), ...terminalFileAnchor(lift, i))
  const b = onScreen(frame, editorPose(frame), ...treeFileAnchor(frame, i))
  const c: Point = {
    x: lerp(a.x, b.x, 0.55) + (random(i, 5) - 0.5) * 60,
    y: Math.min(a.y, b.y) - 50 - random(i, 3) * 120,
  }
  const u = 1 - t
  return {
    x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
    y: u * u * a.y + 2 * u * t * c.y + t * t * b.y,
    from: (TERM.font * a.k) / LABEL,
    to: (EDITOR.tree * b.k) / LABEL,
  }
}

/** Progress along the arc: an even glide, a little slower over the top. */
const along = (raw: number) => lerp(raw, ease.camera(raw), 0.55)

export function Chips({ frame }: { frame: number }) {
  const live = FILES.map((_, i) => i).filter(
    (i) => frame >= FLY_AT[i]! && flight(frame, i) < 1,
  )
  const cards = live.map((i) => {
    const raw = flight(frame, i)
    const t = along(raw)
    const p = path(frame, i, t)
    const next = path(frame, i, along(clamp01(raw + 1 / FLIGHT)))
    const speed = Math.hypot(next.x - p.x, next.y - p.y)
    const arc = Math.sin(Math.PI * t)
    const pop = springAt(frame, FLY_AT[i]!, "pop")
    const s = lerp(lerp(p.from, p.to, t), 1, arc ** 1.3) * lerp(0.94, 1, pop)
    return { i, raw, t, p, speed, arc, s }
  })
  cards.sort((a, b) => a.s - b.s)
  return (
    <>
      {cards.map(({ i, raw, t, p, speed, arc, s }) => {
        const card =
          progress(raw, 0.02, 0.14, ease.out) *
          (1 - progress(raw, 0.7, 0.24, ease.soft))
        const intoFolder = !TREE.some((r) => r.file === i)
        const label =
          progress(raw, 0, 0.1, ease.out) *
          (1 -
            progress(
              raw,
              intoFolder ? 0.72 : 0.9,
              intoFolder ? 0.22 : 0.1,
              ease.linear,
            ))
        const blur = Math.min(1.4, Math.max(0, (speed - 22) / 16))
        const rz = arc * (random(i, 11) - 0.5) * 9
        const ry = lerp(12, -9, t)
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
              transform: `perspective(1600px) rotateY(${ry.toFixed(2)}deg) rotateZ(${rz.toFixed(2)}deg) scale(${s.toFixed(4)})`,
              filter: blur > 0.15 ? `blur(${blur.toFixed(2)}px)` : undefined,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: -82,
                top: -41,
                height: 82,
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
                  `0 ${10 + 18 * arc}px ${24 + 34 * arc}px rgba(0,0,0,${(0.55 * card).toFixed(3)})`,
                  `0 0 ${46 * arc}px rgba(110,140,255,${(0.34 * arc * card).toFixed(3)})`,
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
