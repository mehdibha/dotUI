import type { RegistryItem } from "shadcn/schema";

import type { StyleConfig } from "@dotui/core/schemas/style";

import { base as registryBase } from "@dotui/core/__registry__/base";
import { iconLibraries } from "@dotui/core/__registry__/icons";
import { updateRegistryDependencies } from "@dotui/core/shadcn/transform";

export function generateRegistryBase(options: {
  styleName: string;
  baseUrl: string;
  config: StyleConfig;
}): RegistryItem {
  const registryItem = updateRegistryDependencies(
    structuredClone(registryBase[0]) as unknown as RegistryItem,
    options,
  );

  const iconLibrary = iconLibraries.find(
    (lib) => lib.name === options.config.icons.library,
  );

  if (!iconLibrary) {
    throw new Error(`Icon library ${options.config.icons.library} not found`);
  }

  registryItem.dependencies = [
    ...(registryItem.dependencies ?? []),
    iconLibrary.package,
  ];

  return registryItem;
}
