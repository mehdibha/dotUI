import { promises as fs } from "node:fs";
import path from "node:path";
import type { RegistryItem } from "shadcn/schema";

import { registryIcons } from "@dotui/registry/icons/registry";
import {
  applyTransforms,
  type TransformContext,
  transformIcons,
  transformImports,
} from "@dotui/transformers";
import type { Style } from "@dotui/style-system/types";

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

  // Build transform context from style
  const targetIconLibrary =
    options.style.icons.library === "remix" ? "remix" : "lucide";

  const context: TransformContext = {
    iconLibrary: targetIconLibrary,
    iconMap: registryIcons as Record<string, Record<string, string>>,
  };

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

    // Apply transforms using the new lightweight string-based transformers
    const transformedContent = applyTransforms(
      file.content,
      [transformImports, transformIcons],
      context,
    );

    file.content = transformedContent;
  }

  return registryItem;
};
