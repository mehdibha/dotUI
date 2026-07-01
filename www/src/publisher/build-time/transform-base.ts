/**
 * Transform a component's `base.tsx` into a `template` ready for the
 * request-time pipeline.
 *
 * Concretely, given input:
 *
 *   import { buttonStyles, useStyles } from "./styles";
 *   import type { ButtonStyles } from "./styles";
 *   type ButtonVariants = VariantProps<ButtonStyles>;
 *   ...
 *   const styles = useStyles();
 *
 * produces:
 *
 *   import { tv, type VariantProps } from "tailwind-variants";
 *   const buttonVariants = tv(__TV_CONFIG__);
 *   type ButtonVariants = VariantProps<typeof buttonVariants>;
 *   ...
 *   const styles = buttonVariants;
 *
 * Then swaps the `__TV_CONFIG__` identifier for `%%TV_CONFIG%%` (matching
 * `publish.TV_CONFIG_PLACEHOLDER`) so the resulting string is the request-time
 * template.
 *
 * Also rewrites registry-internal import paths
 *   `@/registry/ui/loader`   → `@/components/ui/loader`
 *   `@/registry/hooks/use-x` → `@/hooks/use-x`
 *   `@/registry/lib/utils`   → `@/lib/utils`
 * to match the shadcn project aliases consumers get from `registry:base`.
 *
 * Build-time only. Imports ts-morph.
 */

import { IndentationText, Node, Project, QuoteKind, SyntaxKind } from 'ts-morph'
import type { ImportDeclaration, SourceFile } from 'ts-morph'

// Import the placeholder from the import-free constants module, NOT from
// `../publish`: `publish.ts` pulls in `emit-stylex` → `tw-to-stylex` →
// `@/registry/theme` (a value import), and this file is reached by the docs
// codegen / Vite config graph, which can't resolve `@/registry` at config-load.
import { TV_CONFIG_PLACEHOLDER } from '../constants'

const TS_PLACEHOLDER_IDENT = '__TV_CONFIG__'

function toCamelCase(slug: string): string {
  return slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())
}

/* ----------------------- import rewriting ----------------------- */

export const REGISTRY_PATH_REWRITES: Array<[RegExp, string]> = [
  [/^@\/registry\/ui\//, '@/components/ui/'],
  [/^@\/registry\/hooks\//, '@/hooks/'],
  [/^@\/registry\/lib\//, '@/lib/'],
  [/^@\/registry\/icons\b/, '@/components/icons'],
]

export function rewriteImportPath(specifier: string): string | undefined {
  for (const [pattern, replacement] of REGISTRY_PATH_REWRITES) {
    if (pattern.test(specifier)) {
      return specifier.replace(pattern, replacement)
    }
  }
  return undefined
}

/* ----------------------- main transform ----------------------- */

export interface TransformBaseInput {
  /** Absolute path to `base.tsx` (or `base.<variant>.tsx`). */
  baseTsxPath: string
  /** Component meta name, e.g. `"button"`. Drives the variant identifier name. */
  componentName: string
  /**
   * When false, skip the `const <name>Variants = tv(__TV_CONFIG__);` injection
   * and the VariantProps tailwind-variants import. Use for components that
   * don't have a `styles.ts` (e.g. loader) — they're shipped verbatim with
   * only path rewrites applied.
   */
  hasStylesConfig?: boolean
}

export interface TransformBaseOutput {
  /** Source with `%%TV_CONFIG%%` placeholder where the resolved tv literal goes. */
  template: string
  /** The injected variant identifier, e.g. `"buttonVariants"`. */
  variantIdent: string
}

let cachedProject: Project | undefined

function getProject(): Project {
  if (!cachedProject) {
    cachedProject = new Project({
      useInMemoryFileSystem: false,
      skipFileDependencyResolution: true,
      skipAddingFilesFromTsConfig: true,
      manipulationSettings: {
        indentationText: IndentationText.Tab,
        quoteKind: QuoteKind.Double,
      },
      compilerOptions: {
        allowJs: false,
        noEmit: true,
        jsx: 4, // Preserve
      },
    })
  }
  return cachedProject
}

export function transformBase({
  baseTsxPath,
  componentName,
  hasStylesConfig = true,
}: TransformBaseInput): TransformBaseOutput {
  const variantIdent = `${toCamelCase(componentName)}Variants`
  const oldStylesIdent = `${toCamelCase(componentName)}Styles` // e.g. "buttonStyles"
  const oldStylesTypeIdent = `${capitalize(toCamelCase(componentName))}Styles` // e.g. "ButtonStyles"

  const project = getProject()
  const sourceFile = project.addSourceFileAtPath(baseTsxPath)

  try {
    applyTransform(sourceFile, {
      variantIdent,
      oldStylesIdent,
      oldStylesTypeIdent,
      hasStylesConfig,
    })

    // Replace the placeholder identifier with the runtime sentinel string.
    const transformed = sourceFile
      .getFullText()
      .replace(TS_PLACEHOLDER_IDENT, TV_CONFIG_PLACEHOLDER)
    return { template: transformed, variantIdent }
  } finally {
    project.removeSourceFile(sourceFile)
  }
}

function capitalize(s: string): string {
  const first = s[0]
  return first ? first.toUpperCase() + s.slice(1) : s
}

interface ApplyContext {
  variantIdent: string
  oldStylesIdent: string
  oldStylesTypeIdent: string
  hasStylesConfig: boolean
}

function applyTransform(sourceFile: SourceFile, ctx: ApplyContext): void {
  const { variantIdent, oldStylesIdent, oldStylesTypeIdent, hasStylesConfig } =
    ctx

  if (!hasStylesConfig) {
    // No `styles.ts` → just rewrite registry-internal import paths and bail.
    // Don't insert a `tv` variant; the component renders without one.
    for (const imp of sourceFile.getImportDeclarations()) {
      const next = rewriteImportPath(imp.getModuleSpecifierValue())
      if (next) imp.setModuleSpecifier(next)
    }
    return
  }

  // Each ts-morph structural edit can invalidate cached descendant snapshots,
  // so we re-query before each pass and order things from leafmost rewrites
  // (text-only) to coarsest (statement insertions / declaration removals).

  // 1. Replace `VariantProps<<XStyles>>` with `VariantProps<typeof <var>>`.
  //    Re-snapshot between replacements: each `replaceWithText` invalidates
  //    sibling nodes in the original snapshot.
  while (true) {
    const next = findNextVariantProps(sourceFile, oldStylesTypeIdent)
    if (!next) break
    next.replaceWithText(`typeof ${variantIdent}`)
  }

  // 2. Replace `useStyles()` call sites.
  for (const call of sourceFile.getDescendantsOfKind(
    SyntaxKind.CallExpression,
  )) {
    if (call.wasForgotten()) continue
    const callee = call.getExpression()
    if (
      !callee.isKind(SyntaxKind.Identifier) ||
      callee.getText() !== 'useStyles'
    )
      continue
    if (call.getArguments().length !== 0) continue
    // Whether the parent is `useStyles()()` or not, replacing the inner
    // `useStyles()` with the variant identifier yields the right shape:
    // `<var>()` for the slotted case and `<var>` for the flat case.
    call.replaceWithText(variantIdent)
  }

  // 3. Replace value-position references to `<oldStylesIdent>` (e.g. `buttonStyles`)
  //    in re-exports or local usages with the new variant ident. Skip identifiers
  //    inside import declarations (those imports get removed below anyway).
  for (const id of sourceFile.getDescendantsOfKind(SyntaxKind.Identifier)) {
    if (id.wasForgotten()) continue
    if (id.getText() !== oldStylesIdent) continue
    if (id.getFirstAncestorByKind(SyntaxKind.ImportDeclaration)) continue
    id.replaceWithText(variantIdent)
  }

  // 4. Remove imports from "./styles" (both value and type).
  for (const imp of [...sourceFile.getImportDeclarations()]) {
    if (imp.getModuleSpecifierValue() === './styles') imp.remove()
  }

  // 5. Rewrite registry-internal import paths to consumer aliases.
  for (const imp of sourceFile.getImportDeclarations()) {
    const next = rewriteImportPath(imp.getModuleSpecifierValue())
    if (next) imp.setModuleSpecifier(next)
  }

  // 6. Ensure `tailwind-variants` import provides both `tv` and `VariantProps`.
  ensureTailwindVariantsImport(sourceFile)

  // 7. Insert the variant declaration after the last import.
  const lastImport = sourceFile.getImportDeclarations().at(-1)
  const insertIndex = lastImport ? lastImport.getChildIndex() + 1 : 0
  sourceFile.insertStatements(insertIndex, [
    '',
    `const ${variantIdent} = tv(${TS_PLACEHOLDER_IDENT});`,
    '',
  ])
}

function findNextVariantProps(
  sourceFile: SourceFile,
  oldStylesTypeIdent: string,
) {
  // `type X = VariantProps<...>` → TypeReference.
  for (const ref of sourceFile.getDescendantsOfKind(SyntaxKind.TypeReference)) {
    if (ref.wasForgotten()) continue
    if (ref.getTypeName().getText() !== 'VariantProps') continue
    const first = ref.getTypeArguments()[0]
    if (!first || first.wasForgotten()) continue
    if (first.getText() === oldStylesTypeIdent) return first
  }
  // `interface X extends VariantProps<...>` → ExpressionWithTypeArguments.
  for (const ewta of sourceFile.getDescendantsOfKind(
    SyntaxKind.ExpressionWithTypeArguments,
  )) {
    if (ewta.wasForgotten()) continue
    if (ewta.getExpression().getText() !== 'VariantProps') continue
    const first = ewta.getTypeArguments()[0]
    if (!first || first.wasForgotten()) continue
    if (first.getText() === oldStylesTypeIdent) return first
  }
  return undefined
}

function ensureTailwindVariantsImport(sourceFile: SourceFile): void {
  const existing = sourceFile.getImportDeclaration(
    (imp) => imp.getModuleSpecifierValue() === 'tailwind-variants',
  )
  if (existing) {
    // Make sure both `tv` and `VariantProps` are present.
    ensureNamedImport(existing, 'tv', false)
    ensureNamedImport(existing, 'VariantProps', true)
    return
  }
  sourceFile.addImportDeclaration({
    moduleSpecifier: 'tailwind-variants',
    namedImports: [{ name: 'tv' }, { name: 'VariantProps', isTypeOnly: true }],
  })
}

function ensureNamedImport(
  imp: ImportDeclaration,
  name: string,
  isTypeOnly: boolean,
): void {
  const named = imp.getNamedImports()
  const hit = named.find((n) => n.getName() === name)
  if (hit) {
    // If both the import declaration and the named import are type-only we're fine.
    // If we need a value import (tv) but the declaration is `import type`, flip it.
    if (!isTypeOnly && imp.isTypeOnly()) {
      imp.setIsTypeOnly(false)
      // Mark the other names as type-only to preserve their semantics.
      for (const n of named) {
        if (n.getName() !== name) n.setIsTypeOnly(true)
      }
    }
    return
  }
  if (imp.isTypeOnly() && !isTypeOnly) {
    // Flip the declaration to value-imports; tag pre-existing names as type-only.
    imp.setIsTypeOnly(false)
    for (const n of named) n.setIsTypeOnly(true)
  }
  imp.addNamedImport({ name, isTypeOnly })
}

// Re-export for callers that want to know what placeholder shows up in the template.
export { TS_PLACEHOLDER_IDENT }
// Re-export the runtime placeholder string for convenience.
export { TV_CONFIG_PLACEHOLDER }

// Used by ts-morph's Node typeguards in some paths (kept for completeness).
export { Node }
