import { clamp01, lerp } from "../../lib/motion"

/* Frame-driven FLIP. The previous step renders invisibly (the ghost) beside
   the live one; every frame, parts that exist in both are translated from
   their ghost box toward their live box by `move`, and parts that only exist
   live resolve in by `enter`. Positions come from offset geometry, so the
   preview's own scale and the camera never skew the measurement. */

export type Box = { x: number; y: number; w: number; h: number }

/** Layout box of `el` relative to `root` (an offset ancestor), transforms ignored. */
export function boxIn(
  el: HTMLElement,
  root: HTMLElement,
  content = false,
): Box {
  let x = 0
  let y = 0
  let node: HTMLElement | null = el
  while (node && node !== root) {
    x += node.offsetLeft
    y += node.offsetTop
    const parent = node.offsetParent as HTMLElement | null
    if (parent && parent !== root) {
      x += parent.clientLeft
      y += parent.clientTop
    }
    node = parent
  }
  const w = el.offsetWidth
  const h = el.offsetHeight
  if (content) {
    // The text's start edge and baseline row: left content edge, vertical center.
    const cs = getComputedStyle(el)
    const left = parseFloat(cs.paddingLeft) + parseFloat(cs.borderLeftWidth)
    const right = parseFloat(cs.paddingRight) + parseFloat(cs.borderRightWidth)
    return { x: x + left, y: y + h / 2, w: w - left - right, h: 0 }
  }
  return { x, y, w, h }
}

const names = (el: Element) => (el.getAttribute("data-flip") ?? "").split(" ")

/* Text inside a box moves by its content edge, so a placeholder glides when
   an addon pushes it over rather than jumping with the element's padding. */
const CONTENT_KEYS = new Set(["text"])

const measure = (el: HTMLElement, root: HTMLElement, key: string) =>
  boxIn(el, root, CONTENT_KEYS.has(key))

const PROPS = [
  "translate",
  "opacity",
  "filter",
  "scale",
  "clipPath",
  "borderColor",
] as const

export function applyFlip({
  live,
  ghost,
  move,
  enter,
}: {
  live: HTMLElement
  ghost: HTMLElement | null
  /** 0→1 (may overshoot): travel of shared parts. */
  move: number
  /** 0→1: resolve-in of new parts. */
  enter: number
}) {
  const parts = [...live.querySelectorAll<HTMLElement>("[data-flip]")]
  for (const el of parts) for (const p of PROPS) el.style[p] = ""
  if (!ghost) return

  const from = new Map<string, Box>()
  for (const el of ghost.querySelectorAll<HTMLElement>("[data-flip]")) {
    for (const key of names(el)) from.set(key, measure(el, ghost, key))
  }

  // Cumulative shift per element, so a child moves relative to its parent.
  const shift = new Map<Element, [number, number]>()
  const parentShift = (el: HTMLElement) => {
    const parent = el.parentElement?.closest("[data-flip]")
    return (parent && shift.get(parent)) || ([0, 0] as [number, number])
  }

  for (const el of parts) {
    const [key] = names(el) as [string]
    const inherited = parentShift(el)
    const was = from.get(key)
    if (key === "card") {
      shift.set(el, inherited)
      continue
    }
    if (was) {
      const now = measure(el, live, key)
      const dx = lerp(was.x, now.x, move) - now.x
      const dy = lerp(was.y, now.y, move) - now.y
      shift.set(el, [dx, dy])
      const tx = dx - inherited[0]
      const ty = dy - inherited[1]
      if (Math.abs(tx) > 0.01 || Math.abs(ty) > 0.01) {
        el.style.translate = `${tx}px ${ty}px`
      }
      continue
    }
    shift.set(el, inherited)
    if (enter < 1) {
      el.style.opacity = String(clamp01(enter))
      const blur = (1 - enter) * 8
      if (blur > 0.05) el.style.filter = `blur(${blur}px)`
      el.style.scale = String(lerp(0.9, 1, enter))
    }
  }
}
