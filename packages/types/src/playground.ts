/**
 * Control types for interactive demos/playgrounds.
 * Controls define what props the user can modify in the playground.
 */

export interface PropReference {
	description?: string;
	type: React.ReactNode;
	/** Highlighted default value (ReactNode) */
	default?: React.ReactNode;
	/** Raw default value string (for display purposes) */
	defaultRaw?: string;
	required?: boolean;
}

export interface BaseControl {
	name: string;
	/** Always show this prop in code output, even if it equals the default value */
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
 * The system will infer type, options, and defaults from the API reference.
 */
export type ControlInput = string | (Partial<Omit<Control, "name">> & { name: string });
