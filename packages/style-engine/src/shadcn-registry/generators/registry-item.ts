import * as fs from "fs/promises";
import * as path from "path";
import { registryItemSchema } from "shadcn/registry";
import type { RegistryItem } from "shadcn/registry";

import { registry } from "@dotui/registry-definition";

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

  // update name
  registryItem.name = registryItemName;

  // transform registry deps
  registryItem.registryDependencies = registryItem.registryDependencies?.map(
    (dep) => {
      return `${baseUrl}/${style.slug}/${dep}`;
    },
  );

  // update files
  if (registryItem.files) {
    for (const file of registryItem.files) {
      const content = await fs.readFile(
        path.resolve(registryBasePath, file.path),
        "utf-8",
      );
      file.content = content;
    }

    const result = registryItemSchema.safeParse(registryItem);
    if (!result.success) {
      console.error(`Invalid registry item found for ${registryItem.name}.`);
      return null;
    }
  }

  return registryItem;
};
