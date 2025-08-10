import { promises as fs } from "fs";
import path from "path";
import type { RegistryItem } from "shadcn/registry";

import { transform } from "../transformers";
import { transformIcons } from "../transformers/transform-icons";
import { transformImport } from "../transformers/transform-imports";
import type { Style } from "../../types";

export const updateFiles = async (
  registryItem: RegistryItem,
  options: {
    registryBasePath: string;
    baseUrl: string;
    style: Style;
  },
): Promise<RegistryItem> => {
  if (!registryItem.files) {
    return registryItem;
  }

  for (const file of registryItem.files) {
    // Load file content from filesystem if not already present
    if (!file.content && file.path) {
      try {
        const filePath = path.join(options.registryBasePath, file.path);
        const content = await fs.readFile(filePath, "utf-8");
        file.content = content;

        file.path = file.path.replace(options.registryBasePath, "");

        const hasVariant = !!registryItem.name.split(":")[1];
        if (hasVariant) {
          const pathRegex = /^components\/([^/]+)\/([^/]+)\.tsx?$/;
          const pathMatch = pathRegex.exec(file.path);
          if (pathMatch) {
            file.path = `components/${pathMatch[1]}.${file.path.split(".").pop()}`;
          }
        }
      } catch (error) {
        console.error(`Failed to read file ${file.path}:`, error);
        continue;
      }
    }

    if (!file.content) {
      continue;
    }

    const transformedContent = await transform(
      {
        filename: `${options.registryBasePath}/${file.path}`,
        raw: file.content,
        style: options.style,
      },
      [transformImport, transformIcons],
    );

    file.content = transformedContent;
  }

  return registryItem;
};
