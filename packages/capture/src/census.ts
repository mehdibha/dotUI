/* The census: every element a page paints or labels, its role and about 40
   computed values, read with no hand-written selectors. The 12 values the
   diff compares come from the probe itself (one call over every element), so
   a census reading and a probe reading mean the same thing; the rest are
   plain computed styles. It never reads text, only its length. */

import { compareMeasures } from "./compare"
import { type Measure, PROPS, type Prop, snippet } from "./probe"

/** Computed styles the census adds to the probe's, each with the value it
 *  leaves out of the files when the element shows it. */
export const EXTRA = {
  width: undefined,
  paddingTop: "0px",
  paddingBottom: "0px",
  paddingRight: "0px",
  gap: "normal",
  lineHeight: undefined,
  textTransform: "none",
  textDecorationLine: "none",
  textUnderlineOffset: "auto",
  fontStyle: "normal",
  fontVariantNumeric: "normal",
  fontFeatureSettings: "normal",
  textAlign: "start",
  opacity: "1",
  backgroundImage: "none",
  backdropFilter: "none",
  filter: "none",
  transform: "none",
  mixBlendMode: "normal",
  corners: undefined,
  iconSize: undefined,
  iconStroke: undefined,
  transition: "none",
  cursor: "auto",
  position: "static",
  display: undefined,
  zIndex: "auto",
} as const satisfies Record<string, string | undefined>

export type Extra = keyof typeof EXTRA
export type Values = Partial<Record<Prop | Extra, string>>
export type State = "hover" | "pressed" | "focus"
export const STATES: readonly State[] = ["hover", "pressed", "focus"]
/** States an element is in as found, read from its attributes. */
export type Flag = "disabled" | "invalid" | "selected" | "open"
/** The flags the census sets on an element to read it in that state, when
 *  the page doesn't show one (`force`): the product's own CSS for them. */
export type Forced = Exclude<Flag, "open">
export const FORCED: readonly Forced[] = ["disabled", "invalid", "selected"]

export interface CensusElement {
  id: number
  role: string
  /** How the role was found: its ARIA role, its tag, or its box's shape. */
  by: "aria" | "tag" | "shape"
  tag: string
  /** The nearest control or landmark around it: a label's button. */
  in?: string
  /** Headings: 1–6. */
  level?: number
  /** Page coordinates, rounded: x, y, width, height. */
  box: [number, number, number, number]
  /** Its own text's length; the text itself is never read. */
  chars: number
  /** Whether it can take keyboard focus. */
  focusable?: boolean
  /** Disabled, invalid, selected (checked, pressed, current) or open as
   *  found. */
  is?: Flag
  values: Values
  /** Only the values a state changes. */
  states?: Partial<Record<State | Forced, Values>>
  /** The states in `states` read by setting their flag. */
  forced?: Forced[]
  /** The custom property each value comes from, where one does. */
  vars?: Values
}

export interface CensusPage {
  /** The pack's page key: a URL, or one with account segments as
   *  placeholders. */
  key: string
  mode: "light" | "dark"
  probe: string
  /** "rest", or the steps that opened what this pass read (an overlay). */
  pass: string
  viewport: { width: number; height: number }
  elements: CensusElement[]
  /** The custom properties `vars` names, as resolved on the root. */
  tokens?: Record<string, string>
  /** Elements past the cap that were left out. */
  truncated?: number
  /** What this census version reads beyond values and forced states. */
  reads?: Reads[]
}

/** Disabled, selected and open elements (`is`), and icon strokes; "states":
 *  pressed and focus forced, and disabled, invalid and selected set. */
export type Reads = "flags" | "icons" | "states"

type Command =
  /** `fresh`: only elements new or changed since `seen` ("new": new only,
   *  for a hover, which restyles the hovered element and its ancestors). */
  | { kind: "walk"; max: number; fresh: boolean | "new"; start: number }
  | { kind: "read"; ids: number[]; focus: boolean }
  | { kind: "seen" }
  | { kind: "appeared" }
  | { kind: "vars"; ids: number[] }
  | { kind: "focus"; ids: number[] }
  | { kind: "node"; id: number }
  | { kind: "force"; id: number; state: Forced | null }
  | { kind: "clear" }

/* Runs in the page and closes over nothing, so its source can be sent as a
   string with the probe's (see `censusSnippet`). */
function census(
  probe: (
    targets: Record<string, { selector: string; focus?: boolean }>,
    props: Record<string, readonly string[]>,
    focus: boolean,
    mark: boolean,
  ) => Record<string, Record<string, string> | null>,
  props: readonly string[],
  command: Command,
) {
  const ID = "data-census"
  const HOST = "data-census-host"
  /* Each element's look when `seen` ran, so a later walk on the same load
     keeps only what an interaction opened or changed. */
  const scope = globalThis as unknown as {
    __censusSeen?: WeakMap<Element, string>
    __censusUndo?: (() => void)[]
  }
  const seen = (scope.__censusSeen ??= new WeakMap())
  const CONTROLS = new Set([
    "button",
    "link",
    "tab",
    "menuitem",
    "menuitemcheckbox",
    "menuitemradio",
    "option",
    "checkbox",
    "radio",
    "switch",
    "textbox",
    "searchbox",
    "combobox",
    "slider",
    "spinbutton",
    "treeitem",
    "select",
  ])
  const LANDMARKS = new Set([
    "navigation",
    "dialog",
    "alertdialog",
    "menu",
    "menubar",
    "listbox",
    "tooltip",
    "banner",
    "complementary",
    "contentinfo",
    "table",
    "grid",
    "tablist",
    "toolbar",
    "search",
    "radiogroup",
  ])
  const ALWAYS = new Set([
    "heading",
    "img",
    "icon",
    "kbd",
    "separator",
    "progressbar",
    "meter",
    "dialog",
    "alertdialog",
    "menu",
    "listbox",
    "tooltip",
    "page",
    "avatar",
  ])
  const alpha = (color: string) => {
    if (color === "transparent") return 0
    const match = /[,/]\s*([\d.]+)(%?)\s*\)$/.exec(color)
    if (!match || (color.startsWith("rgb(") && !color.includes("/"))) return 1
    return Number(match[1]) / (match[2] ? 100 : 1)
  }
  const parent = (el: Element): Element | null =>
    el.parentElement ?? ((el.getRootNode() as ShadowRoot).host || null)
  /* Every element, shadow roots included, in document order. */
  const all = (root: ParentNode, out: Element[] = []) => {
    for (const el of root.querySelectorAll("*")) {
      out.push(el)
      if (el.shadowRoot) {
        el.setAttribute(HOST, "")
        all(el.shadowRoot, out)
      }
    }
    return out
  }
  const hosts = new Map<Element, number>()
  const selectorOf = (el: Element) => {
    const chain: string[] = [`[${ID}="${el.getAttribute(ID)}"]`]
    for (
      let root = el.getRootNode();
      root instanceof ShadowRoot;
      root = root.host.getRootNode()
    ) {
      let host = hosts.get(root.host)
      if (host === undefined) {
        host = hosts.size
        hosts.set(root.host, host)
      }
      root.host.setAttribute(HOST, String(host))
      chain.unshift(`[${HOST}="${host}"]`)
    }
    return chain.join(" >>> ")
  }
  const byId = (id: number) => {
    const match = (root: ParentNode): Element | null => {
      const found = root.querySelector(`[${ID}="${id}"]`)
      if (found) return found
      for (const host of root.querySelectorAll(`[${HOST}]`)) {
        const inner = host.shadowRoot && match(host.shadowRoot)
        if (inner) return inner
      }
      return null
    }
    return match(document)
  }
  const shown = (el: Element) => {
    const rect = el.getBoundingClientRect()
    return (
      rect.width * rect.height > 1 &&
      el.checkVisibility({ opacityProperty: true, visibilityProperty: true })
    )
  }
  const paints = (style: CSSStyleDeclaration) =>
    alpha(style.backgroundColor) > 0.1 ||
    style.backgroundImage !== "none" ||
    style.boxShadow !== "none" ||
    (["Top", "Right", "Bottom", "Left"] as const).some(
      (side) =>
        style.getPropertyValue(`border-${side.toLowerCase()}-style`) !==
          "none" &&
        Number.parseFloat(
          style.getPropertyValue(`border-${side.toLowerCase()}-width`),
        ) > 0 &&
        alpha(style.getPropertyValue(`border-${side.toLowerCase()}-color`)) > 0,
    )
  const paintsPseudo = (el: Element) =>
    ["::before", "::after"].some((pseudo) => {
      const style = getComputedStyle(el, pseudo)
      return (
        style.content !== "none" && style.content !== "normal" && paints(style)
      )
    })
  const ownText = (el: Element) => {
    let chars = 0
    for (const node of el.childNodes)
      if (node.nodeType === Node.TEXT_NODE)
        chars += (node.textContent ?? "").trim().length
    return chars
  }
  const implicit = (el: Element): string | undefined => {
    const tag = el.localName
    if (tag === "input") {
      const type = (el as HTMLInputElement).type
      if (type === "checkbox" || type === "radio") return type
      if (type === "range") return "slider"
      if (["button", "submit", "reset", "image"].includes(type)) return "button"
      if (type === "search") return "searchbox"
      if (type === "number") return "spinbutton"
      return type === "hidden" ? undefined : "textbox"
    }
    if (tag === "a" || tag === "area")
      return el.hasAttribute("href") ? "link" : undefined
    if (tag === "select")
      return (el as HTMLSelectElement).multiple ? "listbox" : "select"
    if (/^h[1-6]$/.test(tag)) return "heading"
    return (
      {
        button: "button",
        summary: "button",
        textarea: "textbox",
        img: "img",
        svg: "icon",
        kbd: "kbd",
        label: "label",
        nav: "navigation",
        dialog: "dialog",
        table: "table",
        th: "columnheader",
        td: "cell",
        tr: "row",
        li: "listitem",
        ul: "list",
        ol: "list",
        hr: "separator",
        progress: "progressbar",
        meter: "meter",
        p: "paragraph",
        code: "code",
        pre: "code",
        header: "banner",
        footer: "contentinfo",
        aside: "complementary",
        main: "main",
        body: "page",
        blockquote: "blockquote",
        time: "time",
      } as Record<string, string>
    )[tag]
  }
  /* A role from the box alone, for elements no role or tag names. */
  const shape = (
    rect: DOMRect,
    style: CSSStyleDeclaration,
    chars: number,
    painted: boolean,
  ) => {
    const { width: w, height: h } = rect
    if (!painted) return "text"
    const radius = Number.parseFloat(style.borderTopLeftRadius) || 0
    if ((h <= 2 && w >= 8) || (w <= 2 && h >= 8)) return "separator"
    if (Math.abs(w - h) <= 2 && w >= 12 && w <= 64 && radius >= h / 2 - 1)
      return chars ? "badge" : "avatar"
    if (h <= 32 && w <= 240 && chars > 0) return "badge"
    if (w * h >= 120 * 60)
      return style.boxShadow !== "none" ||
        radius > 0 ||
        style.borderTopWidth !== "0px"
        ? "card"
        : "panel"
    return "box"
  }
  /* Disabled, selected or open as found, from ARIA, the native state and
     the data attributes React Aria and Radix set. */
  const flagOf = (el: Element) => {
    const attr = (name: string) => el.getAttribute(name)
    if (
      el.matches(":disabled") ||
      attr("aria-disabled") === "true" ||
      el.hasAttribute("data-disabled")
    )
      return "disabled" as const
    let userInvalid = false
    try {
      userInvalid = el.matches(":user-invalid")
    } catch {
      // Older engines don't know :user-invalid.
    }
    if (
      attr("aria-invalid") === "true" ||
      el.hasAttribute("data-invalid") ||
      userInvalid
    )
      return "invalid" as const
    if (
      el.matches(":checked") ||
      attr("aria-checked") === "true" ||
      attr("aria-checked") === "mixed" ||
      attr("aria-selected") === "true" ||
      attr("aria-pressed") === "true" ||
      (attr("aria-current") ?? "false") !== "false" ||
      el.hasAttribute("data-selected") ||
      ["checked", "on", "active"].includes(attr("data-state") ?? "")
    )
      return "selected" as const
    if (
      attr("aria-expanded") === "true" ||
      (el.hasAttribute("open") && el.localName !== "dialog") ||
      attr("data-state") === "open"
    )
      return "open" as const
    return undefined
  }
  const roleOf = (
    el: Element,
    rect: DOMRect,
    style: CSSStyleDeclaration,
    chars: number,
    painted: boolean,
  ) => {
    const aria = el.getAttribute("role")?.trim().split(/\s+/)[0]
    if (
      aria &&
      aria !== "presentation" &&
      aria !== "none" &&
      aria !== "generic"
    )
      return { role: aria, by: "aria" as const }
    const tag = implicit(el)
    // A round, square image is an avatar.
    if (
      tag === "img" &&
      Math.abs(rect.width - rect.height) <= 2 &&
      rect.width >= 12 &&
      rect.width <= 96 &&
      (style.borderTopLeftRadius.endsWith("%")
        ? Number.parseFloat(style.borderTopLeftRadius) >= 50
        : Number.parseFloat(style.borderTopLeftRadius) >= rect.height / 2 - 1)
    )
      return { role: "avatar", by: "tag" as const }
    if (tag) return { role: tag, by: "tag" as const }
    if (painted && el.matches(":popover-open"))
      return { role: "popover", by: "shape" as const }
    return { role: shape(rect, style, chars, painted), by: "shape" as const }
  }
  const px = (n: number) => `${Math.round(n * 10) / 10}px`
  const extra = (el: Element) => {
    const style = getComputedStyle(el)
    const rect = el.getBoundingClientRect()
    const corners = [
      style.borderTopLeftRadius,
      style.borderTopRightRadius,
      style.borderBottomRightRadius,
      style.borderBottomLeftRadius,
    ]
    // The icon a small box holds (a button's), or the icon itself.
    let svg: SVGSVGElement | null =
      el.localName === "svg" ? (el as SVGSVGElement) : null
    let icon: DOMRect | null = svg ? rect : null
    if (!icon && rect.width * rect.height <= 400 * 100)
      for (const each of el.querySelectorAll("svg")) {
        const box = each.getBoundingClientRect()
        if (box.width && (!icon || box.width > icon.width)) {
          icon = box
          svg = each
        }
      }
    // Its stroke as drawn (the viewBox scales it), or "fill" for a filled
    // icon.
    let stroke = ""
    if (svg && icon) {
      const shape = [
        ...svg.querySelectorAll(
          "path, line, circle, rect, polyline, polygon, ellipse",
        ),
      ].find((part) => {
        const look = getComputedStyle(part)
        return look.stroke !== "none" && Number.parseFloat(look.strokeWidth) > 0
      })
      const view = svg.viewBox?.baseVal
      const scale =
        view?.width &&
        getComputedStyle(shape ?? svg).vectorEffect !== "non-scaling-stroke"
          ? icon.width / view.width
          : 1
      stroke = shape
        ? px(Number.parseFloat(getComputedStyle(shape).strokeWidth) * scale)
        : "fill"
    }
    const values: Record<string, string> = {
      width: px(rect.width),
      paddingTop: style.paddingTop,
      paddingBottom: style.paddingBottom,
      paddingRight: style.paddingRight,
      gap:
        style.rowGap === style.columnGap
          ? style.columnGap
          : `${style.rowGap} ${style.columnGap}`,
      lineHeight: style.lineHeight,
      textTransform: style.textTransform,
      textDecorationLine: style.textDecorationLine,
      textUnderlineOffset:
        style.textDecorationLine === "none"
          ? "auto"
          : style.textUnderlineOffset,
      fontStyle: style.fontStyle,
      fontVariantNumeric: style.fontVariantNumeric,
      fontFeatureSettings: style.fontFeatureSettings,
      textAlign: style.textAlign === "left" ? "start" : style.textAlign,
      opacity: style.opacity,
      // Image URLs can point at account content: keep only that one is set.
      backgroundImage: style.backgroundImage.replace(/url\([^)]*\)/g, "url()"),
      backdropFilter: style.backdropFilter || "none",
      filter: style.filter,
      transform: style.transform,
      mixBlendMode: style.mixBlendMode,
      corners: new Set(corners).size > 1 ? corners.join(" ") : "",
      iconSize: icon
        ? `${Math.round(icon.width)}x${Math.round(icon.height)}`
        : "",
      iconStroke: stroke,
      // The first transition's timing stands for the rest.
      transition: style.transitionDuration
        .split(",")
        .every((d) => Number.parseFloat(d) === 0)
        ? "none"
        : `${style.transitionDuration.split(",")[0]} ${style.transitionTimingFunction.split(/,(?![^(]*\))/)[0]}`,
      cursor: style.cursor,
      position: style.position,
      display: style.display,
      zIndex: style.zIndex,
    }
    return values
  }
  const read = (els: Element[], focus: boolean) => {
    const targets = Object.fromEntries(
      els.map((el) => [
        el.getAttribute(ID) as string,
        { selector: selectorOf(el), focus },
      ]),
    )
    const measured = probe(
      targets,
      Object.fromEntries(Object.keys(targets).map((id) => [id, props])),
      false,
      false,
    )
    return els.map((el) => {
      const values: Record<string, string> = {
        ...(measured[el.getAttribute(ID) as string] ?? {}),
        ...extra(el),
      }
      if (!focus) delete values.ring
      // The first family is what the diff compares; the stack repeats on
      // every element.
      if (values.fontFamily)
        values.fontFamily =
          values.fontFamily.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/)[0]?.trim() ??
          ""

      return values
    })
  }
  const keep = (el: Element) => {
    const tag = el.localName
    if (
      [
        "script",
        "style",
        "link",
        "meta",
        "template",
        "noscript",
        "head",
        "title",
        "br",
        "wbr",
        "option",
      ].includes(tag)
    )
      return false
    // An svg's own shapes belong to the icon.
    return !(el instanceof SVGElement && tag !== "svg")
  }
  /* What `seen` keeps of an element's look: enough to tell an opened,
     re-rendered or restyled element from the one already read. Width is
     left out, since a scroll lock that hides the scrollbar widens rows. */
  const lookOf = (el: Element) => {
    const style = getComputedStyle(el)
    return [
      style.backgroundColor,
      style.backgroundImage.length,
      style.color,
      style.borderTopColor,
      style.borderTopWidth,
      style.borderBottomColor,
      style.borderBottomWidth,
      style.borderTopLeftRadius,
      style.boxShadow,
      style.outlineStyle,
      style.outlineColor,
      style.fontSize,
      style.fontWeight,
      style.opacity,
      style.transform,
      style.filter,
      Math.round(el.getBoundingClientRect().height),
      flagOf(el) ?? "",
    ].join("|")
  }

  if (command.kind === "clear") {
    for (const el of all(document))
      for (const name of [ID, HOST]) el.removeAttribute(name)
    scope.__censusSeen = new WeakMap()
    return null
  }
  if (command.kind === "seen") {
    for (const el of all(document))
      if (keep(el) && shown(el)) seen.set(el, lookOf(el))
    return null
  }
  if (command.kind === "appeared") {
    /* How many shown elements that paint or hold text came after `seen`:
       whether a click or hover opened anything. */
    let count = 0
    for (const el of all(document))
      if (
        keep(el) &&
        !seen.has(el) &&
        shown(el) &&
        (ownText(el) || paints(getComputedStyle(el)))
      )
        count++
    return count
  }
  if (command.kind === "node") return byId(command.id)
  if (command.kind === "force") {
    /* Sets one state on an element through the attributes and native
       properties systems style it by (ARIA, React Aria's and Radix's data
       attributes, :disabled, :checked, :invalid), so its look in that state
       reads off the product's own CSS. No event fires, so nothing the page
       keeps changes. `state: null` puts everything back. Returns whether the
       state applies to the element's role. */
    for (const undo of (scope.__censusUndo ?? []).reverse()) undo()
    const undo: (() => void)[] = (scope.__censusUndo = [])
    const el = byId(command.id)
    if (!command.state || !el) return false
    const role =
      el.getAttribute("role")?.trim().split(/\s+/)[0] ?? implicit(el) ?? ""
    const set = (name: string, value: string) => {
      const was = el.getAttribute(name)
      undo.push(() =>
        was === null ? el.removeAttribute(name) : el.setAttribute(name, was),
      )
      el.setAttribute(name, value)
    }
    const flip = <T extends object, K extends keyof T>(
      target: T,
      key: K,
      value: T[K],
    ) => {
      const was = target[key]
      undo.push(() => {
        target[key] = was
      })
      target[key] = value
    }
    const CHECKED = [
      "checkbox",
      "radio",
      "switch",
      "menuitemcheckbox",
      "menuitemradio",
    ]
    if (command.state === "disabled") {
      if (!CONTROLS.has(role)) return false
      if ("disabled" in el) flip(el as HTMLButtonElement, "disabled", true)
      set("aria-disabled", "true")
      set("data-disabled", "true")
      return true
    }
    if (command.state === "invalid") {
      if (
        ![
          "textbox",
          "searchbox",
          "combobox",
          "select",
          "spinbutton",
          "checkbox",
        ].includes(role)
      )
        return false
      set("aria-invalid", "true")
      set("data-invalid", "true")
      const field = el as HTMLInputElement
      if (typeof field.setCustomValidity === "function") {
        field.setCustomValidity("invalid")
        undo.push(() => field.setCustomValidity(""))
      }
      return true
    }
    if (
      el instanceof HTMLInputElement &&
      (el.type === "checkbox" || el.type === "radio")
    ) {
      // Checking a radio unchecks its group: put the group back too.
      if (el.type === "radio" && el.name)
        for (const other of document.querySelectorAll<HTMLInputElement>(
          `input[type=radio][name="${CSS.escape(el.name)}"]`,
        ))
          flip(other, "checked", other.checked)
      flip(el, "checked", true)
      set("data-state", "checked")
      set("data-selected", "true")
    } else if (CHECKED.includes(role)) {
      set("aria-checked", "true")
      set("data-state", "checked")
      set("data-selected", "true")
    } else if (
      ["tab", "option", "treeitem", "row", "gridcell"].includes(role)
    ) {
      set("aria-selected", "true")
      if (role === "tab") set("data-state", "active")
      set("data-selected", "true")
    } else if (el.hasAttribute("aria-pressed")) {
      set("aria-pressed", "true")
      set("data-state", "on")
      set("data-selected", "true")
    } else if (
      role === "link" &&
      el.closest("nav, [role=navigation], [role=tablist]")
    )
      set("aria-current", "page")
    else return false
    return true
  }
  if (command.kind === "read") {
    const els = command.ids.map(byId)
    const found = els.filter((el): el is Element => !!el)
    const values = read(found, command.focus)
    return Object.fromEntries(
      found.map((el, i) => [el.getAttribute(ID), values[i]]),
    )
  }
  if (command.kind === "focus") {
    /* Focused from script, for the kit, which has no DevTools protocol:
       fields show :focus-visible this way, other controls only once the
       keyboard was used on the page. */
    const out: Record<string, Values> = {}
    for (const id of command.ids) {
      const el = byId(id)
      if (!(el instanceof HTMLElement || el instanceof SVGElement)) continue
      el.focus({ preventScroll: true, focusVisible: true } as FocusOptions)
      for (const animation of document.getAnimations())
        if (animation.effect?.getComputedTiming().iterations !== Infinity)
          try {
            animation.finish()
          } catch {
            // Some animations can't finish (an infinite delay).
          }
      const [values] = read([el], true)
      if (values) out[id] = values
      el.blur()
    }
    return out
  }
  if (command.kind === "vars") {
    /* Approximates the cascade: of the rules that match, the last one in
       document order that sets a property names its custom property.
       Specificity, !important and nesting are ignored. */
    const PROP_OF: [RegExp, string[]][] = [
      [/^background(-color)?$/, ["backgroundColor"]],
      [/^background-image$/, ["backgroundImage"]],
      [/^color$/, ["color"]],
      [
        /^border(-top|-bottom|-left|-right|-inline|-block)?(-color|-width)?$/,
        ["edge"],
      ],
      [/^outline(-color|-width)?$/, ["edge"]],
      [/^box-shadow$/, ["boxShadow", "edge"]],
      [/^border(-[a-z]+)*-radius$/, ["borderRadius"]],
      [/^(min-)?height$/, ["height"]],
      [/^(min-)?width$/, ["width"]],
      [
        /^padding$/,
        ["paddingInline", "paddingTop", "paddingBottom", "paddingRight"],
      ],
      [/^padding-(inline|inline-start|left)$/, ["paddingInline"]],
      [/^padding-(inline-end|right)$/, ["paddingRight"]],
      [/^padding-(block|block-start|top)$/, ["paddingTop"]],
      [/^padding-(block-end|bottom)$/, ["paddingBottom"]],
      [/^font$/, ["fontFamily", "fontSize", "fontWeight", "lineHeight"]],
      [/^font-family$/, ["fontFamily"]],
      [/^font-size$/, ["fontSize"]],
      [/^font-weight$/, ["fontWeight"]],
      [/^letter-spacing$/, ["letterSpacing"]],
      [/^line-height$/, ["lineHeight"]],
      [/^(row-|column-)?gap$/, ["gap"]],
      [/^opacity$/, ["opacity"]],
      [/^backdrop-filter$/, ["backdropFilter"]],
    ]
    const SHORTHANDS = [
      "background",
      "border",
      "border-color",
      "border-width",
      "border-top",
      "border-bottom",
      "border-inline",
      "border-block",
      "border-radius",
      "outline",
      "padding",
      "padding-inline",
      "padding-block",
      "font",
      "gap",
    ]
    const rules: CSSStyleRule[] = []
    const collect = (list: CSSRuleList) => {
      for (const rule of list) {
        if (rule instanceof CSSStyleRule) {
          if (!rule.selectorText.includes("&")) rules.push(rule)
        } else if (rule instanceof CSSMediaRule) {
          if (matchMedia(rule.media.mediaText).matches) collect(rule.cssRules)
        } else if (rule instanceof CSSSupportsRule) {
          if (CSS.supports(rule.conditionText)) collect(rule.cssRules)
        } else if ("cssRules" in rule)
          collect((rule as CSSGroupingRule).cssRules)
      }
    }
    for (const sheet of document.styleSheets)
      try {
        collect(sheet.cssRules)
      } catch {
        // Cross-origin sheets don't expose their rules.
      }
    const names = new Set<string>()
    const out: Record<string, Record<string, string>> = {}
    for (const id of command.ids) {
      const el = byId(id)
      if (!el) continue
      const found: Record<string, string> = {}
      const note = (declarations: CSSStyleDeclaration) => {
        // A shorthand set through var() leaves its longhands empty.
        for (const name of [...declarations, ...SHORTHANDS]) {
          const value = declarations.getPropertyValue(name)
          const ref = /var\(\s*(--[\w-]+)/.exec(value)?.[1]
          if (!ref) continue
          for (const [pattern, keys] of PROP_OF)
            if (pattern.test(name)) for (const key of keys) found[key] = ref
        }
      }
      for (const rule of rules)
        try {
          if (el.matches(rule.selectorText)) note(rule.style)
        } catch {
          // A selector this engine can't match (vendor pseudo-classes).
        }
      if (el instanceof HTMLElement || el instanceof SVGElement) note(el.style)
      for (const name of Object.values(found)) names.add(name)
      if (Object.keys(found).length) out[id] = found
    }
    const root = getComputedStyle(document.documentElement)
    const tokens = Object.fromEntries(
      [...names].sort().map((name) => [
        name,
        // Custom properties can carry an account's image URLs.
        root
          .getPropertyValue(name)
          .trim()
          .replace(/url\([^)]*\)/g, "url()")
          .slice(0, 200),
      ]),
    )
    return { vars: out, tokens }
  }

  // walk: every shown element that paints, holds text, or is a control.
  const elements: CensusElement[] = []
  const kept = new Map<Element, DOMRect>()
  const roles = new Map<Element, string>()
  const OVERLAYS = new Set([
    "dialog",
    "alertdialog",
    "menu",
    "listbox",
    "tooltip",
    "popover",
  ])
  const inOverlay = (el: Element) => {
    for (let up = parent(el); up; up = parent(up))
      if (
        OVERLAYS.has(
          roles.get(up) ??
            up.getAttribute("role")?.trim().split(/\s+/)[0] ??
            "",
        )
      )
        return true
    return false
  }
  let next = command.start
  let truncated = 0
  for (const el of all(document)) {
    if (!keep(el) || !shown(el)) continue
    if (
      command.fresh &&
      (command.fresh === "new" ? seen.has(el) : seen.get(el) === lookOf(el))
    )
      continue
    // Syntax highlighting is the code block's content, not its look.
    if (el.parentElement?.closest("pre, code")) continue
    const style = getComputedStyle(el)
    const rect = el.getBoundingClientRect()
    const chars = ownText(el)
    const painted = paints(style) || paintsPseudo(el)
    let { role, by } = roleOf(el, rect, style, chars, painted)
    // What an interaction opened: a floating, raised box no role names.
    if (
      command.fresh &&
      by === "shape" &&
      painted &&
      (style.position === "absolute" || style.position === "fixed") &&
      (style.boxShadow !== "none" || style.backdropFilter !== "none") &&
      rect.width * rect.height >= 40 * 24 &&
      !inOverlay(el)
    ) {
      role = "popover"
      by = "shape"
    }
    // Unpainted structure (lists, landmarks, rows) shows through its parts.
    if (!painted && !chars && !CONTROLS.has(role) && !ALWAYS.has(role)) continue
    if (by === "shape") {
      // A box that covers its kept parent paints that parent (the probe
      // reads it as the parent's box).
      let up = parent(el)
      while (up && !kept.has(up)) up = parent(up)
      const box = up && kept.get(up)
      if (
        box &&
        !chars &&
        Math.abs(box.left - rect.left) <= 1 &&
        Math.abs(box.right - rect.right) <= 1 &&
        Math.abs(box.top - rect.top) <= 1 &&
        Math.abs(box.bottom - rect.bottom) <= 1
      )
        continue
    }
    if (elements.length >= command.max) {
      truncated++
      continue
    }
    kept.set(el, rect)
    roles.set(el, role)
    el.setAttribute(ID, String(next))
    let around: string | undefined
    for (let up = parent(el); up && !around; up = parent(up)) {
      const role =
        up.getAttribute("role")?.trim().split(/\s+/)[0] ?? implicit(up)
      if (role && (CONTROLS.has(role) || LANDMARKS.has(role))) around = role
    }
    const level =
      role === "heading"
        ? Number(el.getAttribute("aria-level")) ||
          Number(el.localName.slice(1)) ||
          undefined
        : undefined
    const focusable =
      (el as HTMLElement).tabIndex >= 0 &&
      !(el as HTMLButtonElement).disabled &&
      (CONTROLS.has(role) || el.hasAttribute("tabindex"))
    const is = flagOf(el)
    elements.push({
      id: next++,
      role,
      by,
      tag: el.localName,
      ...(around ? { in: around } : {}),
      ...(level ? { level } : {}),
      box: [rect.x + scrollX, rect.y + scrollY, rect.width, rect.height].map(
        Math.round,
      ) as [number, number, number, number],
      chars,
      ...(focusable ? { focusable } : {}),
      ...(is ? { is } : {}),
      values: {},
    })
  }
  const values = read(
    elements.map((element) => byId(element.id) as Element),
    false,
  )
  for (const [i, element] of elements.entries())
    element.values = values[i] ?? {}
  return {
    elements,
    truncated,
    viewport: { width: innerWidth, height: innerHeight },
    reads: ["flags", "icons"] as Reads[],
  }
}

/** The probe's own source, taken from the expression `snippet` builds, so
 *  the census and the kit run the probe as it is. */
export const probeSource = () => {
  const head = "(() => { const __name = (fn) => fn; return ("
  const tail = ")({}, {}, false, false) })()"
  const expression = snippet({})
  if (!expression.startsWith(head) || !expression.endsWith(tail))
    throw new Error("snippet() changed shape: update probeSource()")
  return expression.slice(head.length, -tail.length)
}

/** The census source with the probe bound, as a function expression of one
 *  argument (the command): for the kit, which defines it once per page. */
export const censusSource = () =>
  `((command) => { const __name = (fn) => fn; return (${census.toString()})(${probeSource()}, ${JSON.stringify(PROPS)}, command) })`

/** A JavaScript expression that runs one census command in the page. */
export const censusSnippet = (command: Command) =>
  `${censusSource()}(${JSON.stringify(command)})`

/** Leaves out the values an element shows by default, to keep files small. */
export function trim(values: Values): Values {
  return Object.fromEntries(
    Object.entries(values).filter(
      ([key, value]) => value !== "" && EXTRA[key as Extra] !== value,
    ),
  ) as Values
}

/** What a state changed, against the element at rest (both as read, before
 *  `trim`). */
export const changed = (rest: Values, state: Values): Values =>
  Object.fromEntries(
    Object.entries(state).filter(
      ([key, value]) => rest[key as keyof Values] !== value,
    ),
  ) as Values

/* What tells two looks of one role apart. Text takes its look from type and
   ink alone; boxes add their fill, edge, corners and size. */
const TYPE_KEYS: (Prop | Extra)[] = [
  "color",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "letterSpacing",
  "lineHeight",
  "textTransform",
  "fontStyle",
  "textDecorationLine",
]
const BOX_KEYS: (Prop | Extra)[] = [
  "backgroundColor",
  "borderRadius",
  "edge",
  "boxShadow",
  "backgroundImage",
  "backdropFilter",
  "opacity",
]
const CONTROL_KEYS: (Prop | Extra)[] = [
  ...BOX_KEYS,
  "height",
  "paddingInline",
  ...TYPE_KEYS.filter((key) => key !== "lineHeight"),
]
/* What a disabled, selected or open element shares with its rest look. */
const SHAPE_KEYS = new Set<Prop | Extra>([
  "height",
  "borderRadius",
  "paddingInline",
  "fontSize",
  "fontFamily",
])
const TEXT_ROLES = new Set([
  "text",
  "heading",
  "paragraph",
  "label",
  "code",
  "time",
  "blockquote",
  "columnheader",
  "cell",
])
const SURFACE_ROLES = new Set([
  "page",
  "card",
  "panel",
  "box",
  "dialog",
  "alertdialog",
  "menu",
  "listbox",
  "navigation",
  "banner",
  "complementary",
  "contentinfo",
  "main",
  "table",
  "list",
  "listitem",
  "row",
  "separator",
  "progressbar",
  "meter",
  "tablist",
  "toolbar",
  "region",
  "group",
  "article",
  "popover",
])

/** The keys that tell a role's looks apart. */
export function lookKeys(role: string): (Prop | Extra)[] {
  if (TEXT_ROLES.has(role)) return TYPE_KEYS
  if (role === "icon" || role === "img")
    return ["color", "iconSize", "iconStroke"]
  if (role === "tooltip")
    return [...BOX_KEYS, "color", "fontSize", "fontWeight", "height"]
  if (SURFACE_ROLES.has(role)) return BOX_KEYS
  return CONTROL_KEYS
}

/** Where looks are counted: a role, a heading level, and for text and
 *  icons the control or landmark they sit in ("text@button"). */
export const groupOf = (element: CensusElement) =>
  `${element.role}${element.level ? `.h${element.level}` : ""}${
    (TEXT_ROLES.has(element.role) || element.role === "icon") && element.in
      ? `@${element.in}`
      : ""
  }`

export interface Look {
  /** `<group>.<rank>`, by count: `button.1` is the most used button look. */
  id: string
  group: string
  count: number
  /** Page keys it shows on. */
  pages: string[]
  light?: Values
  dark?: Values
  /** Per mode, what each state changes: the ones read by forcing it, and
   *  the disabled, invalid, selected or open elements of the same shape. */
  states?: {
    light?: Partial<Record<State | Flag, Values>>
    dark?: Partial<Record<State | Flag, Values>>
  }
  /** The flag states read by setting them on the sample, where no element
   *  of the look was found in them. */
  forced?: Forced[]
  /** A disabled, invalid, selected or open look with no rest look of its
   *  shape. */
  is?: Flag
  /** The custom property behind each value, where one was found. */
  vars?: Values
  /** One element showing it: page key, pass, mode and census id. */
  sample: {
    key: string
    pass: string
    mode: "light" | "dark"
    id: number
    /** The same element's id in dark, when light leads. */
    twin?: number
  }
}

export interface Inventory {
  probe: string
  pages: { key: string; modes: ("light" | "dark")[]; passes: string[] }[]
  /** What every page's census read (CensusPage `reads`); older runs have
   *  none. */
  reads?: Reads[]
  looks: Look[]
  tokens: { light?: Record<string, string>; dark?: Record<string, string> }
}

const signature = (keys: (Prop | Extra)[], values: Values) =>
  JSON.stringify(keys.map((key) => values[key] ?? ""))

/** Two looks the diff can't tell apart are one: every compared value
 *  within the diff's tolerances, every other key equal. */
export const sameLook = (keys: (Prop | Extra)[], a: Values, b: Values) => {
  const probed = keys.filter((key) =>
    (PROPS as readonly string[]).includes(key),
  ) as Prop[]
  const pick = (values: Values) =>
    Object.fromEntries(
      probed.flatMap((key) => (values[key] ? [[key, values[key]]] : [])),
    ) as Measure
  const [x, y] = [pick(a), pick(b)]
  if (Object.keys(x).length !== Object.keys(y).length) return false
  if (!compareMeasures({ look: x }, { look: y }).every((row) => row.ok))
    return false
  return keys
    .filter((key) => !(PROPS as readonly string[]).includes(key))
    .every((key) => (a[key] ?? "") === (b[key] ?? ""))
}

/** Clusters a product's census pages into looks per role group, counted
 *  across pages, with each look's other mode and its states. Light leads
 *  where a page was read in both modes; the same element in dark (same page,
 *  pass, role and box: a theme moves nothing) gives the dark values. A page
 *  read only in dark (a signed-in run, one mode per run) gives dark-only
 *  looks. */
export function cluster(pages: CensusPage[], probe: string): Inventory {
  const where = (page: CensusPage) => `${page.key}|${page.pass}`
  const lit = new Set(pages.filter((page) => page.mode === "light").map(where))
  const key = (page: CensusPage, element: CensusElement) =>
    `${where(page)}|${element.role}|${element.box.join(",")}`
  const twins = new Map<string, CensusElement>()
  for (const page of pages)
    if (page.mode === "dark" && lit.has(where(page)))
      for (const element of page.elements)
        twins.set(key(page, element), element)

  type Member = { page: CensusPage; element: CensusElement }
  const groups = new Map<string, Map<string, Member[]>>()
  for (const page of pages) {
    if (page.mode === "dark" && lit.has(where(page))) continue
    for (const element of page.elements) {
      const group = groupOf(element)
      const keys = lookKeys(element.role)
      const bySignature = groups.get(group) ?? new Map<string, Member[]>()
      const sig = `${page.mode}|${signature(keys, element.values)}`
      bySignature.set(sig, [...(bySignature.get(sig) ?? []), { page, element }])
      groups.set(group, bySignature)
    }
  }

  const looks: Look[] = []
  for (const [group, bySignature] of groups) {
    const keys = lookKeys(group.split(/[.@]/)[0] ?? group)
    // Largest first, so a near-duplicate folds into the more common look.
    const clusters: Member[][] = []
    for (const members of [...bySignature.values()].sort(
      (a, b) => b.length - a.length,
    )) {
      const [one] = members
      const home = clusters.find(
        ([head]) =>
          head?.page.mode === one?.page.mode &&
          head?.element.is === one?.element.is &&
          sameLook(keys, head?.element.values ?? {}, one?.element.values ?? {}),
      )
      if (home) home.push(...members)
      else clusters.push([...members])
    }
    // A disabled, selected or open cluster is a state of the largest rest
    // look of its shape: what it changes goes there, and one that changes
    // nothing joins it. One with no rest look of its shape stays its own.
    const shape = keys.filter((key) => SHAPE_KEYS.has(key))
    const rest = clusters.filter(([head]) => !head?.element.is)
    const flags = new Map<Member[], Partial<Record<Flag, Member[]>>>()
    const own: Member[][] = []
    for (const members of clusters) {
      const [head] = members
      const flag = head?.element.is
      if (!head || !flag) continue
      const base = rest
        .filter(
          ([top]) =>
            top?.page.mode === head.page.mode &&
            sameLook(shape, top.element.values, head.element.values),
        )
        .sort((a, b) => b.length - a.length)[0]
      if (!base?.[0]) own.push(members)
      else if (
        !Object.keys(
          changed(trim(base[0].element.values), trim(head.element.values)),
        ).length
      )
        base.push(...members)
      else {
        const entry = flags.get(base) ?? {}
        entry[flag] = [...(entry[flag] ?? []), ...members]
        flags.set(base, entry)
      }
    }
    const kept = [...rest, ...own].sort((a, b) => b.length - a.length)
    for (const [rank, members] of kept.entries()) {
      const [first] = members
      if (!first) continue
      const lead = first.page.mode
      // The sample: a member read in a state, else the first.
      const sample = members.find((m) => m.element.states) ?? first
      const paired = members
        .map((member) => twins.get(key(member.page, member.element)))
        .filter((t): t is CensusElement => !!t)
      const twinSigs = new Map<string, CensusElement[]>()
      for (const t of paired) {
        const sig = signature(keys, t.values)
        twinSigs.set(sig, [...(twinSigs.get(sig) ?? []), t])
      }
      const darkest = [...twinSigs.values()].sort(
        (a, b) => b.length - a.length,
      )[0]
      const twin = darkest?.find((t) => t.states) ?? darkest?.[0]
      // Each flag's changes, against the sample and its twin.
      const found: { lead: Values; dark?: Values; flag: Flag }[] = []
      for (const [flag, list] of Object.entries(flags.get(members) ?? {})) {
        const [one] = list
        if (!one) continue
        const other = twins.get(key(one.page, one.element))
        found.push({
          flag: flag as Flag,
          lead: changed(trim(sample.element.values), trim(one.element.values)),
          ...(twin && other
            ? { dark: changed(trim(twin.values), trim(other.values)) }
            : {}),
        })
      }
      const leadStates = {
        ...sample.element.states,
        ...Object.fromEntries(found.map((f) => [f.flag, f.lead])),
      }
      const darkStates = {
        ...twin?.states,
        ...Object.fromEntries(
          found.flatMap((f) => (f.dark ? [[f.flag, f.dark]] : [])),
        ),
      }
      const forced = FORCED.filter(
        (state) =>
          !found.some((f) => f.flag === state) &&
          (sample.element.forced?.includes(state) ||
            twin?.forced?.includes(state)),
      )
      looks.push({
        id: `${group}.${rank + 1}`,
        group,
        count: members.length,
        pages: [...new Set(members.map((m) => m.page.key))],
        [lead]: trim(sample.element.values),
        ...(twin ? { dark: trim(twin.values) } : {}),
        ...(Object.keys(leadStates).length || Object.keys(darkStates).length
          ? {
              states: {
                ...(Object.keys(leadStates).length
                  ? { [lead]: leadStates }
                  : {}),
                ...(Object.keys(darkStates).length ? { dark: darkStates } : {}),
              },
            }
          : {}),
        ...(forced.length ? { forced } : {}),
        ...(first.element.is ? { is: first.element.is } : {}),
        ...(sample.element.vars ? { vars: sample.element.vars } : {}),
        sample: {
          key: sample.page.key,
          pass: sample.page.pass,
          mode: lead,
          id: sample.element.id,
          ...(twin ? { twin: twin.id } : {}),
        },
      })
    }
  }
  looks.sort((a, b) => a.group.localeCompare(b.group) || b.count - a.count)

  const pageList = new Map<string, Inventory["pages"][number]>()
  const tokens: Inventory["tokens"] = {}
  for (const page of pages) {
    const entry = pageList.get(page.key) ?? {
      key: page.key,
      modes: [],
      passes: [],
    }
    if (!entry.modes.includes(page.mode)) entry.modes.push(page.mode)
    if (!entry.passes.includes(page.pass)) entry.passes.push(page.pass)
    pageList.set(page.key, entry)
    tokens[page.mode] = { ...tokens[page.mode], ...page.tokens }
  }
  const reads = (["flags", "icons", "states"] as const).filter((read) =>
    pages.every((page) => page.reads?.includes(read)),
  )
  return { probe, pages: [...pageList.values()], reads, looks, tokens }
}
