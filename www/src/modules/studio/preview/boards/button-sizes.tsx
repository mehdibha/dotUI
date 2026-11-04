"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"

import { PlusIcon } from "@/registry/icons"
import { cn } from "@/registry/lib/utils"
import { Button } from "@/registry/ui/button"

import { Board, useBoardFocus } from "./board"
import { CANVAS } from "./set-parts"

const SIZES = [
  { id: "xs", label: "XS" },
  { id: "sm", label: "SM" },
  { id: "md", label: "MD" },
  { id: "lg", label: "LG" },
] as const

type Size = (typeof SIZES)[number]["id"]

/** How much bigger the anatomy draws the button. */
const SCALE = 4

// Measures in a muted foreground; Figma's selection blue marks frames.
const MEASURE = "color-mix(in oklab, var(--color-fg) 45%, transparent)"
const SELECTION = "#0D99FF"

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
  font: number
  radius: number
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

/** A value tag, the way design tools label a measure. */
function Tag({
  className,
  style,
  children,
}: {
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        "absolute rounded-[5px] px-1.5 py-1 text-[11px] leading-none font-medium whitespace-nowrap text-bg tabular-nums",
        className,
      )}
      style={{ background: "var(--color-fg)", ...style }}
    >
      {children}
    </span>
  )
}

/** How far a bracket's end ticks reach toward what it measures. */
const TICK = 6

/** A measure as design tools draw one: a bracket whose ticks point at the
 *  part, its value tagged on the far side. `at` is the bracket's line, in
 *  scaled px; `from` and `length` span the part, in the button's px. */
function Bracket({
  side,
  at,
  from,
  length,
  value,
}: {
  side: "left" | "top" | "bottom"
  at: number
  from: number
  length: number
  value: string
}) {
  if (length <= 0) return null
  const line = `1px solid ${MEASURE}`
  if (side === "left")
    return (
      <div
        className="absolute"
        style={{
          left: at,
          top: from * SCALE,
          width: TICK,
          height: length * SCALE,
          borderLeft: line,
          borderTop: line,
          borderBottom: line,
        }}
      >
        <Tag className="top-1/2 right-full mr-2 -translate-y-1/2">{value}</Tag>
      </div>
    )
  const top = side === "top"
  return (
    <div
      className="absolute"
      style={{
        left: from * SCALE,
        top: top ? at - TICK : at,
        width: length * SCALE,
        height: TICK,
        borderLeft: line,
        borderRight: line,
        [top ? "borderTop" : "borderBottom"]: line,
      }}
    >
      <Tag
        className={cn(
          "left-1/2 -translate-x-1/2",
          top ? "bottom-full mb-2" : "top-full mt-2",
        )}
      >
        {value}
      </Tag>
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
    const next: Measures = {
      button: boxOf(el, origin),
      icon: boxOf(icon, origin),
      label: boxOf(label, origin),
      font: parseFloat(getComputedStyle(label).fontSize),
      radius: parseFloat(getComputedStyle(el).borderTopLeftRadius),
    }
    setM((prev) =>
      JSON.stringify(prev) === JSON.stringify(next) ? prev : next,
    )
  })
  const w = m?.button.width ?? 0
  const h = m?.button.height ?? 0
  const iconEnd = m ? m.icon.left + m.icon.width : 0
  const labelEnd = m ? m.label.left + m.label.width : 0
  return (
    <div className="relative" style={{ width: w * SCALE, height: h * SCALE }}>
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
              outline: `1px dashed ${MEASURE}`,
            }}
          />
          <Bracket side="left" at={-24} from={0} length={h} value={num(h)} />
          <Bracket
            side="top"
            at={-12}
            from={0}
            length={m.icon.left}
            value={num(m.icon.left)}
          />
          <Bracket
            side="top"
            at={-12}
            from={iconEnd}
            length={m.label.left - iconEnd}
            value={num(m.label.left - iconEnd)}
          />
          <Bracket
            side="top"
            at={-12}
            from={labelEnd}
            length={w - labelEnd}
            value={num(w - labelEnd)}
          />
          <Bracket
            side="bottom"
            at={h * SCALE + 12}
            from={m.icon.left}
            length={m.icon.width}
            value={`Icon ${num(m.icon.width)}`}
          />
          <Bracket
            side="bottom"
            at={h * SCALE + 12}
            from={m.label.left}
            length={m.label.width}
            value={`Text ${num(m.font)}`}
          />
          <Tag className="top-0 left-full ml-4">Radius {num(m.radius)}</Tag>
        </>
      )}
    </div>
  )
}

/** A named frame on the canvas, blue while it is the one being edited. */
function Frame({
  name,
  selected,
  children,
}: {
  name: string
  selected?: boolean
  children: React.ReactNode
}) {
  const color = selected ? SELECTION : undefined
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <span
        className={cn(
          "text-[11px] leading-none font-medium",
          !selected && "text-fg-muted",
        )}
        style={{ color }}
      >
        {name}
      </span>
      <div
        className={cn(
          "rounded-md border border-dashed bg-bg",
          !selected && "border-fg-muted/40",
        )}
        style={{ borderColor: color }}
      >
        {children}
      </div>
    </div>
  )
}

/** The size the panel has open; the switch here picks another. */
function useSize() {
  const { axis } = useBoardFocus()
  const focused = SIZES.find(({ id }) => axis === `size-${id}`)?.id
  const [size, setSize] = useState<Size>(focused ?? "md")
  useEffect(() => {
    if (focused) setSize(focused)
  }, [focused])
  return [size, setSize] as const
}

export default function ButtonSizesBoard() {
  const [size, setSize] = useSize()
  return (
    <Board id="button-sizes" untitled className={CANVAS}>
      <div className="flex w-full max-w-3xl min-w-0 flex-col gap-8">
        <div className="grid grid-cols-4 gap-3">
          {SIZES.map(({ id, label }) => (
            <Frame key={id} name={label} selected={id === size}>
              <div className="flex h-28 items-center justify-center px-2">
                <Button size={id} variant="primary">
                  Button
                </Button>
              </div>
            </Frame>
          ))}
        </div>
        <Frame name="Anatomy" selected>
          <div className="relative flex min-h-96 items-center justify-center px-16 pt-24 pb-20">
            <div
              role="radiogroup"
              aria-label="Size"
              className="absolute top-4 left-4 inline-flex rounded-md bg-fg/6 p-0.5"
            >
              {SIZES.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  role="radio"
                  aria-checked={size === id}
                  onClick={() => setSize(id)}
                  className={cn(
                    "h-6 rounded-[5px] px-2.5 text-[11px] font-medium text-fg-muted transition-colors",
                    size === id && "bg-bg text-fg shadow-xs",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <Anatomy size={size} />
          </div>
        </Frame>
      </div>
    </Board>
  )
}
