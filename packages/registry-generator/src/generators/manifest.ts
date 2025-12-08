import type { Manifest, ManifestItem } from "../types";

interface RegistryItem {
  name: string;
  type: string;
  variants?: Record<string, unknown>;
}

/**
 * Generate a manifest from registry items
 */
export function generateManifest(
  items: RegistryItem[],
  version: string = "1.0.0",
): Manifest {
  const manifestItems: ManifestItem[] = items.map((item) => {
    const baseName = item.name.split(":")[0] ?? item.name;
    return {
      name: baseName,
      type: item.type,
      category: getCategoryFromType(item.type),
      path: `./${getCategoryFromType(item.type)}/${baseName}.json`,
      variants: item.variants ? Object.keys(item.variants) : undefined,
    };
  });

  // Dedupe by name (in case of variant entries)
  const uniqueItems = Array.from(
    new Map(manifestItems.map((item) => [item.name, item])).values(),
  );

  return {
    version,
    generatedAt: new Date().toISOString(),
    items: uniqueItems,
  };
}

/**
 * Generate a category-specific manifest
 */
export function generateCategoryManifest(
  items: RegistryItem[],
  category: string,
): { items: Array<{ name: string; path: string; variants?: string[] }> } {
  const categoryItems = items
    .filter((item) => getCategoryFromType(item.type) === category)
    .map((item) => {
      const baseName = item.name.split(":")[0] ?? item.name;
      return {
        name: baseName,
        path: `./${baseName}.json`,
        variants: item.variants ? Object.keys(item.variants) : undefined,
      };
    });

  // Dedupe by name
  const uniqueItems = Array.from(
    new Map(categoryItems.map((item) => [item.name, item])).values(),
  );

  return { items: uniqueItems };
}

/**
 * Get category from registry type
 */
function getCategoryFromType(type: string): string {
  const typeMap: Record<string, string> = {
    "registry:ui": "ui",
    "registry:component": "ui",
    "registry:hook": "hooks",
    "registry:lib": "lib",
    "registry:block": "blocks",
    "registry:style": "base",
    "registry:theme": "themes",
  };

  return typeMap[type] || "other";
}
