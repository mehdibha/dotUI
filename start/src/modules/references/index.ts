/**
 * References module
 * Handles loading and transforming API reference data
 */

// Types
export type {
	ComponentApiReference,
	GroupedProps,
	PropDefinition,
	RenderPropDefinition,
	TType,
	TypeLinksRegistry,
} from "./types";

export type { TransformedProp, TransformedPropsData, TransformedReference } from "./transform";

// Loader
export { hasApiReference, listApiReferences, loadApiReference } from "./loader";

// Groups
export { DEFAULT_EXPANDED, getGroupOrder, groupProps, GROUPS, isGroupExpandedByDefault } from "./groups";

// Transform
export { transformReference } from "./transform";
