import { useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { continueRender, delayRender } from "remotion"

import { facesReady } from "../../lib/theme"
import { HEADLINE, TYPE } from "../../lib/type"
import { Sentence } from "./sentence"

/** The sentence as laid out, in frame px: where the block sits, where line
 *  2's words start, and the final period's ink box. */
export type Layout = {
  /** Ink centre x. */
  x: number
  /** Ink bottom (a hair under the baseline — the glyph's overshoot). */
  bottom: number
  /** Ink size: the dot's diameter as the period. */
  d: number
  /** The sentence block's top, optically centred. */
  top: number
  /** Left edge of each of line 2's words. */
  words: number[]
}

/** Cap top of line 1 to baseline of line 2, centred a touch above middle. */
const OPTICAL = 532

/** A circle reads lighter than the square period it replaces. */
const OPTICAL_ROUND = 1.08

const FALLBACK: Layout = {
  x: 1386,
  bottom: 640,
  d: 20,
  top: 400,
  words: [532, 615, 995],
}

/* Measured once the faces are in, on a hidden, untransformed copy of the
   sentence: the pen position and baseline where the period glyph would be
   drawn, plus the glyph's ink box from canvas metrics. */
export function useLayout() {
  const probe = useRef<HTMLDivElement>(null)
  const [layout, setLayout] = useState<Layout>(FALLBACK)
  const [handle] = useState(() => delayRender("open layout"))
  useEffect(() => {
    let live = true
    void facesReady([]).then(() => {
      if (!live) return
      const measured = measure(probe.current)
      if (measured) flushSync(() => setLayout(measured))
      continueRender(handle)
    })
    return () => {
      live = false
    }
  }, [handle])
  const probeNode = (
    <div
      ref={probe}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        visibility: "hidden",
        pointerEvents: "none",
      }}
    >
      <Sentence top={0} probe />
    </div>
  )
  return { layout, probe: probeNode }
}

function measure(root: HTMLDivElement | null): Layout | null {
  const pen = root?.querySelector("[data-pen]")
  const base1 = root?.querySelector("[data-base1]")
  if (!root || !pen || !base1) return null
  const frame = root.getBoundingClientRect()
  const k = frame.width / 1920
  const penRect = pen.getBoundingClientRect()
  const penX = (penRect.left - frame.left) / k
  const baseline2 = (penRect.top - frame.top) / k
  const baseline1 = (base1.getBoundingClientRect().top - frame.top) / k
  const words = [...root.querySelectorAll("[data-word]")].map(
    (el) => (el.getBoundingClientRect().left - frame.left) / k,
  )

  const ctx = document.createElement("canvas").getContext("2d")!
  ctx.font = `${HEADLINE.fontWeight} ${TYPE.statement}px ${HEADLINE.fontFamily}`
  const dot = ctx.measureText(".")
  const cap = ctx.measureText("H").actualBoundingBoxAscent
  const w = dot.actualBoundingBoxRight + dot.actualBoundingBoxLeft
  const h = dot.actualBoundingBoxAscent + dot.actualBoundingBoxDescent

  const top = OPTICAL - (baseline1 - cap + baseline2) / 2
  return {
    x: penX + (dot.actualBoundingBoxRight - dot.actualBoundingBoxLeft) / 2,
    bottom: top + baseline2 + dot.actualBoundingBoxDescent,
    d: ((w + h) / 2) * OPTICAL_ROUND,
    top,
    words,
  }
}
