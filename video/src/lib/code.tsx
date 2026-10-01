import type { CSSProperties } from "react"
import { useMemo } from "react"
import {
  DIFF_DELETE,
  DIFF_EQUAL,
  DIFF_INSERT,
  diffCleanupSemanticLossless,
  type Diff,
} from "diff-match-patch-es"
import { useCurrentFrame } from "remotion"
import { syncTokenKeys, toKeyedTokens } from "shiki-magic-move/core"
import type { KeyedToken, KeyedTokensInfo } from "shiki-magic-move/types"

import { tokenizeTsx } from "@/modules/docs/highlight"

import { clamp01, ease, lerp } from "./motion"

/* Frame-driven magic move. Lines whose text survives a step (indentation
   aside) move as rigid rows, so their punctuation can never detach, and a
   block that shifts cascades bottom-first so rows never cross. Lines that
   changed fall back to the site's keyed-token diff (shiki-magic-move's core +
   the tag-punctuation fixes from composition-animation.tsx). Positions come
   from monospace line/column math; every frame is a pure function of time. */

type Step = {
  from: KeyedTokensInfo
  to: KeyedTokensInfo
  /** to line → from line, for lines whose trimmed text is unchanged. */
  rows: Map<number, number>
}
type Placed = { token: KeyedToken; line: number; col: number }

function keyed(code: string): KeyedTokensInfo {
  const lines = tokenizeTsx(code).map((line) =>
    line.map(({ content, offset, dark }) => ({ content, offset, color: dark })),
  )
  return { ...toKeyedTokens(code, lines), themeName: "dark" }
}

const EMPTY = toKeyedTokens("", [])

/** Key-synced transitions for a sequence of snippets: step i animates code[i-1] → code[i]. */
export function codeSteps(codes: readonly string[]): Step[] {
  let previous: KeyedTokensInfo = EMPTY
  return codes.map((code) => {
    const { from, to } = syncTokenKeys(previous, keyed(code), {
      diffCleanup: cleanupCodeDiff,
    })
    lockTagPunctuation(from, to)
    const rows = matchRows(from.code, to.code)
    previous = to
    return { from, to, rows }
  })
}

/** Lines of `next` that are new (not a surviving line of `prev`), 0-based. */
export function addedRows(prev: string | undefined, next: string) {
  const rows = matchRows(prev ?? "", next)
  return next.split("\n").flatMap((_, i) => (rows.has(i) ? [] : [i]))
}

/* Longest common subsequence over non-blank trimmed lines. */
function matchRows(from: string, to: string) {
  const a = from ? from.split("\n").map((l) => l.trim()) : []
  const b = to ? to.split("\n").map((l) => l.trim()) : []
  const n = a.length
  const m = b.length
  const dp = Array.from({ length: n + 1 }, () =>
    new Array<number>(m + 1).fill(0),
  )
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      dp[i]![j] =
        a[i] && a[i] === b[j]
          ? dp[i + 1]![j + 1]! + 1
          : Math.max(dp[i + 1]![j]!, dp[i]![j + 1]!)
    }
  }
  const rows = new Map<number, number>()
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (a[i] && a[i] === b[j]) rows.set(j++, i++)
    else if (dp[i + 1]![j]! >= dp[i]![j + 1]!) i++
    else j++
  }
  return rows
}

function place(info: KeyedTokensInfo): Map<string, Placed> {
  const out = new Map<string, Placed>()
  let line = 0
  let col = 0
  for (const token of info.tokens) {
    if (token.content === "\n") {
      line += 1
      col = 0
      continue
    }
    out.set(token.key, { token, line, col })
    col += token.content.length
  }
  return out
}

const lineCount = (info: KeyedTokensInfo) =>
  info.code ? info.code.split("\n").length : 0

const indents = (code: string) =>
  code.split("\n").map((l) => l.length - l.trimStart().length)

/** Where each moving row starts within the move (0…span): bottom-first when
 *  rows travel down, top-first when they travel up, so they never cross. */
function rowDelays(rows: Map<number, number>, span: number) {
  const moving = [...rows].filter(([to, from]) => to !== from)
  const delays = new Map<number, number>()
  if (moving.length < 2 || span <= 0) return delays
  const down = moving.filter(([to, from]) => to > from).map(([to]) => to)
  const up = moving.filter(([to, from]) => to < from).map(([to]) => to)
  const spread = (lines: number[], bottomFirst: boolean) => {
    if (lines.length === 0) return
    const lo = Math.min(...lines)
    const hi = Math.max(...lines)
    for (const l of lines) {
      const rank = hi === lo ? 0 : (bottomFirst ? hi - l : l - lo) / (hi - lo)
      delays.set(l, rank * span)
    }
  }
  spread(down, true)
  spread(up, false)
  return delays
}

/* The phases of one move, as fractions of its duration: rows make room
   first, departures clear, then arrivals resolve into the space left. */
export const PHASE = {
  /** Rows (and the block's height) are settled by here. */
  rows: 0.62,
  exit: 0.3,
  /** Arrivals start here, sweeping left to right over `sweep`. */
  enter: 0.5,
  sweep: 0.2,
} as const

/** The column arrivals have resolved up to at move time `t`, for a snippet
 *  whose widest token starts at `widest` (e.g. to run a caret along it). */
export const arrivalFront = (t: number, widest: number) =>
  ((t - PHASE.enter - 0.04) / PHASE.sweep) * widest

const stepOf = (frame: number, at: readonly number[]) => {
  let i = -1
  for (let k = 0; k < at.length; k++) if (frame >= at[k]!) i = k
  return i
}

/** Move progress (0→1) of the step playing at `frame`: `t` is linear time,
 *  `rows` the eased row/height travel. */
export function codeProgress(
  frame: number,
  at: readonly number[],
  duration: number | readonly number[],
  curve: (t: number) => number = ease.camera,
) {
  const i = Math.max(0, stepOf(frame, at))
  const d = typeof duration === "number" ? duration : duration[i]!
  const t = clamp01((frame - at[i]!) / d)
  return { step: i, t, rows: curve(clamp01(t / PHASE.rows)) }
}

/**
 * Renders `codes[i]` from frame `at[i]`, morphing from the previous snippet
 * over `duration` frames (one for all steps, or one per step). Surviving rows
 * glide on `curve`, cascading over `stagger` of the move; departing tokens
 * fade out; arriving ones blur in once the rows have made room.
 */
export function MagicCode({
  codes,
  at,
  duration = 40,
  fontSize = 22,
  lineHeight = 1.7,
  stagger = 0.2,
  curve = ease.camera,
  style,
}: {
  codes: readonly string[]
  at: readonly number[]
  duration?: number | readonly number[]
  fontSize?: number
  lineHeight?: number
  /** Fraction of the move the row cascade spreads over (0 = one block). */
  stagger?: number
  curve?: (t: number) => number
  style?: CSSProperties
}) {
  const frame = useCurrentFrame()
  const steps = useMemo(() => codeSteps(codes), [codes])
  const span = Math.min(stagger, PHASE.rows * 0.6)
  const placed = useMemo(
    () =>
      steps.map((s) => ({
        from: place(s.from),
        to: place(s.to),
        indentFrom: indents(s.from.code),
        indentTo: indents(s.to.code),
        fromRows: new Set(s.rows.values()),
        delays: rowDelays(s.rows, span),
      })),
    [steps, span],
  )
  if (stepOf(frame, at) < 0) return null
  const { step: i, t, rows: move } = codeProgress(frame, at, duration, curve)
  const { rows } = steps[i]!
  const { from, to, indentFrom, indentTo, fromRows, delays } = placed[i]!
  const height = lerp(lineCount(steps[i]!.from), lineCount(steps[i]!.to), move)
  const widest = Math.max(1, ...[...to.values()].map((p) => p.col))

  const nodes: React.ReactNode[] = []
  for (const [key, p] of to) {
    const row = rows.get(p.line)
    let line = p.line
    let col = p.col
    let opacity = 1
    let blur = 0
    if (row !== undefined) {
      const delay = delays.get(p.line) ?? 0
      const r = curve(clamp01((t - delay) / (PHASE.rows - span)))
      line = lerp(row, p.line, r)
      col = lerp(p.col + indentFrom[row]! - indentTo[p.line]!, p.col, r)
    } else {
      const prev = from.get(key)
      if (prev && !fromRows.has(prev.line)) {
        line = lerp(prev.line, p.line, move)
        col = lerp(prev.col, p.col, move)
      } else {
        const start = PHASE.enter + (p.col / widest) * PHASE.sweep
        const e = ease.out(
          clamp01((t - start) / (1 - PHASE.enter - PHASE.sweep)),
        )
        opacity = e
        blur = (1 - e) * 6
      }
    }
    nodes.push(tokenSpan(key, p.token, line, col, opacity, blur, lineHeight))
  }
  for (const [key, p] of from) {
    if (fromRows.has(p.line)) continue
    const next = to.get(key)
    if (next && !rows.has(next.line)) continue
    const e = ease.in(clamp01(t / PHASE.exit))
    if (e >= 1) continue
    nodes.push(
      tokenSpan(`out-${key}`, p.token, p.line, p.col, 1 - e, e * 6, lineHeight),
    )
  }

  return (
    <div
      style={{
        position: "relative",
        fontFamily: '"Geist Mono", ui-monospace, monospace',
        fontSize,
        height: `${height * lineHeight}em`,
        whiteSpace: "pre",
        ...style,
      }}
    >
      {nodes}
    </div>
  )
}

function tokenSpan(
  key: string,
  token: KeyedToken,
  line: number,
  col: number,
  opacity: number,
  blur: number,
  lineHeight: number,
) {
  return (
    <span
      key={key}
      style={{
        position: "absolute",
        left: `${col}ch`,
        top: `${line * lineHeight}em`,
        lineHeight,
        color: token.color,
        opacity,
        filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
      }}
    >
      {token.content}
    </span>
  )
}

/* --- Diff fixes, verbatim from the site's composition animation. --------- */

const WORD = /[A-Za-z0-9]/

function cleanupCodeDiff(diffs: Diff[]): Diff[] {
  diffCleanupSemanticLossless(diffs)
  let from = ""
  let to = ""
  for (const [op, text] of diffs) {
    if (op !== DIFF_INSERT) from += text
    if (op !== DIFF_DELETE) to += text
  }
  const out: Diff[] = []
  let offFrom = 0
  let offTo = 0
  let lineFrom = 0
  let lineTo = 0
  for (const [op, text] of diffs) {
    let demote = false
    if (op === DIFF_EQUAL && lineFrom !== lineTo) {
      let core = text
      const end = text.length
      if (
        WORD.test(core[0] ?? "") &&
        (WORD.test(from[offFrom - 1] ?? "") || WORD.test(to[offTo - 1] ?? ""))
      ) {
        core = core.replace(/^[A-Za-z0-9]+/, "")
      }
      if (
        WORD.test(core[core.length - 1] ?? "") &&
        (WORD.test(from[offFrom + end] ?? "") ||
          WORD.test(to[offTo + end] ?? ""))
      ) {
        core = core.replace(/[A-Za-z0-9]+$/, "")
      }
      demote = !WORD.test(core)
    }
    if (demote) out.push([DIFF_DELETE, text], [DIFF_INSERT, text])
    else out.push([op, text])
    const lines = text.split("\n").length - 1
    if (op !== DIFF_INSERT) {
      offFrom += text.length
      lineFrom += lines
    }
    if (op !== DIFF_DELETE) {
      offTo += text.length
      lineTo += lines
    }
  }
  return out
}

const TAG_NAME = /^[A-Za-z][\w.]*$/

function lockTagPunctuation(from: KeyedTokensInfo, to: KeyedTokensInfo) {
  const fromByKey = new Map(from.tokens.map((t) => [t.key, t]))
  const toByKey = new Map(to.tokens.map((t) => [t.key, t]))
  const bound = new Set<KeyedToken>()
  let freed = 0

  const bind = (target: KeyedToken, key: string) => {
    bound.add(target)
    if (target.key === key) return
    const holder = toByKey.get(key)
    if (holder) {
      holder.key = `${to.hash}-freed-${freed++}`
      toByKey.set(holder.key, holder)
    }
    toByKey.delete(target.key)
    target.key = key
    toByKey.set(key, target)
  }

  const closeOf = (tokens: KeyedToken[], nameIdx: number) => {
    for (const token of tokens.slice(nameIdx + 1)) {
      const c = token.content
      if (c === "\n" || c.includes("<")) return undefined
      if (c.includes(">")) return token
    }
    return undefined
  }

  for (let i = 1; i < to.tokens.length; i++) {
    const name = to.tokens[i]
    const bracket = to.tokens[i - 1]
    if (!name || !bracket) continue
    if (bracket.content !== "<" && bracket.content !== "</") continue
    if (!TAG_NAME.test(name.content)) continue
    const fromName = fromByKey.get(name.key)
    if (!fromName) continue
    const fromIdx = from.tokens.indexOf(fromName)
    const fromBracket = fromIdx > 0 ? from.tokens[fromIdx - 1] : undefined
    if (fromBracket?.content !== bracket.content) continue
    bind(bracket, fromBracket.key)
    const toClose = closeOf(to.tokens, i)
    const fromClose = closeOf(from.tokens, fromIdx)
    if (toClose && fromClose && toClose.content === fromClose.content) {
      bind(toClose, fromClose.key)
    }
  }

  const lineOf = (source: string, offset: number) =>
    source.slice(0, offset).split("\n").length
  for (const token of to.tokens) {
    if (bound.has(token)) continue
    const partner = fromByKey.get(token.key)
    if (!partner) continue
    const c = token.content
    if (c.trim() === "" || WORD.test(c)) continue
    if (lineOf(from.code, partner.offset) !== lineOf(to.code, token.offset)) {
      toByKey.delete(token.key)
      token.key = `${to.hash}-freed-${freed++}`
      toByKey.set(token.key, token)
    }
  }
}
