import type { RegistryItem } from "shadcn/schema";

import { base } from "@dotui/registry/base/registry";
import { iconLibraries } from "@dotui/registry/icons/registry";

import { updateRegistryDependencies } from "../helpers/update-registry-deps";
import type { Style } from "../../types";

export function generateRegistryBase(options: {
  styleName: string;
  baseUrl: string;
  style: Style;
}): RegistryItem {
  let registryItem = base;

  registryItem = updateRegistryDependencies(base, options);

  const iconLibrary = iconLibraries.find(
    (lib) => lib.name === options.style.icons.library,
  )!;

  registryItem.dependencies = [
    ...(registryItem.dependencies ?? []),
    iconLibrary.package,
  ];

  return registryItem;
}
