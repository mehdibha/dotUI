import type { Variants } from "../../types";

export async function loadComponentTemplate(
  componentName: keyof Variants,
  variant: string,
): Promise<string> {
  // This will load the actual component file content
  // For now, we'll return the path where the component should be loaded from
  // In a real implementation, you'd read from the UI package component files

  const templatePath = getComponentFilePath(componentName, variant);

  // TODO: Read the actual file content from the UI package
  // For now, return a placeholder that indicates where to load from
  return `// Component template loaded from: ${templatePath}`;
}

export function getComponentFilePath(
  componentName: keyof Variants,
  variant: string,
): string {
  return `packages/ui/src/registry/components/${componentName}/${variant}.tsx`;
}

export function getComponentRegistryPath(
  styleName: string,
  componentName: keyof Variants,
): string {
  return `registry/${styleName}/ui/${componentName}.tsx`;
}

// Helper function to determine which variant file to use
export function resolveComponentVariant(
  componentName: keyof Variants,
  requestedVariant: string,
  availableVariants: string[],
): string {
  // If the requested variant exists, use it
  if (availableVariants.includes(requestedVariant)) {
    return requestedVariant;
  }

  // Fallback to 'basic' if available
  if (availableVariants.includes("basic")) {
    return "basic";
  }

  // Use the first available variant
  return availableVariants[0] || "basic";
}
