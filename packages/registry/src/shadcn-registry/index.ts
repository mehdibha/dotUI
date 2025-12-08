import type { Registry, RegistryItem } from "shadcn/schema";

import type { ColorFormat, Style } from "@dotui/style-system";

import { generateRegistryAll } from "./generators/all";
import { generateRegistryBase } from "./generators/base";
import { generateGenericRegistryItem } from "./generators/generic";
import { generateRegistry } from "./generators/registry";
import { generateRegistryTheme } from "./generators/theme";

export async function buildRegistryItem(
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

  return generateGenericRegistryItem(registryItemName, options);
}
