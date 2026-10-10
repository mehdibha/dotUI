import { lstarOf } from "@dotui/colors"

import { validate } from "../axes"
import { LIBRARY_OPTIONS } from "../axes/icons"
import { flatAllowed } from "../axes/surfaces"
import type { ColorResult } from "./color"
import { add, hasBorder, opaque, statusOf } from "./context"
import type { Component, Ctx, Families } from "./context"
import {
  codeOrText,
  color,
  median,
  sentences,
  shadows,
  shadowStrength,
} from "./parse"
import type { ShadowLayer } from "./parse"

const CARD_ROW_EXCLUDED =
  /hover|modal|dialog|dropdown|menu|popover|mockup|screenshot|focus|toast|tooltip/i
const ELEVATION_SOURCE = "prose: Elevation & Depth"

function tableRows(section: string): string[][] {
  return section
    .split("\n")
    .filter((line) => line.trim().startsWith("|"))
    .filter((line) => !/^\s*\|[\s:|-]+\|?\s*$/.test(line))
    .map((line) =>
      line
        .trim()
        .replace(/^\||\|$/g, "")
        .split("|")
        .map((cell) => cell.trim()),
    )
}

const cellShadows = (cell: string) => codeOrText(cell).flatMap(shadows)

// A 0 0 0 1px shadow, inset or not, draws a hairline.
const isRing = (layer: ShadowLayer) =>
  layer.x === 0 && layer.y === 0 && layer.blur === 0 && layer.spread === 1

function shadowTier(strength: number) {
  return strength < 0.1
    ? "flat"
    : strength < 0.63
      ? "low"
      : strength < 1.58
        ? "medium"
        : "high"
}

export function mapSurfaces(
  ctx: Ctx,
  components: Component[],
  fam: Families,
  { mode, pageL }: ColorResult,
) {
  const { doc, state } = ctx
  const elevation = doc.sections.elevation ?? ""
  const componentsProse = doc.sections.components ?? ""

  // Layers: the card fill against the page, light files only.
  const cardFills = fam.card
    .map((c) => color(c.props.backgroundColor))
    .filter(opaque)
    .map((c) => lstarOf(c.oklch))
  const cardL = median(cardFills)
  if (mode === "light" && pageL !== undefined && cardL !== undefined) {
    const diff = cardL - pageL
    const layers = Math.abs(diff) < 1 ? "same" : diff > 0 ? "grouped" : "tonal"
    state.surfaceLayers = layers
    // Tonal is one shade; a card far below the page is a different surface.
    const exact = layers === "same" || (layers === "tonal" && diff >= -6)
    add(ctx, exact ? "mapped" : "approximated", "surfaces", {
      id: "surface-layers",
      label:
        layers === "grouped"
          ? "Grouped page kept at the file's L*"
          : layers === "tonal"
            ? "Cards a shade below the page"
            : "Cards on the page's tone",
      keys: ["surfaceLayers"],
      value: `card L* ${cardL.toFixed(1)} · page L* ${pageL.toFixed(1)}`,
      result: layers,
    })
  }

  const cardRow = tableRows(elevation).find(
    (cells) =>
      cells.some((cell) => /\bcards?\b/i.test(cell)) &&
      !cells.some((cell) => CARD_ROW_EXCLUDED.test(cell)),
  )
  const cardRowLayers = cardRow?.flatMap(cellShadows) ?? []
  // A card row counts only with a parsed shadow or a literal none.
  const cardRowSays =
    cardRowLayers.length > 0 ||
    !!cardRow?.some((cell) => /^`?none`?$/i.test(cell))
  const cardShadow = fam.card.find((c) => typeof c.props.shadow === "string")
  const cardShadowCss = String(cardShadow?.props.shadow ?? "")
  const cardShadowLayers = shadows(cardShadowCss)
  const cardShadowSays =
    cardShadowLayers.length > 0 || /^none$/i.test(cardShadowCss.trim())
  const ring = [...cardRowLayers, ...cardShadowLayers].some(isRing)

  // Edge: the components' own border vocabulary first, then prose.
  const borderVocab = components.some(
    (c) => "border" in c.props || "borderColor" in c.props,
  )
  let edge: { value: string; exact: boolean } | undefined
  if (borderVocab && fam.card.length > 0) {
    const bordered = fam.card.some((c) => hasBorder(c.props))
    edge = bordered
      ? { value: "line", exact: true }
      : { value: ring ? "line" : "none", exact: !ring }
  } else {
    for (const sentence of sentences(`${elevation}\n${componentsProse}`)) {
      if (!/\bcards?\b/i.test(sentence)) continue
      if (
        /\b1px\b[^.\n|]{0,40}\b(hairline|border)|hairline border|inset (1 ?px )?hairline|0 0 0 1px/i.test(
          sentence,
        )
      ) {
        edge = { value: "line", exact: false }
        break
      }
      if (/no border|borderless|without borders/i.test(sentence)) {
        edge = { value: "none", exact: false }
        break
      }
    }
    if (!edge && ring) edge = { value: "line", exact: false }
  }
  if (edge) {
    state.surfaceEdge = edge.value
    add(ctx, statusOf(edge.exact), "surfaces", {
      id: "surface-edge",
      label:
        edge.value === "line"
          ? ring && !edge.exact
            ? "Cards drawn with a hairline (a 1px ring shadow)"
            : "Cards drawn with a hairline"
          : "Cards without a border",
      source: edge.exact ? "components" : ELEVATION_SOURCE,
      keys: ["surfaceEdge"],
      result: edge.value,
    })
  }

  // Shadow: the elevation table's card row, a card's shadow, then keywords.
  const strengthOf = (layers: ShadowLayer[]) =>
    Math.max(0, ...layers.filter((l) => !l.inset).map(shadowStrength))
  let shadow:
    | { tier: string; exact: boolean; source: string; value?: string }
    | undefined
  if (cardRow && cardRowSays)
    shadow = {
      tier: shadowTier(strengthOf(cardRowLayers)),
      exact: true,
      source: ELEVATION_SOURCE,
      value:
        cardRow
          .flatMap(codeOrText)
          .filter((text) => shadows(text).length > 0)
          .join(", ") || "none",
    }
  else if (cardShadow && cardShadowSays)
    shadow = {
      tier: shadowTier(strengthOf(cardShadowLayers)),
      exact: true,
      source: `components.${cardShadow.key}.shadow`,
      value: cardShadowCss,
    }
  else if (
    /no (drop )?shadows?|shadowless|flat design|resists?[^.]{0,20}shadows|shadows? (are )?(rare|minimal)/i.test(
      elevation,
    )
  )
    shadow = { tier: "flat", exact: false, source: ELEVATION_SOURCE }
  else if (/(subtle|soft|faint) (drop )?shadow/i.test(elevation))
    shadow = { tier: "low", exact: false, source: ELEVATION_SOURCE }
  else if (/(deep|dramatic|heavy|pronounced) shadow/i.test(elevation))
    shadow = { tier: "high", exact: false, source: ELEVATION_SOURCE }
  if (shadow) {
    state.surfaceShadow = shadow.tier
    const full = validate(state)
    const lifted = shadow.tier === "flat" && full.ok && !flatAllowed(full.state)
    if (lifted) state.surfaceShadow = "low"
    add(ctx, statusOf(shadow.exact && !lifted), "surfaces", {
      id: "surface-shadow",
      label: "Card shadow",
      source: shadow.exact ? shadow.source : `${shadow.source} (keywords)`,
      keys: ["surfaceShadow"],
      value: shadow.value,
      result: state.surfaceShadow,
      delta: lifted
        ? "flat lifted to low: cards need an edge or a tone"
        : undefined,
    })
  }

  const parsed = [
    ...tableRows(elevation).flat().flatMap(cellShadows),
    ...[...elevation.matchAll(/`([^`]+)`/g)].flatMap((m) =>
      shadows(m[1] ?? ""),
    ),
    ...components
      .map((c) => c.props.shadow)
      .filter((s): s is string => typeof s === "string")
      .flatMap(shadows),
  ]
  if (parsed.length > 0)
    add(ctx, "unmapped", "surfaces", {
      id: "shadow-values",
      label: "Exact shadow recipes and per-level shadows aren't reproduced",
    })
  if (parsed.some((l) => l.color && l.color.c >= 0.02))
    add(ctx, "unmapped", "surfaces", {
      id: "shadow-tint",
      label: "Tinted shadows have no axis",
    })
  if (parsed.some((l) => l.inset && !isRing(l)))
    add(ctx, "unmapped", "surfaces", {
      id: "inset-shadow",
      label: "Inset shadows (bevels) have no axis",
    })

  // Glass: translucent overlays only; a blurred nav bar is reported.
  const glassy = sentences(`${elevation}\n${componentsProse}`).filter((s) =>
    /backdrop-(filter|blur)|frosted|translucent|glass/i.test(s),
  )
  if (glassy.some((s) => /menu|popover|dropdown|tooltip|toast/i.test(s))) {
    state.surfaceGlass = true
    add(ctx, "approximated", "surfaces", {
      id: "surface-glass",
      label: "Translucent menus and popovers",
      keys: ["surfaceGlass"],
      result: "glass",
    })
  } else if (glassy.some((s) => /\b(nav|navigation|navbar|header)\b/i.test(s)))
    add(ctx, "unmapped", "surfaces", {
      id: "backdrop-blur",
      label: "A blurred nav or header has no axis",
    })

  // Input style: the field's fill against the page.
  const input = fam.input.find((c) => c.props.backgroundColor !== undefined)
  const fill = input && color(input.props.backgroundColor)
  if (input && fill) {
    const transparent = fill.alpha === 0
    const delta =
      opaque(fill) && pageL !== undefined
        ? Math.abs(lstarOf(fill.oklch) - pageL)
        : undefined
    if (transparent || (delta !== undefined && delta < 1))
      add(ctx, "mapped", "components", {
        id: "input-style",
        label: "Outlined fields on the page's tone",
        source: `components.${input.key}`,
        keys: ["inputStyle"],
        result: "outline",
      })
    else if (delta !== undefined && borderVocab && !hasBorder(input.props)) {
      state.inputStyle = "filled"
      add(ctx, "approximated", "components", {
        id: "input-style",
        label: "Filled fields without a border",
        source: `components.${input.key}`,
        keys: ["inputStyle"],
        result: "filled",
      })
    }
  }
}

// Whole-word "link", so a `nav-link` token name doesn't count.
const LINK_WORD = /(?<![\w-])links?(?![\w-])/i

export function mapProse(ctx: Ctx) {
  const { doc, state } = ctx
  const prose = doc.prose

  const icon = /\b(Lucide|Phosphor|Tabler|Remix ?Icon|Hugeicons)\b/i.exec(
    prose,
  )?.[1]
  const library =
    icon &&
    LIBRARY_OPTIONS.find(
      (o) => o.value === icon.toLowerCase().replace(/\s*icon$/, ""),
    )
  if (library) {
    state.iconLibrary = library.value
    add(ctx, "approximated", "icons", {
      id: "icon-library",
      label: "Icon library named in the file",
      keys: ["iconLibrary"],
      value: icon,
      result: library.label,
    })
  } else if (
    doc.headings.some(
      (h) => h.section !== "ignored" && /iconograph/i.test(h.text),
    )
  )
    add(ctx, "unmapped", "icons", {
      id: "iconography",
      label: "The file's icon set isn't one the studio ships",
    })

  // Lines, not sentences: "links… Underlined on hover." spans two.
  const linkLines = prose
    .split("\n")
    .filter((line) => LINK_WORD.test(line) && /underline/i.test(line))
  if (linkLines.length > 0) {
    const underline = linkLines.some((s) =>
      /no underline|never underline|without (an )?underline|not underlined/i.test(
        s,
      ),
    )
      ? "never"
      : linkLines.some((s) => /hover|press|focus/i.test(s))
        ? "hover"
        : "always"
    state.linkUnderline = underline
    add(ctx, "approximated", "links", {
      id: "link-underline",
      label: "Link underline from the prose",
      keys: ["linkUnderline"],
      result: underline,
    })
  }

  if (
    /max(imum)? (content )?width|columns?|grid/i.test(doc.sections.layout ?? "")
  )
    add(ctx, "unmapped", "layout", {
      id: "layout-grid",
      label: "Page grid and max width have no axis",
    })
  if (doc.sections.responsive !== undefined)
    add(ctx, "unmapped", "layout", {
      id: "breakpoints",
      label: "Breakpoints have no axis",
    })
  if (/transition|duration|easing|animat/i.test(prose))
    add(ctx, "unmapped", "motion", {
      id: "motion",
      label: "Motion described in prose isn't read",
    })
  if (
    /focus[^.\n]{0,60}\d+px|\d+px[^.\n]{0,40}(focus|ring|outline)/i.test(prose)
  )
    add(ctx, "unmapped", "components", {
      id: "focus-ring",
      label: "The focus ring recipe isn't read",
    })
  if (
    doc.headings.some(
      (h) =>
        h.section !== "ignored" && /photo|illustration|imagery/i.test(h.text),
    )
  )
    add(ctx, "unmapped", "layout", {
      id: "imagery",
      label: "Imagery guidance has no axis",
    })
}
