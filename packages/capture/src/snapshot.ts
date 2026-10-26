/* A frozen copy of a part: its subtree with every computed style written
   out, so a page can render the product's own element next to ours, at the
   same size and in the same browser. It reads the state the
   element is in (hovered, focused, open) and forces none. */

export interface SnapshotFont {
  family: string
  /** The `src` descriptor, its URLs absolute. */
  src: string
  weight?: string
  style?: string
  stretch?: string
  unicodeRange?: string
}

export interface Snapshot {
  /** The subtree, shadow roots flattened, every element tagged `data-s`;
   *  no classes, ids or inline styles. */
  html: string
  /** `[data-s="n"]` rules (and their `::before`, `::after` and
   *  `::placeholder`) holding the computed values. */
  css: string
  /** The root's border box, in CSS pixels. */
  width: number
  height: number
  /** The first opaque background behind the root: the page it sits on. */
  backdrop: string
  /** The page's @font-face rules for the families the copy uses. */
  fonts: SnapshotFont[]
  /** Text, values, images and `url()`s outside the copy were replaced. */
  redacted: boolean
}

/** What a crop's `<part>-<mode>.json` holds, beside its PNG: written by
 *  `presets:measure --pack --shots` and the local kit. */
export interface PartFile {
  kind: "dotui-part"
  part: string
  mode: "light" | "dark"
  /** The page it was read on: a pack key on signed-in pages. */
  page?: string
  /** Device pixels per CSS pixel in the PNG. */
  dpr: number
  /** Where the part's box sits in the PNG, in CSS pixels. */
  crop?: { left: number; top: number; width: number; height: number }
  snapshot?: Snapshot
}

/* Runs in the page and closes over nothing, so its source can be sent as a
   string (see `snapshotSnippet`). */
async function snapshot(
  attribute: string,
  redact: boolean,
  keys: string[] | null,
  prefer: string | null,
  held?: string | null,
): Promise<Record<string, Snapshot>> {
  const SVG = "http://www.w3.org/2000/svg"
  const SKIP_TAGS = new Set([
    "script",
    "style",
    "link",
    "meta",
    "noscript",
    "template",
    "title",
  ])
  const VOID = new Set(["input", "img", "br", "hr", "wbr", "col", "source"])
  // Elements whose pixels don't copy: a box of their size stands in.
  const OPAQUE = new Set(["canvas", "video", "iframe", "object", "embed"])
  // The SVG attributes that draw. Redacted, any other is hidden: charts name
  // their paths after the account's projects.
  const DRAW = new Set(
    (
      "id href xlink:href xmlns xmlns:xlink version role focusable tabindex " +
      "d points x y x1 y1 x2 y2 cx cy r rx ry fx fy fr z width height viewBox " +
      "preserveAspectRatio transform gradientTransform patternTransform " +
      "transform-origin pathLength dx dy rotate textLength lengthAdjust " +
      "startOffset refX refY markerWidth markerHeight markerUnits orient " +
      "offset gradientUnits patternUnits patternContentUnits clipPathUnits " +
      "maskUnits maskContentUnits filterUnits primitiveUnits spreadMethod " +
      "fill fill-opacity fill-rule stroke stroke-width stroke-linecap " +
      "stroke-linejoin stroke-miterlimit stroke-dasharray stroke-dashoffset " +
      "stroke-opacity opacity color stop-color stop-opacity clip-path " +
      "clip-rule mask filter marker-start marker-mid marker-end paint-order " +
      "vector-effect shape-rendering text-rendering image-rendering " +
      "color-interpolation color-interpolation-filters flood-color " +
      "flood-opacity lighting-color display visibility overflow " +
      "mix-blend-mode isolation font-family font-size font-weight font-style " +
      "letter-spacing word-spacing text-anchor dominant-baseline " +
      "alignment-baseline baseline-shift writing-mode text-decoration " +
      "xml:space in in2 result stdDeviation operator mode type values k1 k2 " +
      "k3 k4 radius scale xChannelSelector yChannelSelector edgeMode order " +
      "kernelMatrix divisor bias targetX targetY tableValues slope intercept " +
      "amplitude exponent baseFrequency numOctaves seed stitchTiles " +
      "surfaceScale specularConstant specularExponent diffuseConstant " +
      "azimuth elevation limitingConeAngle pointsAtX pointsAtY pointsAtZ"
    ).split(" "),
  )
  const KEEP = new Set([
    "type",
    "placeholder",
    "checked",
    "disabled",
    "selected",
    "colspan",
    "rowspan",
    "rows",
    "cols",
    "dir",
    "open",
    "multiple",
  ])
  // Custom properties are already resolved into the values that read them;
  // logical sides repeat the physical ones; the rest is behavior, not looks.
  const SKIP_PROPS =
    /^(--|transition|animation|will-change|cursor|pointer-events|user-select|-webkit-user-select|touch-action|scroll-|overscroll-|view-transition|interactivity|caret-|-webkit-tap|content-visibility|contain-intrinsic)|^(border|margin|padding|inset|scroll-margin|scroll-padding)-(block|inline)|^(min-|max-)?(block|inline)-size$|^border-(start|end)-(start|end)-radius$/

  const hide = (text: string) =>
    text
      .replace(/\p{Lu}/gu, "X")
      .replace(/\p{L}/gu, "x")
      .replace(/\p{N}/gu, "0")
  const esc = (text: string) =>
    text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  const attr = (text: string) => esc(text).replace(/"/g, "&quot;")
  // Redacted, a url() outside the copy goes: it can carry a private path or a
  // signed token. url(#gradient) points inside it and stays.
  const unlink = (value: string) =>
    value.replace(
      /url\(\s*(?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|[^)]*)\s*\)/gi,
      (ref) => (/^url\(\s*["']?#/i.test(ref) ? ref : "none"),
    )

  type Values = Record<string, string>
  const read = (style: CSSStyleDeclaration): Values => {
    const values: Values = {}
    for (let i = 0; i < style.length; i++) {
      const prop = style[i]!
      if (!SKIP_PROPS.test(prop)) values[prop] = style.getPropertyValue(prop)
    }
    return values
  }

  /* UA defaults per tag, read in a blank standards-mode frame. A value
     equal to both the default and the parent's is left out: whether the
     property inherits or not, the copy lands on it anyway. */
  let frame: HTMLIFrameElement | null = document.createElement("iframe")
  frame.style.cssText =
    "position:fixed;left:-10000px;top:0;width:100px;height:100px;border:0"
  try {
    // A page that enforces Trusted Types refuses srcdoc: the frame stays
    // about:blank, in quirks mode, which differs on a few table defaults.
    try {
      frame.srcdoc = "<!doctype html><html><body></body></html>"
    } catch {}
    document.documentElement.appendChild(frame)
    if (frame.srcdoc)
      await new Promise((resolve) => {
        frame!.addEventListener("load", resolve, { once: true })
        setTimeout(resolve, 2000)
      })
  } catch {
    frame = null
  }
  const blank = frame?.contentDocument?.body ? frame.contentDocument : null
  const defaults = new Map<string, Values>()
  const defaultsOf = (namespace: string | null, tag: string) => {
    if (!blank) return undefined
    const key = `${namespace}|${tag}`
    let values = defaults.get(key)
    if (!values) {
      const host =
        namespace === SVG
          ? blank.body.appendChild(blank.createElementNS(SVG, "svg"))
          : blank.body
      const el = host.appendChild(
        namespace === SVG
          ? blank.createElementNS(SVG, tag)
          : blank.createElement(tag),
      )
      values = read(blank.defaultView!.getComputedStyle(el))
      el.remove()
      if (host !== blank.body) host.remove()
      defaults.set(key, values)
    }
    return values
  }
  // A width stays beside a style that isn't none: dropped as the default's
  // 0px (which only says the default style is none), it would draw medium.
  const styled = (values: Values, prop: string) =>
    /-width$/.test(prop) &&
    (values[prop.replace(/-width$/, "-style")] ?? "none") !== "none"
  const declarations = (values: Values, base?: Values, parent?: Values) =>
    Object.entries(values)
      .filter(
        ([prop, value]) =>
          !base ||
          !parent ||
          value !== base[prop] ||
          value !== parent[prop] ||
          styled(values, prop),
      )
      .map(([prop, value]) => `${prop}:${value}`)
      .join(";")

  const families = new Set<string>()
  const useFonts = (value: string | undefined) => {
    for (const family of (value ?? "").split(","))
      families.add(
        family
          .trim()
          .replace(/^["']|["']$/g, "")
          .toLowerCase(),
      )
  }

  // Its size as laid out: a transform (a press that scales it down) shrinks
  // its box, and the copy drops the transform. An inline box has no size of
  // its own: its box.
  const sizeOf = (el: Element, style: CSSStyleDeclaration) => {
    const width = Number.parseFloat(style.width)
    const height = Number.parseFloat(style.height)
    if (!(width >= 0 && height >= 0)) {
      const { width, height } = el.getBoundingClientRect()
      return { width, height }
    }
    if (style.boxSizing === "border-box") return { width, height }
    const sides = (a: string, b: string) =>
      [`padding-${a}`, `padding-${b}`, `border-${a}-width`, `border-${b}-width`]
        .map((prop) => Number.parseFloat(style.getPropertyValue(prop)) || 0)
        .reduce((total, value) => total + value, 0)
    return {
      width: width + sides("left", "right"),
      height: height + sides("top", "bottom"),
    }
  }

  let next = 0
  // Bodies to selectors: elements that compute alike share one rule.
  let rules = new Map<string, string[]>()
  const rule = (selector: string, body: string) => {
    const selectors = rules.get(body)
    if (selectors) selectors.push(selector)
    else rules.set(body, [selector])
  }

  const visitAll = (nodes: Node[], parent: Values): string =>
    nodes.map((node) => visit(node, parent, false)).join("")

  const children = (el: Element): Node[] =>
    (el.shadowRoot
      ? [...el.shadowRoot.childNodes]
      : [...el.childNodes]
    ).flatMap((node) =>
      node instanceof HTMLSlotElement
        ? node.assignedNodes({ flatten: true }).length
          ? node.assignedNodes({ flatten: true })
          : [...node.childNodes]
        : [node],
    )

  const visit = (node: Node, parent: Values, root: boolean): string => {
    if (node.nodeType === Node.TEXT_NODE)
      return esc(redact ? hide(node.nodeValue ?? "") : (node.nodeValue ?? ""))
    if (!(node instanceof Element)) return ""
    const el = node
    const tag = el.localName
    if (SKIP_TAGS.has(tag)) return ""
    const style = getComputedStyle(el)
    if (style.display === "none") return ""
    const svg = el.namespaceURI === SVG
    const n = next++
    const values = read(style)
    useFonts(values["font-family"])
    const stand = OPAQUE.has(tag) || (redact && tag === "img")
    if (stand) {
      values["background-color"] = "rgba(128, 128, 128, 0.35)"
      if (values.display === "inline") values.display = "inline-block"
    }
    if (redact)
      for (const [prop, value] of Object.entries(values))
        values[prop] = unlink(value)
    if (root) {
      // Where it sat on its page doesn't come along: the copy is its box.
      const box = sizeOf(el, style)
      Object.assign(values, {
        position: "relative",
        top: "auto",
        right: "auto",
        bottom: "auto",
        left: "auto",
        "margin-top": "0px",
        "margin-right": "0px",
        "margin-bottom": "0px",
        "margin-left": "0px",
        transform: "none",
        translate: "none",
        scale: "none",
        rotate: "none",
        float: "none",
        "box-sizing": "border-box",
        width: `${box.width}px`,
        height: `${box.height}px`,
      })
      if (values.display === "inline" || values.display === "contents")
        values.display = "inline-block"
    }
    rule(
      `[data-s="${n}"]`,
      declarations(
        values,
        root ? undefined : defaultsOf(el.namespaceURI, tag),
        parent,
      ),
    )
    for (const pseudo of ["::before", "::after"]) {
      const ps = getComputedStyle(el, pseudo)
      if (ps.content === "none" || ps.content === "normal") continue
      const own = read(ps)
      useFonts(own["font-family"])
      if (redact) {
        for (const [prop, value] of Object.entries(own))
          own[prop] = unlink(value)
        own.content = (own.content ?? "").replace(
          /"((?:[^"\\]|\\.)*)"/g,
          (_, text: string) => `"${hide(text)}"`,
        )
      }
      rule(
        `[data-s="${n}"]${pseudo}`,
        declarations(own, defaultsOf(null, "span"), values),
      )
    }
    if (el.hasAttribute("placeholder")) {
      const ps = getComputedStyle(el, "::placeholder")
      rule(
        `[data-s="${n}"]::placeholder`,
        `color:${ps.color};opacity:${ps.opacity};font-weight:${ps.fontWeight};letter-spacing:${ps.letterSpacing}`,
      )
    }

    const name = stand ? "span" : tag
    const attrs = [`data-s="${n}"`]
    if (!stand)
      for (const { name: key, value } of [...el.attributes]) {
        if (/^on/i.test(key) || key === "class" || key === "style") continue
        if (svg) {
          // An id stays: url(#gradient) and <use href="#icon"> point at it.
          if (key.startsWith("data-") || key.startsWith("aria-")) continue
          // Redacted, only links inside the copy stay (see `unlink`).
          if (redact && key.endsWith("href") && !value.startsWith("#")) continue
          const kept = !redact
            ? value
            : DRAW.has(key)
              ? unlink(value)
              : hide(value)
          attrs.push(`${key}="${attr(kept)}"`)
        } else if (KEEP.has(key))
          attrs.push(
            `${key}="${attr(key === "placeholder" && redact ? hide(value) : value)}"`,
          )
      }
    if (!stand && tag === "img") {
      const img = el as HTMLImageElement
      attrs.push(`src="${attr(img.currentSrc || img.src)}"`)
    }
    if (!stand && tag === "input") {
      const value = (el as HTMLInputElement).value
      if (value) attrs.push(`value="${attr(redact ? hide(value) : value)}"`)
    }
    const open = `<${name} ${attrs.join(" ")}>`
    if (stand || VOID.has(name)) return stand ? `${open}</span>` : open
    if (tag === "textarea") {
      const value = (el as HTMLTextAreaElement).value
      return `${open}${esc(redact ? hide(value) : value)}</textarea>`
    }
    // A sprite's <use> is drawn from its symbol, inline: the copy has no
    // sprite sheet to point at.
    if (svg && tag === "use") {
      const href = el.getAttribute("href") ?? el.getAttribute("xlink:href")
      const symbol = href?.startsWith("#")
        ? (el.getRootNode() as Document | ShadowRoot).querySelector(
            `[id="${href.slice(1).replace(/"/g, '\\"')}"]`,
          )
        : null
      if (symbol) {
        const viewBox = symbol.getAttribute("viewBox")
        const inner = visitAll([...symbol.childNodes], values)
        return viewBox
          ? `<svg data-s="${n}" viewBox="${attr(viewBox)}" width="100%" height="100%">${inner}</svg>`
          : `<g data-s="${n}">${inner}</g>`
      }
    }
    return `${open}${visitAll(children(el), values)}</${name}>`
  }

  /* The page's @font-face rules, from every sheet it can read: a
     cross-origin sheet is fetched again, which works where its host allows
     CORS. */
  const faces: { rule: CSSFontFaceRule; base: string }[] = []
  const collect = (list: CSSRuleList, base: string) => {
    for (const rule of [...list]) {
      if (rule instanceof CSSFontFaceRule) faces.push({ rule, base })
      else if (rule instanceof CSSImportRule) {
        try {
          if (rule.styleSheet)
            collect(rule.styleSheet.cssRules, rule.styleSheet.href ?? base)
        } catch {}
      } else if ("cssRules" in rule)
        collect((rule as CSSGroupingRule).cssRules, base)
    }
  }
  const fontsOf = async (): Promise<SnapshotFont[]> => {
    for (const sheet of [...document.styleSheets]) {
      const base = sheet.href ?? location.href
      try {
        collect(sheet.cssRules, base)
      } catch {
        try {
          const text = await (await fetch(base)).text()
          const parsed = new CSSStyleSheet()
          parsed.replaceSync(text.replace(/@import[^;]+;/g, ""))
          collect(parsed.cssRules, base)
        } catch {}
      }
    }
    return faces.flatMap(({ rule, base }) => {
      const family = rule.style
        .getPropertyValue("font-family")
        .trim()
        .replace(/^["']|["']$/g, "")
      // A face that only names local() fonts has nothing to bring along.
      if (
        !families.has(family.toLowerCase()) ||
        !rule.style.getPropertyValue("src").includes("url(")
      )
        return []
      const src = rule.style
        .getPropertyValue("src")
        .replace(
          /url\((["']?)(.*?)\1\)/g,
          (_, __, url: string) => `url("${new URL(url, base).href}")`,
        )
      const descriptor = (name: string) =>
        rule.style.getPropertyValue(name).trim() || undefined
      return [
        {
          family,
          src,
          weight: descriptor("font-weight"),
          style: descriptor("font-style"),
          stretch: descriptor("font-stretch"),
          unicodeRange: descriptor("unicode-range"),
        },
      ]
    })
  }

  const opaque = (fill: string) => {
    const alpha = /[,/]\s*([\d.]+)(%?)\s*\)$/.exec(fill)
    return (
      fill !== "transparent" &&
      (!alpha ||
        (fill.startsWith("rgb(") && !fill.includes("/")) ||
        Number(alpha[1]) / (alpha[2] ? 100 : 1) >= 1)
    )
  }
  const backdropOf = (el: Element) => {
    // What paints under its middle first: a layer drawn behind it need not
    // be an ancestor (Airbnb's dark banner under its AI search switch).
    const box = el.getBoundingClientRect()
    const stack = (el.getRootNode() as Document | ShadowRoot).elementsFromPoint(
      box.x + box.width / 2,
      box.y + box.height / 2,
    )
    const at = stack.indexOf(el)
    if (at >= 0)
      for (const node of stack.slice(at + 1)) {
        const style = getComputedStyle(node)
        if (style.opacity !== "0" && opaque(style.backgroundColor))
          return style.backgroundColor
      }
    for (
      let node = el.parentElement ?? (el.getRootNode() as ShadowRoot).host;
      node;
      node = node.parentElement ?? (node.getRootNode() as ShadowRoot).host
    ) {
      const fill = getComputedStyle(node).backgroundColor
      if (opaque(fill)) return fill
    }
    // The canvas: Chrome's in a dark color scheme, else white. With both
    // schemes listed, the user's preference picks.
    const schemes = getComputedStyle(document.documentElement).colorScheme
    const dark =
      schemes.includes("dark") &&
      (!schemes.includes("light") ||
        matchMedia("(prefers-color-scheme: dark)").matches)
    return dark ? "rgb(18, 18, 18)" : "rgb(255, 255, 255)"
  }

  const marked = (root: Document | ShadowRoot, out: Element[] = []) => {
    for (const el of root.querySelectorAll("*")) {
      if (el.hasAttribute(attribute) || (prefer && el.hasAttribute(prefer)))
        out.push(el)
      if (el.shadowRoot) marked(el.shadowRoot, out)
    }
    return out
  }
  const found = marked(document)
  // A key whose attribute the page dropped from a node it kept (Notion's
  // editor does), from the map of keys to elements `held` names.
  const lost = new Map<Element, string>()
  const map = held
    ? (globalThis as unknown as Record<string, Map<number, Element>>)[held]
    : undefined
  if (map && keys) {
    const have = new Set(found.map((el) => el.getAttribute(attribute)))
    for (const key of keys) {
      const el = map.get(Number(key))
      if (!have.has(key) && el?.isConnected) {
        found.push(el)
        lost.set(el, key)
      }
    }
  }
  // An element carrying `prefer` is copied for the one whose key it holds
  // (the census's frame of a field), when it has a box to copy.
  const keyOf = (el: Element) =>
    (prefer && el.getAttribute(prefer)) ||
    lost.get(el) ||
    el.getAttribute(attribute)!
  const sized = (el: Element) => {
    const box = el.getBoundingClientRect()
    return box.width > 0 && box.height > 0
  }
  const preferred = new Set(
    found
      .filter((el) => prefer && el.hasAttribute(prefer) && sized(el))
      .map(keyOf),
  )

  const copies: Record<string, Omit<Snapshot, "fonts"> & { used: string[] }> =
    {}
  const copied = new Map<string, Element>()
  for (const el of found) {
    const key = keyOf(el)
    if (keys && !keys.includes(key)) continue
    if (preferred.has(key) && !(prefer && el.hasAttribute(prefer))) continue
    if (!sized(el)) continue
    const box = sizeOf(el, getComputedStyle(el))
    families.clear()
    next = 0
    rules = new Map()
    const html = visit(el, defaultsOf(null, "div") ?? {}, true)
    copies[key] = {
      html,
      css: [...rules]
        .map(([body, selectors]) => `${selectors.join(",")}{${body}}`)
        .join("\n"),
      width: Math.round(box.width * 100) / 100,
      height: Math.round(box.height * 100) / 100,
      backdrop: "",
      redacted: redact,
      used: [...families],
    }
    copied.set(key, el)
  }
  frame?.remove()

  // After the copies, so they don't carry it: layers drawn behind a
  // control often ignore the pointer.
  const hit = document.createElement("style")
  hit.textContent = "*{pointer-events:auto!important}"
  document.documentElement.append(hit)
  for (const [key, el] of copied) copies[key]!.backdrop = backdropOf(el)
  hit.remove()

  // Read once, after every copy has named its families.
  families.clear()
  for (const copy of Object.values(copies))
    for (const family of copy.used) families.add(family)
  const fonts = await fontsOf()
  return Object.fromEntries(
    Object.entries(copies).map(([key, { used, ...copy }]) => [
      key,
      {
        ...copy,
        fonts: fonts.filter((font) => used.includes(font.family.toLowerCase())),
      },
    ]),
  )
}

/** A JavaScript expression that resolves to a `Snapshot` of every element
 *  carrying `attribute` (or of those whose value is in `keys`), keyed by
 *  its value: for `page.evaluate`. An element carrying `prefer` with the
 *  same value is copied in its place. `held` names a global map of keys
 *  to elements, for those that lost the attribute. `redact` replaces text,
 *  values and images, for signed-in pages. The `__name` shim covers the
 *  helper tsx compiles in. */
export const snapshotSnippet = ({
  attribute = "data-snapshot",
  redact = false,
  keys,
  prefer,
  held,
}: {
  attribute?: string
  redact?: boolean
  keys?: string[]
  prefer?: string
  held?: string
} = {}) =>
  `(() => { const __name = (fn) => fn; return (${snapshot.toString()})(${JSON.stringify(attribute)}, ${redact}, ${JSON.stringify(keys ?? null)}, ${JSON.stringify(prefer ?? null)}, ${JSON.stringify(held ?? null)}) })()`

/** Parts larger than this (in CSS px²), such as `page`, get a crop but no
 *  frozen copy. */
export const COPY_AREA = 640 * 480

/** A copy as a page of its own, on the color it sat on, its fonts loaded
 *  from where the product serves them. */
export const documentOf = (copy: Snapshot) => {
  const faces = copy.fonts
    .map(
      (font) =>
        `@font-face{font-family:${JSON.stringify(font.family)};src:${font.src}${font.weight ? `;font-weight:${font.weight}` : ""}${font.style ? `;font-style:${font.style}` : ""}${font.unicodeRange ? `;unicode-range:${font.unicodeRange}` : ""}}`,
    )
    .join("\n")
  const css = `${faces}\nbody{margin:0;padding:16px;background:${copy.backdrop}}\n${copy.css}`
  // A "<" in the CSS would close the style element.
  return `<!doctype html><html><head><meta charset="utf-8"><style>${css.replace(/</g, "\\3c ")}</style></head><body>${copy.html}</body></html>\n`
}

/** The snapshot's own source, for the kit to embed. */
export const snapshotSource = () => snapshot.toString()
