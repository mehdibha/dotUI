import type { Registry } from "shadcn/schema";

import { generateRegistryAll } from "./all";
import { generateRegistryBase } from "./base";
import { generateRegistryTheme } from "./theme";
import type { Style } from "../../types";

export function generateRegistry(options: {
  styleName: string;
  baseUrl: string;
  style: Style;
}): Registry {
  return {
    name: "dotui",
    homepage: "https://dotui.org/",
    items: [
      generateRegistryBase(options),
      generateRegistryTheme(options),
      generateRegistryAll(options),
    ],
  };
}
