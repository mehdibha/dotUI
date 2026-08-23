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

// Highlight box: fixed accent, readable over any previewed theme. The card
// borrows the react-grab look, mapped onto the previewed system's tooltip
// tokens (its guaranteed-contrast inverse surface), with react-grab's own
// values as fallbacks.
const ACCENT = "#3b82f6"
const ACCENT_FILL = "rgba(59, 130, 246, 0.09)"
const CARD_BG = "var(--color-tooltip, #161616)"
const CARD_FG = "var(--color-fg-on-tooltip, #ffffff)"
const CARD_FONT = "Geist, ui-sans-serif, system-ui, sans-serif"
const CARD_SHADOW = "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.15))"

const ARROW_W = 16
const ARROW_H = 8
const CARD_GAP = 4
const VIEWPORT_MARGIN = 6

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

  // The card is centered on the box and its arrow points at the box center,
  // both clamped to the viewport — that needs the card's rendered size.
  const cardRef = React.useRef<HTMLDivElement>(null)
  const [cardSize, setCardSize] = React.useState({ w: 0, h: 0 })
  React.useLayoutEffect(() => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setCardSize((prev) =>
      prev.w === rect.width && prev.h === rect.height
        ? prev
        : { w: rect.width, h: rect.height },
    )
  })

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

  // react-grab-style placement: card centered on the box with an arrow
  // pointing at its center, above by default, flipped below when clipped.
  let card: {
    top: number
    left: number
    above: boolean
    arrowX: number
  } | null = null
  if (box && cardSize.w > 0) {
    const centerX = box.left + box.width / 2
    const above =
      box.top - CARD_GAP - ARROW_H - cardSize.h >= VIEWPORT_MARGIN ||
      box.top + box.height + CARD_GAP + ARROW_H + cardSize.h >
        window.innerHeight - VIEWPORT_MARGIN
    const top = above
      ? box.top - CARD_GAP - ARROW_H - cardSize.h
      : box.top + box.height + CARD_GAP + ARROW_H
    const left = Math.max(
      VIEWPORT_MARGIN,
      Math.min(
        centerX - cardSize.w / 2,
        window.innerWidth - VIEWPORT_MARGIN - cardSize.w,
      ),
    )
    const arrowX = Math.max(
      12,
      Math.min(centerX - left, cardSize.w - 12),
    )
    card = { top, left, above, arrowX }
  }

  const hasProps = (sel?.props.length ?? 0) > 0

  return (
    <div
      aria-hidden
      data-preview-inspector=""
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483000,
        pointerEvents: "none",
        fontFamily: CARD_FONT,
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
          {/* Wrapper carries the drop-shadow so panel + arrow cast one shape. */}
          <div
            ref={cardRef}
            style={{
              position: "absolute",
              top: card?.top ?? -9999,
              left: card?.left ?? -9999,
              visibility: card ? "visible" : "hidden",
              filter: CARD_SHADOW,
            }}
          >
            <div
              style={{
                maxWidth: 300,
                padding: hasProps ? "6px 10px" : "4px 10px",
                borderRadius: hasProps ? 14 : 999,
                background: CARD_BG,
                color: CARD_FG,
                fontSize: 12,
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
                <span style={{ fontSize: 13, fontWeight: 500 }}>
                  {sel.entry.name}
                </span>
                <span style={{ opacity: 0.6 }}>
                  {Math.round(box.width)}×{Math.round(box.height)}
                </span>
                {sel.entry.customizable && (
                  <span style={{ opacity: 0.6 }}>click to edit</span>
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
                  <span style={{ opacity: 0.6 }}>{key}=</span>
                  <span>{formatValue(value)}</span>
                </div>
              ))}
              {sel.props.length > MAX_PROPS && (
                <div style={{ opacity: 0.6 }}>
                  +{sel.props.length - MAX_PROPS} more
                </div>
              )}
            </div>
            {card && <CardArrow x={card.arrowX} pointDown={card.above} />}
          </div>
        </>
      )}
    </div>
  )
}

/** react-grab's rounded-tip arrow, filled with the card surface. */
function CardArrow({ x, pointDown }: { x: number; pointDown: boolean }) {
  const r = 1
  const t = r * Math.SQRT1_2
  const half = ARROW_W / 2
  const baseY = pointDown ? 0 : ARROW_H
  const tipY = pointDown ? ARROW_H - t : t
  const sweep = pointDown ? 0 : 1
  const d = `M0 ${baseY} L${half - t} ${tipY} A${r} ${r} 0 0 ${sweep} ${half + t} ${tipY} L${ARROW_W} ${baseY} Z`
  return (
    <svg
      width={ARROW_W}
      height={ARROW_H}
      viewBox={`0 0 ${ARROW_W} ${ARROW_H}`}
      style={{
        position: "absolute",
        display: "block",
        left: x,
        // 1px overlap hides the antialiased seam between panel and arrow.
        top: pointDown ? "calc(100% - 1px)" : undefined,
        bottom: pointDown ? undefined : "calc(100% - 1px)",
        transform: "translateX(-50%)",
      }}
    >
      {/* fill via CSS so the var() resolves — attribute values don't. */}
      <path d={d} style={{ fill: CARD_BG }} />
    </svg>
  )
}
