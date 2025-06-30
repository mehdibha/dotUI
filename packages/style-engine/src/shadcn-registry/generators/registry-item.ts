import { registryItemSchema } from "shadcn/registry";
import type { RegistryItem } from "shadcn/registry";

import { registry } from "@dotui/registry-definition";

import { updateFiles } from "../helpers/update-files";
import { updateRegistryDependencies } from "../helpers/update-registry-deps";
import type { Style } from "../../types";

export const generateRegistryItem = async (
  registryItemName: string,
  options: {
    registryBasePath: string;
    baseUrl: string;
    style: Style;
  },
): Promise<RegistryItem | null> => {
  const { registryBasePath, baseUrl, style } = options;

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

  registryItem.name = registryItemName;

  updateRegistryDependencies(registryItem, baseUrl, style);

  await updateFiles(registryItem, registryBasePath);

  const result = registryItemSchema.safeParse(registryItem);

  if (!result.success) {
    console.error(`Invalid registry item found for ${registryItem.name}.`);
    return null;
  }

  return registryItem;
};
