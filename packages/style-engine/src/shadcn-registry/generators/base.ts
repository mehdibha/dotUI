import type { RegistryItem } from "shadcn/registry";

import { base } from "@dotui/registry-definition/registry-base";
import { iconLibraries } from "@dotui/registry-definition/registry-icons";

import { updateRegistryDependencies } from "../helpers/update-registry-deps";
import type { Style } from "../../types-v2";

export function generateRegistryBase(options: {
  baseUrl: string;
  style: Style;
}): RegistryItem {
  const { baseUrl, style } = options;

  let registryItem = base;

  // Update registry dependencies
  registryItem = updateRegistryDependencies(base, baseUrl, style);

  // Add icon library to dependencies
  const iconLibrary =
    style.iconLibrary in iconLibraries
      ? iconLibraries[style.iconLibrary as keyof typeof iconLibraries]
      : iconLibraries.lucide;
  registryItem.dependencies = [
    ...(registryItem.dependencies ?? []),
    iconLibrary.package,
  ];

  return registryItem;
}
