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

import { IndentationText, Node, Project, QuoteKind, SyntaxKind } from "ts-morph"
import type { ImportDeclaration, SourceFile } from "ts-morph"

import { TV_CONFIG_PLACEHOLDER } from "../publish"
import { collectParamValueHooks, foldParamValues } from "./fold-param-values"
import type { ParamValueHook } from "./fold-param-values"

const TS_PLACEHOLDER_IDENT = "__TV_CONFIG__"

function toCamelCase(slug: string): string {
  return slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())
}

/* ----------------------- import rewriting ----------------------- */

export const REGISTRY_PATH_REWRITES: Array<[RegExp, string]> = [
  [/^@\/registry\/ui\//, "@/components/ui/"],
  [/^@\/registry\/hooks\//, "@/hooks/"],
  [/^@\/registry\/lib\//, "@/lib/"],
  [/^@\/registry\/icons\b/, "@/components/icons"],
]

export function rewriteImportPath(specifier: string): string | undefined {
  for (const [pattern, replacement] of REGISTRY_PATH_REWRITES) {
    if (pattern.test(specifier)) {
      return specifier.replace(pattern, replacement)
    }
  }
  return undefined
}

/**
 * Cross-component styles imports — `import { useStyles as x } from
 * '@/registry/ui/field/styles'` — can't path-rewrite: `styles.ts` isn't a
 * published file. The published component re-exports its styles function
 * under the source public name (`fieldStyles`, see the export-from rewrite in
 * `applyTransform`), so repoint the named import at that, keeping the local
 * binding. Returns the local bindings so the caller can resolve `local()`
 * hook calls to the bare function (same shape as the own-styles `useStyles()`
 * replacement), or null if the import isn't a styles subpath.
 */
function rewriteStylesSubpathImport(imp: ImportDeclaration): string[] | null {
  const match = imp
    .getModuleSpecifierValue()
    .match(/^@\/registry\/ui\/([a-z0-9-]+)\/styles$/)
  if (!match) return null
  const publicIdent = `${toCamelCase(match[1]!)}Styles`
  const locals: string[] = []
  for (const named of imp.getNamedImports()) {
    const local = named.getAliasNode()?.getText() ?? named.getName()
    named.setName(publicIdent)
    if (local !== publicIdent) named.setAlias(local)
    locals.push(local)
  }
  imp.setModuleSpecifier(`@/components/ui/${match[1]}`)
  return locals
}

/** `const s = useFieldStyles()` → `const s = useFieldStyles` — the imported
 *  binding IS the styles function; the source hook call resolved to it. */
function resolveStylesHookCalls(
  sourceFile: SourceFile,
  locals: ReadonlySet<string>,
): void {
  if (locals.size === 0) return
  for (const call of sourceFile.getDescendantsOfKind(
    SyntaxKind.CallExpression,
  )) {
    if (call.wasForgotten()) continue
    const callee = call.getExpression()
    if (!callee.isKind(SyntaxKind.Identifier)) continue
    const name = callee.getText()
    if (!locals.has(name)) continue
    if (call.getArguments().length !== 0) continue
    call.replaceWithText(name)
  }
}

/* ----------------------- slot hoisting ----------------------- */

/** `foo` or `foo: bar` — the binding-pattern entry for one slot. */
type SlotBinding = { slot: string; local: string }

/**
 * The published styles function is a plain `tv()` const, so slot functions
 * are the same for every render — each component's
 * `const { root } = useStyles()()` can become one module-level destructure
 * right after the `tv()` declaration. Removes every hoistable statement and
 * returns the union of their bindings (in first-seen order).
 *
 * A statement is hoisted only when it's safe and mechanical:
 *   - `useStyles()()` (own-styles hook), destructured into an object pattern;
 *   - an outer variant-props argument, if any, is an object literal and every
 *     use of the bound slots inside the enclosing function is a call whose
 *     argument is absent or an object literal — the props are moved into
 *     those calls (`root({ className })` → `root({ variant, className })`);
 *   - no local name collides with a module-level value or an earlier hoisted
 *     slot bound under a different name.
 * Anything else is left in place for the plain `useStyles()` → `<var>`
 * rewrite that follows.
 */
function hoistSlotDestructures(sourceFile: SourceFile): SlotBinding[] {
  const moduleNames = new Set<string>()
  for (const imp of sourceFile.getImportDeclarations()) {
    const def = imp.getDefaultImport()
    if (def) moduleNames.add(def.getText())
    const ns = imp.getNamespaceImport()
    if (ns) moduleNames.add(ns.getText())
    for (const n of imp.getNamedImports()) {
      moduleNames.add(n.getAliasNode()?.getText() ?? n.getName())
    }
  }
  for (const stmt of sourceFile.getStatements()) {
    if (stmt.isKind(SyntaxKind.VariableStatement)) {
      for (const decl of stmt.getDeclarations()) {
        for (const id of decl
          .getNameNode()
          .getDescendantsOfKind(SyntaxKind.Identifier)) {
          moduleNames.add(id.getText())
        }
        if (decl.getNameNode().isKind(SyntaxKind.Identifier)) {
          moduleNames.add(decl.getName())
        }
      }
    } else if (
      stmt.isKind(SyntaxKind.FunctionDeclaration) ||
      stmt.isKind(SyntaxKind.ClassDeclaration)
    ) {
      const name = stmt.getName()
      if (name) moduleNames.add(name)
    }
  }

  const hoisted = new Map<string, string>() // slot → local
  const order: SlotBinding[] = []

  for (const stmt of sourceFile.getDescendantsOfKind(
    SyntaxKind.VariableStatement,
  )) {
    if (stmt.wasForgotten()) continue
    if (stmt.getParent().isKind(SyntaxKind.SourceFile)) continue
    const decls = stmt.getDeclarations()
    if (decls.length !== 1) continue
    const decl = decls[0]!
    const pattern = decl.getNameNode()
    if (!pattern.isKind(SyntaxKind.ObjectBindingPattern)) continue
    const outer = decl.getInitializer()
    if (!outer?.isKind(SyntaxKind.CallExpression)) continue
    const inner = outer.getExpression()
    if (
      !inner.isKind(SyntaxKind.CallExpression) ||
      inner.getExpression().getText() !== "useStyles" ||
      inner.getArguments().length !== 0
    )
      continue

    const outerArgs = outer.getArguments()
    if (outerArgs.length > 1) continue
    const props = outerArgs[0]
    if (props && !props.isKind(SyntaxKind.ObjectLiteralExpression)) continue

    const bindings: SlotBinding[] = []
    let ok = true
    for (const el of pattern.getElements()) {
      if (el.getDotDotDotToken() || el.getInitializer()) {
        ok = false
        break
      }
      const local = el.getNameNode().getText()
      const slot = el.getPropertyNameNode()?.getText() ?? local
      const seen = hoisted.get(slot)
      if (seen ? seen !== local : moduleNames.has(local)) {
        ok = false
        break
      }
      bindings.push({ slot, local })
    }
    if (!ok) continue

    // Uses of the bound slots inside the enclosing function body.
    const scope = stmt.getFirstAncestor(
      (n) =>
        Node.isFunctionDeclaration(n) ||
        Node.isFunctionExpression(n) ||
        Node.isArrowFunction(n),
    )
    if (!scope) continue
    const locals = new Set(bindings.map((b) => b.local))
    const uses = scope
      .getDescendantsOfKind(SyntaxKind.Identifier)
      .filter(
        (id) =>
          locals.has(id.getText()) &&
          !id.getFirstAncestorByKind(SyntaxKind.ObjectBindingPattern),
      )
    const calls = uses.map((id) => {
      const parent = id.getParent()
      return parent.isKind(SyntaxKind.CallExpression) &&
        parent.getExpression() === id
        ? parent
        : undefined
    })
    if (props) {
      // Every use must be a call we can merge the props into.
      const mergeable = calls.every((call) => {
        if (!call) return false
        const args = call.getArguments()
        return (
          args.length === 0 ||
          (args.length === 1 &&
            args[0]!.isKind(SyntaxKind.ObjectLiteralExpression))
        )
      })
      if (!mergeable) continue
      const propsText = props
        .getProperties()
        .map((p) => p.getText())
        .join(", ")
      for (const call of calls) {
        const arg = call!.getArguments()[0]
        if (arg?.isKind(SyntaxKind.ObjectLiteralExpression)) {
          const rest = arg.getProperties().map((p) => p.getText())
          arg.replaceWithText(`{ ${[propsText, ...rest].join(", ")} }`)
        } else {
          call!.addArgument(`{ ${propsText} }`)
        }
      }
    }

    for (const b of bindings) {
      if (!hoisted.has(b.slot)) {
        hoisted.set(b.slot, b.local)
        order.push(b)
      }
    }
    stmt.remove()
  }

  return order
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
  /**
   * Param values to fold `createParamValue` hooks to (param → value). Omit to
   * leave the hooks in place.
   */
  paramSelection?: Record<string, string>
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

/** The `createParamValue` hooks a base file declares. */
export function paramValueHooksOf(baseTsxPath: string): ParamValueHook[] {
  const project = getProject()
  const sourceFile = project.addSourceFileAtPath(baseTsxPath)
  try {
    return collectParamValueHooks(sourceFile)
  } finally {
    project.removeSourceFile(sourceFile)
  }
}

export function transformBase({
  baseTsxPath,
  componentName,
  hasStylesConfig = true,
  paramSelection,
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
    if (paramSelection) {
      foldParamValues(
        sourceFile,
        collectParamValueHooks(sourceFile),
        paramSelection,
      )
    }

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
    const stylesLocals = new Set<string>()
    for (const imp of sourceFile.getImportDeclarations()) {
      const locals = rewriteStylesSubpathImport(imp)
      if (locals) {
        for (const local of locals) stylesLocals.add(local)
        continue
      }
      const next = rewriteImportPath(imp.getModuleSpecifierValue())
      if (next) imp.setModuleSpecifier(next)
    }
    resolveStylesHookCalls(sourceFile, stylesLocals)
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

  // 2a. Hoist `const { root } = useStyles()()` destructures to module level.
  const slotBindings = hoistSlotDestructures(sourceFile)

  // 2. Replace the remaining `useStyles()` call sites.
  for (const call of sourceFile.getDescendantsOfKind(
    SyntaxKind.CallExpression,
  )) {
    if (call.wasForgotten()) continue
    const callee = call.getExpression()
    if (
      !callee.isKind(SyntaxKind.Identifier) ||
      callee.getText() !== "useStyles"
    )
      continue
    if (call.getArguments().length !== 0) continue
    // Whether the parent is `useStyles()()` or not, replacing the inner
    // `useStyles()` with the variant identifier yields the right shape:
    // `<var>()` for the slotted case and `<var>` for the flat case.
    call.replaceWithText(variantIdent)
  }

  // 2b. Resolve `export { fieldStyles } from './styles'`: the styles module
  //     doesn't ship, so re-export the injected variant const under the same
  //     public name — cross-component imports rely on it staying stable.
  for (const exp of [...sourceFile.getExportDeclarations()]) {
    if (exp.getModuleSpecifierValue() !== "./styles") continue
    const specs = exp
      .getNamedExports()
      .map(
        (s) =>
          `${variantIdent} as ${s.getAliasNode()?.getText() ?? s.getName()}`,
      )
    exp.replaceWithText(`export { ${specs.join(", ")} };`)
  }

  // 3. Replace value-position references to `<oldStylesIdent>` (e.g. `buttonStyles`)
  //    in re-exports or local usages with the new variant ident. Skip identifiers
  //    inside import declarations (those imports get removed below anyway) and
  //    export aliases (the public name step 2b just pinned).
  for (const id of sourceFile.getDescendantsOfKind(SyntaxKind.Identifier)) {
    if (id.wasForgotten()) continue
    if (id.getText() !== oldStylesIdent) continue
    if (id.getFirstAncestorByKind(SyntaxKind.ImportDeclaration)) continue
    const parent = id.getParent()
    if (
      parent?.isKind(SyntaxKind.ExportSpecifier) &&
      parent.getAliasNode() === id
    )
      continue
    id.replaceWithText(variantIdent)
  }

  // 4. Remove imports from "./styles" (both value and type).
  for (const imp of [...sourceFile.getImportDeclarations()]) {
    if (imp.getModuleSpecifierValue() === "./styles") imp.remove()
  }

  // 5. Rewrite registry-internal import paths to consumer aliases, and
  //    resolve cross-component styles-hook calls to the imported function.
  const stylesLocals = new Set<string>()
  for (const imp of sourceFile.getImportDeclarations()) {
    const locals = rewriteStylesSubpathImport(imp)
    if (locals) {
      for (const local of locals) stylesLocals.add(local)
      continue
    }
    const next = rewriteImportPath(imp.getModuleSpecifierValue())
    if (next) imp.setModuleSpecifier(next)
  }
  resolveStylesHookCalls(sourceFile, stylesLocals)

  // 6. Ensure `tailwind-variants` import provides both `tv` and `VariantProps`.
  ensureTailwindVariantsImport(sourceFile)

  // 7. Insert the variant declaration after the last import. ts-morph drops a
  //    leading empty statement, so write the blank line explicitly.
  const lastImport = sourceFile.getImportDeclarations().at(-1)
  const insertIndex = lastImport ? lastImport.getChildIndex() + 1 : 0
  sourceFile.insertStatements(insertIndex, (writer) => {
    writer.newLine()
    writer.writeLine(`const ${variantIdent} = tv(${TS_PLACEHOLDER_IDENT});`)
    if (slotBindings.length > 0) {
      const names = slotBindings
        .map((b) => (b.slot === b.local ? b.slot : `${b.slot}: ${b.local}`))
        .join(", ")
      writer.writeLine(`const { ${names} } = ${variantIdent}();`)
    }
  })
}

function findNextVariantProps(
  sourceFile: SourceFile,
  oldStylesTypeIdent: string,
) {
  // `type X = VariantProps<...>` → TypeReference.
  for (const ref of sourceFile.getDescendantsOfKind(SyntaxKind.TypeReference)) {
    if (ref.wasForgotten()) continue
    if (ref.getTypeName().getText() !== "VariantProps") continue
    const first = ref.getTypeArguments()[0]
    if (!first || first.wasForgotten()) continue
    if (first.getText() === oldStylesTypeIdent) return first
  }
  // `interface X extends VariantProps<...>` → ExpressionWithTypeArguments.
  for (const ewta of sourceFile.getDescendantsOfKind(
    SyntaxKind.ExpressionWithTypeArguments,
  )) {
    if (ewta.wasForgotten()) continue
    if (ewta.getExpression().getText() !== "VariantProps") continue
    const first = ewta.getTypeArguments()[0]
    if (!first || first.wasForgotten()) continue
    if (first.getText() === oldStylesTypeIdent) return first
  }
  return undefined
}

function ensureTailwindVariantsImport(sourceFile: SourceFile): void {
  const existing = sourceFile.getImportDeclaration(
    (imp) => imp.getModuleSpecifierValue() === "tailwind-variants",
  )
  if (existing) {
    // Make sure both `tv` and `VariantProps` are present.
    ensureNamedImport(existing, "tv", false)
    ensureNamedImport(existing, "VariantProps", true)
    return
  }
  sourceFile.addImportDeclaration({
    moduleSpecifier: "tailwind-variants",
    namedImports: [{ name: "tv" }, { name: "VariantProps", isTypeOnly: true }],
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
