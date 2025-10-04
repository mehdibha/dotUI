import type { RegistryItem } from "shadcn/schema";

import { registryBase } from "@dotui/registry/base/registry";
import { iconLibraries } from "@dotui/registry/icons/registry";

import { updateRegistryDependencies } from "../helpers/update-registry-deps";
import type { Style } from "../../types";

export function generateRegistryBase(options: {
  styleName: string;
  baseUrl: string;
  style: Style;
}): RegistryItem {
  const registryItem = updateRegistryDependencies(registryBase[0], options);

  const iconLibrary = iconLibraries.find(
    (lib) => lib.name === options.style.icons.library,
  )!;

  registryItem.dependencies = [
    ...(registryItem.dependencies ?? []),
    iconLibrary.package,
  ];

  return registryItem;
}
