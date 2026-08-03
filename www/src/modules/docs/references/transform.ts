/**
 * API Reference transformation
 * Transforms raw API reference data for rendering
 */

import { highlightTsHtml } from '../mdx-plugins/highlighter'
import { DEFAULT_EXPANDED, groupProps } from './groups'
import type {
  ComponentApiReference,
  PropDefinition,
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
 * Fully transformed reference data ready for rendering
 */
export interface TransformedReference {
  name: string
  description?: string
  extendsElement?: string
  data: TransformedPropsData
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
 * Transform a single prop
 */
function transformProp(
  propName: string,
  prop: PropDefinition,
): TransformedProp {
  const shortType = getShortType(propName, prop.type, prop.typeAst)
  const fullType = prop.detailedType ?? prop.type

  return {
    name: propName,
    type: fullType,
    typeHighlighted: highlightTsHtml(fullType),
    shortType,
    shortTypeHighlighted: highlightTsHtml(shortType),
    typeAst: prop.typeAst,
    default: prop.default,
    defaultHighlighted: prop.default
      ? highlightTsHtml(prop.default)
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
): TransformedProp[] {
  return Object.entries(props).map(([name, prop]) => transformProp(name, prop))
}

/**
 * Transform API reference data for rendering
 */
export function transformReference(
  data: ComponentApiReference,
): TransformedReference {
  // Group the props
  const { ungrouped, groups } = groupProps(data.props)

  // Transform all props with highlighting
  const transformedData: TransformedPropsData = {
    ungrouped: transformProps(ungrouped),
    groups: Object.fromEntries(
      Object.entries(groups).map(([groupName, groupProps]) => [
        groupName,
        transformProps(groupProps),
      ]),
    ),
  }

  return {
    name: data.name,
    description: data.description,
    extendsElement: data.extendsElement,
    data: transformedData,
    typeLinks: data.typeLinks,
    defaultExpandedGroups: Array.from(DEFAULT_EXPANDED),
  }
}
