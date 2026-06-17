/**
 * Type definitions for API reference data
 */

import type { TType, TypeLinksRegistry } from './types/type-ast'

/**
 * A single property definition in the API reference
 */
export interface PropDefinition {
  /** TypeScript type signature (short version without | undefined for optional props) */
  type: string
  /** Full type signature including | undefined (only present if different from type) */
  detailedType?: string
  /** AST representation of the type for rich rendering with popovers */
  typeAst?: TType
  /** Description of the prop */
  description?: string
  /** Default value if any */
  default?: string
  /** Whether the prop is required (only present and true if required) */
  required?: boolean
}

/**
 * A render prop / data attribute definition with CSS selector
 */
export interface RenderPropDefinition {
  /** CSS selector for styling this state (e.g., "[data-hovered]"); absent for render props without a DOM marker */
  selector?: string
  /** Tailwind variant(s) targeting the selector (e.g., "pressed:") */
  tailwind?: string
  /** Description of the render prop */
  description?: string
}

/**
 * What the styling-state table documents: React Aria render props or Base UI
 * data attributes. Drives the table's first-column header. Defaults to
 * "render-prop" when absent.
 */
export type RenderPropsKind = 'render-prop' | 'data-attribute'

/**
 * The full API reference for a component
 */
export interface ComponentApiReference {
  /** Name of the props interface (e.g., "ButtonProps") */
  name: string
  /** Description of the component extracted from JSDoc */
  description?: string
  /** HTML element this component extends (e.g., "div", "button") */
  extendsElement?: string
  /** Map of prop name to prop definition */
  props: Record<string, PropDefinition>
  /** Map of render prop / data attribute name to its definition (CSS selectors) */
  renderProps?: Record<string, RenderPropDefinition>
  /** Whether `renderProps` documents render props or data attributes (default: render props) */
  renderPropsKind?: RenderPropsKind
  /** Type links registry for navigating to type definitions */
  typeLinks?: TypeLinksRegistry
}

/**
 * Grouped props result from groupProps function
 */
export interface GroupedProps {
  /** Props that don't belong to any group (shown at top) */
  ungrouped: Record<string, PropDefinition>
  /** Props organized by group name */
  groups: Record<string, Record<string, PropDefinition>>
}

// Re-export type-ast types
export type { TType, TypeLinksRegistry } from './types/type-ast'
