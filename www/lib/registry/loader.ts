import { promises as fs } from "node:fs";
import path from "node:path";

import type { ItemJson, Manifest } from "@dotui/types/registry";

// Path to pre-built registry files (relative to project root)
const REGISTRY_DIST_PATH = path.resolve(
  process.cwd(),
  "../packages/registry-builder/dist",
);

/**
 * Load the registry manifest (index of all components)
 */
export async function loadManifest(): Promise<Manifest | null> {
  try {
    const manifestPath = path.join(REGISTRY_DIST_PATH, "index.json");
    const content = await fs.readFile(manifestPath, "utf-8");
    return JSON.parse(content) as Manifest;
  } catch {
    return null;
  }
}

/**
 * Load a specific item's pre-built JSON
 */
export async function loadItemJson(
  name: string,
  category: string = "ui",
): Promise<ItemJson | null> {
  try {
    const itemPath = path.join(REGISTRY_DIST_PATH, category, `${name}.json`);
    const content = await fs.readFile(itemPath, "utf-8");
    return JSON.parse(content) as ItemJson;
  } catch {
    return null;
  }
}

/**
 * Try to load an item from any category
 */
export async function loadItemFromAnyCategory(
  name: string,
): Promise<ItemJson | null> {
  const categories = ["ui", "hooks", "lib", "blocks", "base"];

  for (const category of categories) {
    const item = await loadItemJson(name, category);
    if (item) {
      return item;
    }
  }

  return null;
}

/**
 * Load special registry items (theme, base, all, registry)
 */
export async function loadSpecialItem(
  name: "theme" | "base" | "all" | "registry",
): Promise<unknown> {
  try {
    switch (name) {
      case "registry":
        return loadManifest();
      case "base": {
        const basePath = path.join(REGISTRY_DIST_PATH, "base", "index.json");
        const content = await fs.readFile(basePath, "utf-8");
        return JSON.parse(content);
      }
      default:
        return null;
    }
  } catch {
    return null;
  }
}
