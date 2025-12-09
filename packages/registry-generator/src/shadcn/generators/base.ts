import type { RegistryItem } from "shadcn/schema";

import { registryBase } from "@dotui/registry/base/registry";
import { iconLibraries } from "@dotui/registry/icons/registry";
import type { Style } from "@dotui/style-system/types";

import { updateRegistryDependencies } from "../helpers/update-registry-deps";

export function generateRegistryBase(options: {
  styleName: string;
  baseUrl: string;
  style: Style;
}): RegistryItem {
  const registryItem = updateRegistryDependencies(registryBase[0], options);

  const iconLibrary = iconLibraries.find(
    (lib) => lib.name === options.style.icons.library,
  );

  if (!iconLibrary) {
    throw new Error(`Icon library ${options.style.icons.library} not found`);
  }

  registryItem.dependencies = [
    ...(registryItem.dependencies ?? []),
    iconLibrary.package,
  ];

  return registryItem;
}
