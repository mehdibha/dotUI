import type { RegistryItem } from "shadcn/registry";

import { transform } from "../transformers";
import { transformImport } from "../transformers/transform-imports";
import type { Style } from "../../types";

export const updateFiles = async (
  registryItem: RegistryItem,
  options: {
    registryBasePath: string;
    baseUrl: string;
    style: Style;
  },
): Promise<void> => {
  if (!registryItem.files) {
    return;
  }

  for (const file of registryItem.files) {
    if (!file.content) {
      continue;
    }

    const transformedContent = await transform(
      {
        filename: file.path,
        raw: file.content,
        style: options.style,
      },
      [transformImport],
    );

    file.content = transformedContent;
  }
};
