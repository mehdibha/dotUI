import type { Variants } from "../../types";
import type { RegistryContext, RegistryItem } from "../types";

export function generateComponentRegistry(
  context: RegistryContext,
  componentName: keyof Variants,
): RegistryItem {
  const { style, styleName } = context;
  const variant = style.variants[componentName];

  if (!variant) {
    throw new Error(`Component ${componentName} not found in style variants`);
  }

  return {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: componentName,
    type: "registry:ui",
    title: getComponentTitle(componentName),
    description: getComponentDescription(componentName, variant),
    dependencies: getComponentDependencies(componentName, variant),
    registryDependencies: getRegistryDependencies(componentName),
    files: [
      {
        path: `registry/${styleName}/ui/${componentName}.tsx`,
        type: "registry:ui",
        target: `ui/${componentName}.tsx`,
      },
    ],
  };
}

function getComponentTitle(componentName: string): string {
  return componentName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getComponentDescription(
  componentName: string,
  variant: string,
): string {
  return `${getComponentTitle(componentName)} component with ${variant} variant`;
}

function getComponentDependencies(
  componentName: string,
  variant: string,
): string[] {
  const deps: string[] = [];

  // Add motion dependency for motion variants
  if (variant === "motion") {
    deps.push("framer-motion");
  }

  // Add specific dependencies based on component
  const componentSpecificDeps = getComponentSpecificDependencies(componentName);
  deps.push(...componentSpecificDeps);

  return deps;
}

function getComponentSpecificDependencies(componentName: string): string[] {
  const depsMap: Record<string, string[]> = {
    slider: ["@react-aria/utils"],
    "date-picker": ["@internationalized/date"],
    "date-field": ["@internationalized/date"],
    "date-range-picker": ["@internationalized/date"],
    "time-field": ["@internationalized/date"],
    calendar: ["@internationalized/date"],
    "color-picker": ["@adobe/leonardo-contrast-colors"],
    "color-area": ["@adobe/leonardo-contrast-colors"],
    "color-field": ["@adobe/leonardo-contrast-colors"],
    "color-slider": ["@adobe/leonardo-contrast-colors"],
  };

  return depsMap[componentName] || [];
}

function getRegistryDependencies(componentName: string): string[] {
  const depsMap: Record<string, string[]> = {
    alert: [],
    avatar: [],
    badge: [],
    breadcrumbs: ["focus-styles"],
    button: ["loader", "focus-styles"],
    "button-group": ["button"],
    calendar: ["button", "text", "focus-styles"],
    checkbox: ["focus-styles"],
    "checkbox-group": ["field", "checkbox"],
    "color-area": ["color-thumb"],
    "color-field": ["field", "input"],
    "color-picker": [
      "button",
      "color-area",
      "color-field",
      "color-slider",
      "color-swatch",
      "dialog",
      "select",
    ],
    "color-slider": ["field", "color-thumb"],
    "color-swatch": [],
    "color-swatch-picker": ["focus-styles", "color-swatch"],
    "color-thumb": ["focus-styles"],
    combobox: ["field", "button", "input", "list-box", "overlay"],
    command: [],
    "date-field": ["field", "input", "date-input"],
    "date-input": ["focus-styles"],
    "date-picker": ["button", "calendar", "date-field", "overlay"],
    "date-range-picker": ["button", "calendar", "date-field", "overlay"],
    dialog: [],
    drawer: [],
    "drop-zone": [],
    field: [],
    "file-trigger": [],
    form: ["field"],
    input: ["focus-styles"],
    kbd: [],
    "list-box": ["text", "focus-styles"],
    loader: [],
    menu: ["kbd", "overlay", "text"],
    modal: [],
    "number-field": ["input", "field", "use-is-mobile"],
    overlay: ["modal", "popover", "drawer", "use-is-mobile"],
    popover: [],
    "progress-bar": ["field"],
    "radio-group": ["focus-styles", "field"],
    ripple: [],
    "search-field": ["field", "button"],
    select: ["button", "field", "list-box", "popover"],
    separator: [],
    skeleton: [],
    slider: ["field", "focus-styles"],
    switch: ["focus-styles"],
    table: ["checkbox", "focus-styles"],
    tabs: ["focus-styles"],
    "tag-group": ["field", "button", "focus-styles"],
    text: [],
    "text-area": ["field", "input"],
    "text-field": ["field", "input"],
    "time-field": ["field", "input", "date-input"],
    "toggle-button": ["focus-styles"],
    "toggle-button-group": ["toggle-button"],
    tooltip: [],
  };

  return depsMap[componentName] || [];
}
