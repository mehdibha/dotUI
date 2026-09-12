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
 *   import { tv, type VariantProps } from "tailwind-variants"; // tv added
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
import type { ImportDeclaration, ImportSpecifier, SourceFile } from "ts-morph"

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
type StylesImport = {
  named: ImportSpecifier
  local: string
  publicIdent: string
}

function rewriteStylesSubpathImport(
  imp: ImportDeclaration,
): StylesImport[] | null {
  const match = imp
    .getModuleSpecifierValue()
    .match(/^@\/registry\/ui\/([a-z0-9-]+)\/styles$/)
  if (!match) return null
  const publicIdent = `${toCamelCase(match[1]!)}Styles`
  const entries: StylesImport[] = []
  for (const named of imp.getNamedImports()) {
    const local = named.getAliasNode()?.getText() ?? named.getName()
    named.setName(publicIdent)
    if (local !== publicIdent) named.setAlias(local)
    entries.push({ named, local, publicIdent })
  }
  imp.setModuleSpecifier(`@/components/ui/${match[1]}`)
  return entries
}

/** Rename every value reference to `from` outside import declarations. */
function renameIdentifiers(
  sourceFile: SourceFile,
  from: string,
  to: string,
): void {
  for (const id of sourceFile.getDescendantsOfKind(SyntaxKind.Identifier)) {
    if (id.wasForgotten() || id.getText() !== from) continue
    if (id.getFirstAncestorByKind(SyntaxKind.ImportDeclaration)) continue
    if (isPropertyName(id)) continue
    id.replaceWithText(to)
  }
}

/** `x.name` / `{ name: v }` — the identifier names a property, not a binding. */
function isPropertyName(id: Node): boolean {
  const parent = id.getParent()
  if (!parent) return false
  return (
    (parent?.isKind(SyntaxKind.PropertyAccessExpression) &&
      parent.getNameNode() === id) ||
    (parent?.isKind(SyntaxKind.PropertyAssignment) &&
      parent.getNameNode() === id) ||
    (parent?.isKind(SyntaxKind.BindingElement) &&
      parent.getPropertyNameNode() === id)
  )
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

/* ------------------ slot hoisting & alias inlining ------------------ */

/** `foo` or `foo: bar` — the binding-pattern entry for one slot. */
type SlotBinding = { slot: string; local: string }

/** Names bound at module level: imports, consts, functions, classes. */
function collectModuleNames(sourceFile: SourceFile): Set<string> {
  const names = new Set<string>()
  for (const imp of sourceFile.getImportDeclarations()) {
    const def = imp.getDefaultImport()
    if (def) names.add(def.getText())
    const ns = imp.getNamespaceImport()
    if (ns) names.add(ns.getText())
    for (const n of imp.getNamedImports()) {
      names.add(n.getAliasNode()?.getText() ?? n.getName())
    }
  }
  for (const stmt of sourceFile.getStatements()) {
    if (stmt.isKind(SyntaxKind.VariableStatement)) {
      for (const decl of stmt.getDeclarations()) {
        for (const id of decl
          .getNameNode()
          .getDescendantsOfKind(SyntaxKind.Identifier)) {
          if (!isPropertyName(id)) names.add(id.getText())
        }
        if (decl.getNameNode().isKind(SyntaxKind.Identifier)) {
          names.add(decl.getName())
        }
      }
    } else if (
      stmt.isKind(SyntaxKind.FunctionDeclaration) ||
      stmt.isKind(SyntaxKind.ClassDeclaration)
    ) {
      const name = stmt.getName()
      if (name) names.add(name)
    }
  }
  return names
}

/**
 * The one module-level `const { … } = <var>()` destructure the published file
 * gets right after its `tv()` declaration. `claim` adds bindings, refusing any
 * whose local name collides with a module-level value, an earlier slot bound
 * under a different name, or another slot bound to the same name.
 */
interface SlotHoist {
  order: SlotBinding[]
  claim(bindings: SlotBinding[]): boolean
}

function createSlotHoist(moduleNames: ReadonlySet<string>): SlotHoist {
  const bySlot = new Map<string, string>()
  const byLocal = new Map<string, string>()
  const order: SlotBinding[] = []
  return {
    order,
    claim(bindings) {
      for (const { slot, local } of bindings) {
        const seen = bySlot.get(slot)
        if (seen !== undefined ? seen !== local : moduleNames.has(local))
          return false
        const owner = byLocal.get(local)
        if (owner !== undefined && owner !== slot) return false
      }
      for (const b of bindings) {
        if (bySlot.has(b.slot)) continue
        bySlot.set(b.slot, b.local)
        byLocal.set(b.local, b.slot)
        order.push(b)
      }
      return true
    },
  }
}

function enclosingFunction(node: Node): Node | undefined {
  return node.getFirstAncestor(
    (n) =>
      Node.isFunctionDeclaration(n) ||
      Node.isFunctionExpression(n) ||
      Node.isArrowFunction(n),
  )
}

/**
 * Value references to `name` inside `scope`, skipping anything under
 * `except`. `undefined` when the name is re-declared in the scope or used in a
 * shape we don't rewrite (shorthand property), i.e. inlining isn't safe.
 */
function localUses(
  scope: Node,
  name: string,
  except?: Node,
): Node[] | undefined {
  const uses: Node[] = []
  for (const id of scope.getDescendantsOfKind(SyntaxKind.Identifier)) {
    if (id.getText() !== name) continue
    if (except && id.getFirstAncestor((a) => a === except)) continue
    if (isPropertyName(id)) continue
    const parent = id.getParent()
    if (
      !parent ||
      parent.isKind(SyntaxKind.VariableDeclaration) ||
      parent.isKind(SyntaxKind.Parameter) ||
      parent.isKind(SyntaxKind.BindingElement) ||
      parent.isKind(SyntaxKind.FunctionDeclaration) ||
      parent.isKind(SyntaxKind.ShorthandPropertyAssignment)
    )
      return undefined
    uses.push(id)
  }
  return uses
}

/**
 * The published styles function is a plain `tv()` const, so slot functions
 * are the same for every render — each component's
 * `const { root } = useStyles()()` can become part of the one module-level
 * destructure. Removes every hoistable statement and claims its bindings.
 *
 * A statement is hoisted only when it's safe and mechanical:
 *   - `useStyles()()` (own-styles hook), destructured into an object pattern;
 *   - an outer variant-props argument, if any, is an object literal and every
 *     use of the bound slots inside the enclosing function is a call whose
 *     argument is absent or an object literal — the props are moved into
 *     those calls (`root({ className })` → `root({ variant, className })`);
 *   - the bindings pass `claim`.
 * Anything else is left in place for the plain `useStyles()` → `<var>`
 * rewrite that follows.
 */
function hoistSlotDestructures(sourceFile: SourceFile, hoist: SlotHoist): void {
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
    let plain = true
    for (const el of pattern.getElements()) {
      if (el.getDotDotDotToken() || el.getInitializer()) {
        plain = false
        break
      }
      const local = el.getNameNode().getText()
      bindings.push({
        slot: el.getPropertyNameNode()?.getText() ?? local,
        local,
      })
    }
    if (!plain) continue

    const scope = enclosingFunction(stmt)
    if (!scope) continue
    const calls: Node[] = []
    let mergeable = true
    for (const b of bindings) {
      const uses = localUses(scope, b.local, stmt)
      if (!uses) {
        mergeable = false
        break
      }
      for (const id of uses) {
        const parent = id.getParent()
        const call =
          parent?.isKind(SyntaxKind.CallExpression) &&
          parent.getExpression() === id
            ? parent
            : undefined
        if (!props) continue
        const args = call?.getArguments()
        if (
          !call ||
          !args ||
          (args.length === 1 &&
            !args[0]!.isKind(SyntaxKind.ObjectLiteralExpression)) ||
          args.length > 1
        ) {
          mergeable = false
          break
        }
        calls.push(call)
      }
      if (!mergeable) break
    }
    if (!mergeable || !hoist.claim(bindings)) continue

    if (props) {
      const propsText = props
        .getProperties()
        .map((p) => p.getText())
        .join(", ")
      for (const call of calls) {
        const arg = call
          .asKindOrThrow(SyntaxKind.CallExpression)
          .getArguments()[0]
        if (arg?.isKind(SyntaxKind.ObjectLiteralExpression)) {
          const rest = arg.getProperties().map((p) => p.getText())
          arg.replaceWithText(`{ ${[propsText, ...rest].join(", ")} }`)
        } else {
          call
            .asKindOrThrow(SyntaxKind.CallExpression)
            .addArgument(`{ ${propsText} }`)
        }
      }
    }
    stmt.remove()
  }
}

/**
 * Drop the local aliases the source hooks leave behind once resolved:
 *   `const styles = buttonVariants`        → uses become `buttonVariants`
 *   `const styles = otpFieldVariants()`    → `styles.root` joins the hoisted
 *                                            destructure as `root`
 *   `const fieldStyles = fieldStyles()`    → uses become `fieldStyles()`
 * `targets` are the resolved styles functions (own variant const + imported
 * public names). Only single-declaration statements inside a function whose
 * local is used in plain value position are inlined.
 */
function inlineStylesAliases(
  sourceFile: SourceFile,
  targets: ReadonlySet<string>,
  own?: { variantIdent: string; hoist: SlotHoist },
): void {
  for (const stmt of sourceFile.getDescendantsOfKind(
    SyntaxKind.VariableStatement,
  )) {
    if (stmt.wasForgotten()) continue
    if (stmt.getParent().isKind(SyntaxKind.SourceFile)) continue
    const decls = stmt.getDeclarations()
    if (decls.length !== 1) continue
    const decl = decls[0]!
    const nameNode = decl.getNameNode()
    if (!nameNode.isKind(SyntaxKind.Identifier)) continue
    const local = nameNode.getText()
    const init = decl.getInitializer()
    if (!init) continue

    let target: string
    let called: boolean
    if (init.isKind(SyntaxKind.Identifier)) {
      target = init.getText()
      called = false
    } else if (
      init.isKind(SyntaxKind.CallExpression) &&
      init.getExpression().isKind(SyntaxKind.Identifier) &&
      init.getArguments().length === 0
    ) {
      target = init.getExpression().getText()
      called = true
    } else continue
    if (!targets.has(target)) continue

    const scope = enclosingFunction(stmt)
    if (!scope) continue
    const uses = localUses(scope, local, stmt)
    if (!uses) continue

    // Own slotted styles: `styles.root(…)` → hoist `root`.
    if (called && own && target === own.variantIdent) {
      const accesses = uses.map((id) => {
        const parent = id.getParent()
        return parent?.isKind(SyntaxKind.PropertyAccessExpression) &&
          parent.getExpression() === id
          ? parent
          : undefined
      })
      if (accesses.every((a) => a !== undefined)) {
        const slots = [...new Set(accesses.map((a) => a!.getName()))]
        if (own.hoist.claim(slots.map((slot) => ({ slot, local: slot })))) {
          for (const a of accesses) a!.replaceWithText(a!.getName())
          stmt.remove()
          continue
        }
      }
    }

    const replacement = called ? `${target}()` : target
    stmt.remove()
    const remaining = localUses(scope, local)
    if (!remaining) continue
    for (const id of remaining) {
      if (!id.wasForgotten()) id.replaceWithText(replacement)
    }
  }
}

/**
 * Rewrite every registry import to its consumer alias. Cross-component styles
 * hooks resolve to the imported function (`useFieldStyles()` → the binding),
 * then drop their hook alias when the public name is free at module level
 * (`import { fieldStyles as useFieldStyles }` → `import { fieldStyles }`).
 * Returns the final local names of the imported styles functions.
 */
function rewriteImports(sourceFile: SourceFile): Set<string> {
  const moduleNames = collectModuleNames(sourceFile)
  const stylesImports: StylesImport[] = []
  for (const imp of sourceFile.getImportDeclarations()) {
    const entries = rewriteStylesSubpathImport(imp)
    if (entries) {
      stylesImports.push(...entries)
      continue
    }
    const next = rewriteImportPath(imp.getModuleSpecifierValue())
    if (next) imp.setModuleSpecifier(next)
  }
  resolveStylesHookCalls(sourceFile, new Set(stylesImports.map((e) => e.local)))
  const names = new Set<string>()
  for (const { named, local, publicIdent } of stylesImports) {
    if (local !== publicIdent && !moduleNames.has(publicIdent)) {
      named.removeAlias()
      renameIdentifiers(sourceFile, local, publicIdent)
      names.add(publicIdent)
    } else {
      names.add(local)
    }
  }
  return names
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
    inlineStylesAliases(sourceFile, rewriteImports(sourceFile))
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
  const hoist = createSlotHoist(collectModuleNames(sourceFile))
  hoistSlotDestructures(sourceFile, hoist)

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

  // 5. Rewrite registry-internal import paths to consumer aliases, resolve
  //    cross-component styles-hook calls to the imported function, then drop
  //    the local `const styles = …` aliases the hooks leave behind.
  const stylesLocals = rewriteImports(sourceFile)
  inlineStylesAliases(sourceFile, new Set([variantIdent, ...stylesLocals]), {
    variantIdent,
    hoist,
  })

  // 6. Ensure `tailwind-variants` import provides `tv`.
  ensureTailwindVariantsImport(sourceFile)

  // 7. Insert the variant declaration after the last import. ts-morph drops a
  //    leading empty statement, so write the blank line explicitly.
  const lastImport = sourceFile.getImportDeclarations().at(-1)
  const insertIndex = lastImport ? lastImport.getChildIndex() + 1 : 0
  sourceFile.insertStatements(insertIndex, (writer) => {
    writer.newLine()
    writer.writeLine(`const ${variantIdent} = tv(${TS_PLACEHOLDER_IDENT});`)
    if (hoist.order.length > 0) {
      const names = hoist.order
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

/** The injected `tv()` needs `tv`; whatever else the source imported from
 *  tailwind-variants (`VariantProps`, when used) is kept as authored. */
function ensureTailwindVariantsImport(sourceFile: SourceFile): void {
  const existing = sourceFile.getImportDeclaration(
    (imp) => imp.getModuleSpecifierValue() === "tailwind-variants",
  )
  if (existing) {
    ensureNamedImport(existing, "tv", false)
    return
  }
  sourceFile.addImportDeclaration({
    moduleSpecifier: "tailwind-variants",
    namedImports: [{ name: "tv" }],
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
