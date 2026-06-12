import fs from 'node:fs'
import path from 'node:path'
import { format } from 'oxfmt'
import ts from 'typescript'
import * as tae from 'typescript-api-extractor'

import type { TLink, TType } from '@/modules/references/types/type-ast'

import {
  ALWAYS_EXPAND_TYPES,
  REACT_ARIA_EVENT_ORDER,
  RESOLVABLE_TYPE_PATTERNS,
  SKIP_RESOLVE_TYPES,
} from './config'
import { extractRenderProps } from './render-props'
import {
  buildTypeAstFromString,
  type ConversionContext,
  createConversionContext,
  formatMemberName,
  parseSimpleType,
  typeToAst,
} from './type-to-ast'

/**
 * HTML element names that can be extended via React.ComponentProps<"element">
 */
const HTML_ELEMENTS = new Set([
  'div',
  'span',
  'p',
  'a',
  'button',
  'input',
  'textarea',
  'select',
  'form',
  'img',
  'video',
  'audio',
  'canvas',
  'svg',
  'table',
  'tr',
  'td',
  'th',
  'ul',
  'ol',
  'li',
  'nav',
  'header',
  'footer',
  'main',
  'section',
  'article',
  'aside',
  'figure',
  'figcaption',
  'label',
  'fieldset',
  'legend',
  'dialog',
  'details',
  'summary',
  'menu',
  'menuitem',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
])

/**
 * Detect if a type extends an HTML element via React.ComponentProps<"element">
 * Returns the element name (e.g., "div", "button") or null
 */
function detectHTMLElementExtension(
  typeName: string,
  context: ParserContext,
): string | null {
  const { program } = context

  for (const sourceFile of program.getSourceFiles()) {
    if (
      sourceFile.isDeclarationFile &&
      !sourceFile.fileName.includes('@dotui')
    ) {
      continue
    }

    let foundElement: string | null = null

    sourceFile.forEachChild((node) => {
      if (foundElement) return

      if (ts.isInterfaceDeclaration(node) && node.name.text === typeName) {
        if (!hasExportModifier(node)) return

        if (node.heritageClauses) {
          for (const clause of node.heritageClauses) {
            if (clause.token !== ts.SyntaxKind.ExtendsKeyword) continue

            for (const typeExpr of clause.types) {
              const typeText = typeExpr.getText(sourceFile)

              // Match React.ComponentProps<"div"> or ComponentProps<"div">
              const componentPropsMatch = typeText.match(
                /(?:React\.)?ComponentProps(?:WithoutRef|WithRef)?<["'](\w+)["']>/,
              )
              if (componentPropsMatch) {
                const element = componentPropsMatch[1]?.toLowerCase()
                if (element && HTML_ELEMENTS.has(element)) {
                  foundElement = element
                  return
                }
              }

              // Match React.HTMLAttributes<HTMLDivElement> or HTMLAttributes<HTMLElement>
              const htmlAttrsMatch = typeText.match(
                /(?:React\.)?HTMLAttributes<HTML(\w*)Element>/,
              )
              if (htmlAttrsMatch) {
                const elementPart = htmlAttrsMatch[1] || ''
                if (elementPart === '') {
                  // Generic HTMLElement -> use "html" as marker
                  foundElement = 'html'
                  return
                }
                const element = elementPart.toLowerCase()
                if (HTML_ELEMENTS.has(element)) {
                  foundElement = element
                  return
                }
              }

              // Match HTMLProps<HTMLDivElement>
              const htmlPropsMatch = typeText.match(
                /HTMLProps<HTML(\w+)Element>/,
              )
              if (htmlPropsMatch) {
                const element = htmlPropsMatch[1]?.toLowerCase()
                if (element && HTML_ELEMENTS.has(element)) {
                  foundElement = element
                  return
                }
              }
            }
          }
        }
      }
    })

    if (foundElement) return foundElement
  }

  return null
}

/**
 * Check if a property is only declared in @types/react (standard DOM/ARIA
 * attributes). Props re-declared by react-aria or Base UI keep their own
 * declarations and are not matched.
 */
function isDeclaredOnlyInTypesReact(prop: ts.Symbol): boolean {
  const declarations = prop.getDeclarations()
  if (!declarations || declarations.length === 0) return false
  return declarations.every((decl) =>
    decl
      .getSourceFile()
      .fileName.replaceAll('\\', '/')
      .includes('node_modules/@types/react/'),
  )
}

/**
 * Check if a property is defined in the user's source files (not inherited from HTML)
 */
function isPropFromUserCode(prop: ts.Symbol): boolean {
  const declarations = prop.getDeclarations()
  if (!declarations || declarations.length === 0) return false

  // Check if any declaration is from user's source files
  return declarations.some((decl) => {
    const fileName = decl.getSourceFile().fileName
    // User's code is NOT in node_modules
    return !fileName.includes('node_modules')
  })
}

/**
 * Check if a node has the export modifier
 */
function hasExportModifier(node: ts.Node): boolean {
  const modifiers = ts.canHaveModifiers(node)
    ? ts.getModifiers(node)
    : undefined
  return modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false
}

/**
 * Get property name from a property signature or method signature
 */
function getMemberName(member: ts.TypeElement): string | undefined {
  if (ts.isPropertySignature(member) || ts.isMethodSignature(member)) {
    return member.name && ts.isIdentifier(member.name)
      ? member.name.text
      : undefined
  }
  return undefined
}

/**
 * Get the order of properties as they appear in the source declaration
 * Uses TypeScript's built-in AST (no ts-morph dependency)
 *
 * @param typeName - The name of the type to get property order for
 * @param program - The TypeScript program
 * @param checker - The TypeScript type checker
 * @param options - Optional settings
 * @param options.requireExport - If true, only matches exported types (default: true for root calls)
 * @param options.visited - Set of visited type names to prevent infinite recursion
 */
function getPropertyDeclarationOrder(
  typeName: string,
  program: ts.Program,
  checker: ts.TypeChecker,
  options: { requireExport?: boolean; visited?: Set<string> } = {},
): string[] {
  const { requireExport = true, visited = new Set<string>() } = options

  // Prevent circular references
  if (visited.has(typeName)) {
    return []
  }
  visited.add(typeName)

  const order: string[] = []

  for (const sourceFile of program.getSourceFiles()) {
    // Skip declaration files (except our own) when requiring export
    if (
      requireExport &&
      sourceFile.isDeclarationFile &&
      !sourceFile.fileName.includes('@dotui')
    ) {
      continue
    }

    let found = false

    ts.forEachChild(sourceFile, (node) => {
      if (found) return

      // Handle interface declarations
      if (ts.isInterfaceDeclaration(node) && node.name.text === typeName) {
        if (requireExport && !hasExportModifier(node)) return
        found = true

        // Get properties in declaration order
        for (const member of node.members) {
          const name = getMemberName(member)
          if (name) order.push(name)
        }

        // Get inherited properties from extends
        if (node.heritageClauses) {
          for (const clause of node.heritageClauses) {
            if (clause.token === ts.SyntaxKind.ExtendsKeyword) {
              for (const typeExpr of clause.types) {
                const exprType = checker.getTypeAtLocation(typeExpr)
                const symbol = exprType.getSymbol()
                if (symbol) {
                  const inheritedOrder = getPropertyDeclarationOrder(
                    symbol.getName(),
                    program,
                    checker,
                    {
                      requireExport: false,
                      visited,
                    },
                  )
                  for (const prop of inheritedOrder) {
                    if (!order.includes(prop)) {
                      order.push(prop)
                    }
                  }
                }
              }
            }
          }
        }
      }

      // Handle type alias declarations
      if (ts.isTypeAliasDeclaration(node) && node.name.text === typeName) {
        if (requireExport && !hasExportModifier(node)) return
        found = true

        const typeNode = node.type

        // Handle type literals: type Foo = { a: string; b: number }
        if (ts.isTypeLiteralNode(typeNode)) {
          for (const member of typeNode.members) {
            const name = getMemberName(member)
            if (name) order.push(name)
          }
        } else if (ts.isIntersectionTypeNode(typeNode)) {
          // Handle intersection types: type Foo = A & B
          for (const typeRef of typeNode.types) {
            const refType = checker.getTypeAtLocation(typeRef)
            const symbol = refType.getSymbol()
            if (symbol) {
              const refOrder = getPropertyDeclarationOrder(
                symbol.getName(),
                program,
                checker,
                {
                  requireExport: false,
                  visited,
                },
              )
              for (const prop of refOrder) {
                if (!order.includes(prop)) {
                  order.push(prop)
                }
              }
            }
          }
        }
      }
    })

    if (found) return order
  }

  return order
}

/**
 * Sort union members in a type string for deterministic output.
 * Only sorts simple union types (string literals, identifiers) to avoid breaking complex types.
 */
function sortUnionTypeString(typeStr: string): string {
  // Only sort if it looks like a simple union (no parentheses, arrows, or generics)
  if (/[()=><]/.test(typeStr)) return typeStr
  const parts = typeStr.split(/\s*\|\s*/)
  if (parts.length <= 1) return typeStr
  return parts.sort().join(' | ')
}

/**
 * Sort an object's keys based on a reference order array.
 * Props in the order array come first (in that order),
 * then remaining props follow alphabetically for deterministic output.
 * Event props are sorted according to REACT_ARIA_EVENT_ORDER for consistency.
 */
function sortByDeclarationOrder<T>(
  obj: Record<string, T>,
  order: string[],
  _originalOrder: string[],
): Record<string, T> {
  const sorted: Record<string, T> = {}
  const seen = new Set<string>()

  // First add props that are in the declaration order array (local props)
  for (const key of order) {
    if (key in obj) {
      sorted[key] = obj[key] as T
      seen.add(key)
    }
  }

  // Add React Aria events in their standard order
  for (const key of REACT_ARIA_EVENT_ORDER) {
    if (!seen.has(key) && key in obj) {
      sorted[key] = obj[key] as T
      seen.add(key)
    }
  }

  // Then add remaining props in alphabetical order for deterministic output
  const remainingKeys = Object.keys(obj)
    .filter((key) => !seen.has(key))
    .sort()
  for (const key of remainingKeys) {
    sorted[key] = obj[key] as T
    seen.add(key)
  }

  return sorted
}

export interface ParserContext {
  program: ts.Program
  checker: ts.TypeChecker
}

/**
 * Recursively collect all TLink nodes from an AST
 */
function collectLinksFromAst(ast: TType | null | undefined): TLink[] {
  if (!ast) return []

  const links: TLink[] = []

  function traverse(node: TType): void {
    if (node.type === 'link') {
      links.push(node as TLink)
      return
    }

    // Traverse nested types based on type kind
    switch (node.type) {
      case 'union':
        ;(node as { elements: TType[] }).elements.forEach(traverse)
        break
      case 'intersection':
        ;(node as { types: TType[] }).types.forEach(traverse)
        break
      case 'function':
        ;(node as { parameters: TType[]; return: TType }).parameters.forEach(
          traverse,
        )
        traverse((node as { parameters: TType[]; return: TType }).return)
        break
      case 'parameter':
        traverse((node as { value: TType }).value)
        break
      case 'application':
        traverse((node as { base: TType }).base)
        ;(node as { typeParameters: TType[] }).typeParameters.forEach(traverse)
        break
      case 'array':
        traverse((node as { elementType: TType }).elementType)
        break
      case 'tuple':
        ;(node as { elements: TType[] }).elements.forEach(traverse)
        break
      // Add more cases as needed
    }
  }

  traverse(ast)
  return links
}

/**
 * Check if a type name should be resolved
 */
function shouldResolveType(typeName: string): boolean {
  // Skip built-in types
  if (SKIP_RESOLVE_TYPES.has(typeName)) return false

  // Skip if it looks like a full path (already resolved elsewhere)
  if (typeName.includes('/')) return false

  // Resolve if it matches our patterns (like ButtonRenderProps)
  return RESOLVABLE_TYPE_PATTERNS.some((pattern) => pattern.test(typeName))
}

/**
 * Resolve a type by name and convert it to AST for the links registry
 * Only resolves types that match RESOLVABLE_TYPE_PATTERNS
 */
function resolveTypeByName(
  typeName: string,
  context: ParserContext,
  _astContext: ConversionContext,
): TType | null {
  // Check if we should resolve this type
  if (!shouldResolveType(typeName)) {
    return null
  }

  const { program, checker } = context

  // Search for the type in all source files (including declaration files)
  for (const sourceFile of program.getSourceFiles()) {
    let foundType: TType | null = null

    sourceFile.forEachChild((node) => {
      if (foundType) return // Already found

      if (
        (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) &&
        node.name.text === typeName
      ) {
        const symbol = checker.getSymbolAtLocation(node.name)
        if (!symbol) return

        const type = checker.getDeclaredTypeOfSymbol(symbol)
        const properties = checker.getPropertiesOfType(type)

        // Build an interface AST with properties (simplified, no recursion)
        const propsAst: Record<
          string,
          {
            type: 'property'
            name: string
            value: TType
            optional: boolean
            readonly: boolean
            description: string
          }
        > = {}

        for (const prop of [...properties].sort((a, b) =>
          formatMemberName(a.name).localeCompare(formatMemberName(b.name)),
        )) {
          const propName = formatMemberName(prop.name)
          const propType = checker.getTypeOfSymbolAtLocation(prop, node)
          // Use a simple type string instead of recursive AST to avoid explosion
          const typeString = checker.typeToString(propType)
          const docs = ts.displayPartsToString(
            prop.getDocumentationComment(checker),
          )
          const isOptional = (prop.flags & ts.SymbolFlags.Optional) !== 0

          // Create a simple type representation
          const simpleType = parseSimpleType(typeString)

          propsAst[propName] = {
            type: 'property',
            name: propName,
            value: simpleType,
            optional: isOptional,
            readonly: false,
            description: docs || '',
          }
        }

        foundType = {
          type: 'interface',
          name: typeName,
          properties: propsAst,
        } as TType
      }
    })

    if (foundType) return foundType
  }

  return null
}

interface FormattedProp {
  type: string
  detailedType?: string
  /** AST representation of the type for rich rendering */
  typeAst?: TType
  default?: string
  required?: boolean
  description?: string
}

const registryDir = path.resolve(process.cwd(), 'src/registry')

/**
 * Expand type aliases into their readable form
 * Handles types with or without | undefined suffix
 * e.g., ChildrenOrFunction<T> | undefined → ReactNode | (values: T) => ReactNode | undefined
 */
function expandTypeAliasInString(type: string): string {
  // Check if type ends with | undefined
  const hasUndefined = type.endsWith(' | undefined')
  const baseType = hasUndefined ? type.slice(0, -' | undefined'.length) : type
  const suffix = hasUndefined ? ' | undefined' : ''

  // ChildrenOrFunction<T> → ReactNode | (values: T) => ReactNode
  const childrenMatch = baseType.match(/^ChildrenOrFunction<(.+)>$/)
  if (childrenMatch) {
    return `ReactNode | (values: ${childrenMatch[1]}) => ReactNode${suffix}`
  }

  // ClassNameOrFunction<T> → string | (values: T) => string
  const classNameMatch = baseType.match(/^ClassNameOrFunction<(.+)>$/)
  if (classNameMatch) {
    return `string | (values: ${classNameMatch[1]}) => string${suffix}`
  }

  // StyleOrFunction<T> → CSSProperties | (values: T) => CSSProperties
  const styleMatch = baseType.match(/^StyleOrFunction<(.+)>$/)
  if (styleMatch) {
    return `CSSProperties | (values: ${styleMatch[1]}) => CSSProperties${suffix}`
  }

  return type
}

function kebabToPascal(str: string): string {
  return str
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

// Get component group names from the registry directory
const componentGroupNames = fs.existsSync(path.join(registryDir, 'ui'))
  ? fs
      .readdirSync(path.join(registryDir, 'ui'), { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => kebabToPascal(dirent.name))
      .sort((a, b) => b.length - a.length)
  : []

export async function formatComponentData(
  exportNode: tae.ExportNode,
  context: ParserContext,
) {
  const description = exportNode.documentation?.description?.replace(
    /\n\nDocumentation: .*$/ms,
    '',
  )

  // Detect if this type extends an HTML element
  const extendsElement = detectHTMLElementExtension(exportNode.name, context)

  // Create AST conversion context for type links
  const astContext = createConversionContext(context.checker, 4)

  // Get all properties using TypeScript's type checker (includes inherited props)
  // If extending HTML element, filter out inherited HTML props
  const props = await getPropsWithTypeChecker(
    exportNode.name,
    context,
    astContext,
    extendsElement,
  )

  // Extract the styling-state table (RAC render props or Base UI data attrs)
  const states = extractRenderProps(exportNode.name, context)
  const renderProps = states.props
  const hasRenderProps = Object.keys(renderProps).length > 0

  // Collect type links for the component (sorted for deterministic output)
  const linkKeys = Object.keys(astContext.links).sort()
  const typeLinks =
    linkKeys.length > 0
      ? Object.fromEntries(linkKeys.map((key) => [key, astContext.links[key]]))
      : undefined

  const raw = {
    name: exportNode.name,
    description,
    // Add extendsElement field if component extends an HTML element
    ...(extendsElement && { extendsElement }),
    props, // Keep natural TypeScript declaration order (like react-aria)
    // Add the styling-state table (only if non-empty); flag Base UI tables so
    // the docs can label the column "Data attribute" instead of "Render prop".
    ...(hasRenderProps && { renderProps }),
    ...(hasRenderProps &&
      states.kind === 'data-attribute' && {
        renderPropsKind: states.kind,
      }),
    // Add type links for popover navigation
    ...(typeLinks && { typeLinks }),
  } as Record<string, unknown>

  // Post-process type strings to align naming
  const componentGroup = extractComponentGroup(exportNode.name)
  const formatted = rewriteTypeStringsDeep(raw, componentGroup) as typeof raw
  formatted.name = exportNode.name

  return formatted
}

/**
 * Use TypeScript's type checker to get ALL properties including inherited ones
 * If extendsElement is provided, filters out props inherited from HTML elements
 */
async function getPropsWithTypeChecker(
  typeName: string,
  context: ParserContext,
  astContext: ConversionContext,
  extendsElement: string | null = null,
): Promise<Record<string, FormattedProp>> {
  const { program, checker } = context
  const result: Record<string, FormattedProp> = {}
  let hasClassNameMember = false

  // Get declaration order using TypeScript's AST (for local props)
  const declarationOrder = getPropertyDeclarationOrder(
    typeName,
    program,
    checker,
  )

  // Track original order from TypeScript's type checker (preserves inherited order)
  const originalOrder: string[] = []

  // Find the source file containing this type
  for (const sourceFile of program.getSourceFiles()) {
    if (
      sourceFile.isDeclarationFile &&
      !sourceFile.fileName.includes('@dotui')
    ) {
      continue
    }

    sourceFile.forEachChild((node) => {
      if (
        (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) &&
        node.name.text === typeName
      ) {
        // Only process exported interfaces to avoid duplicates with different orders
        const isExported = !!(
          ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export
        )
        if (!isExported) return

        const symbol = checker.getSymbolAtLocation(node.name)
        if (!symbol) return

        const type = checker.getDeclaredTypeOfSymbol(symbol)
        const properties = [...checker.getPropertiesOfType(type)].sort((a, b) =>
          a.name.localeCompare(b.name),
        )

        for (const prop of properties) {
          originalOrder.push(prop.name)
        }

        for (const prop of properties) {
          if (prop.name === 'className') hasClassNameMember = true

          // Skip ref
          if (prop.name === 'ref') continue

          // Skip well-known symbol members ([Symbol.iterator] is never a
          // documented component prop)
          if (prop.name.startsWith('__@')) continue

          // Standard DOM/ARIA attributes declared in @types/react are MDN
          // territory — without this, components extending element props via a
          // primitive (ComponentProps<typeof Text>, Base UI parts) flood the
          // table with every documented aria-* attribute
          if (isDeclaredOnlyInTypesReact(prop)) continue

          // If extending HTML element, skip props inherited from HTML (not defined in user code)
          if (extendsElement && !isPropFromUserCode(prop)) {
            continue
          }

          // Get JSDoc documentation
          const docs = ts.displayPartsToString(
            prop.getDocumentationComment(checker),
          )

          // Only include props with documentation (filters out DOM attributes)
          if (!docs) continue

          // Get the type of the property
          const propType = checker.getTypeOfSymbolAtLocation(prop, node)

          // Check if this type has an alias symbol - if so, preserve the alias name
          // This prevents types like HTMLAttributeAnchorTarget from being expanded
          let typeString: string
          if (propType.aliasSymbol) {
            // Use the alias name (e.g., "HTMLAttributeAnchorTarget")
            typeString = propType.aliasSymbol.getName()
            // Add type arguments if present (e.g., "Array<string>" instead of just "Array")
            const typeArgs = propType.aliasTypeArguments
            if (typeArgs && typeArgs.length > 0) {
              const argsStr = typeArgs
                .map((t) => checker.typeToString(t))
                .join(', ')
              typeString += `<${argsStr}>`
            }
          } else {
            // No alias, use typeToString with flags for cleaner output:
            // - NoTruncation: Don't truncate long types
            // - UseAliasDefinedOutsideCurrentScope: Preserve type aliases where possible
            typeString = checker.typeToString(
              propType,
              undefined,
              ts.TypeFormatFlags.NoTruncation |
                ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope,
            )
          }

          // Get default value from JSDoc @default tag
          const jsDocTags = prop.getJsDocTags(checker)
          const defaultTag = jsDocTags.find((tag) => tag.name === 'default')
          let defaultValue = defaultTag
            ? ts.displayPartsToString(defaultTag.text)
            : undefined

          // react-aria documents "@default 'react-aria-ComponentName'" on
          // className props — dotUI components set their own classes, so that
          // default doesn't apply here
          if (defaultValue?.startsWith("'react-aria-")) {
            defaultValue = undefined
          }

          // Check if optional
          const isOptional = (prop.flags & ts.SymbolFlags.Optional) !== 0

          // Clean up and expand type aliases
          const cleanedType = cleanTypeString(typeString)
          const fullType = sortUnionTypeString(
            expandTypeAliasInString(cleanedType),
          )

          // Remove | undefined first for optional props
          const shortType = sortUnionTypeString(
            isOptional ? removeUndefinedFromType(fullType) : fullType,
          )

          // Generate AST type for rich rendering
          // First, try to detect if the type string represents a simple type alias
          // (TypeScript's typeToString with UseAliasDefinedOutsideCurrentScope shows the alias name)
          let typeAst: TType | null = null

          // Check if this type should be expanded (e.g., ChildrenOrFunction)
          const aliasName = propType.aliasSymbol?.getName()
          const shouldExpand = aliasName && ALWAYS_EXPAND_TYPES.has(aliasName)

          if (shouldExpand) {
            // Force expansion using the expanded string
            typeAst = buildTypeAstFromString(shortType, astContext)
          }

          if (!typeAst) {
            const simpleAliasMatch = shortType.match(/^([A-Z][A-Za-z0-9]*)$/)
            if (simpleAliasMatch) {
              // Simple identifier (e.g., HTMLAttributeAnchorTarget, ReactNode)
              typeAst = {
                type: 'identifier',
                name: simpleAliasMatch[1],
              } as TType
            } else {
              // Not a simple alias - try to build from string or fall back to full type expansion
              typeAst =
                buildTypeAstFromString(shortType, astContext) ??
                typeToAst(propType, { ...astContext, currentDepth: 0 })
            }
          }

          // Scan the AST for link nodes and resolve referenced types
          if (typeAst) {
            const linkedTypes = collectLinksFromAst(typeAst)
            for (const link of linkedTypes) {
              // Skip if already resolved
              if (astContext.links[link.id]) continue

              // Try to resolve the type by name
              const resolvedType = resolveTypeByName(
                link.name,
                context,
                astContext,
              )
              if (resolvedType) {
                astContext.links[link.id] = resolvedType
              }
            }
          }

          result[prop.name] = {
            type: shortType,
            detailedType: shortType !== fullType ? fullType : undefined,
            typeAst: typeAst || undefined,
            description: docs,
            default: defaultValue,
            required: !isOptional || undefined,
          }

          // Remove undefined values
          const currentProp = result[prop.name]
          if (currentProp) {
            ;(Object.keys(currentProp) as Array<keyof FormattedProp>).forEach(
              (key) => {
                if (currentProp[key] === undefined) {
                  delete currentProp[key]
                }
              },
            )
          }
        }
      }
    })
  }

  // Components that structurally accept className keep a documented row even
  // when it only comes from element attributes (plain-HTML wrappers and
  // Base UI-based components document className, nothing else inherited)
  if (hasClassNameMember && !result.className) {
    result.className = {
      type: 'string',
      typeAst: { type: 'string' } as TType,
      description:
        'The CSS [className](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) for the element.',
    }
  }

  // Format detailedTypes with Prettier for better readability
  for (const propName of Object.keys(result)) {
    const prop = result[propName]
    if (prop?.detailedType) {
      prop.detailedType = await formatTypeWithOxfmt(prop.detailedType)
    }
  }

  // Sort props by declaration order (matches react-aria/s2-docs behavior)
  // Local props come first (in ts-morph declaration order), then React Aria events
  // in their standard order, then remaining props
  return sortByDeclarationOrder(result, declarationOrder, originalOrder)
}

/**
 * Clean up type string by removing namespace prefixes
 * TypeScript flags handle most formatting, this just cleans up namespaces
 */
function cleanTypeString(typeStr: string): string {
  return typeStr
    .replace(/React\./g, '') // Remove React. prefix
    .replace(/import\([^)]+\)\./g, '') // Remove import(...). prefixes
}

/**
 * Remove | undefined from union types (for short type display)
 */
function removeUndefinedFromType(typeStr: string): string {
  // Handle "Type | undefined" at the end
  let result = typeStr.replace(/\s*\|\s*undefined\s*$/, '')

  // Handle "undefined | Type" at the start
  result = result.replace(/^undefined\s*\|\s*/, '')

  // Handle "Type | undefined | OtherType" in the middle
  result = result.replace(/\s*\|\s*undefined\s*\|/g, ' |')

  return result.trim()
}

/**
 * Check if an export is a public Props type
 */
export function isPublicPropsType(exportNode: tae.ExportNode): boolean {
  const name = exportNode.name

  if (!name.endsWith('Props')) {
    return false
  }

  if (name.includes('Internal') || name.startsWith('_')) {
    return false
  }

  if (
    exportNode.documentation?.hasTag('ignore') ||
    exportNode.documentation?.hasTag('internal')
  ) {
    return false
  }

  const type = exportNode.type
  return (
    type instanceof tae.ObjectNode ||
    type instanceof tae.IntersectionNode ||
    type instanceof tae.ComponentNode
  )
}

/**
 * Format a type string with Oxfmt for better readability.
 * Long union types will be split across multiple lines.
 */
async function formatTypeWithOxfmt(type: string): Promise<string> {
  try {
    const { code } = await format('type.ts', `type _ = ${type}`, {
      singleQuote: true,
      semi: false,
      printWidth: 60,
    })

    const lines = code.trimEnd().split('\n')
    if (lines.length === 1) {
      // oxlint-disable-next-line typescript/no-non-null-assertion -- length check guarantees existence
      return lines[0]!.replace(/^type _ = /, '')
    }

    // Multi-line: skip first line (`type _ =`) and de-indent
    const codeLines = lines.slice(1)
    const nonEmptyLines = codeLines.filter((l) => l.trim() !== '')
    if (nonEmptyLines.length > 0) {
      const minIndent = Math.min(
        ...nonEmptyLines.map((l) => l.match(/^\s*/)?.[0].length ?? 0),
      )
      if (Number.isFinite(minIndent) && minIndent > 0) {
        return codeLines.map((l) => l.substring(minIndent)).join('\n')
      }
    }
    return codeLines.join('\n')
  } catch {
    return type
  }
}

function extractComponentGroup(componentExportName: string): string {
  const baseName = componentExportName.replace(/Props$/, '')

  const directMatch = componentGroupNames.find((name) =>
    baseName.startsWith(name),
  )

  if (directMatch) {
    return directMatch
  }

  const match = baseName.match(/^[A-Z][a-z0-9]*/)
  return match ? match[0] : baseName
}

/**
 * Rewrite type strings for consistent naming
 * - Replaces internal naming conventions (.RootInternal → .Root)
 * - Formats component type references (ButtonProps → Button.Props)
 */
function rewriteTypeValue(value: string, componentGroup: string): string {
  let result = value

  // Clean up internal naming
  result = result.replaceAll('.RootInternal', '.Root')

  // Format component type references (e.g., ButtonProps → Button.Props)
  if (componentGroup) {
    const escaped = componentGroup.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    result = result.replace(
      new RegExp(`\\b${escaped}(Props|State)\\b`, 'g'),
      `${componentGroup}.$1`,
    )
  }

  return result
}

function rewriteTypeStringsDeep(
  node: unknown,
  componentGroup: string,
): unknown {
  if (node == null) {
    return node
  }

  if (typeof node === 'string') {
    return rewriteTypeValue(node, componentGroup)
  }

  if (Array.isArray(node)) {
    return node.map((item) => rewriteTypeStringsDeep(item, componentGroup))
  }

  if (typeof node === 'object') {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(node)) {
      result[key] = rewriteTypeStringsDeep(value, componentGroup)
    }
    return result
  }

  return node
}
