/**
 * Prop grouping logic for API reference tables
 */

import type { GroupedProps, PropDefinition } from "./types";

/**
 * Group definitions for organizing props by category
 */
export const GROUPS: Record<string, (string | RegExp)[]> = {
	Content: [
		"children",
		"items",
		"defaultItems",
		"columns",
		"loadingState",
		"onLoadMore",
		"renderEmptyState",
		"dependencies",
	],
	Selection: [
		"selectionMode",
		"selectionBehavior",
		"selectedKeys",
		"defaultSelectedKeys",
		"selectedKey",
		"defaultSelectedKey",
		"onSelectionChange",
		"disabledKeys",
		"disabledBehavior",
		"disallowEmptySelection",
		"shouldSelectOnPressUp",
		"shouldFocusWrap",
		"shouldFocusOnHover",
		"escapeKeyBehavior",
	],
	Value: [
		"value",
		"defaultValue",
		"onChange",
		"onChangeEnd",
		"inputValue",
		"defaultInputValue",
		"onInputChange",
		"formatOptions",
	],
	Labeling: ["label", "labelPosition", "labelAlign", "contextualHelp"],
	Validation: [
		"minValue",
		"maxValue",
		"step",
		"minLength",
		"maxLength",
		"pattern",
		"isRequired",
		"isInvalid",
		"validate",
		"validationBehavior",
		"validationErrors",
		"necessityIndicator",
		"description",
		"errorMessage",
	],
	Overlay: [
		"isOpen",
		"defaultOpen",
		"onOpenChange",
		"shouldCloseOnSelect",
		"placement",
		"direction",
		"align",
		"shouldFlip",
		"offset",
		"crossOffset",
		"containerPadding",
		"menuWidth",
	],
	Events: [/^on[A-Z]/],
	Links: ["href", "hrefLang", "target", "rel", "download", "ping", "referrerPolicy", "routerOptions"],
	Styling: ["style", "className"],
	Forms: [
		"name",
		"startName",
		"endName",
		"value",
		"formValue",
		"type",
		"autoComplete",
		"form",
		"formTarget",
		"formNoValidate",
		"formMethod",
		"formEncType",
		"formAction",
	],
	Accessibility: ["autoFocus", "role", "id", "tabIndex", "excludeFromTabOrder", "preventFocusOnPress", /^aria-/],
	Advanced: ["UNSAFE_className", "UNSAFE_style", "slot"],
};

/**
 * Groups that should be expanded by default in the UI
 */
export const DEFAULT_EXPANDED = new Set(["Content", "Selection", "Value"]);

/**
 * Group props into categories based on GROUPS definition
 */
export function groupProps(
	props: Record<string, PropDefinition>,
	propGroups: Record<string, (string | RegExp)[]> = GROUPS,
): GroupedProps {
	const remainingProps = { ...props };
	const groups: Record<string, Record<string, PropDefinition>> = {};

	for (const groupName in propGroups) {
		const groupMatchers = propGroups[groupName];
		if (!groupMatchers) continue;
		const groupProps: Record<string, PropDefinition> = {};

		for (const matcher of groupMatchers) {
			if (matcher instanceof RegExp) {
				for (const propName in remainingProps) {
					if (matcher.test(propName)) {
						const prop = remainingProps[propName];
						if (prop && !shouldSkipProp(propName, groupName, remainingProps)) {
							groupProps[propName] = prop;
							delete remainingProps[propName];
						}
					}
				}
			} else {
				const prop = remainingProps[matcher];
				if (prop) {
					if (!shouldSkipProp(matcher, groupName, remainingProps)) {
						groupProps[matcher] = prop;
						delete remainingProps[matcher];
					}
				}
			}
		}

		if (Object.keys(groupProps).length > 0) {
			groups[groupName] = groupProps;
		}
	}

	return {
		ungrouped: remainingProps,
		groups,
	};
}

/**
 * Determines if a prop should be skipped based on special conditions
 */
function shouldSkipProp(propName: string, groupName: string, props: Record<string, PropDefinition>): boolean {
	const prop = props[propName];
	if (!prop) return true;

	// "id" should only go to Accessibility if type is "string"
	if (propName === "id" && groupName === "Accessibility") {
		return prop.typeAst?.type !== "string";
	}

	// "value" in Value group: only if defaultValue exists
	// "value" in Forms group: only if type is "string"
	if (propName === "value") {
		if (groupName === "Value" && !props.defaultValue) {
			return true;
		}
		if (groupName === "Forms" && prop.typeAst?.type !== "string") {
			return true;
		}
	}

	// "type" in Forms group: only if description mentions form
	if (propName === "type" && groupName === "Forms") {
		return !prop.description?.toLowerCase().includes("form");
	}

	// "children" in Content group: only if items or columns exist
	if (propName === "children" && groupName === "Content") {
		return !props.items && !props.columns;
	}

	// "target" in Links: check for identifier type
	if (propName === "target" && groupName === "Links") {
		const ast = prop.typeAst;
		if (!ast) return true;

		if (ast.type === "identifier") return false;

		if (ast.type === "union" && "elements" in ast) {
			const elements = ast.elements as Array<{ type: string }>;
			const hasNonNullishType = elements.some((el) => el.type !== "undefined" && el.type !== "null");
			return !hasNonNullishType;
		}

		return true;
	}

	// "placement" in Overlay: only if it's a union with exactly 22 elements
	if (propName === "placement" && groupName === "Overlay") {
		if (prop.typeAst?.type !== "union") {
			return true;
		}
		const elements = "elements" in prop.typeAst ? prop.typeAst.elements : undefined;
		return !elements || elements.length !== 22;
	}

	return false;
}

/**
 * Get all group names in their defined order
 */
export function getGroupOrder(): string[] {
	return Object.keys(GROUPS);
}

/**
 * Check if a group should be expanded by default
 */
export function isGroupExpandedByDefault(groupName: string): boolean {
	return DEFAULT_EXPANDED.has(groupName);
}
