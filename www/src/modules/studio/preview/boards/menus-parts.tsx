"use client"

import { useLayoutEffect, useState } from "react"
import type { RefObject } from "react"

/** A menu row under the pointer: react-aria marks it focused and hovered. */
export const POINTED = {
  "data-rac": "",
  "data-focused": "true",
  "data-hovered": "true",
}

/** A list row reached with the arrow keys. */
export const KEYED = {
  "data-rac": "",
  "data-focused": "true",
  "data-focus-visible": "true",
}

export const ROW = { "data-rac": "" }

/** A stage: the specimen fills the box, its overlay over the content behind. */
export const STAGE =
  "flex-1 flex-col flex-nowrap items-stretch justify-start gap-0 overflow-hidden p-0 max-sm:p-0"

/** The first section wide on the left, the others stacked on its right. */
export function Split({ children }: { children: React.ReactNode }) {
  return (
    <div className="@container/split">
      <div className="grid grid-cols-1 gap-8 @3xl/split:grid-cols-[minmax(0,1fr)_17rem] @3xl/split:[&:has(>:nth-child(3))>:first-child]:row-span-2">
        {children}
      </div>
    </div>
  )
}

/** A motion replay's stage: the trigger near the top, room for the overlay below. */
export const REPLAY =
  "items-start justify-center p-0 pt-8 max-sm:p-0 max-sm:pt-8"

/** An open overlay's tip, as react-aria's OverlayArrow places it: on the side facing the trigger. */
export function Tip({
  className,
  placement,
  size,
  left = "50%",
}: {
  className: string
  placement: "top" | "bottom" | "left" | "right"
  size: number
  left?: number | string
}) {
  const vertical = placement === "top" || placement === "bottom"
  return (
    <div
      data-placement={placement}
      className={className}
      style={{
        position: "absolute",
        [placement]: "100%",
        ...(vertical
          ? { left, transform: "translateX(-50%)" }
          : { top: "50%", transform: "translateY(-50%)" }),
      }}
    >
      <svg aria-hidden width={size} height={size} viewBox="0 0 8 8">
        <path d="M0 0 L4 4 L8 0" />
      </svg>
    </div>
  )
}

/** The anchor's centre and bottom edge, in px from the frame's top-left corner. */
export function useAnchor(
  anchor: RefObject<HTMLElement | null>,
  frame: RefObject<HTMLElement | null>,
) {
  const [point, setPoint] = useState<{ x: number; y: number }>()
  useLayoutEffect(() => {
    const a = anchor.current
    const f = frame.current
    if (!a || !f) return
    const measure = () => {
      const ar = a.getBoundingClientRect()
      const fr = f.getBoundingClientRect()
      setPoint({ x: ar.left + ar.width / 2 - fr.left, y: ar.bottom - fr.top })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(a)
    observer.observe(f)
    return () => observer.disconnect()
  }, [anchor, frame])
  return point
}
