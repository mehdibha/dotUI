import { highlight } from "fumadocs-core/highlight";

import type {
	BooleanControl,
	Control,
	ControlInput,
	EnumControl,
	NumberControl,
	StringControl,
} from "@dotui/types/playground";

import { toPascalCase } from "@/lib/utils";
import type { ComponentApiReference, PropDefinition } from "@/modules/docs/api-reference/types";
import type { TType } from "@/modules/docs/api-reference/types/type-ast";

/**
 * Load the playground component for a given component name.
 */
export async function loadComponent(name: string) {
	const componentExportName = `${toPascalCase(name)}Playground`;

	const module = await import(`@dotui/registry/ui/${name}/demos/playground`);

	const component = module[componentExportName] as React.ComponentType<Record<string, unknown>> | undefined;

	if (!component) {
		throw new Error(`Component ${componentExportName} not found in ${name}/demos/playground`);
	}

	return component;
}

/**
 * Build controls from simplified inputs + API reference.
 * Infers type, options, and defaults from the API reference.
 */
export async function buildControlsFromReference(name: string, controlInputs: ControlInput[]): Promise<Control[]> {
	const referenceExport = await import(`@/modules/docs/api-reference/generated/${name}.json`);

	const reference = referenceExport.default as ComponentApiReference | undefined;

	if (!reference) {
		throw new Error(`API reference not found for ${name}`);
	}

	const controls: Control[] = [];

	for (const input of controlInputs) {
		const propName = typeof input === "string" ? input : input.name;
		const overrides = typeof input === "string" ? {} : input;

		const prop = reference.props[propName];
		if (!prop) {
			// If prop not in reference, use overrides directly (for custom controls like icons)
			if (typeof input !== "string" && input.type) {
				controls.push(input as Control);
				continue;
			}
			throw new Error(`Prop ${propName} not found in API reference for ${name}`);
		}

		const inferredControl = inferControlFromProp(propName, prop, overrides);
		controls.push(inferredControl);
	}

	return controls;
}

/**
 * Infer a control definition from a prop definition.
 */
function inferControlFromProp(name: string, prop: PropDefinition, overrides: Partial<Omit<Control, "name">>): Control {
	// If type is explicitly provided in overrides, use it
	if (overrides.type) {
		return buildControlWithOverrides(name, prop, overrides);
	}

	// Infer from typeAst
	if (prop.typeAst) {
		const inferred = inferFromTypeAst(name, prop.typeAst, prop);
		if (inferred) {
			return applyOverrides(inferred, overrides);
		}
	}

	// Fallback: try to infer from type string
	const inferredFromString = inferFromTypeString(name, prop);
	if (inferredFromString) {
		return applyOverrides(inferredFromString, overrides);
	}

	// Final fallback to string control
	return {
		type: "string",
		name,
		defaultValue: parseDefaultValue(prop.default, "string") as string,
		...overrides,
	} as StringControl;
}

/**
 * Infer control from TypeAST structure
 */
function inferFromTypeAst(name: string, typeAst: TType, prop: PropDefinition): Control | null {
	// Handle union types
	if (typeAst.type === "union") {
		// Filter out undefined from union elements (optional props)
		const nonUndefinedElements = typeAst.elements.filter((el) => el.type !== "undefined");

		// Check if it's a union of string literals → enum
		const stringLiterals = nonUndefinedElements
			.filter((el) => el.type === "stringLiteral")
			.map((el) => (el as { type: "stringLiteral"; value: string }).value);

		if (stringLiterals.length > 0 && stringLiterals.length === nonUndefinedElements.length) {
			return {
				type: "enum",
				name,
				options: stringLiterals,
				defaultValue: (parseDefaultValue(prop.default, "enum") as string) ?? stringLiterals[0],
			} as EnumControl;
		}

		// Check if it's a boolean union (true | false | undefined)
		const hasBooleanLiteral = nonUndefinedElements.some((el) => el.type === "booleanLiteral");
		const hasBoolean = nonUndefinedElements.some((el) => el.type === "boolean");

		if (
			(hasBooleanLiteral || hasBoolean) &&
			nonUndefinedElements.every((el) => el.type === "boolean" || el.type === "booleanLiteral")
		) {
			return {
				type: "boolean",
				name,
				defaultValue: (parseDefaultValue(prop.default, "boolean") as boolean) ?? false,
			} as BooleanControl;
		}
	}

	// Handle primitive keyword types
	if (typeAst.type === "boolean") {
		return {
			type: "boolean",
			name,
			defaultValue: (parseDefaultValue(prop.default, "boolean") as boolean) ?? false,
		} as BooleanControl;
	}

	if (typeAst.type === "string") {
		return {
			type: "string",
			name,
			defaultValue: (parseDefaultValue(prop.default, "string") as string) ?? "",
		} as StringControl;
	}

	if (typeAst.type === "number") {
		return {
			type: "number",
			name,
			defaultValue: (parseDefaultValue(prop.default, "number") as number) ?? 0,
		} as NumberControl;
	}

	return null;
}

/**
 * Fallback: infer from type string when AST is not available
 */
function inferFromTypeString(name: string, prop: PropDefinition): Control | null {
	const type = prop.type;

	if (type === "boolean") {
		return {
			type: "boolean",
			name,
			defaultValue: (parseDefaultValue(prop.default, "boolean") as boolean) ?? false,
		} as BooleanControl;
	}

	if (type === "string") {
		return {
			type: "string",
			name,
			defaultValue: (parseDefaultValue(prop.default, "string") as string) ?? "",
		} as StringControl;
	}

	if (type === "number") {
		return {
			type: "number",
			name,
			defaultValue: (parseDefaultValue(prop.default, "number") as number) ?? 0,
		} as NumberControl;
	}

	// Check for union of string literals in type string (e.g., '"sm" | "md" | "lg"')
	const stringLiteralMatch = type.match(/^"[^"]+"/);
	if (stringLiteralMatch) {
		const options = type
			.split("|")
			.map((s) => s.trim().replace(/^"|"$/g, ""))
			.filter((s) => s && !s.includes(" "));

		if (options.length > 0) {
			return {
				type: "enum",
				name,
				options,
				defaultValue: (parseDefaultValue(prop.default, "enum") as string) ?? options[0],
			} as EnumControl;
		}
	}

	return null;
}

/**
 * Build a control with explicit type from overrides
 */
function buildControlWithOverrides(
	name: string,
	prop: PropDefinition,
	overrides: Partial<Omit<Control, "name">>,
): Control {
	// This function is only called when overrides.type is defined
	const type = overrides.type as NonNullable<typeof overrides.type>;

	switch (type) {
		case "boolean":
			return {
				type: "boolean",
				name,
				defaultValue:
					(overrides as Partial<BooleanControl>).defaultValue ??
					(parseDefaultValue(prop.default, "boolean") as boolean) ??
					false,
				...overrides,
			} as BooleanControl;

		case "string":
			return {
				type: "string",
				name,
				defaultValue:
					(overrides as Partial<StringControl>).defaultValue ??
					(parseDefaultValue(prop.default, "string") as string) ??
					"",
				...overrides,
			} as StringControl;

		case "number":
			return {
				type: "number",
				name,
				defaultValue:
					(overrides as Partial<NumberControl>).defaultValue ??
					(parseDefaultValue(prop.default, "number") as number) ??
					0,
				...overrides,
			} as NumberControl;

		case "enum": {
			// For enum, we need options - try to infer from typeAst if not provided
			let options = (overrides as Partial<EnumControl>).options;
			if (!options && prop.typeAst?.type === "union") {
				options = prop.typeAst.elements
					.filter((el) => el.type === "stringLiteral")
					.map((el) => (el as { type: "stringLiteral"; value: string }).value);
			}
			return {
				type: "enum",
				name,
				options: options ?? [],
				defaultValue:
					(overrides as Partial<EnumControl>).defaultValue ??
					(parseDefaultValue(prop.default, "enum") as string) ??
					options?.[0] ??
					"",
				...overrides,
			} as EnumControl;
		}

		case "icon":
			return {
				type: "icon",
				name,
				alwaysShow: overrides.alwaysShow,
			};

		default:
			return {
				type: "string",
				name,
				defaultValue: (parseDefaultValue(prop.default, "string") as string) ?? "",
				...overrides,
			} as StringControl;
	}
}

/**
 * Apply overrides to an inferred control
 */
function applyOverrides(control: Control, overrides: Partial<Omit<Control, "name">>): Control {
	return { ...control, ...overrides } as Control;
}

/**
 * Parse a default value string from the API reference
 */
function parseDefaultValue(
	defaultStr: string | undefined,
	type: "string" | "number" | "boolean" | "enum",
): string | number | boolean | undefined {
	if (!defaultStr) return undefined;

	// Remove quotes from string defaults like "'default'" or "\"md\""
	const cleaned = defaultStr.replace(/^['"]|['"]$/g, "");

	switch (type) {
		case "boolean":
			return cleaned === "true";
		case "number":
			return Number(cleaned) || 0;
		case "string":
		case "enum":
			return cleaned;
		default:
			return cleaned;
	}
}

/**
 * Enrich controls with API reference data (descriptions, types, etc.)
 */
export async function enrichControlsWithReference(name: string, controls: Control[]): Promise<Control[]> {
	const referenceExport = await import(`@/modules/docs/api-reference/generated/${name}.json`);

	const reference = referenceExport.default as ComponentApiReference | undefined;

	if (!reference) {
		throw new Error(`API reference not found for ${name}`);
	}

	// Create a copy of controls to avoid mutating the original
	const enrichedControls = controls.map((control) => ({ ...control }));

	for (const control of enrichedControls) {
		const prop = reference.props[control.name];
		if (!prop) {
			// Skip enrichment for props not in reference (e.g., custom icon controls)
			continue;
		}
		const highlightedType = await highlightCode(prop.type, "ts");
		const highlightedDefault = prop.default ? await highlightCode(prop.default, "ts") : undefined;

		control.reference = {
			description: prop.description,
			type: highlightedType,
			default: highlightedDefault,
			defaultRaw: prop.default,
			required: prop.required,
		};
	}

	return enrichedControls;
}

/**
 * Highlight code using fumadocs shiki
 */
async function highlightCode(code: string, lang = "ts"): Promise<React.ReactNode> {
	if (!code) return null;

	const highlighted = await highlight(code, {
		lang,
		components: {
			pre: ({ children, ...props }) => (
				<code {...props} className="**:[span]:text-(--shiki-light) dark:**:[span]:text-(--shiki-dark)">
					{children}
				</code>
			),
		},
	});

	return highlighted;
}
