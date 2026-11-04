"use client"

import { useLayoutEffect, useRef, useState } from "react"

import { PlusIcon } from "@/registry/icons"
import { Button } from "@/registry/ui/button"

import { Board, BoardSection, Specimen, useBoardFocus } from "./board"

const SIZES = [
  { id: "xs", label: "XS" },
  { id: "sm", label: "SM" },
  { id: "md", label: "MD" },
  { id: "lg", label: "LG" },
] as const

type Size = (typeof SIZES)[number]["id"]

/** How much bigger the anatomy draws the button. */
const SCALE = 4

/** Redline ink: annotation, not the system's own color. */
const INK = "#f43f5e"

interface Box {
  left: number
  top: number
  width: number
  height: number
}

interface Measures {
  button: Box
  icon: Box
  label: Box
  font: string
  radius: string
}

/** `el`'s box in the button's unscaled px. */
function boxOf(el: Element, origin: DOMRect): Box {
  const r = el.getBoundingClientRect()
  return {
    left: (r.left - origin.left) / SCALE,
    top: (r.top - origin.top) / SCALE,
    width: r.width / SCALE,
    height: r.height / SCALE,
  }
}

const num = (value: number) => `${Math.round(value * 10) / 10}`

/** A dimension: a line across `length` with its value beside it. */
function Dimension({
  x,
  y,
  length,
  vertical,
  below,
  value,
}: {
  x: number
  y: number
  length: number
  vertical?: boolean
  /** The value under the line, not over it. */
  below?: boolean
  value: string
}) {
  return (
    <div
      className="absolute flex items-center justify-center"
      style={{
        left: x * SCALE,
        top: y * SCALE,
        width: vertical ? 0 : length * SCALE,
        height: vertical ? length * SCALE : 0,
        borderLeft: vertical ? `1px solid ${INK}` : undefined,
        borderTop: vertical ? undefined : `1px solid ${INK}`,
      }}
    >
      <span
        className="absolute text-[11px] font-medium whitespace-nowrap tabular-nums"
        style={{
          color: INK,
          ...(vertical ? { right: 6 } : below ? { top: 4 } : { bottom: 4 }),
        }}
      >
        {value}
      </span>
    </div>
  )
}

/** One size drawn big, its measures read off the real button. */
function Anatomy({ size }: { size: Size }) {
  const button = useRef<HTMLButtonElement>(null)
  const [m, setM] = useState<Measures | null>(null)
  // Measured after every render: a Style, density or radius change restyles it.
  useLayoutEffect(() => {
    const el = button.current
    const icon = el?.querySelector("svg")
    const label = el?.querySelector("[data-label]")
    if (!el || !icon || !label) return
    const origin = el.getBoundingClientRect()
    const style = getComputedStyle(el)
    const next: Measures = {
      button: boxOf(el, origin),
      icon: boxOf(icon, origin),
      label: boxOf(label, origin),
      font: getComputedStyle(label).fontSize,
      radius: style.borderTopLeftRadius,
    }
    setM((prev) =>
      JSON.stringify(prev) === JSON.stringify(next) ? prev : next,
    )
  })
  const w = m?.button.width ?? 0
  const h = m?.button.height ?? 0
  return (
    <div
      className="relative mx-auto my-10"
      style={{ width: w * SCALE, height: h * SCALE }}
    >
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ transform: `scale(${SCALE})` }}
      >
        <Button ref={button} size={size} variant="primary">
          <PlusIcon />
          <span data-label="">Button</span>
        </Button>
      </div>
      {m && (
        <>
          <div
            className="absolute"
            style={{
              left: m.icon.left * SCALE,
              top: m.icon.top * SCALE,
              width: m.icon.width * SCALE,
              height: m.icon.height * SCALE,
              outline: `1px dashed ${INK}`,
            }}
          />
          <Dimension x={-4} y={0} length={h} vertical value={num(h)} />
          <Dimension
            x={0}
            y={-3}
            length={m.icon.left}
            value={num(m.icon.left)}
          />
          <Dimension
            x={m.icon.left + m.icon.width}
            y={-3}
            length={m.label.left - m.icon.left - m.icon.width}
            value={num(m.label.left - m.icon.left - m.icon.width)}
          />
          <Dimension
            x={m.label.left + m.label.width}
            y={-3}
            length={w - m.label.left - m.label.width}
            value={num(w - m.label.left - m.label.width)}
          />
          <Dimension
            x={m.icon.left}
            y={h + 3}
            length={m.icon.width}
            below
            value={`Icon ${num(m.icon.width)}`}
          />
          <Dimension
            x={m.label.left}
            y={h + 3}
            length={m.label.width}
            below
            value={`Text ${num(parseFloat(m.font))}`}
          />
          <span
            className="absolute text-[11px] font-medium whitespace-nowrap tabular-nums"
            style={{ color: INK, left: w * SCALE + 8, top: -6 }}
          >
            Radius {num(parseFloat(m.radius))}
          </span>
        </>
      )}
    </div>
  )
}

export default function ButtonSizesBoard() {
  const { axis } = useBoardFocus()
  const open = SIZES.find(({ id }) => axis === `size-${id}`)?.id ?? "md"
  return (
    <Board id="button-sizes">
      <BoardSection title="Sizes" className="items-end gap-10">
        {SIZES.map(({ id, label }) => (
          <Specimen key={id} label={label}>
            <Button size={id}>Button</Button>
          </Specimen>
        ))}
      </BoardSection>
      <BoardSection title={`Anatomy · ${open.toUpperCase()}`}>
        <Anatomy size={open} />
      </BoardSection>
    </Board>
  )
}
