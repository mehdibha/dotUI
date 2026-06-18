// dotUI → design-sync input generator (deterministic, committed).
//
// dotUI is off the converter's default envelope: no npm dist/, no Storybook —
// components live as registry source under www/src/registry/ui/<c>/. The default
// synth-entry would `export *` from base.tsx AND index.tsx (index re-exports
// base), so esbuild drops the ambiguous duplicate exports and window.dotUI.*
// comes up empty. This script instead emits an explicit, collision-safe entry
// plus the config fragments the converter needs.
//
// Outputs:
//   .design-sync/bundle-entry.tsx        — explicit named re-exports of every
//                                           public component (+ DesignSystemProvider)
//   .design-sync/groups/<Name>.md        — `category:` stub per component (committed)
//   .design-sync/.cache/gen-config.json  — { componentSrcMap, docsMap } to merge into config
//
// Source of truth for the component set: the registry manifest
// (registry-items.ts) — the meta.ts-registered items, not every dir under ui/.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { Node, Project, ts } from 'ts-morph'

const ROOT = resolve('.')
const WWW = join(ROOT, 'www')
const UI = join(WWW, 'src/registry/ui')
const REG_ITEMS = join(WWW, 'src/registry/__generated__/registry-items.ts')
// Build temp lives UNDER www so the converter's PKG_DIR (walked up from the
// --entry file) resolves to www, not the monorepo root.
const BUILD = join(WWW, '.ds-sync-build')

// meta `group` → DS-pane label.
const GROUP_LABELS = {
  inputs: 'Inputs',
  overlays: 'Overlays',
  containers: 'Containers',
  buttons: 'Buttons',
  sliders: 'Sliders',
  'selection-controls': 'Selection Controls',
  pickers: 'Pickers',
  navigation: 'Navigation',
  'menus-lists': 'Menus & Lists',
  tags: 'Tags',
  progress: 'Progress',
  feedback: 'Feedback',
  'color-swatches': 'Color',
  disclosure: 'Disclosure',
  typography: 'Typography',
  'drop-zone': 'Drop Zone',
  calendar: 'Calendar',
}

const pascal = (s) =>
  s.split(/[-_]/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join('')

// Component-like value export: PascalCase, not a *Props/*Styles helper, not a
// hook, not an ALL_CAPS constant.
const isComponentExport = (n) =>
  /^[A-Z][A-Za-z0-9]*$/.test(n) &&
  !n.endsWith('Props') &&
  !n.endsWith('Styles') &&
  !/^[A-Z0-9_]+$/.test(n) &&
  !/^use[A-Z]/.test(n)

const dirs = [
  ...new Set(
    [...readFileSync(REG_ITEMS, 'utf8').matchAll(/@\/registry\/ui\/([^/]+)\/meta/g)].map((m) => m[1]),
  ),
]

const project = new Project({
  skipAddingFilesFromTsConfig: true,
  compilerOptions: {
    jsx: ts.JsxEmit.Preserve,
    allowJs: true,
    skipLibCheck: true,
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
  },
})
project.addSourceFilesAtPaths([`${UI}/**/*.{ts,tsx}`, `!${UI}/**/*.{test,spec}.{ts,tsx}`])

const groupsDir = join(ROOT, '.design-sync/groups')
mkdirSync(groupsDir, { recursive: true })
mkdirSync(join(ROOT, '.design-sync/.cache'), { recursive: true })

const entryLines = []
const seen = new Map() // exportName -> dir (global dedupe across components)
const collisions = []
const componentSrcMap = {}
const docsMap = {}
const skipped = []

for (const dir of dirs) {
  const base = join(UI, dir, 'base.tsx')
  const index = join(UI, dir, 'index.tsx')
  const srcAbs = existsSync(base) ? base : existsSync(index) ? index : null
  if (!srcAbs) { skipped.push(`${dir} (no base.tsx/index.tsx)`); continue }
  const sf = project.getSourceFile(srcAbs)
  if (!sf) { skipped.push(`${dir} (not in project)`); continue }

  const names = []
  for (const [name, decls] of sf.getExportedDeclarations()) {
    if (!isComponentExport(name)) continue
    if (decls.some((d) => Node.isVariableDeclaration(d) || Node.isFunctionDeclaration(d) || Node.isClassDeclaration(d))) {
      names.push(name)
    }
  }
  if (!names.length) { skipped.push(`${dir} (no component exports)`); continue }

  const metaSrc = existsSync(join(UI, dir, 'meta.ts')) ? readFileSync(join(UI, dir, 'meta.ts'), 'utf8') : ''
  const group = metaSrc.match(/group:\s*'([^']+)'/)?.[1] ?? 'general'
  const label = GROUP_LABELS[group] ?? pascal(group)

  const primary = names.includes(pascal(dir)) ? pascal(dir) : names[0]

  // global dedupe — re-export each name once; record collisions for review.
  const fresh = []
  for (const n of names) {
    if (seen.has(n)) { if (seen.get(n) !== dir) collisions.push(`${n}: ${seen.get(n)} vs ${dir}`); continue }
    seen.set(n, dir)
    fresh.push(n)
  }
  if (fresh.length) entryLines.push(`export { ${fresh.join(', ')} } from ${JSON.stringify(srcAbs)}`)

  componentSrcMap[primary] = relative(WWW, srcAbs)

  const docPath = join(groupsDir, `${primary}.md`)
  writeFileSync(docPath, `---\ncategory: ${label}\n---\n`)
  docsMap[primary] = relative(WWW, docPath)
}

// The global provider — available to the design agent for density/theme control.
// Not listed as a component (no card); just present in the bundle namespace.
entryLines.unshift(`export { DesignSystemProvider } from ${JSON.stringify(join(WWW, 'src/lib/styles.tsx'))}`)

const header = `// AUTO-GENERATED by .design-sync/gen-bundle-inputs.mjs — do not edit.\n// Explicit, collision-safe re-export of every public dotUI component.\n`
mkdirSync(BUILD, { recursive: true })
writeFileSync(join(BUILD, 'bundle-entry.tsx'), header + entryLines.join('\n') + '\n')
writeFileSync(
  join(ROOT, '.design-sync/.cache/gen-config.json'),
  JSON.stringify({ componentSrcMap, docsMap }, null, 2) + '\n',
)

console.error(`✓ entry: ${seen.size} public exports across ${Object.keys(componentSrcMap).length} components`)
if (collisions.length) console.error(`  collisions (kept first):\n   ${collisions.join('\n   ')}`)
if (skipped.length) console.error(`  skipped: ${skipped.join(', ')}`)
