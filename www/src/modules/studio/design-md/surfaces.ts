/* Surfaces, input style and the prose-only rules (icons, links, and the
   evidence for axes the studio doesn't have). */

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
    add(ctx, layers === "grouped" ? "approximated" : "mapped", "surfaces", {
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

  // Edge: the components' own border vocabulary first, then prose.
  const cardRow = tableRows(elevation).find(
    (cells) =>
      cells.some((cell) => /\bcards?\b/i.test(cell)) &&
      !cells.some((cell) => CARD_ROW_EXCLUDED.test(cell)),
  )
  const cardRowLayers = cardRow?.flatMap(cellShadows) ?? []
  const borderVocab = components.some(
    (c) => "border" in c.props || "borderColor" in c.props,
  )
  let edge: { value: string; exact: boolean } | undefined
  if (borderVocab && fam.card.length > 0)
    edge = {
      value: fam.card.some((c) => hasBorder(c.props)) ? "line" : "none",
      exact: true,
    }
  else {
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
    if (!edge && cardRowLayers.some((l) => l.inset && isRing(l)))
      edge = { value: "line", exact: false }
  }
  if (edge) {
    state.surfaceEdge = edge.value
    add(ctx, statusOf(edge.exact), "surfaces", {
      id: "surface-edge",
      label:
        edge.value === "line"
          ? "Cards drawn with a hairline"
          : "Cards without a border",
      source: edge.exact ? "components" : "prose: Elevation & Depth",
      keys: ["surfaceEdge"],
      result: edge.value,
    })
  }

  // Shadow: the elevation table's card row, a card's shadow, then keywords.
  const strengthOf = (layers: ShadowLayer[]) =>
    Math.max(0, ...layers.filter((l) => !l.inset).map(shadowStrength))
  const cardShadow = fam.card
    .map((c) => c.props.shadow)
    .find((s): s is string => typeof s === "string")
  let shadow: { tier: string; exact: boolean; value?: string } | undefined
  if (cardRow)
    shadow = {
      tier: shadowTier(strengthOf(cardRowLayers)),
      exact: true,
      value: cardRow.join(" | "),
    }
  else if (cardShadow)
    shadow = {
      tier: shadowTier(strengthOf(shadows(cardShadow))),
      exact: true,
      value: cardShadow,
    }
  else if (
    /no (drop )?shadows?|shadowless|flat design|resists?[^.]{0,20}shadows|shadows? (are )?(rare|minimal)/i.test(
      elevation,
    )
  )
    shadow = { tier: "flat", exact: false }
  else if (/(subtle|soft|faint) (drop )?shadow/i.test(elevation))
    shadow = { tier: "low", exact: false }
  else if (/(deep|dramatic|heavy|pronounced) shadow/i.test(elevation))
    shadow = { tier: "high", exact: false }
  if (shadow) {
    state.surfaceShadow = shadow.tier
    const full = validate(state)
    const lifted = shadow.tier === "flat" && full.ok && !flatAllowed(full.state)
    if (lifted) state.surfaceShadow = "low"
    add(ctx, statusOf(shadow.exact && !lifted), "surfaces", {
      id: "surface-shadow",
      label: "Card shadow",
      source: shadow.exact
        ? "prose: Elevation & Depth"
        : "prose: Elevation & Depth (keywords)",
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
    ...[...elevation.matchAll(/`([^`]+)`/g)].flatMap((m) => shadows(m[1]!)),
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

/* ---------------------------------- prose --------------------------------- */

export function mapProse(ctx: Ctx) {
  const { doc, state } = ctx
  const prose = doc.prose

  const icon = /\b(Lucide|Phosphor|Tabler|Remix ?Icon|Hugeicons)\b/i.exec(prose)
  const library =
    icon &&
    LIBRARY_OPTIONS.find(
      (o) => o.value === icon[1]!.toLowerCase().replace(/\s*icon$/, ""),
    )
  if (library) {
    state.iconLibrary = library.value
    add(ctx, "approximated", "icons", {
      id: "icon-library",
      label: "Icon library named in the file",
      keys: ["iconLibrary"],
      value: icon[1],
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

  const linkSentences = sentences(prose).filter(
    (s) => /link/i.test(s) && /underline/i.test(s),
  )
  if (linkSentences.length > 0) {
    const underline = linkSentences.some((s) =>
      /no underline|never underline|without (an )?underline/i.test(s),
    )
      ? "never"
      : linkSentences.some((s) => /hover/i.test(s))
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
