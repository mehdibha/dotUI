/**
 * Render props / styling-state extraction (state selectors + Tailwind variants).
 *
 * Two libraries expose stylable state in different shapes, so the table is
 * sourced two ways:
 *
 * - **React Aria Components** — resolves the render-props interface from the
 *   `className` prop (`ClassNameOrFunction<ButtonRenderProps>` →
 *   `ButtonRenderProps`) and reads the `@selector` JSDoc tags RAC maintains on
 *   it for its own docs. Selectors map to the variants registered by the
 *   installed tailwindcss-react-aria-components plugin.
 * - **Base UI** — its state object carries no selectors; the stylable surface
 *   is a sibling `*DataAttributes` enum (`DrawerPopupState` →
 *   `DrawerPopupDataAttributes`) whose members map a name to a `data-*`
 *   attribute with a JSDoc description. Base UI ships no Tailwind plugin, so
 *   each attribute maps to the native `data-*:` variant Tailwind v4 provides.
 */

import fs from 'node:fs'
import path from 'node:path'
import racPlugin from 'tailwindcss-react-aria-components'
import ts from 'typescript'

import { RENDER_PROPS_SOURCES } from './config'

export interface RenderPropInfo {
  selector?: string
  tailwind?: string
  description?: string
}

/**
 * Whether the states table documents React Aria render props or Base UI data
 * attributes — drives the column header in the docs.
 */
export type RenderPropsKind = 'render-prop' | 'data-attribute'

export interface RenderPropsResult {
  kind: RenderPropsKind
  props: Record<string, RenderPropInfo>
}

const EMPTY_RESULT: RenderPropsResult = { kind: 'render-prop', props: {} }

interface TypeCheckerContext {
  program: ts.Program
  checker: ts.TypeChecker
}

/**
 * Variant lookup harvested from the installed (patched) Tailwind plugin: the
 * plugin registers every variant through `addVariant`, so running its handler
 * with a stub yields the exact `data-*` attribute → variant table without
 * duplicating it here.
 */
let pluginVariants: Map<string, string> | undefined

function getPluginVariants(): Map<string, string> {
  if (pluginVariants) return pluginVariants

  const variants = new Map<string, string>()
  const addVariant = (name: string, selector: string | string[]) => {
    const selectors = Array.isArray(selector) ? selector : [selector]
    for (const value of selectors) {
      for (const match of value.matchAll(
        /\[data-([a-z-]+)(?:="([^"]+)")?\]/g,
      )) {
        const attribute = match[1]
        if (!attribute) continue
        const key =
          match[2] === undefined ? attribute : `${attribute}=${match[2]}`
        if (!variants.has(key)) variants.set(key, name)
      }
    }
  }

  const { handler } = racPlugin() as unknown as {
    handler: (api: { addVariant: typeof addVariant }) => void
  }
  handler({ addVariant })

  pluginVariants = variants
  return variants
}

/**
 * Values React Aria documents as placeholders rather than literal attribute
 * values (e.g. `[data-level="number"]`).
 */
const PLACEHOLDER_VALUES = new Set(['number', '...', '…'])

/**
 * Map a documented CSS selector to the Tailwind variant(s) that target it.
 * Attributes the plugin doesn't cover fall back to Tailwind's native data-*
 * variants; non-data selectors (e.g. `:not([aria-valuenow])`) have none.
 */
function tailwindForSelector(
  selector: string,
  variants: Map<string, string>,
): string | undefined {
  const match = selector.match(/^\[data-([a-z-]+)(?:="([^"]+)")?\]$/)
  const attribute = match?.[1]
  if (!attribute) return undefined

  const value = match[2]
  if (value === undefined) {
    return `${variants.get(attribute) ?? `data-${attribute}`}:`
  }

  const parts = value.split('|').map((part) => {
    const trimmed = part.trim()
    if (PLACEHOLDER_VALUES.has(trimmed)) return `data-[${attribute}=…]:`
    const variant = variants.get(`${attribute}=${trimmed}`)
    return `${variant ?? `data-[${attribute}=${trimmed}]`}:`
  })

  return [...new Set(parts)].join(' | ')
}

function hasExportModifier(node: ts.Node): boolean {
  const modifiers = ts.canHaveModifiers(node)
    ? ts.getModifiers(node)
    : undefined
  return modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false
}

interface DeclaredType {
  node: ts.InterfaceDeclaration | ts.TypeAliasDeclaration
  symbol: ts.Symbol
}

/**
 * Find an exported interface or type alias by name. With `sourceOnly`,
 * declaration files are skipped so the lookup only matches registry source
 * (overrides search everywhere, including react-aria-components types).
 */
function findExportedTypeDeclaration(
  typeName: string,
  context: TypeCheckerContext,
  { sourceOnly = false }: { sourceOnly?: boolean } = {},
): DeclaredType | undefined {
  const { program, checker } = context

  for (const sourceFile of program.getSourceFiles()) {
    if (
      sourceOnly &&
      sourceFile.isDeclarationFile &&
      !sourceFile.fileName.includes('@dotui')
    ) {
      continue
    }

    let found: DeclaredType | undefined

    sourceFile.forEachChild((node) => {
      if (found) return
      if (
        (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node)) &&
        node.name.text === typeName &&
        hasExportModifier(node)
      ) {
        const symbol = checker.getSymbolAtLocation(node.name)
        if (symbol) found = { node, symbol }
      }
    })

    if (found) return found
  }

  return undefined
}

/**
 * Resolve the render-props type from the `className` prop's function
 * parameter. Components whose `className` is a plain string (or absent) have
 * no render props — name-based lookups would mis-attach states from
 * same-named react-aria interfaces (e.g. a Tooltip root vs its content).
 */
function resolveFromClassName(
  propsType: ts.Type,
  checker: ts.TypeChecker,
  location: ts.Node,
): ts.Type | undefined {
  const classNameProp = propsType.getProperty('className')
  if (!classNameProp) return undefined

  const classNameType = checker.getTypeOfSymbolAtLocation(
    classNameProp,
    location,
  )
  const unionParts = classNameType.isUnion()
    ? classNameType.types
    : [classNameType]

  for (const part of unionParts) {
    const signature = checker.getSignaturesOfType(
      part,
      ts.SignatureKind.Call,
    )[0]
    const parameter = signature?.parameters[0]
    const declaration =
      parameter?.valueDeclaration ?? parameter?.declarations?.[0]
    if (!parameter || !declaration) continue
    return checker.getTypeOfSymbolAtLocation(parameter, declaration)
  }

  return undefined
}

/** A Base UI state type and the declaration file it lives in. */
interface BaseUiState {
  name: string
  sourceFile: string
}

/**
 * If a type is a Base UI state interface (declared in the Base UI package with
 * a `*State` name), return its name and source file. Base UI's stylable
 * surface is exposed not on this type but on a sibling `*DataAttributes` enum.
 */
function asBaseUiState(type: ts.Type): BaseUiState | undefined {
  const symbol = type.aliasSymbol ?? type.getSymbol()
  const sourceFile = symbol?.getDeclarations()?.[0]?.getSourceFile().fileName
  const name = symbol?.getName()
  if (!sourceFile?.includes('@base-ui') || !name?.endsWith('State')) {
    return undefined
  }
  return { name, sourceFile }
}

/** Read the leading JSDoc description of a node (standalone AST, no checker). */
function jsDocDescription(node: ts.Node): string {
  for (const doc of ts.getJSDocCommentsAndTags(node)) {
    if (ts.isJSDoc(doc) && doc.comment) {
      return typeof doc.comment === 'string'
        ? doc.comment
        : doc.comment.map((part) => part.text).join('')
    }
  }
  return ''
}

/**
 * Build the states table from a Base UI `*DataAttributes` enum, which sits
 * next to its `*State` type (e.g. `DrawerPopupState` →
 * `DrawerPopupDataAttributes` in the same directory). These enum files aren't
 * imported anywhere, so they're absent from the TS program — parse the file
 * standalone. Each member maps a name to a `data-*` attribute; the JSDoc is
 * the description, and the Tailwind variant is the native `data-*:` form
 * (Tailwind v4 turns `data-open:` into `[data-open]`).
 */
function dataAttributesFromState(
  state: BaseUiState,
): Record<string, RenderPropInfo> {
  const enumName = state.name.replace(/State$/, 'DataAttributes')
  const enumPath = path.join(path.dirname(state.sourceFile), `${enumName}.d.ts`)
  if (!fs.existsSync(enumPath)) return {}

  const sourceFile = ts.createSourceFile(
    enumPath,
    fs.readFileSync(enumPath, 'utf8'),
    ts.ScriptTarget.Latest,
    /* setParentNodes */ true,
  )

  const result: Record<string, RenderPropInfo> = {}

  sourceFile.forEachChild((node) => {
    if (!ts.isEnumDeclaration(node) || node.name.text !== enumName) return
    for (const member of node.members) {
      if (
        !member.initializer ||
        !ts.isStringLiteral(member.initializer) ||
        !ts.isIdentifier(member.name)
      ) {
        continue
      }
      const value = member.initializer.text
      const description = jsDocDescription(member)
      result[member.name.text] = {
        selector: `[${value}]`,
        tailwind: `${value}:`,
        ...(description && { description }),
      }
    }
  })

  return result
}

/**
 * Extract the styling-state table for a Props export: React Aria render props
 * (with `@selector` tags) or Base UI data attributes, whichever the component
 * is built on. Only stylable states make the table — render props with no
 * selector (the `state` object, value getters, …) are omitted, so components
 * with no stylable state (and Base UI parts with no `*DataAttributes` enum)
 * get no table at all.
 */
export function extractRenderProps(
  propsTypeName: string,
  context: TypeCheckerContext,
): RenderPropsResult {
  const { checker } = context

  const override = RENDER_PROPS_SOURCES[propsTypeName]
  if (override === null) return EMPTY_RESULT

  let renderPropsType: ts.Type | undefined

  if (override) {
    const declared = findExportedTypeDeclaration(override, context)
    if (declared) {
      renderPropsType = checker.getDeclaredTypeOfSymbol(declared.symbol)
    }
  } else {
    const declared = findExportedTypeDeclaration(propsTypeName, context, {
      sourceOnly: true,
    })
    if (declared) {
      const propsType = checker.getDeclaredTypeOfSymbol(declared.symbol)
      renderPropsType = resolveFromClassName(propsType, checker, declared.node)
    }
  }

  if (!renderPropsType) return EMPTY_RESULT

  // Base UI: the className state object carries no selectors. Read the sibling
  // `*DataAttributes` enum instead (e.g. DrawerPopupState → the enum). Parts
  // with no such enum (e.g. DrawerIndent) expose nothing stylable — no table.
  const baseUiState = asBaseUiState(renderPropsType)
  if (baseUiState) {
    const props = dataAttributesFromState(baseUiState)
    if (Object.keys(props).length === 0) return EMPTY_RESULT
    return { kind: 'data-attribute', props }
  }

  // React Aria: render props carry `@selector` JSDoc tags. Only those with a
  // selector are stylable states; the rest (the `state` object, `percentage`,
  // `selectedItems`, …) are render-function data and have no place in a
  // selector table — skip them.
  const variants = getPluginVariants()
  const props: Record<string, RenderPropInfo> = {}

  for (const prop of checker.getPropertiesOfType(renderPropsType)) {
    // `defaultClassName` rides along in the className function parameter
    if (prop.name === 'defaultClassName') continue
    if (prop.flags & ts.SymbolFlags.Optional) continue

    const selectorTag = prop
      .getJsDocTags(checker)
      .find((tag) => tag.name === 'selector')
    if (!selectorTag) continue
    const selector = ts.displayPartsToString(selectorTag.text).trim()
    if (!selector) continue

    const tailwind = tailwindForSelector(selector, variants)
    const description = ts.displayPartsToString(
      prop.getDocumentationComment(checker),
    )

    props[prop.name] = {
      selector,
      ...(tailwind && { tailwind }),
      ...(description && { description }),
    }
  }

  return { kind: 'render-prop', props }
}
