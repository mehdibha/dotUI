/**
 * Fold `createParamValue` hooks to one param selection.
 *
 * A base file reads a per-value expression through a hook:
 *
 *   const useMarker = createParamValue({
 *     componentName: "accordion",
 *     paramName: "marker",
 *     defaultValue: "chevron",
 *     values: { chevron: <ChevronDownIcon />, plus: <PlusIcon /> },
 *   })
 *   …
 *   const marker = useMarker()
 *
 * For the selection `{ marker: "plus" }` the call becomes `<PlusIcon />`, the
 * declaration goes, and so does every import nothing references any more
 * (`ChevronDownIcon`, `createParamValue`). One template is built per
 * selection; `selectPublishable` picks it at request time.
 *
 * Build-time only. Imports ts-morph.
 */

import { Node, SyntaxKind } from "ts-morph"
import type { CallExpression, CommentStatement, SourceFile } from "ts-morph"

export interface ParamValueHook {
  /** The hook's local name, e.g. `useMarker`. */
  hookName: string
  paramName: string
  /** Param value → source text of the expression it selects. */
  values: Record<string, string>
}

const FACTORY = "createParamValue"

function factoryCall(node: CallExpression): boolean {
  const callee = node.getExpression()
  return callee.isKind(SyntaxKind.Identifier) && callee.getText() === FACTORY
}

function propertyName(name: string, node: { getText(): string }): string {
  const text = node.getText()
  const literal = /^["'](.*)["']$/.exec(text)
  if (literal) return literal[1]!
  if (/^[A-Za-z_$][\w$]*$/.test(text)) return text
  throw new Error(`[publisher] ${FACTORY}: unsupported ${name} key ${text}`)
}

/** Every `const useX = createParamValue({…})` declaration in the file. */
export function collectParamValueHooks(
  sourceFile: SourceFile,
): ParamValueHook[] {
  const hooks: ParamValueHook[] = []
  for (const decl of sourceFile.getVariableDeclarations()) {
    const init = decl.getInitializer()
    if (!init?.isKind(SyntaxKind.CallExpression) || !factoryCall(init)) continue
    const config = init.getArguments()[0]
    if (!config?.isKind(SyntaxKind.ObjectLiteralExpression)) {
      throw new Error(
        `[publisher] ${FACTORY}: expected an object literal config for ${decl.getName()}`,
      )
    }
    let paramName: string | undefined
    const values: Record<string, string> = {}
    for (const prop of config.getProperties()) {
      if (!prop.isKind(SyntaxKind.PropertyAssignment)) continue
      const key = prop.getName()
      const value = prop.getInitializerOrThrow()
      if (key === "paramName") {
        if (!value.isKind(SyntaxKind.StringLiteral))
          throw new Error(
            `[publisher] ${FACTORY}: paramName must be a string literal`,
          )
        paramName = value.getLiteralText()
      } else if (key === "values") {
        if (!value.isKind(SyntaxKind.ObjectLiteralExpression))
          throw new Error(
            `[publisher] ${FACTORY}: values must be an object literal`,
          )
        for (const entry of value.getProperties()) {
          if (!entry.isKind(SyntaxKind.PropertyAssignment))
            throw new Error(
              `[publisher] ${FACTORY}: values entries must be plain properties`,
            )
          values[propertyName("values", entry.getNameNode())] = entry
            .getInitializerOrThrow()
            .getText()
        }
      }
    }
    if (!paramName)
      throw new Error(
        `[publisher] ${FACTORY}: ${decl.getName()} declares no paramName`,
      )
    hooks.push({ hookName: decl.getName(), paramName, values })
  }
  return hooks
}

/** Every combination of the hooks' values, in declaration order. */
export function paramSelections(
  hooks: readonly ParamValueHook[],
): Array<Record<string, string>> {
  return hooks.reduce<Array<Record<string, string>>>(
    (selections, hook) =>
      selections.flatMap((selection) =>
        Object.keys(hook.values).map((value) => ({
          ...selection,
          [hook.paramName]: value,
        })),
      ),
    [{}],
  )
}

/** `marker=plus&position=leading` — the key `publishableBySelection` uses. */
export function selectionKey(
  paramNames: readonly string[],
  selection: Record<string, string>,
): string {
  return paramNames.map((name) => `${name}=${selection[name]}`).join("&")
}

/** Rewrite the file for one selection: calls become the value's expression
 *  (inlined at the use when a `const` held it for one read), the hook
 *  declarations and their comments go, and imports left unreferenced go with
 *  them. */
export function foldParamValues(
  sourceFile: SourceFile,
  hooks: readonly ParamValueHook[],
  selection: Record<string, string>,
): void {
  for (const hook of hooks) {
    const value = selection[hook.paramName]
    const text = value === undefined ? undefined : hook.values[value]
    if (text === undefined)
      throw new Error(
        `[publisher] ${FACTORY}: no value "${value}" for ${hook.paramName}`,
      )
    // Each replacement invalidates the snapshot — re-query after every edit.
    while (true) {
      const call = sourceFile
        .getDescendantsOfKind(SyntaxKind.CallExpression)
        .find((c) => {
          const callee = c.getExpression()
          return (
            callee.isKind(SyntaxKind.Identifier) &&
            callee.getText() === hook.hookName
          )
        })
      if (!call) break
      inlineSingleUseConst(call.replaceWithText(text))
    }
    removeWithComments(sourceFile.getVariableDeclarationOrThrow(hook.hookName))
  }
  pruneUnusedImports(sourceFile)
}

/** Drop a declaration and, when it was its statement's only one, the line
 *  comments directly above it. */
function removeWithComments(decl: Node): void {
  const stmt = decl.getFirstAncestorByKind(SyntaxKind.VariableStatement)
  if (!stmt || stmt.getDeclarations().length !== 1) {
    decl.asKindOrThrow(SyntaxKind.VariableDeclaration).remove()
    return
  }
  const comments: CommentStatement[] = []
  let line = stmt.getStartLineNumber()
  for (
    let prev = stmt.getPreviousSibling();
    prev &&
    Node.isCommentStatement(prev) &&
    prev.getEndLineNumber() === line - 1;
    prev = prev.getPreviousSibling()
  ) {
    comments.push(prev)
    line = prev.getStartLineNumber()
  }
  stmt.remove()
  for (const comment of comments) comment.remove()
}

const INLINABLE = new Set([
  SyntaxKind.StringLiteral,
  SyntaxKind.NumericLiteral,
  SyntaxKind.JsxElement,
  SyntaxKind.JsxSelfClosingElement,
  SyntaxKind.JsxFragment,
])

/**
 * `const glyph = <ChevronRightIcon />` read once as `{children ?? glyph}` →
 * `{children ?? <ChevronRightIcon />}`. Only literal/JSX values in an
 * unannotated single-declaration `const`, read exactly once in the same block
 * and never re-declared there.
 */
function inlineSingleUseConst(value: Node): void {
  if (!INLINABLE.has(value.getKind())) return
  const decl = value.getParentIfKind(SyntaxKind.VariableDeclaration)
  if (!decl || decl.getTypeNode()) return
  const name = decl.getNameNode()
  if (!name.isKind(SyntaxKind.Identifier)) return
  const list = decl.getParentIfKind(SyntaxKind.VariableDeclarationList)
  const stmt = list?.getParentIfKind(SyntaxKind.VariableStatement)
  const block = stmt?.getParent()
  if (!list || !stmt || !block || list.getDeclarations().length !== 1) return
  if (stmt.getDeclarationKind() !== "const") return

  const uses: Node[] = []
  for (const id of block.getDescendantsOfKind(SyntaxKind.Identifier)) {
    if (id === name || id.getText() !== name.getText()) continue
    const parent = id.getParent()
    if (
      (Node.isPropertyAccessExpression(parent) &&
        parent.getNameNode() === id) ||
      (Node.isPropertyAssignment(parent) && parent.getNameNode() === id) ||
      (Node.isJsxAttribute(parent) && parent.getNameNode() === id)
    )
      continue
    if (
      Node.isVariableDeclaration(parent) ||
      Node.isParameterDeclaration(parent) ||
      Node.isBindingElement(parent) ||
      Node.isShorthandPropertyAssignment(parent)
    )
      return
    uses.push(id)
  }
  const [use] = uses
  if (!use || uses.length !== 1) return
  // A JSX value read as a child drops its braces: `{glyph}` → `<Icon />`.
  const container = use.getParent()
  const target =
    Node.isJsxExpression(container) &&
    !Node.isLiteralExpression(value) &&
    (Node.isJsxElement(container.getParent()) ||
      Node.isJsxFragment(container.getParent()))
      ? container
      : use
  target.replaceWithText(value.getText())
  stmt.remove()
}

function pruneUnusedImports(sourceFile: SourceFile): void {
  const used = new Set<string>()
  for (const id of sourceFile.getDescendantsOfKind(SyntaxKind.Identifier)) {
    if (id.getFirstAncestorByKind(SyntaxKind.ImportDeclaration)) continue
    used.add(id.getText())
  }
  for (const imp of [...sourceFile.getImportDeclarations()]) {
    const named = imp.getNamedImports()
    const defaultImport = imp.getDefaultImport()
    const namespaceImport = imp.getNamespaceImport()
    // Side-effect imports carry no bindings to prune.
    if (named.length === 0 && !defaultImport && !namespaceImport) continue
    for (const spec of [...named]) {
      const local = spec.getAliasNode()?.getText() ?? spec.getName()
      if (!used.has(local)) spec.remove()
    }
    if (defaultImport && !used.has(defaultImport.getText()))
      imp.removeDefaultImport()
    if (namespaceImport && !used.has(namespaceImport.getText()))
      imp.removeNamespaceImport()
    if (
      imp.getNamedImports().length === 0 &&
      !imp.getDefaultImport() &&
      !imp.getNamespaceImport()
    )
      imp.remove()
  }
}
