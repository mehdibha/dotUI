import { registryItemSchema } from "shadcn/schema";
import type { RegistryItem } from "shadcn/schema";

import { registry } from "@dotui/registry";
import type { Style } from "@dotui/style-system/types";

import { updateFiles, updateRegistryDependencies } from "../transform";

export async function generateShadcnItem(
  registryItemName: string,
  options: {
    styleName: string;
    registryBasePath: string;
    baseUrl: string;
    style: Style;
  },
): Promise<RegistryItem | null> {
  const { registryBasePath, baseUrl, style } = options;

  const variant =
    registryItemName in style.variants
      ? style.variants[registryItemName as keyof typeof style.variants]
      : undefined;

  let registryItem = registry.find((item) => item.name === registryItemName);

  if (!registryItem) {
    console.log(`Registry item ${registryItemName} not found.`);
    return null;
  }

  if (variant) {
    if (!registryItem.variants) {
      console.log(`Registry item ${registryItemName} does not have variants.`);
      return null;
    }

    const { variants, ...rest } = registryItem;

    registryItem = {
      ...rest,
      ...variants[variant],
    };
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
}
