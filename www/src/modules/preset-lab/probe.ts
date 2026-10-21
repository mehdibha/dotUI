/* Measures what a preset has to match: the computed styles of named parts,
   read the same way from the real product (a browser tab) and from the
   specimen sheets, so the two compare property by property. */

import type { SheetName } from "./sheets"

/** Where a part sits on a page. `text` matches an element's own trimmed text
 *  and climbs to its control; `surface` climbs to the first box painted at
 *  more than 10% alpha. */
export interface Target {
  selector?: string
  text?: string
  /** Search only inside the first match of this selector. */
  within?: string
  /** Which match, from 0. */
  nth?: number
  surface?: boolean
  /** Read the box (fill, border, radius, edge, shadow, height) from this
   *  pseudo-element ("::before") or descendant, where the product draws it
   *  apart from the control (a checkbox painted on its label's ::before). */
  box?: string
  /** Read color and type from this descendant (a nav row's label span). */
  ink?: string
  /** Focus from the keyboard before measuring (`--pack`). */
  focus?: boolean
  /** Steps run before measuring (`--pack`), undone with Escape after: open
   *  a menu, hover a tooltip trigger. Puppeteer selectors, so
   *  `::-p-text(Options)` matches by text. */
  before?: Step[]
  /** Props left out of `tokens.json` for this part (`--pack`), where the
   *  two sides draw them in different places. */
  skip?: Prop[]
}

export type Step = { click: string } | { hover: string } | { press: string }

export const PROPS = [
  "backgroundColor",
  "color",
  "borderRadius",
  "height",
  "paddingInline",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "letterSpacing",
  "boxShadow",
  "edge",
  "ring",
] as const

export type Prop = (typeof PROPS)[number]
export type Measure = Partial<Record<Prop, string>>
/** One mode's measures, by part; `null` when the target matched nothing. */
export type Measures = Record<string, Measure | null>
/** A reference pack's `tokens.json`: what the real product measures, and the
 *  probe commit that measured it. */
export interface ReferenceTokens {
  light?: Measures
  dark?: Measures
  probe?: string
}

/** A reference pack's `targets.json`: its pages by URL. */
export type Pack = Record<string, Page>
export interface Page {
  /** The mode the page shows. Without it, `--pack` measures the page in both
   *  modes through `prefers-color-scheme`. */
  mode?: "light" | "dark"
  /** The localStorage key the site reads its theme from (next-themes'
   *  "theme"): `--pack` sets it to "light" or "dark" before load. */
  storage?: string
  /** Measured in a signed-in tab with `--snippet`, then `--merge`d; `--pack`
   *  skips it. */
  signedIn?: boolean
  parts: Record<string, Target>
}

/* Runs in the page and closes over nothing, so its source can be sent as a
   string (see `snippet`). */
function probe(
  targets: Record<string, Target>,
  props: readonly string[],
  focus: boolean,
): Measures {
  const CONTROL =
    "button,a,input,select,textarea,[role=button],[role=tab],[role=menuitem],[role=option],[role=checkbox],[role=switch],[role=radio]"
  const visible = (el: Element) => {
    const rect = el.getBoundingClientRect()
    return rect.width > 0 && rect.height > 0
  }
  const alpha = (color: string) => {
    if (color === "transparent") return 0
    const match = /[,/]\s*([\d.]+)(%?)\s*\)$/.exec(color)
    if (!match || (color.startsWith("rgb(") && !color.includes("/"))) return 1
    return Number(match[1]) / (match[2] ? 100 : 1)
  }
  /* A translucent or clear color as it shows: composited over the
     backgrounds under it (from `under` up to the first opaque one, white
     below), as rgb(). Opaque colors pass through. */
  const canvas = document
    .createElement("canvas")
    .getContext("2d", { willReadFrequently: true })
  const seen = (color: string, under: Element | null) => {
    const a = alpha(color)
    if (!canvas || a >= 1) return color
    const layers = [color]
    for (let node = under; node; node = node.parentElement) {
      const bg = getComputedStyle(node).backgroundColor
      if (alpha(bg) > 0) layers.push(bg)
      if (alpha(bg) >= 1) break
    }
    canvas.fillStyle = "#fff"
    canvas.fillRect(0, 0, 1, 1)
    for (const layer of layers.reverse()) {
      canvas.fillStyle = layer
      canvas.fillRect(0, 0, 1, 1)
    }
    const [r, g, b] = canvas.getImageData(0, 0, 1, 1).data
    return `rgb(${r}, ${g}, ${b})`
  }
  const painted = (el: Element, pseudo: string | null = null) => {
    const style = getComputedStyle(el, pseudo)
    return (
      (!pseudo || style.content !== "none") &&
      (alpha(style.backgroundColor) > 0.1 || style.backgroundImage !== "none")
    )
  }
  /* Box-shadow layers with spread and no offset or blur: rings. */
  const rings = (style: CSSStyleDeclaration) =>
    style.boxShadow.split(/,(?![^(]*\))/).flatMap((layer) => {
      const ring =
        /^\s*([a-z]+\([^)]*\))\s+0px\s+0px\s+0px\s+([\d.]+)px(\s+inset)?/.exec(
          layer,
        )
      return ring?.[1] && ring[2] && alpha(ring[1]) > 0
        ? [{ color: ring[1], spread: Number(ring[2]), inset: !!ring[3] }]
        : []
    })
  /* The hairline that outlines a box, wherever it is drawn: a border, a ring
     up to 1.5px, or either on ::before or ::after. A border on some sides
     only names them ("1px <color> bottom"). */
  const edgeOf = (style: CSSStyleDeclaration, under: Element) => {
    const sides = (["top", "right", "bottom", "left"] as const).filter(
      (side) =>
        style.getPropertyValue(`border-${side}-style`) !== "none" &&
        Number.parseFloat(style.getPropertyValue(`border-${side}-width`)) > 0 &&
        alpha(style.getPropertyValue(`border-${side}-color`)) > 0,
    )
    const [first] = sides
    if (first) {
      const width = Number.parseFloat(
        style.getPropertyValue(`border-${first}-width`),
      )
      const line = `${width}px ${seen(style.getPropertyValue(`border-${first}-color`), under)}`
      return sides.length === 4 ? line : `${line} ${sides.join("+")}`
    }
    const hairline = rings(style).find(
      (ring) => ring.spread > 0 && ring.spread <= 1.5,
    )
    return hairline
      ? `${hairline.spread}px ${seen(hairline.color, under)}`
      : null
  }
  const edge = (el: Element) => {
    for (const pseudo of [null, "::before", "::after"]) {
      const style = getComputedStyle(el, pseudo)
      if (pseudo && style.content === "none") continue
      const found = edgeOf(style, el)
      if (found) return found
    }
    return "none"
  }
  const signed = (px: number) => `${px < 0 ? "" : "+"}${px}px`
  /* The focus ring, "<width>px <color> <±offset>px", from an outline, the
     outermost ring (the one inside it sets the offset), or the topmost inset
     ring, which sits inside the border and merges with a border of its
     color. Focused parts only. */
  const ring = (el: Element) => {
    if (
      !el.matches(":focus-visible, [data-focus-visible], [data-specimen-focus]")
    )
      return "none"
    const style = getComputedStyle(el)
    const width = Number.parseFloat(style.outlineWidth)
    // Some systems keep a transparent outline for forced colors (Stripe).
    if (
      style.outlineStyle !== "none" &&
      width > 0 &&
      alpha(style.outlineColor) > 0
    )
      return `${width}px ${seen(style.outlineColor, el.parentElement)} ${signed(Number.parseFloat(style.outlineOffset))}`
    const all = rings(style).filter((ring) => ring.spread > 0)
    const outer = all
      .filter((ring) => !ring.inset)
      .sort((a, b) => a.spread - b.spread)
    const last = outer.at(-1)
    if (last) {
      const offset = outer.at(-2)?.spread ?? 0
      return `${last.spread - offset}px ${seen(last.color, el.parentElement)} ${signed(offset)}`
    }
    const inset = all.find((ring) => ring.inset)
    if (!inset) return "none"
    const border = Number.parseFloat(style.borderTopWidth)
    const merged = style.borderTopColor === inset.color ? border : 0
    return `${inset.spread + merged}px ${seen(inset.color, el)} ${signed(-(inset.spread + border))}`
  }
  const find = (target: Target): Element | null => {
    const root = target.within
      ? document.querySelector(target.within)
      : document
    if (!root) return null
    let found = [...root.querySelectorAll(target.selector ?? "*")].filter(
      visible,
    )
    if (target.text !== undefined) {
      const text = found.filter((el) => el.textContent?.trim() === target.text)
      found = text
        .filter(
          (el) => !text.some((other) => other !== el && el.contains(other)),
        )
        .map((el) => el.closest(CONTROL) ?? el)
    }
    let el: Element | null = found[target.nth ?? 0] ?? null
    if (el && target.surface) {
      let box: Element | null = el
      while (box && !painted(box)) box = box.parentElement
      el = box ?? el
    }
    return el
  }
  /* Where a part's box is painted: `target.box`, else the element, else a
     child that covers it (a selected tab's indicator), else a ::before or
     ::after that covers most of it (Duolingo's buttons; not a badge dot). */
  const boxOf = (el: Element, target: Target): [Element, string | null] => {
    if (target.box?.startsWith("::")) return [el, target.box]
    if (target.box) return [el.querySelector(target.box) ?? el, null]
    if (painted(el)) return [el, null]
    const box = el.getBoundingClientRect()
    const covers = (child: Element) => {
      const rect = child.getBoundingClientRect()
      return (
        Math.abs(rect.left - box.left) <= 1 &&
        Math.abs(rect.right - box.right) <= 1 &&
        Math.abs(rect.top - box.top) <= 1 &&
        Math.abs(rect.bottom - box.bottom) <= 1
      )
    }
    const child = [...el.querySelectorAll("*")].find(
      (child) => painted(child) && covers(child),
    )
    if (child) return [child, null]
    const pseudo = ["::before", "::after"].find((pseudo) => {
      const style = getComputedStyle(el, pseudo)
      return (
        painted(el, pseudo) &&
        Number.parseFloat(style.width) >= box.width * 0.8 &&
        Number.parseFloat(style.height) >= box.height * 0.8
      )
    })
    return [el, pseudo ?? null]
  }
  const px = (n: number) => `${Math.round(n * 10) / 10}px`
  const read = (el: Element, target: Target) => {
    const style = getComputedStyle(el)
    const [box, pseudo] = boxOf(el, target)
    const paint = getComputedStyle(box, pseudo)
    const inkEl = target.ink ? (el.querySelector(target.ink) ?? el) : el
    const ink = getComputedStyle(inkEl)
    const all: Record<string, string> = {
      backgroundColor: seen(
        paint.backgroundColor,
        pseudo ? el : box.parentElement,
      ),
      color: seen(ink.color, inkEl),
      borderRadius: paint.borderTopLeftRadius,
      height: pseudo
        ? px(Number.parseFloat(paint.height))
        : px(box.getBoundingClientRect().height),
      paddingInline: style.paddingLeft,
      fontFamily: ink.fontFamily,
      fontSize: ink.fontSize,
      fontWeight: ink.fontWeight,
      letterSpacing: ink.letterSpacing,
      boxShadow: paint.boxShadow,
      edge: pseudo
        ? (edgeOf(paint, el) ?? edge(el))
        : target.box || edge(el) === "none"
          ? edge(box)
          : edge(el),
      ring: ring(el),
    }
    return Object.fromEntries(props.map((prop) => [prop, all[prop]]))
  }
  return Object.fromEntries(
    Object.entries(targets).map(([part, target]) => {
      const el = find(target)
      if (el && focus) (el as HTMLElement).focus()
      return [part, el ? read(el, target) : null]
    }),
  )
}

/** A JavaScript expression that returns the measures of `targets` on the
 *  current page: for `page.evaluate`, and for a tab driven by Claude in
 *  Chrome (its JavaScript tool). `focus` also focuses each match. The
 *  `__name` shim covers the helper tsx compiles into `probe`. */
export const snippet = (
  targets: Record<string, Target>,
  { focus = false } = {},
) =>
  `(() => { const __name = (fn) => fn; return (${probe.toString()})(${JSON.stringify(targets)}, ${JSON.stringify(PROPS)}, ${focus}) })()`

const cell = (label: string) => `[data-cell="${label}"]`

/** The parts a reference pack measures, as the specimen sheets show them. A
 *  pack names the same parts with its product's own targets. */
export const SPECIMEN_TARGETS: Record<
  string,
  { sheet: SheetName; target: Target }
> = {
  page: { sheet: "actions", target: { selector: "[data-specimen]" } },
  "button.primary": {
    sheet: "actions",
    target: { within: cell("button · md"), text: "Primary" },
  },
  "button.secondary": {
    sheet: "actions",
    target: { within: cell("button · md"), text: "Secondary" },
  },
  "button.quiet": {
    sheet: "actions",
    target: { within: cell("button · md"), text: "Quiet" },
  },
  input: {
    sheet: "fields",
    target: { within: cell("text field · description"), selector: "input" },
  },
  "button.focus": {
    sheet: "actions",
    target: { selector: "[data-specimen-focus]" },
  },
  "select.trigger": {
    sheet: "fields",
    target: { within: cell("select · trigger"), selector: "button" },
  },
  "input.focus": {
    sheet: "fields",
    target: { selector: "[data-specimen-focus]" },
  },
  checkbox: {
    sheet: "selection",
    target: { selector: "[data-checkbox-indicator]:not([data-selected])" },
  },
  "checkbox.checked": {
    sheet: "selection",
    target: { selector: "[data-checkbox-indicator][data-selected]" },
  },
  "switch.on": {
    sheet: "selection",
    target: { selector: "[data-switch-indicator][data-selected]" },
  },
  "switch.off": {
    sheet: "selection",
    target: { selector: "[data-switch-indicator]:not([data-selected])" },
  },
  tab: {
    sheet: "navigation",
    target: {
      within: cell("tabs · preset default"),
      selector: "[data-tab]:not([data-selected]):not([data-disabled])",
    },
  },
  "tab.selected": {
    sheet: "navigation",
    target: {
      within: cell("tabs · preset default"),
      selector: "[data-tab][data-selected]",
    },
  },
  link: {
    sheet: "navigation",
    target: { within: cell("links in text"), selector: "a" },
  },
  shell: {
    sheet: "navigation",
    target: { selector: "[data-sidebar-wrapper]", surface: true },
  },
  panel: { sheet: "navigation", target: { selector: "[data-sidebar-inset]" } },
  "nav.item": {
    sheet: "navigation",
    target: { selector: "[data-sidebar-menu-button]:not([data-active])" },
  },
  "nav.item.active": {
    sheet: "navigation",
    target: { selector: "[data-sidebar-menu-button][data-active]" },
  },
  menu: {
    sheet: "menu",
    target: { selector: "[data-menu-content]", surface: true },
  },
  "menu.item": { sheet: "menu", target: { selector: "[data-menu-item]" } },
  tooltip: {
    sheet: "menu",
    target: { selector: "[data-tooltip]", surface: true },
  },
  command: {
    sheet: "command",
    target: { selector: "[data-command]", surface: true },
  },
  "command.item": {
    sheet: "command",
    target: { within: "[data-command]", selector: "[data-listbox-item]" },
  },
  kbd: {
    sheet: "display",
    target: { within: cell("avatars · kbd"), selector: "[data-kbd]" },
  },
  dialog: {
    sheet: "dialog",
    target: { selector: "[data-dialog-content]", surface: true },
  },
  card: { sheet: "display", target: { selector: "[data-card]" } },
  badge: {
    sheet: "feedback",
    target: {
      within: cell("badge · preset default"),
      selector: "[data-badge]",
      text: "neutral",
    },
  },
  "badge.accent": {
    sheet: "feedback",
    target: {
      within: cell("badge · preset default"),
      selector: "[data-badge]",
      text: "accent",
    },
  },
  "heading.1": {
    sheet: "type",
    target: { within: cell("h1 · text-4xl"), selector: "h1" },
  },
  "heading.2": {
    sheet: "type",
    target: { within: cell("h2 · text-3xl"), selector: "h2" },
  },
  "heading.3": {
    sheet: "type",
    target: { within: cell("h3 · text-2xl"), selector: "h3" },
  },
  "heading.4": {
    sheet: "type",
    target: { within: cell("h4 · text-xl"), selector: "h4" },
  },
  text: {
    sheet: "type",
    target: { within: cell("body · text-base"), selector: ":scope > div > p" },
  },
  "text.muted": {
    sheet: "type",
    target: {
      within: cell("muted · text-sm text-fg-muted"),
      selector: ":scope > div > p",
    },
  },
}
