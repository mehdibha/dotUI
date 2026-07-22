/**
 * Extract the plain-JSON `StylesConfig` literal from a component's `styles.ts`.
 *
 * Each `styles.ts` is shaped like:
 *
 *   const { useStyles, styles } = createStyles(<metaIdent>, {
 *     base: { ... },
 *     density: { ... },
 *     params: { ... },
 *   });
 *
 * We locate the second argument of the `createStyles(meta, <config>)` call and
 * convert that object literal into a plain JS value: strings, arrays of
 * strings, nested objects. Type assertions (`as const`, `as Foo`) and parens
 * are unwrapped; spread elements / shorthand / computed keys are not
 * supported (no current `styles.ts` uses them — fail loudly if they appear).
 *
 * Build-time only. Imports ts-morph.
 */

import path from 'node:path'
import { tv } from 'tailwind-variants'
import { Node, Project, SyntaxKind } from 'ts-morph'
import type { CallExpression, Expression, SourceFile } from 'ts-morph'

import type { RegistryItem } from '@/registry/types'

import { flatten } from '../flatten'
import type { StylesConfig } from '../types'

/**
 * Threaded through `exprToValue` so runtime helpers used in `styles.ts` values
 * — module-level `const` string refs, local `tv()` factory calls, and
 * `<importedStyles>().<slot>()` compositions — resolve to the same class
 * strings the app renders (evaluated with the real `tv`), not just plain
 * literals.
 */
interface ExtractCtx {
  sourceFile: SourceFile
  filePath: string
}

/** `.../registry/ui/<name>/styles.ts` → `.../registry/ui`. */
function registryUiDirOf(stylesTsPath: string): string {
  return path.dirname(path.dirname(stylesTsPath))
}

/* ---------------------------- expression → value ---------------------------- */

function unwrap(expr: Expression): Expression {
  if (
    expr.isKind(SyntaxKind.AsExpression) ||
    expr.isKind(SyntaxKind.TypeAssertionExpression)
  ) {
    return unwrap(expr.getExpression())
  }
  if (expr.isKind(SyntaxKind.ParenthesizedExpression)) {
    return unwrap(expr.getExpression())
  }
  if (expr.isKind(SyntaxKind.SatisfiesExpression)) {
    return unwrap(expr.getExpression())
  }
  return expr
}

function exprToValue(expr: Expression, ctx: ExtractCtx): unknown {
  const { filePath } = ctx
  const node = unwrap(expr)

  if (
    node.isKind(SyntaxKind.StringLiteral) ||
    node.isKind(SyntaxKind.NoSubstitutionTemplateLiteral)
  ) {
    return node.getLiteralText()
  }
  if (node.isKind(SyntaxKind.NumericLiteral)) {
    return Number(node.getLiteralText())
  }
  if (node.isKind(SyntaxKind.TrueKeyword)) return true
  if (node.isKind(SyntaxKind.FalseKeyword)) return false
  if (node.isKind(SyntaxKind.NullKeyword)) return null
  if (node.isKind(SyntaxKind.Identifier)) {
    if (node.getText() === 'undefined') return undefined
    // Module-level `const x = <literal>` reference (e.g. input's `compactText`).
    return exprToValue(resolveLocalConst(node.getText(), ctx), ctx)
  }

  if (node.isKind(SyntaxKind.CallExpression)) {
    return evaluateCall(node, ctx)
  }

  if (node.isKind(SyntaxKind.PrefixUnaryExpression)) {
    const text = node.getText()
    // Allow e.g. `-1`
    if (text.startsWith('-') || text.startsWith('+')) {
      const inner = node.getOperand()
      const innerVal = exprToValue(inner, ctx)
      if (typeof innerVal === 'number')
        return text.startsWith('-') ? -innerVal : innerVal
    }
    throw new Error(
      `[publisher/extract] unsupported unary expression in ${filePath}: ${text}`,
    )
  }

  if (node.isKind(SyntaxKind.ArrayLiteralExpression)) {
    return node.getElements().map((el) => {
      if (el.isKind(SyntaxKind.SpreadElement)) {
        throw new Error(
          `[publisher/extract] spread elements are not supported (${filePath})`,
        )
      }
      return exprToValue(el, ctx)
    })
  }

  if (node.isKind(SyntaxKind.ObjectLiteralExpression)) {
    const obj: Record<string, unknown> = {}
    for (const property of node.getProperties()) {
      if (property.isKind(SyntaxKind.PropertyAssignment)) {
        const nameNode = property.getNameNode()
        const initializer = property.getInitializer()
        if (!initializer) {
          throw new Error(
            `[publisher/extract] property without initializer in ${filePath}`,
          )
        }
        obj[propertyKey(nameNode, filePath)] = exprToValue(initializer, ctx)
        continue
      }
      if (property.isKind(SyntaxKind.ShorthandPropertyAssignment)) {
        throw new Error(
          `[publisher/extract] shorthand property "${property.getName()}" not allowed in styles config (${filePath})`,
        )
      }
      if (property.isKind(SyntaxKind.SpreadAssignment)) {
        throw new Error(
          `[publisher/extract] spread assignment not allowed in styles config (${filePath})`,
        )
      }
      if (
        property.isKind(SyntaxKind.MethodDeclaration) ||
        property.isKind(SyntaxKind.GetAccessor) ||
        property.isKind(SyntaxKind.SetAccessor)
      ) {
        throw new Error(
          `[publisher/extract] method / accessor not allowed in styles config (${filePath})`,
        )
      }
    }
    return obj
  }

  throw new Error(
    `[publisher/extract] unsupported expression kind ${node.getKindName()} in ${filePath}: "${node.getText()}"`,
  )
}

function propertyKey(nameNode: Node, filePath: string): string {
  if (nameNode.isKind(SyntaxKind.Identifier)) return nameNode.getText()
  if (
    nameNode.isKind(SyntaxKind.StringLiteral) ||
    nameNode.isKind(SyntaxKind.NoSubstitutionTemplateLiteral)
  ) {
    return nameNode.asKindOrThrow(SyntaxKind.StringLiteral).getLiteralText()
  }
  if (nameNode.isKind(SyntaxKind.NumericLiteral)) return nameNode.getText()
  throw new Error(
    `[publisher/extract] unsupported property key ${nameNode.getKindName()} in ${filePath}`,
  )
}

/* ------------------------- runtime-helper resolution ------------------------- */

/** Initializer of a module-level `const <name> = …` in the current file. */
function resolveLocalConst(name: string, ctx: ExtractCtx): Expression {
  const decl = ctx.sourceFile.getVariableDeclaration(name)
  const init = decl?.getInitializer()
  if (!init) {
    throw new Error(
      `[publisher/extract] cannot resolve identifier "${name}" — no local const in ${ctx.filePath}`,
    )
  }
  return init
}

/**
 * Evaluate a call used as a class value. Two shapes appear in `styles.ts`:
 *   - `localFactory(args)` — a same-file `const f = tv({…})` invoked (input's
 *     `tokens({ h: 6 })`, `outlineField({ focus: 'group' })`).
 *   - `importedStyles().slot(args)` — another component's styles composed in
 *     (otp-field / slider / progress-bar's `fieldStyles().field(…)`).
 * Both run through the real `tv`, so the extracted string matches the app.
 */
function evaluateCall(call: CallExpression, ctx: ExtractCtx): string {
  const callee = call.getExpression()
  const args = call.getArguments().map((arg) => {
    if (!Node.isExpression(arg)) {
      throw new Error(
        `[publisher/extract] non-expression call argument in ${ctx.filePath}`,
      )
    }
    return exprToValue(arg, ctx)
  })

  // `importedStyles().slot(args)`
  if (callee.isKind(SyntaxKind.PropertyAccessExpression)) {
    const slotName = callee.getName()
    const factoryCall = callee.getExpression()
    const factoryId = factoryCall.isKind(SyntaxKind.CallExpression)
      ? factoryCall.getExpression()
      : undefined
    if (!factoryId?.isKind(SyntaxKind.Identifier)) {
      throw new Error(
        `[publisher/extract] unsupported call "${call.getText()}" in ${ctx.filePath}`,
      )
    }
    const stylesFn = resolveImportedStyles(factoryId.getText(), ctx)
    const slots = stylesFn() as Record<string, (...a: unknown[]) => string>
    const slotFn = slots[slotName]
    if (typeof slotFn !== 'function') {
      throw new Error(
        `[publisher/extract] "${factoryId.getText()}().${slotName}()" — no such slot (${ctx.filePath})`,
      )
    }
    return asClassString(slotFn(...args), call, ctx)
  }

  // `localFactory(args)`
  if (callee.isKind(SyntaxKind.Identifier)) {
    const factory = resolveLocalTvFactory(callee.getText(), ctx)
    return asClassString(factory(...args), call, ctx)
  }

  throw new Error(
    `[publisher/extract] unsupported call "${call.getText()}" in ${ctx.filePath}`,
  )
}

function asClassString(
  value: unknown,
  call: CallExpression,
  ctx: ExtractCtx,
): string {
  if (typeof value !== 'string') {
    throw new Error(
      `[publisher/extract] call "${call.getText()}" did not resolve to a class string (${ctx.filePath})`,
    )
  }
  return value
}

/** A same-file `const <name> = tv({…})` rebuilt with the real `tv`. */
function resolveLocalTvFactory(
  name: string,
  ctx: ExtractCtx,
): (...args: unknown[]) => unknown {
  const init = resolveLocalConst(name, ctx)
  if (
    !init.isKind(SyntaxKind.CallExpression) ||
    init.getExpression().getText() !== 'tv'
  ) {
    throw new Error(
      `[publisher/extract] "${name}" is not a tv() factory in ${ctx.filePath}`,
    )
  }
  const configArg = init.getArguments()[0]
  if (!configArg || !Node.isExpression(configArg)) {
    throw new Error(
      `[publisher/extract] tv() config missing for "${name}" in ${ctx.filePath}`,
    )
  }
  return tv(exprToValue(configArg, ctx) as Parameters<typeof tv>[0]) as (
    ...args: unknown[]
  ) => unknown
}

const importedStylesCache = new Map<string, () => unknown>()

/**
 * Rebuild another component's default `styles` (the value of `<x>Styles`) so
 * `<x>Styles().slot()` resolves to the same class the app renders. `styles.ts`
 * exports `compose('default', paramDefaults)`; we mirror that with `flatten`
 * (base ← default density ← param defaults) fed to the real `tv`.
 */
function resolveImportedStyles(name: string, ctx: ExtractCtx): () => unknown {
  const spec = importSpecifierFor(name, ctx)
  const match = spec.match(/^@\/registry\/ui\/([a-z0-9-]+)(?:\/styles)?$/)
  if (!match) {
    throw new Error(
      `[publisher/extract] "${name}" imported from unsupported module "${spec}" in ${ctx.filePath}`,
    )
  }
  const componentName = match[1]!
  const stylesTsPath = path.join(
    registryUiDirOf(ctx.filePath),
    componentName,
    'styles.ts',
  )
  const cached = importedStylesCache.get(stylesTsPath)
  if (cached) return cached

  const config = extractStylesConfig(stylesTsPath)
  if (config.params && Object.keys(config.params).length > 0) {
    // Composing a parameterized component's styles would need its meta param
    // defaults; no current source does, so fail loudly rather than emit a
    // silently-wrong default.
    throw new Error(
      `[publisher/extract] cannot compose "${name}" (${componentName} has params) in ${ctx.filePath}`,
    )
  }
  const layer = flatten({
    stylesConfig: config,
    meta: {
      name: componentName,
      type: 'registry:ui',
      params: {},
    } as RegistryItem,
    density: 'default',
    paramSelections: {},
  })
  const stylesFn = () => tv(layer as Parameters<typeof tv>[0])()
  importedStylesCache.set(stylesTsPath, stylesFn)
  return stylesFn
}

/** Module specifier of the import that binds `name` in the current file. */
function importSpecifierFor(name: string, ctx: ExtractCtx): string {
  for (const imp of ctx.sourceFile.getImportDeclarations()) {
    for (const named of imp.getNamedImports()) {
      const local = named.getAliasNode()?.getText() ?? named.getName()
      if (local === name) return imp.getModuleSpecifierValue()
    }
  }
  throw new Error(
    `[publisher/extract] no import found for "${name}" in ${ctx.filePath}`,
  )
}

/* ---------------------------- entry ---------------------------- */

/**
 * Find the `createStyles(meta, <config>)` call in `sourceFile` and return the
 * `<config>` object as plain JSON. Throws if not found or shape doesn't match.
 */
function extractFromSourceFile(sourceFile: SourceFile): StylesConfig {
  const filePath = sourceFile.getFilePath()

  const calls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression)
  const target = calls.find((call) => {
    const expr = call.getExpression()
    return (
      expr.isKind(SyntaxKind.Identifier) && expr.getText() === 'createStyles'
    )
  })

  if (!target) {
    throw new Error(
      `[publisher/extract] no createStyles(...) call found in ${filePath}`,
    )
  }

  const args = target.getArguments()
  if (args.length < 2) {
    throw new Error(
      `[publisher/extract] createStyles() missing config argument in ${filePath}`,
    )
  }

  const configArg = args[1]
  if (!configArg || !Node.isExpression(configArg)) {
    throw new Error(
      `[publisher/extract] createStyles() second argument is not an expression in ${filePath}`,
    )
  }

  const value = exprToValue(configArg, { sourceFile, filePath })
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new Error(
      `[publisher/extract] createStyles() config must be an object literal in ${filePath}`,
    )
  }

  return value as StylesConfig
}

let cachedProject: Project | undefined

function getProject(): Project {
  if (!cachedProject) {
    cachedProject = new Project({
      useInMemoryFileSystem: false,
      skipFileDependencyResolution: true,
      skipAddingFilesFromTsConfig: true,
      compilerOptions: {
        allowJs: false,
        noEmit: true,
      },
    })
  }
  return cachedProject
}

export function extractStylesConfig(stylesTsPath: string): StylesConfig {
  const project = getProject()
  const sourceFile = project.addSourceFileAtPath(stylesTsPath)
  try {
    return extractFromSourceFile(sourceFile)
  } finally {
    project.removeSourceFile(sourceFile)
  }
}
