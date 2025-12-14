import type { Registry } from "shadcn/schema";

import { registryUi } from "@dotui/registry/ui/registry";
import type { Style, Variants } from "@dotui/style-system/types";

import { updateRegistryDependencies } from "../transform";
import { generateRegistryAll } from "./all";
import { generateRegistryBase } from "./base";
import { generateRegistryTheme } from "./theme";

export function generateRegistry(options: {
  styleName: string;
  baseUrl: string;
  style: Style;
}): Registry {
  const components = registryUi
    .filter((item) => {
      const [name, variant] = item.name.split(":") as [string, string];
      return options.style.variants[name as keyof Variants] === variant;
    })
    .map((item) => {
      const [name] = item.name.split(":") as [string, string];
      return updateRegistryDependencies({ ...item, name }, options);
    });

  return {
    name: "dotui",
    homepage: "https://dotui.org",
    items: [
      generateRegistryBase(options),
      generateRegistryTheme(options),
      ...components,
      generateRegistryAll(options),
    ],
  };
}
