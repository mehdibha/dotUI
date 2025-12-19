import type { RegistryItem } from "shadcn/schema";

import type { Style } from "../../types";

import { base as registryBase } from "../../__registry__/base";
import { iconLibraries } from "../../__registry__/icons";
import { updateRegistryDependencies } from "../transform";

export function generateRegistryBase(options: {
  styleName: string;
  baseUrl: string;
  style: Style;
}): RegistryItem {
  const registryItem = updateRegistryDependencies(
    structuredClone(registryBase[0]) as unknown as RegistryItem,
    options,
  );

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
