/* Measures what a preset has to match: the computed styles of named parts,
   read the same way from the real product (a browser tab) and from the
   specimen sheets, so the two compare property by property. */

import type { SheetName } from "./sheets"

/** Where a part sits on a page. `text` matches an element's own trimmed text
 *  and climbs to its control; `surface` climbs to the first painted box. */
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
  const painted = (el: Element) => {
    const style = getComputedStyle(el)
    return (
      !/^(transparent|rgba\(0, 0, 0, 0\))$/.test(style.backgroundColor) ||
      style.backgroundImage !== "none"
    )
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
  "select.trigger": {
    sheet: "fields",
    target: { within: cell("select · trigger"), selector: "button" },
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
  "tab.selected": {
    sheet: "navigation",
    target: { selector: "[data-tab][data-selected]" },
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
  dialog: {
    sheet: "dialog",
    target: { selector: "[data-dialog-content]", surface: true },
  },
  card: { sheet: "display", target: { selector: "[data-card]" } },
  badge: { sheet: "feedback", target: { selector: "[data-badge]" } },
}
