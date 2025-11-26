/**
 * Type definitions for API reference props data
 * Based on the generated JSON structure from the api-docs-builder
 */

/**
 * A single property definition in the API reference
 */
export interface PropDefinition {
  /** TypeScript type signature (short version without | undefined for optional props) */
  type: string;
  /** Full type signature including | undefined (only present if different from type) */
  detailedType?: string;
  /** Description of the prop */
  description?: string;
  /** Default value if any */
  default?: string;
  /** Whether the prop is required (only present and true if required) */
  required?: boolean;
}

/**
 * The full API reference for a component
 */
export interface ComponentApiReference {
  /** Name of the props interface (e.g., "ButtonProps") */
  name: string;
  /** Description of the component extracted from JSDoc */
  description?: string;
  /** Map of prop name to prop definition */
  props: Record<string, PropDefinition>;
}

/**
 * Grouped props result from groupProps function
 */
export interface GroupedProps {
  /** Props that don't belong to any group (shown at top) */
  ungrouped: Record<string, PropDefinition>;
  /** Props organized by group name */
  groups: Record<string, Record<string, PropDefinition>>;
}
