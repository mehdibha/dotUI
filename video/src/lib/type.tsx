import type { CSSProperties, ReactNode } from "react"
import { AbsoluteFill, useCurrentFrame } from "remotion"

import { clamp01, ease, lerp, progress } from "./motion"

/* The film's typographic voice is the landing hero's: Geist at normal weight,
   very tight tracking, a muted second line. Words resolve out of blur with no
   travel (the hero word swap), arriving on expo-out, leaving on cubic-in. */

export const HEADLINE: CSSProperties = {
  fontFamily: '"Geist Variable", ui-sans-serif, system-ui, sans-serif',
  fontWeight: 450,
  letterSpacing: "-0.055em",
  lineHeight: 1.04,
  fontFeatureSettings: '"calt" 0, "rlig", "ss11"',
  color: "#fafafa",
}

export const MUTED = "rgba(250,250,250,0.46)"

/* One type scale for the whole film. Statements are the big lines; labels
   name an axis or a step; the tagline is the End's second voice. Anchors:
   optical centre, or top-anchored with the cap line at TOP_ANCHOR. */
export const TYPE = {
  statement: 128,
  label: 80,
  tagline: 44,
  /** Calls to action and on-screen proof (a URL, a CTA pill, a caption). */
  cta: 48,
  /** Smallest UI text meant to be read, as it lands on screen (px at 1080p). */
  minReadable: 22,
} as const
export const TOP_ANCHOR = 150

/**
 * Words that blur-resolve in one after another from `start`, then (optionally)
 * blur out together at `end`. `stagger` is frames between words.
 */
export function BlurWords({
  text,
  start,
  end,
  stagger = 4,
  duration = 26,
  exit = 14,
  blur = 14,
  rise = 0,
  style,
  wordStyle,
}: {
  text: string
  start: number
  end?: number
  stagger?: number
  duration?: number
  exit?: number
  blur?: number
  /** Optional travel in px (the hero uses none). */
  rise?: number
  style?: CSSProperties
  wordStyle?: (index: number) => CSSProperties | undefined
}) {
  const frame = useCurrentFrame()
  const words = text.split(" ")
  const out = end === undefined ? 0 : progress(frame, end, exit, ease.in)
  return (
    <span style={{ display: "inline", ...style }}>
      {words.map((word, i) => {
        const t = progress(frame, start + i * stagger, duration, ease.out)
        const o = t * (1 - out)
        const b = lerp(blur, 0, t) + out * blur
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              opacity: o,
              filter: b > 0.05 ? `blur(${b}px)` : undefined,
              transform: rise ? `translateY(${(1 - t) * rise}px)` : undefined,
              ...wordStyle?.(i),
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        )
      })}
    </span>
  )
}

/** A centered headline block (one or two lines) over the whole frame. */
export function Headline({
  lines,
  start,
  end,
  size = TYPE.statement,
  y = 0,
  align = "center",
  stagger = 4,
  lineGap = 10,
}: {
  /** Each line: text, and whether it's the muted second voice. */
  lines: Array<{ text: string; muted?: boolean; at?: number }>
  start: number
  end?: number
  size?: number
  /** Vertical offset from center, px. */
  y?: number
  align?: "center" | "left"
  stagger?: number
  lineGap?: number
}) {
  let offset = 0
  return (
    <AbsoluteFill
      style={{
        alignItems: align === "center" ? "center" : "flex-start",
        justifyContent: "center",
        padding: align === "left" ? "0 140px" : undefined,
        transform: `translateY(${y}px)`,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          ...HEADLINE,
          fontSize: size,
          textAlign: align,
          display: "flex",
          flexDirection: "column",
          gap: lineGap,
        }}
      >
        {lines.map((line, i) => {
          const s = line.at ?? start + offset
          offset += line.text.split(" ").length * stagger + 6
          return (
            <div key={i} style={{ color: line.muted ? MUTED : undefined }}>
              <BlurWords
                text={line.text}
                start={s}
                end={end}
                stagger={stagger}
              />
            </div>
          )
        })}
      </div>
    </AbsoluteFill>
  )
}

/** Small uppercase-free label used for axis names, chips, captions. */
export function Label({
  children,
  style,
}: {
  children: ReactNode
  style?: CSSProperties
}) {
  return (
    <span
      style={{
        ...HEADLINE,
        fontSize: 28,
        letterSpacing: "-0.02em",
        fontWeight: 500,
        ...style,
      }}
    >
      {children}
    </span>
  )
}

/** Reveal a value (0→1) as a count-up string, e.g. component counts. */
export function countUp(
  frame: number,
  start: number,
  duration: number,
  to: number,
) {
  return Math.round(to * ease.out(clamp01((frame - start) / duration)))
}
