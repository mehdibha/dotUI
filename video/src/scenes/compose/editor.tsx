import type { CSSProperties } from "react"

import {
  addedRows,
  arrivalFront,
  codeProgress,
  MagicCode,
  PHASE,
} from "../../lib/code"
import { clamp01, ease, lerp, progress } from "../../lib/motion"

/* A quiet dark editor: one tab, a gutter, the magic-moving source. Lines a
   step adds get a band that sweeps in with their tokens, so the eye finds the
   change. */

export const TAB_H = 62
export const PAD_Y = 26
export const LINE_H = 1.46
export const MONO = '"Geist Mono", ui-monospace, monospace'
const SANS = '"Geist Variable", ui-sans-serif, system-ui, sans-serif'
const BLUE = "121,184,255"

export const lineCount = (code: string) => code.split("\n").length

/** Where the code is at `frame`: the step, its move progress, font size, lines. */
export function codeAt(
  frame: number,
  codes: readonly string[],
  at: readonly number[],
  sizes: readonly number[],
  durations: readonly number[],
) {
  const { step: i, t, rows: move } = codeProgress(frame, at, durations)
  const prev = Math.max(0, i - 1)
  const fromLines = i === 0 ? 0 : lineCount(codes[prev]!)
  const toLines = lineCount(codes[i]!)
  return {
    step: i,
    t,
    move,
    fontSize: lerp(sizes[prev]!, sizes[i]!, move),
    fromLines,
    toLines,
    lines: lerp(Math.max(1, fromLines), toLines, move),
  }
}

export const editorHeight = (lines: number, fontSize: number) =>
  TAB_H + PAD_Y * 2 + lines * fontSize * LINE_H

export function Editor({
  codes,
  at,
  durations,
  frame,
  sizes,
  carets,
  accent = BLUE,
  style,
}: {
  codes: readonly string[]
  at: readonly number[]
  durations: readonly number[]
  frame: number
  sizes: readonly number[]
  /** Per step, the line the caret types along and rests at the end of. */
  carets?: readonly number[]
  /** "r,g,b" of the caret and the change bands. */
  accent?: string
  style?: CSSProperties
}) {
  const c = codeAt(frame, codes, at, sizes, durations)
  const duration = durations[c.step]!
  const gutter = Math.max(c.fromLines, c.toLines)
  const added = c.step === 0 ? [] : addedRows(codes[c.step - 1], codes[c.step]!)
  const since = frame - at[c.step]!
  // In step with MagicCode's arrivals, out a beat after they land.
  const sweep = progress(
    since,
    duration * PHASE.enter,
    duration * (1 - PHASE.enter),
    ease.out,
  )
  const fade = 1 - progress(since, duration + 30, 24, ease.soft)
  return (
    <div
      style={{
        borderRadius: 26,
        // Flat: a big near-black gradient bands after X's re-encode.
        background: "#141417",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.06), 0 60px 140px -40px rgba(0,0,0,0.95), 0 24px 60px -24px rgba(0,0,0,0.7)",
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          height: TAB_H,
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "0 24px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.015)",
        }}
      >
        <div style={{ display: "flex", gap: 9 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 14,
                height: 14,
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
            gap: 11,
            height: 38,
            padding: "0 16px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.06)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.05)",
            fontFamily: SANS,
            fontSize: 20,
            letterSpacing: "-0.01em",
            color: "rgba(250,250,250,0.82)",
          }}
        >
          <span
            style={{
              fontFamily: MONO,
              fontSize: 14,
              fontWeight: 500,
              color: `rgb(${BLUE})`,
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
          padding: `${PAD_Y}px 28px ${PAD_Y}px 14px`,
          fontSize: c.fontSize,
        }}
      >
        {sweep * fade > 0.001
          ? added.map((line) => (
              <div
                key={line}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: `calc(${PAD_Y}px + ${line * LINE_H}em)`,
                  height: `${LINE_H}em`,
                  opacity: fade * clamp01(sweep * 3),
                  clipPath: `inset(0 ${(1 - sweep) * 100}% 0 0)`,
                  background: `linear-gradient(90deg, rgba(${accent},0.16), rgba(${accent},0.05) 70%, rgba(${accent},0))`,
                  boxShadow: `inset 3px 0 0 rgba(${accent},0.75)`,
                }}
              />
            ))
          : null}
        <div
          style={{
            position: "relative",
            width: "2ch",
            flex: "none",
            fontFamily: MONO,
            color: "rgba(250,250,250,0.22)",
            textAlign: "right",
            marginRight: "1.3ch",
          }}
        >
          {Array.from({ length: gutter }, (_, n) => {
            const growing = c.toLines >= c.fromLines
            const extra = n >= Math.min(c.fromLines, c.toLines)
            const o = extra ? (growing ? c.move : 1 - c.move) : 1
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
        <div style={{ position: "relative", flex: 1 }}>
          <MagicCode
            codes={codes}
            at={at}
            duration={durations}
            fontSize={c.fontSize}
            lineHeight={LINE_H}
          />
          {carets ? (
            <Caret
              accent={accent}
              frame={frame}
              line={carets[c.step]!}
              code={codes[c.step]!}
              t={c.step === 0 ? 1 : c.t}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}

/* The caret rides the arrival sweep along the step's key line, then rests at
   its end and blinks on the beat. Hidden while rows make room. */
function Caret({
  accent,
  frame,
  line,
  code,
  t,
}: {
  accent: string
  frame: number
  line: number
  code: string
  t: number
}) {
  if (t < PHASE.enter) return null
  const lines = code.split("\n")
  const text = lines[line] ?? ""
  const indent = text.length - text.trimStart().length
  const end = text.trimEnd().length
  const widest = Math.max(...lines.map((l) => l.trimEnd().length))
  const col = Math.min(end, Math.max(indent, arrivalFront(t, widest)))
  const on = col < end || frame % 30 < 18
  return (
    <div
      style={{
        position: "absolute",
        fontFamily: MONO,
        left: `${col + 0.1}ch`,
        top: `${line * LINE_H + (LINE_H - 1.18) / 2}em`,
        width: "0.1em",
        height: "1.18em",
        borderRadius: 2,
        background: `rgb(${accent})`,
        opacity: on ? 1 : 0,
      }}
    />
  )
}
