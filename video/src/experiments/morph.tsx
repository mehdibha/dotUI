import { useLayoutEffect, useRef } from "react"
import type { ReactNode } from "react"
import { continueRender, delayRender } from "remotion"

import { Theme } from "../lib/theme"
import type { State } from "../lib/theme"

/* Morphs one subtree between two design systems. Two hidden probes lay it
   out in each look; every frame, each element gets their computed styles
   blended at `t`, so sizes, paddings, radii, borders, colors and shadows
   travel instead of cutting. Two visible copies (one per look) share those
   blended boxes, and the incoming one fades in on top, which crossfades the
   things that can't blend: typeface, icon glyphs, text case. */

const LENGTHS = [
  "width",
  "height",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "row-gap",
  "column-gap",
  "font-size",
  "line-height",
  "letter-spacing",
  "outline-offset",
  "stroke-width",
  "text-underline-offset",
  "top",
  "right",
  "bottom",
  "left",
]
const NUMBERS = ["font-weight", "opacity"]
const COLORS = [
  "color",
  "background-color",
  "text-decoration-color",
  "fill",
  "stroke",
]
/* Strokes are drawn in whole pixels: a 0.3 px border paints as 1 px,
   so a border that appears or vanishes would pop at full strength. Instead
   the stroke keeps its width and fades through its color. */
const STROKES = [
  ["border-top-width", "border-top-color", "border-top-style"],
  ["border-right-width", "border-right-color", "border-right-style"],
  ["border-bottom-width", "border-bottom-color", "border-bottom-style"],
  ["border-left-width", "border-left-color", "border-left-style"],
  ["outline-width", "outline-color", "outline-style"],
] as const

function blendStroke(
  [width, color, style]: (typeof STROKES)[number],
  a: CSSStyleDeclaration,
  b: CSSStyleDeclaration,
  t: number,
) {
  const visible = (s: CSSStyleDeclaration) =>
    s.getPropertyValue(style) !== "none" &&
    (px(s.getPropertyValue(width)) ?? 0) > 0
  const va = visible(a)
  const vb = visible(b)
  if (!va && !vb) return `${width}:0px!important;`
  const wa = va
    ? px(a.getPropertyValue(width))!
    : px(b.getPropertyValue(width))!
  const wb = vb ? px(b.getPropertyValue(width))! : wa
  const ca = va ? a.getPropertyValue(color) : "transparent"
  const cb = vb ? b.getPropertyValue(color) : "transparent"
  const st =
    (t < 0.5 && va) || !vb
      ? a.getPropertyValue(style)
      : b.getPropertyValue(style)
  // Chrome floors stroke widths to whole pixels (1.99 px draws as 1 px).
  return `${style}:${st}!important;${width}:${Math.round(lerp(wa, wb, t))}px!important;${color}:${blendColor(ca, cb, t)}!important;`
}

const CORNERS = [
  "border-top-left-radius",
  "border-top-right-radius",
  "border-bottom-right-radius",
  "border-bottom-left-radius",
]
/* Sizes are pinned explicitly, so nothing may stretch or clamp them. */
const PINNED =
  "flex:none!important;min-width:0!important;min-height:0!important;max-width:none!important;max-height:none!important;"

const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const px = (v: string) => {
  const n = Number.parseFloat(v)
  return Number.isFinite(n) && /px$|^0$/.test(v.trim()) ? n : null
}

function blendLength(
  prop: string,
  a: CSSStyleDeclaration,
  b: CSSStyleDeclaration,
  t: number,
) {
  // "normal" depends on the face; each view keeps its own.
  if (
    prop === "line-height" &&
    (a.lineHeight === "normal" || b.lineHeight === "normal")
  )
    return null
  const va = a.getPropertyValue(prop)
  const vb = b.getPropertyValue(prop)
  const zero = prop === "letter-spacing" ? "0px" : null
  const na = px(va === "normal" && zero ? zero : va)
  const nb = px(vb === "normal" && zero ? zero : vb)
  if (na === null || nb === null) return null
  return `${lerp(na, nb, t)}px`
}

/* A pill (9999px) and a square both clamp to half the short side first, or
   the radius would jump straight to the small value. */
function blendCorner(
  prop: string,
  a: CSSStyleDeclaration,
  b: CSSStyleDeclaration,
  t: number,
) {
  const cap = (s: CSSStyleDeclaration) => {
    const v = px(s.getPropertyValue(prop)) ?? 0
    const half =
      Math.min(
        Number.parseFloat(s.width) || 0,
        Number.parseFloat(s.height) || 0,
      ) / 2
    return half > 0 ? Math.min(v, half) : v
  }
  return `${lerp(cap(a), cap(b), t)}px`
}

const blendColor = (a: string, b: string, t: number) =>
  a === b ? a : `color-mix(in oklab, ${a}, ${b} ${(t * 100).toFixed(2)}%)`

/* box-shadow: "<color> x y blur spread [inset], …" as Chrome serializes it. */
type Shadow = { color: string; n: number[]; inset: boolean }
function shadows(v: string): Shadow[] {
  if (!v || v === "none") return []
  const out: Shadow[] = []
  let depth = 0
  let part = ""
  for (const ch of `${v},`) {
    if (ch === "(") depth++
    if (ch === ")") depth--
    if (ch === "," && depth === 0) {
      const m = part
        .trim()
        .match(/^((?:[a-z-]+\([^)]*\))|#[0-9a-f]+|[a-z]+)\s+(.*)$/i)
      if (m) {
        const rest = m[2]!
        out.push({
          color: m[1]!,
          n: (rest.match(/-?[\d.]+px/g) ?? []).map(Number.parseFloat),
          inset: rest.includes("inset"),
        })
      }
      part = ""
    } else part += ch
  }
  return out
}
function blendShadow(a: string, b: string, t: number) {
  if (a === b) return a
  const sa = shadows(a)
  const sb = shadows(b)
  // Each side gets a transparent twin of the other's extra layers.
  const ghost = (s: Shadow): Shadow => ({
    ...s,
    color: "transparent",
    n: [0, 0, 0, 0],
  })
  const layers: string[] = []
  for (let i = 0; i < Math.max(sa.length, sb.length); i++) {
    const x = sa[i] ?? ghost(sb[i]!)
    const y = sb[i] ?? ghost(sa[i]!)
    const n = [0, 1, 2, 3].map((j) => `${lerp(x.n[j] ?? 0, y.n[j] ?? 0, t)}px`)
    const inset = (t < 0.5 ? x : y).inset ? " inset" : ""
    layers.push(`${blendColor(x.color, y.color, t)} ${n.join(" ")}${inset}`)
  }
  return layers.length ? layers.join(", ") : "none"
}

function matrix(v: string) {
  if (!v || v === "none") return [1, 0, 0, 1, 0, 0]
  const m = v.match(/^matrix\(([^)]*)\)$/)
  return m ? m[1]!.split(",").map(Number) : null
}
function blendTransform(a: string, b: string, t: number) {
  if (a === b) return null
  const ma = matrix(a)
  const mb = matrix(b)
  if (!ma || !mb) return null
  return `matrix(${ma.map((x, i) => lerp(x, mb[i]!, t)).join(",")})`
}

function rules(
  a: CSSStyleDeclaration,
  b: CSSStyleDeclaration,
  t: number,
  { pin }: { pin: "box" | "height" | false },
) {
  let css =
    pin === "box"
      ? PINNED
      : pin === "height"
        ? "min-height:0!important;max-height:none!important;"
        : ""
  const set = (prop: string, value: string | null) => {
    if (value !== null) css += `${prop}:${value}!important;`
  }
  for (const p of LENGTHS) {
    if (p === "width" && pin !== "box") continue
    if (p === "height" && !pin) continue
    set(p, blendLength(p, a, b, t))
  }
  for (const p of CORNERS) set(p, blendCorner(p, a, b, t))
  for (const stroke of STROKES) css += blendStroke(stroke, a, b, t)
  /* Text crosses its background's color on the way, so it switches over a
     shorter window to keep the unreadable middle brief. */
  const tText = Math.min(1, Math.max(0, (t - 0.4) / 0.2))
  for (const p of COLORS)
    set(
      p,
      blendColor(
        a.getPropertyValue(p),
        b.getPropertyValue(p),
        p === "color" ? tText : t,
      ),
    )
  const weight = lerp(
    Number(a.fontWeight) || 400,
    Number(b.fontWeight) || 400,
    t,
  )
  set("font-weight", String(Math.round(weight)))
  set("opacity", String(lerp(Number(a.opacity), Number(b.opacity), t)))
  set("box-shadow", blendShadow(a.boxShadow, b.boxShadow, t))
  set("transform", blendTransform(a.transform, b.transform, t))
  return css
}

type Box = { x: number; y: number; w: number; h: number }

/** The border box of `el` inside its parent's padding box. */
function boxIn(el: Element, parent: Element): Box | null {
  const r = el.getBoundingClientRect()
  if (r.width === 0 && r.height === 0) return null
  const p = parent.getBoundingClientRect()
  const ps = getComputedStyle(parent)
  return {
    x: r.left - p.left - Number.parseFloat(ps.borderLeftWidth),
    y: r.top - p.top - Number.parseFloat(ps.borderTopWidth),
    w: r.width,
    h: r.height,
  }
}

/** Walk the views and probes in step and write one rule per matched element;
 *  both views get the same rule, so their boxes stay identical.
 *
 *  Layout doesn't flow during a morph: each element is placed absolutely at
 *  its box blended between the two looks, so nothing reflows mid-way (a row
 *  that wraps in one look would otherwise jump between lines). Only inside a
 *  box that holds text, where an icon sits beside a label, does content still
 *  flow, with its sizes pinned. */
function morphCss(views: Element[], a: Element, b: Element, t: number) {
  let css = ""
  let id = 0
  type Mode = "root" | "placed" | "flow"
  const walk = (
    vs: Element[],
    x: Element,
    y: Element,
    mode: Mode,
    parents?: [Element, Element],
  ) => {
    const m = String(id++)
    for (const v of vs) v.setAttribute("data-m", m)
    const sx = getComputedStyle(x)
    const sy = getComputedStyle(y)
    const text = [...x.childNodes].some(
      (n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim(),
    )
    const inline = sx.display === "inline" || sy.display === "inline"
    let rule = ""
    if (mode === "placed") {
      const ba = boxIn(x, parents![0])
      const bb = boxIn(y, parents![1])
      // Shown in one look only: it holds the other's box and fades.
      const pa = ba ?? bb
      const pb = bb ?? ba
      if (pa && pb) {
        const fade = ba && bb ? 1 : ba ? 1 - t : t
        rule = `${rules(sx, sy, t, { pin: false })}position:absolute!important;margin:0!important;right:auto!important;bottom:auto!important;transform:none!important;min-width:0!important;min-height:0!important;max-width:none!important;max-height:none!important;left:${lerp(pa.x, pb.x, t)}px!important;top:${lerp(pa.y, pb.y, t)}px!important;width:${lerp(pa.w, pb.w, t)}px!important;height:${lerp(pa.h, pb.h, t)}px!important;${fade < 1 ? `opacity:${fade}!important;` : ""}`
        if (text)
          rule += "text-overflow:clip!important;overflow:visible!important;"
        /* Bare text (a link, a label) keeps each look's own width in each
           view, so it never rewraps mid-morph; the crossfade carries it. */
        const bare = (st: CSSStyleDeclaration) =>
          st.backgroundColor === "rgba(0, 0, 0, 0)" &&
          !["Top", "Right", "Bottom", "Left"].some(
            (side) =>
              Number.parseFloat(
                st.getPropertyValue(`border-${side.toLowerCase()}-width`),
              ) > 0,
          )
        if (text && ba && bb && bare(sx) && bare(sy)) {
          // One attribute more specific than the shared rule.
          css += `[data-morph-view="a"] [data-m="${m}"][data-m]{width:${ba.w}px!important}`
          css += `[data-morph-view="b"] [data-m="${m}"][data-m]{width:${bb.w}px!important}`
        }
      }
    } else {
      const pin = mode === "root" || inline ? false : text ? "height" : "box"
      rule = rules(sx, sy, t, { pin })
      if (mode === "root") rule += "position:relative!important;"
      if (text)
        rule += "text-overflow:clip!important;overflow:visible!important;"
    }
    css += `[data-morph-view] [data-m="${m}"]{${rule}}`
    for (const pseudo of ["::before", "::after"]) {
      const pa = getComputedStyle(x, pseudo)
      const pb = getComputedStyle(y, pseudo)
      if (pa.content === "none" || pb.content === "none") continue
      css += `[data-morph-view] [data-m="${m}"]${pseudo}{${rules(pa, pb, t, { pin: false })}}`
    }
    if (x.tagName.toLowerCase() === "svg") return
    const childMode: Mode = mode === "flow" || text ? "flow" : "placed"
    const n = Math.min(
      x.children.length,
      y.children.length,
      ...vs.map((v) => v.children.length),
    )
    for (let i = 0; i < n; i++) {
      const cx = x.children[i]!
      const cy = y.children[i]!
      const cvs = vs.map((v) => v.children[i]!)
      if (
        cx.tagName === cy.tagName &&
        cvs.every((c) => c.tagName === cx.tagName)
      )
        walk(cvs, cx, cy, childMode, [x, y])
    }
  }
  walk(views, a, b, "root")
  return css
}

/** 0→1 with flat ends: the incoming view fades in over the middle of `t`. */
const fade = (t: number) => {
  const u = Math.min(1, Math.max(0, (t - 0.3) / 0.4))
  return u * u * (3 - 2 * u)
}

export function Morph({
  from,
  to,
  t,
  children,
}: {
  from: State
  to: State
  /** 0 = `from`, 1 = `to`. */
  t: number
  children: ReactNode
}) {
  const viewA = useRef<HTMLDivElement>(null)
  const viewB = useRef<HTMLDivElement>(null)
  const probeA = useRef<HTMLDivElement>(null)
  const probeB = useRef<HTMLDivElement>(null)
  const style = useRef<HTMLStyleElement>(null)
  const still = t <= 0 || t >= 1

  useLayoutEffect(() => {
    const el = style.current
    if (!el) return
    if (still) {
      el.textContent = ""
      return
    }
    /* A probe that just mounted can still be suspended (React hides it with
       display: none) — hold the frame until both have laid out. */
    const handle = delayRender("morph probes")
    let raf = 0
    let tries = 0
    const apply = () => {
      const [va, vb, a, b] = [
        viewA.current,
        viewB.current,
        probeA.current,
        probeB.current,
      ]
      const ready = (p: HTMLElement | null) =>
        (p?.firstElementChild as HTMLElement | null)?.offsetWidth
      if (va && vb && a && b && ready(a) && ready(b)) {
        el.textContent = morphCss([va, vb], a, b, t)
        continueRender(handle)
      } else if (tries++ < 600) raf = requestAnimationFrame(apply)
      else continueRender(handle)
    }
    apply()
    return () => {
      cancelAnimationFrame(raf)
      continueRender(handle)
    }
  })

  const layer = { position: "absolute", inset: 0 } as const
  const probe = { ...layer, visibility: "hidden" } as const
  /* Two views share every blended box; what can't blend (typeface, icon
     glyphs, text case) crossfades as the incoming view fades in on top. */
  return (
    <>
      <style ref={style} />
      {!still && (
        <>
          <div style={probe} aria-hidden>
            <Theme state={from}>
              <div ref={probeA}>{children}</div>
            </Theme>
          </div>
          <div style={probe} aria-hidden>
            <Theme state={to}>
              <div ref={probeB}>{children}</div>
            </Theme>
          </div>
        </>
      )}
      <div data-morph-view="a" style={layer}>
        <Theme state={t >= 1 ? to : from}>
          <div ref={viewA}>{children}</div>
        </Theme>
      </div>
      {!still && (
        <div data-morph-view="b" style={{ ...layer, opacity: fade(t) }}>
          <Theme state={to}>
            <div ref={viewB}>{children}</div>
          </Theme>
        </div>
      )}
    </>
  )
}
