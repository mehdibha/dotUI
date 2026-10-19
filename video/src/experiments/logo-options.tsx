import type { CSSProperties } from "react"

import { ease, lerp, progress } from "../lib/motion"
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
      </defs>
      <g clipPath={clip ? "url(#clip)" : undefined}>
        <g style={{ transformOrigin: "50px 50px", ...markStyle }}>
          <path d={mark} fill={fill} fillRule="evenodd" />
          {sheen !== undefined && (
            <path d={mark} fill="url(#sheen)" fillRule="evenodd" />
          )}
        </g>
        {LETTERS.map((d, i) => (
          <g key={i} style={letter?.(i)}>
            <path d={d} fill={fill} />
            {sheen !== undefined && <path d={d} fill="url(#sheen)" />}
          </g>
        ))}
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

export const OPTIONS = [
  ["settle", Settle],
  ["focus", Focus],
  ["wipe", Wipe],
  ["rise", Rise],
  ["mark-first", MarkFirst],
  ["dot", Dot],
  ["hairline", Hairline],
  ["light", Light],
] as const

export function LogoOption({
  index,
  frame,
}: {
  index: number
  frame: number
}) {
  const Option = OPTIONS[index]![1]
  return (
    <Theme mode="dark">
      <div className="absolute inset-0 overflow-hidden bg-bg text-fg">
        <Option frame={frame} />
      </div>
    </Theme>
  )
}
