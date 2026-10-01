import type { RefObject } from "react"
import { useLayoutEffect, useRef } from "react"
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion"

import { clamp01, ease, lerp, progress, punches, springAt } from "../lib/motion"
import { Stage } from "../lib/stage"
import { Theme } from "../lib/theme"
import { BlurWords, HEADLINE, TOP_ANCHOR, TYPE } from "../lib/type"
import { A11yRow, announce, fitRow } from "./compose/a11y"
import { codeAt, Editor, MONO } from "./compose/editor"
import { applyFlip, boxIn } from "./compose/flip"
import type { Box } from "./compose/flip"
import {
  CardStage,
  CENTERED,
  CODES,
  HANDOFF_SCALE,
  FIELD_WIDTH,
  IconsReady,
  LAST_STEP,
  LOOK,
  LOOK_MODE,
  Newsletter,
} from "./compose/steps"

export { HANDOFF_SCALE } from "./compose/steps"

/* 5 · Compose — 4 bars, in the system the viewer just built. It opens tight:
   one line of source over its live render, both filling the frame. As the
   source grows the render slides aside and the camera pulls back into a
   two-shot; on each beat the component snaps into its new shape. Then the
   code folds into the finished card, the card takes the centre, and the
   keyboard walks it — Tab, Tab, Enter — each announced. It ends on the card
   alone (exactly <HandoffCard />), pulling back into Patterns. */

// The component lands on these beats; the code types in ahead of each, its
// new lines resolving just as the beat hits.
const STEP_BEATS = [-60, 30, 60, 120, 180, 240] as const
const CODE_MOVE = [30, 30, 30, 40, 40, 44] as const
const CODE_AT = STEP_BEATS.map((b, i) => b - CODE_MOVE[i]! + 6)
/** Code px at camera 1; the camera scales it (49 px on the open, 24 at the widest). */
const CODE = 27
const CODE_SIZES = CODES.map(() => CODE)
/** The line the caret types along in each step (Input, Label, Description,
    MailIcon, Button, CardTitle). */
const CARETS = [0, 1, 3, 4, 8, 2] as const
const MOVE_SPRING = { damping: 18, stiffness: 170, mass: 0.8 }
/** The look's brand, for the editor's caret and change bands. */
const ACCENT = [1, 3, 5]
  .map((i) => parseInt(LOOK.brand.slice(i, i + 2), 16))
  .join(",")
const WIDEST = CODES.map((c) =>
  Math.max(...c.split("\n").map((l) => l.trimEnd().length)),
)

/** Component px → world px while the field is built. */
const ZOOM = 2.6
const CANVAS_PAD = 24
const GAP_X = 44
const GAP_Y = 34
/** Geist Mono's advance (em): the editor hugs its widest line in `ch`. */
const CH = 0.6
const GUTTER_CH = 3.6
const editorWidth = (widest: number) => (widest + GUTTER_CH) * CH * CODE + 42
const CANVAS_W = (FIELD_WIDTH + CANVAS_PAD * 2) * ZOOM

const HANDOFF = 300
const FOCUS_FIELD = 360
const FOCUS_BUTTON = 390
const PRESS = 420
const FOCUS_OFF = 450
const LAST = 479
/** Screen px per component px while the keyboard walks the card. */
const A11Y_SCALE = 2.52
const A11Y_Y = 566
/** Patterns' pull starts at this log-scale rate per frame; the cut matches it. */
const HANDOFF_RATE = -0.00465
/** Frames the ring takes to lock on, and to glide field → button. */
const LOCK = 9
const GLIDE = 12
const GLIDE_CURVE = Easing.bezier(0.22, 1, 0.36, 1)

/** Geist's cap line sits this far below the top of a statement's line box. */
const CAP_INSET = 0.155

/* The camera, world → screen. Its zoom frames the content's width (so it
   pulls back as the render slides aside and again as the code widens). The
   cut lands mid pull-back, and a slow breath out keeps it from settling. */
const FIT_W = 1780
const OPEN_ZOOM = 1.74

function cameraAt(frame: number, extent: number) {
  const pull = 1 + 0.07 * (1 - progress(frame, -4, 44, ease.out))
  const breath = 1 - 0.035 * progress(frame, 40, 260, ease.soft)
  const s = Math.min(OPEN_ZOOM, FIT_W / extent) * pull * breath
  // Under the title the shot sits low; it rises as the title leaves.
  const cy =
    540 +
    104 * progress(frame, 4, 50, ease.camera) -
    104 * progress(frame, 132, 66, ease.camera)
  const tx = -32 * progress(frame, 0, 300, ease.soft)
  return { s, cy, tx }
}

/** Code on top of its render (the open) → side by side. The render clears
    sideways first, then rises beside the code, so the two never cross. */
function splitAt(frame: number) {
  return {
    x: progress(frame, -8, 38, ease.camera),
    y: progress(frame, 8, 48, ease.camera),
  }
}

/** The camera and the code's width on `frame` (pure, so the ground can ride it). */
function shotAt(frame: number) {
  const code = codeAt(frame, CODES, CODE_AT, CODE_SIZES, CODE_MOVE)
  const widest = lerp(
    WIDEST[Math.max(0, code.step - 1)]!,
    WIDEST[code.step]!,
    code.move,
  )
  const split = splitAt(frame)
  const ew = editorWidth(widest)
  const extent = lerp(Math.max(ew, CANVAS_W), ew + GAP_X + CANVAS_W, split.x)
  return { cam: cameraAt(frame, extent), split, widest }
}

export function Compose() {
  const frame = useCurrentFrame()
  const refs = {
    editor: useRef<HTMLDivElement>(null),
    preview: useRef<HTMLDivElement>(null),
    live: useRef<HTMLDivElement>(null),
    ghost: useRef<HTMLDivElement>(null),
    canvas: useRef<HTMLDivElement>(null),
    ring: useRef<HTMLDivElement>(null),
    row: useRef<HTMLDivElement>(null),
    said: [useRef<HTMLSpanElement>(null), useRef<HTMLSpanElement>(null)],
  }
  const p = previewAt(frame)
  const { widest } = shotAt(frame)

  const focus =
    frame >= FOCUS_BUTTON + GLIDE && frame < FOCUS_OFF
      ? "button"
      : frame >= FOCUS_FIELD + LOCK && frame < FOCUS_BUTTON
        ? "input"
        : undefined
  const pressed = frame >= PRESS && frame < PRESS + 10

  useLayoutEffect(() => {
    const root = refs.live.current
    if (!root) return
    applyFlip({
      live: root,
      ghost: p.done ? null : refs.ghost.current,
      move: p.move,
      enter: p.enter,
    })
    const input = root.querySelector<HTMLElement>("[data-compose-input]")
    const button = root.querySelector<HTMLElement>("[data-compose-button]")
    input?.toggleAttribute("data-focused", focus === "input")
    button?.toggleAttribute("data-pressed", pressed)
    const [field, action] = refs.said
    if (input && field!.current) field!.current.textContent = announce(input)
    if (button && action!.current)
      action!.current.textContent = announce(button)
    placeRing(root, refs.ring.current, frame)
    const box = fitCanvas(root, refs.ghost.current, refs.canvas.current, p)
    stageShot(frame, box, refs)
  })

  return (
    <AbsoluteFill>
      <Ground frame={frame} />
      {progress(frame, HANDOFF, 24, ease.in) < 1 ? (
        <div
          ref={refs.editor}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            transformOrigin: "0 0",
            fontFamily: MONO,
            fontSize: CODE,
            // Hugs the widest line, past the gutter.
            width: `calc(${widest + GUTTER_CH}ch + 42px)`,
          }}
        >
          <Editor
            codes={CODES}
            at={CODE_AT}
            durations={CODE_MOVE}
            frame={frame}
            sizes={CODE_SIZES}
            carets={CARETS}
            accent={ACCENT}
          />
        </div>
      ) : null}
      <Theme state={LOOK} mode={LOOK_MODE}>
        <IconsReady />
        <AbsoluteFill
          ref={refs.preview}
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <CardStage zoom={HANDOFF_SCALE}>
            <div
              ref={refs.canvas}
              className="bg-card"
              style={{ position: "absolute", display: "none" }}
            />
            {!p.done && p.step > 0 ? (
              <div
                ref={refs.ghost}
                aria-hidden
                style={{ ...CENTERED, visibility: "hidden" }}
              >
                <Newsletter step={p.step - 1} />
              </div>
            ) : null}
            <div ref={refs.live} style={CENTERED}>
              <Newsletter
                step={p.step}
                focus={focus === "button" ? "button" : undefined}
              />
            </div>
            <div
              ref={refs.ring}
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
        ref={refs.row}
        frame={frame}
        keys={[
          [FOCUS_FIELD, "Tab"],
          [FOCUS_BUTTON, "Tab"],
          [PRESS, "Enter"],
        ]}
        lines={[FOCUS_FIELD, FOCUS_BUTTON]}
        from={FOCUS_FIELD - 14}
        to={FOCUS_OFF}
        refs={refs.said}
      />
      <Title text="Built to compose." start={30} end={138} />
      <Title text="Accessible by default." start={322} end={FOCUS_OFF} />
    </AbsoluteFill>
  )
}

/* Where the card is headed after the build: the centre, large, while the
   keyboard walks it; then back to the hand-off, from rest, still pulling back
   on the last frame at Patterns' rate. */
function cardAt(frame: number) {
  if (frame < FOCUS_OFF) {
    const drift = progress(frame, 356, 94, ease.soft)
    return { y: A11Y_Y, scale: A11Y_SCALE * (1 + 0.02 * drift) }
  }
  const from = A11Y_SCALE * 1.02
  const u = clamp01((frame - FOCUS_OFF) / (LAST - FOCUS_OFF))
  // Hermite from rest to HANDOFF_SCALE, leaving at Patterns' rate.
  const slope =
    (HANDOFF_RATE * HANDOFF_SCALE * (LAST - FOCUS_OFF)) / (HANDOFF_SCALE - from)
  const back = u * u * (3 - 2 * u) + (u * u * u - u * u) * slope
  return {
    y: lerp(A11Y_Y, 540, u * u * (3 - 2 * u)),
    scale: lerp(from, HANDOFF_SCALE, back),
  }
}

/** How far the card has left the two-shot for the centre (0 → 1). */
const handoffAt = (frame: number) =>
  progress(frame, HANDOFF - 10, 70, ease.camera)

function Ground({ frame }: { frame: number }) {
  // The dots ride the camera at half its rate, and rest unpanned at the cut.
  const { cam } = shotAt(frame)
  const h = handoffAt(frame)
  const card = cardAt(frame)
  const view = lerp(cam.s, card.scale / HANDOFF_SCALE, h)
  const dy = lerp(cam.cy - 540, card.y - 540, h)
  return (
    <Stage
      gridOffset={[cam.tx * 0.3 * (1 - h), dy * 0.3]}
      gridScale={1 + (view - 1) * 0.5}
    />
  )
}

type Refs = {
  editor: RefObject<HTMLDivElement | null>
  preview: RefObject<HTMLDivElement | null>
  live: RefObject<HTMLDivElement | null>
  row: RefObject<HTMLDivElement | null>
}

/* Lays the shot out from what's on the page this frame: the editor hugs its
   code, the render hugs its canvas, and the pair is framed by the camera. */
function stageShot(frame: number, box: Box, refs: Refs) {
  const editor = refs.editor.current
  const preview = refs.preview.current
  const root = refs.live.current
  if (!preview || !root) return
  const { cam, split } = shotAt(frame)

  // World sizes (camera 1).
  const ew = editor?.offsetWidth ?? 0
  const eh = editor?.offsetHeight ?? 0
  const pw = box.w * ZOOM
  const ph = box.h * ZOOM
  const stackH = eh + GAP_Y + ph
  const sideW = ew + GAP_X + pw
  const ex = lerp(960, 960 - sideW / 2 + ew / 2, split.x)
  const ey = lerp(540 - stackH / 2 + eh / 2, 540, split.y)
  const px = lerp(960, 960 + sideW / 2 - pw / 2, split.x)
  const py = lerp(540 + stackH / 2 - ph / 2, 540, split.y)
  const screen = (x: number, y: number, depth = 1) => ({
    x: 960 + (x - 960) * cam.s + cam.tx * depth,
    y: cam.cy + (y - 540) * cam.s,
  })

  // The code: on the hand-off beat it folds into the card it wrote.
  if (editor) {
    const out = progress(frame, HANDOFF, 24, ease.in)
    const at = screen(ex, ey, 0.6)
    const k = cam.s * (1 - out * 0.38)
    // Anchored on its right edge as it shrinks toward the card.
    const right = at.x + (ew * cam.s) / 2 + out * 380
    editor.style.transform = `translate(${right - ew * k}px, ${at.y - (eh * k) / 2}px) scale(${k})`
    editor.style.opacity = String(1 - out)
    editor.style.filter = out > 0.01 ? `blur(${out * 8}px)` : ""
  }

  // The render: the canvas box's centre sits on its layout point.
  const off = {
    x: box.x + box.w / 2 - root.offsetWidth / 2,
    y: box.y + box.h / 2 - root.offsetHeight / 2,
  }
  const built = screen(px, py)
  const h = handoffAt(frame)
  const card = cardAt(frame)
  const beat =
    punches(frame, [...STEP_BEATS.slice(1), FOCUS_FIELD, FOCUS_BUTTON, PRESS]) *
    (1 - clamp01((frame - FOCUS_OFF) / 10))
  const scale = lerp(ZOOM * cam.s, card.scale, h) * (1 + beat)
  const x = lerp(built.x - off.x * ZOOM * cam.s, 960, h)
  const y = lerp(built.y - off.y * ZOOM * cam.s, card.y, h)
  const k = scale / HANDOFF_SCALE
  preview.style.transform =
    Math.abs(x - 960) < 0.001 &&
    Math.abs(y - 540) < 0.001 &&
    Math.abs(k - 1) < 1e-6
      ? ""
      : `translate(${x - 960}px, ${y - 540}px) scale(${k})`

  // The announcement sits centred under the card.
  const row = refs.row.current
  const cardEl = root.querySelector<HTMLElement>("[data-compose-card]")
  if (row && cardEl) {
    fitRow(row)
    row.style.top = `${y + (cardEl.offsetHeight / 2) * scale + 40}px`
  }
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

/* The preview's light canvas (the card's own surface colour) hugs the
   component through each morph; when the card wraps, it tightens exactly onto
   the card's edge, so the card's surface simply takes over. Returns the box
   the render occupies (component px, in the stage). */
function fitCanvas(
  live: HTMLElement,
  ghost: HTMLElement | null,
  canvas: HTMLDivElement | null,
  p: ReturnType<typeof previewAt>,
): Box {
  const now = live.firstElementChild as HTMLElement | null
  if (!canvas || !now) return { x: 0, y: 0, w: 0, h: 0 }
  const b = boxIn(now, live)
  const toCard = p.step === LAST_STEP
  if (toCard && p.done) {
    canvas.style.display = "none"
    return b
  }
  const pad = toCard ? 0 : CANVAS_PAD
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
  const radius = toCard ? lerp(16, cardRadius || 12, clamp01(p.move)) : 16
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
  return box
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
