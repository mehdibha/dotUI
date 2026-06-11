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

import { Node, Project, SyntaxKind } from 'ts-morph'
import type { Expression, SourceFile } from 'ts-morph'

import type { StylesConfig } from '../types'

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

function exprToValue(expr: Expression, filePath: string): unknown {
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
  if (node.isKind(SyntaxKind.Identifier) && node.getText() === 'undefined')
    return undefined

  if (node.isKind(SyntaxKind.PrefixUnaryExpression)) {
    const text = node.getText()
    // Allow e.g. `-1`
    if (text.startsWith('-') || text.startsWith('+')) {
      const inner = node.getOperand()
      const innerVal = exprToValue(inner, filePath)
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
      return exprToValue(el, filePath)
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
        obj[propertyKey(nameNode, filePath)] = exprToValue(
          initializer,
          filePath,
        )
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

  const value = exprToValue(configArg, filePath)
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
