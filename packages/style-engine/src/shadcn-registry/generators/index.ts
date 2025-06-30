import type { RegistryItem } from "shadcn/registry";

import { generateBaseRegistry } from "./base";
import { generateRegistryItem } from "./registry-item";
import { generateThemeRegistry } from "./theme";
import type { Style } from "../../types";

export async function buildItemRegistry(
  registryItemName: string,
  options: {
    registryBasePath: string;
    baseUrl: string;
    style: Style;
  },
): Promise<RegistryItem | null> {
  if (registryItemName === "base") {
    return generateBaseRegistry(options.style);
  }

  if (registryItemName === "theme") {
    return generateThemeRegistry(options.style);
  }

  return generateRegistryItem(registryItemName, options);
}
