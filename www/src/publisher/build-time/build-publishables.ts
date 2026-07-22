/**
 * Build-time orchestrator. Iterates the dotui registry and emits a
 * `__generated__/publishables/<name>.ts` for every component whose
 * `styles.ts` can be statically extracted and whose `base.tsx` can be
 * transformed. Skipped components log a warning but don't abort the build.
 *
 * Called from `scripts/registry-build.ts`. Imports `ts-morph` (via the
 * extract / transform modules) — never imported from a route bundle.
 */

import { existsSync, promises as fs } from 'node:fs'
import path from 'node:path'
import { format } from 'oxfmt'

import type { RegistryItem, RegistryItemFile } from '@/registry/types'

import type { StylesConfig } from '../types'
import { cssToRegistryFields } from './css-to-registry-fields'
import { extractStylesConfig } from './extract-config'
import { transformBase, TV_CONFIG_PLACEHOLDER } from './transform-base'

type RegistryCssFields = Pick<RegistryItem, 'css' | 'cssVars'>

interface BuildPublishablesOptions {
  /** Absolute path to `www/src/registry`. */
  registryDir: string
  /** Registry items to process. */
  items: RegistryItem[]
}

export interface BuildPublishablesResult {
  written: string[]
  skipped: Array<{ name: string; reason: string }>
}

export async function buildPublishables({
  registryDir,
  items,
}: BuildPublishablesOptions): Promise<BuildPublishablesResult> {
  const outDir = path.join(registryDir, '__generated__/publishables')
  await fs.mkdir(outDir, { recursive: true })

  const written: string[] = []
  const skipped: Array<{ name: string; reason: string }> = []

  for (const meta of items) {
    try {
      const result = await buildOne({ meta, registryDir, outDir })
      if (result === 'skipped') {
        skipped.push({ name: meta.name, reason: 'no base.tsx in meta.files' })
      } else if (typeof result === 'string') {
        written.push(result)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      skipped.push({ name: meta.name, reason: message })
    }
  }

  // Emit the runtime lookup index so the route handler can resolve a
  // component name without dynamically constructing import paths.
  const indexPath = path.join(outDir, 'index.ts')
  await fs.writeFile(indexPath, renderIndex(written, outDir), 'utf8')
  written.push(indexPath)

  // Convert the base CSS sources into shadcn registry fields so the init
  // endpoint can update the consumer's CSS file without shipping an extra file.
  const bundlePath = path.join(registryDir, '__generated__', 'base-css.ts')
  await fs.mkdir(path.dirname(bundlePath), { recursive: true })
  await fs.writeFile(
    bundlePath,
    await renderBaseRegistryCss(registryDir),
    'utf8',
  )
  written.push(bundlePath)

  return { written, skipped }
}

function renderIndex(writtenPaths: string[], outDir: string): string {
  const names = writtenPaths
    .filter((p) => p.endsWith('.ts') && !p.endsWith('/index.ts'))
    .map((p) => path.basename(p, '.ts'))
    .sort()

  const lines: string[] = []
  lines.push(`// AUTO-GENERATED — do not edit. Run \`pnpm build:registry\`.`)
  lines.push(`import type { Publishable } from "@/publisher/types";`)
  lines.push(``)
  lines.push(
    `type Loader = () => Promise<{ publishable: Publishable; publishableByPath?: Record<string, Publishable> }>;`,
  )
  lines.push(``)
  lines.push(`export const publishables: Record<string, Loader> = {`)
  for (const name of names) {
    // JSON.stringify guards against weird characters even though component names are slug-shaped.
    lines.push(
      `\t${JSON.stringify(name)}: () => import(${JSON.stringify(`./${name}`)}),`,
    )
  }
  lines.push(`};`)
  lines.push(``)
  lines.push(
    `export const PUBLISHABLE_NAMES: readonly string[] = ${JSON.stringify(names)};`,
  )
  lines.push(``)
  // Silence the unused warning for callers that only use `publishables`.
  void outDir
  return lines.join('\n')
}

async function renderBaseRegistryCss(registryDir: string): Promise<string> {
  // Order matches `www/src/registry/styles.css`.
  const candidates = [
    path.join(registryDir, 'base', 'base.css'),
    path.join(registryDir, 'base', 'colors.css'),
    path.join(registryDir, 'base', 'theme.css'),
    path.join(registryDir, 'base', 'fonts.css'),
  ]
  const parts: string[] = []
  for (const file of candidates) {
    try {
      const css = await fs.readFile(file, 'utf8')
      parts.push(`/* ===== ${path.basename(file)} ===== */`)
      parts.push(css.trimEnd())
    } catch {
      // Missing source file — skip silently.
    }
  }
  const bundle = parts.join('\n\n')
  const fields = cssToRegistryFields(bundle)

  const raw = [
    `// AUTO-GENERATED — do not edit. Run \`pnpm build:registry\`.`,
    `// Structured shadcn registry CSS fields generated from www/src/registry/base/*.css.`,
    ``,
    `import type { RegistryItem } from "@/registry/types";`,
    ``,
    `export const baseRegistryCss = ${JSON.stringify(fields, null, 2)} as const satisfies Pick<RegistryItem, "css" | "cssVars">;`,
    ``,
  ].join('\n')

  try {
    const { code } = await format('base-css.ts', raw, {
      printWidth: 120,
      useTabs: true,
    })
    return code
  } catch {
    return raw
  }
}

interface BuildOneInput {
  meta: RegistryItem
  registryDir: string
  outDir: string
}

/**
 * Build one publishable. Returns the file path written, "skipped" when the
 * item has no shippable files, or throws. Style-less lib/hook items (no
 * `base.tsx`) ship their files verbatim so `/r/<name>` serves them too.
 */
async function buildOne({
  meta,
  registryDir,
  outDir,
}: BuildOneInput): Promise<string | 'skipped'> {
  const baseFiles = collectBaseFiles(meta)
  if (baseFiles.length === 0) {
    return buildStylelessPublishable({ meta, registryDir, outDir })
  }

  // Extract the styles config once per component (it's shared across enum-file variants).
  const componentDir = path.join(registryDir, 'ui', meta.name)
  const stylesTsPath = path.join(componentDir, 'styles.ts')
  const hasStyles = existsSync(stylesTsPath)
  const stylesConfig: StylesConfig = hasStyles
    ? extractStylesConfig(stylesTsPath)
    : emptyStylesConfig()
  const runtimeMeta = withComponentCssFields(
    meta,
    await readComponentCssFields(componentDir),
  )

  // Transform each base file to a template.
  const templates = baseFiles.map((file) => {
    const absPath = path.join(registryDir, file.path)
    const { template } = transformBase({
      baseTsxPath: absPath,
      componentName: meta.name,
      hasStylesConfig: hasStyles,
    })
    return { file, template }
  })

  // Secondary files (e.g. a `use-x.ts` hook shipped next to `base.tsx`) carry
  // no styles config — ship them verbatim with only registry import paths
  // rewritten. Without this they'd inherit the base template's content.
  const baseFilePaths = new Set(baseFiles.map((file) => file.path))
  const extraFiles: Record<string, string> = {}
  for (const file of meta.files ?? []) {
    if (baseFilePaths.has(file.path)) continue
    extraFiles[file.path] = await transformExtraFile(
      path.join(registryDir, file.path),
      meta.name,
    )
  }

  const outPath = path.join(outDir, `${meta.name}.ts`)
  const source = await renderPublishableSource({
    meta: runtimeMeta,
    stylesConfig,
    templates,
    extraFiles,
  })
  await fs.writeFile(outPath, source, 'utf8')
  return outPath
}

/**
 * Build a style-less publishable (registry:lib / registry:hook) — no tv config,
 * no template transform. Every file ships verbatim (registry import paths
 * rewritten) as an `extraFile`, so `publish()` emits each one unchanged.
 */
async function buildStylelessPublishable({
  meta,
  registryDir,
  outDir,
}: BuildOneInput): Promise<string | 'skipped'> {
  const files = meta.files ?? []
  if (files.length === 0) return 'skipped'

  const extraFiles: Record<string, string> = {}
  for (const file of files) {
    extraFiles[file.path] = await transformExtraFile(
      path.join(registryDir, file.path),
      meta.name,
    )
  }

  const outPath = path.join(outDir, `${meta.name}.ts`)
  const source = await renderStylelessPublishableSource({ meta, extraFiles })
  await fs.writeFile(outPath, source, 'utf8')
  return outPath
}

/**
 * Transform one secondary (non-base) file for shipping. `.ts`/`.tsx` go through
 * `transformBase` with `hasStylesConfig: false` so registry import paths get
 * rewritten to consumer aliases; anything else is copied byte-for-byte.
 */
async function transformExtraFile(
  absPath: string,
  componentName: string,
): Promise<string> {
  if (absPath.endsWith('.ts') || absPath.endsWith('.tsx')) {
    return transformBase({
      baseTsxPath: absPath,
      componentName,
      hasStylesConfig: false,
    }).template
  }
  return fs.readFile(absPath, 'utf8')
}

async function readComponentCssFields(
  componentDir: string,
): Promise<RegistryCssFields> {
  const stylesCssPath = path.join(componentDir, 'styles.css')
  if (!existsSync(stylesCssPath)) return {}

  return cssToRegistryFields(await fs.readFile(stylesCssPath, 'utf8'))
}

function withComponentCssFields(
  meta: RegistryItem,
  fields: RegistryCssFields,
): RegistryItem {
  const css = mergeCss(meta.css, fields.css)
  const cssVars = mergeCssVars(meta.cssVars, fields.cssVars)

  return {
    ...meta,
    ...(css ? { css } : {}),
    ...(cssVars ? { cssVars } : {}),
  }
}

function mergeCss(
  base: RegistryCssFields['css'],
  extra: RegistryCssFields['css'],
): RegistryCssFields['css'] | undefined {
  const merged = { ...(base ?? {}), ...(extra ?? {}) }
  return Object.keys(merged).length > 0 ? merged : undefined
}

function mergeCssVars(
  base: RegistryCssFields['cssVars'],
  extra: RegistryCssFields['cssVars'],
): RegistryCssFields['cssVars'] | undefined {
  const merged = {
    ...(base?.theme || extra?.theme
      ? { theme: { ...(base?.theme ?? {}), ...(extra?.theme ?? {}) } }
      : {}),
    ...(base?.light || extra?.light
      ? { light: { ...(base?.light ?? {}), ...(extra?.light ?? {}) } }
      : {}),
    ...(base?.dark || extra?.dark
      ? { dark: { ...(base?.dark ?? {}), ...(extra?.dark ?? {}) } }
      : {}),
  }

  return Object.keys(merged).length > 0 ? merged : undefined
}

/**
 * Determine which base file(s) get transformed for a component.
 *
 * - Default: the file in `meta.files` whose target ends in `<name>.tsx`.
 * - Enum-with-files: every distinct base path across `params[...].files[...]`.
 */
export function collectBaseFiles(meta: RegistryItem): RegistryItemFile[] {
  const byKey = new Map<string, RegistryItemFile>()

  for (const file of meta.files ?? []) {
    if (isBaseFile(file, meta.name)) byKey.set(file.path, file)
  }
  for (const def of Object.values(meta.params ?? {})) {
    if (def.kind !== 'enum' || !def.files) continue
    for (const fileList of Object.values(def.files)) {
      for (const file of fileList) {
        if (isBaseFile(file, meta.name)) byKey.set(file.path, file)
      }
    }
  }
  return [...byKey.values()]
}

function isBaseFile(file: RegistryItemFile, componentName: string): boolean {
  // We treat any tsx whose source path lives under `ui/<name>/` and starts with
  // `base` as a base file.
  const segments = file.path.split('/')
  const last = segments.at(-1) ?? ''
  return (
    segments[0] === 'ui' &&
    segments[1] === componentName &&
    last.startsWith('base') &&
    last.endsWith('.tsx')
  )
}

function emptyStylesConfig(): StylesConfig {
  return { base: {} }
}

/* -------------------------- source generation -------------------------- */

interface RenderInput {
  meta: RegistryItem
  stylesConfig: StylesConfig
  templates: Array<{ file: RegistryItemFile; template: string }>
  extraFiles: Record<string, string>
}

/** Render a style-less publishable: empty template, all files as extraFiles. */
async function renderStylelessPublishableSource({
  meta,
  extraFiles,
}: {
  meta: RegistryItem
  extraFiles: Record<string, string>
}): Promise<string> {
  const metaLiteral = JSON.stringify(meta, null, 2)
  const lines: string[] = [
    `// AUTO-GENERATED — do not edit. Source: ${meta.type} "${meta.name}"`,
    `// Run \`pnpm build:registry\` to regenerate.`,
    ``,
    `import type { Publishable } from "@/publisher/types";`,
    ``,
    `const meta = ${metaLiteral} as const;`,
    ``,
    `export const publishable: Publishable = {`,
    `\ttemplate: "",`,
    `\tstylesConfig: { base: {} } as unknown as Publishable["stylesConfig"],`,
    `\tmeta: meta as unknown as Publishable["meta"],`,
    `\textraFiles: ${renderExtraFilesLiteral(extraFiles, 1)},`,
    `};`,
    ``,
  ]

  const raw = lines.join('\n')
  try {
    const { code } = await format('publishable.ts', raw, {
      printWidth: 120,
      useTabs: true,
    })
    return code
  } catch {
    return raw
  }
}

async function renderPublishableSource({
  meta,
  stylesConfig,
  templates,
  extraFiles,
}: RenderInput): Promise<string> {
  // We emit two top-level exports:
  //   - `publishable`: the default (single-template) Publishable
  //   - `publishableByPath`: a map keyed by source file path, for enum-with-files components
  //
  // The runtime route picks the right entry based on the preset's selection of
  // the enum param that drives file swapping.

  const defaultFile =
    (meta.files ?? []).find((f) => isBaseFile(f, meta.name)) ??
    templates[0]?.file
  const defaultTemplate =
    templates.find((t) => t.file.path === defaultFile?.path) ?? templates[0]

  if (!defaultTemplate || !defaultFile) {
    throw new Error(
      `[publisher] no default base file resolved for "${meta.name}"`,
    )
  }

  const stylesConfigLiteral = JSON.stringify(stylesConfig, null, 2)
  const metaLiteral = JSON.stringify(meta, null, 2)
  const hasExtraFiles = Object.keys(extraFiles).length > 0
  const extraFilesProp = hasExtraFiles
    ? `\textraFiles: ${renderExtraFilesLiteral(extraFiles, 1)},`
    : undefined

  const lines: string[] = []
  lines.push(`// AUTO-GENERATED — do not edit. Source: ui/${meta.name}/`)
  lines.push(`// Run \`pnpm build:registry\` to regenerate.`)
  lines.push(``)
  lines.push(`import type { Publishable } from "@/publisher/types";`)
  lines.push(``)
  lines.push(`const stylesConfig = ${stylesConfigLiteral} as const;`)
  lines.push(``)
  lines.push(`const meta = ${metaLiteral} as const;`)
  lines.push(``)
  lines.push(`export const publishable: Publishable = {`)
  lines.push(`\ttemplate: ${templateLiteral(defaultTemplate.template)},`)
  lines.push(
    `\tstylesConfig: stylesConfig as unknown as Publishable["stylesConfig"],`,
  )
  lines.push(`\tmeta: meta as unknown as Publishable["meta"],`)
  if (extraFilesProp) lines.push(extraFilesProp)
  lines.push(`};`)

  if (templates.length > 1) {
    lines.push(``)
    lines.push(
      `export const publishableByPath: Record<string, Publishable> = {`,
    )
    for (const { file, template } of templates) {
      lines.push(`\t${JSON.stringify(file.path)}: {`)
      lines.push(`\t\ttemplate: ${templateLiteral(template)},`)
      lines.push(
        `\t\tstylesConfig: stylesConfig as unknown as Publishable["stylesConfig"],`,
      )
      lines.push(`\t\tmeta: meta as unknown as Publishable["meta"],`)
      if (hasExtraFiles) {
        lines.push(`\t\textraFiles: ${renderExtraFilesLiteral(extraFiles, 2)},`)
      }
      lines.push(`\t},`)
    }
    lines.push(`};`)
  }

  lines.push(``)

  const raw = lines.join('\n')
  try {
    const { code } = await format('publishable.ts', raw, {
      printWidth: 120,
      useTabs: true,
    })
    return code
  } catch {
    // Formatting is cosmetic — never block the build over a formatter hiccup.
    return raw
  }
}

function renderExtraFilesLiteral(
  extraFiles: Record<string, string>,
  depth: number,
): string {
  const indent = '\t'.repeat(depth + 1)
  const closeIndent = '\t'.repeat(depth)
  const entries = Object.entries(extraFiles).map(
    ([filePath, content]) =>
      `${indent}${JSON.stringify(filePath)}: ${templateLiteral(content)},`,
  )
  return `{\n${entries.join('\n')}\n${closeIndent}}`
}

function templateLiteral(template: string): string {
  // Use backtick template literal but escape backslashes, backticks, and ${.
  const escaped = template
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${')
  return `\`${escaped}\``
}

/**
 * Sanity check used by `assertPlaceholderInTemplate` callers when wiring up
 * the request-time route — exposed so the build script can fail fast when a
 * `useStyles()`-using component's transform somehow produces a template
 * without a placeholder.
 */
export function assertPlaceholderInTemplate(
  name: string,
  template: string,
): void {
  if (!template.includes(TV_CONFIG_PLACEHOLDER)) {
    throw new Error(
      `[publisher] template for "${name}" has no ${TV_CONFIG_PLACEHOLDER} placeholder`,
    )
  }
}
