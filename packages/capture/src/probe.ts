/* Measures what a preset has to match: the computed styles of named parts,
   read the same way from the real product (a browser tab) and from the
   specimen sheets, so the two compare property by property. */

import type { SheetName } from "./sheets"

/** Where a part sits on a page. `text` matches an element's own trimmed text
 *  and climbs to its control; `surface` climbs to the first box painted at
 *  more than 10% alpha. In `selector`, `within`, `box` and `ink`, `a >>> b`
 *  matches b inside the shadow roots of a's matches, and a leading `>>>`
 *  searches the part's own shadow root (web components). */
export interface Target {
  selector?: string
  text?: string
  /** Search only inside one match of this selector: the first, or the
   *  `withinNth` (from 0), for a page with several demo blocks. */
  within?: string
  withinNth?: number
  /** Which match, from 0. */
  nth?: number
  surface?: boolean
  /** Read the box (fill, border, radius, edge, shadow, height) from this
   *  pseudo-element ("::before") or descendant, where the product draws it
   *  apart from the control (a checkbox painted on its label's ::before). */
  box?: string
  /** Read color and type from this descendant (a nav row's label span). */
  ink?: string
  /** A focus part: focus it (or the first control inside it) from the
   *  keyboard before measuring (`--pack`), and read its `ring`. A required
   *  field turns :invalid when focused empty in some systems: measure one
   *  that isn't required. */
  focus?: boolean
  /** Steps run before measuring (`--pack`): open a menu, hover a tooltip
   *  trigger. The page reloads before the next part with steps. Puppeteer
   *  selectors, so `::-p-text(Options)` matches by text. */
  before?: Step[]
  /** The props this page writes to `tokens.json` for the part, in place of
   *  the part's own list in SPECIMEN_TARGETS. */
  only?: Prop[]
  /** Props this page leaves out of `tokens.json` for the part, where the two
   *  sides draw them in different places. */
  skip?: Prop[]
}

/** Each step but `press` first waits up to 15s for its selector to show.
 *  `focus` focuses without a pointer, which opens React Aria tooltips. */
export type Step =
  | { click: string }
  | { hover: string }
  | { focus: string }
  | { press: string }
  | { wait: string }

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
 *  probe commit that measured it ("tokens" when the values come from the
 *  system's published token tables instead). */
export interface ReferenceTokens {
  light?: Measures
  dark?: Measures
  probe?: string
  /** The family the preset stands in for each reference family it can't
   *  ship (proprietary, or renamed like GeistSans), lowercase:
   *  `{ "din-round": "nunito" }`. Those rows read as stand-ins, not off. */
  fonts?: Record<string, string>
}

/** A reference pack's `targets.json`: its pages by URL. */
export type Pack = Record<string, Page>
export interface Page {
  /** The mode the page shows. Without it, `--pack` measures the page in both
   *  modes through `prefers-color-scheme`. */
  mode?: "light" | "dark"
  /** The URL that shows this page in dark (a Storybook theme global): the
   *  page's own URL is then measured in light only. */
  dark?: string
  /** The localStorage key the site reads its theme from (next-themes'
   *  "theme"): `--pack` sets it to "light" or "dark" before load. */
  storage?: string
  /** Steps that walk to the page's state after each load, before any part
   *  is read (a lesson reached through onboarding). */
  steps?: Step[]
  /** How long to wait after load before the steps, in ms (1500 by default):
   *  longer for an app that ignores clicks until it hydrates. */
  settle?: number
  /** The viewport width, 1440 by default: pin it where the product's type
   *  scale changes at a breakpoint. */
  width?: number
  /** Measured in a signed-in tab with `--snippet`, then `--merge`d; `--pack`
   *  skips it. */
  signedIn?: boolean
  parts: Record<string, Target>
}

/* Runs in the page and closes over nothing, so its source can be sent as a
   string (see `snippet`). */
function probe(
  targets: Record<string, Target>,
  props: Record<string, readonly string[]>,
  focus: boolean,
  mark: boolean,
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
  /* Matches across shadow roots: see Target. */
  const query = (root: ParentNode, selector: string): Element[] => {
    const parts = selector.split(">>>").map((part) => part.trim())
    let nodes: ParentNode[] = [root]
    for (const [i, part] of parts.entries()) {
      const found = nodes.flatMap((node) =>
        part
          ? [...node.querySelectorAll(part)]
          : node instanceof Element
            ? [node]
            : [],
      )
      if (i === parts.length - 1) return found
      nodes = found.flatMap((el) => el.shadowRoot ?? [])
    }
    return []
  }
  const parent = (el: Element) =>
    el.parentElement ?? (el.getRootNode() as ShadowRoot).host ?? null
  /* A translucent or clear color as it shows: composited over `own` (the
     fill a line sits on, when it isn't `under`'s) and the backgrounds under
     it (from `under` up to the first opaque one, white below), as rgb().
     Opaque colors pass through. */
  const canvas = document
    .createElement("canvas")
    .getContext("2d", { willReadFrequently: true })
  const seen = (color: string, under: Element | null, own?: string) => {
    const a = alpha(color)
    if (!canvas || a >= 1) return color
    const layers = [color]
    if (own && alpha(own) > 0) layers.push(own)
    for (
      let node = own && alpha(own) >= 1 ? null : under;
      node;
      node = parent(node)
    ) {
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
     up to 1.5px, an outline on or inside the edge (not on focus parts, where
     outlines are the ring), or any of them on ::before or ::after. A border
     on some sides only names them ("1px <color> bottom"). `under` is what
     the box sits on: its parent, or the element for a pseudo-element.
     Borders and inset lines show over the box's own fill, and a line in the
     fill's color doesn't show (Sail rings solid buttons in their fill). */
  const edgeOf = (
    style: CSSStyleDeclaration,
    under: Element | null,
    outlines = true,
  ) => {
    const fill = style.backgroundColor
    const shown = seen(fill, under)
    const sides = (["top", "right", "bottom", "left"] as const).filter(
      (side) =>
        style.getPropertyValue(`border-${side}-style`) !== "none" &&
        Number.parseFloat(style.getPropertyValue(`border-${side}-width`)) > 0 &&
        alpha(style.getPropertyValue(`border-${side}-color`)) > 0 &&
        seen(style.getPropertyValue(`border-${side}-color`), under, fill) !==
          shown,
    )
    const [first] = sides
    if (first) {
      const width = Number.parseFloat(
        style.getPropertyValue(`border-${first}-width`),
      )
      const line = `${width}px ${seen(style.getPropertyValue(`border-${first}-color`), under, fill)}`
      return sides.length === 4 ? line : `${line} ${sides.join("+")}`
    }
    // Rings of one width stack: Supabase draws two faint inset ones.
    const [hairline] = rings(style).filter(
      (ring) => ring.spread > 0 && ring.spread <= 1.5,
    )
    const color = rings(style)
      .filter(
        (ring) =>
          ring.spread === hairline?.spread && ring.inset === hairline.inset,
      )
      .reduceRight<string | undefined>(
        (below, ring) =>
          seen(ring.color, under, below ?? (ring.inset ? fill : undefined)),
        undefined,
      )
    if (hairline && color !== shown) return `${hairline.spread}px ${color}`
    const width = Number.parseFloat(style.outlineWidth)
    const offset = Number.parseFloat(style.outlineOffset)
    return outlines &&
      style.outlineStyle !== "none" &&
      width > 0 &&
      offset <= 0 &&
      alpha(style.outlineColor) > 0
      ? `${width}px ${seen(style.outlineColor, under, offset < 0 ? fill : undefined)}`
      : null
  }
  /* A rotated or moved ::before / ::after is a mark (a check drawn as two
     borders), not the box's line. */
  const edge = (el: Element, outlines = true) => {
    for (const pseudo of [null, "::before", "::after"]) {
      const style = getComputedStyle(el, pseudo)
      if (pseudo && (style.content === "none" || style.transform !== "none"))
        continue
      const found = edgeOf(style, pseudo ? el : parent(el), outlines)
      if (found) return found
    }
    return "none"
  }
  const signed = (px: number) => `${px < 0 ? "" : "+"}${px}px`
  /* The focus ring, "<width>px <color> <±offset>px", from an outline, the
     outermost ring (the one inside it sets the offset), or the topmost inset
     ring, which sits inside the border and merges with a border of its
     color. Focused parts only; `read` turns one flush with the outer edge
     into the edge. */
  const ring = (el: Element) => {
    if (
      !el.matches(
        ":focus-visible, :focus-within, [data-focus-visible], [data-specimen-focus]",
      )
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
      return `${width}px ${seen(style.outlineColor, parent(el))} ${signed(Number.parseFloat(style.outlineOffset))}`
    const all = rings(style).filter((ring) => ring.spread > 0)
    const outer = all
      .filter((ring) => !ring.inset)
      .sort((a, b) => a.spread - b.spread)
    const last = outer.at(-1)
    if (last) {
      const offset = outer.at(-2)?.spread ?? 0
      return `${last.spread - offset}px ${seen(last.color, parent(el))} ${signed(offset)}`
    }
    const inset = all.find((ring) => ring.inset)
    if (!inset) return "none"
    const border = Number.parseFloat(style.borderTopWidth)
    const merged = style.borderTopColor === inset.color ? border : 0
    return `${inset.spread + merged}px ${seen(inset.color, el)} ${signed(-(inset.spread + border))}`
  }
  const find = (target: Target): Element | null => {
    const root = target.within
      ? (query(document, target.within)[target.withinNth ?? 0] ?? null)
      : document
    if (!root) return null
    let found = query(root, target.selector ?? "*").filter(visible)
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
      while (box && !painted(box)) box = parent(box)
      el = box ?? el
    }
    return el
  }
  /* Where a part's box is painted: `target.box`, else the element, else a
     child that covers it (a selected tab's indicator), else a ::before or
     ::after that covers most of it (Duolingo's buttons; not a badge dot). */
  const boxOf = (el: Element, target: Target): [Element, string | null] => {
    if (target.box?.startsWith("::")) return [el, target.box]
    if (target.box) return [query(el, target.box)[0] ?? el, null]
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
    const child = [
      ...el.querySelectorAll("*"),
      ...(el.shadowRoot?.querySelectorAll("*") ?? []),
    ].find((child) => painted(child) && covers(child))
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
  const read = (el: Element, target: Target, keep: readonly string[]) => {
    const style = getComputedStyle(el)
    const [box, pseudo] = boxOf(el, target)
    const paint = getComputedStyle(box, pseudo)
    const inkEl = target.ink ? (query(el, target.ink)[0] ?? el) : el
    const ink = getComputedStyle(inkEl)
    // A focus line drawn inside the box from its outer edge, or up to 1px
    // further in (Linear's outline at -1px, Carbon's 2px inset), shows as
    // the edge changing color.
    const focusRing = target.focus ? ring(el) : undefined
    const flush = focusRing && /^([\d.]+)px (.+) -([\d.]+)px$/.exec(focusRing)
    const depth = flush ? Number(flush[3]) - Number(flush[1]) : -1
    const inset =
      flush && depth >= 0 && depth <= 1 ? `${flush[1]}px ${flush[2]}` : null
    const outlines = !target.focus
    const own = edge(el, outlines)
    const all: Record<string, string | undefined> = {
      backgroundColor: seen(paint.backgroundColor, pseudo ? el : parent(box)),
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
      edge:
        inset ??
        (pseudo
          ? (edgeOf(paint, el, outlines) ?? own)
          : target.box || own === "none"
            ? edge(box, outlines)
            : own),
      ring: inset ? "none" : focusRing,
    }
    return Object.fromEntries(
      keep
        .filter((prop) => all[prop] !== undefined)
        .map((prop) => [prop, all[prop]]),
    )
  }
  return Object.fromEntries(
    Object.entries(targets).map(([part, target]) => {
      const el = find(target)
      if (el && mark) el.setAttribute("data-probe-part", part)
      if (el && focus)
        (
          (el.matches(CONTROL)
            ? el
            : (el.querySelector(CONTROL) ?? el)) as HTMLElement
        ).focus()
      return [part, el ? read(el, target, props[part] ?? []) : null]
    }),
  )
}

/** The props a reference page writes for a part: its kind's (or the
 *  target's `only`), less its `skip`. */
export const ownedProps = (part: string, target: Target) =>
  (target.only ?? SPECIMEN_TARGETS[part]?.props ?? PROPS).filter(
    (prop) => !target.skip?.includes(prop),
  )

/** A JavaScript expression that returns the measures of `targets` on the
 *  current page: for `page.evaluate`, and for a tab driven by Claude in
 *  Chrome (its JavaScript tool). `focus` also focuses each match, `mark`
 *  tags it `data-probe-part` (for `--shots`), and `owned` reads only each
 *  part's `ownedProps` (a reference page; specimens read every prop). The
 *  `__name` shim covers the helper tsx compiles into `probe`. */
export const snippet = (
  targets: Record<string, Target>,
  { focus = false, mark = false, owned = false } = {},
) => {
  const props = Object.fromEntries(
    Object.entries(targets).map(([part, target]) => [
      part,
      owned ? ownedProps(part, target) : PROPS,
    ]),
  )
  return `(() => { const __name = (fn) => fn; return (${probe.toString()})(${JSON.stringify(targets)}, ${JSON.stringify(props)}, ${focus}, ${mark}) })()`
}

const cell = (label: string) => `[data-cell="${label}"]`

const CONTROL = PROPS.filter((prop) => prop !== "ring")
const TYPE: Prop[] = [
  "color",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "letterSpacing",
]
const BOX: Prop[] = ["backgroundColor", "borderRadius", "height", "edge"]
const SURFACE: Prop[] = [
  "backgroundColor",
  "color",
  "borderRadius",
  "boxShadow",
  "edge",
]
const ROW: Prop[] = [
  "backgroundColor",
  "color",
  "borderRadius",
  "height",
  "paddingInline",
  "fontSize",
  "fontWeight",
]
const PAGE: Prop[] = ["backgroundColor", "color", "fontFamily"]
const LAYOUT: Prop[] = ["backgroundColor", "edge"]
const LINK: Prop[] = ["color", "fontWeight"]
const TOOLTIP: Prop[] = [
  ...SURFACE,
  "height",
  "paddingInline",
  "fontSize",
  "fontWeight",
]
const FOCUS: Prop[] = ["edge", "ring"]
const DAY: Prop[] = [
  "backgroundColor",
  "color",
  "borderRadius",
  "height",
  "fontSize",
  "fontWeight",
]

/** The parts a reference pack measures, as the specimen sheets show them, and
 *  the props each kind is compared on (`--pack` writes only those unless a
 *  target sets `only`). A pack names the same parts with its product's own
 *  targets. */
export const SPECIMEN_TARGETS: Record<
  string,
  { sheet: SheetName; props: readonly Prop[]; target: Target }
> = {
  page: {
    sheet: "actions",
    props: PAGE,
    target: { selector: "[data-specimen]" },
  },
  "button.primary": {
    sheet: "actions",
    props: CONTROL,
    target: { within: cell("button · md"), text: "Primary" },
  },
  "button.secondary": {
    sheet: "actions",
    props: CONTROL,
    target: { within: cell("button · md"), text: "Secondary" },
  },
  "button.quiet": {
    sheet: "actions",
    props: CONTROL,
    target: { within: cell("button · md"), text: "Quiet" },
  },
  "button.icon": {
    sheet: "actions",
    props: BOX,
    target: { within: cell("button · md"), selector: "[aria-label=More]" },
  },
  toggle: {
    sheet: "actions",
    props: CONTROL,
    target: {
      within: cell("toggle · off / on / icon on"),
      selector: "[aria-pressed=false]",
    },
  },
  "toggle.on": {
    sheet: "actions",
    props: CONTROL,
    target: {
      within: cell("toggle · off / on / icon on"),
      selector: "[data-selected]",
    },
  },
  segmented: {
    sheet: "actions",
    props: BOX,
    target: {
      within: cell("segmented control"),
      selector: "[data-segmented-control]",
    },
  },
  "segmented.item": {
    sheet: "actions",
    props: CONTROL,
    target: {
      within: cell("segmented control"),
      selector: "[data-segmented-control-item]:not([data-selected])",
    },
  },
  "pagination.current": {
    sheet: "actions",
    props: CONTROL,
    target: {
      within: cell("pagination"),
      selector: "[data-pagination-link][data-current]",
    },
  },
  "segmented.selected": {
    sheet: "actions",
    props: CONTROL,
    target: {
      within: cell("segmented control"),
      selector: "[data-segmented-control-item][data-selected]",
    },
  },
  "calendar.day": {
    sheet: "dates",
    props: DAY,
    target: {
      within: cell("calendar · today, selected day"),
      selector:
        "[data-calendar-cell]:not([data-selected], [data-today], [data-outside-month])",
    },
  },
  "calendar.today": {
    sheet: "dates",
    props: DAY,
    target: {
      within: cell("calendar · today, selected day"),
      selector: "[data-calendar-cell][data-today]",
    },
  },
  "calendar.selected": {
    sheet: "dates",
    props: DAY,
    target: {
      within: cell("calendar · today, selected day"),
      selector: "[data-calendar-cell][data-selected]",
    },
  },
  input: {
    sheet: "fields",
    props: CONTROL,
    target: { within: cell("text field · description"), selector: "input" },
  },
  "button.focus": {
    sheet: "actions",
    props: FOCUS,
    target: { selector: "[data-specimen-focus]", focus: true },
  },
  "select.trigger": {
    sheet: "fields",
    props: CONTROL,
    target: { within: cell("select · trigger"), selector: "button" },
  },
  "field.label": {
    sheet: "fields",
    props: TYPE,
    target: {
      within: cell("text field · description"),
      selector: "[data-label]",
    },
  },
  "input.focus": {
    sheet: "fields",
    props: FOCUS,
    target: { selector: "[data-specimen-focus]", focus: true },
  },
  checkbox: {
    sheet: "selection",
    props: BOX,
    target: { selector: "[data-checkbox-indicator]:not([data-selected])" },
  },
  "checkbox.checked": {
    sheet: "selection",
    props: BOX,
    target: { selector: "[data-checkbox-indicator][data-selected]" },
  },
  radio: {
    sheet: "selection",
    props: BOX,
    target: { selector: "[data-radio-indicator]:not([data-selected])" },
  },
  "radio.checked": {
    sheet: "selection",
    props: BOX,
    target: { selector: "[data-radio-indicator][data-selected]" },
  },
  "switch.on": {
    sheet: "selection",
    props: BOX,
    target: { selector: "[data-switch-indicator][data-selected]" },
  },
  "switch.off": {
    sheet: "selection",
    props: BOX,
    target: { selector: "[data-switch-indicator]:not([data-selected])" },
  },
  tab: {
    sheet: "navigation",
    props: CONTROL,
    target: {
      within: cell("tabs · preset default"),
      selector: "[data-tab]:not([data-selected]):not([data-disabled])",
    },
  },
  "tab.selected": {
    sheet: "navigation",
    props: CONTROL,
    target: {
      within: cell("tabs · preset default"),
      selector: "[data-tab][data-selected]",
    },
  },
  link: {
    sheet: "navigation",
    props: LINK,
    target: { within: cell("links in text"), selector: "a" },
  },
  // The page behind the panel; its edge would be the specimen cell's.
  shell: {
    sheet: "navigation",
    props: ["backgroundColor"],
    target: { selector: "[data-sidebar-wrapper]", surface: true },
  },
  panel: {
    sheet: "navigation",
    props: LAYOUT,
    target: { selector: "[data-sidebar-inset]" },
  },
  "nav.item": {
    sheet: "navigation",
    props: ROW,
    target: { selector: "[data-sidebar-menu-button]:not([data-active])" },
  },
  "nav.item.active": {
    sheet: "navigation",
    props: ROW,
    target: { selector: "[data-sidebar-menu-button][data-active]" },
  },
  menu: {
    sheet: "menu",
    props: SURFACE,
    target: { selector: "[data-menu-content]", surface: true },
  },
  "menu.item": {
    sheet: "menu",
    props: ROW,
    target: { selector: "[data-menu-item]" },
  },
  tooltip: {
    sheet: "menu",
    props: TOOLTIP,
    target: { selector: "[data-tooltip]", surface: true },
  },
  command: {
    sheet: "command",
    props: SURFACE,
    target: { selector: "[data-command]", surface: true },
  },
  "command.item": {
    sheet: "command",
    props: ROW,
    target: { within: "[data-command]", selector: "[data-listbox-item]" },
  },
  kbd: {
    sheet: "display",
    props: CONTROL,
    target: { within: cell("avatars · kbd"), selector: "[data-kbd]" },
  },
  dialog: {
    sheet: "dialog",
    props: SURFACE,
    target: { selector: "[data-dialog-content]", surface: true },
  },
  card: {
    sheet: "display",
    props: SURFACE,
    target: { selector: "[data-card]" },
  },
  alert: {
    sheet: "feedback",
    props: SURFACE,
    target: { within: cell("alert"), selector: "[data-alert]" },
  },
  progress: {
    sheet: "feedback",
    props: BOX,
    target: {
      within: cell("progress"),
      selector: "[role=progressbar] > div:last-child",
    },
  },
  "progress.fill": {
    sheet: "feedback",
    props: ["backgroundColor", "borderRadius"],
    target: { within: cell("progress"), selector: "[style*=width]" },
  },
  badge: {
    sheet: "feedback",
    props: CONTROL,
    target: {
      within: cell("badge · preset default"),
      selector: "[data-badge]",
      text: "neutral",
    },
  },
  "badge.accent": {
    sheet: "feedback",
    props: CONTROL,
    target: {
      within: cell("badge · preset default"),
      selector: "[data-badge]",
      text: "accent",
    },
  },
  "heading.1": {
    sheet: "type",
    props: TYPE,
    target: { within: cell("h1 · text-4xl"), selector: "h1" },
  },
  "heading.2": {
    sheet: "type",
    props: TYPE,
    target: { within: cell("h2 · text-3xl"), selector: "h2" },
  },
  "heading.3": {
    sheet: "type",
    props: TYPE,
    target: { within: cell("h3 · text-2xl"), selector: "h3" },
  },
  "heading.4": {
    sheet: "type",
    props: TYPE,
    target: { within: cell("h4 · text-xl"), selector: "h4" },
  },
  text: {
    sheet: "type",
    props: TYPE,
    target: { within: cell("body · text-base"), selector: ":scope > div > p" },
  },
  "text.muted": {
    sheet: "type",
    props: TYPE,
    target: {
      within: cell("muted · text-sm text-fg-muted"),
      selector: ":scope > div > p",
    },
  },
}
