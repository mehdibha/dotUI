import { useLayoutEffect, useRef } from "react"
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion"

import { clamp01, ease, keys, lerp, progress, springAt } from "../lib/motion"
import { Stage } from "../lib/stage"
import { Theme } from "../lib/theme"
import { BlurWords, HEADLINE } from "../lib/type"
import { A11yRow, announce } from "./compose/a11y"
import { codeAt, Editor, editorHeight } from "./compose/editor"
import { applyFlip, boxIn } from "./compose/flip"
import { CODES, Newsletter } from "./compose/steps"

/* 5 · Compose — 4 bars. Source on the left builds a newsletter field one
   composition at a time while the live component on the right morphs to
   match; then the code steps away, the card takes the center, and the
   keyboard walks it: Tab to the field, Tab to the button, each announced. */

// Beats: 0 Input · 2 Label · 3 Description · 5 InputGroup · 7 Button · 8 Card.
const STEP_AT = [-14, 60, 90, 150, 210, 240] as const
const CODE_MOVE = 40
const CODE_SIZES = [26, 25, 24, 23, 22, 20] as const
/** The preview follows the code by a few frames: you write, it renders. */
const LAG = 16
const MOVE_SPRING = { damping: 19, stiffness: 150, mass: 0.9 }
/** Component zoom per step: big while it's small, easing out as it grows. */
const PREVIEW_SCALES = [2.05, 2.05, 2.0, 1.9, 1.85, 1.72] as const

const W = 1920
const CODE_W = 800
const PREVIEW_W = 760
const GAP = 40
const LEFT = (W - CODE_W - GAP - PREVIEW_W) / 2
const MIN_H = 470

const HANDOFF = 300
const FOCUS_FIELD = 360
const FOCUS_BUTTON = 390
const PRESS = 420
const FOCUS_OFF = 450
/** Frames the ring takes to lock on, and to glide field → button. */
const LOCK = 9
const GLIDE = 12
const GLIDE_CURVE = Easing.bezier(0.22, 1, 0.36, 1)

/** Hand-off: on the last frame the card sits alone at (960, 540), drawn at
    exactly this many screen px per component px (world drift included). */
export const HANDOFF_SCALE = 2
const LAST = 479
const DRIFT = 0.018
const FINAL_SCALE = HANDOFF_SCALE / (1 + DRIFT)

export function Compose() {
  const frame = useCurrentFrame()

  const code = codeAt(frame, CODES, STEP_AT, CODE_SIZES, CODE_MOVE)
  const paneH = Math.max(MIN_H, editorHeight(code.lines, code.fontSize))

  // Panes sit low under the first line, rise to center once it leaves.
  const paneY = keys(frame, [
    [0, 604],
    [150, 604],
    [205, 540],
  ])
  const arrive = progress(frame, -6, 36, ease.out)
  const drift = frame / LAST

  // Bar 3: the code steps away and the card takes the center.
  const handoff = progress(frame, HANDOFF, 64, ease.camera)
  const codeOut = progress(frame, HANDOFF + 6, 24, ease.in)
  const settle = progress(frame, FOCUS_OFF, 29, ease.inOut)
  const previewCx = lerp(LEFT + CODE_W + GAP + PREVIEW_W / 2, 960, handoff)
  const previewCy = lerp(lerp(paneY, 578, handoff), 540, settle)

  // The camera swings in on the cut, then drifts across and squares up.
  const swing = progress(frame, -6, 70, ease.out)
  const camY =
    lerp(-10, -3.5, swing) +
    keys(frame, [
      [0, 0],
      [300, 5],
      [370, 3.5],
    ])
  const camX = lerp(7, 1.5, swing) * (1 - handoff)

  return (
    <AbsoluteFill>
      {/* One full grid cell of pan, so the last frame's grid matches an unpanned one. */}
      <Stage gridOffset={[-drift * 28, 0]} />
      <AbsoluteFill
        style={{
          perspective: 2600,
          transform: `scale(${1 + drift * DRIFT})`,
        }}
      >
        <AbsoluteFill
          style={{
            transform: `rotateY(${camY}deg) rotateX(${camX}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          {codeOut < 1 ? (
            <div
              style={{
                position: "absolute",
                left: LEFT,
                top: paneY - paneH / 2,
                width: CODE_W,
                height: paneH,
                opacity: 1 - codeOut,
                filter: codeOut > 0.01 ? `blur(${codeOut * 14}px)` : undefined,
                transform: `translate(${-codeOut * 160}px, ${(1 - arrive) * 28}px) scale(${lerp(0.965, 1, arrive) - codeOut * 0.04})`,
              }}
            >
              <Editor
                codes={CODES}
                at={STEP_AT}
                duration={CODE_MOVE}
                frame={frame}
                sizes={CODE_SIZES}
                style={{ height: "100%" }}
              />
            </div>
          ) : null}

          <Preview
            frame={frame}
            cx={previewCx}
            cy={previewCy}
            width={PREVIEW_W}
            height={paneH}
            handoff={handoff}
            arrive={arrive}
          />
        </AbsoluteFill>
      </AbsoluteFill>

      <Title text="Built to compose." start={24} end={144} />
      <Title text="Accessible by default." start={330} end={FOCUS_OFF} />
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
        top: 132,
        textAlign: "center",
        ...HEADLINE,
        fontSize: 96,
      }}
    >
      <BlurWords text={text} start={start} end={end} stagger={4} />
    </div>
  )
}

/** Which step the preview shows at `frame`, and how far its morph has got. */
function previewAt(frame: number) {
  let step = 0
  for (let k = 0; k < STEP_AT.length; k++) {
    if (frame >= STEP_AT[k]! + LAG) step = k
  }
  const start = STEP_AT[step]! + LAG
  const move = springAt(frame, start, MOVE_SPRING)
  const enter = progress(frame, start + 8, 24, ease.out)
  const done = frame - start > 54
  const scale = lerp(
    PREVIEW_SCALES[Math.max(0, step - 1)]!,
    PREVIEW_SCALES[step]!,
    move,
  )
  return { step, move, enter, done, scale }
}

function Preview({
  frame,
  cx,
  cy,
  width,
  height,
  handoff,
  arrive,
}: {
  frame: number
  cx: number
  cy: number
  width: number
  height: number
  handoff: number
  arrive: number
}) {
  const live = useRef<HTMLDivElement>(null)
  const ghost = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLDivElement>(null)
  const said = [useRef<HTMLSpanElement>(null), useRef<HTMLSpanElement>(null)]
  const p = previewAt(frame)
  const scale = lerp(p.scale, FINAL_SCALE, handoff)
  const collapse = progress(frame, HANDOFF, 52, ease.camera)

  const focus =
    frame >= FOCUS_BUTTON + GLIDE && frame < FOCUS_OFF
      ? "button"
      : frame >= FOCUS_FIELD + LOCK && frame < FOCUS_BUTTON
        ? "input"
        : undefined
  const pressed = frame >= PRESS && frame < PRESS + 9

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
    shrinkCanvas(root, canvas.current, collapse, scale, width, height)
  })

  const cardH = 164 * scale

  return (
    <div
      style={{
        position: "absolute",
        left: cx - width / 2,
        top: cy - height / 2,
        width,
        height,
        transform: `translateY(${(1 - arrive) * 28}px) scale(${lerp(0.965, 1, arrive)})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "-30% -25%",
          opacity: 1 - collapse,
          background:
            "radial-gradient(closest-side, rgba(255,255,255,0.075), rgba(255,255,255,0.02) 55%, transparent)",
          pointerEvents: "none",
        }}
      />
      <Theme mode="light">
        <div
          ref={canvas}
          className="bg-bg"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 22,
            boxShadow:
              "0 0 0 1px rgba(255,255,255,0.08), 0 50px 120px -30px rgba(0,0,0,0.9)",
            backgroundImage:
              "radial-gradient(rgba(0,0,0,0.07) 1px, transparent 1.2px), radial-gradient(ellipse 80% 75% at 50% 45%, transparent 55%, rgba(0,0,0,0.045) 100%)",
            backgroundSize: "22px 22px, 100% 100%",
            backgroundPosition: "center, center",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `scale(${scale})`,
          }}
        >
          {!p.done ? (
            <div
              ref={ghost}
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                visibility: "hidden",
              }}
            >
              {p.step > 0 ? <Newsletter step={p.step - 1} /> : null}
            </div>
          ) : null}
          <div
            ref={live}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Newsletter
              step={p.step}
              focus={focus === "button" ? "button" : undefined}
            />
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
          </div>
        </div>
      </Theme>
      <A11yRow
        frame={frame}
        keys={[
          [FOCUS_FIELD, "Tab"],
          [FOCUS_BUTTON, "Tab"],
          [PRESS, "Enter"],
        ]}
        lines={[FOCUS_FIELD, FOCUS_BUTTON]}
        from={FOCUS_FIELD - 12}
        to={FOCUS_OFF}
        refs={said}
        style={{
          left: "50%",
          top: height / 2 + cardH / 2 + 56,
          transform: "translateX(-50%)",
        }}
      />
    </div>
  )
}

/* The preview surface tightens onto the card as the code leaves, so the card
   is simply what remains — no fade through grey. */
function shrinkCanvas(
  root: HTMLElement,
  canvas: HTMLDivElement | null,
  t: number,
  scale: number,
  width: number,
  height: number,
) {
  if (!canvas) return
  canvas.style.inset = "0px"
  canvas.style.opacity = ""
  canvas.style.borderRadius = "22px"
  if (t <= 0) return
  const card = root.querySelector<HTMLElement>("[data-compose-card]")
  if (!card) return
  const w = card.offsetWidth * scale
  const h = card.offsetHeight * scale
  // Aim a little inside the card so the surface tucks under its edge.
  const x = lerp(0, (width - w) / 2 + 8, t)
  const y = lerp(0, (height - h) / 2 + 8, t)
  const radius = parseFloat(getComputedStyle(card).borderTopLeftRadius) || 12
  canvas.style.inset = `${y}px ${x}px`
  canvas.style.borderRadius = `${lerp(22, radius * scale, t)}px`
  if (t >= 1) canvas.style.opacity = "0"
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
