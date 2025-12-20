import { registryItemSchema } from "shadcn/schema";
import type { RegistryItem } from "shadcn/schema";

import type { StyleConfig } from "../../schemas/style";

import { registry } from "../../__registry__";
import { updateFiles, updateRegistryDependencies } from "../transform";

type InternalRegistryItem = (typeof registry)[number];

export async function generateShadcnItem(
  registryItemName: string,
  options: {
    styleName: string;
    registryBasePath: string;
    baseUrl: string;
    config: StyleConfig;
  },
): Promise<RegistryItem | null> {
  const { registryBasePath, baseUrl, config } = options;

  const variant =
    registryItemName in config.variants
      ? config.variants[registryItemName as keyof typeof config.variants]
      : undefined;

  const foundItem = registry.find((item) => item.name === registryItemName);

  if (!foundItem) {
    console.log(`Registry item ${registryItemName} not found.`);
    return null;
  }

  let registryItem = foundItem as InternalRegistryItem & {
    variants?: Record<string, unknown>;
  };

  if (variant) {
    if (!registryItem.variants) {
      console.log(`Registry item ${registryItemName} does not have variants.`);
      return null;
    }

    const { variants, ...rest } = registryItem;
    const variantData = variants[variant] as Record<string, unknown>;

    registryItem = {
      ...rest,
      ...variantData,
    } as typeof registryItem;
  }

  let shadcnItem = updateRegistryDependencies(
    registryItem as unknown as RegistryItem,
    options,
  );

  shadcnItem = await updateFiles(shadcnItem, {
    registryBasePath,
    baseUrl,
    config,
  });

  shadcnItem.name = registryItemName;

  const result = registryItemSchema.safeParse(shadcnItem);

  if (!result.success) {
    console.error(`Invalid registry item found for ${shadcnItem.name}.`);
    return null;
  }

  return shadcnItem;
}
