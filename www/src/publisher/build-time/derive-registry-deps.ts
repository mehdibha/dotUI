/**
 * Derive a registry item's `registryDependencies` from the @/registry/{ui,lib,hooks}
 * imports in its SHIPPED base file(s). Build-time only — imports ts-morph.
 *
 * The dep name is the registered item's name, which equals the folder name for
 * every registered ui/lib item and `use-x` for hooks. `@/registry/ui/field/styles`
 * collapses to dep "field" (the registered item that ships styles).
 *
 * Used as a DRIFT GUARD in scripts/registry-build.ts: the shipped import graph is a
 * subset of the intended dependency closure (hand-written deps additionally cover
 * demo/composition usage and CSS-only deps like focus-styles), so this is the
 * oracle for "a base file imports something meta forgot to declare", not a
 * wholesale replacement.
 */

import path from 'node:path'
import { Project } from 'ts-morph'
import type { SourceFile } from 'ts-morph'

import type { RegistryItemFile } from '@/registry/types'

const SPEC_REWRITES: Array<[RegExp, (m: RegExpMatchArray) => string]> = [
  [/^@\/registry\/ui\/(.+)$/, (m) => firstSegment(m[1] ?? '')],
  [/^@\/registry\/lib\/(.+)$/, (m) => firstSegment(m[1] ?? '')],
  [/^@\/registry\/hooks\/(.+)$/, (m) => firstSegment(m[1] ?? '')],
]

function firstSegment(rest: string): string {
  return rest.split('/')[0] ?? ''
}

/** Map a module specifier to its dotui dep name, or undefined if it isn't a registry import. */
export function specifierToDepName(specifier: string): string | undefined {
  for (const [pattern, pick] of SPEC_REWRITES) {
    const m = specifier.match(pattern)
    if (m) return pick(m)
  }
  return undefined
}

let cachedProject: Project | undefined

function getProject(): Project {
  if (!cachedProject) {
    cachedProject = new Project({
      useInMemoryFileSystem: false,
      skipFileDependencyResolution: true,
      skipAddingFilesFromTsConfig: true,
      compilerOptions: { allowJs: false, noEmit: true, jsx: 4 /* Preserve */ },
    })
  }
  return cachedProject
}

function registryDepsInFile(sourceFile: SourceFile): string[] {
  const out: string[] = []
  for (const imp of sourceFile.getImportDeclarations()) {
    // Covers value AND type-only imports (e.g. `import type { DialogProps } from "@/registry/ui/dialog"`).
    const dep = specifierToDepName(imp.getModuleSpecifierValue())
    if (dep !== undefined) out.push(dep)
  }
  return out
}

export interface DeriveRegistryDepsInput {
  /** Absolute path to `www/src/registry`. */
  registryDir: string
  /** Shipped base files for one item (from collectBaseFiles). */
  baseFiles: RegistryItemFile[]
}

/**
 * Union the @/registry dep names across all of an item's shipped base files,
 * deduped, first-seen order preserved.
 */
export function deriveRegistryDeps({
  registryDir,
  baseFiles,
}: DeriveRegistryDepsInput): string[] {
  const project = getProject()
  const seen = new Set<string>()
  const deps: string[] = []

  for (const file of baseFiles) {
    const absPath = path.join(registryDir, file.path)
    const sourceFile = project.addSourceFileAtPath(absPath)
    try {
      for (const dep of registryDepsInFile(sourceFile)) {
        if (!seen.has(dep)) {
          seen.add(dep)
          deps.push(dep)
        }
      }
    } finally {
      project.removeSourceFile(sourceFile)
    }
  }

  return deps
}
