import type { RegistryItem } from "shadcn/registry";

import { generateRegistryAll } from "./generators/all";
import { generateRegistryBase } from "./generators/base";
import { generateGenericRegistryItem } from "./generators/generic";
import { generateRegistryTheme } from "./generators/theme";
import type { Style } from "../types-v2";

export async function buildRegistryItem(
  registryItemName: string,
  options: {
    registryBasePath: string;
    baseUrl: string;
    style: Style;
  },
): Promise<RegistryItem | null> {
  if (registryItemName === "base") {
    return generateRegistryBase(options);
  }

  if (registryItemName === "theme") {
    return generateRegistryTheme(options);
  }

  if (registryItemName === "all") {
    return generateRegistryAll(options);
  }

  return generateGenericRegistryItem(registryItemName, options);
}
