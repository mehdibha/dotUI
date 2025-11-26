/**
 * Prop grouping logic for API reference tables
 * Mirrors the grouping logic from react-spectrum/s2-docs
 */

import type { GroupedProps, PropDefinition } from "./types";

/**
 * Group definitions for organizing props by category
 * Each group has an array of prop names or RegExp patterns
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
  Links: [
    "href",
    "hrefLang",
    "target",
    "rel",
    "download",
    "ping",
    "referrerPolicy",
    "routerOptions",
  ],
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
  Accessibility: [
    "autoFocus",
    "role",
    "id",
    "tabIndex",
    "excludeFromTabOrder",
    "preventFocusOnPress",
    /^aria-/,
  ],
  Advanced: ["UNSAFE_className", "UNSAFE_style", "slot"],
};

/**
 * Groups that should be expanded by default in the UI
 */
export const DEFAULT_EXPANDED = new Set(["Content", "Selection", "Value"]);

/**
 * Group props into categories based on GROUPS definition
 * @param props - The props object from a component's API reference
 * @param propGroups - Optional custom group definitions (defaults to GROUPS)
 * @returns Object with ungrouped props and grouped props by category
 */
export function groupProps(
  props: Record<string, PropDefinition>,
  propGroups: Record<string, (string | RegExp)[]> = GROUPS,
): GroupedProps {
  // Create a mutable copy of props to track which have been grouped
  const remainingProps = { ...props };
  const groups: Record<string, Record<string, PropDefinition>> = {};

  // Process each group
  for (const groupName in propGroups) {
    const groupMatchers = propGroups[groupName];
    if (!groupMatchers) continue;
    const groupProps: Record<string, PropDefinition> = {};

    for (const matcher of groupMatchers) {
      if (matcher instanceof RegExp) {
        // RegExp matcher - check all remaining props
        for (const propName in remainingProps) {
          if (matcher.test(propName)) {
            // Apply special cases
            const prop = remainingProps[propName];
            if (prop && !shouldSkipProp(propName, groupName, remainingProps)) {
              groupProps[propName] = prop;
              delete remainingProps[propName];
            }
          }
        }
      } else {
        // String matcher - exact match
        const prop = remainingProps[matcher];
        if (prop) {
          // Apply special cases
          if (!shouldSkipProp(matcher, groupName, remainingProps)) {
            groupProps[matcher] = prop;
            delete remainingProps[matcher];
          }
        }
      }
    }

    // Only add group if it has props
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
 * These rules mirror the logic from s2-docs PropTable
 */
function shouldSkipProp(
  propName: string,
  groupName: string,
  props: Record<string, PropDefinition>,
): boolean {
  const prop = props[propName];
  if (!prop) return true;

  // "id" should only go to Accessibility if it's a string type
  if (propName === "id" && groupName === "Accessibility") {
    return !prop.type.includes("string");
  }

  // "value" in Value group: only if defaultValue exists
  // "value" in Forms group: only if type is string
  if (propName === "value") {
    if (groupName === "Value" && !props.defaultValue) {
      return true;
    }
    if (groupName === "Forms" && !prop.type.includes("string")) {
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

  // "target" in Links: skip if not an identifier type (for links)
  // This is a simplified check
  if (propName === "target" && groupName === "Links") {
    // Keep if it looks like a link target type
    return (
      !prop.type.includes("_blank") &&
      !prop.type.includes("_self") &&
      !prop.type.includes("_parent")
    );
  }

  // "placement" in Overlay: only if it's the full placement union (22 elements)
  // Simplified: check if it has typical overlay placement values
  if (propName === "placement" && groupName === "Overlay") {
    const hasOverlayPlacement =
      prop.type.includes("top") &&
      prop.type.includes("bottom") &&
      prop.type.includes("left") &&
      prop.type.includes("right");
    return !hasOverlayPlacement;
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
