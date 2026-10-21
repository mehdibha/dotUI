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
}

export const PROPS = [
  "backgroundColor",
  "color",
  "borderColor",
  "borderWidth",
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
/** A reference pack's `tokens.json`: what the real product measures. */
export type ReferenceTokens = Partial<Record<"light" | "dark", Measures>>

/* Runs in the page and closes over nothing, so its source can be sent as a
   string (see `snippet`). */
function probe(
  targets: Record<string, Target>,
  props: readonly string[],
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
  const painted = (el: Element) => {
    const style = getComputedStyle(el)
    return (
      alpha(style.backgroundColor) > 0.1 || style.backgroundImage !== "none"
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
     up to 1.5px, or either on ::before or ::after. */
  const edgeOf = (style: CSSStyleDeclaration) => {
    const width = Number.parseFloat(style.borderTopWidth)
    if (
      style.borderTopStyle !== "none" &&
      width > 0 &&
      alpha(style.borderTopColor) > 0
    )
      return `${width}px ${style.borderTopColor}`
    const hairline = rings(style).find(
      (ring) => ring.spread > 0 && ring.spread <= 1.5,
    )
    return hairline ? `${hairline.spread}px ${hairline.color}` : null
  }
  const edge = (el: Element) => {
    for (const pseudo of [null, "::before", "::after"]) {
      const style = getComputedStyle(el, pseudo)
      if (pseudo && style.content === "none") continue
      const found = edgeOf(style)
      if (found) return found
    }
    return "none"
  }
  /* The focus ring, "<width>px <color> +<offset>px", from an outline or from
     the outermost ring (the one inside it sets the offset). Focused parts
     only. */
  const ring = (el: Element) => {
    if (
      !el.matches(":focus-visible, [data-focus-visible], [data-specimen-focus]")
    )
      return "none"
    const style = getComputedStyle(el)
    const width = Number.parseFloat(style.outlineWidth)
    if (style.outlineStyle !== "none" && width > 0)
      return `${width}px ${style.outlineColor} +${Number.parseFloat(style.outlineOffset)}px`
    const outer = rings(style)
      .filter((ring) => !ring.inset && ring.spread > 0)
      .sort((a, b) => a.spread - b.spread)
    const last = outer.at(-1)
    if (!last) return "none"
    const offset = outer.at(-2)?.spread ?? 0
    return `${last.spread - offset}px ${last.color} +${offset}px`
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
  const read = (el: Element) => {
    const style = getComputedStyle(el)
    const all: Record<string, string> = {
      backgroundColor: style.backgroundColor,
      color: style.color,
      borderColor: style.borderTopColor,
      borderWidth: style.borderTopWidth,
      borderRadius: style.borderTopLeftRadius,
      height: `${Math.round(el.getBoundingClientRect().height * 10) / 10}px`,
      paddingInline: style.paddingLeft,
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      letterSpacing: style.letterSpacing,
      boxShadow: style.boxShadow,
      edge: edge(el),
      ring: ring(el),
    }
    return Object.fromEntries(props.map((prop) => [prop, all[prop]]))
  }
  return Object.fromEntries(
    Object.entries(targets).map(([part, target]) => {
      const el = find(target)
      return [part, el ? read(el) : null]
    }),
  )
}

/** A JavaScript expression that returns the measures of `targets` on the
 *  current page: for `page.evaluate`, and for a tab driven by Claude in
 *  Chrome (its JavaScript tool). The `__name` shim covers the helper tsx
 *  compiles into `probe`. */
export const snippet = (targets: Record<string, Target>) =>
  `(() => { const __name = (fn) => fn; return (${probe.toString()})(${JSON.stringify(targets)}, ${JSON.stringify(PROPS)}) })()`

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
  kbd: { sheet: "command", target: { selector: "[data-kbd]" } },
  dialog: {
    sheet: "dialog",
    target: { selector: "[data-dialog-content]", surface: true },
  },
  card: { sheet: "display", target: { selector: "[data-card]" } },
  badge: { sheet: "feedback", target: { selector: "[data-badge]" } },
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
    target: { within: cell("body · text-base"), selector: "p" },
  },
  "text.muted": {
    sheet: "type",
    target: { within: cell("muted · text-sm text-fg-muted"), selector: "p" },
  },
}
