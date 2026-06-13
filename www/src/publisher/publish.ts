/**
 * Request-time orchestrator. Given a publishable (the build-time artifact
 * for one component) and a preset, return a shadcn registry item with one
 * inline file whose tv config is fully resolved against the preset.
 *
 * Pure JS — no `ts-morph`, no React. Safe to import in route handlers.
 *
 * Pipeline:
 *   1. flatten         — merge base ← density ← param-value layers
 *   2. resolveClasses  — rewrite scalar-param var refs to Tailwind suffixes
 *   3. serialize       — render the flat config to a TS literal string
 *   4. substitute      — splice into the template at `%%TV_CONFIG%%`
 *   5. assemble        — build the shadcn-shaped JSON
 *
 * Step 6 (oxfmt) lives outside this module — callers feed the assembled
 * content through `oxfmt.format` since that's async and route-side.
 */

import type { RegistryItem } from '@/registry/types'

import { flatten } from './flatten'
import { buildScalarVarMap, resolveClasses } from './resolve-classes'
import { serializeTvConfig } from './serialize'
import type { Publishable, PublishPreset } from './types'

export const TV_CONFIG_PLACEHOLDER = '%%TV_CONFIG%%'

/**
 * Names of registry items that live in the dotui registry — i.e. anything
 * that has a publishable. Used to decide which `registryDependencies` need
 * to be rewritten into absolute URLs (so `shadcn add` can follow them
 * without the consumer setting up a registry mapping) and which (like a
 * bundled `focus-styles`) should be dropped because they're already
 * available locally after install.
 *
 * Seeded from the generated `PUBLISHABLE_NAMES` list in the route module.
 */
let knownDotuiNames: Set<string> | undefined

/** Origin used to construct absolute dep URLs, e.g. `https://dotui.com`. */
let dotuiOrigin: string | undefined

/** Query string (including leading `?`) appended to dep URLs, e.g. `?preset=…`. */
let dotuiDepQuery = ''

/**
 * Names of registry items the consumer already has from the init bundle.
 * They're not separately fetchable URLs — drop them from per-component
 * `registryDependencies` so shadcn doesn't 404 looking for them.
 */
const BUNDLED_INTO_INIT = new Set([
  // focus-ring / focus-reset / focus-input utilities ship in base.css.
  'focus-styles',
  // @theme blocks ship in theme.css.
  'theme',
  // cn() helper ships as `src/lib/utils.ts` in the init item.
  'utils',
])

export function setKnownDotuiNames(names: Iterable<string>): void {
  knownDotuiNames = new Set(names)
}

/**
 * Configure how transitive dotui-component deps are emitted. When called with
 * an origin (e.g. `https://dotui.com`) and an optional query string, the
 * publisher rewrites bare dep names (`"loader"`) to absolute URLs
 * (`https://dotui.com/r/loader?preset=…`) so `shadcn add` can follow
 * the transitive deps without needing a registry mapping in components.json.
 *
 * Called once per request from the route handler.
 */
export function setDotuiDepResolver(origin: string, depQuery = ''): void {
  dotuiOrigin = origin.replace(/\/$/, '')
  dotuiDepQuery = depQuery
}

function rewriteDeps(
  deps: readonly string[] | undefined,
): string[] | undefined {
  if (!deps || deps.length === 0) return undefined
  const known = knownDotuiNames
  const out: string[] = []
  for (const dep of deps) {
    // Drop deps that the consumer already has from the init bundle.
    if (BUNDLED_INTO_INIT.has(dep)) continue
    // Already a fully-qualified URL? leave alone.
    if (dep.includes('://')) {
      out.push(dep)
      continue
    }
    // Already namespaced (e.g. `@dotui/loader`)? leave alone.
    if (dep.startsWith('@')) {
      out.push(dep)
      continue
    }
    // Known dotui component + we have an origin → emit as absolute URL.
    if (known?.has(dep) && dotuiOrigin) {
      out.push(`${dotuiOrigin}/r/${dep}${dotuiDepQuery}`)
      continue
    }
    // Otherwise pass through — let shadcn resolve via the default registry.
    out.push(dep)
  }
  return out.length > 0 ? out : undefined
}

export interface PublishedItem {
  /** Shadcn-shaped registry item ready to JSON.stringify. */
  item: RegistryItem
  /** The pre-format component source — caller passes this through oxfmt. */
  rawContent: string
}

export interface PublishInput {
  publishable: Publishable
  preset: PublishPreset
}

export function publish({ publishable, preset }: PublishInput): PublishedItem {
  const { template, stylesConfig, meta, extraFiles } = publishable
  const paramSelections = preset.componentParams[meta.name] ?? {}

  // 1. Flatten base + density + param layers.
  const flat = flatten({
    stylesConfig,
    meta,
    density: preset.density,
    paramSelections,
  })

  // 2. Rewrite scalar-param var refs to Tailwind suffixes.
  const varMap = buildScalarVarMap(meta, paramSelections)
  const resolved = resolveClasses(flat, varMap)

  // 3+4. Serialize and substitute.
  const literal = serializeTvConfig(resolved)
  const content = template.replace(TV_CONFIG_PLACEHOLDER, literal)

  // 5. Assemble shadcn item — drop dotui-only fields (params, group).
  // Shadcn's RegistryItem is a discriminated union on `type`. We can't carry the
  // discriminant through generic plumbing, so we build a structurally-correct
  // object and cast at the boundary.
  // Secondary files (e.g. a `use-x.ts` hook) carry their own pre-transformed
  // content; only the base file gets the preset-resolved template.
  const files = (meta.files ?? []).map((file) => ({
    ...file,
    content: extraFiles?.[file.path] ?? content,
  }))

  const itemShape = {
    name: meta.name,
    type: meta.type,
    ...(meta.title !== undefined ? { title: meta.title } : {}),
    ...(meta.description !== undefined
      ? { description: meta.description }
      : {}),
    ...(meta.dependencies ? { dependencies: meta.dependencies } : {}),
    ...(meta.registryDependencies
      ? {
          registryDependencies:
            rewriteDeps(meta.registryDependencies) ?? meta.registryDependencies,
        }
      : {}),
    ...(meta.css ? { css: meta.css } : {}),
    ...(meta.cssVars ? { cssVars: meta.cssVars } : {}),
    files,
  }
  const item = itemShape as unknown as RegistryItem

  return { item, rawContent: content }
}
