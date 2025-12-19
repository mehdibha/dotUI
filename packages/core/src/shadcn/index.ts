import type { Registry, RegistryItem } from "shadcn/schema";

import type { ColorFormat, Style } from "@dotui/style-system/types";

import { generateRegistryAll } from "./generators/all";
import { generateRegistryBase } from "./generators/base";
import { generateShadcnItem } from "./generators/item";
import { generateRegistry } from "./generators/registry";
import { generateRegistryTheme } from "./generators/theme";

export {
  generateRegistry,
  generateRegistryAll,
  generateRegistryBase,
  generateRegistryTheme,
  generateShadcnItem,
} from "./generators";
export {
  generateThemeJson,
  transformItemJson,
  updateFiles,
  updateRegistryDependencies,
} from "./transform";
export type { TransformOptions } from "./transform";
export {
  applyTransforms,
  applyTransformsWithTracking,
  createIconTransform,
  createImportTransform,
  transformIcons,
  transformImports,
} from "./transforms";
export type {
  Transform,
  TransformContext,
  TransformResult,
} from "./transforms";

/**
 * Build a shadcn-compatible registry item
 */
export async function buildShadcnItem(
  registryItemName: string,
  options: {
    styleName: string;
    registryBasePath: string;
    baseUrl: string;
    style: Style;
    colorFormat?: ColorFormat;
  },
): Promise<Registry | RegistryItem | null> {
  if (registryItemName === "registry") {
    return generateRegistry(options);
  }

  if (registryItemName === "base") {
    return generateRegistryBase(options);
  }

  if (registryItemName === "theme") {
    return generateRegistryTheme(options);
  }

  if (registryItemName === "all") {
    return generateRegistryAll(options);
  }

  return generateShadcnItem(registryItemName, options);
}
