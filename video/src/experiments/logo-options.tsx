import type { CSSProperties } from "react"
import { Easing } from "remotion"

import { clamp01, ease, lerp, progress, springAt } from "../lib/motion"
import { Theme } from "../lib/theme"
import { Glow, LETTERS, markPath } from "./logo"
import { STEPS_SIZE } from "./steps"

/* Quieter takes on the last screen, one idea each, to pick from. Same
   layout for all: the wordmark a little above center, the address under it.
   Beats are 30 frames. */

export const OPTION_FRAMES = 300

const { width: W, height: H } = STEPS_SIZE
const SIZE = 56
const K = SIZE / 100
const WIDTH = 331 * K
const CY = H / 2 - 16
const LEFT = W / 2 - WIDTH / 2
const TOP = CY - SIZE / 2
const MARK = markPath(1, 11)

type Style = CSSProperties | undefined

/** The wordmark in viewBox units, every piece styleable. */
function Wordmark({
  x = LEFT,
  y = TOP,
  mark = MARK,
  markStyle,
  letter,
  clip,
  letterClip,
  ink = "flat",
  sheen,
  style,
}: {
  x?: number
  y?: number
  mark?: string
  markStyle?: Style
  letter?: (i: number) => Style
  /** Hide everything outside this rect (viewBox units). */
  clip?: [number, number, number, number]
  /** Hide the letters outside this rect (viewBox units). */
  letterClip?: [number, number, number, number]
  ink?: "flat" | "soft"
  /** Where a band of light is across the wordmark (viewBox x), if anywhere. */
  sheen?: number
  style?: Style
}) {
  const fill = ink === "soft" ? "url(#ink)" : "currentColor"
  return (
    <svg
      className="absolute overflow-visible text-fg"
      style={{ left: x, top: y, ...style }}
      width={WIDTH}
      height={SIZE}
      viewBox="0 0 331 100"
    >
      <defs>
        <linearGradient id="ink" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.72" />
        </linearGradient>
        {sheen !== undefined && (
          <linearGradient
            id="sheen"
            gradientUnits="userSpaceOnUse"
            x1={sheen - 45}
            x2={sheen + 45}
            y1="0"
            y2="24"
          >
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.7" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        )}
        {clip && (
          <clipPath id="clip">
            <rect x={clip[0]} y={clip[1]} width={clip[2]} height={clip[3]} />
          </clipPath>
        )}
        {letterClip && (
          <clipPath id="letter-clip">
            <rect
              x={letterClip[0]}
              y={letterClip[1]}
              width={letterClip[2]}
              height={letterClip[3]}
            />
          </clipPath>
        )}
      </defs>
      <g clipPath={clip ? "url(#clip)" : undefined}>
        <g style={{ transformOrigin: "50px 50px", ...markStyle }}>
          <path d={mark} fill={fill} fillRule="evenodd" />
          {sheen !== undefined && (
            <path d={mark} fill="url(#sheen)" fillRule="evenodd" />
          )}
        </g>
        <g clipPath={letterClip ? "url(#letter-clip)" : undefined}>
          {LETTERS.map((d, i) => (
            <g key={i} style={letter?.(i)}>
              <path d={d} fill={fill} />
              {sheen !== undefined && <path d={d} fill="url(#sheen)" />}
            </g>
          ))}
        </g>
      </g>
    </svg>
  )
}

/** dotui.org under the wordmark, easing up into place from `at`. */
function Address({ frame, at }: { frame: number; at: number }) {
  const p = progress(frame, at, 40, ease.out)
  return (
    <div
      className="absolute flex w-full justify-center font-mono text-fg-muted"
      style={{
        top: CY + SIZE / 2 + 26,
        fontSize: 22,
        letterSpacing: "0.01em",
        opacity: progress(frame, at, 24, ease.soft),
        transform: `translateY(${lerp(6, 0, p)}px)`,
        filter: `blur(${lerp(4, 0, p)}px)`,
      }}
    >
      dotui.org
    </div>
  )
}

/** Fade, blur and drift for something arriving at `at` over `len`. */
function arrive(frame: number, at: number, len = 40, rise = 0): Style {
  const p = progress(frame, at, len, ease.out)
  return {
    opacity: progress(frame, at, len * 0.6, ease.soft),
    filter: `blur(${lerp(6, 0, p)}px)`,
    transform: rise ? `translateY(${lerp(rise, 0, p)}px)` : undefined,
  }
}

/** 1 · The whole wordmark settles up into place, out of a soft blur. */
function Settle({ frame }: { frame: number }) {
  const p = progress(frame, 0, 60, ease.out)
  return (
    <>
      <Wordmark
        style={{
          opacity: progress(frame, 0, 36, ease.soft),
          transform: `translateY(${lerp(10, 0, p)}px)`,
          filter: `blur(${lerp(10, 0, p)}px)`,
        }}
      />
      <Address frame={frame} at={45} />
    </>
  )
}

/** 2 · A slow focus pull: large and soft, easing down to size and sharp. */
function Focus({ frame }: { frame: number }) {
  const p = progress(frame, 0, 100, ease.out)
  return (
    <>
      <Wordmark
        style={{
          opacity: progress(frame, 0, 40, ease.soft),
          transform: `scale(${lerp(1.12, 1, p)})`,
          transformOrigin: "50% 50%",
          filter: `blur(${lerp(16, 0, progress(frame, 0, 70, ease.out))}px)`,
        }}
      />
      <Address frame={frame} at={60} />
    </>
  )
}

/** 3 · A soft-edged wipe uncovers it left to right. */
function Wipe({ frame }: { frame: number }) {
  const p = lerp(-30, 100, progress(frame, 0, 60, ease.inOut))
  const mask = `linear-gradient(90deg, #000 ${p}%, transparent ${p + 30}%)`
  return (
    <>
      <Wordmark style={{ maskImage: mask, WebkitMaskImage: mask }} />
      <Address frame={frame} at={60} />
    </>
  )
}

/** 4 · The mark, then each letter, rises out from under the baseline. */
function Rise({ frame }: { frame: number }) {
  const up = (i: number): Style => {
    const p = progress(frame, i * 3, 42, ease.out)
    return { transform: `translateY(${lerp(110, 0, p)}px)` }
  }
  return (
    <>
      <Wordmark
        clip={[-20, -40, 371, 140]}
        markStyle={up(0)}
        letter={(i) => up(i + 2)}
      />
      <Address frame={frame} at={60} />
    </>
  )
}

/** 5 · The mark alone, then it steps aside and the letters fade in. */
function MarkFirst({ frame }: { frame: number }) {
  const slide = progress(frame, 60, 50, ease.out)
  const x = lerp(W / 2 - SIZE / 2, LEFT, slide)
  const pop = progress(frame, 0, 40, ease.out)
  return (
    <>
      <Wordmark
        x={x}
        markStyle={{
          opacity: progress(frame, 0, 24, ease.soft),
          transform: `scale(${lerp(0.94, 1, pop)})`,
          filter: `blur(${lerp(6, 0, pop)}px)`,
        }}
        letter={(i) => {
          const at = 70 + i * 4
          const p = progress(frame, at, 36, ease.out)
          return {
            ...arrive(frame, at, 36),
            transform: `translateX(${lerp(-10, 0, p)}px)`,
          }
        }}
      />
      <Address frame={frame} at={120} />
    </>
  )
}

/** 6 · A dot lands and grows into the mark; the letters follow. */
function Dot({ frame }: { frame: number }) {
  const pop = progress(frame, 0, 18, ease.out)
  const grow = progress(frame, 30, 44, ease.out)
  const hole = 11 * progress(frame, 38, 32, ease.out)
  const settle = lerp(25 * K, 0, grow)
  const slide = progress(frame, 90, 50, ease.out)
  const x = lerp(W / 2 - SIZE / 2, LEFT, slide) - settle
  return (
    <>
      <Wordmark
        x={x}
        y={TOP - settle}
        mark={frame < 30 ? markPath(0, 0) : markPath(grow, hole)}
        markStyle={{
          opacity: progress(frame, 0, 8, ease.linear),
          transform: frame < 30 ? `scale(${lerp(0.4, 1, pop)})` : undefined,
          transformOrigin: "75px 75px",
        }}
        letter={(i) => {
          const at = 100 + i * 4
          const p = progress(frame, at, 36, ease.out)
          return {
            ...arrive(frame, at, 36),
            transform: `translateX(${lerp(-10, 0, p)}px)`,
          }
        }}
      />
      <Address frame={frame} at={150} />
    </>
  )
}

/** 7 · A hairline draws out, the wordmark rises from behind it, the line
 *  goes. */
function Hairline({ frame }: { frame: number }) {
  const draw = progress(frame, 0, 40, ease.out)
  const line = 0.22 * (1 - progress(frame, 80, 40, ease.soft))
  const half = (WIDTH / 2 + 48) * draw
  const p = progress(frame, 18, 46, ease.out)
  return (
    <>
      <div
        className="absolute bg-fg"
        style={{
          left: W / 2 - half,
          width: half * 2,
          top: TOP + SIZE,
          height: 1 / STEPS_SIZE.scale,
          opacity: line,
        }}
      />
      <Wordmark
        clip={[-20, -40, 371, 140]}
        markStyle={{ transform: `translateY(${lerp(105, 0, p)}px)` }}
        letter={() => ({ transform: `translateY(${lerp(105, 0, p)}px)` })}
      />
      <Address frame={frame} at={100} />
    </>
  )
}

/** 8 · Fades in, then a faint light comes up behind it and one sheen
 *  crosses. */
function Light({ frame }: { frame: number }) {
  const p = progress(frame, 0, 60, ease.out)
  const light = 0.04 * progress(frame, 20, 110, ease.soft)
  return (
    <>
      <Glow frame={frame} light={light} cy={CY} />
      <Wordmark
        ink="soft"
        sheen={lerp(-60, 400, progress(frame, 120, 80, ease.inOut))}
        style={{
          opacity: progress(frame, 0, 36, ease.soft),
          filter: `blur(${lerp(8, 0, p)}px)`,
        }}
      />
      <Address frame={frame} at={60} />
    </>
  )
}

/** The dot (t=0) grown into the square (t=1) around it, rounder for longer
 *  (`round` 1 = a circle), its own dot opened to `hole`. ViewBox units. */
function grownMark(t: number, round: number, hole: number) {
  const x0 = lerp(64, 0, t)
  const x1 = lerp(86, 100, t)
  const half = (x1 - x0) / 2
  const r = lerp(12, half, round)
  const rect =
    `M${x0 + r} ${x0}H${x1 - r}A${r} ${r} 0 0 1 ${x1} ${x0 + r}` +
    `V${x1 - r}A${r} ${r} 0 0 1 ${x1 - r} ${x1}H${x0 + r}` +
    `A${r} ${r} 0 0 1 ${x0} ${x1 - r}V${x0 + r}A${r} ${r} 0 0 1 ${x0 + r} ${x0}Z`
  if (hole <= 0) return rect
  return `${rect}M${75 - hole} 75a${hole} ${hole} 0 1 0 ${hole * 2} 0a${hole} ${hole} 0 1 0 ${-hole * 2} 0Z`
}

/** Starts from rest and lands softly: for moves of something standing still. */
const glide = Easing.bezier(0.45, 0, 0.1, 1)

/** 9 · The dot, refined: it lands with a little give, stays put while the
 *  square grows round-first around it and its own dot opens where it stood,
 *  then the mark glides once to its place and uncovers the letters. A slow
 *  push keeps the hold alive. */
function DotRefined({ frame }: { frame: number }) {
  const land = springAt(frame, 0, { damping: 12, stiffness: 220, mass: 0.5 })
  const grow = progress(frame, 30, 48, ease.out)
  const round = 1 - progress(frame, 30, 40, ease.soft)
  const x1 = lerp(86, 100, grow)
  // Opens as soon as the square has room around it, never touching an edge.
  const hole =
    frame < 30
      ? 0
      : Math.min(11, x1 - 75 - 4) * progress(frame, 33, 24, ease.out)

  const move = progress(frame, 90, 60, glide)
  const x = lerp(W / 2 - 75 * K, LEFT, move)
  const zoom = lerp(1, 1.02, progress(frame, 0, OPTION_FRAMES, ease.soft))

  return (
    <div
      className="absolute inset-0"
      style={{
        transform: `scale(${zoom})`,
        transformOrigin: `${W / 2}px ${CY}px`,
      }}
    >
      <Wordmark
        x={x}
        mark={grownMark(grow, round, Math.max(0, hole))}
        markStyle={{
          opacity: progress(frame, 0, 6, ease.linear),
          transform: `scale(${land})`,
          transformOrigin: "75px 75px",
        }}
        letterClip={[106, -40, 260, 180]}
        letter={(i) => {
          const at = 94 + i * 3
          const p = progress(frame, at, 56, glide)
          return {
            opacity: clamp01(progress(frame, at, 30, ease.soft) * 1.2),
            transform: `translateX(${lerp(-28, 0, p)}px)`,
          }
        }}
      />
      <Address frame={frame} at={150} />
    </div>
  )
}

export const OPTIONS = [
  ["settle", Settle],
  ["focus", Focus],
  ["wipe", Wipe],
  ["rise", Rise],
  ["mark-first", MarkFirst],
  ["dot", Dot],
  ["hairline", Hairline],
  ["light", Light],
  ["dot-refined", DotRefined],
] as const

export function LogoOption({ index, frame }: { index: number; frame: number }) {
  const Option = OPTIONS[index]![1]
  return (
    <Theme mode="dark">
      <div className="absolute inset-0 overflow-hidden bg-bg text-fg">
        <Option frame={frame} />
      </div>
    </Theme>
  )
}
