/**
 * API Reference transformation
 * Transforms raw API reference data for rendering
 */

import type { HighlighterGeneric } from 'shiki'

import { DEFAULT_EXPANDED, groupProps } from './groups'
import type {
  ComponentApiReference,
  PropDefinition,
  RenderPropsKind,
  TypeLinksRegistry,
} from './types'
import type { TType } from './types/type-ast'

/**
 * Transformed prop data ready for rendering
 */
export interface TransformedProp {
  name: string
  type: string
  typeHighlighted: string
  shortType: string
  shortTypeHighlighted: string
  typeAst?: TType
  default?: string
  defaultHighlighted?: string
  description?: string
  required?: boolean
}

/**
 * Grouped transformed props
 */
export interface TransformedPropsData {
  ungrouped: TransformedProp[]
  groups: Record<string, TransformedProp[]>
}

/**
 * Transformed render prop (state) ready for rendering
 */
export interface TransformedRenderProp {
  name: string
  selector?: string
  tailwind?: string
  description?: string
}

/**
 * Fully transformed reference data ready for rendering
 */
export interface TransformedReference {
  name: string
  description?: string
  extendsElement?: string
  data: TransformedPropsData
  renderProps?: TransformedRenderProp[]
  renderPropsKind?: RenderPropsKind
  typeLinks?: TypeLinksRegistry
  defaultExpandedGroups: string[]
}

/**
 * Get a shortened version of the type for display in the collapsed row
 */
function getShortType(
  name: string,
  type: string | undefined,
  typeAst?: TType,
): string {
  if (!type) return 'unknown'

  // Event handlers show as "function"
  if (/^on[A-Z]/.test(name)) return 'function'

  // Function types show as "function": render functions
  // (DOMRenderFunction<"div", T>) and plain callbacks like validate
  if (/RenderFunction</.test(type)) return 'function'
  if (typeAst?.type === 'function') return 'function'

  // Render prop patterns
  if (type.includes('=> ReactNode')) return 'ReactNode | function'
  if (type.includes('=> string') && type.includes('values:'))
    return 'string | function'
  if (type.includes('=> CSSProperties')) return 'CSSProperties | function'

  // Simple types
  if (type === 'boolean' || type === 'string' || type === 'number') return type

  // Short union types
  if (!type.includes('|') || (type.split('|').length < 4 && type.length < 50))
    return type

  return 'union'
}

/**
 * Highlight code using shiki
 */
function highlightCode(
  code: string,
  // oxlint-disable-next-line typescript/no-explicit-any -- shiki types are complex
  highlighter: HighlighterGeneric<any, any>,
): string {
  if (!code) return ''

  const html = highlighter.codeToHtml(code, {
    lang: 'ts',
    themes: { light: 'github-light', dark: 'github-dark' },
    defaultColor: false,
  })

  // Extract just the code content, removing the pre/code wrapper
  // The result is like: <pre ...><code>...</code></pre>
  // We want just the inner spans
  const match = html.match(/<code[^>]*>([\s\S]*?)<\/code>/)
  return match?.[1] ?? code
}

/**
 * Highlight a type string using shiki.
 * Prefixes `type _ =` on its own line so the grammar tokenizes the string in
 * type position (`boolean`, `ReactNode`, … get type colors, matching the AST
 * renderer in the row panel), then drops that first line.
 */
function highlightTypeCode(
  code: string,
  // oxlint-disable-next-line typescript/no-explicit-any -- shiki types are complex
  highlighter: HighlighterGeneric<any, any>,
): string {
  if (!code) return ''

  const html = highlightCode(`type _ =\n${code}`, highlighter)
  const newlineIndex = html.indexOf('\n')
  return newlineIndex === -1 ? html : html.slice(newlineIndex + 1)
}

/**
 * Transform a single prop
 */
function transformProp(
  propName: string,
  prop: PropDefinition,
  // oxlint-disable-next-line typescript/no-explicit-any -- shiki types are complex
  highlighter: HighlighterGeneric<any, any>,
): TransformedProp {
  const shortType = getShortType(propName, prop.type, prop.typeAst)
  const fullType = prop.detailedType ?? prop.type

  return {
    name: propName,
    type: fullType,
    typeHighlighted: highlightTypeCode(fullType, highlighter),
    shortType,
    shortTypeHighlighted: highlightTypeCode(shortType, highlighter),
    typeAst: prop.typeAst,
    default: prop.default,
    defaultHighlighted: prop.default
      ? highlightCode(prop.default, highlighter)
      : undefined,
    description: prop.description,
    required: prop.required,
  }
}

/**
 * Transform props record to array
 */
function transformProps(
  props: Record<string, PropDefinition>,
  // oxlint-disable-next-line typescript/no-explicit-any -- shiki types are complex
  highlighter: HighlighterGeneric<any, any>,
): TransformedProp[] {
  return Object.entries(props).map(([name, prop]) =>
    transformProp(name, prop, highlighter),
  )
}

/**
 * Transform API reference data for rendering
 */
export function transformReference(
  data: ComponentApiReference,
  // oxlint-disable-next-line typescript/no-explicit-any -- shiki types are complex
  highlighter: HighlighterGeneric<any, any>,
): TransformedReference {
  // Group the props
  const { ungrouped, groups } = groupProps(data.props)

  // Transform all props with highlighting
  const transformedData: TransformedPropsData = {
    ungrouped: transformProps(ungrouped, highlighter),
    groups: Object.fromEntries(
      Object.entries(groups).map(([groupName, groupProps]) => [
        groupName,
        transformProps(groupProps, highlighter),
      ]),
    ),
  }

  return {
    name: data.name,
    description: data.description,
    extendsElement: data.extendsElement,
    data: transformedData,
    renderProps: data.renderProps
      ? Object.entries(data.renderProps).map(([name, renderProp]) => ({
          name,
          ...renderProp,
        }))
      : undefined,
    renderPropsKind: data.renderPropsKind,
    typeLinks: data.typeLinks,
    defaultExpandedGroups: Array.from(DEFAULT_EXPANDED),
  }
}
