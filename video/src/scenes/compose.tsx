import { useLayoutEffect, useRef } from "react"
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion"

import {
  clamp01,
  ease,
  keys,
  lerp,
  progress,
  punches,
  springAt,
} from "../lib/motion"
import { Stage } from "../lib/stage"
import { Theme } from "../lib/theme"
import { BlurWords, HEADLINE, TOP_ANCHOR, TYPE } from "../lib/type"
import { A11yRow, announce } from "./compose/a11y"
import { codeAt, Editor, editorHeight } from "./compose/editor"
import { applyFlip, boxIn } from "./compose/flip"
import {
  CardStage,
  CENTERED,
  CODES,
  HANDOFF_SCALE,
  LAST_STEP,
  Newsletter,
} from "./compose/steps"

export { HANDOFF_SCALE } from "./compose/steps"

/* 5 · Compose — 4 bars. Source on the left builds a newsletter field one
   composition at a time; on each beat the live component on the right snaps
   into the new shape. Then the code folds into the card, the card takes the
   centre, and the keyboard walks it: Tab to the field, Tab to the button,
   Enter — each announced. It ends on the card alone (exactly <HandoffCard />),
   pulling back into Patterns. */

// The component lands on these beats; the code types in ahead of each, its
// new lines resolving just as the beat hits.
const STEP_BEATS = [-60, 30, 60, 120, 180, 240] as const
const CODE_MOVE = [30, 30, 30, 40, 40, 44] as const
const CODE_AT = STEP_BEATS.map((b, i) => b - CODE_MOVE[i]! + 6)
const CODE_SIZES = [34, 34, 32, 29, 29, 27] as const
/** The line the caret types along in each step (Input, Label, Description,
    MailIcon, Button, CardTitle). */
const CARETS = [0, 1, 3, 4, 8, 2] as const
const MOVE_SPRING = { damping: 18, stiffness: 170, mass: 0.8 }

const EDITOR_W = 980
const GAP = 40
const CANVAS_PAD = 24
const PREVIEW_W = (320 + CANVAS_PAD * 2) * HANDOFF_SCALE
const LEFT = (1920 - EDITOR_W - GAP - PREVIEW_W) / 2
const EDITOR_X = LEFT + EDITOR_W / 2
const PREVIEW_X = LEFT + EDITOR_W + GAP + PREVIEW_W / 2

const HANDOFF = 300
const FOCUS_FIELD = 360
const FOCUS_BUTTON = 390
const PRESS = 420
const FOCUS_OFF = 450
const LAST = 479
const END_SLOPE = 0.35
/** Card zoom over the handoff scale while the keyboard walks it (2.7×). */
const A11Y_ZOOM = 1.35
const A11Y_Y = 574
/** Frames the ring takes to lock on, and to glide field → button. */
const LOCK = 9
const GLIDE = 12
const GLIDE_CURVE = Easing.bezier(0.22, 1, 0.36, 1)

/** Geist's cap line sits this far below the top of a statement's line box. */
const CAP_INSET = 0.155

export function Compose() {
  const frame = useCurrentFrame()

  // Frame 0 is close and mid-swing: the camera eases back and squares up,
  // opening room for the title; flat (and crisp) from f96.
  const swing = progress(frame, -6, 102, ease.out)
  const rotY = lerp(-10, 0, swing)
  const rotX = lerp(4, 0, swing)
  const push = lerp(1.16, 1, swing)
  const flat = swing >= 1

  const code = codeAt(frame, CODES, CODE_AT, CODE_SIZES, CODE_MOVE)
  const codeH = editorHeight(code.lines, code.fontSize)
  // Under the title the panes sit low; they rise as it leaves.
  const paneY = keys(frame, [
    [0, 648],
    [112, 648],
    [172, 540],
  ])
  const truck = lerp(30, -30, clamp01(frame / HANDOFF))
  // Once flat, a slow push keeps the two-shot breathing; it hands its scale
  // back while the card takes the centre.
  const world = keys(frame, [
    [96, 1],
    [HANDOFF, 1.045],
    [HANDOFF + 60, 1],
  ])

  // Bar 3: the card sets off for the centre and grows; on the beat the source
  // folds into it, the code absorbed by the component it wrote.
  const handoff = progress(frame, HANDOFF - 10, 70, ease.camera)
  const codeOut = progress(frame, HANDOFF, 24, ease.in)
  // Bar 4 ends pulling back to the hand-off: from rest, still moving on the
  // last frame (Hermite, end slope END_SLOPE) so the cut carries the move.
  const u = clamp01((frame - FOCUS_OFF) / (LAST - FOCUS_OFF))
  const back = u * u * (3 - 2 * u) + (u * u * u - u * u) * END_SLOPE
  const a11yZoom = lerp(
    A11Y_ZOOM,
    A11Y_ZOOM + 0.035,
    progress(frame, 362, 88, ease.soft),
  )
  const cardZoom =
    frame < FOCUS_OFF ? lerp(1, a11yZoom, handoff) : lerp(a11yZoom, 1, back)
  const previewX = lerp(PREVIEW_X + truck, 960, handoff)
  const previewY =
    frame < FOCUS_OFF ? lerp(paneY, A11Y_Y, handoff) : lerp(A11Y_Y, 540, back)
  const beat =
    punches(frame, [...STEP_BEATS.slice(1), FOCUS_FIELD, FOCUS_BUTTON, PRESS]) *
    (1 - u)

  return (
    <AbsoluteFill>
      <Stage
        gridOffset={[(previewX - 960) * 0.12, (previewY - 540) * 0.3]}
        gridScale={1 + (cardZoom - 1) * 0.5}
      />
      <AbsoluteFill
        style={{
          perspective: flat ? undefined : 2600,
        }}
      >
        <AbsoluteFill
          style={{
            transformStyle: flat ? undefined : "preserve-3d",
            transformOrigin: `960px ${paneY}px`,
            transform: !flat
              ? `rotateY(${rotY}deg) rotateX(${rotX}deg) scale(${push})`
              : world !== 1
                ? `scale(${world})`
                : undefined,
          }}
        >
          {codeOut < 1 ? (
            <div
              style={{
                position: "absolute",
                left: EDITOR_X - EDITOR_W / 2,
                top: paneY - codeH / 2,
                width: EDITOR_W,
                opacity: 1 - codeOut,
                filter: codeOut > 0.01 ? `blur(${codeOut * 16}px)` : undefined,
                transformOrigin: "100% 50%",
                transform: `translateX(${truck * 0.55 + codeOut * 420}px) scale(${1 - codeOut * 0.38})`,
              }}
            >
              <Editor
                codes={CODES}
                at={CODE_AT}
                durations={CODE_MOVE}
                frame={frame}
                sizes={CODE_SIZES}
                carets={CARETS}
              />
            </div>
          ) : null}
          <Preview
            frame={frame}
            x={previewX}
            y={previewY}
            scale={cardZoom * (1 + beat)}
          />
        </AbsoluteFill>
      </AbsoluteFill>

      <Title text="Built to compose." start={4} end={112} />
      <Title text="Accessible by default." start={318} end={FOCUS_OFF} />
    </AbsoluteFill>
  )
}

function Title({
  text,
  start,
  end,
}: {
  text: string
  start: number
  end: number
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: TOP_ANCHOR - TYPE.statement * CAP_INSET,
        textAlign: "center",
        ...HEADLINE,
        fontSize: TYPE.statement,
      }}
    >
      <BlurWords text={text} start={start} end={end} stagger={4} />
    </div>
  )
}

/** Which step the preview shows at `frame`, and how far its morph has got. */
function previewAt(frame: number) {
  let step = 0
  for (let k = 0; k < STEP_BEATS.length; k++) {
    if (frame >= STEP_BEATS[k]!) step = k
  }
  const start = STEP_BEATS[step]!
  const move = springAt(frame, start, MOVE_SPRING)
  const enter = progress(frame, start + 4, 22, ease.out)
  const done = frame - start > 50
  return { step, start, move, enter, done }
}

function Preview({
  frame,
  x,
  y,
  scale,
}: {
  frame: number
  x: number
  y: number
  /** On-screen scale over HANDOFF_SCALE. */
  scale: number
}) {
  const live = useRef<HTMLDivElement>(null)
  const ghost = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLDivElement>(null)
  const row = useRef<HTMLDivElement>(null)
  const said = [useRef<HTMLSpanElement>(null), useRef<HTMLSpanElement>(null)]
  const p = previewAt(frame)

  const focus =
    frame >= FOCUS_BUTTON + GLIDE && frame < FOCUS_OFF
      ? "button"
      : frame >= FOCUS_FIELD + LOCK && frame < FOCUS_BUTTON
        ? "input"
        : undefined
  const pressed = frame >= PRESS && frame < PRESS + 10

  useLayoutEffect(() => {
    const root = live.current
    if (!root) return
    applyFlip({
      live: root,
      ghost: p.done ? null : ghost.current,
      move: p.move,
      enter: p.enter,
    })
    const input = root.querySelector<HTMLElement>("[data-compose-input]")
    const button = root.querySelector<HTMLElement>("[data-compose-button]")
    input?.toggleAttribute("data-focused", focus === "input")
    button?.toggleAttribute("data-pressed", pressed)
    if (input && said[0]!.current)
      said[0]!.current.textContent = announce(input)
    if (button && said[1]!.current)
      said[1]!.current.textContent = announce(button)
    placeRing(root, ring.current, frame)
    fitCanvas(root, ghost.current, canvas.current, p)
    const card = root.querySelector<HTMLElement>("[data-compose-card]")
    if (row.current && card) {
      const half = (card.offsetHeight / 2) * HANDOFF_SCALE * scale
      row.current.style.top = `${y + half + 46}px`
    }
  })

  const transform =
    Math.abs(x - 960) < 0.001 && Math.abs(y - 540) < 0.001 && scale === 1
      ? undefined
      : `translate(${x - 960}px, ${y - 540}px) scale(${scale})`

  return (
    <>
      <Theme mode="light">
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center", transform }}
        >
          <CardStage zoom={HANDOFF_SCALE}>
            <div
              ref={canvas}
              className="bg-card"
              style={{ position: "absolute", display: "none" }}
            />
            {!p.done && p.step > 0 ? (
              <div
                ref={ghost}
                aria-hidden
                style={{ ...CENTERED, visibility: "hidden" }}
              >
                <Newsletter step={p.step - 1} />
              </div>
            ) : null}
            <div ref={live} style={CENTERED}>
              <Newsletter
                step={p.step}
                focus={focus === "button" ? "button" : undefined}
              />
            </div>
            <div
              ref={ring}
              style={{
                position: "absolute",
                pointerEvents: "none",
                opacity: 0,
              }}
            >
              {RING_STYLES.map((boxShadow) => (
                <div
                  key={boxShadow}
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "inherit",
                    boxShadow,
                  }}
                />
              ))}
            </div>
          </CardStage>
        </AbsoluteFill>
      </Theme>
      <A11yRow
        ref={row}
        frame={frame}
        keys={[
          [FOCUS_FIELD, "Tab"],
          [FOCUS_BUTTON, "Tab"],
          [PRESS, "Enter"],
        ]}
        lines={[FOCUS_FIELD, FOCUS_BUTTON]}
        from={FOCUS_FIELD - 14}
        to={FOCUS_OFF}
        refs={said}
      />
    </>
  )
}

/* The preview's light canvas (the card's own surface colour) hugs the
   component through each morph; when the card wraps, it tightens exactly onto
   the card's edge, so the card's surface simply takes over. */
function fitCanvas(
  live: HTMLElement,
  ghost: HTMLElement | null,
  canvas: HTMLDivElement | null,
  p: ReturnType<typeof previewAt>,
) {
  if (!canvas) return
  const now = live.firstElementChild as HTMLElement | null
  const toCard = p.step === LAST_STEP
  if (!now || (toCard && p.done)) {
    canvas.style.display = "none"
    return
  }
  const pad = toCard ? 0 : CANVAS_PAD
  const b = boxIn(now, live)
  let box = { x: b.x - pad, y: b.y - pad, w: b.w + pad * 2, h: b.h + pad * 2 }
  const was = ghost?.firstElementChild as HTMLElement | null
  if (was && !p.done) {
    const g = boxIn(was, ghost!)
    const from = {
      x: g.x - CANVAS_PAD,
      y: g.y - CANVAS_PAD,
      w: g.w + CANVAS_PAD * 2,
      h: g.h + CANVAS_PAD * 2,
    }
    box = {
      x: lerp(from.x, box.x, p.move),
      y: lerp(from.y, box.y, p.move),
      w: lerp(from.w, box.w, p.move),
      h: lerp(from.h, box.h, p.move),
    }
  }
  const cardRadius = parseFloat(getComputedStyle(now).borderTopLeftRadius)
  const radius = toCard ? lerp(14, cardRadius || 12, clamp01(p.move)) : 14
  const shadow = toCard ? 1 - clamp01(p.move) : 1
  if (toCard) {
    // The card is the canvas's shape until they coincide; then its edge shows.
    now.style.clipPath = `inset(${box.y - b.y}px ${b.x + b.w - box.x - box.w}px ${b.y + b.h - box.y - box.h}px ${box.x - b.x}px round ${radius}px)`
    const edge = clamp01((p.move - 0.55) / 0.45) * 100
    now.style.borderColor = `color-mix(in oklab, var(--card-border) ${edge}%, transparent)`
  }
  Object.assign(canvas.style, {
    display: "block",
    left: `${box.x}px`,
    top: `${box.y}px`,
    width: `${box.w}px`,
    height: `${box.h}px`,
    borderRadius: `${radius}px`,
    boxShadow: `0 30px 70px -20px rgba(0,0,0,${0.85 * shadow})`,
  })
}

/* The keyboard ring in flight: it locks onto the field on one beat and glides
   to the button on the next, drawn with each control's own focus tokens (the
   field's halo, the button's offset ring) so the real rings take over on
   landing without a seam. */
const RING_STYLES = [
  "0 0 0 var(--focus-input-offset) var(--color-bg), 0 0 0 calc(var(--focus-input-offset) + var(--focus-input-width)) var(--focus-input-color), inset 0 0 0 1px var(--color-border-focus)",
  "0 0 0 var(--focus-ring-offset) var(--color-bg), 0 0 0 calc(var(--focus-ring-offset) + var(--focus-ring-width)) var(--focus-ring-color)",
]

function placeRing(
  root: HTMLElement,
  ring: HTMLDivElement | null,
  frame: number,
) {
  if (!ring) return
  ring.style.opacity = "0"
  const lock = frame >= FOCUS_FIELD && frame < FOCUS_FIELD + LOCK
  const glide = frame >= FOCUS_BUTTON && frame < FOCUS_BUTTON + GLIDE
  if (!lock && !glide) return
  const field = root.querySelector<HTMLElement>("[data-flip~='field']")
  const button = root.querySelector<HTMLElement>("[data-compose-button]")
  if (!field || !button) return
  const a = boxIn(field, root)
  const b = boxIn(button, root)
  const ra = parseFloat(getComputedStyle(field).borderTopLeftRadius) || 8
  const rb = parseFloat(getComputedStyle(button).borderTopLeftRadius) || 8
  const t = glide ? progress(frame, FOCUS_BUTTON, GLIDE, GLIDE_CURVE) : 0
  const lockT = progress(frame, FOCUS_FIELD, LOCK, ease.out)
  const grow = lock ? lerp(12, 0, lockT) : 0
  ring.style.opacity = String(lock ? clamp01(lockT * 2) : 1)
  ring.style.left = `${lerp(a.x, b.x, t) - grow}px`
  ring.style.top = `${lerp(a.y, b.y, t) - grow}px`
  ring.style.width = `${lerp(a.w, b.w, t) + grow * 2}px`
  ring.style.height = `${lerp(a.h, b.h, t) + grow * 2}px`
  ring.style.borderRadius = `${lerp(ra, rb, t) + grow}px`
  const [fieldLayer, buttonLayer] = ring.children as unknown as HTMLElement[]
  fieldLayer!.style.opacity = String(1 - clamp01(t * 1.6))
  buttonLayer!.style.opacity = String(clamp01(t * 1.6 - 0.2))
}
