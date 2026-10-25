/* The census: every element a page paints or labels, its role and about 40
   computed values, read with no hand-written selectors. The 12 values the
   diff compares come from the probe itself (one call over every element), so
   a census reading and a probe reading mean the same thing; the rest are
   plain computed styles. It never reads text, only its length; names come
   only from an allow-list of data attributes and from class tokens
   (`namesOf`). */

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
  /** How the role was found: its ARIA role, its tag, the names it or its
   *  container carry (a segmented control's button), or its box's shape. */
  by: "aria" | "tag" | "name" | "shape"
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
  /** Its variant, size and component names (`namesOf`). */
  names?: Names
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
  /** A Storybook story's enum args as rendered (variant, size…). */
  args?: Record<string, string>
  /** The shot of this pass, in the census folder's shots/. */
  shot?: string
  /** Where the shot starts on the page, when not at the top: a pass after
   *  rest, or one read scrolled, is shot as the viewport. A box sits in the
   *  shot at its x and y less these. */
  shotAt?: [number, number]
}

/** Disabled, selected and open elements (`is`), and icon strokes; "states":
 *  pressed and focus forced, and disabled, invalid and selected set;
 *  "names": the data attributes and class tokens of `namesOf`. */
export type Reads = "flags" | "icons" | "states" | "names"

/** Name keys ("data-variant", "class.size") to the value an element
 *  carries. */
export type Names = Record<string, string>

/** The names an element carries, from the data attributes of
 *  `NAME_ATTRIBUTES` (single tokens only) and its class tokens with module
 *  hashes stripped: `Button--size-small___zQrEw` gives class.size "small",
 *  `btn btn-primary` class.variant "primary". Never its text, aria-label,
 *  title, alt or href. Closed over nothing, so the census runs it in the
 *  page. */
export function namesOf(attribute: (name: string) => string | null): Names {
  const names: Names = {}
  const TOKEN = /^[A-Za-z0-9][\w.-]{0,39}$/
  // The data attributes systems name a part, a variant or a size with.
  for (const name of [
    "data-component",
    "data-slot",
    "data-part",
    "data-variant",
    "data-appearance",
    "data-kind",
    "data-tone",
    "data-intent",
    "data-emphasis",
    "data-priority",
    "data-size",
    "data-shape",
  ]) {
    const value = attribute(name)?.trim()
    if (value && TOKEN.test(value)) names[name] = value
  }
  const word = (s: string) =>
    /^[A-Z]?[a-z]+$/.test(s) || /^[a-z]+(-[a-z]+)*$/.test(s)
  const classes = (attribute("class") ?? "")
    .split(/\s+/)
    // Tailwind's variants and arbitrary values aren't names.
    .filter(
      (token) => token && token.length <= 80 && !/[:[\]/()!@#%]/.test(token),
    )
    .map((token) => {
      // A module's file prefix and hash: Primer_Brand__Button-module__,
      // ___zQrEw, __a1B2c.
      const bare = token.replace(/^.*-module__/, "")
      const hash = /^(.+?)_{2,}([\w-]{4,10})$/.exec(bare)
      return hash?.[1] && hash[2] && !word(hash[2]) ? hash[1] : bare
    })
  const kebab = (s: string) =>
    s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()
  const SIZE =
    /^(x{0,3}s|x{0,3}l|[2-6]x[sl]|sm|md|lg|small|medium|large|big|tiny|mini|micro|compact|dense|condensed|comfortable|icon-only|size-?[\w-]+)$/
  const STOP =
    /^(is-|has-|with-|no-)|^(hover|focus|focused|active|disabled|selected|open|opened|closed|expanded|collapsed|checked|current|loading|pressed|invalid|visible|hidden|show|hide|top|bottom|left|right|start|end|center|middle|inline|block|full|full-width|fluid|wide|stretch|grow|fixed|sticky|static|absolute|relative|first|last|only|truncate|nowrap|wrap|rtl|ltr|light|dark|sr-only|visually-hidden)$|^(top|bottom|left|right|start|end)-/
  const put = (key: "class.size" | "class.variant", value: string) => {
    if (!names[key] && TOKEN.test(value)) names[key] = value
  }
  const modifier = (value: string) => {
    const kebabbed = kebab(value)
    // A number is a scale step (Text--200), not a name.
    if (STOP.test(kebabbed) || /^\d/.test(value)) return
    const size = /^size-?([\w-]+)$/i.exec(value)?.[1]
    if (size) put("class.size", size)
    else put(SIZE.test(kebabbed) ? "class.size" : "class.variant", value)
  }
  const present = new Set(classes)
  for (const token of classes) {
    // size-small, rt-variant-solid, sizeM; Tailwind's own size-4 and
    // appearance-none have no prefix.
    const keyed =
      /(^|[a-z0-9][-_]+)(size|variant|appearance|kind|tone|intent|emphasis|shape)[-_]?([A-Za-z0-9]+)$/i.exec(
        token,
      )
    if (
      keyed?.[2] &&
      keyed[3] &&
      (keyed[1] || !/^(size|appearance)$/i.test(keyed[2])) &&
      !STOP.test(kebab(keyed[3]))
    ) {
      put(/^size$/i.test(keyed[2]) ? "class.size" : "class.variant", keyed[3])
      continue
    }
    // BEM: Button--subtle, cds--btn--primary, with its block also there
    // or capitalized.
    const bem = /^(.+)--([A-Za-z][\w-]*)$/.exec(token)
    if (bem?.[1] && bem[2]) {
      if (present.has(bem[1]) || /^[A-Z]/.test(bem[1])) modifier(bem[2])
      continue
    }
    // Bootstrap and Primer CSS: btn btn-sm btn-primary.
    const base =
      /^(btn|button|badge|label|tag|chip|pill|alert|avatar)-([a-z][\w-]*)$/i.exec(
        token,
      )
    if (base?.[1] && base[2] && present.has(base[1])) modifier(base[2])
  }
  return names
}

type Command =
  /** `fresh`: only elements in the viewport new or changed since `seen`
   *  ("new": new only, for a hover, which restyles the hovered element and
   *  its ancestors). */
  | { kind: "walk"; max: number; fresh: boolean | "new"; start: number }
  | { kind: "read"; ids: number[]; focus: boolean }
  | { kind: "seen" }
  | { kind: "appeared" }
  | { kind: "vars"; ids: number[] }
  | { kind: "focus"; ids: number[] }
  | { kind: "node"; id: number }
  /** `role`: the census role, where names gave one (a segment). */
  | { kind: "force"; id: number; state: Forced | null; role?: string }
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
  names: typeof namesOf,
  command: Command,
) {
  const ID = "data-census"
  const HOST = "data-census-host"
  const FRAME = "data-census-frame"
  /* Each element's look when `seen` ran, so a later walk on the same load
     keeps only what an interaction opened or changed; and each field's
     frame (`frameOf`), found once. */
  const scope = globalThis as unknown as {
    __censusSeen?: WeakMap<Element, string>
    __censusFrames?: WeakMap<Element, Element | null>
    __censusUndo?: (() => void)[]
  }
  const seen = (scope.__censusSeen ??= new WeakMap())
  const frames = (scope.__censusFrames ??= new WeakMap())
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
    "toggle",
    "segment",
    "breadcrumb",
    "pagination-item",
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
    "segmented",
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
  const OVERLAYS = new Set([
    "dialog",
    "alertdialog",
    "menu",
    "listbox",
    "tooltip",
    "popover",
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
  const selectorOf = (el: Element, attribute = ID) => {
    const chain: string[] = [`[${attribute}="${el.getAttribute(attribute)}"]`]
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
  // Opacity through the ancestors: Highcharts' accessibility proxies sit
  // over the chart at 0.001, which checkVisibility counts as shown.
  const opacities = new Map<Element, number>()
  const opacityOf = (el: Element | null): number => {
    if (!el) return 1
    let value = opacities.get(el)
    if (value === undefined) {
      value =
        Number.parseFloat(getComputedStyle(el).opacity) *
        opacityOf(el.parentElement)
      opacities.set(el, value)
    }
    return value
  }
  const shown = (el: Element) => {
    const rect = el.getBoundingClientRect()
    return (
      rect.width * rect.height > 1 &&
      el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) &&
      opacityOf(el) >= 0.05
    )
  }
  const edged = (style: CSSStyleDeclaration) =>
    style.boxShadow !== "none" ||
    ["top", "right", "bottom", "left"].some(
      (side) =>
        style.getPropertyValue(`border-${side}-style`) !== "none" &&
        Number.parseFloat(style.getPropertyValue(`border-${side}-width`)) > 0 &&
        alpha(style.getPropertyValue(`border-${side}-color`)) > 0,
    )
  const paints = (style: CSSStyleDeclaration) =>
    alpha(style.backgroundColor) > 0.1 ||
    style.backgroundImage !== "none" ||
    edged(style)
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
    el: Element,
    rect: DOMRect,
    style: CSSStyleDeclaration,
    chars: number,
    painted: boolean,
  ) => {
    const { width: w, height: h } = rect
    if (!painted) return "text"
    const radius = Number.parseFloat(style.borderTopLeftRadius) || 0
    if ((h <= 2 && w >= 8) || (w <= 2 && h >= 8)) return "separator"
    // A round box shows a person only with a picture: an empty one is a dot
    // (a label's color, a status).
    if (Math.abs(w - h) <= 2 && w >= 12 && w <= 64 && radius >= h / 2 - 1)
      return chars
        ? "badge"
        : style.backgroundImage !== "none" ||
            el.querySelector("img, svg, picture, canvas, video")
          ? "avatar"
          : "box"
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
    // Set unless it says "false": Primer writes data-disabled="false".
    const data = (name: string) => (attr(name) ?? "false") !== "false"
    if (
      el.matches(":disabled") ||
      attr("aria-disabled") === "true" ||
      data("data-disabled")
    )
      return "disabled" as const
    let userInvalid = false
    try {
      userInvalid = el.matches(":user-invalid")
    } catch {
      // Older engines don't know :user-invalid.
    }
    if (attr("aria-invalid") === "true" || data("data-invalid") || userInvalid)
      return "invalid" as const
    if (
      el.matches(":checked") ||
      attr("aria-checked") === "true" ||
      attr("aria-checked") === "mixed" ||
      attr("aria-selected") === "true" ||
      attr("aria-pressed") === "true" ||
      (attr("aria-current") ?? "false") !== "false" ||
      data("data-selected") ||
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
  const baseRoleOf = (
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
    return {
      role: shape(el, rect, style, chars, painted),
      by: "shape" as const,
    }
  }
  /* What an element is named, for the roles names give: its data-component,
     data-slot and data-part, its classes and a custom element's tag. */
  const kindOf = (el: Element) =>
    [
      el.getAttribute("data-component"),
      el.getAttribute("data-slot"),
      el.getAttribute("data-part"),
      el.getAttribute("class"),
      el.localName.includes("-") ? el.localName : "",
    ].join(" ")
  const near = (el: Element, pattern: RegExp) => {
    let up: Element | null = el
    for (let depth = 0; up && depth < 4; depth++, up = parent(up))
      if (pattern.test(kindOf(up))) return true
    return false
  }
  /* The roles no ARIA or tag names, from what an item or its three nearest
     containers are named: a segmented control and its segments, a
     breadcrumb, a pagination item, a tab drawn as a link, a switch drawn
     as a button, a raised box named a popover; and a toggle button, from
     aria-pressed. Two ARIA roles their shape overrules: a slider too thin
     to drag along is a pane splitter (Primer's PageLayout handle), and
     progress bars side by side are one stacked bar whose segments are
     data colors (GitHub's languages). */
  const roleOf = (
    el: Element,
    rect: DOMRect,
    style: CSSStyleDeclaration,
    chars: number,
    painted: boolean,
  ) => {
    const found = baseRoleOf(el, rect, style, chars, painted)
    const { role } = found
    if (["button", "link", "radio", "tab"].includes(role)) {
      if (near(el, /segmented/i))
        return { role: "segment", by: "name" as const }
      if (near(el, /breadcrumb/i))
        return { role: "breadcrumb", by: "name" as const }
      if (near(el, /paginat|\bpager\b/i))
        return { role: "pagination-item", by: "name" as const }
      // Primer's UnderlineNav and TabNav: tabs drawn as links in a nav.
      if (role !== "tab" && near(el, /underline-?nav|tab-?nav|tab-?bar/i))
        return { role: "tab", by: "name" as const }
      if (role === "button" && near(el, /switch(?!er)/i))
        return { role: "switch", by: "name" as const }
      if (role === "button" && el.hasAttribute("aria-pressed"))
        return { role: "toggle", by: "aria" as const }
      if (role === "button" && /toggle-?button/i.test(kindOf(el)))
        return { role: "toggle", by: "name" as const }
    }
    if (
      [
        "list",
        "group",
        "radiogroup",
        "toolbar",
        "tablist",
        "box",
        "panel",
        "card",
      ].includes(role) &&
      /segmented/i.test(kindOf(el))
    )
      return { role: "segmented", by: "name" as const }
    if (
      found.by === "shape" &&
      (role === "card" || role === "box") &&
      style.boxShadow !== "none" &&
      /popover|overlay/i.test(kindOf(el))
    )
      return { role: "popover", by: "name" as const }
    if (role === "slider" && Math.min(rect.width, rect.height) <= 8)
      return { role: "separator", by: "shape" as const }
    if (
      role === "progressbar" &&
      [...(el.parentElement?.children ?? [])].some(
        (other) => other !== el && other.getAttribute("role") === "progressbar",
      )
    )
      return { role: "box", by: "shape" as const }
    return found
  }
  /* A field drawn borderless in a wrapper that draws its box (Primer's
     TextInput, React Aria's Group): the nearest of its three closest
     containers that draws an edge, holds no other field and is at most
     16px taller (64px for a field of tokens). The field reads its box from
     it, and the wrapper is no element of its own. */
  const FIELDS = new Set([
    "textbox",
    "searchbox",
    "combobox",
    "select",
    "spinbutton",
  ])
  const ariaOf = (el: Element) =>
    el.getAttribute("role")?.trim().split(/\s+/)[0] ?? implicit(el) ?? ""
  const frameOf = (el: Element) => {
    if (!FIELDS.has(ariaOf(el))) return null
    const known = frames.get(el)
    if (known !== undefined) return known
    let frame: Element | null = null
    const style = getComputedStyle(el)
    if (!edged(style)) {
      const rect = el.getBoundingClientRect()
      let up = parent(el)
      for (let depth = 0; up && depth < 3; depth++, up = parent(up)) {
        const role = ariaOf(up)
        if (CONTROLS.has(role) || OVERLAYS.has(role)) break
        if (up.getBoundingClientRect().height > Math.max(rect.height + 16, 64))
          break
        const look = getComputedStyle(up)
        if (!edged(look)) continue
        const fields = [...up.querySelectorAll("*")].filter((one) =>
          FIELDS.has(ariaOf(one)),
        )
        if (
          fields.length === 1 &&
          (alpha(style.backgroundColor) === 0 ||
            style.backgroundColor === look.backgroundColor)
        )
          frame = up
        break
      }
    }
    frames.set(el, frame)
    return frame
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
  /* What a framed field (`frameOf`) takes from its frame; its text inset
     is measured from the frame's inner edge. */
  const FRAMED = [
    "backgroundColor",
    "backgroundImage",
    "backdropFilter",
    "borderRadius",
    "corners",
    "edge",
    "boxShadow",
    "ring",
    "height",
    "width",
    "iconSize",
    "iconStroke",
  ]
  const read = (els: Element[], focus: boolean) => {
    const targets: Record<string, { selector: string; focus: boolean }> = {}
    for (const el of els) {
      const id = el.getAttribute(ID) as string
      targets[id] = { selector: selectorOf(el), focus }
      const frame = frameOf(el)
      if (frame) {
        frame.setAttribute(FRAME, id)
        targets[`${id}/frame`] = { selector: selectorOf(frame, FRAME), focus }
      }
    }
    const measured = probe(
      targets,
      Object.fromEntries(Object.keys(targets).map((id) => [id, props])),
      false,
      false,
    )
    return els.map((el) => {
      const id = el.getAttribute(ID) as string
      const values: Record<string, string> = {
        ...(measured[id] ?? {}),
        ...extra(el),
      }
      const frame = frameOf(el)
      if (frame) {
        const outer: Record<string, string> = {
          ...(measured[`${id}/frame`] ?? {}),
          ...extra(frame),
        }
        for (const key of FRAMED) {
          const value = outer[key]
          // A field can draw its own ring inside the frame.
          if (value !== undefined && !(key === "ring" && value === "none"))
            values[key] = value
        }
        const style = getComputedStyle(el)
        const look = getComputedStyle(frame)
        values.paddingInline = px(
          el.getBoundingClientRect().left +
            Number.parseFloat(style.borderLeftWidth) +
            Number.parseFloat(style.paddingLeft) -
            frame.getBoundingClientRect().left -
            Number.parseFloat(look.borderLeftWidth),
        )
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
      for (const name of [ID, HOST, FRAME]) el.removeAttribute(name)
    scope.__censusSeen = new WeakMap()
    scope.__censusFrames = new WeakMap()
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
    const base =
      el.getAttribute("role")?.trim().split(/\s+/)[0] ?? implicit(el) ?? ""
    const role = command.role ?? base
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
      if (!CONTROLS.has(role) && !CONTROLS.has(base)) return false
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
        ].includes(base)
      )
        return false
      set("aria-invalid", "true")
      set("data-invalid", "true")
      const field = el as HTMLInputElement
      if (typeof field.setCustomValidity === "function") {
        const was = field.validity?.customError ? field.validationMessage : ""
        field.setCustomValidity("invalid")
        undo.push(() => field.setCustomValidity(was))
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
    } else if (CHECKED.includes(base)) {
      set("aria-checked", "true")
      set("data-state", "checked")
      set("data-selected", "true")
    } else if (
      ["tab", "option", "treeitem", "row", "gridcell"].includes(base)
    ) {
      set("aria-selected", "true")
      if (base === "tab") set("data-state", "active")
      set("data-selected", "true")
    } else if (el.hasAttribute("aria-pressed")) {
      set("aria-pressed", "true")
      set("data-state", "on")
      set("data-selected", "true")
    } else if (role === "segment") {
      set("aria-current", "true")
      set("data-selected", "true")
    } else if (
      role === "breadcrumb" ||
      role === "pagination-item" ||
      (base === "link" && el.closest("nav, [role=navigation], [role=tablist]"))
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
  const everything = all(document)
  // A frame shows as its field.
  const framing = new Set<Element>()
  for (const el of everything) {
    const frame = frameOf(el)
    if (frame) framing.add(frame)
  }
  const same = (el: Element) =>
    command.fresh === "new" ? seen.has(el) : seen.get(el) === lookOf(el)
  for (const el of everything) {
    if (!keep(el) || !shown(el) || framing.has(el)) continue
    const frame = frameOf(el)
    if (command.fresh && same(el) && (!frame || same(frame))) continue
    // After the first pass, only the viewport: what an interaction opened
    // shows there, and what changed past it changed by side effect.
    if (command.fresh) {
      const { top, right, bottom, left } = el.getBoundingClientRect()
      if (bottom <= 0 || right <= 0 || top >= innerHeight || left >= innerWidth)
        continue
    }
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
    // A card's section (a dialog's header, a body row) runs edge to edge in
    // what holds it: a band of its container, not a card.
    if (role === "card" && by === "shape") {
      let up = parent(el)
      while (up && !kept.has(up)) up = parent(up)
      const box = up && kept.get(up)
      if (
        up &&
        box &&
        !CONTROLS.has(roles.get(up) ?? "") &&
        Math.abs(box.left - rect.left) <= 1 &&
        Math.abs(box.right - rect.right) <= 1
      )
        role = "panel"
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
        roles.get(up) ??
        up.getAttribute("role")?.trim().split(/\s+/)[0] ??
        implicit(up)
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
    // A framed field is named by its frame first (Primer's data-component
    // TextInput over the input's own).
    const named = {
      ...names((name) => el.getAttribute(name)),
      ...(frame ? names((name) => frame.getAttribute(name)) : {}),
    }
    // A control's variant and size can sit on its label (Airbnb's
    // data-size): what it lacks comes from its own parts, never from a
    // control nested in it.
    if (CONTROLS.has(role))
      for (const inner of el.querySelectorAll(
        "[data-variant], [data-size], [data-appearance], [data-kind], [data-tone], [data-intent], [data-emphasis], [data-priority], [data-shape]",
      )) {
        let nested = false
        for (let up: Element | null = inner; up && up !== el; up = parent(up))
          nested ||= CONTROLS.has(
            up.getAttribute("role")?.trim().split(/\s+/)[0] ??
              implicit(up) ??
              "",
          )
        if (nested) continue
        for (const [key, value] of Object.entries(
          names((name) =>
            name.startsWith("data-") ? inner.getAttribute(name) : null,
          ),
        ))
          if (!["data-component", "data-slot", "data-part"].includes(key))
            named[key] ??= value
      }
    elements.push({
      id: next++,
      role,
      by,
      tag: el.localName,
      ...(around ? { in: around } : {}),
      ...(level ? { level } : {}),
      box: (({ x, y, width, height }) =>
        [x + scrollX, y + scrollY, width, height].map(Math.round))(
        frame?.getBoundingClientRect() ?? rect,
      ) as [number, number, number, number],
      chars,
      ...(focusable ? { focusable } : {}),
      ...(is ? { is } : {}),
      values: {},
      ...(Object.keys(named).length ? { names: named } : {}),
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
    reads: ["flags", "icons", "names"] as Reads[],
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
  `((command) => { const __name = (fn) => fn; return (${census.toString()})(${probeSource()}, ${JSON.stringify(PROPS)}, ${namesOf.toString()}, command) })`

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
  // Drawn with no text: the font and ink they inherit say nothing.
  if (role === "avatar" || role === "progressbar" || role === "slider")
    return [...BOX_KEYS, "height"]
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
  /** Each name key its elements carry (`namesOf`, and "args.<arg>" from a
   *  Storybook story), to its values, most used first. */
  names?: Record<string, string[]>
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

/* The roles a story's args name: what a story renders, not the text and
   structure around it. */
const UNNAMED_BY_ARGS = new Set([
  ...TEXT_ROLES,
  "icon",
  "img",
  "page",
  "main",
  "panel",
  "list",
  "listitem",
  "row",
  "group",
  "region",
  "article",
  "navigation",
  "banner",
  "contentinfo",
  "complementary",
])

/* Which of a story's args name each element. The crawl reads an args pass
   with what it already read marked seen, so the pass holds what the change
   redrew: those that now look different from the rest pass in their place
   take the args it changed. On the story's other passes an element takes
   an arg only when a pass changing it redrew one of its role in its place;
   the rest is the story's furniture. */
function argNames(pages: CensusPage[]) {
  const named = new Map<CensusElement, Names>()
  const stories = new Map<string, CensusPage[]>()
  for (const page of pages) {
    const story = `${page.key}|${page.mode}`
    stories.set(story, [...(stories.get(story) ?? []), page])
  }
  const at = (a: CensusElement, b: CensusElement) =>
    a.role === b.role &&
    a.box[0] < b.box[0] + b.box[2] &&
    b.box[0] < a.box[0] + a.box[2] &&
    a.box[1] < b.box[1] + b.box[3] &&
    b.box[1] < a.box[1] + a.box[3]
  for (const story of stories.values()) {
    const rest = story.find((page) => page.pass === "rest")
    const initial = rest?.args ?? {}
    const changes = story.map((page) => ({
      page,
      changed: Object.keys(page.args ?? {}).filter(
        (arg) => page.args?.[arg] !== initial[arg],
      ),
      redrawn: page.elements.filter(
        (element) =>
          !rest?.elements.some(
            (one) =>
              at(one, element) &&
              sameLook(lookKeys(element.role), one.values, element.values),
          ),
      ),
    }))
    for (const { page, changed, redrawn } of changes)
      for (const element of page.elements) {
        if (UNNAMED_BY_ARGS.has(element.role)) continue
        const args = changed.length
          ? redrawn.includes(element)
            ? changed
            : []
          : Object.keys(initial).filter((arg) =>
              changes.some(
                (other) =>
                  other.changed.includes(arg) &&
                  other.redrawn.some((one) => at(one, element)),
              ),
            )
        const values = changed.length ? page.args : initial
        if (args.length)
          named.set(
            element,
            Object.fromEntries(
              args.map((arg) => [`args.${arg}`, values?.[arg] ?? ""]),
            ),
          )
      }
  }
  return named
}

/** Each key's values over the members, most used first. A component's
 *  element without one of its data attributes shows the default, so a
 *  data-* value names the look only when at least half the members a
 *  data-component names carry it (not one danger item among plain ones). */
const tally = (names: Names[]) => {
  const counts = new Map<string, Map<string, number>>()
  for (const each of names)
    for (const [key, value] of Object.entries(each)) {
      const values = counts.get(key) ?? new Map<string, number>()
      values.set(value, (values.get(value) ?? 0) + 1)
      counts.set(key, values)
    }
  const components = names.filter((each) => each["data-component"]).length
  const holds = (key: string, count: number) =>
    !key.startsWith("data-") ||
    ["data-component", "data-slot", "data-part"].includes(key) ||
    count * 2 >= components
  return Object.fromEntries(
    [...counts]
      .sort(([a], [b]) => a.localeCompare(b))
      .flatMap(([key, values]) => {
        const held = [...values]
          .filter(([, count]) => holds(key, count))
          .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
          .map(([value]) => value)
        return held.length ? [[key, held] as const] : []
      }),
  )
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

type Box = CensusElement["box"]
const within = (outer: Box, inner: Box) =>
  inner[0] >= outer[0] - 1 &&
  inner[1] >= outer[1] - 1 &&
  inner[0] + inner[2] <= outer[0] + outer[2] + 1 &&
  inner[1] + inner[3] <= outer[1] + outer[3] + 1
const area = (box: Box) => box[2] * box[3]

/* Buttons and links that only wrap something else: no text or icon of
   their own around one painted part that fills them (an avatar, an issue
   label's pill), or around nothing at all (a chart's hit area). They count
   as nothing and the part as itself; a pill with text in it is the badge
   the shape rule would have read had the text been its own. And pills
   drawn over a field (a filter's highlighted qualifiers) are its value,
   not badges. */
const TYPED = new Set(["textbox", "searchbox", "combobox"])
function unwrap(pages: CensusPage[]): CensusPage[] {
  const rests = new Map(
    pages
      .filter((page) => page.pass === "rest")
      .map((page) => [`${page.key}|${page.mode}`, page]),
  )
  const dropped = new Set<CensusElement>()
  const badges = new Set<CensusElement>()
  for (const page of pages) {
    // A later pass holds only what changed: the parts may sit in the rest.
    const rest = rests.get(`${page.key}|${page.mode}`)
    const around =
      rest && rest !== page
        ? [...page.elements, ...rest.elements]
        : page.elements
    const fields = around.filter((one) => TYPED.has(one.role))
    for (const element of page.elements)
      if (
        element.role === "badge" &&
        element.by === "shape" &&
        fields.some((field) => within(field.box, element.box))
      )
        dropped.add(element)
    for (const element of page.elements) {
      const { values } = element
      if (
        (element.role !== "button" && element.role !== "link") ||
        element.chars ||
        values.iconSize ||
        values.backgroundImage ||
        (values.edge ?? "none") !== "none" ||
        (values.boxShadow ?? "none") !== "none"
      )
        continue
      const inside = around.filter(
        (one) =>
          one !== element &&
          !(one.role === element.role && `${one.box}` === `${element.box}`) &&
          within(element.box, one.box),
      )
      const fill = inside.find(
        (one) =>
          ["box", "badge", "avatar", "img"].includes(one.role) &&
          area(one.box) >= 0.75 * area(element.box),
      )
      if (inside.length && !fill) continue
      if (
        fill &&
        !inside.every((one) => one === fill || within(fill.box, one.box))
      )
        continue
      dropped.add(element)
      if (
        fill?.role === "box" &&
        fill.box[3] <= 32 &&
        fill.box[2] <= 240 &&
        inside.some((one) => TEXT_ROLES.has(one.role))
      )
        badges.add(fill)
    }
  }
  return pages.map((page) => ({
    ...page,
    elements: page.elements
      .filter((element) => !dropped.has(element))
      .map((element) =>
        badges.has(element) ? { ...element, role: "badge" } : element,
      ),
  }))
}

/** Clusters a product's census pages into looks per role group, counted
 *  across pages, with each look's other mode and its states. Light leads
 *  where a page was read in both modes; the same element in dark (same page,
 *  pass, role and box: a theme moves nothing) gives the dark values. A page
 *  read only in dark (a signed-in run, one mode per run) gives dark-only
 *  looks. */
export function cluster(read: CensusPage[], probe: string): Inventory {
  const pages = unwrap(read)
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
  const byArgs = argNames(pages)
  const groups = new Map<string, Map<string, Member[]>>()
  for (const page of pages) {
    if (page.mode === "dark" && lit.has(where(page))) continue
    for (const element of page.elements) {
      const group = groupOf(element)
      const keys = lookKeys(element.role)
      const bySignature = groups.get(group) ?? new Map<string, Member[]>()
      // Flagged apart: a group takes its first member's flag.
      const sig = `${page.mode}|${element.is ?? ""}|${signature(keys, element.values)}`
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
      // The sample: a member read in a state, on the rest pass where one
      // was (a later pass's page may have moved on), else the first.
      const sample =
        members.find((m) => m.element.states && m.page.pass === "rest") ??
        members.find((m) => m.element.states) ??
        members.find((m) => m.page.pass === "rest") ??
        first
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
      // The sample's own twin where it reads like the rest, so both
      // modes point at the same pass.
      const own = twins.get(key(sample.page, sample.element))
      const twin =
        (own && darkest?.includes(own) ? own : undefined) ??
        darkest?.find((t) => t.states) ??
        darkest?.[0]
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
      const names = tally(
        members.map(({ element }) => ({
          ...element.names,
          ...byArgs.get(element),
        })),
      )
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
        ...(Object.keys(names).length ? { names } : {}),
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
  const reads = (["flags", "icons", "states", "names"] as const).filter(
    (read) => pages.every((page) => page.reads?.includes(read)),
  )
  return { probe, pages: [...pageList.values()], reads, looks, tokens }
}
