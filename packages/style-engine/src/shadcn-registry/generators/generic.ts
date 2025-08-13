import { registryItemSchema } from "shadcn/registry";
import type { RegistryItem } from "shadcn/registry";

import { registry } from "../../../../registry-definition/dist";
import { updateFiles } from "../helpers/update-files";
import { updateRegistryDependencies } from "../helpers/update-registry-deps";
import type { Style } from "../../types";

export const generateGenericRegistryItem = async (
  registryItemName: string,
  options: {
    styleName: string;
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

  let registryItem = registry.find((item) => item.name === name);

  if (!registryItem) {
    console.log(`Registry item ${name} not found.`);
    return null;
  }

  registryItem = updateRegistryDependencies(registryItem, options);

  registryItem = await updateFiles(registryItem, {
    registryBasePath,
    baseUrl,
    style,
  });

  registryItem.name = registryItemName;

  const result = registryItemSchema.safeParse(registryItem);

  if (!result.success) {
    console.error(`Invalid registry item found for ${registryItem.name}.`);
    return null;
  }

  return registryItem;
};
