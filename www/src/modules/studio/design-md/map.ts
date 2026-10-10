/* A parsed DESIGN.md mapped onto the studio's existing axes, chapter by
   chapter, with a report of what mapped, what was approximated and what has
   no axis yet. Never adds an axis: what doesn't fit is reported. */

import { cleanName } from "@/lib/snapshots/snapshot"

import { validate } from "../axes"
import { mapColor } from "./color"
import {
  add,
  families,
  readColors,
  readComponents,
  STATE_SUFFIX,
} from "./context"
import type { Component, Ctx, State } from "./context"
import type { DesignMdImport } from "./index"
import { kebab } from "./parse"
import type { ParsedDesignMd } from "./parse"
import { mapShape, mapSpace } from "./shape"
import { mapProse, mapSurfaces } from "./surfaces"
import { mapTypography } from "./typography"

export function cleanImportName(raw: string): string {
  const name = raw
    .trim()
    .replace(/[-_ ]?(inspired[-_ ])?design[-_ ]analysis$/i, "")
    .replace(/^design system (inspired by|for)\s+/i, "")
    .replace(/[-_ ]inspired$/i, "")
    .replace(/[-_]+/g, " ")
    .trim()
  return cleanName(name) || "Imported design system"
}

/* ----------------------------------- map ---------------------------------- */

export function mapDesignMd(doc: ParsedDesignMd): DesignMdImport {
  const ctx: Ctx = {
    doc,
    state: {},
    report: { mapped: [], approximated: [], unmapped: [] },
    warnings: [...doc.warnings],
    seen: new Set(),
  }
  const name = doc.title ? cleanImportName(doc.title) : undefined
  const { tokens, source } = readColors(ctx)
  if (source === "none")
    return {
      name,
      state: {},
      report: ctx.report,
      warnings: ctx.warnings,
      source,
    }

  // Prose files give colors, fonts, elevation and the prose rules only.
  const prose = source === "prose"
  const components = prose ? [] : readComponents(doc)
  const fam = families(components)
  const colors = mapColor(ctx, tokens, components)
  mapTypography(ctx, prose)
  if (!prose) {
    mapShape(ctx, components, fam)
    mapSpace(ctx, fam)
  }
  mapSurfaces(ctx, components, fam, colors)
  mapProse(ctx)

  const consumed = new Set(
    Object.values(fam)
      .flat()
      .map((c: Component) => c.key),
  )
  for (const c of components) {
    const base = c.key.replace(STATE_SUFFIX, "")
    if (consumed.has(base) || consumed.has(c.key)) continue
    add(ctx, "unmapped", "components", {
      id: `component-recipe:${kebab(base)}`,
      label: `${base}: its recipe has no axis`,
      source: `components.${base}`,
    })
  }

  if (prose) {
    ctx.report.approximated.push(...ctx.report.mapped)
    ctx.report.mapped = []
  }

  const valid = validate(ctx.state)
  if (!valid.ok)
    for (const issue of valid.issues) {
      delete ctx.state[issue.key as keyof State]
      ctx.warnings.push(`dropped ${issue.key}: ${issue.problem}`)
    }
  return {
    name,
    state: ctx.state,
    report: ctx.report,
    warnings: ctx.warnings,
    source,
  }
}
