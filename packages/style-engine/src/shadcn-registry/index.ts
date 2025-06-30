import type { RegistryItem } from "shadcn/registry";

import { generateBaseRegistry } from "./generators/base";
import type { Style } from "../types";

export function buildItemRegistry(
  registryItemName: string,
  style: Style,
): RegistryItem | null {
  if (registryItemName === "base") {
    return generateBaseRegistry(style);
  }

  return null;
}
