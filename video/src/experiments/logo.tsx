import { useLayoutEffect, useRef } from "react"
import { getRemotionEnvironment } from "remotion"

import { ease, keys, lerp, progress } from "../lib/motion"
import { Theme } from "../lib/theme"
import { noise, rgbaOf, STEPS_SIZE } from "./steps"

/* The last screen. A dot lands in the middle of the black, grows into the
   mark (its own dot punching through), construction lines measure it, the
   mark slides left as the letters come out from behind it, and the address
   types in below. A soft light blooms behind it all, painted in float and
   dithered so the near-black never bands. */

export const LOGO_FRAMES = 360

const { width: W, height: H } = STEPS_SIZE

/** The wordmark's letters (viewBox 331×100, mark at 0–100), split per glyph. */
export const WORDMARK =
  "M160 85.96L160 85.96Q155.12 85.96 151.28 83.68Q147.44 81.40 145.24 77.08Q143.04 72.76 143.04 66.84L143.04 66.84Q143.04 60.92 145.44 56.76Q147.84 52.60 152 50.44Q156.16 48.28 161.44 48.28L161.44 48.28Q164.80 48.28 167.88 49.32Q170.96 50.36 173.04 52.52L173.04 52.52L173.04 56.04L173.04 21.88L184.16 21.88L184.16 85L172.96 85L172.96 78.20L173.84 80.60Q171.12 82.84 167.76 84.40Q164.40 85.96 160 85.96ZM163.68 76.52L163.68 76.52Q165.92 76.52 167.64 75.92Q169.36 75.32 170.68 74.16Q172 73 172.96 71.24L172.96 71.24L172.96 62.68Q172.32 60.92 171 59.68Q169.68 58.44 167.80 57.76Q165.92 57.08 163.68 57.08L163.68 57.08Q161.20 57.08 159.08 58.32Q156.96 59.56 155.68 61.72Q154.40 63.88 154.40 66.68L154.40 66.68Q154.40 69.48 155.68 71.72Q156.96 73.96 159.08 75.24Q161.20 76.52 163.68 76.52ZM188.96 67.08L188.96 67.08Q188.96 61.72 191.48 57.48Q194.00 53.24 198.56 50.80Q203.12 48.36 209.04 48.36L209.04 48.36Q215.04 48.36 219.44 50.80Q223.84 53.24 226.20 57.48Q228.56 61.72 228.56 67.08L228.56 67.08Q228.56 72.44 226.20 76.72Q223.84 81 219.44 83.48Q215.04 85.96 208.88 85.96L208.88 85.96Q203.12 85.96 198.60 83.72Q194.08 81.48 191.52 77.24Q188.96 73 188.96 67.08ZM200.24 67.16L200.24 67.16Q200.24 69.88 201.36 72.08Q202.48 74.28 204.40 75.56Q206.32 76.84 208.72 76.84L208.72 76.84Q211.36 76.84 213.28 75.56Q215.20 74.28 216.24 72.08Q217.28 69.88 217.28 67.16L217.28 67.16Q217.28 64.36 216.24 62.20Q215.20 60.04 213.28 58.76Q211.36 57.48 208.72 57.48L208.72 57.48Q206.32 57.48 204.40 58.76Q202.48 60.04 201.36 62.20Q200.24 64.36 200.24 67.16ZM236.64 49.88L236.64 34.68L247.84 34.68L247.84 49.88L256.32 49.88L256.32 58.60L247.84 58.60L247.84 85L236.64 85L236.64 58.60L231.20 58.60L231.20 49.88L236.64 49.88ZM273.12 26.12L273.12 63.24Q273.12 66.04 274.80 68.60Q276.48 71.16 279.24 72.76Q282 74.36 285.28 74.36L285.28 74.36Q288.88 74.36 291.68 72.76Q294.48 71.16 296.12 68.60Q297.76 66.04 297.76 63.24L297.76 63.24L297.76 26.12L309.20 26.12L309.20 63.48Q309.20 69.96 306 74.96Q302.80 79.96 297.36 82.80Q291.92 85.64 285.28 85.64L285.28 85.64L285.28 85.64Q278.72 85.64 273.32 82.80Q267.92 79.96 264.72 74.96Q261.52 69.96 261.52 63.48L261.52 63.48L261.52 26.12L273.12 26.12ZM319.20 85L319.20 26.12L330.80 26.12L330.80 85L319.20 85Z"

const LETTERS = (() => {
  const starts = [143, 188, 230, 260, 318]
  const glyphs = starts.map(() => "")
  for (const sub of WORDMARK.split(/(?=M)/)) {
    const x = Number(sub.slice(1).split(/[ L]/)[0])
    glyphs[starts.filter((s) => x >= s).length - 1] += sub
  }
  return glyphs
})()

/** Wordmark height on the stage (1200×675); one viewBox unit is SIZE/100. */
const SIZE = 60
const K = SIZE / 100
const WIDTH = 331 * K
const CY = H / 2 - 22

/* Beats at 120 BPM / 60 fps: 30 frames each. */
const MORPH = 30
const SLIDE = 90
const ADDRESS = 150

/** The mark's outline at `t`: the dot's circle (t=0) to the square with its
 *  dot cut out (t=1), as one even-odd path in viewBox units. */
function markPath(t: number, hole: number) {
  const x0 = lerp(64, 0, t)
  const y0 = lerp(64, 0, t)
  const x1 = lerp(86, 100, t)
  const y1 = lerp(86, 100, t)
  const r = Math.min(lerp(11, 12, t), (x1 - x0) / 2)
  const rect =
    `M${x0 + r} ${y0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${y0 + r}` +
    `V${y1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${y1}H${x0 + r}` +
    `A${r} ${r} 0 0 1 ${x0} ${y1 - r}V${y0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${y0}Z`
  if (hole <= 0) return rect
  return `${rect}M${75 - hole} 75a${hole} ${hole} 0 1 0 ${hole * 2} 0a${hole} ${hole} 0 1 0 ${-hole * 2} 0Z`
}

/** The light behind the mark: a wide soft ellipse, as a fraction of white. */
function Glow({ frame, light }: { frame: number; light: number }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const probe = useRef<HTMLDivElement>(null)
  const field = useRef<Float32Array | null>(null)
  useLayoutEffect(() => {
    const el = canvas.current!
    const cw = el.width
    const ch = el.height
    if (!field.current) {
      field.current = new Float32Array(cw * ch)
      const sx = cw * 0.24
      const sy = ch * 0.3
      for (let y = 0; y < ch; y++)
        for (let x = 0; x < cw; x++) {
          const dx = (x - cw / 2) / sx
          const dy = (y - (CY / H) * ch) / sy
          field.current[y * cw + x] = Math.exp(-(dx * dx + dy * dy) / 2)
        }
    }
    const [r, g, b] = rgbaOf(getComputedStyle(probe.current!).backgroundColor)
    const rand = getRemotionEnvironment().isRendering
      ? noise(frame + 1)
      : () => 0
    const ctx = el.getContext("2d")!
    const img = ctx.createImageData(cw, ch)
    const f = field.current
    for (let i = 0, p = 0; i < f.length; i++, p += 4) {
      const lift = f[i]! * light * 255
      const n = rand() * 0.75
      img.data[p] = r! + lift + n
      img.data[p + 1] = g! + lift + n
      img.data[p + 2] = b! + lift * 1.04 + n
      img.data[p + 3] = 255
    }
    ctx.putImageData(img, 0, 0)
  }, [frame, light])
  return (
    <>
      <div ref={probe} className="hidden bg-bg" />
      <canvas
        ref={canvas}
        width={Math.round(W * STEPS_SIZE.scale)}
        height={Math.round(H * STEPS_SIZE.scale)}
        className="absolute inset-0"
        style={{ width: W, height: H }}
      />
    </>
  )
}

/** Hairlines along the mark's edges, drawn out from it, then gone. */
function Guides({
  frame,
  box,
}: {
  frame: number
  box: { x: number; y: number; s: number }
}) {
  const draw = progress(frame, MORPH, 50, ease.out)
  const fade = 1 - progress(frame, ADDRESS - 10, 40, ease.soft)
  const alpha = 0.16 * fade * progress(frame, MORPH, 12, ease.linear)
  if (alpha <= 0) return null
  const cx = box.x + box.s / 2
  const cy = box.y + box.s / 2
  const lx = W * 0.62 * draw
  const ly = H * 0.62 * draw
  const xs = [box.x, box.x + box.s]
  const ys = [box.y, box.y + box.s]
  return (
    <svg
      className="absolute inset-0 text-fg"
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ opacity: alpha }}
    >
      <defs>
        <radialGradient
          id="guide-fade"
          gradientUnits="userSpaceOnUse"
          cx={cx}
          cy={cy}
          r={W * 0.5}
        >
          <stop offset="0" stopColor="currentColor" />
          <stop offset="0.35" stopColor="currentColor" stopOpacity="0.6" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g stroke="url(#guide-fade)" strokeWidth={1 / STEPS_SIZE.scale}>
        {ys.map((y) => (
          <line key={`h${y}`} x1={cx - lx} x2={cx + lx} y1={y} y2={y} />
        ))}
        {xs.map((x) => (
          <line key={`v${x}`} x1={x} x2={x} y1={cy - ly} y2={cy + ly} />
        ))}
        <circle
          cx={box.x + 0.75 * box.s}
          cy={box.y + 0.75 * box.s}
          r={0.11 * box.s + 5}
          fill="none"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - draw}
        />
      </g>
    </svg>
  )
}

/** The logo screen at `frame` frames in. */
export function Logo({ frame }: { frame: number }) {
  // The dot lands, then grows into the mark around its own dot.
  const pop = progress(frame, 0, 16, ease.out)
  const grow = progress(frame, MORPH, 42, ease.out)
  const hole = 11 * progress(frame, MORPH + 8, 30, ease.out)
  const shape = frame < MORPH ? markPath(0, 0) : markPath(grow, hole)
  const dotScale = frame < MORPH ? lerp(0.3, 1, pop) : 1

  // The mark starts with its dot on the frame's center, settles centered,
  // then slides left to make room for the letters.
  const slide = progress(frame, SLIDE, 48, ease.out)
  const settle = lerp(25 * K, 0, grow)
  const markX = lerp(W / 2 - SIZE / 2, W / 2 - WIDTH / 2, slide) - settle
  const markY = CY - SIZE / 2 - settle

  // A slow push the whole time; the light blooms as the mark forms.
  const zoom = lerp(1, 1.045, progress(frame, 0, LOGO_FRAMES, ease.soft))
  const light = keys(
    frame,
    [
      [0, 0.012],
      [MORPH + 20, 0.07],
      [ADDRESS + 30, 0.045],
    ],
    ease.soft,
  )

  // One pass of light across the letters once they've landed.
  const sheen = lerp(-60, 400, progress(frame, ADDRESS + 30, 70, ease.inOut))

  const address = "dotui.org"

  return (
    <Theme mode="dark">
      <div className="absolute inset-0 overflow-hidden bg-bg text-fg">
        <Glow frame={frame} light={light} />
        <div
          className="absolute inset-0"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: `${W / 2}px ${CY}px`,
          }}
        >
          <Guides frame={frame} box={{ x: markX, y: markY, s: SIZE }} />
          <svg
            className="absolute overflow-visible"
            style={{ left: markX, top: markY }}
            width={WIDTH}
            height={SIZE}
            viewBox="0 0 331 100"
          >
            <defs>
              <linearGradient id="logo-ink" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="currentColor" />
                <stop offset="1" stopColor="currentColor" stopOpacity="0.7" />
              </linearGradient>
              <linearGradient
                id="logo-sheen"
                gradientUnits="userSpaceOnUse"
                x1={sheen - 50}
                x2={sheen + 50}
                y1="0"
                y2="20"
              >
                <stop offset="0" stopColor="#fff" stopOpacity="0" />
                <stop offset="0.5" stopColor="#fff" stopOpacity="0.85" />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              <clipPath id="logo-behind">
                <rect x="104" y="-20" width="260" height="140" />
              </clipPath>
            </defs>
            <g
              style={{
                transform: `scale(${dotScale})`,
                transformOrigin: "75px 75px",
                opacity: progress(frame, 0, 6, ease.linear),
              }}
            >
              <path d={shape} fill="url(#logo-ink)" fillRule="evenodd" />
            </g>
            <g clipPath="url(#logo-behind)">
              {LETTERS.map((d, i) => {
                const p = progress(frame, SLIDE + 4 + i * 4, 40, ease.out)
                return (
                  <g
                    key={i}
                    style={{
                      transform: `translateX(${lerp(-56, 0, p)}px)`,
                      opacity: progress(frame, SLIDE + 4 + i * 4, 18, ease.soft),
                    }}
                  >
                    <path d={d} fill="url(#logo-ink)" />
                    <path d={d} fill="url(#logo-sheen)" />
                  </g>
                )
              })}
            </g>
            {frame >= MORPH && (
              <path d={shape} fill="url(#logo-sheen)" fillRule="evenodd" />
            )}
          </svg>
          <div
            className="absolute flex w-full justify-center font-mono text-fg-muted"
            style={{ top: CY + SIZE / 2 + 30, fontSize: 22, letterSpacing: "0.02em" }}
          >
            {address.split("").map((ch, i) => {
              const p = progress(frame, ADDRESS + i * 2, 16, ease.out)
              return (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    opacity: p,
                    filter: `blur(${lerp(6, 0, p)}px)`,
                    transform: `translateY(${lerp(6, 0, p)}px)`,
                  }}
                >
                  {ch}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </Theme>
  )
}
