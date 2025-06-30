import type { Registry, RegistryItem } from "shadcn/registry";

import { registry } from "@dotui/registry-definition";
import type { Style } from "@dotui/style-engine/types";

export const generateRegistryItem = (
  registryItemName: string,
  style: Style,
): RegistryItem | null => {
  let name = registryItemName;
  const variant = style.variants[registryItemName];

  if (variant) {
    name = `${registryItemName}:${variant}`;
  }

  const registryItem = (registry as Registry["items"]).find(
    (item) => item.name === name,
  );

  if (!registryItem) {
    return null;
  }

  return registryItem;
};