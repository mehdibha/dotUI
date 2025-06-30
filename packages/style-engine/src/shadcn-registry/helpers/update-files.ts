import fs from "node:fs/promises";
import path from "node:path";
import type { RegistryItem } from "shadcn/registry";

export const updateFiles = async (
  registryItem: RegistryItem,
  registryBasePath: string,
): Promise<void> => {
  if (!registryItem.files) {
    return;
  }

  for (const file of registryItem.files) {
    const content = await fs.readFile(
      path.resolve(registryBasePath, file.path),
      "utf-8",
    );
    file.content = content;
  }
};
