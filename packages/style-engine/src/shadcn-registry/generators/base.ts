import type { RegistryItem } from "shadcn/schema";

import { base } from "@dotui/registry-definition/registry-base";
import { iconLibraries } from "@dotui/registry-definition/registry-icons";

import { updateRegistryDependencies } from "../helpers/update-registry-deps";
import type { Style } from "../../types";

export function generateRegistryBase(options: {
  styleName: string;
  baseUrl: string;
  style: Style;
}): RegistryItem {
  let registryItem = base;

  registryItem = updateRegistryDependencies(base, options);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const iconLibrary = iconLibraries.find(
    (lib) => lib.name === options.style.icons.library,
  )!;

  registryItem.dependencies = [
    ...(registryItem.dependencies ?? []),
    iconLibrary.package,
  ];

  return registryItem;
}
