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

// Design-tool inks, not the system's: Figma's spacing red and selection blue.
const MEASURE = "#F24822"
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
  color = MEASURE,
  className,
  style,
  children,
}: {
  color?: string
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        "absolute rounded-[3px] px-1 py-0.5 text-[10px] leading-none font-medium whitespace-nowrap text-white tabular-nums",
        className,
      )}
      style={{ background: color, ...style }}
    >
      {children}
    </span>
  )
}

/** A spacing zone: tinted, its width tagged at its center. */
function Zone({
  x,
  width,
  height,
}: {
  x: number
  width: number
  height: number
}) {
  if (width <= 0) return null
  return (
    <div
      className="absolute top-0 flex items-center justify-center"
      style={{
        left: x * SCALE,
        width: width * SCALE,
        height: height * SCALE,
        background: `color-mix(in srgb, ${MEASURE} 14%, transparent)`,
      }}
    >
      <Tag className="static">{num(width)}</Tag>
    </div>
  )
}

/** A dashed outline on a part, its size tagged under the button. */
function Part({ box, below, tag }: { box: Box; below: number; tag: string }) {
  return (
    <>
      <div
        className="absolute"
        style={{
          left: box.left * SCALE,
          top: box.top * SCALE,
          width: box.width * SCALE,
          height: box.height * SCALE,
          outline: `1px dashed ${SELECTION}`,
        }}
      />
      <Tag
        color={SELECTION}
        className="-translate-x-1/2"
        style={{
          left: (box.left + box.width / 2) * SCALE,
          top: below * SCALE + 10,
        }}
      >
        {tag}
      </Tag>
    </>
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
          {/* The zones keep to the button's own corners. */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ borderRadius: m.radius * SCALE }}
          >
            <Zone x={0} width={m.icon.left} height={h} />
            <Zone x={iconEnd} width={m.label.left - iconEnd} height={h} />
            <Zone x={labelEnd} width={w - labelEnd} height={h} />
          </div>
          <Part box={m.icon} below={h} tag={`Icon ${num(m.icon.width)}`} />
          <Part box={m.label} below={h} tag={`Text ${num(m.font)}`} />
          {/* Height: a bracket left of the button. */}
          <div
            className="absolute top-0 -left-6 w-2 border-y border-l"
            style={{ height: h * SCALE, borderColor: MEASURE }}
          >
            <Tag className="top-1/2 right-full mr-1.5 -translate-y-1/2">
              {num(h)}
            </Tag>
          </div>
          <Tag className="bottom-full left-0 mb-2">R {num(m.radius)}</Tag>
        </>
      )}
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
  const name = SIZES.find(({ id }) => id === size)?.label
  return (
    <Board id="button-sizes" untitled className={CANVAS}>
      <div className="flex w-full max-w-3xl flex-col gap-6">
        <div className="flex flex-col items-start gap-3">
          <h2 className="text-sm font-medium">Anatomy</h2>
          <div
            role="radiogroup"
            aria-label="Size"
            className="inline-flex rounded-md bg-fg/6 p-0.5"
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
        </div>
        <div className="flex min-w-0 flex-col gap-2">
          <span
            className="text-[11px] leading-none font-medium"
            style={{ color: SELECTION }}
          >
            Button / {name}
          </span>
          <div
            className="flex min-h-80 items-center justify-center rounded-md border border-dashed bg-bg px-10 py-20"
            style={{ borderColor: SELECTION }}
          >
            <Anatomy size={size} />
          </div>
        </div>
      </div>
    </Board>
  )
}
