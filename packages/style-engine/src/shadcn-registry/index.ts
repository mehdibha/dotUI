import type { RegistryItem } from "shadcn/registry";

import {
  generateBaseRegistry,
  generateRegistryItem,
  generateThemeRegistry,
} from "./generators";
import type { Style } from "../types";

export function buildItemRegistry(
  registryItemName: string,
  style: Style,
): RegistryItem | null {
  if (registryItemName === "base") {
    return generateBaseRegistry(style);
  }

  if (registryItemName === "theme") {
    return generateThemeRegistry(style);
  }

  return generateRegistryItem(registryItemName, style);
}
