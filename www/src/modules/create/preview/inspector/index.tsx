import * as React from "react"

import {
  sendInspect,
  sendInspectorExit,
  useInspectorModeMessages,
} from "@/modules/create/preset"

import { findOwner, getHostElements } from "./fiber"
import type { FiberLike } from "./fiber"
import type { InspectorEntry } from "./registry-map"

interface Selection {
  entry: InspectorEntry
  fiber: FiberLike
  hostEls: Element[]
  props: [string, unknown][]
}

// Fixed palette on purpose — the overlay is tool chrome, not part of the
// previewed design system, and must stay readable over any theme.
const ACCENT = "#3b82f6"
const ACCENT_FILL = "rgba(59, 130, 246, 0.09)"
const CHROME_BG = "rgba(24, 24, 27, 0.94)"

const MAX_PROPS = 8
const MAX_VALUE_CHARS = 28

function formatValue(value: unknown): string {
  if (typeof value === "string") {
    const s =
      value.length > MAX_VALUE_CHARS
        ? `${value.slice(0, MAX_VALUE_CHARS)}…`
        : value
    return JSON.stringify(s)
  }
  if (
    typeof value === "number" ||
    typeof value === "boolean" ||
    value == null
  ) {
    return String(value)
  }
  if (typeof value === "function") return "ƒ"
  if (React.isValidElement(value)) return "<element>"
  if (Array.isArray(value)) return `[${value.length}]`
  return "{…}"
}

function propsOf(fiber: FiberLike): [string, unknown][] {
  const props = fiber.memoizedProps
  if (!props) return []
  return Object.entries(props).filter(([key]) => key !== "children")
}

/**
 * The /create preview inspector — rendered inside the preview iframe. Toggled
 * from the parent's toolbar; hovering highlights the nearest dotUI component
 * (matched by identity against the registry exports) with its name and props,
 * clicking opens that component's params in the panel, Escape exits.
 */
export function PreviewInspector() {
  const [enabled, setEnabled] = React.useState(false)
  const [registry, setRegistry] = React.useState<Map<
    unknown,
    InspectorEntry
  > | null>(null)
  const [sel, setSel] = React.useState<Selection | null>(null)
  // Bumped on scroll/resize so the boxes track the page without re-hit-testing.
  const [, bumpTick] = React.useReducer((t: number) => t + 1, 0)

  const selRef = React.useRef<Selection | null>(null)
  selRef.current = sel

  useInspectorModeMessages(
    React.useCallback((on: boolean) => {
      setEnabled(on)
      if (!on) setSel(null)
    }, []),
  )

  // The identity map pulls in every registry component — load it only once
  // the inspector is actually switched on.
  React.useEffect(() => {
    if (!enabled || registry) return
    let cancelled = false
    void import("./registry-map").then(async ({ loadInspectorRegistry }) => {
      const map = await loadInspectorRegistry()
      if (!cancelled) setRegistry(map)
    })
    return () => {
      cancelled = true
    }
  }, [enabled, registry])

  React.useEffect(() => {
    if (!enabled || !registry) return

    const onPointerMove = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Element)) return
      const owner = findOwner(target, registry)
      if (!owner) {
        if (selRef.current) setSel(null)
        return
      }
      if (selRef.current?.fiber === owner.fiber) return
      setSel({
        entry: owner.entry,
        fiber: owner.fiber,
        hostEls: getHostElements(owner.fiber),
        props: propsOf(owner.fiber),
      })
    }

    // Swallow interactions at capture so hovering/clicking inspects instead of
    // pressing — the previewed UI stays inert while the inspector is on.
    const block = (event: Event) => {
      event.preventDefault()
      event.stopPropagation()
    }
    const onClick = (event: MouseEvent) => {
      block(event)
      const current = selRef.current
      if (current?.entry.customizable) {
        sendInspect(`component:${current.entry.slug}`)
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      block(event)
      setEnabled(false)
      setSel(null)
      sendInspectorExit()
    }
    const clear = () => setSel(null)
    const onViewportChange = () => bumpTick()

    document.addEventListener("pointermove", onPointerMove, true)
    document.addEventListener("pointerdown", block, true)
    document.addEventListener("pointerup", block, true)
    document.addEventListener("click", onClick, true)
    document.addEventListener("keydown", onKeyDown, true)
    document.documentElement.addEventListener("pointerleave", clear)
    window.addEventListener("scroll", onViewportChange, {
      capture: true,
      passive: true,
    })
    window.addEventListener("resize", onViewportChange)
    return () => {
      document.removeEventListener("pointermove", onPointerMove, true)
      document.removeEventListener("pointerdown", block, true)
      document.removeEventListener("pointerup", block, true)
      document.removeEventListener("click", onClick, true)
      document.removeEventListener("keydown", onKeyDown, true)
      document.documentElement.removeEventListener("pointerleave", clear)
      window.removeEventListener("scroll", onViewportChange, { capture: true })
      window.removeEventListener("resize", onViewportChange)
    }
  }, [enabled, registry])

  if (!enabled) return null

  let box: { top: number; left: number; width: number; height: number } | null =
    null
  if (sel) {
    const rects = sel.hostEls
      .map((el) => el.getBoundingClientRect())
      .filter((r) => r.width > 0 || r.height > 0)
    if (rects.length > 0) {
      const left = Math.min(...rects.map((r) => r.left))
      const top = Math.min(...rects.map((r) => r.top))
      const right = Math.max(...rects.map((r) => r.right))
      const bottom = Math.max(...rects.map((r) => r.bottom))
      box = { top, left, width: right - left, height: bottom - top }
    }
  }

  // One card carries the name and the props; above the box, flipped below
  // when there's no room. Estimated height keeps the flip decision cheap.
  const cardAbove = box
    ? box.top > 40 + 16 * Math.min(sel?.props.length ?? 0, MAX_PROPS + 1)
    : true

  return (
    <div
      aria-hidden
      data-preview-inspector=""
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483000,
        pointerEvents: "none",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      }}
    >
      <style>{"* { cursor: crosshair !important; }"}</style>
      {box && sel && (
        <>
          <div
            style={{
              position: "absolute",
              top: box.top,
              left: box.left,
              width: box.width,
              height: box.height,
              border: `1.5px solid ${ACCENT}`,
              background: ACCENT_FILL,
              borderRadius: 3,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: cardAbove ? box.top - 6 : box.top + box.height + 6,
              left: Math.max(4, Math.min(box.left, window.innerWidth - 240)),
              transform: cardAbove ? "translateY(-100%)" : undefined,
              maxWidth: 300,
              padding: "5px 8px",
              borderRadius: 6,
              background: CHROME_BG,
              color: "#e4e4e7",
              fontSize: 11,
              lineHeight: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 6,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ color: "#93c5fd", fontWeight: 600 }}>
                {sel.entry.name}
              </span>
              <span style={{ opacity: 0.55 }}>
                {Math.round(box.width)}×{Math.round(box.height)}
              </span>
              {sel.entry.customizable && (
                <span style={{ opacity: 0.55 }}>click to edit</span>
              )}
            </div>
            {sel.props.slice(0, MAX_PROPS).map(([key, value]) => (
              <div
                key={key}
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ color: "#a5b4fc" }}>{key}</span>
                <span style={{ opacity: 0.5 }}>=</span>
                <span style={{ color: "#fda4af" }}>{formatValue(value)}</span>
              </div>
            ))}
            {sel.props.length > MAX_PROPS && (
              <div style={{ opacity: 0.5 }}>
                +{sel.props.length - MAX_PROPS} more
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
