/**
 * Types for InteractiveDemo with serializable data.
 * Controls are enriched at build time and passed as props to the client component.
 */

import type { MdxJsxFlowElementHast } from "mdast-util-mdx-jsx";

// ============================================================================
// Base Control Types (used for building controls)
// ============================================================================

export interface PropReference {
	description?: string;
	type: React.ReactNode;
	default?: React.ReactNode;
	defaultRaw?: string;
	required?: boolean;
}

export interface BaseControl {
	name: string;
	alwaysShow?: boolean;
	reference?: PropReference;
}

export interface BooleanControl extends BaseControl {
	type: "boolean";
	defaultValue?: boolean;
}

export interface StringControl extends BaseControl {
	type: "string";
	defaultValue?: string;
	placeholder?: string;
}

export interface NumberControl extends BaseControl {
	type: "number";
	defaultValue?: number;
	min?: number;
	max?: number;
	step?: number;
}

export interface EnumControl extends BaseControl {
	type: "enum";
	options: string[];
	defaultValue?: string;
}

export interface IconControl extends BaseControl {
	type: "icon";
}

export type Control = BooleanControl | StringControl | NumberControl | EnumControl | IconControl;

export type ControlValues = Record<string, unknown>;

/**
 * Simplified control input for InteractiveDemo.
 * Can be just a prop name (string) or a partial control definition with overrides.
 */
export type ControlInput = string | (Partial<Omit<Control, "name">> & { name: string });

/**
 * Serializable prop reference (HTML strings instead of ReactNode).
 * Used for JSON serialization through the rehype transform.
 */
export interface SerializablePropReference {
	description?: string;
	/** Highlighted type as HTML string */
	typeHighlighted: string;
	/** Highlighted default value as HTML string */
	defaultHighlighted?: string;
	/** Raw default value string */
	defaultRaw?: string;
	required?: boolean;
}

/**
 * Base serializable control with HTML string reference.
 */
export interface SerializableBaseControl {
	name: string;
	alwaysShow?: boolean;
	reference?: SerializablePropReference;
}

export interface SerializableBooleanControl extends SerializableBaseControl {
	type: "boolean";
	defaultValue?: boolean;
}

export interface SerializableStringControl extends SerializableBaseControl {
	type: "string";
	defaultValue?: string;
	placeholder?: string;
}

export interface SerializableNumberControl extends SerializableBaseControl {
	type: "number";
	defaultValue?: number;
	min?: number;
	max?: number;
	step?: number;
}

export interface SerializableEnumControl extends SerializableBaseControl {
	type: "enum";
	options: string[];
	defaultValue?: string;
}

export interface SerializableIconControl extends SerializableBaseControl {
	type: "icon";
}

/**
 * Serializable control union type.
 * All reference data uses HTML strings for JSON serialization.
 */
export type SerializableControl =
	| SerializableBooleanControl
	| SerializableStringControl
	| SerializableNumberControl
	| SerializableEnumControl
	| SerializableIconControl;

/**
 * Node info collected during rehype traversal.
 */
export interface InteractiveDemoNodeInfo {
	node: MdxJsxFlowElementHast;
	name: string;
	controls: ControlInput[];
	fallback?: string;
}

/**
 * Processed InteractiveDemo ready for transformation.
 */
export interface ProcessedInteractiveDemo {
	nodeInfo: InteractiveDemoNodeInfo;
	/** Import name for the playground component (e.g., "ButtonPlayground") */
	importName: string;
	/** Import path for the playground component */
	importPath: string;
	/** Enriched controls with serializable reference data */
	controls: SerializableControl[];
	/** Pre-highlighted fallback code as HAST (for Suspense fallback) */
	fallbackHast?: import("hast").Root;
}
