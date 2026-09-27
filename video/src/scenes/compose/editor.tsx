import type { CSSProperties } from "react"

import { MagicCode } from "../../lib/code"
import { clamp01, ease, lerp, progress } from "../../lib/motion"

/* A quiet dark editor: one tab, a gutter, the magic-moving source. The code
   zooms out a touch as it grows, so the whole snippet always reads at once,
   and lines a step adds glow briefly so the eye finds the change. */

export const TAB_H = 52
export const PAD_Y = 30
export const LINE_H = 1.62
const MONO = '"Geist Mono", ui-monospace, monospace'
const SANS = '"Geist Variable", ui-sans-serif, system-ui, sans-serif'

export const lineCount = (code: string) => code.split("\n").length

/** Where the code is at `frame`: the step, its move progress, font size, lines. */
export function codeAt(
  frame: number,
  codes: readonly string[],
  at: readonly number[],
  sizes: readonly number[],
  duration: number,
) {
  let i = 0
  for (let k = 0; k < at.length; k++) if (frame >= at[k]!) i = k
  const t = ease.inOut(clamp01((frame - at[i]!) / duration))
  const prev = Math.max(0, i - 1)
  const fromLines = i === 0 ? 0 : lineCount(codes[prev]!)
  const toLines = lineCount(codes[i]!)
  return {
    step: i,
    t,
    fontSize: lerp(sizes[prev]!, sizes[i]!, t),
    fromLines,
    toLines,
    lines: lerp(Math.max(1, fromLines), toLines, t),
  }
}

export const editorHeight = (lines: number, fontSize: number) =>
  TAB_H + PAD_Y * 2 + lines * fontSize * LINE_H

/** Lines of `next` whose text (indentation aside) wasn't in `prev`. */
function addedLines(prev: string | undefined, next: string) {
  const pool = new Map<string, number>()
  for (const line of prev?.split("\n") ?? []) {
    const k = line.trim()
    pool.set(k, (pool.get(k) ?? 0) + 1)
  }
  const out: number[] = []
  next.split("\n").forEach((line, i) => {
    const k = line.trim()
    const n = pool.get(k) ?? 0
    if (n > 0) pool.set(k, n - 1)
    else out.push(i)
  })
  return out
}

export function Editor({
  codes,
  at,
  duration,
  frame,
  sizes,
  style,
}: {
  codes: readonly string[]
  at: readonly number[]
  duration: number
  frame: number
  sizes: readonly number[]
  style?: CSSProperties
}) {
  const c = codeAt(frame, codes, at, sizes, duration)
  const gutter = Math.max(c.fromLines, c.toLines)
  const added =
    c.step === 0 ? [] : addedLines(codes[c.step - 1], codes[c.step]!)
  const since = frame - at[c.step]!
  const glow =
    progress(since, duration * 0.45, 14, ease.out) *
    (1 - progress(since, duration + 18, 26, ease.soft))
  return (
    <div
      style={{
        borderRadius: 22,
        background:
          "linear-gradient(180deg, rgba(24,24,28,0.97) 0%, rgba(13,13,16,0.98) 100%)",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.075), inset 0 1px 0 rgba(255,255,255,0.06), 0 50px 120px -30px rgba(0,0,0,0.9), 0 20px 50px -20px rgba(0,0,0,0.7)",
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          height: TAB_H,
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: "0 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.015)",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 12,
                height: 12,
                borderRadius: 99,
                background: "rgba(255,255,255,0.13)",
              }}
            />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            height: 32,
            padding: "0 14px",
            borderRadius: 9,
            background: "rgba(255,255,255,0.06)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)",
            fontFamily: SANS,
            fontSize: 15,
            letterSpacing: "-0.01em",
            color: "rgba(250,250,250,0.82)",
          }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontSize: 11,
              fontWeight: 500,
              color: "#79B8FF",
            }}
          >
            TSX
          </span>
          newsletter.tsx
        </div>
      </div>
      <div
        style={{
          position: "relative",
          display: "flex",
          padding: `${PAD_Y}px 36px ${PAD_Y}px 18px`,
          fontSize: c.fontSize,
        }}
      >
        {glow > 0.001
          ? added.map((line) => (
              <div
                key={line}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: `calc(${PAD_Y}px + ${line * LINE_H}em)`,
                  height: `${LINE_H}em`,
                  opacity: glow,
                  background:
                    "linear-gradient(90deg, rgba(121,184,255,0.13), rgba(121,184,255,0.04) 70%, rgba(121,184,255,0))",
                  boxShadow: "inset 2px 0 0 rgba(121,184,255,0.7)",
                }}
              />
            ))
          : null}
        <div
          style={{
            position: "relative",
            width: "2.4em",
            flex: "none",
            fontFamily: MONO,
            color: "rgba(250,250,250,0.2)",
            textAlign: "right",
            marginRight: "1.1em",
          }}
        >
          {Array.from({ length: gutter }, (_, n) => {
            const growing = c.toLines >= c.fromLines
            const extra = n >= Math.min(c.fromLines, c.toLines)
            const o = extra ? (growing ? c.t : 1 - c.t) : 1
            return (
              <div
                key={n}
                style={{
                  position: "absolute",
                  right: 0,
                  top: `${n * LINE_H}em`,
                  lineHeight: LINE_H,
                  opacity: o,
                }}
              >
                {n + 1}
              </div>
            )
          })}
        </div>
        <MagicCode
          codes={codes}
          at={at}
          duration={duration}
          fontSize={c.fontSize}
          lineHeight={LINE_H}
          style={{ flex: 1 }}
        />
      </div>
    </div>
  )
}
