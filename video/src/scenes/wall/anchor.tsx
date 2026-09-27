import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { flushSync } from "react-dom"
import { continueRender, delayRender, useCurrentFrame } from "remotion"

import { Theme } from "../../lib/theme"
import type { Tile } from "./layout"
import { TileContent } from "./tiles"

/* Where the hero radio's selected dot sits inside its cell, measured on a
   hidden, untransformed copy of the cell (the real one lives under a 3D
   camera and a layout zoom). Re-measured every frame and once the faces are
   in (label widths center the group), so it follows font or density changes
   to the builder defaults. */
export function useAnchor(tile: Tile) {
  const frame = useCurrentFrame()
  const probe = useRef<HTMLDivElement>(null)
  const [local, setLocal] = useState<[number, number]>([44, tile.h / 2 + 16])
  const measure = useCallback(() => {
    const root = probe.current
    const el = root?.querySelector<HTMLElement>(
      ".wall-hero [data-radio-indicator]",
    )
    if (!root || !el) return
    let x = el.offsetWidth / 2
    let y = el.offsetHeight / 2
    let node: HTMLElement | null = el
    while (node && node !== root) {
      x += node.offsetLeft
      y += node.offsetTop
      node = node.offsetParent as HTMLElement | null
    }
    setLocal((prev) =>
      Math.abs(x - prev[0]) > 0.01 || Math.abs(y - prev[1]) > 0.01
        ? [x, y]
        : prev,
    )
  }, [])
  useLayoutEffect(measure, [frame, measure])
  const [handle] = useState(() => delayRender("wall anchor"))
  const released = useRef(false)
  useEffect(() => {
    void document.fonts.ready.then(() => {
      if (released.current) return
      released.current = true
      flushSync(measure)
      continueRender(handle)
    })
  }, [handle, measure])
  const probeNode = (
    <div
      ref={probe}
      aria-hidden
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: tile.w,
        height: tile.h,
        visibility: "hidden",
      }}
    >
      <Theme mode="dark">
        <div className="relative flex size-full items-center justify-center">
          <TileContent kind={tile.kind} tick={0} />
        </div>
      </Theme>
    </div>
  )
  return {
    anchor: [tile.x + local[0], tile.y + local[1]] as [number, number],
    probe: probeNode,
  }
}
