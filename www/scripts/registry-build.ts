/**
 * Registry Build Script
 *
 * Generates internal files for lazy loading:
 * - src/registry/__generated__/ (demos, icons, examples, per-library icon exports)
 *
 * Usage: tsx scripts/registry-build.ts
 */

import { existsSync, promises as fs } from 'node:fs'
import path from 'node:path'
import { format } from 'oxfmt'
import { rimraf } from 'rimraf'

import {
  buildPublishables,
  collectBaseFiles,
} from '../src/publisher/build-time/build-publishables'
import { deriveRegistryDeps } from '../src/publisher/build-time/derive-registry-deps'
import { BUNDLED_INTO_INIT } from '../src/publisher/publish'
import { registryBase } from '../src/registry/base/registry'
import { registryHooks } from '../src/registry/hooks/registry'
import { iconLibraries, registryIcons } from '../src/registry/icons/icon-map'
import {
  DEFAULT_COLOR_CONFIG,
  DEFAULT_SEMANTICS,
  emitCss,
  emitDarkOverridesCss,
  emitPrimitivesCss,
  resolveColorConfig,
} from '../src/registry/theme'
import type { RegistryItem } from '../src/registry/types'

// Directories — relative to www/ (process.cwd())
const REGISTRY_DIR = path.join(process.cwd(), 'src/registry')
const GENERATED_DIR = path.join(REGISTRY_DIR, '__generated__')

// ============================================================================
// Utility Functions
// ============================================================================

async function ensureDir(dir: string) {
  await rimraf(dir)
  await fs.mkdir(dir, { recursive: true })
}

async function writeGeneratedFile(targetPath: string, content: string) {
  const { code } = await format(targetPath, content, {
    printWidth: 120,
    useTabs: true,
  })

  await fs.writeFile(targetPath, code, 'utf8')
}

// ============================================================================
// Phase 1: Internal Generated Files (registry/__generated__)
// ============================================================================

async function processDirectory(
  dirPath: string,
  relativePath: string,
  entries: string[],
): Promise<void> {
  const dirEntries = await fs.readdir(dirPath, { withFileTypes: true })

  for (const entry of dirEntries) {
    if (entry.isFile() && entry.name.endsWith('.tsx')) {
      if (entry.name === 'playground.tsx') continue

      const demoName = entry.name.replace('.tsx', '')
      const key = `${relativePath}/${demoName}`
      const importPath = `@/registry/ui/${relativePath}/${demoName}`
      const filePath = `ui/${relativePath}/${entry.name}`

      entries.push(`  "${key}": {
    files: ["${filePath}"],
    component: React.lazy(() => import("${importPath}")),
  },
`)
    } else if (entry.isDirectory()) {
      const subDirPath = path.join(dirPath, entry.name)
      const subRelativePath = `${relativePath}/${entry.name}`
      await processDirectory(subDirPath, subRelativePath, entries)
    }
  }
}

async function buildInternalDemos() {
  const targetPath = path.join(GENERATED_DIR, 'demos.tsx')
  const sourcePath = path.join(REGISTRY_DIR, 'ui')

  let content = `// AUTO-GENERATED - DO NOT EDIT
// Run "tsx scripts/registry-build.ts" to regenerate
import * as React from "react";

export const DemosIndex: Record<
  string,
  {
    files: string[];
    component: React.LazyExoticComponent<React.ComponentType<object>>;
  }
> = {
`

  const componentFolders = await fs.readdir(sourcePath)
  const entries: string[] = []

  for (const componentFolder of componentFolders) {
    const componentPath = path.join(sourcePath, componentFolder)
    const stats = await fs.stat(componentPath)

    if (!stats.isDirectory()) continue

    const demosPath = path.join(componentPath, 'demos')
    if (!existsSync(demosPath)) continue

    await processDirectory(demosPath, `${componentFolder}/demos`, entries)
  }

  content += entries.join('')
  content += `};
`

  await writeGeneratedFile(targetPath, content)
  console.log('  ✓ __generated__/demos.tsx')
}

// Get the package import for each library
function getLibraryPackage(library: string): string {
  switch (library) {
    case 'tabler':
      return '@tabler/icons-react'
    case 'hugeicons':
      return '@hugeicons/core-free-icons'
    case 'remix':
      return '@remixicon/react'
    case 'phosphor':
      return '@phosphor-icons/react'
    default:
      return ''
  }
}

// Generate __libraryName__.ts files with only the icons we use
async function buildIconLibraryExports() {
  const iconsDir = GENERATED_DIR

  // Collect unique icon names per library
  const libraryIcons: Record<string, Set<string>> = {
    tabler: new Set(),
    hugeicons: new Set(),
    remix: new Set(),
    phosphor: new Set(),
  }

  for (const iconMapping of Object.values(registryIcons)) {
    if (iconMapping.tabler) libraryIcons.tabler?.add(iconMapping.tabler)
    if (iconMapping.hugeicons)
      libraryIcons.hugeicons?.add(iconMapping.hugeicons)
    if (iconMapping.remix) libraryIcons.remix?.add(iconMapping.remix)
    if (iconMapping.phosphor) libraryIcons.phosphor?.add(iconMapping.phosphor)
  }

  // Generate a file for each library. Remix/tabler export plain components;
  // hugeicons ships data arrays rendered by `HugeiconsIcon`, so its module
  // wraps each one into a component — the runtime loader stays uniform.
  for (const [library, icons] of Object.entries(libraryIcons)) {
    const packageName = getLibraryPackage(library)
    const sortedIcons = [...icons].sort((a, b) => a.localeCompare(b))

    const isHugeicons = library === 'hugeicons'
    const header = `// AUTO-GENERATED - DO NOT EDIT
// Only exports the ${sortedIcons.length} icons we actually use (not the entire library)`

    const content = isHugeicons
      ? `${header}
"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import type { HugeiconsIconProps } from "@hugeicons/react";
import {
${sortedIcons.map((name) => `\t${name} as ${name}Data,`).join('\n')}
} from "${packageName}";

// The \`hugeicon\` marker class lets the stroke-width axis target the paths
// (see base.css) — hugeicons paths carry their own stroke-width attribute.
function wrap(icon: HugeiconsIconProps["icon"]) {
\treturn function HugeIcon({ className, ...props }: Omit<HugeiconsIconProps, "icon">) {
\t\treturn <HugeiconsIcon icon={icon} className={className ? \`hugeicon \${className}\` : "hugeicon"} {...props} />;
\t};
}

${sortedIcons.map((name) => `export const ${name} = wrap(${name}Data);`).join('\n')}
`
      : `${header}
${sortedIcons.length > 0 ? `export { ${sortedIcons.join(', ')} } from "${packageName}";` : ''}
`

    const ext = isHugeicons ? 'tsx' : 'ts'
    const targetPath = path.join(iconsDir, `__${library}__.${ext}`)
    await writeGeneratedFile(targetPath, content)
    console.log(
      `  ✓ __generated__/__${library}__.${ext} (${sortedIcons.length} icons)`,
    )
  }
}

async function buildInternalIcons() {
  const targetPath = path.join(GENERATED_DIR, 'icons.tsx')

  const iconKeys = Object.keys(registryIcons)

  // Collect all unique lucide icon names for individual imports
  const lucideIconNames = new Set<string>()
  for (const iconKey of iconKeys) {
    const iconMapping = registryIcons[iconKey]
    if (iconMapping?.lucide) {
      lucideIconNames.add(iconMapping.lucide)
    }
  }

  // Generate individual imports with aliases to avoid naming collisions (tree-shakeable)
  const lucideImports = Array.from(lucideIconNames)
    .sort((a, b) => a.localeCompare(b))
    .map((name) => `  ${name} as Lucide${name},`)
    .join('\n')

  const iconExports = iconKeys
    .map((iconKey) => {
      const iconMapping = registryIcons[iconKey]
      if (!iconMapping) {
        throw new Error(`Icon mapping not found for: ${iconKey}`)
      }

      const names = iconLibraries
        .map((library) => {
          const iconName = iconMapping[library.name]
          if (!iconName) {
            throw new Error(
              `Icon "${iconKey}" not found for library "${library.name}"`,
            )
          }
          return `  ${library.name}: "${iconName}",`
        })
        .join('\n')

      return `export const ${iconKey} = createIcon(Lucide${iconMapping.lucide}, {
${names}
});`
    })
    .join('\n\n')

  const content = `// AUTO-GENERATED - DO NOT EDIT
// Run "tsx scripts/registry-build.ts" to regenerate
"use client";

import {
${lucideImports}
} from "lucide-react";

import { createIcon } from "@/registry/icons/create-icon";

${iconExports}
`

  await writeGeneratedFile(targetPath, content)
  console.log(
    `  ✓ __generated__/icons.tsx (${lucideIconNames.size} lucide icons)`,
  )
}

async function buildInternalExamples() {
  // Generated under the create module (its sole consumer is routes/preview/$slug.tsx)
  // rather than registry/__generated__, so the registry tree never imports "up" into
  // @/modules/create/preview/group-examples — keeping registry/ items-only.
  const targetDir = path.join(process.cwd(), 'src/modules/create/__generated__')
  const targetPath = path.join(targetDir, 'examples.tsx')
  const uiDir = path.join(REGISTRY_DIR, 'ui')
  const groupExamplesDir = path.join(
    process.cwd(),
    'src/modules/create/preview/group-examples',
  )
  await fs.mkdir(targetDir, { recursive: true })

  const componentFolders = await fs.readdir(uiDir)
  const entries: string[] = []

  for (const folder of componentFolders.sort()) {
    const examplesPath = path.join(uiDir, folder, 'examples.tsx')
    if (existsSync(examplesPath)) {
      entries.push(
        `  "${folder}": () => import("@/registry/ui/${folder}/examples"),`,
      )
    }
  }

  const groupEntries: string[] = []
  if (existsSync(groupExamplesDir)) {
    const groupFiles = await fs.readdir(groupExamplesDir)
    for (const file of groupFiles.sort()) {
      if (!file.endsWith('.tsx')) continue
      const name = file.replace(/\.tsx$/, '')
      groupEntries.push(
        `  "${name}": () => import("@/modules/create/preview/group-examples/${name}"),`,
      )
    }
  }

  const content = `// AUTO-GENERATED - DO NOT EDIT
// Run "tsx scripts/registry-build.ts" to regenerate

export const ExamplesIndex: Record<
  string,
  () => Promise<{ default: React.ComponentType }>
> = {
${entries.join('\n')}
};

export const GroupExamplesIndex: Record<
  string,
  () => Promise<{ default: React.ComponentType }>
> = {
${groupEntries.join('\n')}
};
`

  await writeGeneratedFile(targetPath, content)
  console.log(
    `  ✓ create/__generated__/examples.tsx (${entries.length} components, ${groupEntries.length} groups)`,
  )
}

// ============================================================================
// Generated item manifest: registryUi / registryLib globbed from meta.ts
// ============================================================================

// PascalCase identifier for a scope+slug, e.g. ("ui","color-area") -> "UiColorArea".
function toItemIdent(scope: 'ui' | 'lib', slug: string): string {
  const pascal = slug
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')
  return `${scope.charAt(0).toUpperCase()}${scope.slice(1)}${pascal}`
}

// Emits __generated__/registry-items.ts — the single source of truth for
// registryUi/registryLib, globbed from on-disk {ui,lib}/*/meta.ts minus the
// ORPHAN_ALLOWLIST. Committed and load-bearing for the app: ui/registry.ts +
// lib/registry.ts re-export it. This script derives its own fresh item lists
// (loadRegisteredItems) rather than importing the manifest, so a stale manifest
// never blocks regenerating it.
async function buildRegistryItemsManifest() {
  const targetPath = path.join(GENERATED_DIR, 'registry-items.ts')
  const ui = await listRegistryFolders('ui')
  const lib = await listRegistryFolders('lib')

  const importLine = (scope: 'ui' | 'lib', slug: string) =>
    `import ${toItemIdent(scope, slug)} from "@/registry/${scope}/${slug}/meta";`
  const arrayBlock = (name: string, scope: 'ui' | 'lib', slugs: string[]) =>
    `export const ${name}: RegistryItem[] = [\n${slugs.map((s) => `\t${toItemIdent(scope, s)},`).join('\n')}\n];`

  // Sort value imports by module specifier (NOT identifier) to match oxfmt's
  // sortImports "value-internal" group — e.g. "ui/checkbox-group" sorts before
  // "ui/checkbox" ('-' < '/') — so the generated file passes `oxfmt --check` as-is
  // (writeGeneratedFile's inline format() does not re-sort imports). The type
  // import follows the value group with no blank line; the header comment is
  // detached by a blank line so oxfmt leaves it at the top.
  const valueImports = [
    ...lib.map((s) => ({
      spec: `@/registry/lib/${s}/meta`,
      line: importLine('lib', s),
    })),
    ...ui.map((s) => ({
      spec: `@/registry/ui/${s}/meta`,
      line: importLine('ui', s),
    })),
  ]
    .sort((a, b) => (a.spec < b.spec ? -1 : a.spec > b.spec ? 1 : 0))
    .map((v) => v.line)

  const content = `// AUTO-GENERATED - DO NOT EDIT
// Run "tsx scripts/registry-build.ts" to regenerate

${valueImports.join('\n')}

import type { RegistryItem } from "@/registry/types";

${arrayBlock('registryUi', 'ui', ui)}

${arrayBlock('registryLib', 'lib', lib)}
`

  await writeGeneratedFile(targetPath, content)
  console.log(
    `  ✓ __generated__/registry-items.ts (${ui.length} ui, ${lib.length} lib)`,
  )
}

// ============================================================================
// Build-time Guard: registry-items glob drift + integrity
// ============================================================================

/**
 * Folders that have a `meta.ts` on disk but are intentionally EXCLUDED from the
 * generated registry (work-in-progress, not shipped). This single Set is the
 * source of truth read by BOTH the glob that emits __generated__/registry-items.ts
 * AND the build-time guards — so emitter and guard can never disagree about the
 * registered set. Removing an entry makes that folder start shipping on the next
 * build:registry; adding a slug keeps a WIP item out.
 *
 *   ui/react-hook-form   WIP — name:"form"; meta points to a base.tsx that does
 *                         not exist yet.
 *   ui/tanstack-form     WIP — name:"form"; stub (index.tsx + meta only).
 *   lib/context          Real runtime dep (avatar/tabs/toggle-button) but not yet
 *                         a registered item.
 *
 * NOTE: react-hook-form and tanstack-form both declare name:"form"; they never
 * collide because both are excluded here (and bare ui/form has no meta.ts).
 */
const ORPHAN_ALLOWLIST = new Set<string>([
  'ui/react-hook-form',
  'ui/tanstack-form',
  'lib/context',
])

/**
 * Directories under `src/registry/<scope>` that have a `meta.ts` on disk, minus
 * the ORPHAN_ALLOWLIST, sorted by slug. The ONE place the glob + exclusion lives
 * — both the manifest emitter and the item loader call it, so they can never
 * disagree about what is registered.
 */
async function listRegistryFolders(scope: 'ui' | 'lib'): Promise<string[]> {
  const scopeDir = path.join(REGISTRY_DIR, scope)
  const dirEntries = await fs.readdir(scopeDir, { withFileTypes: true })
  const folders: string[] = []
  for (const entry of dirEntries) {
    if (!entry.isDirectory()) continue
    if (!existsSync(path.join(scopeDir, entry.name, 'meta.ts'))) continue
    if (ORPHAN_ALLOWLIST.has(`${scope}/${entry.name}`)) continue
    folders.push(entry.name)
  }
  return folders.sort()
}

/**
 * Loads the registered items for a scope by globbing on-disk `meta.ts` folders
 * — NOT from __generated__/registry-items.ts, which may still be stale on this
 * run when an item was just added or removed. Every build-time check and the
 * publishables build run against these fresh items, so a brand-new item folder
 * is processed in the same `pnpm build:registry` invocation that regenerates
 * the manifest. (A stale committed manifest is still caught in CI, where the
 * registry-drift job diffs the regenerated file against the commit.)
 */
async function loadRegisteredItems(
  scope: 'ui' | 'lib',
): Promise<RegistryItem[]> {
  const items: RegistryItem[] = []
  for (const slug of await listRegistryFolders(scope)) {
    const mod = (await import(`../src/registry/${scope}/${slug}/meta`)) as {
      default: RegistryItem
    }
    items.push(mod.default)
  }
  return items
}

/** Fails if an ORPHAN_ALLOWLIST entry no longer has a meta.ts on disk (rotted entry). */
function checkAllowlistStale(): string[] {
  const errors: string[] = []
  for (const key of ORPHAN_ALLOWLIST) {
    if (!existsSync(path.join(REGISTRY_DIR, key, 'meta.ts'))) {
      errors.push(
        `Stale ORPHAN_ALLOWLIST entry "${key}" — ${key}/meta.ts no longer exists. ` +
          `Remove it from ORPHAN_ALLOWLIST in scripts/registry-build.ts.`,
      )
    }
  }
  return errors
}

/** Non-fatal: warns when an excluded ui/* folder looks production-ready (has demos/examples). */
function checkAllowlistReadiness(): void {
  for (const key of ORPHAN_ALLOWLIST) {
    if (!key.startsWith('ui/')) continue
    const dir = path.join(REGISTRY_DIR, key)
    if (
      existsSync(path.join(dir, 'demos')) ||
      existsSync(path.join(dir, 'examples.tsx'))
    ) {
      console.warn(
        `  ⚠ ${key} is allowlisted (excluded from the registry) but has demos/examples — ` +
          `looks production-ready. Consider removing it from ORPHAN_ALLOWLIST so it ships.`,
      )
    }
  }
}

/**
 * Derived dep names whose target is NOT a registered item yet — a known packaging gap
 * (lib/context + the use-image-loading-status hook are unregistered). Skipped so the
 * drift check doesn't demand a dep `shadcn add` couldn't resolve. Keyed by DEP-NAME and
 * covers the hooks scope, so it is deliberately DISTINCT from ORPHAN_ALLOWLIST (folder-
 * path keyed, ui|lib only) — do not unify them. Drop an entry once its target is a
 * registered item, and the guard will then require consumers to declare it.
 */
const UNREGISTERED_DEP_ALLOWLIST = new Set([
  'context',
  'use-image-loading-status',
])

/**
 * Asserts each registered ui item DECLARES every registry dependency its shipped base
 * file(s) import. The shipped import graph is a SUBSET of the intended dependency
 * closure (composition/CSS-only deps are legitimately hand-added and not flagged), so
 * this catches only UNDER-declaration: a base file imports @/registry/X but meta omits "X".
 */
async function checkRegistryDepsDrift(
  registryUi: RegistryItem[],
  registryLib: RegistryItem[],
): Promise<string[]> {
  const registeredNames = new Set<string>(
    [...registryBase, ...registryUi, ...registryLib, ...registryHooks].map(
      (item) => item.name,
    ),
  )
  const errors: string[] = []

  for (const meta of registryUi) {
    const derived = deriveRegistryDeps({
      registryDir: REGISTRY_DIR,
      baseFiles: collectBaseFiles(meta),
    })
    const declared = new Set(meta.registryDependencies ?? [])

    for (const dep of derived) {
      if (declared.has(dep)) continue
      if (BUNDLED_INTO_INIT.has(dep)) continue
      if (UNREGISTERED_DEP_ALLOWLIST.has(dep)) continue
      if (registeredNames.has(dep)) {
        errors.push(
          `registryDependencies drift: "${meta.name}" base file imports "${dep}" but meta omits it. ` +
            `Add "${dep}" to registryDependencies in ui/${meta.name}/meta.ts.`,
        )
      } else {
        errors.push(
          `Unresolved @/registry import in "${meta.name}": derived dep "${dep}" is not a registered item, ` +
            `not bundled, and not in UNREGISTERED_DEP_ALLOWLIST. Register it or add it to the allowlist.`,
        )
      }
    }
  }
  return errors
}

/**
 * Asserts `meta.name` is globally unique across all REGISTERED items
 * (base + ui + lib + hooks). Unregistered/allowlisted items are not
 * checked here, so the two unregistered name:"form" folders don't collide.
 */
function checkUniqueRegisteredNames(
  registryUi: RegistryItem[],
  registryLib: RegistryItem[],
): string[] {
  const seen = new Map<string, string>() // name -> scope it was first seen in
  const errors: string[] = []
  const groups: Array<[string, RegistryItem[]]> = [
    ['base', registryBase as unknown as RegistryItem[]],
    ['ui', registryUi],
    ['lib', registryLib],
    ['hooks', registryHooks],
  ]

  for (const [scope, items] of groups) {
    for (const item of items) {
      const prev = seen.get(item.name)
      if (prev) {
        errors.push(
          `Duplicate registered item name "${item.name}" (in ${prev} and ${scope}).`,
        )
      } else {
        seen.set(item.name, scope)
      }
    }
  }

  return errors
}

/** Runs all build-time integrity checks; throws (aborting the build) on any failure. */
async function checkRegistryIntegrity(
  registryUi: RegistryItem[],
  registryLib: RegistryItem[],
) {
  checkAllowlistReadiness()
  const errors = [
    ...checkAllowlistStale(),
    ...(await checkRegistryDepsDrift(registryUi, registryLib)),
    ...checkUniqueRegisteredNames(registryUi, registryLib),
  ]

  if (errors.length > 0) {
    throw new Error(
      `Registry integrity check failed:\n  - ${errors.join('\n  - ')}`,
    )
  }
  console.log(
    '  ✓ registry integrity (allowlist fresh, deps declared, names unique)',
  )
}

// ============================================================================
// Post-publish guards: the emitted publishable set is a CONTRACT — every skip
// is explained, every declared dep resolves, every docs-advertised name ships.
// These catch the #477 bug class (a component silently missing from /r/{name},
// or a dep that falls through to shadcn's default registry) at build, not in
// production. See www/src/publisher/publish-smoke.test.ts for the compile guard.
// ============================================================================

/**
 * ui items allowed to NOT emit a publishable, name → reason. Mirrors
 * ORPHAN_ALLOWLIST: a skip that is NOT listed here fails the build, and a listed
 * name that DID publish is stale and also fails. Every registered ui item must
 * publish, so this starts EMPTY — an extractor/transform error is a build break,
 * never a silent skip (the original #477 failure).
 */
const SKIP_ALLOWLIST = new Map<string, string>()

/** Guard 1: fails on any unexplained publishable skip and on stale allowlist entries. */
function checkPublishableSkips(build: PublishablesBuild): string[] {
  const errors: string[] = []
  for (const { name, reason } of build.skipped) {
    if (SKIP_ALLOWLIST.has(name)) continue
    errors.push(
      `Publishable "${name}" was skipped: ${reason}\n` +
        `      Fix ui/${name} so it emits a publishable, or (only if intentional) add ` +
        `"${name}" to SKIP_ALLOWLIST in scripts/registry-build.ts with a reason.`,
    )
  }
  for (const name of SKIP_ALLOWLIST.keys()) {
    if (build.builtNames.has(name)) {
      errors.push(
        `Stale SKIP_ALLOWLIST entry "${name}" — it now publishes fine. ` +
          `Remove it from SKIP_ALLOWLIST in scripts/registry-build.ts.`,
      )
    }
  }
  return errors
}

/**
 * Registered lib/hook items referenced as `registryDependencies` that are NOT
 * independently servable at GET /r/{name} (only ui items become publishables).
 * shadcn add would fall through to its DEFAULT registry for these bare names —
 * the exact #477 failure. They are a KNOWN packaging gap: the fix is to ship the
 * file inline (as ui/tabs does with lib/context) or make lib/hooks servable.
 * name → reason. Keyed by DEP-NAME; distinct from ORPHAN_ALLOWLIST (folder-path)
 * and UNREGISTERED_DEP_ALLOWLIST (derived-import gaps). Drop an entry once the
 * dep is inlined or becomes a publishable, and the guard requires it to resolve.
 */
const KNOWN_UNSERVABLE_DEPS = new Map<string, string>([
  [
    'responsive',
    'lib/responsive — declared by ui/dialog, ui/menu; not inlined, not servable.',
  ],
  [
    'react-aria-token-field',
    'lib/react-aria-token-field — declared by ui/mention, ui/token-field; not inlined, not servable.',
  ],
  [
    'use-mobile',
    'hooks/use-mobile — declared by ui/sidebar; not inlined, not servable.',
  ],
])

/**
 * Guard 2: every publishable's `registryDependencies` must resolve to something
 * shadcn can fetch — another publishable, an init-bundled name, an absolute URL,
 * or an `@namespace/…` dep. A bare unknown name silently resolves against
 * shadcn's default registry (how text-field pulled shadcn's Input), so it fails.
 */
function checkDependencyClosure(
  registryUi: RegistryItem[],
  build: PublishablesBuild,
): string[] {
  const errors: string[] = []
  const referenced = new Set<string>()
  for (const meta of registryUi) {
    if (!build.builtNames.has(meta.name)) continue
    for (const dep of meta.registryDependencies ?? []) {
      if (build.builtNames.has(dep)) continue
      if (BUNDLED_INTO_INIT.has(dep)) continue
      if (dep.includes('://') || dep.startsWith('@')) continue
      if (KNOWN_UNSERVABLE_DEPS.has(dep)) {
        referenced.add(dep)
        continue
      }
      errors.push(
        `Dangling registryDependency: "${meta.name}" declares "${dep}", which is not a ` +
          `published component, not bundled into init, and not an absolute-URL / @namespace dep. ` +
          `shadcn add would resolve "${dep}" against its DEFAULT registry (the #477 failure). ` +
          `Publish "${dep}" (add ui/${dep}), fix the name in ui/${meta.name}/meta.ts, or — if it is a ` +
          `known lib/hook gap — add it to KNOWN_UNSERVABLE_DEPS in scripts/registry-build.ts.`,
      )
    }
  }
  for (const [dep, reason] of KNOWN_UNSERVABLE_DEPS) {
    if (build.builtNames.has(dep)) {
      errors.push(
        `Stale KNOWN_UNSERVABLE_DEPS entry "${dep}" — it now publishes and is servable. ` +
          `Remove it from KNOWN_UNSERVABLE_DEPS in scripts/registry-build.ts.`,
      )
    } else if (!referenced.has(dep)) {
      errors.push(
        `Stale KNOWN_UNSERVABLE_DEPS entry "${dep}" — no publishable declares it anymore (${reason}). ` +
          `Remove it from KNOWN_UNSERVABLE_DEPS in scripts/registry-build.ts.`,
      )
    }
  }
  return errors
}

/**
 * Non-component `@dotui/<name>` install targets docs may advertise, name →
 * reason. Starts EMPTY: every install name in the docs must resolve to a
 * publishable or a served route (see SERVED_ROUTE_NAMES). An entry here is a
 * standing excuse for a name that 404s, so add one only for a genuinely
 * unservable target, with a reason; a name that starts publishing makes it stale.
 */
const DOCS_INSTALL_NAME_ALLOWLIST = new Map<string, string>()

/**
 * Names that resolve to a real `/r/<name>` route but aren't components, so they
 * never appear in `builtNames`. `init` serves the `registry:base` item that
 * `shadcn init https://dotui.org/r/init` consumes (see routes/r/init.tsx). Docs
 * may advertise these; the guard treats them as served, not dangling.
 */
const SERVED_ROUTE_NAMES = new Set(['init'])

/** `@dotui/<name>` install targets, excluding import paths like `@dotui/registry/ui/x` (trailing slash). */
const DOCS_INSTALL_RE = /@dotui\/([a-z0-9][a-z0-9-]*)(?![/a-z0-9-])/g
/** `dotui.org/r/<name>` URLs, ignoring `{placeholder}` template segments. */
const DOCS_REGISTRY_URL_RE =
  /dotui\.org\/r\/([a-z0-9][a-z0-9-]*)(?![/a-z0-9-])/g

/**
 * Guard 3: every install name advertised in the docs must ship. Scans
 * content/docs for `@dotui/<name>` install targets and `dotui.org/r/<name>`
 * URLs; each must be a publishable, a served route (SERVED_ROUTE_NAMES), or an
 * allowlisted non-component. This is what would have caught `@dotui/text-field`
 * advertising a component that 404'd.
 */
async function checkDocsRegistryConsistency(
  build: PublishablesBuild,
): Promise<string[]> {
  const docsDir = path.join(process.cwd(), 'content/docs')
  const files = await listMdxFiles(docsDir)
  const errors: string[] = []
  const seen = new Set<string>()

  for (const file of files) {
    const source = await fs.readFile(file, 'utf8')
    const lines = source.split('\n')
    lines.forEach((line, i) => {
      for (const re of [DOCS_INSTALL_RE, DOCS_REGISTRY_URL_RE]) {
        re.lastIndex = 0
        let match: RegExpExecArray | null
        while ((match = re.exec(line)) !== null) {
          const name = match[1]
          if (!name) continue
          if (build.builtNames.has(name)) continue
          if (SERVED_ROUTE_NAMES.has(name)) continue
          if (DOCS_INSTALL_NAME_ALLOWLIST.has(name)) {
            seen.add(name)
            continue
          }
          errors.push(
            `${path.relative(process.cwd(), file)}:${i + 1} advertises "@dotui/${name}", ` +
              `which is not a published component. Publish "${name}" (add ui/${name}), fix the docs ` +
              `name, or — if it is a known non-component target — add it to DOCS_INSTALL_NAME_ALLOWLIST ` +
              `in scripts/registry-build.ts.`,
          )
        }
      }
    })
  }

  for (const [name, reason] of DOCS_INSTALL_NAME_ALLOWLIST) {
    if (build.builtNames.has(name)) {
      errors.push(
        `Stale DOCS_INSTALL_NAME_ALLOWLIST entry "${name}" — it now publishes as a component. ` +
          `Remove it from DOCS_INSTALL_NAME_ALLOWLIST in scripts/registry-build.ts.`,
      )
    } else if (!seen.has(name)) {
      errors.push(
        `Stale DOCS_INSTALL_NAME_ALLOWLIST entry "${name}" — no docs page advertises it anymore (${reason}). ` +
          `Remove it from DOCS_INSTALL_NAME_ALLOWLIST in scripts/registry-build.ts.`,
      )
    }
  }
  return errors
}

async function listMdxFiles(dir: string): Promise<string[]> {
  const out: string[] = []
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...(await listMdxFiles(full)))
    else if (entry.name.endsWith('.mdx')) out.push(full)
  }
  return out.sort()
}

/** Runs the post-publish guards (skips, dep closure, docs); throws on any failure. */
async function checkPublishableIntegrity(
  registryUi: RegistryItem[],
  build: PublishablesBuild,
) {
  const errors = [
    ...checkPublishableSkips(build),
    ...checkDependencyClosure(registryUi, build),
    ...(await checkDocsRegistryConsistency(build)),
  ]
  if (errors.length > 0) {
    throw new Error(
      `Publishable integrity check failed:\n  - ${errors.join('\n  - ')}`,
    )
  }
  console.log(
    '  ✓ publishable integrity (no unexplained skips, deps resolve, docs names ship)',
  )
}

// ============================================================================
// Main
// ============================================================================

interface PublishablesBuild {
  skipped: Array<{ name: string; reason: string }>
  /** Names of items that emitted a publishable — the exact set GET /r/{name} serves. */
  builtNames: Set<string>
}

async function buildShadcnPublishables(
  registryUi: RegistryItem[],
): Promise<PublishablesBuild> {
  const { written, skipped } = await buildPublishables({
    registryDir: REGISTRY_DIR,
    items: registryUi,
  })
  for (const filePath of written) {
    console.log(`  ✓ ${path.relative(REGISTRY_DIR, filePath)}`)
  }
  if (skipped.length > 0) {
    console.log(`\n  ${skipped.length} component(s) skipped:`)
    for (const { name, reason } of skipped) {
      console.log(`    - ${name}: ${reason}`)
    }
  }

  // A written path is `<name>.ts`, excluding the index/base-css helpers.
  const builtNames = new Set(
    written
      .filter((p) => p.endsWith('.ts'))
      .map((p) => path.basename(p, '.ts'))
      .filter((n) => n !== 'index' && n !== 'base-css'),
  )
  return { skipped, builtNames }
}

/** Generate base/colors.css from the default ColorConfig (both modes solved independently by the engine). */
async function generateBaseColorsCss() {
  const css = emitPrimitivesCss(resolveColorConfig(DEFAULT_COLOR_CONFIG))
  await fs.writeFile(path.join(REGISTRY_DIR, 'base', 'colors.css'), css, 'utf8')
}

const THEME_CSS_MARKER_START =
  '/* AUTO-GENERATED: semantic colors — do not edit. Run `pnpm build:registry`. */'
const THEME_CSS_MARKER_END = '/* END AUTO-GENERATED */'

/** Regenerate the semantic-color section of base/theme.css between its markers. */
async function generateThemeCssSemantics() {
  const themePath = path.join(REGISTRY_DIR, 'base', 'theme.css')
  const source = await fs.readFile(themePath, 'utf8')
  const start = source.indexOf(THEME_CSS_MARKER_START)
  const end = source.indexOf(THEME_CSS_MARKER_END)
  if (start === -1 || end === -1 || end < start) {
    throw new Error(
      'base/theme.css is missing its AUTO-GENERATED semantic-colors markers',
    )
  }
  const dark = emitDarkOverridesCss(DEFAULT_SEMANTICS)
  const generated = emitCss(DEFAULT_SEMANTICS) + (dark ? `\n${dark}` : '')
  const next = `${source.slice(0, start + THEME_CSS_MARKER_START.length)}\n${generated}${source.slice(end)}`
  await fs.writeFile(themePath, next, 'utf8')
}

async function main() {
  console.log('🔨 Building registry...\n')

  try {
    console.log('Generating base color css')
    await generateBaseColorsCss()
    await generateThemeCssSemantics()

    // Fresh item lists globbed from disk — never the (possibly stale) committed
    // manifest — so a just-added/removed item is handled in this same run.
    const registryUi = await loadRegisteredItems('ui')
    const registryLib = await loadRegisteredItems('lib')

    console.log('Checking registry integrity')
    await checkRegistryIntegrity(registryUi, registryLib)

    console.log('\nGenerating internal files')
    await ensureDir(GENERATED_DIR)
    await buildRegistryItemsManifest()
    await buildIconLibraryExports()
    await buildInternalDemos()
    await buildInternalIcons()
    await buildInternalExamples()

    console.log('\nGenerating shadcn publishables')
    const publishablesBuild = await buildShadcnPublishables(registryUi)

    console.log('\nChecking publishable integrity')
    await checkPublishableIntegrity(registryUi, publishablesBuild)

    console.log('\n✅ Registry built successfully!')
  } catch (error) {
    console.error('\n❌ Error building registry:', error)
    process.exit(1)
  }
}

main()
