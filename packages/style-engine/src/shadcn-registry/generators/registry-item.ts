import type { RegistryItem } from "shadcn/registry";

import { registry } from "@dotui/registry-definition";

import type { Style } from "../../types";

export const generateRegistryItem = (
  registryItemName: string,
  style: Style,
): RegistryItem | null => {
  let name = registryItemName;
  const variant =
    registryItemName in style.variants
      ? style.variants[registryItemName as keyof typeof style.variants]
      : undefined;

  if (variant) {
    name = `${registryItemName}:${variant}`;
  }

  const registryItem = registry.find((item) => item.name === name);

  if (!registryItem) {
    return null;
  }

  return registryItem;
};
