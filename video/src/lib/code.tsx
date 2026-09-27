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

/* Frame-driven magic move: the same keyed-token diff the site's composition
   animation uses (shiki-magic-move's core + the tag-punctuation fixes from
   www/src/modules/internal/composition-animation.tsx), but positions come from
   monospace line/column math and every frame is a pure function of time. */

type Step = { from: KeyedTokensInfo; to: KeyedTokensInfo }
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
    previous = to
    return { from, to }
  })
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

/**
 * Renders `codes[i]` from frame `at[i]`, morphing from the previous snippet
 * over `duration` frames. Moving tokens slide on a quint in-out; departing
 * tokens fade in the first 40%; arriving ones blur in over the last 55%.
 */
export function MagicCode({
  codes,
  at,
  duration = 40,
  fontSize = 22,
  lineHeight = 1.7,
  style,
}: {
  codes: readonly string[]
  at: readonly number[]
  duration?: number
  fontSize?: number
  lineHeight?: number
  style?: CSSProperties
}) {
  const frame = useCurrentFrame()
  const steps = useMemo(() => codeSteps(codes), [codes])
  const placed = useMemo(
    () => steps.map((s) => ({ from: place(s.from), to: place(s.to) })),
    [steps],
  )
  let i = -1
  for (let k = 0; k < at.length; k++) if (frame >= at[k]!) i = k
  if (i < 0) return null
  const t = clamp01((frame - at[i]!) / duration)
  const move = ease.inOut(t)
  const { from, to } = placed[i]!
  const height = lerp(lineCount(steps[i]!.from), lineCount(steps[i]!.to), move)

  const nodes: React.ReactNode[] = []
  for (const [key, p] of to) {
    const prev = from.get(key)
    let line = p.line
    let col = p.col
    let opacity = 1
    let blur = 0
    if (prev) {
      line = lerp(prev.line, p.line, move)
      col = lerp(prev.col, p.col, move)
    } else {
      const e = ease.out(clamp01((t - 0.45) / 0.55))
      opacity = e
      blur = (1 - e) * 6
    }
    nodes.push(tokenSpan(key, p.token, line, col, opacity, blur, lineHeight))
  }
  for (const [key, p] of from) {
    if (to.has(key)) continue
    const e = ease.in(clamp01(t / 0.4))
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
