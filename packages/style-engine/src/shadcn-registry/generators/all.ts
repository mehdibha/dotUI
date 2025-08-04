import type { RegistryItem } from "shadcn/registry";

import { registryUi } from "@dotui/registry-definition/registry-ui";

import { updateRegistryDependencies } from "../helpers/update-registry-deps";
import type { Style } from "../../types";

export function generateRegistryAll(options: {
  name: string;
  baseUrl: string;
  style: Style;
}): RegistryItem {
  const { name, baseUrl, style } = options;

  const registryDependencies = [
    ...new Set(registryUi.map((item) => item.name.split(":")[0])),
  ] as string[];

  let registryItem: RegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    extends: "none",
    name: "all",
    type: "registry:ui",
    title: `All ${name} components`,
    description: `All components for ${name} style`,
    registryDependencies,
  };

  registryItem = updateRegistryDependencies(registryItem, baseUrl, style);

  return registryItem;
}
