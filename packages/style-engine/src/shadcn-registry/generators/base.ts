import type { RegistryItem } from "shadcn/registry";

import { base } from "@dotui/registry-definition/registry-base";

import { updateRegistryDependencies } from "../helpers/update-registry-deps";
import type { Style } from "../../types";

export function generateRegistryBase(options: {
  baseUrl: string;
  style: Style;
}): RegistryItem {
  const { baseUrl, style } = options;

  const registryItem = updateRegistryDependencies(base, baseUrl, style);

  console.log(registryItem);

  return registryItem;
}
