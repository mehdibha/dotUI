import type { RegistryItem } from "shadcn/schema";

import { registryUi } from "@dotui/registry-definition/registry-ui";

import { updateRegistryDependencies } from "../helpers/update-registry-deps";
import type { Style } from "../../types";

export function generateRegistryAll(options: {
  styleName: string;
  baseUrl: string;
  style: Style;
}): RegistryItem {
  const { styleName, baseUrl, style } = options;

  const registryDependencies = [
    ...new Set(registryUi.map((item) => item.name.split(":")[0])),
  ] as string[];

  let registryItem: RegistryItem = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    extends: "none",
    name: "all",
    type: "registry:ui",
    title: `All ${styleName} components`,
    description: `All components for ${styleName} style`,
    registryDependencies,
  };

  registryItem = updateRegistryDependencies(registryItem, {
    styleName,
    baseUrl,
    style,
  });

  return registryItem;
}
